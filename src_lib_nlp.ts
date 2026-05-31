/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FAQ {
  id: string;
  category: string;
  questionEn: string;
  questionTe: string;
  answerEn: string;
  answerTe: string;
  keywords: string[];
  count: number;
}

// Stopwords lists for cleaner similarity calculations
const ENGLISH_STOPWORDS = new Set([
  "is", "the", "a", "an", "for", "to", "in", "on", "at", "it", "of", "and", "or", 
  "what", "how", "tell", "me", "are", "about", "much", "does", "costs", "do", "any", 
  "were", "when", "where", "which", "there", "has", "have", "you", "my", "your", 
  "with", "can", "be", "is", "there", "any", "some", "please", "detail", "details",
  "structure", "policy", "rule", "rules", "schedule", "schedules"
]);

const TELUGU_STOPWORDS = new Set([
  "ఉంది", "ఉన్నాయి", "యొక్క", "మరియు", "లేదా", "కూడా", "కానీ", "ఏమిటి", "ఎంత", 
  "ఎలా", "ఎప్పుడు", "ఎక్కడ", "ఏ", "ఈ", "ఆ", "ఒక", "గురించి", "ద్వారా", "వద్ద", 
  "లో", "నుండి", "తో", "ను", "కు", "ని", "గూర్చి", "గారు"
]);

/**
 * Detects if a string contains Telugu scripts
 */
export function isTelugu(text: string): boolean {
  // Telugu Unicode range is \u0c00 to \u0c7f
  return /[\u0c00-\u0c7f]/.test(text);
}

/**
 * Clean, tokenize, and filter stopwords from text
 */
export function preprocessText(text: string, isTel: boolean): string[] {
  // Convert to lowercase (useful for English, harmless for Telugu)
  let cleaned = text.toLowerCase();
  
  // Replace punctuation and special characters with spaces
  cleaned = cleaned.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, " ");
  
  // Tokenize by whitespace
  const tokens = cleaned.split(/\s+/).filter(t => t.trim().length > 0);
  
  // Filter stopwords & extremely short tokens (except numerical bounds)
  const stopwords = isTel ? TELUGU_STOPWORDS : ENGLISH_STOPWORDS;
  return tokens.filter(t => !stopwords.has(t) || !isNaN(Number(t)));
}

/**
 * Calculate Term Frequency (TF) for a set of tokens
 */
function getTermFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  if (tokens.length === 0) return tf;
  
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  
  // Obtain normalized TF (frequency / total tokens)
  for (const [word, val] of tf.entries()) {
    tf.set(word, val / tokens.length);
  }
  
  return tf;
}

export interface MatchResult {
  faq: FAQ | null;
  score: number;
  understood: boolean;
  suggestions: { faq: FAQ; score: number }[];
}

/**
 * Performs custom TF-IDF Vectorization & Cosine Similarity matching
 */
export function findBestMatch(userQuery: string, faqs: FAQ[]): MatchResult {
  if (!userQuery || userQuery.trim().length === 0 || faqs.length === 0) {
    return { faq: null, score: 0, understood: false, suggestions: [] };
  }

  const isTelQuery = isTelugu(userQuery);
  const queryTokens = preprocessText(userQuery, isTelQuery);

  if (queryTokens.length === 0) {
    return { faq: null, score: 0, understood: false, suggestions: [] };
  }

  // Define corpora based on query language
  // We represent each FAQ as a token array of its question + keywords
  const documents: { faq: FAQ; tokens: string[] }[] = faqs.map(faq => {
    const questionText = isTelQuery ? faq.questionTe : faq.questionEn;
    const qTokens = preprocessText(questionText, isTelQuery);
    
    // Process keyword tags in the respective language or generally
    const kTokens: string[] = [];
    faq.keywords.forEach(kw => {
      kTokens.push(...preprocessText(kw, isTelQuery));
    });
    
    return {
      faq,
      tokens: [...qTokens, ...kTokens, ...qTokens] // duplicate questions/roots to give them greater importance (boosting)
    };
  });

  // Calculate IDF across all documents in corpus
  const totalDocs = documents.length;
  const wordDocCounts = new Map<string, number>();
  
  for (const doc of documents) {
    const uniqueWords = new Set(doc.tokens);
    for (const word of uniqueWords) {
      wordDocCounts.set(word, (wordDocCounts.get(word) || 0) + 1);
    }
  }

  const idf = new Map<string, number>();
  for (const [word, count] of wordDocCounts.entries()) {
    idf.set(word, Math.log(1 + totalDocs / (1 + count)));
  }

  // Vector helper: Calculates Euclidean norm (magnitude) & Dot Product
  // We compute similarity ratios on the fly to save space & run sub-millisecond
  const queryTF = getTermFrequency(queryTokens);
  
  // Query vectors are weighted by IDF
  const queryVector = new Map<string, number>();
  let queryNormSq = 0;
  for (const [word, tfVal] of queryTF.entries()) {
    const idfVal = idf.get(word) || Math.log(1 + totalDocs); // default IDF estimate for rare words
    const weight = tfVal * idfVal;
    queryVector.set(word, weight);
    queryNormSq += weight * weight;
  }
  const queryNorm = Math.sqrt(queryNormSq);

  if (queryNorm === 0) {
    return { faq: null, score: 0, understood: false, suggestions: [] };
  }

  const matchScores: { faq: FAQ; score: number }[] = [];

  for (const doc of documents) {
    const docTF = getTermFrequency(doc.tokens);
    const docVector = new Map<string, number>();
    let docNormSq = 0;

    // Project document words into vector
    for (const [word, tfVal] of docTF.entries()) {
      const idfVal = idf.get(word) || 0;
      const weight = tfVal * idfVal;
      docVector.set(word, weight);
      docNormSq += weight * weight;
    }
    const docNorm = Math.sqrt(docNormSq);

    if (docNorm === 0) {
      matchScores.push({ faq: doc.faq, score: 0 });
      continue;
    }

    // Dot product of query and document
    let dotProduct = 0;
    for (const [word, qWeight] of queryVector.entries()) {
      const docWeight = docVector.get(word) || 0;
      dotProduct += qWeight * docWeight;
    }

    // Cosine similarity
    let cosineSim = dotProduct / (queryNorm * docNorm);

    // Apply manual Keyword Matcher Boost:
    // If the query overlaps directly with some specified keywords of the FAQ, boot similarity score slightly
    let keywordOverlapCount = 0;
    for (const kw of doc.faq.keywords) {
      if (preprocessText(kw, isTelQuery).some(kToken => queryTokens.includes(kToken))) {
        keywordOverlapCount++;
      }
    }
    if (keywordOverlapCount > 0) {
      // Small proportional boost up to +0.15 max
      cosineSim = Math.min(1.0, cosineSim + (keywordOverlapCount * 0.05));
    }

    matchScores.push({ faq: doc.faq, score: parseFloat(cosineSim.toFixed(4)) });
  }

  // Sort by similarity score descending
  matchScores.sort((a, b) => b.score - a.score);

  const bestMatch = matchScores[0];
  const threshold = 0.22; // Strict boundary to classify as "understood" vs "unknown" request

  const understood = bestMatch && bestMatch.score >= threshold;

  // Compile top 3 suggested alternative questions (excluding the matched one if matched)
  const suggestionsList = matchScores
    .filter((ms, index) => {
      if (understood) {
        return index !== 0 && ms.score > 0.02; // other potential candidates
      }
      return ms.score > 0.02; // any candidates for clarification
    })
    .slice(0, 3)
    .map(ms => ({ faq: ms.faq, score: ms.score }));

  return {
    faq: understood ? bestMatch.faq : null,
    score: bestMatch ? bestMatch.score : 0,
    understood,
    suggestions: suggestionsList
  };
}

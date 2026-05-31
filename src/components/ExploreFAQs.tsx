/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Briefcase, 
  GraduationCap, 
  Home, 
  DollarSign, 
  BookOpen, 
  Calendar,
  Send, 
  ChevronRight, 
  Trash2
} from "lucide-react";
import departmentsData from "../data/departments.json";

interface FAQItem {
  id: string;
  category: string;
  questionEn: string;
  questionTe: string;
  answerEn: string;
  answerTe: string;
  keywords: string[];
  stepsEn?: string;
  stepsTe?: string;
  documentsEn?: string;
  documentsTe?: string;
  deadlineEn?: string;
  deadlineTe?: string;
  feesEn?: string;
  feesTe?: string;
  eligibilityEn?: string;
  eligibilityTe?: string;
  count: number;
}

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  matchedFaq?: FAQItem;
}

interface ExploreFAQsProps {
  faqs?: any[];
  language: "en" | "te" | "auto";
  onSelectFAQForChat: (question: string) => void;
  selectedCategoryFromHome?: string;
  setSelectedCategoryFromHome?: (cat: string) => void;
  pendingQuery?: { text: string; department: string } | null;
  clearPendingQuery?: () => void;
}

// Stop words filter to improve matching accuracy
const STOP_WORDS = new Set([
  "what", "is", "the", "of", "in", "to", "and", "a", "an", "for", "on", "with", "how", "can", "i", "do", "you", "about",
  "are", "available", "there", "any", "from", "my", "your", "by", "under", "where", "when", "which",
  "అది", "మరియు", "యొక్క", "లో", "కు", "కోసం", "ఎలా", "ఏమిటి", "నేను", "మీరు", "దాదాపు", "కలిగి"
]);

// TF-IDF + Cosine Similarity Local Search Engine
class TfIdfSearchEngine {
  private corpus: { id: string; tokens: string[]; doc: FAQItem }[] = [];
  private vocab: string[] = [];
  private idfs: { [token: string]: number } = {};
  private docVectors: { [id: string]: number[] } = {};

  constructor(documents: FAQItem[]) {
    this.corpus = documents.map(doc => {
      const textEn = [
        doc.questionEn,
        doc.answerEn,
        doc.keywords ? doc.keywords.join(" ") : "",
        doc.stepsEn || "",
        doc.documentsEn || "",
        doc.deadlineEn || "",
        doc.feesEn || "",
        doc.eligibilityEn || ""
      ].join(" ").toLowerCase();

      const textTe = [
        doc.questionTe,
        doc.answerTe,
        doc.keywords ? doc.keywords.join(" ") : "",
        doc.stepsTe || "",
        doc.documentsTe || "",
        doc.deadlineTe || "",
        doc.feesTe || "",
        doc.eligibilityTe || ""
      ].join(" ").toLowerCase();

      const combinedText = textEn + " " + textTe;
      const tokens = this.tokenize(combinedText);

      return { id: doc.id, tokens, doc };
    });

    const documentCount = this.corpus.length || 1;
    const termDocCounts: { [token: string]: number } = {};

    this.corpus.forEach(({ tokens }) => {
      const uniqueTokens = new Set(tokens);
      uniqueTokens.forEach(token => {
        termDocCounts[token] = (termDocCounts[token] || 0) + 1;
      });
    });

    this.vocab = Object.keys(termDocCounts);
    this.vocab.forEach(token => {
      this.idfs[token] = Math.log(1 + (documentCount / (termDocCounts[token] || 1)));
    });

    this.corpus.forEach(({ id, tokens }) => {
      this.docVectors[id] = this.vectorize(tokens);
    });
  }

  private tokenize(text: string): string[] {
    const rawTokens = text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'?]/g, " ")
      .split(/\s+/)
      .map(t => t.trim())
      .filter(t => t.length > 1);

    const filtered = rawTokens.filter(t => !STOP_WORDS.has(t));
    return filtered.length > 0 ? filtered : rawTokens;
  }

  private vectorize(tokens: string[]): number[] {
    const tfs: { [token: string]: number } = {};
    tokens.forEach(t => {
      tfs[t] = (tfs[t] || 0) + 1;
    });

    const totalTokens = tokens.length || 1;
    return this.vocab.map(term => {
      const tfVal = (tfs[term] || 0) / totalTokens;
      const idfVal = this.idfs[term] || 0;
      return tfVal * idfVal;
    });
  }

  public search(queryText: string): { doc: FAQItem; score: number }[] {
    const queryTokens = this.tokenize(queryText);
    if (queryTokens.length === 0) return [];

    const queryVec = this.vectorize(queryTokens);
    const queryNorm = Math.sqrt(queryVec.reduce((sum, val) => sum + val * val, 0));

    if (queryNorm === 0) {
      return this.corpus.map(({ id, doc }) => {
        let matchesCount = 0;
        const qKeywords = (doc.keywords || []).map(k => k.toLowerCase());
        queryTokens.forEach(t => {
          if (qKeywords.some(kw => kw.includes(t)) || doc.questionEn.toLowerCase().includes(t) || doc.questionTe.toLowerCase().includes(t)) {
            matchesCount++;
          }
        });
        return { doc, score: matchesCount > 0 ? 0.01 + matchesCount * 0.2 : 0 };
      }).filter(res => res.score > 0).sort((a, b) => b.score - a.score);
    }

    const results = this.corpus.map(({ id, doc, tokens }) => {
      const docVec = this.docVectors[id];
      const docNorm = Math.sqrt(docVec.reduce((sum, val) => sum + val * val, 0));

      let cosineSim = 0;
      if (docNorm > 0) {
        let dotProduct = 0;
        for (let i = 0; i < this.vocab.length; i++) {
          dotProduct += queryVec[i] * docVec[i];
        }
        cosineSim = dotProduct / (queryNorm * docNorm);
      }

      let keywordScore = 0;
      const docKeywords = (doc.keywords || []).map(k => k.toLowerCase());
      
      queryTokens.forEach(token => {
        if (docKeywords.includes(token)) {
          keywordScore += 4.5;
        } else if (docKeywords.some(kw => kw.includes(token) || token.includes(kw))) {
          keywordScore += 1.8;
        }

        if (doc.questionEn.toLowerCase().includes(token) || doc.questionTe.toLowerCase().includes(token)) {
          keywordScore += 1.0;
        }
      });

      const finalScore = (cosineSim * 10) + keywordScore;
      return { doc, score: finalScore };
    });

    return results
      .filter(r => r.score > 0.15)
      .sort((a, b) => b.score - a.score);
  }
}

// Map home categories to our 6 core specialist departments
const mapHomeCategoryToSpecialist = (cat: string): string => {
  if (!cat) return "Placements";
  const normalized = cat.trim().toLowerCase();
  if (normalized === "all" || normalized === "catalog") return "All";
  if (normalized.includes("admission")) return "Admissions";
  if (normalized.includes("academic") || normalized.includes("course") || normalized.includes("education")) return "Academics";
  if (normalized.includes("exam") || normalized.includes("test") || normalized.includes("evaluation") || normalized.includes("revaluation") || normalized.includes("paper") || normalized.includes("hall ticket") || normalized.includes("ticket")) return "Examinations";
  if (normalized.includes("fee") || normalized.includes("scholarship") || normalized.includes("money") || normalized.includes("payment")) return "Fees";
  if (normalized.includes("hostel") || normalized.includes("facility") || normalized.includes("dining") || normalized.includes("board")) return "Hostel";
  if (normalized.includes("placement") || normalized.includes("recruit") || normalized.includes("intern")) return "Placements";
  return "Placements";
};

// Friendly and knowledgeable college officer introductory messages
const WELCOME_MESSAGES: Record<string, { en: string; te: string }> = {
  Admissions: {
    en: "Hello! I am CampusConnect AI. How can I help you and your family with B.Tech entrance, Category-A/B seats, management guidelines, or reporting documents today?",
    te: "నమస్కారం! నేను క్యాంపస్‌కనెక్ట్ AI. కౌన్సెలింగ్, కేటగిరీ సీట్లు, ఫీజులు లేదా సర్టిఫికెట్ల వివరాల కొరకు నేను మీకు ఈ రోజు ఎలా సహాయపడగలను?"
  },
  Examinations: {
    en: "Hello! I am CampusConnect AI. If you have any questions about semester end timetables, CGPA evaluations, grading thresholds, or how to apply for transcripts and revaluations, feel free to ask.",
    te: "నమస్కారం! నేను క్యాంపస్‌కనెక్ట్ AI. ఎగ్జామ్స్ టైమ్‌టేబుల్స్, గ్రేడింగ్ లేదా రీవాల్యుయేషన్ కోసం అప్లై చేయు విధానం గురించి అడగండి."
  },
  Hostel: {
    en: "Hello! I am CampusConnect AI. Let me know if you need any info on hostel allocations, mess timings, rules, or room clearance procedures.",
    te: "నమస్కారం! నేను క్యాంపస్‌కనెక్ట్ AI. రూమ్ ఎలాట్‌మెంట్స్, జేబీ మెస్ హాస్టల్ నియమ నిబంధనల సమాచారం కొరకు నన్ను అడగండి."
  },
  Fees: {
    en: "Hello! I am CampusConnect AI. I can answer any questions about tuition fee deadlines, installment models, bank challans, or JVD scholarship reimbursement eligibility.",
    te: "నమస్కారం! నేను క్యాంపస్‌కనెక్ట్ AI. కాలేజీ ఫీజులు, జేవీడీ స్కాలర్‌షిప్ గడువులు మరియు చెల్లింపుల పద్ధతుల గురించి అడగండి."
  },
  Academics: {
    en: "Hello! I am CampusConnect AI. How can I help you today regarding core courses, attendance threshold condonations, or library registrations?",
    te: "నమస్కారం! నేను క్యాంపస్‌కనెక్ట్ AI. హాజరు శాతం (కనీసం 75%), కండోనేషన్ నియమాలు లేదా సిలబస్ వివరాల గురించి సమాచారం తెలుసుకోండి."
  },
  Placements: {
    en: "Hello! I am CampusConnect AI. Ask me anything regarding campus placement registrations, recruiter drive protocols, mock tests, or previous package CTCs.",
    te: "నమస్కారం! నేను క్యాంపస్‌కనెక్ట్ AI. కంపెనీ ఇంటర్వ్యూ డ్రైవ్స్ మరియు గత క్యాంపస్ ప్లేస్‌మెంట్‌ల ప్యాకేజీల వివరాల కోసం అడగండి."
  }
};

// Preset suggested questions mapped against local JSON categories
const SUGGESTED_QUESTIONS: Record<string, { en: string[]; te: string[] }> = {
  Admissions: {
    en: [
      "What is the minimum intermediate percentage required for B.Tech admission?",
      "What is the difference between Category-A and Category-B seats?",
      "Are lateral entry B.Tech admissions available?",
      "What documents must be submitted during physical admission reporting?"
    ],
    te: [
      "బీటెక్ ప్రవేశానికి కావలసిన కనీస ఇంటర్మీడియట్ మార్కుల శాతం ఎంత?",
      "కేటగిరీ-A మరియు కేటగిరీ-B సీట్ల మధ్య తేడా ఏమిటి?",
      "లేటరల్ ఎంట్రీ (నేరుగా రెండవ సంవత్సరం) బీటెక్ దరఖాస్తులు అందుబాటులో ఉన్నాయా?",
      "కాలేజీ అడ్మిషన్ ధృవీకరణ సమయంలో ఏ ఏ సర్టిఫికెట్లు సమర్పించాలి?"
    ]
  },
  Examinations: {
    en: [
      "How can I download my hall ticket?",
      "Can I apply for revaluation?",
      "How is SGPA and CGPA calculated?",
      "How do I apply for official transcripts?"
    ],
    te: [
      "నా సెమిస్టర్ పరీక్ష హాల్ టికెట్ ఎలా డౌన్‌లోడ్ చేసుకోవాలి?",
      "నేనేలా రీవాల్యుయేషన్ కోసం అప్లై చేసుకోవాలి?",
      "ఎస్జిపిఎ (SGPA) మరియు సిజిపిఎ (CGPA) గ్రేడ్ పాయింట్లు ఎలా లెక్కించబడతాయి?",
      "కాలేజీ నుండి అఫీషియల్ ట్రాన్స్క్రిప్ట్స్ మరియు సర్టిఫికెట్లు ఎలా పొందాలి?"
    ]
  },
  Hostel: {
    en: [
      "What is the hostel fee?",
      "What are the rules for outing and gates?",
      "What is the daily dining schedule?",
      "Is high-speed Wi-Fi internet available in the hostel?"
    ],
    te: [
      "హాస్టల్ ఫీజు మరియు కాషన్ డిపాజిట్ వివరాలు ఏమిటి?",
      "హాస్టల్ అవుటింగ్స్ మరియు వీకెండ్ అనుమతులు పొండె విధానం ఏమిటి?",
      "రుచికరమైన మెస్ భోజన సమయాల వివరాల పట్టిక ఏమిటి?",
      "హాస్టల్ గదులలో ఉచిత హైస్పీడ్ వైఫై మరియు పవర్ రూల్స్ ఏమిటి?"
    ]
  },
  Fees: {
    en: [
      "What are the tuition fee payment installment rules?",
      "How do I apply for scholarship renewal?",
      "Is there a fine for late fee payment?",
      "How can I obtain a fee clearance certificate?"
    ],
    te: [
      "ట్యూషన్ ఫీజును విడతల వారీగా చెల్లించే నియమావళి ఏమిటి?",
      "జేవీడీ స్కాలర్‌షిప్స్ బడ్జెట్ మరియు అర్హతల పునరుద్ధరణ ఎలా చేయాలి?",
      "చివరి తేదీ దాటితే ఆలస్య రుసుము (ఫైన్) చెల్లింపు నియమ నిబంధనలు ఏమిటి?",
      "ఫీజు చెల్లింపుల పూర్తి క్లియరెన్స్ పత్రం ఎలా పొందాలి?"
    ]
  },
  Academics: {
    en: [
      "What is the minimum attendance required to write exams?",
      "How can I check my attendance percentage?",
      "How do I issue a library card?",
      "Can I change my elective course?"
    ],
    te: [
      "పరీక్షలు రాయడానికి అవసరమైన కనీస హాజరు (Attendance) ఎంత?",
      "తక్కువ హాజరు ఉన్నవారికి కండోనేషన్ నియమావళి ఎలా ఉంటుంది?",
      "సెంట్రల్ లైబ్రరీ నుండి పుస్తకాలు తీసుకోవడానికి లైబ్రరీ కార్డ్స్ ఎలా పొందాలి?",
      "ఎలక్టివ్ కోర్సు సబ్జెక్టు ఎంపిక ఎలా మార్చుకోవాలి?"
    ]
  },
  Placements: {
    en: [
      "What is the placement training schedule?",
      "What is the average packages offered to students?",
      "How can I register with the Placement Cell?",
      "What documents and resumes are needed for drives?"
    ],
    te: [
      "క్యాంపస్ ప్లేస్‌మెంట్‌ల కొరకు శిక్షణా తరగతులు (Placement Training) ఎప్పుడు జరుగుతాయి?",
      "కళాశాలలో గత సంవత్సరం సాధించిన అత్యున్నత మరియు సగటు శాలరీ ప్యాకేజీలు ఎంత?",
      "ట్రైనింగ్ & ప్లేస్‌మెంట్ సెల్‌లో రిజిస్ట్రేషన్ ప్రాసెస్స్ ఎలా పూర్తి చేయాలి?",
      "కంపెనీ ఇంటర్వ్యూ డ్రైవ్స్‌కు హాజరయ్యేటప్పుడు ఏ పత్రాలు ఉపయోగించాలి?"
    ]
  }
};

const LABELS = {
  en: {
    clearIcon: "Clear Chat",
    placeholder: "Ask a question about this desk...",
    send: "Send",
    typing: "CampusConnect AI is writing...",
    noFaqText: "Sorry, this information is currently unavailable in the college knowledge base.",
    deptLabel: "Department Desks"
  },
  te: {
    clearIcon: "చాట్ క్లియర్ చేయండి",
    placeholder: "ఈ భాగానికి సంబంధించిన ప్రశ్న అడగండి...",
    send: "పంపండి",
    typing: "CampusConnect AI సమాధానం రాస్తున్నారు...",
    noFaqText: "Sorry, this information is currently unavailable in the college knowledge base.",
    deptLabel: "విభాగాల డెస్క్‌లు"
  }
};

/**
 * Splits dynamic lists from JSON keys into beautifully styled lines with bullet points
 */
function parseItemsToBullets(text: string): string[] {
  if (!text) return [];
  
  // If text is already delimited by comma or has no newlines
  if (!text.includes("\n") && !text.includes(";") && text.includes(",")) {
    const parts = text.split(",");
    if (parts.every(p => p.trim().length < 60)) {
      return parts.map(p => p.trim()).filter(p => p.length > 0);
    }
  }

  const cleanText = text
    .replace(/;/g, "\n")
    .replace(/\/\//g, "\n")
    .replace(/→/g, "\n");
  
  const rawLines = cleanText.split("\n");
  const items: string[] = [];

  rawLines.forEach(line => {
    let t = line.trim();
    if (!t) return;
    
    t = t.replace(/^\d+[\.\)]\s*/, "")  // matches "1." or "1)"
         .replace(/^[•\-\*\s]+/, "")     // matches existing bullets
         .trim();

    if (t) {
      items.push(t);
    }
  });

  return items;
}

/**
 * Standard ChatGPT plain text parser to output exact required headers
 */
function formatAnswer(matched: FAQItem, isTe: boolean): string {
  const isEnglish = !isTe;

  const answer = isEnglish ? matched.answerEn : matched.answerTe;
  const steps = isEnglish ? matched.stepsEn : matched.stepsTe;
  const documents = isEnglish ? matched.documentsEn : matched.documentsTe;
  const fees = isEnglish ? matched.feesEn : matched.feesTe;
  const eligibility = isEnglish ? matched.eligibilityEn : matched.eligibilityTe;
  const deadline = isEnglish ? matched.deadlineEn : matched.deadlineTe;

  let formatted = "";

  // 1. Plain Conversational Answer Section
  if (answer && answer.trim()) {
    formatted += `${answer.trim()}\n\n`;
  }

  // 2. Steps Section
  if (steps && steps.trim()) {
    const stepList = parseItemsToBullets(steps);
    if (stepList.length > 0) {
      formatted += stepList.map(s => `• ${s}`).join("\n\n") + "\n\n";
    }
  }

  // 3. Required Documents Section
  if (documents && documents.trim()) {
    const docList = parseItemsToBullets(documents);
    if (docList.length > 0) {
      const docHeader = isTe ? "కావలసిన పత్రాలు:" : "Required Documents:";
      formatted += `${docHeader}\n\n` + docList.map(item => `• ${item}`).join("\n\n") + "\n\n";
    }
  }

  // 4. Eligibility Section
  if (eligibility && eligibility.trim()) {
    const eligList = parseItemsToBullets(eligibility);
    if (eligList.length > 0) {
      const eligHeader = isTe ? "అర్హత:" : "Eligibility:";
      formatted += `${eligHeader}\n\n` + eligList.map(item => `• ${item}`).join("\n\n") + "\n\n";
    }
  }

  // 5. Fees Section
  if (fees && fees.trim()) {
    const feeList = parseItemsToBullets(fees);
    if (feeList.length > 0) {
      const feeHeader = isTe ? "రుసుములు (ఫీజు):" : "Fees:";
      formatted += `${feeHeader}\n\n` + feeList.map(item => `• ${item}`).join("\n\n") + "\n\n";
    }
  }

  // 6. Deadline Section
  if (deadline && deadline.trim()) {
    const deadlineHeader = isTe ? "చివరి తేదీ (డెడ్‌లైన్):" : "Deadline:";
    formatted += `${deadlineHeader}\n${deadline.trim()}\n\n`;
  }

  return formatted.trim();
}

const DEPARTMENTS_INFO = [
  {
    key: "Admissions",
    title: "Admissions Desk",
    titleTe: "అడ్మిషన్ల డెస్క్",
    icon: GraduationCap
  },
  {
    key: "Examinations",
    title: "Examination Desk",
    titleTe: "పరీక్షల డెస్క్",
    icon: Calendar
  },
  {
    key: "Hostel",
    title: "Hostel Desk",
    titleTe: "హాస్టల్ డెస్క్",
    icon: Home
  },
  {
    key: "Fees",
    title: "Accounts Desk",
    titleTe: "అకౌంట్స్ డెస్క్",
    icon: DollarSign
  },
  {
    key: "Academics",
    title: "Academic Desk",
    titleTe: "అకడమిక్ డెస్క్",
    icon: BookOpen
  },
  {
    key: "Placements",
    title: "Placement Desk",
    titleTe: "ప్లేస్‌మెంట్ డెస్క్",
    icon: Briefcase
  }
];

export default function ExploreFAQs({
  language,
  selectedCategoryFromHome = "All",
  setSelectedCategoryFromHome,
  pendingQuery = null,
  clearPendingQuery,
}: ExploreFAQsProps) {
  
  const mappedCategory = mapHomeCategoryToSpecialist(selectedCategoryFromHome);
  const [activeSpecialist, setActiveSpecialist] = useState<string>(
    mappedCategory === "All" ? "Placements" : mappedCategory
  );

  useEffect(() => {
    const nextSpecialist = mapHomeCategoryToSpecialist(selectedCategoryFromHome);
    if (nextSpecialist !== "All") {
      setActiveSpecialist(nextSpecialist);
    }
  }, [selectedCategoryFromHome]);

  const handleSpecialistChange = (specialistKey: string) => {
    setActiveSpecialist(specialistKey);
    if (setSelectedCategoryFromHome) {
      setSelectedCategoryFromHome(specialistKey);
    }
  };

  const isTe = language === "te";
  const uiLabels = isTe ? LABELS.te : LABELS.en;

  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem("campusconnect_chat_histories_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved chat histories", e);
      }
    }
    return {};
  });

  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem("campusconnect_chat_histories_v2", JSON.stringify(chatHistories));
  }, [chatHistories]);

  // Handle incoming deep queries from Dashboard Home
  useEffect(() => {
    if (pendingQuery && pendingQuery.text) {
      const targetDept = pendingQuery.department || activeSpecialist;
      const cleanDept = targetDept === "All" ? "Placements" : targetDept;
      
      if (cleanDept !== activeSpecialist) {
        setActiveSpecialist(cleanDept);
        if (setSelectedCategoryFromHome) {
          setSelectedCategoryFromHome(cleanDept);
        }
      }

      const queryText = pendingQuery.text;
      
      const departmentFaqs = (departmentsData as FAQItem[]).filter(
        item => item.category === cleanDept
      );
      const searchEngine = new TfIdfSearchEngine(departmentFaqs);
      const searchResults = searchEngine.search(queryText);
      const matched = searchResults[0];

      const userMsgId = "user_pending_" + Date.now();
      const botMsgId = "bot_pending_" + (Date.now() + 1);
      const timestamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

      const userMsg: Message = {
        id: userMsgId,
        sender: "user",
        text: queryText,
        timestamp
      };

      const botMsg: Message = {
        id: botMsgId,
        sender: "assistant",
        text: matched 
          ? formatAnswer(matched.doc, isTe)
          : uiLabels.noFaqText,
        timestamp,
        matchedFaq: matched ? matched.doc : undefined
      };

      setChatHistories(prev => {
        const welcomeText = isTe ? WELCOME_MESSAGES[cleanDept].te : WELCOME_MESSAGES[cleanDept].en;
        const currentHist = prev[cleanDept] || [
          {
            id: "welcome_" + cleanDept,
            sender: "assistant",
            text: welcomeText,
            timestamp
          }
        ];
        
        if (currentHist.some(m => m.text === queryText && m.sender === "user")) {
          return prev;
        }

        return {
          ...prev,
          [cleanDept]: [...currentHist, userMsg, botMsg]
        };
      });

      if (clearPendingQuery) {
        clearPendingQuery();
      }
    }
  }, [pendingQuery, activeSpecialist, isTe, setSelectedCategoryFromHome, clearPendingQuery, uiLabels.noFaqText]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistories, isTyping, activeSpecialist]);

  const activeMessages = useMemo(() => {
    const hist = chatHistories[activeSpecialist];
    if (hist && hist.length > 0) return hist;

    const welcomeText = isTe ? WELCOME_MESSAGES[activeSpecialist].te : WELCOME_MESSAGES[activeSpecialist].en;
    return [
      {
        id: "welcome_" + activeSpecialist,
        sender: "assistant" as const,
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      }
    ];
  }, [chatHistories, activeSpecialist, isTe]);

  const isChatEmpty = useMemo(() => {
    return activeMessages.filter(m => m.sender === "user").length === 0;
  }, [activeMessages]);

  const handleSendMessage = (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    const textToSend = (textOverride || messageInput).trim();
    if (!textToSend) return;

    if (!textOverride) {
      setMessageInput("");
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    
    const userMsg: Message = {
      id: "user_" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp
    };

    setChatHistories(prev => {
      const welcomeText = isTe ? WELCOME_MESSAGES[activeSpecialist].te : WELCOME_MESSAGES[activeSpecialist].en;
      const currentList = prev[activeSpecialist] || [
        {
          id: "welcome_" + activeSpecialist,
          sender: "assistant",
          text: welcomeText,
          timestamp
        }
      ];
      return {
        ...prev,
        [activeSpecialist]: [...currentList, userMsg]
      };
    });

    setIsTyping(true);

    setTimeout(() => {
      const departmentFaqs = (departmentsData as FAQItem[]).filter(
        item => item.category === activeSpecialist
      );
      
      const searchEngine = new TfIdfSearchEngine(departmentFaqs);
      const searchResults = searchEngine.search(textToSend);
      const matched = searchResults[0];

      const botMsg: Message = {
        id: "bot_" + Date.now(),
        sender: "assistant",
        text: matched 
          ? formatAnswer(matched.doc, isTe)
          : uiLabels.noFaqText,
        timestamp,
        matchedFaq: matched ? matched.doc : undefined
      };

      setChatHistories(prev => {
        const currentList = prev[activeSpecialist] || [];
        return {
          ...prev,
          [activeSpecialist]: [...currentList, botMsg]
        };
      });

      setIsTyping(false);
    }, 450);
  };

  const handleClearChat = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const welcomeText = isTe ? WELCOME_MESSAGES[activeSpecialist].te : WELCOME_MESSAGES[activeSpecialist].en;
    
    setChatHistories(prev => ({
      ...prev,
      [activeSpecialist]: [
        {
          id: "welcome_" + activeSpecialist,
          sender: "assistant" as const,
          text: welcomeText,
          timestamp
        }
      ]
    }));
  };

  const currentSuggestedList = isTe 
    ? SUGGESTED_QUESTIONS[activeSpecialist]?.te || [] 
    : SUGGESTED_QUESTIONS[activeSpecialist]?.en || [];

  return (
    <div className="flex-grow flex flex-col md:flex-row bg-white h-full text-slate-800 overflow-hidden font-sans relative">
      
      {/* 🚀 LEFT COLUMN: Unified Switcher Panel (Adheres strictly to Minimalist styling) */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 flex flex-col justify-between shrink-0 relative z-10 overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="pb-2 border-b border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest block">
              {uiLabels.deptLabel}
            </span>
          </div>

          <div className="space-y-1">
            {DEPARTMENTS_INFO.map(dept => {
              const DeptIcon = dept.icon;
              const isActive = activeSpecialist === dept.key;
              return (
                <button
                  key={dept.key}
                  onClick={() => handleSpecialistChange(dept.key)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium tracking-wide transition-all group cursor-pointer ${
                    isActive
                      ? "bg-slate-200 text-slate-900 font-semibold"
                      : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <DeptIcon className={`w-4 h-4 shrink-0 ${isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`} />
                    <span className="text-left">
                      {isTe ? dept.titleTe : dept.title}
                    </span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform shrink-0 ${isActive ? "text-slate-900 translate-x-0.5" : "text-slate-300 group-hover:text-slate-400"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimal foot note */}
        <div className="p-4 border-t border-slate-200 text-[11px] text-slate-400 font-medium">
          {isTe ? "కళాశాల అధికారిక డెస్క్" : "Official College Helplines • Local Database"}
        </div>
      </div>

      {/* 🚀 RIGHT COLUMN: ChatGPT Minimalist Conversation Arena */}
      <div className="flex-grow flex-1 flex flex-col overflow-hidden bg-white relative z-10">
        
        {/* Simple Plain header */}
        <header className="bg-white border-b border-slate-200 p-4 px-6 shrink-0 relative z-20 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              {isTe 
                ? (DEPARTMENTS_INFO.find(d => d.key === activeSpecialist)?.titleTe || "")
                : (DEPARTMENTS_INFO.find(d => d.key === activeSpecialist)?.title || "")
              }
            </h1>
          </div>

          <button
            onClick={handleClearChat}
            className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-lg cursor-pointer transition flex items-center gap-1.5 select-none shrink-0"
            title="Reset conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{uiLabels.clearIcon}</span>
          </button>
        </header>

        {/* Pure ChatGPT-Style Message Thread Panel */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {activeMessages.map((msg) => {
              const isBot = msg.sender === "assistant";
              return (
                <div key={msg.id} className="w-full">
                  {isBot ? (
                    /* Left Aligned - Officer Response with standard plain background */
                    <div className="flex gap-4 max-w-full mr-auto">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0 select-none uppercase">
                        CC
                      </div>
                      <div className="space-y-2 flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 font-sans leading-none">
                            CampusConnect AI
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono leading-none">
                            {msg.timestamp}
                          </span>
                        </div>
                        <div className="text-slate-850 text-sm md:text-base font-sans leading-relaxed whitespace-pre-wrap select-text selection:bg-slate-250">
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Right Aligned - User message in a clean gray bubble */
                    <div className="flex flex-col items-end gap-1.5 max-w-[85%] ml-auto">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans pr-1">You</span>
                      <div className="bg-slate-100 text-slate-800 rounded-2xl px-4 py-2.5 text-sm md:text-base font-medium leading-relaxed border border-slate-200 shadow-3xs">
                        {msg.text}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Elegant Minimalist Typing indicator */}
            {isTyping && (
              <div className="flex gap-4 max-w-sm mr-auto">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0 select-none uppercase animate-pulse">
                  CC
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 font-sans leading-none">
                      CampusConnect AI
                    </span>
                  </div>
                  <div className="text-slate-400 text-sm font-medium flex items-center gap-1">
                    <span className="flex items-center gap-1.5 pr-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                    <span className="text-xs">{uiLabels.typing}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />

            {/* ChatGPT Prompt Suggestions Stack (Rendered dynamically when thread has only welcome prompt) */}
            {isChatEmpty && (
              <div className="pt-6 border-t border-slate-200 mt-4 max-w-2xl mx-auto">
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-3 block">
                  {isTe ? "తరచుగా అడిగే ప్రశ్నలు:" : "SUGGESTED DISK QUESTIONS:"}
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {currentSuggestedList.map((promptText, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(undefined, promptText)}
                      className="text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs md:text-sm font-semibold rounded-xl transition duration-150 cursor-pointer flex items-center justify-between group shadow-3xs"
                    >
                      <span className="leading-normal font-sans">{promptText}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform shrink-0 translate-x-0 group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Send prompt field footer */}
        <footer className="bg-white border-t border-slate-200 p-4 px-6 shrink-0 z-20">
          <div className="max-w-3xl mx-auto">
            
            <form 
              onSubmit={(e) => handleSendMessage(e)}
              className="flex items-center gap-2.5 bg-white border border-slate-300 focus-within:border-slate-500 rounded-2xl px-4 py-3 transition duration-150 shadow-xs"
            >
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={uiLabels.placeholder}
                className="w-full bg-transparent border-none text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none outline-none"
              />
              
              <div className="flex items-center shrink-0">
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-xl transition flex items-center justify-center cursor-pointer"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="text-[10px] text-slate-400 font-medium text-center mt-3 tracking-wide">
              {isTe 
                ? "అధికారిక కళాశాల హ్యాండ్‌బుక్ మార్గదర్శకాల ఆధారంగా సమాధానాలు నింపబడ్డాయి." 
                : "Questions are answered directly by designated college desk officers from the institutional handbook."}
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}

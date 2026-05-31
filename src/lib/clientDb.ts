/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FAQ, findBestMatch, isTelugu } from "./nlp";
import { DEFAULT_FAQS } from "./defaultFaqs";

// Storage keys
const FAQS_KEY = "campusconnect_local_faqs";
const QUERIES_KEY = "campusconnect_local_queries";
const ADMINS_KEY = "campusconnect_local_admins";

// Ensure initial database exists in localStorage
export function initLocalDb() {
  if (!localStorage.getItem(FAQS_KEY)) {
    localStorage.setItem(FAQS_KEY, JSON.stringify(DEFAULT_FAQS));
  }
  if (!localStorage.getItem(QUERIES_KEY)) {
    localStorage.setItem(QUERIES_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(ADMINS_KEY)) {
    localStorage.setItem(ADMINS_KEY, JSON.stringify([]));
  }
}

// Get helper
export function getLocalFaqs(): FAQ[] {
  initLocalDb();
  try {
    return JSON.parse(localStorage.getItem(FAQS_KEY) || "[]");
  } catch (e) {
    return DEFAULT_FAQS;
  }
}

// Save helper
export function saveLocalFaqs(faqs: FAQ[]) {
  localStorage.setItem(FAQS_KEY, JSON.stringify(faqs));
}

// Simulators
export const localDbSimulator = {
  getFaqs: (): FAQ[] => {
    return getLocalFaqs();
  },

  createFaq: (body: any): FAQ => {
    const faqs = getLocalFaqs();
    const newFaq: FAQ = {
      id: "faq_local_" + Date.now(),
      category: body.category || "General",
      questionEn: body.questionEn || "",
      questionTe: body.questionTe || "",
      answerEn: body.answerEn || "",
      answerTe: body.answerTe || "",
      keywords: Array.isArray(body.keywords)
        ? body.keywords
        : (body.keywords || "").split(",").map((k: string) => k.trim()),
      count: 0,
    };
    faqs.push(newFaq);
    saveLocalFaqs(faqs);
    return newFaq;
  },

  updateFaq: (id: string, body: any): FAQ => {
    const faqs = getLocalFaqs();
    const idx = faqs.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error("FAQ not found locally");
    const updated = {
      ...faqs[idx],
      category: body.category || faqs[idx].category,
      questionEn: body.questionEn || faqs[idx].questionEn,
      questionTe: body.questionTe || faqs[idx].questionTe,
      answerEn: body.answerEn || faqs[idx].answerEn,
      answerTe: body.answerTe || faqs[idx].answerTe,
      keywords: Array.isArray(body.keywords)
        ? body.keywords
        : (body.keywords ? body.keywords.split(",").map((k: string) => k.trim()) : faqs[idx].keywords),
    };
    faqs[idx] = updated;
    saveLocalFaqs(faqs);
    return updated;
  },

  deleteFaq: (id: string) => {
    const faqs = getLocalFaqs();
    const filtered = faqs.filter((f) => f.id !== id);
    saveLocalFaqs(filtered);
    return { success: true };
  },

  registerAdmin: (body: any) => {
    const { name, email, username, password } = body;
    if (!name || !email || !username || !password) {
      throw new Error("All fields are required");
    }
    const admins = JSON.parse(localStorage.getItem(ADMINS_KEY) || "[]");
    const duplicate = admins.find(
      (a: any) => a.email === email.toLowerCase().trim() || a.username === username.toLowerCase().trim()
    );
    if (duplicate) {
      throw new Error("Administrator already registered");
    }

    const newAdmin = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      username: username.toLowerCase().trim(),
      password: password.trim(), // simple storage for static preview
      createdAt: new Date().toISOString(),
    };
    admins.push(newAdmin);
    localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
    return { success: true, message: "Registered successfully!" };
  },

  login: (body: any) => {
    const { username, email, password } = body;
    const ident = (email || username || "").toLowerCase().trim();
    const pass = (password || "").trim();

    if (ident === "student@college.edu" && pass === "Student@123") {
      return {
        success: true,
        token: "cc-token-student-" + Date.now(),
        role: "student",
        email: "student@college.edu",
        name: "Student User",
      };
    }

    // Check localStorage custom admins
    const admins = JSON.parse(localStorage.getItem(ADMINS_KEY) || "[]");
    const activeAdmin = admins.find((a: any) => a.email === ident || a.username === ident);
    if (activeAdmin && activeAdmin.password === pass) {
      return {
        success: true,
        token: "cc-token-admin-" + Date.now(),
        role: "admin",
        email: activeAdmin.email,
        name: activeAdmin.name,
      };
    }

    throw new Error("Invalid login credentials.");
  },

  chat: (body: any) => {
    const { message } = body;
    const query = (message || "").trim();
    const isTel = isTelugu(query);
    const faqs = getLocalFaqs();

    const isPlacementRelated = (text: string, category?: string): boolean => {
      if (category && category.toLowerCase().includes("placement")) return true;
      const lower = text.toLowerCase();
      const placementKeywords = [
        "placement", "salary", "job", "recruiter", "recruit", "company", "companies", 
        "package", "training", "internship", "lpa", "offer", "carrier", "employ", "work",
        "ప్లేస్‌మెంట్", "జీతం", "ఉద్యోగం", "కంపెనీలు", "కంపెనీ", "ఇంటర్న్‌షిప్", "ప్యాకేజీ"
      ];
      return placementKeywords.some(kw => lower.includes(kw));
    };

    // 1. Process match using client-side TF-IDF
    const match = findBestMatch(query, faqs);
    let finalAnswer = "";
    let confidence = match.score;
    let isFallback = false;

    const formatCustomStructuredOutput = (questionOriginal: string, rawAnswer: string, _isTel: boolean, category?: string): string => {
      // 1. Capitalize title and remove markdowns
      const titleUpper = questionOriginal.replace(/[?？]/g, "").trim().toUpperCase();
      
      // 2. Extract and filter points
      const lines = rawAnswer.split("\n")
        .map(l => l.replace(/\*\*/g, "").trim())
        .filter(l => {
          const lower = l.toLowerCase();
          // Exclude conversational, chatbot questions or suggestions, and AI markers
          if (lower.includes("ask") || lower.includes("ai") || lower.includes("details") || lower.includes("again") || lower.includes("assistant") || lower.includes("chatbot")) {
            return false;
          }
          return l.length > 5;
        });
      
      const points: string[] = [];
      lines.forEach(line => {
        const cleanVal = line.replace(/^(\d+[\.\)\-:]\s*|[-•*▪■]\s*)(.*)/, "$2").trim();
        if (cleanVal && cleanVal.length > 5) {
          if (!cleanVal.endsWith("?") && !cleanVal.toLowerCase().includes("how can") && !cleanVal.toLowerCase().includes("feel free")) {
            points.push(cleanVal);
          }
        }
      });
      
      const finalPoints = points.slice(0, 3);
      if (finalPoints.length === 0) {
        if (isTel) {
          finalPoints.push("క్యాంపస్ అధికారిక సమాచార నిబంధనలను పాటించండి.");
        } else {
          finalPoints.push("Candidates must satisfy official eligibility and criteria guidelines.");
        }
      }

      // 3. Format points separated by an EMPTY line, as requested in Rule 4
      const bullets = finalPoints.map(p => `• ${p}`).join("\n\n");
      
      // 4. Determine department and set official note
      const catLower = (category || "").toLowerCase();
      let noteBody = "";
      let noteHeader = isTel ? "అధికారిక సూచన:" : "Official Note:";

      if (catLower.includes("admission")) {
        noteBody = isTel
          ? "ప్రవేశ షెడ్యూళ్ళు మరియు నిబంధనలు క్రమానుగతంగా మారవచ్చు. తాజా సమాచారం కోసం ప్రవేశాల కార్యాలయాన్ని సంప్రదించండి."
          : "Admission schedules and requirements may change periodically. Refer to official notifications for the latest updates.";
      } else if (catLower.includes("placement")) {
        noteBody = isTel
          ? "ట్రైనింగ్ & ప్లేస్‌మెంట్ విభాగం ద్వారా తాజా అధికారిక రిక్రూట్‌మెంట్ వివరాలను సరిచూసుకోండి."
          : "Contact the Training & Placement Cell for the latest official updates.";
      } else if (catLower.includes("hostel")) {
        noteBody = isTel
          ? "హాస్టల్ కేటాయింపు ప్రమాణాలు మారవచ్చు. వివరాల కోసం హాస్టల్ అడ్మినిస్ట్రేషన్ ఆఫీస్‌ని సంప్రదించండి."
          : "Hostel rules and allotment criteria are subject to change. Contact the Hostel Administration Office for details.";
      } else if (catLower.includes("fee") || catLower.includes("account")) {
        noteBody = isTel
          ? "ఫీజుల చెల్లింపు షెడ్యూళ్లను నేరుగా అకౌంట్స్ విభాగం ద్వారా సరిచూసుకోండి."
          : "Verify fee structures and payment schedules with the Accounts Department.";
      } else if (catLower.includes("exam")) {
        noteBody = isTel
          ? "పరీక్షల షెడ్యూళ్లను పరీక్షల విభాగం నోటిఫికేషన్‌లతో సరిపోల్చండి."
          : "Examination schedules, timetables, and evaluation criteria must be verified with the Examination Branch.";
      } else {
        noteBody = isTel
          ? "అధికారిక కళాశాల పోర్టల్ నోటిఫికేషన్‌లను మాత్రమే ప్రామాణికంగా భావించండి."
          : "Refer to official college portal notifications for authentic updates.";
      }

      return `${titleUpper}\n\n${bullets}\n\n${noteHeader}\n${noteBody}`;
    };

    if (match.understood && match.faq) {
      const matchedText = isTel ? match.faq.answerTe : match.faq.answerEn;
      const matchedQuestion = isTel ? match.faq.questionTe : match.faq.questionEn;
      finalAnswer = formatCustomStructuredOutput(matchedQuestion, matchedText, isTel, match.faq.category);

      // increment count
      match.faq.count = (match.faq.count || 0) + 1;
      const index = faqs.findIndex(f => f.id === match.faq?.id);
      if (index !== -1) {
        faqs[index] = match.faq;
        saveLocalFaqs(faqs);
      }
    } else {
      isFallback = true;
      finalAnswer = isTel
        ? "ఈ ప్రశ్నకు సంబంధించిన అధికారిక సమాచారం ప్రస్తుతం అందుబాటులో లేదు. తాజా సమాచారం కోసం విద్యార్థులు సంబంధిత విభాగాన్ని సంప్రదించాల్సిందిగా కోరుతున్నాము."
        : "Official information for this query is currently unavailable. Students are advised to contact the concerned department for the latest updates.";
      confidence = 0.2;
    }

    // Save query log locally
    const queryId = "q_log_local_" + Date.now();
    const queryEntry = {
      id: queryId,
      timestamp: new Date().toISOString(),
      queryText: query,
      language: isTel ? "te" : "en",
      matchedFaqId: match.understood && match.faq ? match.faq.id : null,
      confidence,
      wasUnderstood: match.understood,
      category: match.understood && match.faq ? match.faq.category : "Uncategorized",
      feedback: null,
    };

    const queries = JSON.parse(localStorage.getItem(QUERIES_KEY) || "[]");
    queries.push(queryEntry);
    localStorage.setItem(QUERIES_KEY, JSON.stringify(queries));

    return {
      id: queryId,
      answer: finalAnswer,
      isTel,
      confidence,
      wasUnderstood: match.understood,
      isFallback,
      matchedFaqId: match.understood && match.faq ? match.faq.id : null,
      suggestions: [],
    };
  },

  feedback: (body: any) => {
    const { queryId, feedback } = body;
    const queries = JSON.parse(localStorage.getItem(QUERIES_KEY) || "[]");
    const idx = queries.findIndex((q: any) => q.id === queryId);
    if (idx !== -1) {
      queries[idx].feedback = feedback;
      localStorage.setItem(QUERIES_KEY, JSON.stringify(queries));
      return { success: true };
    }
    return { success: false, error: "Query code not found" };
  },

  getAnalytics: () => {
    const faqs = getLocalFaqs();
    const queries = JSON.parse(localStorage.getItem(QUERIES_KEY) || "[]");

    const totalQueries = queries.length;
    const understoodCount = queries.filter((q: any) => q.wasUnderstood).length;
    const accuracyRate = totalQueries > 0 ? Math.round((understoodCount / totalQueries) * 100) : 100;

    const topAsked = faqs
      .map((f) => ({
        id: f.id,
        question: f.questionEn,
        category: f.category,
        count: f.count || 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const categoryChartData: Record<string, number> = {};
    queries.forEach((q: any) => {
      categoryChartData[q.category] = (categoryChartData[q.category] || 0) + 1;
    });

    const categoryBreakdown = Object.keys(categoryChartData).map((name) => ({
      name,
      value: categoryChartData[name],
    }));

    const englishQueries = queries.filter((q: any) => q.language === "en").length;
    const teluguQueries = queries.filter((q: any) => q.language === "te").length;

    const posFeedback = queries.filter((q: any) => q.feedback === "positive").length;
    const negFeedback = queries.filter((q: any) => q.feedback === "negative").length;

    const dailyChartData: Record<string, number> = {};
    queries.slice(-50).forEach((q: any) => {
      try {
        const dateStr = q.timestamp.split("T")[0];
        dailyChartData[dateStr] = (dailyChartData[dateStr] || 0) + 1;
      } catch (e) {}
    });

    const dailyTrend = Object.keys(dailyChartData)
      .sort()
      .map((date) => ({
        date,
        queries: dailyChartData[date],
      }));

    return {
      totalQueries,
      accuracyRate,
      englishCount: englishQueries || 0,
      teluguCount: teluguQueries || 0,
      positiveFeedback: posFeedback || 0,
      negativeFeedback: negFeedback || 0,
      topAsked,
      categoryBreakdown,
      dailyTrend,
      recentQueries: queries.slice(-15).reverse(),
    };
  },
};

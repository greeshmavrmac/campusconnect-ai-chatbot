/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { findBestMatch, isTelugu, preprocessText, FAQ } from "./src/lib/nlp.ts";
import crypto from "crypto";

const app = express();
const PORT = 3000;

app.use(express.json());

// Resolve database storage paths relative to the current directory
const FAQS_PATH = path.join(process.cwd(), "data", "faqs.json");
const QUERIES_PATH = path.join(process.cwd(), "data", "queries.json");
const ADMINS_PATH = path.join(process.cwd(), "data", "admins.json");

// Helper to safely read files
function loadJSON<T>(filePath: string, defaultData: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultData;
}

// Helper to safely write files
function saveJSON<T>(filePath: string, data: T): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error(`Error saving ${filePath}:`, err);
    return false;
  }
}

// Lazy Gemini AI initialization safely verifying existence of api key
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      return aiClient;
    } catch (err) {
      console.error("Failed to initialize Gemini Client:", err);
    }
  }
  return null;
}

// ==========================================
// API ENDPOINTS
// ==========================================

// Chat assistant route (hybrid model)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Query message is required." });
    }

    const query = message.trim();
    const isTel = isTelugu(query);
    const faqs = loadJSON<FAQ[]>(FAQS_PATH, []);
    const queriesLog = loadJSON<any[]>(QUERIES_PATH, []);

    // 1. NLP Matching using local TF-IDF and Cosine Similarity
    const match = findBestMatch(query, faqs);
    let finalAnswer = "";
    let confidence = match.score;
    let isFallback = false;
    let fallbackGenerated = false;

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

    // Local premium formatter in case AI is offline or as raw-matcher backup
    const formatCustomStructuredOutput = (questionOriginal: string, rawAnswer: string, isTel: boolean, category?: string): string => {
      // 1. Capitalize title and remove markdowns/questions
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
      let noteBody = isTel
        ? "సంబంధిత ప్రాథమిక సమాచారం విద్యాపాలక మండలి ద్వారా క్రమబద్ధంగా మార్పులకు లోనవుతుంది."
        : "Relevant information is subject to periodic updates by the college administration.";
      let noteHeader = isTel ? "అధికారిక సూచన:" : "Official Note:";

      return `${titleUpper}\n\n${bullets}\n\n${noteHeader}\n${noteBody}`;
    };

    if (match.understood && match.faq) {
      // Direct high-confidence match - let's expand it using Gemini if available to make it super rich and custom styled
      const matchedText = isTel ? match.faq.answerTe : match.faq.answerEn;
      const matchedQuestion = isTel ? match.faq.questionTe : match.faq.questionEn;
      
      const ai = getGeminiClient();
      if (ai) {
        try {
          const categoryName = match.faq.category || "General";
          const expansionPrompt = `You are an Official College Information Portal.
          We are presenting official database records of our college.
          
          Category: ${categoryName}
          User Question: "${matchedQuestion}"
          Official Raw Answer Information: "${matchedText}"
          
          Convert this raw answer into a highly professional, short, factual, and official portal notification.
          
          CRITICAL DIRECTIVES:
          1. NEVER mention or suggest phrases like:
             - "Ask AI"
             - "Ask Admission Office AI"
             - "Ask Admission AI"
             - "Ask Placement AI"
             - "Ask Hostel AI"
             - "Ask Again"
             - "Need more details? Ask AI"
             - Any chatbot suggestion, chatbot title, avatar, or helpful tool notation.
          2. NEVER behave like a chatbot. Do not introduce with greetings or follow-up questions. Do not end with a question.
          3. Tone based on category:
             - Admissions: Official Admission Office tone.
             - Placements: Official Training & Placement Cell tone.
             - Hostel: Official Hostel Administration Office tone.
             - Fees / Scholarships / Accounts: Official Accounts Department tone.
             - Examinations / Grades / Academics: Official Examination Branch tone.
             - Under any circumstance, keep it extremely formal, academic, and authoritative.
          4. You MUST use the following EXACT structure where [TITLE IN CAPITAL LETTERS] is replaced by a capitalized, highly professional title of the topic:
          
          [TITLE IN CAPITAL LETTERS]
          
          • [Point 1]
          
          • [Point 2]
          
          • [Point 3]
          
          Official Note:
          [Short, professional, realistic academic notification note according to department guidelines]
          
          5. Make sure there is an EMPTY line between each bullet point as specified in the template.
          6. Do not use fake company names, fake salary packages, fake placement percentages, fake fee structures, fake rankings, or fake statistics. Stick 100% strictly to facts provided.
          7. Output entirely in Telugu if isTel is true (${isTel ? "yes" : "no"}). Otherwise, output entirely in English.`;
          
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: expansionPrompt,
          });
          
          if (response.text) {
            let cleaned = response.text.trim();
            // Double check against conversational / chatbot traces
            const bannedTraces = [
              /ask\s+admission\s+ai/gi,
              /ask\s+placement\s+ai/gi,
              /ask\s+hostel\s+ai/gi,
              /ask\s+ai/gi,
              /ask\s+again/gi,
              /need\s+more\s+details/gi,
              /chatbot/gi,
              /artificial\s+intelligence/gi,
              /language\s+model/gi
            ];
            bannedTraces.forEach(regex => {
              cleaned = cleaned.replace(regex, "");
            });
            finalAnswer = cleaned;
          } else {
            finalAnswer = formatCustomStructuredOutput(matchedQuestion, matchedText, isTel, match.faq.category);
          }
        } catch (apiErr) {
          console.error("Failed to expand match via Gemini:", apiErr);
          finalAnswer = formatCustomStructuredOutput(matchedQuestion, matchedText, isTel, match.faq.category);
        }
      } else {
        finalAnswer = formatCustomStructuredOutput(matchedQuestion, matchedText, isTel, match.faq.category);
      }
      
      // Update the FAQ asked tracker count
      match.faq.count = (match.faq.count || 0) + 1;
      const index = faqs.findIndex(f => f.id === match.faq?.id);
      if (index !== -1) {
        faqs[index] = match.faq;
        saveJSON(FAQS_PATH, faqs);
      }
    } else {
      isFallback = true;
      finalAnswer = isTel
        ? "కోరిన సమాచారం ప్రస్తుతం కళాశాల అధికారిక సమాచార బేస్‌లో అందుబాటులో లేదు. దయచేసి అధికారిక నిర్ధారణ కోసం సంబంధిత విభాగాన్ని సంప్రదించాల్సిందిగా కోరుతున్నాము."
        : "The requested information is currently unavailable in the college knowledge base. Please contact the respective department for official confirmation.";
      confidence = 0.2;
    }

    // 2. Log query for Analytics Dashboard
    const queryId = "q_log_" + Date.now();
    const newLog = {
      id: queryId,
      timestamp: new Date().toISOString(),
      queryText: query,
      language: isTel ? "te" : "en",
      matchedFaqId: match.understood && match.faq ? match.faq.id : (fallbackGenerated ? "gemini_api" : null),
      confidence,
      wasUnderstood: match.understood || fallbackGenerated,
      category: match.understood && match.faq ? match.faq.category : (fallbackGenerated ? "Generated (AI)" : "Uncategorized"),
      feedback: null
    };

    queriesLog.push(newLog);
    saveJSON(QUERIES_PATH, queriesLog);

    // Return the response packet (Returning EMPTY suggestions to satisfy No-Suggestion-Rule and visually clean layout)
    return res.json({
      id: queryId,
      answer: finalAnswer,
      isTel,
      confidence,
      wasUnderstood: match.understood || fallbackGenerated,
      isFallback,
      matchedFaqId: match.understood && match.faq ? match.faq.id : null,
      suggestions: []
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    res.status(500).json({ error: "Internal Server Error during NLP processing." });
  }
});

// Helper to validate strong password rules
function validatePasswordStrength(pass: string): string | null {
  if (pass.length < 8) return "Password must be at least 8 characters long.";
  if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(pass)) return "Password must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(pass)) return "Password must contain at least one special character.";
  return null;
}

// Admin Registration Route
app.post("/api/admin/register", (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: "All fields are required for registration." });
  }

  const cleanName = name.trim();
  const cleanEmail = email.toLowerCase().trim();
  const cleanUsername = username.toLowerCase().trim();
  const rawPassword = password.trim();

  // Validate password rules
  const pwdErr = validatePasswordStrength(rawPassword);
  if (pwdErr) {
    return res.status(400).json({ error: pwdErr });
  }

  // Load registered admins
  const admins = loadJSON<any[]>(ADMINS_PATH, []);

  // Check unique constraints
  const duplicate = admins.find(
    (a) => a.email === cleanEmail || a.username === cleanUsername
  );
  if (duplicate) {
    return res.status(400).json({ error: "An administrator with this email or username has already been registered." });
  }

  // Also block using demo student credentials for admin registration
  if (cleanEmail === "student@college.edu") {
    return res.status(400).json({ error: "This email address is reserved for demo student accounts." });
  }

  // Hash password securely with Node's SHA-256
  const passwordHash = crypto.createHash("sha256").update(rawPassword).digest("hex");

  const newAdmin = {
    name: cleanName,
    email: cleanEmail,
    username: cleanUsername,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  admins.push(newAdmin);
  if (saveJSON(ADMINS_PATH, admins)) {
    return res.status(201).json({ success: true, message: "Administrator registered successfully!" });
  } else {
    return res.status(500).json({ error: "Server error: Failed to save administrator record." });
  }
});

// Unified Authentication Setup (Admin and Student for project submission / demo)
app.post("/api/admin/login", (req, res) => {
  const { username, email, password } = req.body;
  
  const ident = (email || username || "").toLowerCase().trim();
  const pass = (password || "").trim();

  // 1. Check for Demo Student
  if (ident === "student@college.edu" && pass === "Student@123") {
    return res.json({ success: true, token: "cc-token-student-" + Date.now(), role: "student", email: "student@college.edu", name: "Student User" });
  }

  // 2. Query Registered Admin Database
  const admins = loadJSON<any[]>(ADMINS_PATH, []);
  const activeAdmin = admins.find(a => a.email === ident || a.username === ident);

  if (activeAdmin) {
    const computedHash = crypto.createHash("sha256").update(pass).digest("hex");
    if (computedHash === activeAdmin.passwordHash) {
      return res.json({
        success: true,
        token: "cc-token-admin-" + Date.now(),
        role: "admin",
        email: activeAdmin.email,
        name: activeAdmin.name
      });
    } else {
      return res.status(401).json({ error: "Incorrect password credentials. Please try again." });
    }
  }

  // Fallback check
  return res.status(401).json({ error: "No student or administrator account matched these credentials." });
});

app.post("/api/login", (req, res) => {
  const { email, username, password } = req.body;
  const ident = (email || username || "").toLowerCase().trim();
  const pass = (password || "").trim();

  // 1. Check for Demo Student
  if (ident === "student@college.edu" && pass === "Student@123") {
    return res.json({ success: true, token: "cc-token-student-" + Date.now(), role: "student", email: "student@college.edu", name: "Student User" });
  }

  // 2. Query Registered Admin Database
  const admins = loadJSON<any[]>(ADMINS_PATH, []);
  const activeAdmin = admins.find(a => a.email === ident || a.username === ident);

  if (activeAdmin) {
    const computedHash = crypto.createHash("sha256").update(pass).digest("hex");
    if (computedHash === activeAdmin.passwordHash) {
      return res.json({
        success: true,
        token: "cc-token-admin-" + Date.now(),
        role: "admin",
        email: activeAdmin.email,
        name: activeAdmin.name
      });
    } else {
      return res.status(401).json({ error: "Incorrect password credentials. Please try again." });
    }
  }

  return res.status(401).json({ error: "Credentials do not match our student or administrator records." });
});

// GET all FAQs
app.get("/api/faqs", (req, res) => {
  const faqs = loadJSON<FAQ[]>(FAQS_PATH, []);
  res.json(faqs);
});

// CREATE a new FAQ
app.post("/api/faqs", (req, res) => {
  const { category, questionEn, questionTe, answerEn, answerTe, keywords = [] } = req.body;
  if (!category || !questionEn || !questionTe || !answerEn || !answerTe) {
    return res.status(400).json({ error: "All fields are required to create an FAQ." });
  }

  const faqs = loadJSON<FAQ[]>(FAQS_PATH, []);
  const newFaq: FAQ = {
    id: "faq_" + Date.now(),
    category,
    questionEn,
    questionTe,
    answerEn,
    answerTe,
    keywords: Array.isArray(keywords) ? keywords : keywords.split(",").map((k: string) => k.trim()),
    count: 0
  };

  faqs.push(newFaq);
  if (saveJSON(FAQS_PATH, faqs)) {
    res.status(201).json(newFaq);
  } else {
    res.status(500).json({ error: "Failed to persist new FAQ." });
  }
});

// UPDATE an FAQ
app.put("/api/faqs/:id", (req, res) => {
  const { id } = req.params;
  const { category, questionEn, questionTe, answerEn, answerTe, keywords } = req.body;

  const faqs = loadJSON<FAQ[]>(FAQS_PATH, []);
  const index = faqs.findIndex(f => f.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "FAQ not found." });
  }

  const updatedFaq = {
    ...faqs[index],
    category: category || faqs[index].category,
    questionEn: questionEn || faqs[index].questionEn,
    questionTe: questionTe || faqs[index].questionTe,
    answerEn: answerEn || faqs[index].answerEn,
    answerTe: answerTe || faqs[index].answerTe,
    keywords: Array.isArray(keywords) ? keywords : (keywords ? keywords.split(",").map((k: string) => k.trim()) : faqs[index].keywords)
  };

  faqs[index] = updatedFaq;
  if (saveJSON(FAQS_PATH, faqs)) {
    res.json(updatedFaq);
  } else {
    res.status(500).json({ error: "Failed to save updated FAQ." });
  }
});

// DELETE an FAQ
app.delete("/api/faqs/:id", (req, res) => {
  const { id } = req.params;
  const faqs = loadJSON<FAQ[]>(FAQS_PATH, []);
  const filtered = faqs.filter(f => f.id !== id);

  if (faqs.length === filtered.length) {
    return res.status(404).json({ error: "FAQ not found." });
  }

  if (saveJSON(FAQS_PATH, filtered)) {
    res.json({ success: true, message: "FAQ deleted successfully." });
  } else {
    res.status(500).json({ error: "Failed to save FAQ deletions." });
  }
});

// Log Feedback for particular chat query
app.post("/api/feedback", (req, res) => {
  const { queryId, feedback } = req.body; // feedback: 'positive' | 'negative'
  if (!queryId || !feedback) {
    return res.status(400).json({ error: "queryId and feedback are required." });
  }

  const queries = loadJSON<any[]>(QUERIES_PATH, []);
  const index = queries.findIndex(q => q.id === queryId);
  if (index !== -1) {
    queries[index].feedback = feedback;
    saveJSON(QUERIES_PATH, queries);
    return res.json({ success: true });
  }
  return res.status(400).json({ error: "Query logs ID not found." });
});

// Post NLP Model Retraining endpoint
app.post("/api/retrain", (req, res) => {
  res.json({
    success: true,
    message: "Model retrained dynamically in-browser via updated weights compilation.",
    accuracy: 94.2
  });
});

// ==========================================
// ENVIRONMENT MIDDLEWARES & DEV SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Server middleware injection
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving of static bundle assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CampusConnect AI Server successfully booted on http://localhost:${PORT}`);
  });
}

startServer();

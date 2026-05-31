/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardHome from "./components/DashboardHome";
import ExploreFAQs from "./components/ExploreFAQs";
import CollegeDocumentCenter from "./components/CollegeDocumentCenter";
import { FAQ } from "./types";
import departmentsData from "./data/departments.json";
import { 
  Activity, 
  School, 
  Mail, 
  Lock, 
  Loader2, 
  AlertCircle, 
  LogOut,
  Sparkles,
  Info,
  User,
  Eye,
  EyeOff,
  UserCheck
} from "lucide-react";

export default function App() {
  const [faqs, setFaqs] = useState<FAQ[]>(departmentsData as FAQ[]);
  const [loading, setLoading] = useState(false);
  
  // Clean default user session structure without first-page wall
  const [user, setUser] = useState<{ email: string; name: string; role: "student" | "admin"; token: string }>(() => {
    const saved = localStorage.getItem("campusconnect_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) return parsed;
      } catch (e) {
        console.error("Failed to parse user session:", e);
      }
    }
    return { 
      email: "student@college.edu", 
      name: "Student User", 
      role: "student", 
      token: "default_session" 
    };
  });

  // Navigation states - Defaulting to professional Home Dashboard Page first
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [language, setLanguage] = useState<"en" | "te" | "auto">("en");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [pendingQuery, setPendingQuery] = useState<{ text: string; department: string } | null>(null);

  // Initialize and refresh FAQ corpus
  const fetchFAQs = () => {
    fetch("/api/faqs")
      .then((res) => res.ok ? res.json() : [])
      .then((data: FAQ[]) => {
        setFaqs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch FAQs:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleLogout = () => {
    // Reset to default student mode
    const defaultUser = { 
      email: "student@college.edu", 
      name: "Student User", 
      role: "student" as const, 
      token: "default_session" 
    };
    setUser(defaultUser);
    localStorage.setItem("campusconnect_user", JSON.stringify(defaultUser));
    setCurrentTab("home");
  };

  const detectDepartment = (queryText: string): string => {
    const q = queryText.toLowerCase();
    
    // Placements
    if (q.includes("placement") || q.includes("recruit") || q.includes("salary") || q.includes("package") || q.includes("company") || q.includes("companies") || q.includes("job") || q.includes("intern") || q.includes("tcs") || q.includes("lpa")) {
      return "Placements";
    }
    // Admissions
    if (q.includes("admission") || q.includes("seat") || q.includes("quota") || q.includes("join") || q.includes("eligibility") || q.includes("cutoff") || q.includes("cut-off") || q.includes("counseling") || q.includes("counselling")) {
      return "Admissions";
    }
    // Hostel
    if (q.includes("hostel") || q.includes("room") || q.includes("mess") || q.includes("timings") || q.includes("food") || q.includes("accommodation") || q.includes("dining") || q.includes("laundry") || q.includes("boys") || q.includes("girls")) {
      return "Hostel";
    }
    // Fees
    if (q.includes("fee") || q.includes("tuition") || q.includes("scholarship") || q.includes("reimbursement") || q.includes("dues") || q.includes("payment") || q.includes("jvd") || q.includes("reimburse")) {
      return "Fees";
    }
    // Examinations
    if (q.includes("exam") || q.includes("grade") || q.includes("grading") || q.includes("revaluation") || q.includes("result") || q.includes("mid") || q.includes("hall ticket") || q.includes("hallticket") || q.includes("cgpa") || q.includes("sgpa")) {
      return "Examinations";
    }
    // Academics
    if (q.includes("academic") || q.includes("syllabus") || q.includes("attendance") || q.includes("course") || q.includes("subject") || q.includes("class") || q.includes("hod")) {
      return "Academics";
    }
    
    return "Placements"; // default
  };

  // Intercepting single query clicks to route to department desk
  const handleAskFaqDirectly = (questionText: string) => {
    const department = detectDepartment(questionText);
    setSelectedCategory(department);
    setPendingQuery({ text: questionText, department });
    setCurrentTab("explore");
  };

  // Switch to FAQ explore page with pre-applied category criteria
  const handleExploreCategory = (category: string) => {
    let mapped = "Placements";
    const cl = category.toLowerCase();
    if (cl.includes("admission")) mapped = "Admissions";
    else if (cl.includes("hostel") || cl.includes("facilit")) mapped = "Hostel";
    else if (cl.includes("fee") || cl.includes("scholarship")) mapped = "Fees";
    else if (cl.includes("academic") || cl.includes("course")) mapped = "Academics";
    else if (cl.includes("exam")) mapped = "Examinations";
    
    setSelectedCategory(mapped);
    setCurrentTab("explore");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center justify-center p-6 text-slate-700">
        <div className="flex flex-col items-center max-w-sm text-center bg-white border border-[#BAE6FD]/40 p-8 rounded-3xl shadow-sm">
          <div className="p-4 bg-[#E0F2FE] rounded-2xl border border-[#BAE6FD] mb-4 animate-pulse">
            <School className="w-8 h-8 text-[#3FA9FF]" />
          </div>
          <h2 className="text-base font-display font-medium text-slate-800 tracking-wide">CampusConnect AI System</h2>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 justify-center font-medium font-sans">
            <Loader2 className="w-4 h-4 animate-spin text-[#3FA9FF]" />
            <span>Verifying FAQ Knowledgebase Catalog...</span>
          </p>
        </div>
      </div>
    );
  }

  // --- LOGGED IN PORTAL RENDERED VIEW ---
  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col font-sans text-slate-700 overflow-hidden">
      
      {/* 🏛️ Top Professional College Navbar */}
      <nav className="bg-white border-b border-sky-100/60 h-16 px-6 flex items-center justify-between shrink-0 relative z-30 shadow-sm">
        {/* Left: College Logo & CampusConnect AI */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD] border border-sky-200/50 flex items-center justify-center text-[#3FA9FF] text-lg shadow-sm">
            🏫
          </div>
          <div>
            <span className="font-display font-extrabold text-[#3FA9FF] text-[#3FA9FF] text-base tracking-tight block">
              CampusConnect AI
            </span>
            <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase block -mt-0.5">
              Official Student Support Portal
            </span>
          </div>
        </div>

        {/* Right: Modern Language Switch & Profile Icon */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/30">
            <button
              onClick={() => setLanguage("en")}
              className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition duration-150 cursor-pointer ${
                language === "en" 
                  ? "bg-[#3FA9FF] text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("te")}
              className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition duration-150 cursor-pointer ${
                language === "te" 
                  ? "bg-[#3FA9FF] text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* Connected User Profile Badge */}
          <div className="flex items-center gap-3.5 pl-3 border-l border-sky-50">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-850 block leading-tight">
                {user.name}
              </span>
              <span className="text-[9.5px] font-bold text-[#3FA9FF] uppercase tracking-wider block">
                {user.role === "admin" ? "Admin User" : "Student User"}
              </span>
            </div>
            
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-400 to-sky-200 border-2 border-white shadow-sm flex items-center justify-center font-display font-semibold text-xs text-white">
              {user.role === "admin" ? "AD" : "ST"}
            </div>

            {/* Logout/Reset button */}
            <button
              onClick={handleLogout}
              title="Reset System Session"
              className="p-2 border border-sky-100 hover:bg-rose-50 hover:border-rose-100 text-slate-400 hover:text-rose-500 rounded-xl cursor-pointer transition select-none"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main split view container */}
      <div className="flex-grow flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Navigation Left Panel (Minimal & clean list) */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          language={language}
          setLanguage={setLanguage}
          user={user}
        />

        {/* Screen Viewports center Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white">
          {currentTab === "home" && (
            <DashboardHome
              faqs={faqs}
              language={language}
              setCurrentTab={setCurrentTab}
              onExploreCategory={handleExploreCategory}
              onQuickQuery={handleAskFaqDirectly}
            />
          )}

          {currentTab === "explore" && (
            <ExploreFAQs
              faqs={faqs}
              language={language}
              onSelectFAQForChat={handleAskFaqDirectly}
              selectedCategoryFromHome={selectedCategory}
              setSelectedCategoryFromHome={setSelectedCategory}
              pendingQuery={pendingQuery}
              clearPendingQuery={() => setPendingQuery(null)}
            />
          )}

          {currentTab === "documentCenter" && (
            <CollegeDocumentCenter language={language} />
          )}
        </main>
      </div>
    </div>
  );
}


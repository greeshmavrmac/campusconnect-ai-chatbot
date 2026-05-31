/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ArrowRight, Search, Bell, Sparkles, ShieldCheck, HelpCircle, 
  ChevronRight, Award, GraduationCap, DollarSign, Bed, Calendar, 
  Briefcase, Landmark, Dumbbell, UserCheck, MessageSquare, Compass
} from "lucide-react";
import { FAQ } from "../types";

interface DashboardHomeProps {
  faqs: FAQ[];
  language: "en" | "te" | "auto";
  setCurrentTab: (tab: string) => void;
  onExploreCategory: (category: string) => void;
  onQuickQuery: (question: string) => void;
}

export default function DashboardHome({
  faqs,
  language,
  setCurrentTab,
  onExploreCategory,
  onQuickQuery
}: DashboardHomeProps) {
  const [searchText, setSearchText] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [heroQuery, setHeroQuery] = useState("");

  // Hardcode beautiful mock notifications
  const notificationCount = 2;
  const notifications = [
    { id: 1, text: "Placement registration is active for B.Tech CSE Batch of 2026." },
    { id: 2, text: "Mid-Term performance grades are published on the Student Portal." }
  ];

  // Quick statistics
  const totalFaqsCount = faqs.length;
  const averageAsksCount = faqs.reduce((acc, current) => acc + (current.count || 0), 0);

  // FAQ Categories Configuration
  const categories = [
    {
      id: "Admissions",
      title: "Admissions",
      titleTe: "ప్రవేశాలు",
      desc: "Explore seat cutoff ranks, counselling procedures, and document verification.",
      descTe: "కట్ఆఫ్ ర్యాంకులు, అవసరమైన పత్రాలు మరియు సీట్ల కేటాయింపు వివరాలు.",
      icon: GraduationCap,
      color: "from-[#F0F9FF] to-[#E0F2FE] text-[#3FA9FF] border-[#BAE6FD]/40"
    },
    {
      id: "Academics",
      title: "Courses",
      titleTe: "కోర్సులు",
      desc: "Engineering branches list, syllabus curriculum, and credit allocations.",
      descTe: "ఇంజనీరింగ్ బ్రాంచీలు, క్రెడిట్ నిబంధనలు మరియు సిలబస్ వివరాలు.",
      icon: Award,
      color: "from-[#F0F9FF] to-[#E0F2FE] text-[#3FA9FF] border-[#BAE6FD]/40"
    },
    {
      id: "Fees",
      title: "Fees",
      titleTe: "ఫీజు వివరాలు",
      desc: "Tuition structures, hostel deposit guidelines, and scholarship waivers.",
      descTe: "ట్యూషన్ ఫీజు, రీయింబర్స్‌మెంట్ మరియు చెల్లింపు పద్ధతులు.",
      icon: DollarSign,
      color: "from-[#F0F9FF] to-[#E0F2FE] text-[#3FA9FF] border-[#BAE6FD]/40"
    },
    {
      id: "Facilities",
      title: "Hostel",
      titleTe: "హాస్టల్ వసతి",
      desc: "Room allocations, mess food timings, laundry rules, and warden desk.",
      descTe: "రూముల రకాలు, మెస్ మెనూ, వై-ఫై సదుపాయం మరియు నియమాలు.",
      icon: Bed,
      color: "from-[#F0F9FF] to-[#E0F2FE] text-[#3FA9FF] border-[#BAE6FD]/40"
    },
    {
      id: "Examinations",
      title: "Exams",
      titleTe: "పరీక్షలు",
      desc: "Mid-term schedules, end-semester grading, and credits system key.",
      descTe: "సెమిస్టర్ పరీక్షల టైమ్‌టేబుల్, గ్రేడింగ్ విధానం మరియు హాల్ టికెట్లు.",
      icon: Calendar,
      color: "from-[#F0F9FF] to-[#E0F2FE] text-[#3FA9FF] border-[#BAE6FD]/40"
    },
    {
      id: "Placements",
      title: "Placements",
      titleTe: "ప్లేస్‌మెంట్స్",
      desc: "Active sector recruiters, salary package statistics, and CGPA thresholds.",
      descTe: "గరిష్ట ప్యాకేజీలు, కంపెనీలు మరియు అర్హత నియమాలు.",
      icon: Briefcase,
      color: "from-[#F0F9FF] to-[#E0F2FE] text-[#3FA9FF] border-[#BAE6FD]/40"
    },
    {
      id: "Campus Life",
      title: "Scholarships",
      titleTe: "స్కాలర్‌షిప్స్",
      desc: "Government subventions, special tuition fee waivers, and application timelines.",
      descTe: "మెరిట్ స్కాలర్‌షిప్స్, ప్రభుత్వ రాయితీలు మరియు దరఖాస్తు తేదీలు.",
      icon: Landmark,
      color: "from-[#F0F9FF] to-[#E0F2FE] text-[#3FA9FF] border-[#BAE6FD]/40"
    },
    {
      id: "Facilities",
      title: "Facilities",
      titleTe: "కళాశాల వసతులు",
      desc: "Digital computing centers, specialized science labs, and central library info.",
      descTe: "క్రీడా మైదానాలు, జిమ్ వసతులు మరియు ఉచిత రవాణా సంస్థలు.",
      icon: Dumbbell,
      color: "from-[#F0F9FF] to-[#E0F2FE] text-[#3FA9FF] border-[#BAE6FD]/40"
    }
  ];

  // Quick Starter Prompts
  const quickPrompts = [
    { en: "Who are the top campus recruiters?", te: "ఇక్కడ వచ్చే టాప్ కంపెనీలు ఏవి?" },
    { en: "How do I pay engineering admission tuition fee?", te: "ట్యూషన్ ఫీజు ఆన్‌లైన్‌లో ఎలా చెల్లించాలి?" },
    { en: "What is B.Tech cut-off ranks for CSE?", te: "కంప్యూటర్ సైన్స్ మునుపటి కట్ఆఫ్ ఎంత?" }
  ];

  const filteredCategories = categories.filter(c => 
    c.title.toLowerCase().includes(searchText.toLowerCase()) || 
    c.desc.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFF] text-slate-700 min-h-screen">
      
      {/* 1. TOP NAVBAR (Premium Light Theme SaaS style) */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between z-30">
        
        {/* Logo & Platform Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-[#3FA9FF]" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-sm text-slate-900 leading-tight">CampusConnect AI</h1>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider block leading-none">Smart Academic Campus Portal</span>
          </div>
        </div>

        {/* Global Nav Search Bar */}
        <div className="hidden sm:flex items-center gap-2 max-w-sm w-full bg-[#F5F9FC]/70 hover:bg-[#F5F9FC] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#BAE6FD] border border-slate-200/50 rounded-xl px-3.5 py-1.5 transition duration-200">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search categories (e.g. Cutoff, Hostel, Mess)..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Notification Bell + User Avatar Profile Badge */}
        <div className="flex items-center gap-4">
          
          {/* Notifications Trigger */}
          <div className="relative">
            <button 
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-200/40 relative transition duration-150 cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            </button>

            {/* Notification Dropdown Portal */}
            {notifOpen && (
              <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl border border-slate-100 p-4 shadow-xl z-50 text-xs">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-950">Active Bulletins</span>
                  <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] rounded-md font-bold">{notificationCount} new</span>
                </div>
                <div className="space-y-2.5">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-2 hover:bg-slate-50 rounded-xl leading-relaxed text-slate-600 border border-slate-100/50">
                      • {notif.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Student Profile avatar */}
          <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
            <div className="text-right hidden md:block">
              <span className="block text-xs font-semibold text-slate-900 leading-none">Student User</span>
              <span className="text-[10px] text-zinc-400 font-medium font-sans">Student Board Session</span>
            </div>
            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-slate-100 shrink-0 shadow-sm relative">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                alt="Representative Profile Avatar" 
                className="object-cover w-full h-full"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
          </div>

        </div>
      </header>

      {/* 2. HERO LANDING STAGE (Centered & Clean Premium Layout) */}
      <section className="relative px-4 sm:px-6 pt-10 pb-6 md:pt-14 md:pb-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-tr from-[#3FA9FF]/10 to-[#00D5FF]/10 blur-[120px] pointer-events-none z-0" />

        <div className="max-w-3xl mx-auto text-center space-y-4 md:space-y-5 relative z-10 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E0F2FE] text-[#3FA9FF] text-[10.5px] font-bold rounded-full border border-[#BAE6FD] tracking-wide uppercase">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Official College Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 leading-[1.125] tracking-tight">
            Official Information Hub <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#3FA9FF] to-[#00D5FF] bg-clip-text text-transparent">Integrated College Portal</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-500 max-w-xl leading-relaxed">
            {language === "te" 
              ? "అడ్మిషన్లు, కోర్సులు, హాస్టల్ ఫీజు, పరీక్షల షెడ్యూల్ మరియు ప్లేస్‌మెంట్ వివరాల గురించిన సమాచారాన్ని తెలుగు & ఇంగ్లీష్ భాషలలో క్షణాల్లో పొందండి."
              : "Get instant, professional, structured answers about college admissions, tuition schedules, hostel regulations, and placement history."}
          </p>

          {/* Centered Ask AI Form container */}
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              if (heroQuery.trim()) { 
                onQuickQuery(heroQuery); 
              } 
            }} 
            className="w-full max-w-2xl bg-white shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-[#BAE6FD] border border-slate-200/60 rounded-2xl p-1.5 md:p-2 transition duration-200 flex items-center gap-1.5 md:gap-2 mt-2"
          >
            <Search className="w-4.5 h-4.5 text-slate-400 ml-2 shrink-0" />
            <input
              type="text"
              placeholder={language === "te" ? "హాస్టల్ ఫీజు ఎంత? లేదా ప్లేస్‌మెంట్ అర్హతలు ఏమిటి?..." : "Search admissions, hostel guidelines, tuition fees, placement packages..."}
              value={heroQuery}
              onChange={(e) => setHeroQuery(e.target.value)}
              className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none py-1.5 md:py-2 px-1"
            />
            <button
              type="submit"
              className="px-4 py-2 md:px-5 md:py-2.5 premium-gradient hover:premium-gradient-hover text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition duration-150 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Search Portal</span>
            </button>
          </form>

          {/* Often Asked Quick Clicks */}
          <div className="pt-2 space-y-1.5 w-full">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Queries:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { en: "Who are the top campus recruiters?", te: "ఇక్కడ వచ్చే టాప్ కంపెనీలు ఏవి?" },
                { en: "What are the rules for fee reimbursement?", te: "ఫీజు రీయింబర్స్‌మెంట్ నిబంధనలు ఏమిటి?" },
                { en: "What is B.Tech CSE cutoff rank?", te: "కంప్యూటర్ సైన్స్ మునుపటి కట్ఆఫ్ ఎంత?" }
              ].map((p, index) => {
                const queryText = language === "te" ? p.te : p.en;
                return (
                  <button
                    key={index}
                    onClick={() => onQuickQuery(queryText)}
                    className="text-left text-xs px-3 py-1.5 bg-white hover:bg-[#E0F2FE]/30 hover:text-[#3FA9FF] border border-slate-200/55 text-slate-600 rounded-xl transition duration-150 shadow-xs cursor-pointer max-w-full font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="shrink-0 text-[#3FA9FF] text-[10px]">⚡</span>
                      <span className="leading-tight">{queryText}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 3. POPULAR STUDENT FAQ SECTION (Polished & Balanced Grid) */}
      <section className="px-4 sm:px-6 py-4 md:py-6 max-w-7xl mx-auto relative z-10">
        <div className="bg-white rounded-2xl border border-slate-200/50 p-5 md:p-6 shadow-xs">
          
          <div className="mb-5">
            <div className="flex items-center gap-1.5 mb-1 text-[#3FA9FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3FA9FF] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Frequently Accessed</span>
            </div>
            <h2 className="text-base md:text-lg font-display font-extrabold text-slate-900">Popular Student FAQs</h2>
            <p className="text-slate-450 text-[11px] leading-relaxed mt-0.5">
              Click any of the core topics below to launch an instant AI-powered handbook response.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 w-full">
            {[
              { 
                titleEn: "Hostel Fee Details", 
                titleTe: "హాస్టల్ ఫీజు వివరాలు", 
                queryEn: "What are the hostel room charges, deposit rules, and mess fees?",
                queryTe: "హాస్టల్ రూమ్ చార్జీలు, డిపాజిట్ నిబంధనలు మరియు మెస్ ఫీజు ఎంత?",
                icon: Bed,
                badge: "Hostel"
              },
              { 
                titleEn: "Placement Eligibility", 
                titleTe: "ప్లేస్‌మెంట్ అర్హతలు", 
                queryEn: "What are the eligibility criteria and minimum CGPA rules for campus placements?",
                queryTe: "క్యాంపస్ ప్లేస్‌మెంట్స్ కోసం కనీస అర్హత నియమాలు మరియు సీజీపీఏ ఎంత ఉండాలి?",
                icon: Briefcase,
                badge: "Placements"
              },
              { 
                titleEn: "Scholarship Schemes", 
                titleTe: "స్కాలర్‌షిప్ వివరాలు", 
                queryEn: "Are there any merit-cum-means scholarships or JVD fee reimbursement benefits?",
                queryTe: "మెరిట్ స్కాలర్‌షిప్స్ మరియు ప్రభుత్వ ఫీజు రీయింబర్స్‌మెంట్ లభిస్తుందా?",
                icon: Landmark,
                badge: "Scholarships"
              },
              { 
                titleEn: "Attendance Requirements", 
                titleTe: "హాజరు నియమాలు", 
                queryEn: "What are the minimum classroom attendance rules and medical condonation rules?",
                queryTe: "క్యాంపస్ తరగతులకు హాజరు నిబంధనలు మరియు మెడికల్ సడలింపు వివరాలు ఏమిటి?",
                icon: UserCheck,
                badge: "Academics"
              },
              { 
                titleEn: "Exam Schedule & Rules", 
                titleTe: "పరీక్షల నియమాలు", 
                queryEn: "When are the mid-term exams and end-semester timetables announced?",
                queryTe: "మిడ్-టర్మ్ మరియు సెమిస్టర్ పరీక్షల షెడ్యూల్ ఎప్పుడు విడుదలవుతుంది?",
                icon: Calendar,
                badge: "Examinations"
              }
            ].map((faq, index) => {
              const title = language === "te" ? faq.titleTe : faq.titleEn;
              const queryText = language === "te" ? faq.queryTe : faq.queryEn;
              const Icon = faq.icon;
              return (
                <button
                  key={index}
                  onClick={() => onQuickQuery(queryText)}
                  className="group flex flex-col justify-between p-4 bg-slate-50/40 hover:bg-white border border-slate-200/40 hover:border-[#3FA9FF]/30 hover:shadow-md active:scale-[0.985] rounded-xl transition-all duration-200 text-left cursor-pointer relative overflow-hidden"
                >
                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-[#3FA9FF] uppercase tracking-wider font-mono px-2 py-0.5 bg-[#E0F2FE]/50 rounded-md">
                        {faq.badge}
                      </span>
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-[#3FA9FF] transition-colors shrink-0" />
                    </div>
                    
                    <div>
                      <h4 className="font-display font-bold text-xs text-slate-900 group-hover:text-[#3FA9FF] transition-colors line-clamp-1">
                        {title}
                      </h4>
                      <p className="text-[10px] text-slate-450 font-normal leading-relaxed mt-1 line-clamp-2">
                        {queryText}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-[#3FA9FF] transition-colors pt-3.5 mt-3 border-t border-slate-100/80 w-full">
                    <span>Ask Portal</span>
                    <ChevronRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. FAQ CATEGORIES CARDS SECTION (Clean, Realistic Knowledgebase Grid) */}
      <section className="px-4 sm:px-6 py-6 md:py-8 max-w-7xl mx-auto">
        <div className="mb-6 text-left">
          <h2 className="text-lg md:text-xl font-display font-extrabold text-slate-900">Explore Campus Knowledgebase</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Select an official handbook category to view compiled student rules, guidelines, contact counters, and workflows.
          </p>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/50 shadow-xs p-6 max-w-md mx-auto">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800 text-xs">No matching categories found</p>
            <p className="text-slate-400 text-[11px] mt-1">Please try searching with standard keywords such as Fees, Placement, etc.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {filteredCategories.map((c, index) => {
              const IconComp = c.icon;
              return (
                <div
                  key={index}
                  onClick={() => onExploreCategory(c.id)}
                  className="bg-white rounded-2xl border border-slate-200/40 p-5 shadow-xs hover:shadow-md hover:border-[#3FA9FF]/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group h-[190px]"
                >
                  <div className="space-y-4">
                    {/* Header: Icon container & Module Tag */}
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105`}>
                        <IconComp className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-[9px] bg-slate-55 border border-slate-100 font-mono font-bold text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider group-hover:bg-[#E0F2FE]/50 group-hover:text-[#3FA9FF] group-hover:border-[#BAE6FD]/40 transition-colors">
                        {c.id}
                      </span>
                    </div>

                    {/* Text Details */}
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-[#3FA9FF] transition-colors">
                        {language === "te" ? c.titleTe : c.title}
                      </h3>
                      <p className="text-[11px] text-slate-450 leading-relaxed mt-1.5 line-clamp-2">
                        {language === "te" ? c.descTe : c.desc}
                      </p>
                    </div>
                  </div>

                  {/* Footer Arrow */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-[#3FA9FF] pt-3.5 border-t border-slate-100/60 transition-colors">
                    <span className="font-semibold text-[10px] uppercase tracking-wider">Browse Handbook</span>
                    <div className="w-5 h-5 rounded-full bg-slate-50 group-hover:bg-[#E0F2FE] flex items-center justify-center text-slate-450 group-hover:text-[#3FA9FF] transition-colors shadow-xs">
                      <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. CAMPUS TRUST FOOTER */}
      <footer className="bg-white border-t border-slate-100 mt-8 py-8 text-center text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© CampusConnect AI Helpdesk • Official Student Administration Portal</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#3FA9FF] transition">College Website</a>
            <span className="text-slate-150">|</span>
            <a href="#" className="hover:text-[#3FA9FF] transition">Handbook Directory</a>
            <span className="text-slate-150">|</span>
            <a href="#" className="hover:text-[#3FA9FF] transition">Feedback Counter</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

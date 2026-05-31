/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  MessageSquare, Compass, School, FileText
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: "en" | "te" | "auto";
  setLanguage: (lang: "en" | "te" | "auto") => void;
  user?: { email: string; name: string; role: "student" | "admin" };
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  language,
  user,
}: SidebarProps) {
  const tabs = [
    { id: "home", name: "Campus Home", nameTe: "హోమ్ పేజీ", icon: School },
    { id: "explore", name: "Department Desks", nameTe: "విభాగాల డెస్క్", icon: Compass },
    { id: "documentCenter", name: "Document Center", nameTe: "డాక్యుమెంట్స్", icon: FileText },
  ];

  return (
    <aside className="w-full md:w-60 bg-white border-b md:border-b-0 md:border-r border-sky-100/60 flex flex-col p-3 md:p-4 text-slate-700 shrink-0 relative z-20 shadow-xs">
      <div className="flex flex-col gap-2 md:gap-4 w-full">
        
        {/* Navigation Category Header */}
        <div className="px-3 pt-1 md:pt-2 hidden md:block">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {language === "te" ? "నావిగేషన్" : "MAIN NAVIGATION"}
          </span>
        </div>

        {/* Navigation Item List: adapts from horizontal scroll on mobile to vertical pile on desktop */}
        <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto scrollbar-none pb-2 md:pb-0 select-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center justify-between px-3 md:px-4 py-2 md:py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 group cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#E0F2FE] text-[#3FA9FF]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <Icon
                     className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-150 group-hover:scale-105 ${
                      isActive ? "text-[#3FA9FF]" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span className="font-display">
                    {language === "te" ? tab.nameTe : tab.name}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Simplified Footer Credit - Hidden on phones */}
      <div className="mt-auto pt-4 border-t border-slate-50 hidden md:flex flex-col gap-1 px-3">
        <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>System status: Online</span>
        </div>
      </div>
    </aside>
  );
}

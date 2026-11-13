"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminLogin } from "./AdminLogin";
import { AdminNotes } from "./AdminNotes";
import { AdminLeadsPipeline, PitmasterLead } from "./AdminLeadsPipeline";
import { AdminEmailHub } from "./AdminEmailHub";
import { AdminCalendar } from "./AdminCalendar";
import { AdminTodoList } from "./AdminTodoList";
import { AdminPriceConfigurator } from "./AdminPriceConfigurator";
import { AdminQRDisplays } from "./AdminQRDisplays";
import { AdminPitmasterApp } from "./AdminPitmasterApp";
import { AdminAnalytics } from "./AdminAnalytics";
import { AdminReviewsHub } from "./AdminReviewsHub";
import { AdminWeekendDropManager } from "./AdminWeekendDropManager";
import { AdminInventory } from "./AdminInventory";
import { AdminGuide } from "./AdminGuide";
import { SITE_CONFIG } from "@/config/site-config";

export type AdminTheme = "day" | "night";

export type AdminTab =
  | "leads"
  | "emails"
  | "calendar"
  | "weekend-drop"
  | "todos"
  | "analytics"
  | "qr-displays"
  | "google"
  | "services"
  | "directories"
  | "notes"
  | "workspace"
  | "pitmaster-app"
  | "inventory";

interface SubTabDef {
  key: string;
  label: string;
}

/** Sub-tabs shown indented under their parent in the sidebar. */
const SUB_TABS: Partial<Record<AdminTab, SubTabDef[]>> = {
  leads: [
    { key: "pipeline", label: "Pipeline" },
    { key: "messages", label: "Quick Messages" },
    { key: "promo", label: "Seasonal Promo" },
  ],
  emails: [
    { key: "inbox", label: "Inbox" },
    { key: "sent", label: "Sent" },
    { key: "compose", label: "Compose" },
  ],
  calendar: [
    { key: "month", label: "Month View" },
    { key: "day", label: "Day Detail" },
  ],
  "pitmaster-app": [
    { key: "timers", label: "Smoke Timers" },
    { key: "status-flipper", label: "Menu Flipper" },
    { key: "cheat-sheet", label: "Temp Targets" },
    { key: "fuel-log", label: "Wood & Pit Log" },
  ],
  inventory: [
    { key: "wood", label: "Wood & Fuel" },
    { key: "menu-stock", label: "Menu & Meat Stock" },
    { key: "supplies", label: "Supplies & Restock" },
  ],
  "weekend-drop": [
    { key: "current", label: "Current Drop" },
    { key: "popups", label: "Pop-Ups" },
  ],
  services: [
    { key: "menu", label: "Smoker Menu" },
    { key: "packages", label: "Packages" },
    { key: "pans", label: "Party Pans" },
    { key: "delivery", label: "Delivery Rules" },
    { key: "chalkboard", label: "Chalkboard" },
  ],
  "qr-displays": [
    { key: "templates", label: "Templates" },
    { key: "review-card", label: "Review Card" },
    { key: "print", label: "Print Preview" },
  ],
  workspace: [
    { key: "todos", label: "To-Do & Roadmap" },
    { key: "notes", label: "Pitmaster Notes" },
  ],
};

const WORKSPACE_GUIDES: Record<
  string,
  { title: string; summary: string; steps: { title: string; desc: string }[]; tip?: string }
> = {
  todos: {
    title: "How the To-Do & Roadmap works",
    summary: "Your running list of what needs doing.",
    steps: [
      { title: "Add a task", desc: "Type it in and tap Add. Keep each one short and clear." },
      { title: "Check it off", desc: "Tap the box when it's done. Finished items move out of the way." },
      { title: "Plan ahead", desc: "Use the roadmap items to see what we're building next for your site." },
    ],
  },
  notes: {
    title: "How Pitmaster Notes work",
    summary: "Leave notes for Todd and see his replies.",
    steps: [
      { title: "Write a note", desc: "Type what you need, like a menu change or a question, and send it." },
      { title: "Pick a category", desc: "Choose a category so notes are easy to find later." },
      { title: "Check replies", desc: "Todd's answers show up in the same thread." },
    ],
  },
};

export function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("leads");
  const [subTabs, setSubTabs] = useState<Partial<Record<AdminTab, string>>>({});
  const [theme, setTheme] = useState<AdminTheme>("night");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedLeadForEmail, setSelectedLeadForEmail] = useState<PitmasterLead | null>(null);

  const currentSubTab: string | undefined =
    subTabs[activeTab] ?? SUB_TABS[activeTab]?.[0]?.key;

  /** Go to a tab (and optionally a specific sub-tab). Parent click remembers the last sub-tab. */
  const goTo = (tab: AdminTab, sub?: string) => {
    setActiveTab(tab);
    if (sub) setSubTabs((prev) => ({ ...prev, [tab]: sub }));
  };

  // Check auth, saved theme preference, & URL tab on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth =
        localStorage.getItem("ats_admin_auth") === "true" ||
        sessionStorage.getItem("ats_admin_auth") === "true";
      setIsAuthenticated(isAuth);

      const savedTheme = localStorage.getItem("ats_admin_theme");
      if (savedTheme === "day" || savedTheme === "butcher-paper") {
        setTheme("day");
      } else if (savedTheme === "night" || savedTheme === "dark") {
        setTheme("night");
      }

      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get("tab");
      const urlSub = params.get("sub") ?? undefined;
      if (urlTab === "todos" || urlTab === "notes") {
        // Old deep links: To-Do and Notes now live under Workspace
        setActiveTab("workspace");
        setSubTabs({ workspace: urlTab });
      } else if (urlTab) {
        setActiveTab(urlTab as AdminTab);
        if (urlSub) setSubTabs({ [urlTab]: urlSub } as Partial<Record<AdminTab, string>>);
      }
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ats_admin_auth");
      sessionStorage.removeItem("ats_admin_auth");
    }
    setIsAuthenticated(false);
  };

  const handleToggleTheme = (newTheme: AdminTheme) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("ats_admin_theme", newTheme);
      if (newTheme === "day") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    }
  };

  // Sync dark class on mount and theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (theme === "day") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    }
  }, [theme]);

  // Loading screen before checking localStorage
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-zinc-500 text-sm">
        Verifying Pitmaster Credentials...
      </div>
    );
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const isDay = theme === "day";

  // Streamlined 3-Tier Navigation for Maximum Ergonomics & Zero Clutter
  const navGroups = [
    {
      groupTitle: "Daily Operations",
      items: [
        {
          key: "leads" as AdminTab,
          label: "Leads & Quotes",
          status: "Live",
          badgeColor: "emerald",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          key: "emails" as AdminTab,
          label: "Client Emails",
          status: "Inbox",
          badgeColor: "amber",
          icon: (
            <svg className="w-4 h-4 shrink-0 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          ),
        },
        {
          key: "calendar" as AdminTab,
          label: "Smoke Calendar",
          status: "Live",
          badgeColor: "emerald",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          key: "pitmaster-app" as AdminTab,
          label: "Pitmaster Rig App",
          status: "Live",
          badgeColor: "emerald",
          icon: (
            <svg className="w-4 h-4 shrink-0 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          key: "inventory" as AdminTab,
          label: "Inventory & Wood",
          status: "Live",
          badgeColor: "emerald",
          icon: (
            <svg className="w-4 h-4 shrink-0 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
        },
      ],
    },
    {
      groupTitle: "Revenue & Menu",
      items: [
        {
          key: "weekend-drop" as AdminTab,
          label: "Weekend Drops & Pop-Ups",
          status: "Live",
          badgeColor: "emerald",
          icon: (
            <svg className="w-4 h-4 shrink-0 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          ),
        },
        {
          key: "services" as AdminTab,
          label: "Smoker Menu & Pricing",
          status: "Live",
          badgeColor: "emerald",
          icon: (
            <svg className="w-4 h-4 shrink-0 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          key: "analytics" as AdminTab,
          label: "Revenue Analytics",
          status: "Live",
          badgeColor: "emerald",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
        },
        {
          key: "google" as AdminTab,
          label: "Reviews & Google",
          status: "Live",
          badgeColor: "emerald",
          icon: (
            <svg className="w-4 h-4 shrink-0 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ),
        },
        {
          key: "qr-displays" as AdminTab,
          label: "QR Displays & Print",
          status: "Live",
          badgeColor: "emerald",
          icon: (
            <svg className="w-4 h-4 shrink-0 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          ),
        },
      ],
    },
    {
      groupTitle: "Admin & Tools",
      items: [
        {
          key: "workspace" as AdminTab,
          label: "Workspace",
          status: "Live",
          badgeColor: "emerald",
          icon: (
            <svg className="w-4 h-4 shrink-0 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDay ? "bg-[#F4EFEA] text-[#1C1917]" : "bg-[#0A0A0A] text-neutral-100"
      }`}
    >
      {/* 1. TOP EXECUTIVE HEADER (Preserved Live-Fire Setup User Loves) */}
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-200 ${
          isDay
            ? "bg-[#EBE4DB]/95 border-b border-[#D8CEC1] shadow-md"
            : "bg-[#121214]/95 border-b border-zinc-800 shadow-xl"
        }`}
      >
        <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          {/* Left: Sidebar Toggle + Brand Identity */}
          <div className="flex items-center gap-3">
            {/* Desktop Sidebar Toggle Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`hidden md:inline-flex items-center justify-center w-9 h-9 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDay
                  ? "bg-[#FAF7F2] border-[#D8CEC1] text-stone-800 hover:border-[#EA580C] hover:bg-[#F2ECE3]"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-[#EA580C]"
              }`}
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <span className="font-mono text-sm">{sidebarOpen ? "«" : "»"}</span>
            </button>

            {/* Mobile Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className={`md:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDay
                  ? "bg-[#FAF7F2] border-[#D8CEC1] text-stone-800 hover:border-[#EA580C]"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
              }`}
              title="Open Navigation Menu"
            >
              <span className="text-sm font-bold">Menu</span>
            </button>

            {/* Brand Logo */}
            <Link
              href="/"
              className="relative w-9 h-9 sm:w-10 sm:h-10 transition-transform hover:scale-105 shrink-0"
              title="Return to Public Site"
            >
              <Image
                src="/brand/allthesmoke-logo.png"
                alt="All The Smoke Logo"
                fill
                priority
                className="object-contain"
              />
            </Link>

            {/* Pitmaster Identification */}
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`font-display text-sm sm:text-lg font-bold tracking-tight leading-tight ${
                    isDay ? "text-[#1C1917]" : "text-white"
                  }`}
                >
                  PITMASTER OPERATIONS
                </h1>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#EA580C]/20 border border-[#EA580C]/50 text-[#FF8C38] hidden sm:inline-block">
                  Live
                </span>
              </div>
              <p
                className={`text-[11px] ${
                  isDay ? "text-black font-extrabold" : "text-zinc-400"
                }`}
              >
                Marion Bolden • Chicago Live-Fire Catering
              </p>
            </div>
          </div>

          {/* Right Header Actions: Day / Night Theme Switcher + Site + Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Day / Night Segmented Switcher */}
            <div
              className={`inline-flex p-0.5 sm:p-1 rounded-xl border text-[11px] sm:text-xs font-bold ${
                isDay
                  ? "bg-[#E2DACF] border-[#D0C4B5]"
                  : "bg-zinc-900 border-zinc-700"
              }`}
              title="Switch between Day (Texas Butcher Paper) and Night (Smokehouse Dark)"
            >
              <button
                type="button"
                onClick={() => handleToggleTheme("day")}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all font-bold cursor-pointer ${
                  isDay
                    ? "bg-[#C8A97E] text-stone-950 font-black shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Day
              </button>
              <button
                type="button"
                onClick={() => handleToggleTheme("night")}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all font-bold cursor-pointer ${
                  !isDay
                    ? "bg-[#EA580C] text-white shadow-sm font-black"
                    : "text-black font-black hover:text-stone-700"
                }`}
              >
                Night
              </button>
            </div>

            {/* View Public Website */}
            <Link
              href="/"
              target="_blank"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isDay
                  ? "border-stone-400 hover:border-[#EA580C] text-black bg-white hover:bg-stone-100"
                  : "border-zinc-700 hover:border-[#EA580C] text-zinc-300 hover:text-white"
              }`}
            >
              <span>View Site</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className={`inline-flex items-center px-3 sm:px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDay
                  ? "bg-white border-stone-400 text-black hover:text-red-700 hover:border-red-400"
                  : "bg-zinc-900 hover:bg-zinc-800 border-zinc-700 hover:border-red-500/80 text-zinc-300 hover:text-red-400"
              }`}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* 2. BODY CONTAINER WITH LEFT SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex w-full">
        {/* DESKTOP SIDEBAR (MATCHING EXACT BLIND COOK NAMES & STRUCTURE) */}
        <aside
          className={`hidden md:flex flex-col shrink-0 border-r transition-all duration-200 ${
            sidebarOpen ? "w-56 lg:w-60" : "w-16"
          } ${
            isDay
              ? "bg-[#FAF7F2] border-[#D8CEC1]"
              : "bg-[#121214] border-zinc-800"
          }`}
        >
          {/* Navigation Groups */}
          <nav className="p-2.5 space-y-3 flex-1 overflow-y-auto scrollbar-thin">
            {navGroups.map((group, groupIdx) => (
              <div key={group.groupTitle} className="space-y-1">
                {groupIdx > 0 && (
                  <div className={`my-2 border-t ${isDay ? "border-stone-200" : "border-zinc-800"}`} />
                )}

                {sidebarOpen && (
                  <div className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider ${isDay ? "text-black" : "text-zinc-500"}`}>
                    {group.groupTitle}
                  </div>
                )}

                {group.items.map((item) => {
                  const isActive = activeTab === item.key;
                  const children = SUB_TABS[item.key];
                  return (
                    <div key={item.key}>
                    <button
                      type="button"
                      onClick={() => goTo(item.key)}
                      className={`w-full text-left rounded-xl transition-all flex items-center gap-2.5 cursor-pointer ${
                        sidebarOpen ? "px-3 py-2" : "px-2 py-2 justify-center"
                      } ${
                        isActive
                          ? "bg-[#EA580C] text-white shadow-md font-bold"
                          : isDay
                          ? "text-black hover:bg-[#F0EAE1] font-black"
                          : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white font-medium"
                      }`}
                      title={item.label}
                    >
                      {item.icon}

                      {sidebarOpen && (
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="text-xs truncate">{item.label}</span>
                          <span
                            className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                              isActive
                                ? "bg-black/30 text-white"
                                : item.badgeColor === "emerald"
                                ? isDay
                                  ? "bg-emerald-100 text-emerald-950 font-black"
                                  : "bg-emerald-500/20 text-emerald-400"
                                : item.badgeColor === "amber"
                                ? isDay
                                  ? "bg-amber-100 text-amber-950 font-black"
                                  : "bg-amber-500/20 text-amber-400"
                                : isDay
                                ? "bg-stone-200 text-black font-extrabold"
                                : "bg-zinc-800 text-zinc-500 font-normal"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      )}
                    </button>

                    {/* Indented sub-tabs: only the active parent is expanded */}
                    {sidebarOpen && isActive && children && (
                      <div
                        className={`mt-1 mb-1.5 ml-5 pl-3 border-l-2 space-y-0.5 ${
                          isDay ? "border-[#EA580C]/50" : "border-[#EA580C]/40"
                        }`}
                      >
                        {children.map((sub) => {
                          const subActive = currentSubTab === sub.key;
                          return (
                            <button
                              key={sub.key}
                              type="button"
                              onClick={() => goTo(item.key, sub.key)}
                              aria-current={subActive ? "page" : undefined}
                              className={`w-full text-left min-h-[40px] px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer flex items-center ${
                                subActive
                                  ? isDay
                                    ? "bg-[#FFE9D6] text-[#8B3A14] font-black"
                                    : "bg-[#EA580C]/20 text-[#FF8C38] font-bold"
                                  : isDay
                                  ? "text-black hover:bg-[#F0EAE1] font-bold"
                                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
                              }`}
                            >
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    </div>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer Info */}
          {sidebarOpen && (
            <div
              className={`p-3.5 border-t text-[11px] space-y-1.5 ${
                isDay
                  ? "border-[#D8CEC1] text-stone-600 bg-[#F4EFEA]/80"
                  : "border-zinc-800/80 text-zinc-500 bg-[#0E0E10]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  Mode:
                </span>
                <span
                  className={`font-bold ${
                    isDay ? "text-[#C84A0A]" : "text-[#FF8C38]"
                  }`}
                >
                  {isDay ? "Texas Butcher Paper" : "Smokehouse Obsidian"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  Brevo Dispatch:
                </span>
                <span className="text-emerald-600 font-bold">Active</span>
              </div>
            </div>
          )}
        </aside>

        {/* MOBILE SLIDE-OUT DRAWER */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />

            {/* Slide-out Panel */}
            <div
              className={`relative w-72 max-w-[85vw] h-full p-4 flex flex-col z-10 shadow-2xl transition-all overflow-y-auto ${
                isDay
                  ? "bg-[#FAF7F2] text-stone-900 border-r border-[#D8CEC1]"
                  : "bg-[#141417] text-white border-r border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-700/40">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <Image
                      src="/brand/allthesmoke-logo.png"
                      alt="All The Smoke"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold">Pitmaster Operations</h3>
                    <p className="text-[10px] text-zinc-400">Marion Bolden</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-zinc-400 hover:text-white border border-zinc-700/60"
                >
                  ✕
                </button>
              </div>

              {/* Mobile Drawer Navigation List */}
              <nav className="py-3 space-y-3 flex-1 overflow-y-auto">
                {navGroups.map((group) => (
                  <div key={group.groupTitle} className="space-y-1">
                    <div className={`px-2 text-[10px] font-black uppercase tracking-wider ${isDay ? "text-black" : "text-stone-400"}`}>
                      {group.groupTitle}
                    </div>

                    {group.items.map((item) => {
                      const isActive = activeTab === item.key;
                      const children = SUB_TABS[item.key];
                      return (
                        <div key={item.key}>
                        <button
                          type="button"
                          onClick={() => {
                            goTo(item.key);
                            if (!children) setMobileDrawerOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 min-h-[48px] rounded-xl text-xs flex items-center justify-between font-bold transition-all ${
                            isActive
                              ? "bg-[#EA580C] text-white shadow-md font-black"
                              : isDay
                              ? "bg-white text-black font-black hover:bg-[#F0EAE1]"
                              : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                          <span className="text-[9px] bg-black/30 px-2 py-0.5 rounded-full text-white">
                            {item.status}
                          </span>
                        </button>

                        {isActive && children && (
                          <div className="mt-1 mb-1.5 ml-5 pl-3 border-l-2 border-[#EA580C]/50 space-y-0.5">
                            {children.map((sub) => {
                              const subActive = currentSubTab === sub.key;
                              return (
                                <button
                                  key={sub.key}
                                  type="button"
                                  onClick={() => {
                                    goTo(item.key, sub.key);
                                    setMobileDrawerOpen(false);
                                  }}
                                  className={`w-full text-left min-h-[48px] px-3 py-2 rounded-lg text-xs flex items-center ${
                                    subActive
                                      ? isDay
                                        ? "bg-[#FFE9D6] text-[#8B3A14] font-black"
                                        : "bg-[#EA580C]/20 text-[#FF8C38] font-bold"
                                      : isDay
                                      ? "text-black font-bold"
                                      : "text-zinc-300"
                                  }`}
                                >
                                  {sub.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </nav>

              {/* Mobile Drawer Footer Actions */}
              <div className="pt-3 border-t border-zinc-700/30 space-y-2">
                <Link
                  href="/"
                  target="_blank"
                  className="w-full py-2 px-3 rounded-xl border border-zinc-700 text-center text-xs font-semibold block text-zinc-300 hover:text-white"
                >
                  View Public Site →
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2 px-3 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-center text-xs font-bold block"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {/* TAB 1: LEADS PIPELINE (LIVE) */}
            {activeTab === "leads" && (
              <AdminLeadsPipeline
                theme={theme}
                subTab={currentSubTab}
                onSelectLeadForEmail={(lead) => {
                  setSelectedLeadForEmail(lead);
                  goTo("emails", "compose");
                }}
              />
            )}

            {/* TAB 2: BREVO EMAIL HUB (LIVE) */}
            {activeTab === "emails" && (
              <AdminEmailHub
                theme={theme}
                subTab={currentSubTab}
                prefilledLead={selectedLeadForEmail || undefined}
              />
            )}

            {/* TAB 3: SMOKE CALENDAR (LIVE) */}
            {activeTab === "calendar" && <AdminCalendar theme={theme} subTab={currentSubTab} />}

            {/* TAB: WORKSPACE = TO-DO & ROADMAP + PITMASTER NOTES (LIVE) */}
            {(activeTab === "workspace" || activeTab === "todos" || activeTab === "notes") && (
              <>
                {(() => {
                  const wsSub =
                    activeTab === "workspace" ? currentSubTab ?? "todos" : activeTab;
                  const g = WORKSPACE_GUIDES[wsSub] ?? WORKSPACE_GUIDES.todos;
                  return (
                    <>
                      <AdminGuide
                        guideId={`workspace-${wsSub}`}
                        theme={theme}
                        title={g.title}
                        summary={g.summary}
                        steps={g.steps}
                        tip={g.tip}
                      />
                      {wsSub === "notes" ? (
                        <AdminNotes theme={theme} />
                      ) : (
                        <AdminTodoList theme={theme} />
                      )}
                    </>
                  );
                })()}
              </>
            )}

            {/* TAB 5-10: ANALYTICS */}
            {activeTab === "analytics" && <AdminAnalytics theme={theme} />}

            {/* TAB: QR DISPLAYS & PRINT MARKETING ENGINE (LIVE) */}
            {activeTab === "qr-displays" && <AdminQRDisplays theme={theme} subTab={currentSubTab} />}

            {/* TAB: GOOGLE BUSINESS PROFILE & CUSTOMER REVIEWS (LIVE) */}
            {activeTab === "google" && <AdminReviewsHub theme={theme} />}

            {/* TAB: WEEKEND DROPS & POP-UP SPECIALS (LIVE) */}
            {activeTab === "weekend-drop" && (
              <AdminWeekendDropManager theme={theme} subTab={currentSubTab} />
            )}

            {/* TAB: SMOKER MENU & PRICE CONFIGURATOR (LIVE) */}
            {activeTab === "services" && (
              <AdminPriceConfigurator theme={theme} subTab={currentSubTab} />
            )}

            {activeTab === "directories" && (
              <ComingSoonModule
                title="Chicagoland Catering Directories & Vendor Hub"
                subtitle="Centralized status tracking for local directories, corporate portals, and wedding registries"
                icon="📁"
                theme={theme}
                features={[
                  "Directory sync tracker: EzCater, Roaming Hunger, Yelp, The Knot, WeddingWire",
                  "Profile update alerts to keep menu pricing consistent across external platforms",
                  "Corporate vendor credential verification (licensed, insured, food handler certifications)",
                  "Direct traffic and lead attribution reports per external directory",
                ]}
                actionTab="workspace"
                actionLabel="Open Collaborator Notes →"
                onAction={() => goTo("workspace", "notes")}
              />
            )}

            {activeTab === "pitmaster-app" && (
              <AdminPitmasterApp theme={theme} subTab={currentSubTab} />
            )}

            {activeTab === "inventory" && (
              <AdminInventory theme={theme} subTab={currentSubTab} />
            )}
          </div>
        </main>
      </div>

      {/* 4. FOOTER */}
      <footer
        className={`py-3 px-4 sm:px-8 text-center text-xs transition-colors duration-200 border-t ${
          isDay
            ? "bg-[#EBE4DB] border-[#D8CEC1] text-stone-600 font-medium"
            : "bg-[#0E0E10] border-zinc-800/80 text-zinc-500"
        }`}
      >
        All The Smoke Catering • Pitmaster Operations • Marion Bolden
      </footer>
    </div>
  );
}

// Sleek All The Smoke Branded Coming Soon Module
interface ComingSoonModuleProps {
  title: string;
  subtitle: string;
  icon: string;
  theme: AdminTheme;
  features: string[];
  actionTab: string;
  actionLabel: string;
  onAction: () => void;
}

function ComingSoonModule({
  title,
  subtitle,
  icon,
  theme,
  features,
  actionLabel,
  onAction,
}: ComingSoonModuleProps) {
  const isDay = theme === "day";

  return (
    <div
      className={`rounded-3xl p-6 sm:p-10 border shadow-xl space-y-6 animate-fade-in ${
        isDay
          ? "bg-white border-[#E2DACF] text-stone-900"
          : "bg-[#141210] border-zinc-800 text-neutral-100"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-stone-200 dark:border-zinc-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-display font-bold">{title}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-[#FF7A00] border border-amber-500/40">
                Coming Soon
              </span>
            </div>
            <p className={`text-xs sm:text-sm mt-0.5 ${isDay ? "text-black font-bold" : "text-stone-400"}`}>
              {subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAction}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C84A0A] text-white text-xs font-black transition-all shadow-md cursor-pointer"
        >
          {actionLabel}
        </button>
      </div>

      {/* Feature Milestones */}
      <div className="space-y-3">
        <h3 className={`text-xs font-black uppercase tracking-wider ${isDay ? "text-black" : "text-stone-400"}`}>
          What We Are Wiring Up for All The Smoke:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-colors ${
                isDay
                  ? "bg-[#FAF7F2] border-[#D8CEC1] text-black font-extrabold"
                  : "bg-[#1B1815] border-zinc-800 text-stone-300"
              }`}
            >
              <span className="text-[#FF7A00] font-black text-sm shrink-0">✓</span>
              <span className="text-xs font-bold leading-relaxed">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pitmaster Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 font-medium flex items-center gap-2">
        <span>⚡</span>
        <span>
          This module is part of the All The Smoke operational roadmap. Core operations (Leads Pipeline, Email Inbox, Smoke Calendar, and Collaborator Notes) are 100% live.
        </span>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminLogin } from "./AdminLogin";
import { AdminNotes } from "./AdminNotes";
import { AdminLeadsPipeline, PitmasterLead } from "./AdminLeadsPipeline";
import { AdminEmailHub } from "./AdminEmailHub";
import { AdminCalendar } from "./AdminCalendar";
import { SITE_CONFIG } from "@/config/site-config";

export type AdminTheme = "day" | "night";

export type AdminTab =
  | "leads"
  | "emails"
  | "calendar"
  | "analytics"
  | "qr-displays"
  | "google"
  | "services"
  | "directories"
  | "notes"
  | "pitmaster-app";

export function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("leads");
  const [theme, setTheme] = useState<AdminTheme>("night");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedLeadForEmail, setSelectedLeadForEmail] = useState<PitmasterLead | null>(null);

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
      const urlTab = params.get("tab") as AdminTab;
      if (urlTab) {
        setActiveTab(urlTab);
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
    }
  };

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

  // Sidebar navigation items definition matching Blind Cook structure
  const navGroups = [
    {
      groupTitle: "Daily Operations",
      items: [
        {
          key: "leads" as AdminTab,
          label: "Leads",
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
          label: "Emails",
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
          label: "Calendar",
          status: "Live",
          badgeColor: "emerald",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
      ],
    },
    {
      groupTitle: "Growth, Performance & Marketing",
      items: [
        {
          key: "analytics" as AdminTab,
          label: "Analytics",
          status: "Coming Soon",
          badgeColor: "stone",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
        },
        {
          key: "qr-displays" as AdminTab,
          label: "QR Displays",
          status: "Coming Soon",
          badgeColor: "stone",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          ),
        },
        {
          key: "google" as AdminTab,
          label: "Google",
          status: "Coming Soon",
          badgeColor: "stone",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          key: "services" as AdminTab,
          label: "Services",
          status: "Coming Soon",
          badgeColor: "stone",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          key: "directories" as AdminTab,
          label: "Directories",
          status: "Coming Soon",
          badgeColor: "stone",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          ),
        },
      ],
    },
    {
      groupTitle: "Internal Admin & Notes",
      items: [
        {
          key: "notes" as AdminTab,
          label: "Notes",
          status: "Live",
          badgeColor: "emerald",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
      ],
    },
    {
      groupTitle: "Mobile Rig Operations",
      items: [
        {
          key: "pitmaster-app" as AdminTab,
          label: "Pitmaster App",
          status: "Coming Soon",
          badgeColor: "stone",
          icon: (
            <svg className="w-4 h-4 shrink-0 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
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
                  isDay ? "text-stone-600 font-medium" : "text-zinc-400"
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
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Night
              </button>
            </div>

            {/* View Public Website */}
            <Link
              href="/"
              target="_blank"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isDay
                  ? "border-[#D8CEC1] hover:border-[#EA580C] text-stone-700 hover:text-stone-900 bg-[#FAF8F5]"
                  : "border-zinc-700 hover:border-[#EA580C] text-zinc-300 hover:text-white"
              }`}
            >
              <span>View Site</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className={`inline-flex items-center px-3 sm:px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isDay
                  ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-700 hover:text-red-700 hover:border-red-400"
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
                  <div className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${isDay ? "text-stone-500" : "text-zinc-500"}`}>
                    {group.groupTitle}
                  </div>
                )}

                {group.items.map((item) => {
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveTab(item.key)}
                      className={`w-full text-left rounded-xl transition-all flex items-center gap-2.5 cursor-pointer ${
                        sidebarOpen ? "px-3 py-2" : "px-2 py-2 justify-center"
                      } ${
                        isActive
                          ? "bg-[#EA580C] text-white shadow-md font-bold"
                          : isDay
                          ? "text-stone-800 hover:bg-[#F0EAE1] hover:text-black font-semibold"
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
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-emerald-500/20 text-emerald-400"
                                : item.badgeColor === "amber"
                                ? isDay
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-amber-500/20 text-amber-400"
                                : isDay
                                ? "bg-stone-200/80 text-stone-600 font-normal"
                                : "bg-zinc-800 text-zinc-500 font-normal"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      )}
                    </button>
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
                    <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      {group.groupTitle}
                    </div>

                    {group.items.map((item) => {
                      const isActive = activeTab === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            setActiveTab(item.key);
                            setMobileDrawerOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between font-bold transition-all ${
                            isActive
                              ? "bg-[#EA580C] text-white shadow-md font-black"
                              : isDay
                              ? "bg-white text-stone-900 hover:bg-[#F0EAE1]"
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
                onSelectLeadForEmail={(lead) => {
                  setSelectedLeadForEmail(lead);
                  setActiveTab("emails");
                }}
              />
            )}

            {/* TAB 2: BREVO EMAIL HUB (LIVE) */}
            {activeTab === "emails" && (
              <AdminEmailHub
                theme={theme}
                prefilledLead={selectedLeadForEmail || undefined}
              />
            )}

            {/* TAB 3: SMOKE CALENDAR (LIVE) */}
            {activeTab === "calendar" && <AdminCalendar theme={theme} />}

            {/* TAB 4: NOTES & COLLABORATION (LIVE) */}
            {activeTab === "notes" && <AdminNotes theme={theme} />}

            {/* TAB 5-10: COMING SOON MODULES (ALL THE SMOKE TAILORED) */}
            {activeTab === "analytics" && (
              <ComingSoonModule
                title="Live-Fire Catering Analytics"
                subtitle="Quote conversion metrics, revenue pipeline, and popular meat package statistics"
                icon="📊"
                theme={theme}
                features={[
                  "Real-time quote inquiry to booked event conversion rates",
                  "Revenue tracking: Prime Brisket Feast vs Full Live-Fire Smokehouse",
                  "Average party size & per-person yield analytics",
                  "Monthly smokehouse revenue projections and Brevo campaign performance",
                ]}
                actionTab="leads"
                actionLabel="View Current Leads Pipeline →"
                onAction={() => setActiveTab("leads")}
              />
            )}

            {activeTab === "qr-displays" && (
              <ComingSoonModule
                title="Tabletop QR Stand & Menu Generator"
                subtitle="Instant printable QR display cards for Marion's on-site trailer rigs and event tables"
                icon="📱"
                theme={theme}
                features={[
                  "Printable 4x6 tabletop acrylic QR stand templates with All The Smoke crest",
                  "Direct Google Review QR card generator for post-event guest feedback",
                  "Live digital catering menu QR code for walk-up event attendees",
                  "Pitmaster contact vCard QR download for corporate event organizers",
                ]}
                actionTab="calendar"
                actionLabel="View Smoke Calendar & Gigs →"
                onAction={() => setActiveTab("calendar")}
              />
            )}

            {activeTab === "google" && (
              <ComingSoonModule
                title="Google Business Profile & 5-Star Reviews"
                subtitle="Automated review acquisition engine and Chicago local search rankings"
                icon="⭐"
                theme={theme}
                features={[
                  "Direct 1-tap Google Review SMS/Email trigger for completed catering gigs",
                  "Google Business Profile sync for Chicago Northwest Hub & Cook County",
                  "Live review counter with pre-built pitmaster thank-you responses",
                  "Local map pack visibility tracking across Chicagoland suburbs",
                ]}
                actionTab="leads"
                actionLabel="Back to Leads Roster →"
                onAction={() => setActiveTab("leads")}
              />
            )}

            {activeTab === "services" && (
              <ComingSoonModule
                title="Smoker Menu & Service Price Configurator"
                subtitle="Live price sheet manager for per-person packages, party pans, and live-fire rigs"
                icon="🥩"
                theme={theme}
                features={[
                  "Live pricing adjustment for The Pitmaster Feast ($30/pp) and Full Smokehouse ($45/pp)",
                  "Party Pan calculator (half pans, full pans of brisket, turkey chops, mac & cheese)",
                  "Custom side dish add-ons (slow-simmered collards, candied yams, pit beans)",
                  "Automated sync to public website calculator and quote forms",
                ]}
                actionTab="leads"
                actionLabel="View Quote Requests →"
                onAction={() => setActiveTab("leads")}
              />
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
                actionTab="notes"
                actionLabel="Open Collaborator Notes →"
                onAction={() => setActiveTab("notes")}
              />
            )}

            {activeTab === "pitmaster-app" && (
              <ComingSoonModule
                title="Pitmaster Mobile Portal (Trailer Rig Mode)"
                subtitle="Fast, high-contrast mobile interface for Marion on-site at live-fire smokehouse events"
                icon="🔥"
                theme={theme}
                features={[
                  "1-tap offline event client slip viewer with guest count and delivery instructions",
                  "Smoker rig firebox & internal meat temp log with timer alerts",
                  "Instant dispatch call button directly to client upon rig arrival",
                  "On-site photo and video upload directly to the team media board",
                ]}
                actionTab="calendar"
                actionLabel="Open Event Smoke Schedule →"
                onAction={() => setActiveTab("calendar")}
              />
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
            <p className={`text-xs sm:text-sm mt-0.5 ${isDay ? "text-stone-600" : "text-stone-400"}`}>
              {subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAction}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C84A0A] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          {actionLabel}
        </button>
      </div>

      {/* Feature Milestones */}
      <div className="space-y-3">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDay ? "text-stone-500" : "text-stone-400"}`}>
          What We Are Wiring Up for All The Smoke:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-colors ${
                isDay
                  ? "bg-[#FAF7F2] border-[#E8DFC9] text-stone-800"
                  : "bg-[#1B1815] border-zinc-800 text-stone-300"
              }`}
            >
              <span className="text-[#FF7A00] font-bold text-sm shrink-0">✓</span>
              <span className="text-xs font-medium leading-relaxed">{feat}</span>
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

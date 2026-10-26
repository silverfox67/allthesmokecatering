"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminLogin } from "./AdminLogin";
import { AdminNotes } from "./AdminNotes";
import { SITE_CONFIG } from "@/config/site-config";

export type AdminTheme = "day" | "night";
type AdminTab = "notes" | "leads" | "email" | "calendar";

export function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("notes");
  const [theme, setTheme] = useState<AdminTheme>("night");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Check auth & saved theme preference from localStorage
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

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDay ? "bg-[#F4EFEA] text-[#1C1917]" : "bg-[#0A0A0A] text-neutral-100"
      }`}
    >
      {/* 1. TOP EXECUTIVE HEADER */}
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
              <span className="text-sm">Menu</span>
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
                    : "text-stone-700 hover:text-stone-900"
                }`}
              >
                Night
              </button>
            </div>

            <Link
              href="/"
              target="_blank"
              className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                isDay
                  ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-700 hover:text-stone-900 hover:border-[#EA580C]"
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
        {/* DESKTOP SIDEBAR */}
        <aside
          className={`hidden md:flex flex-col shrink-0 border-r transition-all duration-200 ${
            sidebarOpen ? "w-60 lg:w-64" : "w-20"
          } ${
            isDay
              ? "bg-[#FAF7F2] border-[#D8CEC1]"
              : "bg-[#121214] border-zinc-800"
          }`}
        >
          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 flex-1">
            {/* TAB 1: NOTES & MEDIA */}
            <button
              type="button"
              onClick={() => setActiveTab("notes")}
              className={`w-full text-left rounded-xl transition-all flex items-center gap-3 cursor-pointer ${
                sidebarOpen ? "px-3.5 py-2.5" : "px-2 py-2.5 justify-center"
              } ${
                activeTab === "notes"
                  ? "bg-[#EA580C] text-white shadow-md font-black"
                  : isDay
                  ? "text-stone-700 hover:bg-[#F0EAE1] hover:text-stone-900 font-bold"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white font-semibold"
              }`}
              title="Notes & Media Files"
            >
              <span className="font-mono text-xs uppercase tracking-wider shrink-0 font-bold">
                [NM]
              </span>
              {sidebarOpen && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="font-display text-xs uppercase tracking-wider truncate">
                    Notes &amp; Media
                  </span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                      activeTab === "notes"
                        ? "bg-black/30 text-white"
                        : "bg-emerald-500/20 text-emerald-600"
                    }`}
                  >
                    Live
                  </span>
                </div>
              )}
            </button>

            {/* TAB 2: LEADS PIPELINE */}
            <button
              type="button"
              onClick={() => setActiveTab("leads")}
              className={`w-full text-left rounded-xl transition-all flex items-center gap-3 cursor-pointer ${
                sidebarOpen ? "px-3.5 py-2.5" : "px-2 py-2.5 justify-center"
              } ${
                activeTab === "leads"
                  ? "bg-[#EA580C] text-white shadow-md font-black"
                  : isDay
                  ? "text-stone-700 hover:bg-[#F0EAE1] hover:text-stone-900 font-bold"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white font-semibold"
              }`}
              title="Leads Pipeline"
            >
              <span className="font-mono text-xs uppercase tracking-wider shrink-0 font-bold">
                [LP]
              </span>
              {sidebarOpen && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="font-display text-xs uppercase tracking-wider truncate">
                    Leads Pipeline
                  </span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${
                      activeTab === "leads"
                        ? "bg-black/30 text-white"
                        : isDay
                        ? "text-stone-500"
                        : "text-zinc-500"
                    }`}
                  >
                    Phase 2
                  </span>
                </div>
              )}
            </button>

            {/* TAB 3: BREVO EMAIL HUB */}
            <button
              type="button"
              onClick={() => setActiveTab("email")}
              className={`w-full text-left rounded-xl transition-all flex items-center gap-3 cursor-pointer ${
                sidebarOpen ? "px-3.5 py-2.5" : "px-2 py-2.5 justify-center"
              } ${
                activeTab === "email"
                  ? "bg-[#EA580C] text-white shadow-md font-black"
                  : isDay
                  ? "text-stone-700 hover:bg-[#F0EAE1] hover:text-stone-900 font-bold"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white font-semibold"
              }`}
              title="Brevo Email Hub"
            >
              <span className="font-mono text-xs uppercase tracking-wider shrink-0 font-bold">
                [BH]
              </span>
              {sidebarOpen && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="font-display text-xs uppercase tracking-wider truncate">
                    Brevo Email Hub
                  </span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                      activeTab === "email"
                        ? "bg-black/30 text-white"
                        : "text-emerald-600"
                    }`}
                  >
                    Active
                  </span>
                </div>
              )}
            </button>

            {/* TAB 4: CATERING CALENDAR */}
            <button
              type="button"
              onClick={() => setActiveTab("calendar")}
              className={`w-full text-left rounded-xl transition-all flex items-center gap-3 cursor-pointer ${
                sidebarOpen ? "px-3.5 py-2.5" : "px-2 py-2.5 justify-center"
              } ${
                activeTab === "calendar"
                  ? "bg-[#EA580C] text-white shadow-md font-black"
                  : isDay
                  ? "text-stone-700 hover:bg-[#F0EAE1] hover:text-stone-900 font-bold"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white font-semibold"
              }`}
              title="Catering Calendar"
            >
              <span className="font-mono text-xs uppercase tracking-wider shrink-0 font-bold">
                [CC]
              </span>
              {sidebarOpen && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="font-display text-xs uppercase tracking-wider truncate">
                    Catering Calendar
                  </span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${
                      activeTab === "calendar"
                        ? "bg-black/30 text-white"
                        : isDay
                        ? "text-stone-500"
                        : "text-zinc-500"
                    }`}
                  >
                    Phase 2
                  </span>
                </div>
              )}
            </button>
          </nav>

          {/* Sidebar Footer Info */}
          {sidebarOpen && (
            <div
              className={`p-4 border-t text-[11px] space-y-2 ${
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
                  {isDay ? "Daylight Paper" : "Smokehouse Dark"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  Forwarding:
                </span>
                <span className="text-emerald-600 font-bold">Gmail Active</span>
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
              className={`relative w-72 max-w-[85vw] h-full p-5 flex flex-col z-10 shadow-2xl transition-all ${
                isDay
                  ? "bg-[#FAF7F2] text-stone-900 border-r border-[#D8CEC1]"
                  : "bg-[#141417] text-white border-r border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-700/40">
                <div className="flex items-center gap-2.5">
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

              {/* Day / Night Switcher in Mobile Drawer */}
              <div className="py-4 border-b border-zinc-700/30">
                <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-2">
                  Theme Appearance:
                </div>
                <div
                  className={`grid grid-cols-2 p-1 rounded-xl border text-xs font-bold ${
                    isDay
                      ? "bg-[#E2DACF] border-[#D0C4B5]"
                      : "bg-zinc-900 border-zinc-800"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleTheme("day")}
                    className={`py-1.5 rounded-lg text-center font-bold ${
                      isDay
                        ? "bg-[#C8A97E] text-stone-950 font-black shadow"
                        : "text-zinc-400"
                    }`}
                  >
                    Day
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleTheme("night")}
                    className={`py-1.5 rounded-lg text-center font-bold ${
                      !isDay
                        ? "bg-[#EA580C] text-white shadow font-black"
                        : "text-stone-700"
                    }`}
                  >
                    Night
                  </button>
                </div>
              </div>

              {/* Mobile Tabs */}
              <nav className="py-4 space-y-2 flex-1 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("notes");
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-display text-xs uppercase tracking-wider flex items-center justify-between font-bold ${
                    activeTab === "notes"
                      ? "bg-[#EA580C] text-white shadow-md font-black"
                      : isDay
                      ? "bg-[#F0EAE1] text-stone-900"
                      : "bg-zinc-900 text-zinc-300"
                  }`}
                >
                  <span>Notes &amp; Media</span>
                  <span className="text-[9px] bg-black/30 px-2 py-0.5 rounded-full text-white">
                    Live
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("leads");
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-display text-xs uppercase tracking-wider flex items-center justify-between font-bold ${
                    activeTab === "leads"
                      ? "bg-[#EA580C] text-white shadow-md font-black"
                      : isDay
                      ? "bg-[#F0EAE1] text-stone-900"
                      : "bg-zinc-900 text-zinc-300"
                  }`}
                >
                  <span>Leads Pipeline</span>
                  <span className="text-[9px] text-zinc-400 font-sans">Phase 2</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("email");
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-display text-xs uppercase tracking-wider flex items-center justify-between font-bold ${
                    activeTab === "email"
                      ? "bg-[#EA580C] text-white shadow-md font-black"
                      : isDay
                      ? "bg-[#F0EAE1] text-stone-900"
                      : "bg-zinc-900 text-zinc-300"
                  }`}
                >
                  <span>Brevo Email Hub</span>
                  <span className="text-[9px] text-emerald-500 font-sans">Active</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("calendar");
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-display text-xs uppercase tracking-wider flex items-center justify-between font-bold ${
                    activeTab === "calendar"
                      ? "bg-[#EA580C] text-white shadow-md font-black"
                      : isDay
                      ? "bg-[#F0EAE1] text-stone-900"
                      : "bg-zinc-900 text-zinc-300"
                  }`}
                >
                  <span>Catering Calendar</span>
                  <span className="text-[9px] text-zinc-400 font-sans">Phase 2</span>
                </button>
              </nav>

              {/* Mobile Drawer Footer Actions */}
              <div className="pt-4 border-t border-zinc-700/30 space-y-2">
                <Link
                  href="/"
                  target="_blank"
                  className="w-full py-2.5 px-3 rounded-xl border border-zinc-700 text-center text-xs font-semibold block text-zinc-300 hover:text-white"
                >
                  View Public Site →
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-center text-xs font-bold block"
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
            {/* TAB 1: NOTES & MEDIA (FULLY OPERATIONAL) */}
            {activeTab === "notes" && <AdminNotes theme={theme} />}

            {/* TAB 2: LEADS PIPELINE PLACEHOLDER */}
            {activeTab === "leads" && (
              <div
                className={`p-8 sm:p-12 rounded-3xl border space-y-6 text-center max-w-2xl mx-auto transition-colors duration-200 ${
                  isDay
                    ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm text-stone-900"
                    : "bg-[#141417] border-zinc-800"
                }`}
              >
                <div className="space-y-2">
                  <span className="text-[11px] uppercase font-extrabold tracking-widest text-[#FF8C38]">
                    Leads Pipeline
                  </span>
                  <h2
                    className={`font-display text-2xl font-bold ${
                      isDay ? "text-[#1C1917]" : "text-white"
                    }`}
                  >
                    Catering Leads &amp; Inquiry Pipeline
                  </h2>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isDay ? "text-stone-600 font-medium" : "text-zinc-400"
                    }`}
                  >
                    Every quote inquiry submitted on the website is currently forwarded in real time to{" "}
                    <strong className={isDay ? "text-[#C84A0A]" : "text-amber-400"}>
                      boldenmarion83@gmail.com
                    </strong>.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-xl border text-left space-y-2 text-xs ${
                    isDay
                      ? "bg-[#FAF8F5] border-[#D8CEC1]"
                      : "bg-zinc-900 border-zinc-800"
                  }`}
                >
                  <div
                    className={`flex items-center justify-between font-bold uppercase tracking-wider ${
                      isDay ? "text-stone-700" : "text-zinc-300"
                    }`}
                  >
                    <span>Active Notification Route:</span>
                    <span className="text-emerald-600 font-black">Active</span>
                  </div>
                  <p className={isDay ? "text-stone-700 leading-relaxed" : "text-zinc-400"}>
                    1. Customer submits quote form on website →<br />
                    2. Brevo sends instant Commissary Dispatch Slip to{" "}
                    <span className={`font-mono font-bold ${isDay ? "text-stone-900" : "text-white"}`}>
                      boldenmarion83@gmail.com
                    </span><br />
                    3. Customer receives branded confirmation from{" "}
                    <span className={`font-mono font-bold ${isDay ? "text-stone-900" : "text-white"}`}>
                      marion@allthesmokecatering.com
                    </span>
                  </p>
                </div>

                <p className={`text-xs ${isDay ? "text-stone-500 font-medium" : "text-zinc-500"}`}>
                  Phase 2: We will add full in-dashboard lead status stages (New, Contacted, Quoted, Booked, Completed).
                </p>
              </div>
            )}

            {/* TAB 3: BREVO EMAIL HUB PLACEHOLDER */}
            {activeTab === "email" && (
              <div
                className={`p-8 sm:p-12 rounded-3xl border space-y-6 max-w-3xl mx-auto transition-colors duration-200 ${
                  isDay
                    ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm text-stone-900"
                    : "bg-[#141417] border-zinc-800"
                }`}
              >
                <div className="text-center space-y-2">
                  <span className="text-[11px] uppercase font-extrabold tracking-widest text-emerald-600 font-black">
                    Brevo Integration
                  </span>
                  <h2
                    className={`font-display text-2xl font-bold ${
                      isDay ? "text-[#1C1917]" : "text-white"
                    }`}
                  >
                    Brevo Email &amp; Forwarding Hub
                  </h2>
                  <p className={`text-xs sm:text-sm ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
                    All catering notifications are active and delivering directly to your personal email.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      isDay
                        ? "bg-[#FAF8F5] border-[#D8CEC1]"
                        : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <span
                      className={`text-[10px] uppercase font-bold ${
                        isDay ? "text-stone-500" : "text-zinc-500"
                      }`}
                    >
                      Primary Delivery Inbox
                    </span>
                    <div
                      className={`font-mono text-sm font-bold ${
                        isDay ? "text-[#C84A0A]" : "text-amber-400"
                      }`}
                    >
                      boldenmarion83@gmail.com
                    </div>
                    <p className={`text-[11px] ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
                      Marion&apos;s personal Gmail receiving all quote alerts &amp; notes.
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      isDay
                        ? "bg-[#FAF8F5] border-[#D8CEC1]"
                        : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <span
                      className={`text-[10px] uppercase font-bold ${
                        isDay ? "text-stone-500" : "text-zinc-500"
                      }`}
                    >
                      Kitchen Backup Copy
                    </span>
                    <div
                      className={`font-mono text-sm font-bold ${
                        isDay ? "text-stone-800" : "text-zinc-300"
                      }`}
                    >
                      bbqcateringking83@gmail.com
                    </div>
                    <p className={`text-[11px] ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
                      Kitchen operations copy.
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      isDay
                        ? "bg-[#FAF8F5] border-[#D8CEC1]"
                        : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <span
                      className={`text-[10px] uppercase font-bold ${
                        isDay ? "text-stone-500" : "text-zinc-500"
                      }`}
                    >
                      Verified Outbound Sender A
                    </span>
                    <div className="font-mono text-sm text-emerald-600 font-bold">
                      marion@allthesmokecatering.com
                    </div>
                    <p className={`text-[11px] ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
                      Direct Pitmaster sender for client quotes &amp; proposals.
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      isDay
                        ? "bg-[#FAF8F5] border-[#D8CEC1]"
                        : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <span
                      className={`text-[10px] uppercase font-bold ${
                        isDay ? "text-stone-500" : "text-zinc-500"
                      }`}
                    >
                      Verified Outbound Sender B
                    </span>
                    <div className="font-mono text-sm text-emerald-600 font-bold">
                      info@allthesmokecatering.com
                    </div>
                    <p className={`text-[11px] ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
                      Official website contact &amp; kitchen commissary slips.
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl border space-y-1.5 sm:col-span-2 ${
                      isDay
                        ? "bg-[#FAF8F5] border-[#D8CEC1]"
                        : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <span
                      className={`text-[10px] uppercase font-bold ${
                        isDay ? "text-stone-500" : "text-zinc-500"
                      }`}
                    >
                      Verified Outbound Sender C
                    </span>
                    <div className="font-mono text-sm text-emerald-600 font-bold">
                      support@allthesmokecatering.com
                    </div>
                    <p className={`text-[11px] ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
                      Event modifications, invoicing receipts, &amp; post-event customer care.
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
                    isDay
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-medium"
                      : "bg-emerald-950/40 border-emerald-800/60 text-emerald-200"
                  }`}
                >
                  <span>
                    <strong>Zoho Integration:</strong> Can wait until you are ready! Brevo handles all outbound delivery and Gmail forwarding seamlessly today.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 4: CATERING CALENDAR PLACEHOLDER */}
            {activeTab === "calendar" && (
              <div
                className={`p-8 sm:p-12 rounded-3xl border space-y-6 text-center max-w-2xl mx-auto transition-colors duration-200 ${
                  isDay
                    ? "bg-[#FFFFFF] border-[#E2DACF] shadow-sm text-stone-900"
                    : "bg-[#141417] border-zinc-800"
                }`}
              >
                <div className="space-y-2">
                  <span className="text-[11px] uppercase font-extrabold tracking-widest text-[#FF7A00]">
                    Calendar Schedule
                  </span>
                  <h2
                    className={`font-display text-2xl font-bold ${
                      isDay ? "text-[#1C1917]" : "text-white"
                    }`}
                  >
                    Live-Fire Smoker Rig &amp; Event Calendar
                  </h2>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isDay ? "text-stone-600 font-medium" : "text-zinc-400"
                    }`}
                  >
                    Schedule weekend smoke sessions, lock in mobile rig bookings, and track deposit deadlines.
                  </p>
                </div>

                <p className={`text-xs ${isDay ? "text-stone-500" : "text-zinc-500"}`}>
                  Phase 2: We will connect interactive calendar bookings synced with quote inquiries.
                </p>
              </div>
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

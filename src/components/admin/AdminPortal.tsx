"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminLogin } from "./AdminLogin";
import { AdminNotes } from "./AdminNotes";
import { SITE_CONFIG } from "@/config/site-config";

export type AdminTheme = "dark" | "butcher-paper";
type AdminTab = "notes" | "leads" | "email" | "calendar";

export function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("notes");
  const [theme, setTheme] = useState<AdminTheme>("dark");

  // Check auth & saved theme preference from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth =
        localStorage.getItem("ats_admin_auth") === "true" ||
        sessionStorage.getItem("ats_admin_auth") === "true";
      setIsAuthenticated(isAuth);

      const savedTheme = localStorage.getItem("ats_admin_theme") as AdminTheme | null;
      if (savedTheme === "butcher-paper" || savedTheme === "dark") {
        setTheme(savedTheme);
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

  const isButcher = theme === "butcher-paper";

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isButcher
          ? "bg-[#F4EFEA] text-[#1C1917]"
          : "bg-[#0A0A0A] text-neutral-100"
      }`}
    >
      {/* 1. TOP EXECUTIVE HEADER */}
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-200 ${
          isButcher
            ? "bg-[#EBE4DB]/95 border-b border-[#D8CEC1] shadow-md"
            : "bg-[#121214]/95 border-b border-zinc-800 shadow-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3">
          {/* Logo & Pitmaster Identification */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="relative w-10 h-10 sm:w-11 sm:h-11 transition-transform hover:scale-105 shrink-0"
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

            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`font-display text-sm sm:text-xl font-bold tracking-tight leading-tight ${
                    isButcher ? "text-[#1C1917]" : "text-white"
                  }`}
                >
                  PITMASTER COMMAND CENTER
                </h1>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#EA580C]/20 border border-[#EA580C]/50 text-[#FF8C38] hidden sm:inline-block">
                  Live
                </span>
              </div>
              <p
                className={`text-[11px] ${
                  isButcher ? "text-stone-600 font-medium" : "text-zinc-400"
                }`}
              >
                Marion Bolden • Chicago Live-Fire Catering
              </p>
            </div>
          </div>

          {/* Right Header Actions & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1-Tap Theme Switcher: Dark vs Butcher Paper */}
            <div
              className={`inline-flex p-0.5 sm:p-1 rounded-xl border text-[11px] sm:text-xs font-bold ${
                isButcher
                  ? "bg-[#E2DACF] border-[#D0C4B5]"
                  : "bg-zinc-900 border-zinc-700"
              }`}
              title="Switch between Smokehouse Dark and Texas Butcher Paper Daylight Mode"
            >
              <button
                type="button"
                onClick={() => handleToggleTheme("dark")}
                className={`px-2 sm:px-3 py-1 rounded-lg transition-all font-bold ${
                  theme === "dark"
                    ? "bg-[#EA580C] text-white shadow-sm font-black"
                    : isButcher
                    ? "text-stone-700 hover:text-stone-900"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => handleToggleTheme("butcher-paper")}
                className={`px-2 sm:px-3 py-1 rounded-lg transition-all font-bold ${
                  theme === "butcher-paper"
                    ? "bg-[#C8A97E] text-stone-950 font-black shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Butcher Paper
              </button>
            </div>

            <Link
              href="/"
              target="_blank"
              className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                isButcher
                  ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-700 hover:text-stone-900 hover:border-[#EA580C]"
                  : "border-zinc-700 hover:border-[#EA580C] text-zinc-300 hover:text-white"
              }`}
            >
              <span>View Public Site</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className={`inline-flex items-center px-3 sm:px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isButcher
                  ? "bg-[#FAF8F5] border-[#D8CEC1] text-stone-700 hover:text-red-700 hover:border-red-400"
                  : "bg-zinc-900 hover:bg-zinc-800 border-zinc-700 hover:border-red-500/80 text-zinc-300 hover:text-red-400"
              }`}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* 2. 4 CORE TABS NAVIGATION */}
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-8 border-t overflow-x-auto scrollbar-none transition-colors duration-200 ${
            isButcher ? "border-[#D8CEC1]" : "border-zinc-800/80"
          }`}
        >
          <nav className="flex items-center gap-2 sm:gap-3 py-2">
            {/* TAB 1: NOTES & MEDIA (ACTIVE & LIVE) */}
            <button
              type="button"
              onClick={() => setActiveTab("notes")}
              className={`px-4 py-2 rounded-xl font-display text-xs sm:text-sm font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === "notes"
                  ? "bg-[#EA580C] text-white shadow-[0_0_12px_rgba(234,88,12,0.4)] font-black"
                  : isButcher
                  ? "bg-[#FAF7F2] text-stone-700 hover:text-stone-900 hover:bg-[#F0EAE1] border border-[#D8CEC1]"
                  : "bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              <span>Notes &amp; Media</span>
              <span className="text-[10px] bg-black/40 text-white px-1.5 py-0.5 rounded-full font-sans font-bold">
                Live
              </span>
            </button>

            {/* TAB 2: LEADS PIPELINE */}
            <button
              type="button"
              onClick={() => setActiveTab("leads")}
              className={`px-4 py-2 rounded-xl font-display text-xs sm:text-sm font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === "leads"
                  ? "bg-[#EA580C] text-white shadow-[0_0_12px_rgba(234,88,12,0.4)] font-black"
                  : isButcher
                  ? "bg-[#FAF7F2] text-stone-700 hover:text-stone-900 hover:bg-[#F0EAE1] border border-[#D8CEC1]"
                  : "bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              <span>Leads Pipeline</span>
              <span className="text-[10px] text-amber-500 font-sans font-semibold">
                (Phase 2)
              </span>
            </button>

            {/* TAB 3: BREVO EMAIL HUB */}
            <button
              type="button"
              onClick={() => setActiveTab("email")}
              className={`px-4 py-2 rounded-xl font-display text-xs sm:text-sm font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === "email"
                  ? "bg-[#EA580C] text-white shadow-[0_0_12px_rgba(234,88,12,0.4)] font-black"
                  : isButcher
                  ? "bg-[#FAF7F2] text-stone-700 hover:text-stone-900 hover:bg-[#F0EAE1] border border-[#D8CEC1]"
                  : "bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              <span>Brevo Email Hub</span>
              <span className="text-[10px] text-emerald-600 font-sans font-bold">
                ● Connected
              </span>
            </button>

            {/* TAB 4: CATERING CALENDAR */}
            <button
              type="button"
              onClick={() => setActiveTab("calendar")}
              className={`px-4 py-2 rounded-xl font-display text-xs sm:text-sm font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === "calendar"
                  ? "bg-[#EA580C] text-white shadow-[0_0_12px_rgba(234,88,12,0.4)] font-black"
                  : isButcher
                  ? "bg-[#FAF7F2] text-stone-700 hover:text-stone-900 hover:bg-[#F0EAE1] border border-[#D8CEC1]"
                  : "bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              <span>Catering Calendar</span>
              <span className="text-[10px] text-amber-500 font-sans font-semibold">
                (Phase 2)
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        {/* TAB 1: NOTES & MEDIA (FULLY OPERATIONAL) */}
        {activeTab === "notes" && <AdminNotes theme={theme} />}

        {/* TAB 2: LEADS PIPELINE PLACEHOLDER */}
        {activeTab === "leads" && (
          <div
            className={`p-8 sm:p-12 rounded-3xl border space-y-6 text-center max-w-2xl mx-auto transition-colors duration-200 ${
              isButcher
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
                  isButcher ? "text-[#1C1917]" : "text-white"
                }`}
              >
                Catering Leads &amp; Inquiry Pipeline
              </h2>
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isButcher ? "text-stone-600 font-medium" : "text-zinc-400"
                }`}
              >
                Every quote inquiry submitted on the website is currently forwarded in real time to{" "}
                <strong className={isButcher ? "text-[#C84A0A]" : "text-amber-400"}>
                  boldenmarion83@gmail.com
                </strong>.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border text-left space-y-2 text-xs ${
                isButcher
                  ? "bg-[#FAF8F5] border-[#D8CEC1]"
                  : "bg-zinc-900 border-zinc-800"
              }`}
            >
              <div
                className={`flex items-center justify-between font-bold uppercase tracking-wider ${
                  isButcher ? "text-stone-700" : "text-zinc-300"
                }`}
              >
                <span>Active Notification Route:</span>
                <span className="text-emerald-600 font-black">Active</span>
              </div>
              <p className={isButcher ? "text-stone-700 leading-relaxed" : "text-zinc-400"}>
                1. Customer submits quote form on website →<br />
                2. Brevo sends instant Commissary Dispatch Slip to{" "}
                <span className={`font-mono font-bold ${isButcher ? "text-stone-900" : "text-white"}`}>
                  boldenmarion83@gmail.com
                </span><br />
                3. Customer receives branded confirmation from{" "}
                <span className={`font-mono font-bold ${isButcher ? "text-stone-900" : "text-white"}`}>
                  marion@allthesmokecatering.com
                </span>
              </p>
            </div>

            <p className={`text-xs ${isButcher ? "text-stone-500 font-medium" : "text-zinc-500"}`}>
              Phase 2: We will add full in-dashboard lead status stages (New, Contacted, Quoted, Booked, Completed).
            </p>
          </div>
        )}

        {/* TAB 3: BREVO EMAIL HUB PLACEHOLDER */}
        {activeTab === "email" && (
          <div
            className={`p-8 sm:p-12 rounded-3xl border space-y-6 max-w-3xl mx-auto transition-colors duration-200 ${
              isButcher
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
                  isButcher ? "text-[#1C1917]" : "text-white"
                }`}
              >
                Brevo Email &amp; Forwarding Hub
              </h2>
              <p className={`text-xs sm:text-sm ${isButcher ? "text-stone-600" : "text-zinc-400"}`}>
                All catering notifications are active and delivering directly to your personal email.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div
                className={`p-4 rounded-xl border space-y-1.5 ${
                  isButcher
                    ? "bg-[#FAF8F5] border-[#D8CEC1]"
                    : "bg-zinc-900 border-zinc-800"
                }`}
              >
                <span
                  className={`text-[10px] uppercase font-bold ${
                    isButcher ? "text-stone-500" : "text-zinc-500"
                  }`}
                >
                  Primary Delivery Inbox
                </span>
                <div
                  className={`font-mono text-sm font-bold ${
                    isButcher ? "text-[#C84A0A]" : "text-amber-400"
                  }`}
                >
                  boldenmarion83@gmail.com
                </div>
                <p className={`text-[11px] ${isButcher ? "text-stone-600" : "text-zinc-400"}`}>
                  Marion&apos;s personal Gmail receiving all quote alerts &amp; notes.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border space-y-1.5 ${
                  isButcher
                    ? "bg-[#FAF8F5] border-[#D8CEC1]"
                    : "bg-zinc-900 border-zinc-800"
                }`}
              >
                <span
                  className={`text-[10px] uppercase font-bold ${
                    isButcher ? "text-stone-500" : "text-zinc-500"
                  }`}
                >
                  Kitchen Backup Copy
                </span>
                <div
                  className={`font-mono text-sm font-bold ${
                    isButcher ? "text-stone-800" : "text-zinc-300"
                  }`}
                >
                  bbqcateringking83@gmail.com
                </div>
                <p className={`text-[11px] ${isButcher ? "text-stone-600" : "text-zinc-400"}`}>
                  Kitchen operations copy.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border space-y-1.5 ${
                  isButcher
                    ? "bg-[#FAF8F5] border-[#D8CEC1]"
                    : "bg-zinc-900 border-zinc-800"
                }`}
              >
                <span
                  className={`text-[10px] uppercase font-bold ${
                    isButcher ? "text-stone-500" : "text-zinc-500"
                  }`}
                >
                  Verified Outbound Sender A
                </span>
                <div className="font-mono text-sm text-emerald-600 font-bold">
                  marion@allthesmokecatering.com
                </div>
                <p className={`text-[11px] ${isButcher ? "text-stone-600" : "text-zinc-400"}`}>
                  Verified domain sender for customer quotes.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border space-y-1.5 ${
                  isButcher
                    ? "bg-[#FAF8F5] border-[#D8CEC1]"
                    : "bg-zinc-900 border-zinc-800"
                }`}
              >
                <span
                  className={`text-[10px] uppercase font-bold ${
                    isButcher ? "text-stone-500" : "text-zinc-500"
                  }`}
                >
                  Verified Outbound Sender B
                </span>
                <div className="font-mono text-sm text-emerald-600 font-bold">
                  info@allthesmokecatering.com
                </div>
                <p className={`text-[11px] ${isButcher ? "text-stone-600" : "text-zinc-400"}`}>
                  Verified domain sender for administrative dispatches.
                </p>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
                isButcher
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
              isButcher
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
                  isButcher ? "text-[#1C1917]" : "text-white"
                }`}
              >
                Live-Fire Smoker Rig &amp; Event Calendar
              </h2>
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isButcher ? "text-stone-600 font-medium" : "text-zinc-400"
                }`}
              >
                Schedule weekend smoke sessions, lock in mobile rig bookings, and track deposit deadlines.
              </p>
            </div>

            <p className={`text-xs ${isButcher ? "text-stone-500" : "text-zinc-500"}`}>
              Phase 2: We will connect interactive calendar bookings synced with quote inquiries.
            </p>
          </div>
        )}
      </main>

      {/* 4. FOOTER */}
      <footer
        className={`py-4 px-4 sm:px-8 text-center text-xs transition-colors duration-200 border-t ${
          isButcher
            ? "bg-[#EBE4DB] border-[#D8CEC1] text-stone-600 font-medium"
            : "bg-[#0E0E10] border-zinc-800/80 text-zinc-500"
        }`}
      >
        All The Smoke Catering • Pitmaster Portal • Marion Bolden
      </footer>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminPitmasterApp } from "@/components/admin/AdminPitmasterApp";
import { useWeekendDrop } from "@/utils/weekend-drop-store";
import { SITE_CONFIG } from "@/config/site-config";

type AppView = "biz-card" | "phone-intake" | "weekend-drop" | "rig-timers" | "calendar";

export function PitmasterAppClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeView, setActiveView] = useState<AppView>("biz-card");
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [showIOSTip, setShowIOSTip] = useState(false);

  // Digital Biz Card States
  const [qrDestination, setQrDestination] = useState<"quote" | "drop" | "review">("quote");
  const [isSunlightMode, setIsSunlightMode] = useState(false);
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Phone Intake Form States
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [intakeNotes, setIntakeNotes] = useState("");
  const [intakeSuccess, setIntakeSuccess] = useState(false);

  // Weekend Drop Data
  const { drop, updateDrop } = useWeekendDrop();

  // Auth & Standalone Detection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth =
        localStorage.getItem("ats_admin_auth") === "true" ||
        sessionStorage.getItem("ats_admin_auth") === "true";
      setIsAuthenticated(isAuth);

      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);

      const handleBeforeInstall = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener("beforeinstallprompt", handleBeforeInstall);

      const handleInstalled = () => {
        setInstallSuccess(true);
        setDeferredPrompt(null);
      };
      window.addEventListener("appinstalled", handleInstalled);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
        window.removeEventListener("appinstalled", handleInstalled);
      };
    }
  }, []);

  // Generate QR Code dynamically
  useEffect(() => {
    let targetUrl = "https://allthesmokecatering.com/#contact";
    if (qrDestination === "drop") targetUrl = "https://allthesmokecatering.com/#weekend-drop";
    if (qrDestination === "review") targetUrl = "https://allthesmokecatering.com/review";

    QRCode.toDataURL(targetUrl, {
      width: 340,
      margin: 1,
      color: {
        dark: isSunlightMode ? "#000000" : "#1A0E08",
        light: isSunlightMode ? "#FFFFFF" : "#FFF7ED",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code Error:", err));
  }, [qrDestination, isSunlightMode]);

  // vCard Contact Card Download (.vcf)
  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:Bolden;Marion;;;
FN:Pitmaster Marion Bolden
ORG:All The Smoke BBQ & Catering
TITLE:Master Pitmaster & Executive Operator
TEL;TYPE=CELL,VOICE:(773) 707-9988
EMAIL;TYPE=WORK,INTERNET:bbqcateringking83@gmail.com
URL:https://allthesmokecatering.com
NOTE:Chicagoland Premier Live-Fire Smoker Catering. Real Hardwood Low & Slow Barbecue.
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Pitmaster-Marion-Bolden.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Chromium / iOS Install Handler
  const handleInstallClick = async () => {
    const isApple = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    if (isApple) {
      setShowIOSTip(!showIOSTip);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice?.outcome === "accepted") {
        setInstallSuccess(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowIOSTip(true);
    }
  };

  // Save Intake to ats_pitmaster_leads
  const handleSaveIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    try {
      const existing = localStorage.getItem("ats_pitmaster_leads");
      const leads = existing ? JSON.parse(existing) : [];
      const newLead = {
        id: `lead-phone-${Date.now()}`,
        name: clientName.trim(),
        phone: clientPhone.trim(),
        email: "",
        eventType: "Phone Call Intake",
        date: eventDate || new Date().toISOString().split("T")[0],
        guestCount: parseInt(guestCount, 10) || 25,
        status: "new",
        notes: intakeNotes ? `[Phone Intake] ${intakeNotes}` : "[Phone Intake via Pitmaster App]",
        createdAt: new Date().toISOString(),
      };

      leads.unshift(newLead);
      localStorage.setItem("ats_pitmaster_leads", JSON.stringify(leads));
      setIntakeSuccess(true);
      setClientName("");
      setClientPhone("");
      setEventDate("");
      setGuestCount("");
      setIntakeNotes("");
      setTimeout(() => setIntakeSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to save intake:", err);
    }
  };

  // Sign Out
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ats_admin_auth");
      sessionStorage.removeItem("ats_admin_auth");
    }
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-amber-500 font-mono text-xs">
        Authenticating Pitmaster Console...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-stone-100 flex flex-col font-sans pb-12 selection:bg-[#EA580C] selection:text-white">
      
      {/* 1. TOP EXECUTIVE HEADER */}
      <header className="sticky top-0 z-40 bg-[#121214]/95 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden border border-amber-500/60 shadow-md bg-black">
            <Image
              src="/brand/allthesmoke-master-crest.png"
              alt="Official All The Smoke Crest"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-sm font-extrabold text-white tracking-tight">
                ATS Ops Console
              </h1>
            </div>
            <p className="text-[10px] text-amber-400 font-mono">
              Pitmaster Marion Bolden
            </p>
          </div>
        </div>

        {/* PWA Install or Status Badge */}
        <div className="flex items-center gap-2">
          {!isStandalone && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-[10.5px] font-bold text-amber-300 flex items-center gap-1 transition"
            >
              <span>📲 Install App</span>
            </button>
          )}

          <Link
            href="/admin"
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10.5px] font-bold text-stone-300 transition"
            title="Launch Full Desktop Dashboard"
          >
            Full Hub &rarr;
          </Link>
        </div>
      </header>

      {/* iOS Install Guide Drawer */}
      {showIOSTip && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 text-xs text-amber-200 flex items-start justify-between gap-3 animate-in fade-in">
          <div>
            <strong className="text-white block mb-0.5">📱 Add ATS Ops to Home Screen:</strong>
            Tap the Safari <strong>Share button (square with arrow ↑)</strong> and select <strong>&ldquo;Add to Home Screen&rdquo;</strong>. Uses the official master crest!
          </div>
          <button
            type="button"
            onClick={() => setShowIOSTip(false)}
            className="text-stone-400 hover:text-white font-bold text-sm px-1.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. ERGONOMIC GLOVE-FRIENDLY SUB-NAV BAR (PINNED) */}
      <nav className="sticky top-[57px] z-30 bg-[#0E0E10] border-b border-zinc-800/80 px-2 py-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max mx-auto max-w-lg">
          {[
            { id: "biz-card" as AppView, label: "🪪 Live Biz Card", badge: "Live QR" },
            { id: "phone-intake" as AppView, label: "📞 New Call", badge: "+ Lead" },
            { id: "weekend-drop" as AppView, label: "🔥 Saturday Drop", badge: drop.isActive ? "Open" : "Closed" },
            { id: "rig-timers" as AppView, label: "⏱️ Meat Timers", badge: "Probes" },
            { id: "calendar" as AppView, label: "📅 Calendar", badge: "Gigs" },
          ].map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveView(tab.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer select-none ${
                  isActive
                    ? "bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white shadow-md border border-amber-400/40"
                    : "bg-[#18181B] text-stone-300 hover:text-white border border-zinc-800"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive
                      ? "bg-black/30 text-amber-200"
                      : "bg-black/50 text-stone-400"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 space-y-5">
        
        {/* VIEW 1: 🪪 LIVE DIGITAL BIZ CARD & QR CODE */}
        {activeView === "biz-card" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Quick Settings Bar */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400 font-semibold text-[11px]">Mode:</span>
                <button
                  type="button"
                  onClick={() => setIsSunlightMode(false)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                    !isSunlightMode
                      ? "bg-[#EA580C] text-white shadow-sm"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  Obsidian
                </button>
                <button
                  type="button"
                  onClick={() => setIsSunlightMode(true)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                    isSunlightMode
                      ? "bg-amber-200 text-amber-950 font-black shadow-sm"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  ☀️ Sunlight
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsKioskMode(!isKioskMode)}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-stone-300 font-bold text-[11px] flex items-center gap-1 transition"
              >
                <span>{isKioskMode ? "Exit Fullscreen" : "🔍 Fullscreen"}</span>
              </button>
            </div>

            {/* THE LIVE DIGITAL BUSINESS CARD CONTAINER */}
            <div
              className={`rounded-3xl border-2 transition-all duration-300 overflow-hidden shadow-2xl ${
                isSunlightMode
                  ? "bg-[#E8DEC8] border-[#9E7D46] text-black"
                  : "bg-gradient-to-b from-[#1C1612] via-[#120F0D] to-[#0A0908] border-amber-500/50 text-white"
              } ${isKioskMode ? "p-6" : "p-5"}`}
            >
              {/* Card Header */}
              <div className="text-center space-y-2 border-b pb-4 border-amber-500/20">
                <div className="relative w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-lg bg-black">
                  <Image
                    src="/brand/allthesmoke-master-crest.png"
                    alt="Master Crest"
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h2
                    className={`text-xl font-black tracking-tight ${
                      isSunlightMode ? "text-stone-900" : "text-white"
                    }`}
                  >
                    All The Smoke BBQ &amp; Catering
                  </h2>
                  <p
                    className={`text-xs font-bold uppercase tracking-widest mt-0.5 ${
                      isSunlightMode ? "text-[#874A00]" : "text-amber-400"
                    }`}
                  >
                    Pitmaster Marion Bolden • &ldquo;Mr. Smoke&rdquo;
                  </p>
                  <p
                    className={`text-[11px] font-medium mt-0.5 ${
                      isSunlightMode ? "text-stone-700" : "text-stone-400"
                    }`}
                  >
                    Chicagoland Premier Live-Fire Smoker Operations
                  </p>
                </div>
              </div>

              {/* LIVE CAMERA SCAN QR CODE */}
              <div className="my-5 flex flex-col items-center justify-center">
                <div
                  className={`p-3 rounded-2xl shadow-xl transition-all ${
                    isSunlightMode
                      ? "bg-white border-2 border-black"
                      : "bg-[#FFF7ED] border-2 border-amber-500/80"
                  }`}
                >
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Scan to Book Marion Bolden"
                      className={`mx-auto rounded-lg ${isKioskMode ? "w-64 h-64" : "w-52 h-52"}`}
                    />
                  ) : (
                    <div className="w-52 h-52 flex items-center justify-center text-xs text-stone-500 font-mono">
                      Generating Live QR...
                    </div>
                  )}
                </div>

                <div className="text-center mt-3 space-y-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                      isSunlightMode
                        ? "bg-black text-amber-300"
                        : "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                    }`}
                  >
                    📷 Point Phone Camera to Scan
                  </span>
                  <p
                    className={`text-[11px] font-medium ${
                      isSunlightMode ? "text-stone-800" : "text-stone-400"
                    }`}
                  >
                    {qrDestination === "quote" && "Opens Instant Catering Quote & Date Checker"}
                    {qrDestination === "drop" && "Opens This Saturday's Smokehouse Drop"}
                    {qrDestination === "review" && "Opens Google 5-Star Review Form"}
                  </p>
                </div>
              </div>

              {/* QR Destination Selector */}
              <div className="pt-3 border-t border-amber-500/20">
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider block mb-1.5 text-center ${
                    isSunlightMode ? "text-stone-700" : "text-stone-400"
                  }`}
                >
                  Target Scan Destination:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "quote", label: "📋 Quote Form" },
                    { id: "drop", label: "🔥 Saturday Drop" },
                    { id: "review", label: "⭐ 5-Star Review" },
                  ].map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => setQrDestination(dest.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-[10.5px] font-bold text-center transition cursor-pointer truncate ${
                        qrDestination === dest.id
                          ? "bg-[#EA580C] text-white shadow-sm"
                          : isSunlightMode
                          ? "bg-stone-300 text-stone-800"
                          : "bg-black/60 text-stone-300 hover:text-white border border-stone-800"
                      }`}
                    >
                      {dest.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Tap-to-Call / Email Links */}
              <div
                className={`mt-4 pt-3 border-t grid grid-cols-2 gap-2 text-center text-xs font-bold ${
                  isSunlightMode ? "border-stone-400/50" : "border-stone-800"
                }`}
              >
                <a
                  href="tel:7737079988"
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                    isSunlightMode
                      ? "bg-white/80 border-stone-400 text-stone-900"
                      : "bg-black/50 border-stone-800 text-amber-300 hover:text-white"
                  }`}
                >
                  <span>📞 Call Marion</span>
                </a>
                <a
                  href={`mailto:${SITE_CONFIG.brandEmail}`}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                    isSunlightMode
                      ? "bg-white/80 border-stone-400 text-stone-900"
                      : "bg-black/50 border-stone-800 text-stone-300 hover:text-white"
                  }`}
                >
                  <span>✉️ Email Marion</span>
                </a>
              </div>

              {/* 1-Tap Save to Phone Contacts (.vcf) */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleDownloadVCard}
                  className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:brightness-105 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
                >
                  <span>📲 Save Marion to Phone Contacts (.vcf)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: 📞 + NEW PHONE CALL INTAKE FORM */}
        {activeView === "phone-intake" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="rounded-2xl bg-gradient-to-b from-[#181310] via-[#120F0D] to-[#0A0908] border border-amber-500/40 p-4 sm:p-5 shadow-xl">
              <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-[#382618]">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
                  📞
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Log Live Phone Call Intake</h3>
                  <p className="text-[11px] text-stone-400">Instantly saves to your Master Leads Dashboard</p>
                </div>
              </div>

              {intakeSuccess && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-950/60 border border-emerald-500 text-xs text-emerald-300 font-bold flex items-center gap-2 animate-in fade-in">
                  <span>✓ Lead successfully logged &amp; synced to Master Leads!</span>
                </div>
              )}

              <form onSubmit={handleSaveIntake} className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Marcus Johnson"
                    className="w-full min-h-[44px] px-3 rounded-xl bg-black/60 border border-zinc-700 text-white focus:border-[#EA580C] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="(312) 555-0199"
                      className="w-full min-h-[44px] px-3 rounded-xl bg-black/60 border border-zinc-700 text-white focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full min-h-[44px] px-3 rounded-xl bg-black/60 border border-zinc-700 text-white focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Estimated Guests
                  </label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full min-h-[44px] px-3 rounded-xl bg-black/60 border border-zinc-700 text-white focus:border-[#EA580C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Call Notes (Meats requested, location, budget)
                  </label>
                  <textarea
                    rows={3}
                    value={intakeNotes}
                    onChange={(e) => setIntakeNotes(e.target.value)}
                    placeholder="e.g. Wants Southside Smoke package with Brisket & Ribs for backyard graduation..."
                    className="w-full p-3 rounded-xl bg-black/60 border border-zinc-700 text-white focus:border-[#EA580C] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
                >
                  <span>✓ Save Client Lead &rarr;</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 3: 🔥 WEEKEND DROP QUICK-TOGGLE */}
        {activeView === "weekend-drop" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="rounded-2xl bg-gradient-to-b from-[#181310] via-[#120F0D] to-[#0A0908] border border-amber-500/40 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#382618]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Saturday Pit Drop Manager
                  </span>
                  <h3 className="text-lg font-black text-white">{drop.title}</h3>
                  <p className="text-xs text-stone-400">{drop.eventDateLabel}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    drop.isActive
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-red-500/20 text-red-400 border border-red-500/40"
                  }`}
                >
                  {drop.isActive ? "● Active / Open" : "● Offline / Closed"}
                </span>
              </div>

              {/* 1-Tap Toggle Switch */}
              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between">
                <div>
                  <strong className="text-sm font-bold text-white block">Pre-Orders Status</strong>
                  <p className="text-[11px] text-stone-400">
                    {drop.isActive
                      ? "Public can view and reserve Saturday dinner plates."
                      : "Drop is hidden or marked sold-out."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => updateDrop({ ...drop, isActive: !drop.isActive })}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer shadow-md ${
                    drop.isActive
                      ? "bg-red-600 hover:bg-red-500 text-white"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white"
                  }`}
                >
                  {drop.isActive ? "Close Drop" : "Open Drop"}
                </button>
              </div>

              {/* Current Plates Summary */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
                  Active Batch Plates:
                </span>
                {drop.options.map((opt, idx) => (
                  <div
                    key={opt.id}
                    className="p-3 rounded-xl bg-black/40 border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-amber-400 font-bold">Option #{idx + 1}: </span>
                      <strong className="text-white">{opt.title}</strong>
                    </div>
                    <span className="font-mono text-sm font-black text-amber-300">
                      ${opt.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/admin?tab=weekend-drop"
                  className="block w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-center text-xs font-bold text-stone-300 transition"
                >
                  Edit Drop Title, Cutoff Date &amp; Plates &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: ⏱️ SMOKER RIG TIMERS & PROBES */}
        {activeView === "rig-timers" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <AdminPitmasterApp theme="night" />
          </div>
        )}

        {/* VIEW 5: 📅 SMOKER CALENDAR */}
        {activeView === "calendar" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="rounded-2xl bg-gradient-to-b from-[#181310] via-[#120F0D] to-[#0A0908] border border-amber-500/40 p-5 shadow-xl text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mx-auto">
                📅
              </div>
              <h3 className="text-lg font-bold text-white">Live Smoker Rig Calendar</h3>
              <p className="text-xs text-stone-300 max-w-sm mx-auto">
                Review your upcoming booked catering dates, wedding spreads, and Saturday pit drops in the interactive calendar.
              </p>
              <div className="pt-2">
                <Link
                  href="/admin?tab=calendar"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#EA580C] hover:bg-[#FF7A00] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition"
                >
                  <span>Open Interactive Event Calendar &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 4. MASTER LAUNCHER & SIGNOUT FOOTER */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-2.5">
          <Link
            href="/admin"
            className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 border border-zinc-700 text-stone-200 font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2">
              <span>💻</span>
              <span>Launch Full Operations Hub (All 12 Modules)</span>
            </div>
            <span>&rarr;</span>
          </Link>

          <div className="flex items-center justify-between text-[11px] text-stone-500 px-1 pt-1">
            <Link href="/" className="hover:text-amber-400 transition">
              &larr; Return to Public Website
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="hover:text-red-400 transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}

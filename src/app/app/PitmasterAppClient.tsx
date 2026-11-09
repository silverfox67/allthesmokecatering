"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { SITE_CONFIG } from "@/config/site-config";

export function PitmasterAppClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [installNotice, setInstallNotice] = useState<string | null>(null);

  // Live Digital Biz Card States
  const [showBizCard, setShowBizCard] = useState(false);
  const [isSunlightMode, setIsSunlightMode] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Phone Call Intake Modal State
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [intakeNotes, setIntakeNotes] = useState("");
  const [intakeSaved, setIntakeSaved] = useState(false);

  useEffect(() => {
    // 1. Verify Authentication
    if (typeof window !== "undefined") {
      const isAuth =
        localStorage.getItem("ats_admin_auth") === "true" ||
        sessionStorage.getItem("ats_admin_auth") === "true";
      setIsAuthenticated(isAuth);

      // 2. Check if launched as standalone PWA
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);

      // 3. Register Service Worker with scope / for true WebAPK support (No Chrome badge)
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((err) => {
          console.warn("ServiceWorker registration error:", err);
        });
      }

      // 4. Capture native beforeinstallprompt event (check early head capture first)
      if ((window as any).deferredPwaPrompt) {
        setDeferredPrompt((window as any).deferredPwaPrompt);
      }

      const handleBeforeInstall = (e: any) => {
        e.preventDefault();
        (window as any).deferredPwaPrompt = e;
        setDeferredPrompt(e);
      };
      window.addEventListener("beforeinstallprompt", handleBeforeInstall);

      const handleAppInstalled = () => {
        setInstallSuccess(true);
        setInstallNotice(null);
        setDeferredPrompt(null);
        (window as any).deferredPwaPrompt = null;
      };
      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }
  }, []);

  // Generate QR Code pointing directly to official website
  useEffect(() => {
    const targetUrl = "https://allthesmokecatering.com";

    QRCode.toDataURL(targetUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: isSunlightMode ? "#000000" : "#1A0E08",
        light: isSunlightMode ? "#FFFFFF" : "#FFF7ED",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code Error:", err));
  }, [isSunlightMode]);

  // Handle Native PWA Install
  const handleInstallClick = () => {
    if (isStandalone || installSuccess) {
      window.location.href = "/admin";
      return;
    }

    const promptToUse = deferredPrompt || (window as any).deferredPwaPrompt;
    if (promptToUse) {
      try {
        promptToUse.prompt();
        promptToUse.userChoice.then((choice: any) => {
          if (choice?.outcome === "accepted") {
            setInstallSuccess(true);
            setInstallNotice(null);
          }
          setDeferredPrompt(null);
          (window as any).deferredPwaPrompt = null;
        });
        return;
      } catch (err) {
        console.warn("Install prompt error:", err);
      }
    }

    // Graceful guidance for iOS / unsupported browsers
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      setInstallNotice(
        "To add to iPhone: Tap Safari's Share button (square with arrow ↑) in bottom toolbar, then tap 'Add to Home Screen'."
      );
    } else {
      setInstallNotice(
        "Direct Home Screen Install: Tap your browser's menu (⋮ three dots at top-right) and select 'Install ATS Ops' or 'Add to Home screen'."
      );
    }
  };

  // vCard (.vcf) download
  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:Bolden;Marion;;;
FN:Pitmaster Marion Bolden
ORG:All The Smoke BBQ & Catering
TITLE:Master Pitmaster & Founder
TEL;TYPE=CELL,VOICE:(773) 707-9988
EMAIL;TYPE=WORK,INTERNET:bbqcateringking83@gmail.com
URL:https://allthesmokecatering.com
NOTE:Chicagoland Premier Live-Fire Smoker Catering. Low & Slow Hardwood Smoke.
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

  // Save Lead to ats_pitmaster_leads
  const handleSaveLead = (e: React.FormEvent) => {
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
      setIntakeSaved(true);
      setClientName("");
      setClientPhone("");
      setEventDate("");
      setGuestCount("");
      setIntakeNotes("");
      setTimeout(() => {
        setIntakeSaved(false);
        setShowIntakeModal(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to save lead:", err);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ats_admin_auth");
      sessionStorage.removeItem("ats_admin_auth");
    }
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#120F10] flex items-center justify-center text-amber-500 font-mono text-xs">
        Authenticating Pitmaster Console...
      </div>
    );
  }

  // If not authenticated, require identical password as dashboard
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#120F10] text-slate-100 flex flex-col items-center justify-center p-3 sm:p-4 selection:bg-[#EA580C] selection:text-white">
      
      {/* MASTER EXECUTIVE CARD (MATCHING BLIND COOK EXACT PROPORTIONS & AESTHETICS) */}
      <div className="w-full max-w-md bg-[#181416]/95 border border-[#EA580C]/45 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl relative my-auto">
        
        {/* Top Flame Ember Gradient Accent Line */}
        <div className="h-1 bg-gradient-to-r from-[#EA580C] via-[#FF9E2C] to-[#C8A97E]" />

        <div className="p-5 sm:p-7 text-center space-y-4 sm:space-y-5">
          
          {/* Centered App Icon Box with Glowing Green Dot */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 mx-auto">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-[#EA580C]/30 to-[#181416] border-2 border-amber-500/70 flex items-center justify-center shadow-lg shadow-[#EA580C]/25 overflow-hidden p-2">
              <div className="relative w-full h-full">
                <Image
                  src="/brand/allthesmoke-master-crest.png"
                  alt="Pitmaster Marion Bolden"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            {/* Glowing Live Green Pulsing Dot */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#181416] shadow-[0_0_8px_#10B981]" />
          </div>

          {/* Title & Tag */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] sm:text-[11px] font-black uppercase tracking-widest bg-[#EA580C]/15 text-[#FF7A00] border border-[#EA580C]/40 mb-2">
              ★ Executive Mobile &amp; Desktop Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pitmaster Marion Bolden
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-200/90 mt-0.5">
              All The Smoke BBQ &amp; Catering
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
              1-Tap Client Intake • Live Event Calendar • Inbound Leads
            </p>
          </div>

          {/* 4 PROMINENT VERTICAL ACTION BUTTONS */}
          <div className="flex flex-col gap-3 pt-1">
            
            {/* Button 1: Download & Install App (Flame Ember Gradient) */}
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full p-3.5 rounded-xl bg-gradient-to-r from-[#FF7A00] via-[#EA580C] to-[#C2410C] hover:brightness-105 text-white flex items-center justify-between shadow-lg shadow-[#EA580C]/35 border border-white/20 active:scale-[0.98] transition-all text-left font-bold cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-black/25 flex items-center justify-center shrink-0 text-white text-lg">
                  📲
                </div>
                <div>
                  <span className="block text-sm font-extrabold leading-tight text-white">
                    {isStandalone || installSuccess ? "✓ App Installed" : "Download & Install App"}
                  </span>
                  <span className="block text-[11px] text-amber-100 font-semibold mt-0.5">
                    {isStandalone || installSuccess
                      ? "Running as Standalone Mobile PWA"
                      : "Add ATS Ops to Phone Screen"}
                  </span>
                </div>
              </div>
              <span className="text-white font-black text-sm opacity-90">&rarr;</span>
            </button>

            {/* Install Notice Drawer (if guidance triggered) */}
            {installNotice && (
              <div className="p-3 bg-[#EA580C]/15 border border-[#EA580C]/45 rounded-xl text-xs text-amber-200 text-left leading-relaxed animate-in fade-in">
                {installNotice}
              </div>
            )}

            {/* Button 2: Launch Executive Dashboard (Desktop Hub) */}
            <Link
              href="/admin"
              className="w-full p-3.5 rounded-xl bg-[#1A1510]/95 hover:bg-[#251E14] text-white flex items-center justify-between border border-amber-500/40 shadow-md active:scale-[0.98] transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-[#FF7A00] flex items-center justify-center shrink-0 text-lg">
                  ✨
                </div>
                <div>
                  <span className="block text-sm font-bold leading-tight">Launch Dashboard</span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    View Leads, Client Inquiries &amp; Notes
                  </span>
                </div>
              </div>
              <span className="text-amber-400 font-black text-sm opacity-90">&rarr;</span>
            </Link>

            {/* Button 3: Live Digital Business Card (Expands below) */}
            <button
              type="button"
              onClick={() => setShowBizCard(!showBizCard)}
              className={`w-full p-3.5 rounded-xl flex items-center justify-between border shadow-md active:scale-[0.98] transition-all text-left cursor-pointer ${
                showBizCard
                  ? "bg-[#2A1D13] border-[#FF7A00] text-white"
                  : "bg-slate-900/90 hover:bg-slate-800 border-amber-500/30 text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EA580C]/20 text-[#FF7A00] flex items-center justify-center shrink-0 text-lg">
                  🪪
                </div>
                <div>
                  <span className="block text-sm font-bold leading-tight">
                    Live Digital Business Card
                  </span>
                  <span className="block text-[11px] text-amber-200/80 mt-0.5">
                    {showBizCard
                      ? "Showing Live QR Code Below (Tap to Collapse)"
                      : "Tap to Show Camera QR Code for Instant Client Scan"}
                  </span>
                </div>
              </div>
              <span className="text-amber-400 font-bold text-sm">
                {showBizCard ? "▲" : "▼"}
              </span>
            </button>

            {/* EXPANDABLE LIVE DIGITAL BUSINESS CARD BOX */}
            {showBizCard && (
              <div className="p-4 rounded-2xl border-2 transition-all duration-300 animate-in fade-in zoom-in-95 space-y-3.5 text-center shadow-2xl bg-gradient-to-b from-[#1C1612] via-[#120F0D] to-[#0A0908] border-amber-500/60">
                
                {/* Sunlight Toggle Pill */}
                <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-800">
                  <span className="text-stone-400 font-bold text-[11px]">Display Mode:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsSunlightMode(false)}
                      className={`px-2.5 py-0.5 rounded-md font-bold text-[10.5px] transition ${
                        !isSunlightMode ? "bg-[#EA580C] text-white" : "text-stone-400"
                      }`}
                    >
                      Obsidian
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSunlightMode(true)}
                      className={`px-2.5 py-0.5 rounded-md font-bold text-[10.5px] transition ${
                        isSunlightMode ? "bg-amber-200 text-stone-950 font-black" : "text-stone-400"
                      }`}
                    >
                      ☀️ Sunlight
                    </button>
                  </div>
                </div>

                {/* The QR Display */}
                <div
                  className={`p-3 rounded-2xl mx-auto inline-block shadow-xl ${
                    isSunlightMode
                      ? "bg-white border-2 border-black"
                      : "bg-[#FFF7ED] border-2 border-amber-500/80"
                  }`}
                >
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Scan to Book Marion Bolden"
                      className="w-48 h-48 mx-auto rounded-lg"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-xs text-stone-500">
                      Loading QR...
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    📷 Point Phone Camera to Scan
                  </span>
                  <p className={`text-xs font-semibold ${isSunlightMode ? "text-stone-800" : "text-stone-300"}`}>
                    Scans directly to <strong>allthesmokecatering.com</strong>
                  </p>
                </div>

                {/* Authentic Card Contact Details */}
                <div
                  className={`p-3 rounded-xl border text-xs text-left space-y-1.5 ${
                    isSunlightMode
                      ? "bg-white/70 border-stone-300 text-stone-900"
                      : "bg-black/60 border-zinc-800 text-stone-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 font-mono text-[11px]">“MR. SMOKE”</span>
                    <span className={`text-[10.5px] font-bold ${isSunlightMode ? "text-stone-700" : "text-stone-400"}`}>
                      Live-Fire Pitmaster
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                    <span className="text-[11px] text-stone-400">Phone:</span>
                    <a href="tel:7737079988" className="text-amber-300 font-bold hover:underline">
                      (773) 707-9988
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">Email:</span>
                    <a href="mailto:bbqcateringking83@gmail.com" className="text-stone-200 hover:underline text-[11px]">
                      bbqcateringking83@gmail.com
                    </a>
                  </div>
                </div>

                {/* 1-Tap Save to Phone Contacts (.vcf) */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadVCard}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#EA580C] hover:brightness-105 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>📲 Save Marion to Phone Contacts (.vcf)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Button 4: + New Phone Call Intake (Like Blind Cook) */}
            <button
              type="button"
              onClick={() => setShowIntakeModal(true)}
              className="w-full p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-between border border-slate-700 shadow-md active:scale-[0.98] transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-lg">
                  📞
                </div>
                <div>
                  <span className="block text-sm font-bold leading-tight">
                    + New Phone Call Intake
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    Log Live Client Booking While on Call
                  </span>
                </div>
              </div>
              <span className="text-emerald-400 font-black text-sm opacity-90">&rarr;</span>
            </button>

          </div>

          {/* Quick Secondary Links (Like Blind Cook) */}
          <div className="flex items-center justify-center gap-4 pt-3 border-t border-[#EA580C]/20 text-xs">
            <Link
              href="/admin?tab=calendar"
              className="text-[#FF7A00] hover:text-white font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>📅</span>
              <span>Live Event Calendar</span>
            </Link>
            <span className="text-[#EA580C]/40">•</span>
            <a
              href="tel:7737079988"
              className="text-[#FF7A00] hover:text-white font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>📞</span>
              <span>(773) 707-9988</span>
            </a>
          </div>

          {/* Executive VIP Portal Badge (Like Blind Cook) */}
          <div className="mt-2 p-3 bg-[#EA580C]/10 border border-[#EA580C]/30 rounded-2xl text-[11.5px] text-slate-200 text-center leading-relaxed">
            <span className="text-[#FF7A00] font-bold block mb-0.5">
              ★ Executive Direct Access Portal
            </span>
            <span className="text-[11px] text-slate-400">
              Private client intake &amp; live booking console for Pitmaster Marion Bolden.
            </span>
          </div>

          {/* Persistent Login Indicator & Sign Out */}
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span>✓</span> Persistent mobile login active
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-stone-400 hover:text-red-400 transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>

        </div>
      </div>

      {/* MODAL: + NEW PHONE CALL INTAKE */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#181416] border border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📞</span>
                <div>
                  <h3 className="text-base font-bold text-white">Log Phone Call Intake</h3>
                  <p className="text-[10.5px] text-stone-400">Syncs directly to Master Leads</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIntakeModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {intakeSaved ? (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-center text-xs font-bold text-emerald-300">
                ✓ Lead successfully saved to Master Dashboard!
              </div>
            ) : (
              <form onSubmit={handleSaveLead} className="space-y-3 text-xs">
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
                    className="w-full min-h-[44px] px-3 rounded-xl bg-black/70 border border-zinc-700 text-white focus:border-[#EA580C] focus:outline-none"
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
                      className="w-full min-h-[44px] px-3 rounded-xl bg-black/70 border border-zinc-700 text-white focus:border-[#EA580C] focus:outline-none"
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
                      className="w-full min-h-[44px] px-3 rounded-xl bg-black/70 border border-zinc-700 text-white focus:border-[#EA580C] focus:outline-none"
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
                    className="w-full min-h-[44px] px-3 rounded-xl bg-black/70 border border-zinc-700 text-white focus:border-[#EA580C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Call Notes (Meats, Packages, Location)
                  </label>
                  <textarea
                    rows={3}
                    value={intakeNotes}
                    onChange={(e) => setIntakeNotes(e.target.value)}
                    placeholder="e.g. Wants Pitmaster Feast with Brisket & Ribs for backyard wedding reception..."
                    className="w-full p-2.5 rounded-xl bg-black/70 border border-zinc-700 text-white focus:border-[#EA580C] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[46px] py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition"
                >
                  Save Lead to Dashboard &rarr;
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

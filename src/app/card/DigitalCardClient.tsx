"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { QuoteModal } from "@/components/forms/QuoteModal";
import { SITE_CONFIG } from "@/config/site-config";
import { IOSInstallModal } from "@/components/pwa/IOSInstallModal";

export function DigitalCardClient() {
  const [contactSaved, setContactSaved] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Check if launched inside standalone app
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);

      // Detect iOS
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
      setIsIOS(isAppleDevice);

      // 2. Check early captured install prompt
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
        setShowIOSModal(false);
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

  // 1-Tap Save Marion to Contacts (.vcf)
  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:Bolden;Marion;;;
FN:Pitmaster Marion Bolden
ORG:All The Smoke BBQ & Catering
TITLE:Master Pitmaster & Founder ("Mr. Smoke")
TEL;TYPE=CELL,VOICE:(773) 707-9988
EMAIL;TYPE=WORK,INTERNET:info@allthesmokecatering.com
URL:https://allthesmokecatering.com
NOTE:Chicagoland Premier Live-Fire Smoker Catering. Low & Slow Hardwood Smoke. Booked-to-order dispatch.
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

    setContactSaved(true);
  };

  // 1-Tap Install Public Customer PWA
  const handleInstallClick = () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    const promptToUse = deferredPrompt || (window as any).deferredPwaPrompt;
    if (promptToUse) {
      try {
        promptToUse.prompt();
        promptToUse.userChoice.then((choice: any) => {
          if (choice?.outcome === "accepted") {
            setInstallSuccess(true);
          }
          setDeferredPrompt(null);
          (window as any).deferredPwaPrompt = null;
        });
        return;
      } catch (err) {
        console.warn("Install prompt error:", err);
      }
    }

    setShowIOSModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 flex flex-col items-center justify-center p-3 sm:p-4 selection:bg-[#EA580C] selection:text-white relative">
      
      {/* Ambient Ember Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[420px] rounded-full bg-amber-600/10 blur-[130px]"
      />

      {/* MASTER DIGITAL BUSINESS CARD */}
      <div className="w-full max-w-md bg-[#141211]/95 border-2 border-[#EA580C]/50 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl relative my-auto">
        
        {/* Top Flame Accent Stripe */}
        <div className="h-1.5 bg-gradient-to-r from-[#EA580C] via-[#FF8C38] to-[#C8A97E]" />

        <div className="p-6 sm:p-7 text-center space-y-4 sm:space-y-5">
          
          {/* Centered Master Crest Emblem */}
          <div className="relative w-22 h-22 sm:w-24 sm:h-24 mx-auto">
            <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#EA580C]/25 to-[#0A0A0A] border-2 border-amber-500/70 flex items-center justify-center shadow-xl shadow-[#EA580C]/25 overflow-hidden p-2">
              <div className="relative w-full h-full">
                <Image
                  src="/brand/allthesmoke-logo.png"
                  alt="Pitmaster Marion Bolden"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
            {/* Live Indicator Dot */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#141211] shadow-[0_0_8px_#10B981]" />
          </div>

          {/* Name & Title */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-widest bg-[#EA580C]/15 text-[#FF8C38] border border-[#EA580C]/40 mb-2">
              ★ Official Live-Fire Smoker Card
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pitmaster Marion Bolden
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-200/90 mt-0.5">
              “MR. SMOKE” • All The Smoke BBQ &amp; Catering
            </p>
            <p className="text-[11px] sm:text-xs text-stone-400 mt-1">
              Chicagoland Live-Fire Smokehouse &amp; Culinary Dispatch
            </p>
          </div>

          {/* STEP 1: PRIMARY ACTION - 1-TAP SAVE TO PHONE CONTACTS */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleSaveContact}
              className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border ${
                contactSaved
                  ? "bg-emerald-600 border-emerald-400 text-white shadow-emerald-600/30"
                  : "bg-gradient-to-r from-[#FF7A00] via-[#EA580C] to-[#C2410C] hover:brightness-105 border-white/20 text-white shadow-[#EA580C]/35"
              }`}
            >
              <span className="text-lg">{contactSaved ? "✓" : "📲"}</span>
              <span>
                {contactSaved
                  ? "✓ Marion Saved to Your Contacts!"
                  : "Save Marion to My Contacts (.vcf)"}
              </span>
            </button>
            <p className="text-[10.5px] text-stone-400 mt-1.5">
              {contactSaved
                ? "Phone, email, and smokehouse links saved to your address book"
                : "1-Tap adds Marion's direct phone & email to your phone"}
            </p>
          </div>

          {/* Authentic Contact Details Card */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 text-xs text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-stone-400 font-medium">Direct Phone:</span>
              <a
                href="tel:7737079988"
                className="text-amber-300 font-extrabold text-sm hover:underline"
              >
                (773) 707-9988
              </a>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
              <span className="text-[11px] text-stone-400 font-medium">Business Email:</span>
              <a
                href="mailto:info@allthesmokecatering.com"
                className="text-stone-200 font-semibold hover:underline text-xs"
              >
                info@allthesmokecatering.com
              </a>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
              <span className="text-[11px] text-stone-400 font-medium">Operations Hub:</span>
              <span className="text-stone-300 font-semibold text-xs">
                Chicago’s Northwest Side, IL
              </span>
            </div>
          </div>

          {/* STEP 2: NATURAL UPSELL - INSTALL PUBLIC SMOKEHOUSE APP */}
          {!isStandalone && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#1C1612] to-[#120F0D] border border-amber-500/40 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-white block">
                    Install Free Smokehouse App
                  </span>
                  <span className="text-[10.5px] text-amber-200/80 block">
                    1-Tap Saturday drops &amp; catering quote calculator
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:brightness-105 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition active:scale-95 cursor-pointer shrink-0"
                >
                  {installSuccess ? "✓ Installed" : isIOS ? "Add to iPhone" : "Add App →"}
                </button>
              </div>
            </div>
          )}

          {/* 2 Quick Catering Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-left">
            <Link
              href="/#specials"
              className="p-3 rounded-xl bg-[#1A1512] hover:bg-[#251E1A] border border-amber-500/30 flex flex-col justify-between transition-all active:scale-[0.99] group shadow-sm"
            >
              <span className="text-lg mb-1">🔥</span>
              <span className="text-xs font-bold text-white leading-tight">
                Saturday Drop Plates
              </span>
              <span className="text-[10px] text-amber-400 mt-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                Pre-Order &rarr;
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setIsQuoteOpen(true)}
              className="p-3 rounded-xl bg-[#1A1512] hover:bg-[#251E1A] border border-amber-500/30 flex flex-col justify-between transition-all active:scale-[0.99] group shadow-sm text-left cursor-pointer"
            >
              <span className="text-lg mb-1">🥩</span>
              <span className="text-xs font-bold text-white leading-tight">
                Catering Quote Calculator
              </span>
              <span className="text-[10px] text-amber-400 mt-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                Estimate &rarr;
              </span>
            </button>
          </div>

          {/* Bottom Link to Full Site */}
          <div className="pt-2 border-t border-stone-800/80 flex items-center justify-center gap-3 text-xs text-stone-400">
            <Link
              href="/"
              className="hover:text-amber-400 transition-colors font-semibold"
            >
              🌐 Visit Official Website
            </Link>
            <span className="text-stone-600">•</span>
            <Link
              href="/gallery"
              className="hover:text-amber-400 transition-colors font-semibold"
            >
              Live Pit Videos
            </Link>
          </div>

        </div>
      </div>

      {/* Quote Modal */}
      {isQuoteOpen && <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />}

      {/* Visual iOS Install Guidance Modal */}
      <IOSInstallModal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
        appName="All The Smoke BBQ"
        appIcon="/icons/customer-touch-icon.png"
        appSubtitle="Official Smokehouse Mobile App"
      />
    </div>
  );
}

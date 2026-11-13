"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { QuoteModal } from "@/components/forms/QuoteModal";
import { SITE_CONFIG } from "@/config/site-config";
import { IOSInstallModal } from "@/components/pwa/IOSInstallModal";

export function PublicCustomerAppClient() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installNotice, setInstallNotice] = useState<string | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Check if running as standalone PWA
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);

      // Detect iOS
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
      setIsIOS(isAppleDevice);

      // 2. Check early captured prompt in head
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

  const handleInstallClick = () => {
    // If iOS, open the step-by-step visual guidance modal
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

    // Fallback if no native prompt is available
    setShowIOSModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 flex flex-col items-center justify-center p-3 sm:p-4 selection:bg-[#EA580C] selection:text-white relative">
      
      {/* Ambient Ember Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[400px] rounded-full bg-amber-600/10 blur-[120px]"
      />

      {/* MASTER CUSTOMER CARD */}
      <div className="w-full max-w-md bg-[#141211]/95 border border-[#EA580C]/40 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl relative my-auto">
        
        {/* Top Flame Ember Stripe */}
        <div className="h-1 bg-gradient-to-r from-[#EA580C] via-[#FF8C38] to-[#C8A97E]" />

        <div className="p-5 sm:p-6 text-center space-y-4">
          
          {/* Centered ATS Monogram Favicon with Safe Margins */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 mx-auto">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-[#EA580C]/20 to-[#0A0A0A] border-2 border-amber-500/60 flex items-center justify-center shadow-lg shadow-[#EA580C]/20 overflow-hidden p-2">
              <div className="relative w-full h-full">
                <Image
                  src="/icons/customer-icon-192.png"
                  alt="All The Smoke BBQ App"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
            {/* Live Open Indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#141211] shadow-[0_0_8px_#10B981]" />
          </div>

          {/* Title & Badge */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-widest bg-[#EA580C]/15 text-[#FF8C38] border border-[#EA580C]/40 mb-2">
              ★ Official Smokehouse App
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              All The Smoke BBQ
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-200/90 mt-0.5">
              Live-Fire Smoker &amp; Catering Dispatch
            </p>
            <p className="text-[11px] sm:text-xs text-stone-400 mt-1">
              Chicago, IL • Pitmaster Marion Bolden
            </p>
          </div>

          {/* Install Banner Button (if in mobile browser) */}
          {!isStandalone && (
            <div>
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-[#FF7A00] via-[#EA580C] to-[#C2410C] hover:brightness-105 text-white flex items-center justify-between shadow-lg shadow-[#EA580C]/30 border border-white/20 active:scale-[0.98] transition-all text-left font-bold cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/25 flex items-center justify-center shrink-0 text-white text-base">
                    📲
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-extrabold leading-tight text-white">
                      {installSuccess
                        ? "✓ App Installed on Phone"
                        : isIOS
                        ? "📲 Add to iPhone Home Screen"
                        : "Install Free Smokehouse App"}
                    </span>
                    <span className="block text-[10.5px] text-amber-100 font-semibold mt-0.5">
                      {installSuccess
                        ? "Open from your home screen"
                        : isIOS
                        ? "Tap for 3-step visual iPhone guide"
                        : "1-Tap Saturday drops & quote calculator"}
                    </span>
                  </div>
                </div>
                <span className="text-white font-black text-sm opacity-90">&rarr;</span>
              </button>

              {installNotice && (
                <div className="mt-2 p-2.5 bg-[#EA580C]/15 border border-[#EA580C]/45 rounded-xl text-xs text-amber-200 text-left leading-relaxed animate-in fade-in">
                  {installNotice}
                </div>
              )}
            </div>
          )}

          {/* 4 CORE CUSTOMER ACTION CARDS */}
          <div className="flex flex-col gap-2.5 pt-1 text-left">
            
            {/* Card 1: Saturday Smokehouse Drop */}
            <Link
              href="/#specials"
              className="p-3.5 rounded-xl bg-[#1D1815] hover:bg-[#2A221E] border border-amber-500/40 flex items-center justify-between transition-all active:scale-[0.99] group shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EA580C]/20 border border-[#EA580C]/40 text-[#FF8C38] flex items-center justify-center shrink-0 text-xl group-hover:scale-105 transition-transform">
                  🔥
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white">
                      Saturday Smokehouse Drop
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-black uppercase bg-[#EA580C] text-white">
                      Pre-Order
                    </span>
                  </div>
                  <span className="block text-[11px] text-stone-300 mt-0.5">
                    Cornish hens, smoked chicken plates &amp; tips
                  </span>
                </div>
              </div>
              <span className="text-amber-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </Link>

            {/* Card 2: Instant Catering Quote Calculator */}
            <button
              type="button"
              onClick={() => setIsQuoteOpen(true)}
              className="p-3.5 rounded-xl bg-[#1D1815] hover:bg-[#2A221E] border border-amber-500/40 flex items-center justify-between transition-all active:scale-[0.99] group shadow-md cursor-pointer text-left w-full"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-[#FFB055] flex items-center justify-center shrink-0 text-xl group-hover:scale-105 transition-transform">
                  🥩
                </div>
                <div>
                  <span className="block text-sm font-extrabold text-white">
                    Instant Catering Quote &amp; Date
                  </span>
                  <span className="block text-[11px] text-stone-300 mt-0.5">
                    Fast estimator for weddings, corporate &amp; parties
                  </span>
                </div>
              </div>
              <span className="text-amber-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </button>

            {/* Card 3: Butcher Block Menu */}
            <Link
              href="/#menu"
              className="p-3.5 rounded-xl bg-[#1D1815] hover:bg-[#2A221E] border border-stone-800 flex items-center justify-between transition-all active:scale-[0.99] group shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-800/80 border border-stone-700 text-stone-200 flex items-center justify-center shrink-0 text-xl group-hover:scale-105 transition-transform">
                  📋
                </div>
                <div>
                  <span className="block text-sm font-extrabold text-white">
                    Butcher Block Menu &amp; Pans
                  </span>
                  <span className="block text-[11px] text-stone-300 mt-0.5">
                    Slow-smoked brisket, ribs, pulled pork &amp; sides
                  </span>
                </div>
              </div>
              <span className="text-stone-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </Link>

            {/* Card 4: 1-Tap Call to Marion */}
            <a
              href="tel:7737079988"
              className="p-3.5 rounded-xl bg-[#15231D] hover:bg-[#1E322A] border border-emerald-500/40 flex items-center justify-between transition-all active:scale-[0.99] group shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shrink-0 text-xl group-hover:scale-105 transition-transform">
                  📞
                </div>
                <div>
                  <span className="block text-sm font-extrabold text-white">
                    Call Pitmaster Marion Direct
                  </span>
                  <span className="block text-[11px] text-emerald-300/90 mt-0.5">
                    (773) 707-9988 • Immediate catering consult
                  </span>
                </div>
              </div>
              <span className="text-emerald-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </a>
          </div>

          {/* Bottom Navigation Links */}
          <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
            <Link
              href="/"
              className="hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold"
            >
              <span>← Full Website</span>
            </Link>
            <span className="text-stone-600">•</span>
            <Link
              href="/review"
              className="hover:text-amber-400 transition-colors font-semibold"
            >
              ⭐ Leave Review
            </Link>
            <span className="text-stone-600">•</span>
            <a
              href="https://www.tiktok.com/@allthesmokebbq_catering"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors font-semibold"
            >
              TikTok
            </a>
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


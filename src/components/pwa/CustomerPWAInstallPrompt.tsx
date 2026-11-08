"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export function CustomerPWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSTip, setShowIOSTip] = useState(false);

  useEffect(() => {
    // Check if already in standalone display mode (PWA installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // Check if user dismissed prompt recently (7-day cooldown)
    const dismissedAt = localStorage.getItem("ats_pwa_dismissed");
    if (dismissedAt) {
      const past = parseInt(dismissedAt, 10);
      if (Date.now() - past < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Capture Chromium install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait 3.5s before popping banner
      setTimeout(() => setShowPrompt(true), 3500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // If on iOS and not dismissed, show after 4s
    let iosTimer: NodeJS.Timeout;
    if (isAppleDevice) {
      iosTimer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSTip(!showIOSTip);
      return;
    }

    if (!deferredPrompt) {
      setShowIOSTip(true);
      return;
    }

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice?.outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSTip(false);
    localStorage.setItem("ats_pwa_dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="relative rounded-2xl bg-gradient-to-b from-[#181310]/95 via-[#120F0D]/95 to-[#0A0908]/95 border-2 border-amber-500/40 p-3.5 sm:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {/* ATS Monogram Icon */}
          <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden border border-amber-500/50 shadow-md bg-black">
            <Image
              src="/brand/ats-monogram.png"
              alt="All The Smoke App"
              fill
              className="object-cover"
            />
          </div>

          {/* Text Info */}
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                Official Smokehouse App
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-white truncate">
              All The Smoke BBQ
            </h4>
            <p className="text-[11px] text-stone-300 line-clamp-1">
              1-Tap Saturday drops &amp; catering quote calculator
            </p>
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center text-xs transition cursor-pointer"
            aria-label="Dismiss app prompt"
          >
            ✕
          </button>
        </div>

        {/* Action Button */}
        <div className="mt-3 pt-2.5 border-t border-[#382618] flex items-center justify-between gap-2">
          <span className="text-[10.5px] text-stone-400 font-medium">
            No app store required • Instant install
          </span>
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-xs font-bold uppercase tracking-wider shadow-md transition active:scale-95 cursor-pointer shrink-0"
          >
            Install App &rarr;
          </button>
        </div>

        {/* iOS Tooltip */}
        {showIOSTip && (
          <div className="mt-2.5 p-2.5 rounded-xl bg-black/80 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed animate-in fade-in">
            <span className="font-bold text-white block mb-0.5">📱 To install on iPhone/iPad:</span>
            Tap the Safari <strong>Share icon</strong> (square with arrow ↑) in the bottom toolbar, then select <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
          </div>
        )}
      </div>
    </div>
  );
}


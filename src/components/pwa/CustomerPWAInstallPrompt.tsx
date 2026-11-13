"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IOSInstallModal } from "./IOSInstallModal";

export function CustomerPWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already running in standalone display mode (PWA installed)
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
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isAppleDevice);

    // Capture Chromium install prompt (check early head capture first)
    if ((window as any).deferredPwaPrompt) {
      setDeferredPrompt((window as any).deferredPwaPrompt);
      setTimeout(() => setShowPrompt(true), 3500);
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      (window as any).deferredPwaPrompt = e;
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 3500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // If on iOS and not dismissed, show banner after 3.5s
    let iosTimer: NodeJS.Timeout | null = null;
    if (isAppleDevice) {
      iosTimer = setTimeout(() => {
        setShowPrompt(true);
      }, 3500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    // On iOS devices, always show the visual 3-step guide
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    // On Android / Desktop Chromium
    const promptToUse = deferredPrompt || (window as any).deferredPwaPrompt;
    if (promptToUse) {
      try {
        promptToUse.prompt();
        const choice = await promptToUse.userChoice;
        if (choice?.outcome === "accepted") {
          setShowPrompt(false);
        }
        setDeferredPrompt(null);
        (window as any).deferredPwaPrompt = null;
        return;
      } catch (err) {
        console.warn("Install prompt error:", err);
      }
    }

    // Fallback if browser doesn't support auto-prompt
    setShowIOSModal(true);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("ats_pwa_dismissed", Date.now().toString());
  };

  if (!showPrompt) {
    return (
      <IOSInstallModal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
        appName="All The Smoke BBQ"
        appIcon="/icons/customer-touch-icon.png"
        appSubtitle="Official Smokehouse Mobile App"
      />
    );
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="relative rounded-2xl bg-gradient-to-b from-[#181310]/95 via-[#120F0D]/95 to-[#0A0908]/95 border-2 border-amber-500/50 p-3.5 sm:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* ATS Monogram Icon */}
            <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden border border-amber-500/60 shadow-md bg-black p-1 flex items-center justify-center">
              <Image
                src="/icons/customer-icon-192.png"
                alt="All The Smoke App"
                fill
                className="object-contain"
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
              {isIOS ? "Free instant add • No App Store" : "No app store required • Instant install"}
            </span>
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-xs font-bold uppercase tracking-wider shadow-md transition active:scale-95 cursor-pointer shrink-0"
            >
              {isIOS ? "📲 Add to iPhone" : "Install App →"}
            </button>
          </div>
        </div>
      </div>

      {/* Visual iOS Install Guidance Modal */}
      <IOSInstallModal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
        appName="All The Smoke BBQ"
        appIcon="/icons/customer-touch-icon.png"
        appSubtitle="Official Smokehouse Mobile App"
      />
    </>
  );
}

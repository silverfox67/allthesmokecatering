"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
  appIcon?: string;
  appSubtitle?: string;
}

export function IOSInstallModal({
  isOpen,
  onClose,
  appName = "All The Smoke BBQ",
  appIcon = "/icons/customer-touch-icon.png",
  appSubtitle = "Official Smokehouse Mobile App",
}: IOSInstallModalProps) {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent || "";
      // Check for common iOS in-app browsers (SMS/iMessage, Instagram, FB, Gmail, TikTok, etc.)
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      const inApp =
        isIOS &&
        (/FBAN|FBAV|Instagram|Twitter|Snapchat|TikTok|musical_ly|Line|MicroMessenger|GSA|Gmail/i.test(
          ua
        ) ||
          // In iOS Webview / iMessage preview, Safari string might be absent or modified
          (!ua.includes("Safari") && !ua.includes("CriOS") && !ua.includes("FxiOS")));
      setIsInAppBrowser(Boolean(inApp));
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-modal-title"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Backdrop click to dismiss */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card / Bottom Sheet on Mobile */}
      <div className="w-full sm:max-w-md bg-gradient-to-b from-[#181412] via-[#120F0D] to-[#0A0908] border-t-2 sm:border-2 border-amber-500/50 rounded-t-3xl sm:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.9)] p-5 sm:p-6 text-white overflow-hidden relative max-h-[92vh] overflow-y-auto">
        
        {/* Top Flame Ember Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EA580C] via-[#FF8C38] to-[#C8A97E]" />

        {/* Header / Dismiss */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl bg-black border border-amber-500/60 overflow-hidden p-1 shrink-0 shadow-md">
              <Image
                src={appIcon}
                alt={appName}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="inline-block text-[10px] font-black uppercase tracking-widest text-amber-400">
                iPhone / iPad Setup
              </span>
              <h3 id="ios-modal-title" className="text-base font-extrabold text-white leading-tight">
                Install {appName}
              </h3>
              <p className="text-[11px] text-stone-400">{appSubtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center text-sm transition cursor-pointer shrink-0"
            aria-label="Close guide"
          >
            ✕
          </button>
        </div>

        {/* IN-APP BROWSER WARNING (If opened from text message, Instagram, Gmail, etc.) */}
        {isInAppBrowser && (
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/70 to-red-950/60 border border-amber-500/50 text-left space-y-1.5 shadow-inner">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
              <span className="text-base">⚠️</span>
              <span>Step 0: Open in Safari First</span>
            </div>
            <p className="text-[11.5px] text-stone-200 leading-relaxed">
              You are viewing inside a message preview or app. Apple requires opening in <strong>Safari</strong> to install web apps:
            </p>
            <div className="p-2 bg-black/60 rounded-xl border border-amber-500/30 text-[11px] text-amber-200 font-medium">
              👉 Tap the <strong>Compass icon 🧭</strong> or the <strong>(···) menu</strong> at the bottom or top corner, then tap <strong>&ldquo;Open in Safari&rdquo;</strong>.
            </div>
          </div>
        )}

        {/* 3 VISUAL STEPS FOR SAFARI */}
        <div className="mt-4 space-y-3 text-left">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Follow these 3 quick steps in Safari:
          </div>

          {/* STEP 1 */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-stone-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/25 border border-blue-500/50 text-blue-400 font-black text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Tap the Share Button</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-500/20 text-blue-400 text-xs font-mono">
                  {/* Apple Share Icon */}
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2a1 1 0 0 1 1 1v10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L11 13.586V3a1 1 0 0 1 1-1z" />
                    <path d="M4 14a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4a1 1 0 1 1 2 0v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-4a1 1 0 0 1 1-1z" />
                  </svg>
                </span>
              </div>
              <p className="text-[11px] text-stone-300 mt-0.5">
                Look for the <strong>square with arrow pointing up</strong> in the bottom Safari toolbar.
              </p>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-stone-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600/25 border border-amber-500/50 text-amber-400 font-black text-sm flex items-center justify-center shrink-0">
              2
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Tap &ldquo;Add to Home Screen&rdquo;</span>
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-white text-[10px] font-bold">
                  ➕
                </span>
              </div>
              <p className="text-[11px] text-stone-300 mt-0.5">
                Scroll down the options list until you see <strong>Add to Home Screen</strong>.
              </p>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-stone-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/25 border border-emerald-500/50 text-emerald-400 font-black text-sm flex items-center justify-center shrink-0">
              3
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Tap &ldquo;Add&rdquo; in Top Right</span>
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                  Add
                </span>
              </div>
              <p className="text-[11px] text-stone-300 mt-0.5">
                Confirm by tapping <strong>Add</strong> at top right. The app will immediately appear on your iPhone screen!
              </p>
            </div>
          </div>
        </div>

        {/* POINTER ARROW TO BOTTOM TOOLBAR */}
        <div className="mt-3.5 py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center flex items-center justify-center gap-2 text-xs font-bold text-amber-300 animate-pulse">
          <span>↓</span>
          <span>Safari Share button is in the bottom bar below</span>
          <span>↓</span>
        </div>

        {/* BOTTOM ACTION */}
        <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between gap-3">
          <span className="text-[11px] text-stone-400 font-medium">
            Opens fullscreen • No App Store
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-xs font-black uppercase tracking-wider shadow-lg active:scale-95 transition cursor-pointer"
          >
            Got It &rarr;
          </button>
        </div>

      </div>
    </div>
  );
}


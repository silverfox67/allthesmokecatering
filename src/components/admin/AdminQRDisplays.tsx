"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { AdminTheme } from "./AdminPortal";

export type QRTemplateType = "business-card" | "table-tent" | "trailer-banner" | "reheating-card" | "sticker-sheet";
export type QRStyleTheme = "smokehouse-dark" | "butcher-paper" | "ink-saver-white";

export interface QRDisplayPreset {
  id: string;
  label: string;
  url: string;
  defaultHeadline: string;
  defaultSubhead: string;
  badgeText: string;
}

const QR_DESTINATION_PRESETS: QRDisplayPreset[] = [
  {
    id: "menu-tray",
    label: "🥩 Smoker Menu & Quote Tray",
    url: "https://allthesmokecatering.com/#menu",
    defaultHeadline: "SMOKED LIVE ON THE HARDWOOD RIG",
    defaultSubhead: "Scan with your phone to view today's pit offerings, meats by the pound, & catering tray options.",
    badgeText: "CATERING MENU & TRAY",
  },
  {
    id: "free-quote",
    label: "📋 Instant Catering Quote Form",
    url: "https://allthesmokecatering.com/#contact",
    defaultHeadline: "BOOK PITMASTER MARION FOR YOUR EVENT",
    defaultSubhead: "Weddings • Corporate Summits • Tailgates • Family Reunions. Lock your date with Chicago's premier live-fire pitmaster.",
    badgeText: "GET A FREE QUOTE",
  },
  {
    id: "reviews",
    label: "⭐ Google 5-Star Review Booster",
    url: "https://allthesmokecatering.com/reviews",
    defaultHeadline: "LOVED THE SMOKEHOUSE FEAST?",
    defaultSubhead: "Support a local Chicago family smokehouse! Scan to share your 5-star review in 30 seconds.",
    badgeText: "LEAVE A 5-STAR REVIEW",
  },
  {
    id: "chalkboard-specials",
    label: "🍖 Weekly Chalkboard Specials",
    url: "https://allthesmokecatering.com/specials",
    defaultHeadline: "CHICAGOLAND HARDWOOD SPECIALS",
    defaultSubhead: "Double-smoked burnt ends, cedar-plank salmon, burnt-end chili, and fruitwood smoked duck.",
    badgeText: "WEEKLY PIT SPECIALS",
  },
  {
    id: "pit-videos",
    label: "🎥 Live Smoker Rig Videos & Gallery",
    url: "https://allthesmokecatering.com/gallery",
    defaultHeadline: "WATCH MARION ROLL PURE BLUE SMOKE",
    defaultSubhead: "Watch our custom mobile trailer rig and low-and-slow hardwood pit cooks in real time.",
    badgeText: "SMOKEHOUSE GALLERY",
  },
  {
    id: "call-marion",
    label: "📞 Direct Call to Pitmaster Marion",
    url: "tel:7737079988",
    defaultHeadline: "TALK DIRECTLY WITH PITMASTER MARION",
    defaultSubhead: "Questions about your upcoming party? Call or text Marion Bolden directly at (773) 707-9988.",
    badgeText: "CALL (773) 707-9988",
  },
  {
    id: "custom",
    label: "🔗 Custom Event or Wedding URL",
    url: "https://allthesmokecatering.com",
    defaultHeadline: "WELCOME TO TODAY'S SMOKEHOUSE FEAST",
    defaultSubhead: "Handcrafted low-and-slow barbecue prepared fresh on-site for your special celebration.",
    badgeText: "ALL THE SMOKE CATERING",
  },
];

interface AdminQRDisplaysProps {
  theme: AdminTheme;
}

export function AdminQRDisplays({ theme }: AdminQRDisplaysProps) {
  const isDay = theme === "day";

  // Template State
  const [selectedTemplate, setSelectedTemplate] = useState<QRTemplateType>("table-tent");
  const [styleTheme, setStyleTheme] = useState<QRStyleTheme>("smokehouse-dark");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("menu-tray");
  const [customUrl, setCustomUrl] = useState<string>("https://allthesmokecatering.com/#menu");
  const [headline, setHeadline] = useState<string>("SMOKED LIVE ON THE HARDWOOD RIG");
  const [subhead, setSubhead] = useState<string>(
    "Scan with your phone to view today's pit offerings, meats by the pound, & catering tray options."
  );
  const [footerNote, setFooterNote] = useState<string>(
    "Pitmaster Marion Bolden • Chicago's Northwest Side • (773) 707-9988"
  );
  const [includeWifiNote, setIncludeWifiNote] = useState<boolean>(false);
  const [wifiText, setWifiText] = useState<string>("Guest WiFi: EventGuest / Pass: BBQ2026");

  // Secondary QR (for 2-sided tent cards)
  const [sideBUrl, setSideBUrl] = useState<string>("https://allthesmokecatering.com/reviews");
  const [sideBHeadline, setSideBHeadline] = useState<string>("LOVED THE SMOKEHOUSE FEAST?");
  const [sideBSubhead, setSideBSubhead] = useState<string>(
    "Support a Chicago local family pitmaster! Scan to leave Marion a 5-star Google review."
  );

  // Tent Fold Orientation (Top panel inverted 180° so both sides are upright when folded)
  const [invertTopPanel, setInvertTopPanel] = useState<boolean>(true);

  // Generated QR SVG Data
  const [qrSvgPrimary, setQrSvgPrimary] = useState<string>("");
  const [qrSvgSecondary, setQrSvgSecondary] = useState<string>("");
  const [qrDataUrlPrimary, setQrDataUrlPrimary] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Business Card Studio State (Marion's Executive Cards)
  const [cardTheme, setCardTheme] = useState<"dark" | "light">("dark");
  const [cardViewMode, setCardViewMode] = useState<"modern" | "original">("modern");
  const [cardCopied, setCardCopied] = useState<boolean>(false);

  const printAreaRef = useRef<HTMLDivElement>(null);

  // Generate QR Code SVGs whenever URL changes
  useEffect(() => {
    let isCancelled = false;
    const generateQRs = async () => {
      setIsGenerating(true);
      try {
        const primarySvg = await QRCode.toString(customUrl, {
          type: "svg",
          margin: 1,
          color: {
            dark: styleTheme === "ink-saver-white" ? "#000000" : styleTheme === "butcher-paper" ? "#1A1A1A" : "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "H",
        });

        const primaryPngUrl = await QRCode.toDataURL(customUrl, {
          width: 800,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "H",
        });

        const secondarySvg = await QRCode.toString(sideBUrl, {
          type: "svg",
          margin: 1,
          color: {
            dark: styleTheme === "ink-saver-white" ? "#000000" : styleTheme === "butcher-paper" ? "#1A1A1A" : "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "H",
        });

        if (!isCancelled) {
          setQrSvgPrimary(primarySvg);
          setQrDataUrlPrimary(primaryPngUrl);
          setQrSvgSecondary(secondarySvg);
        }
      } catch (err) {
        console.error("Failed to generate QR SVGs:", err);
      } finally {
        if (!isCancelled) setIsGenerating(false);
      }
    };

    generateQRs();
    return () => {
      isCancelled = true;
    };
  }, [customUrl, sideBUrl, styleTheme]);

  // Handle Preset Change
  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = QR_DESTINATION_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setCustomUrl(found.url);
      setHeadline(found.defaultHeadline);
      setSubhead(found.defaultSubhead);
    }
  };

  // Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(customUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // Copy Card Link
  const handleCardCopy = () => {
    navigator.clipboard.writeText(customUrl);
    setCardCopied(true);
    setTimeout(() => setCardCopied(false), 2500);
  };

  // Trigger Print Dialog
  const handlePrint = () => {
    window.print();
  };

  // Download High-Res PNG
  const handleDownloadPng = () => {
    if (!qrDataUrlPrimary) return;
    const a = document.createElement("a");
    a.href = qrDataUrlPrimary;
    a.download = `AllTheSmoke_QR_${selectedTemplate}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2
              className={`font-display text-xl sm:text-2xl font-bold tracking-tight ${
                isDay ? "text-stone-900" : "text-white"
              }`}
            >
              Tabletop QR Stands &amp; Print Marketing Engine
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 border border-amber-500/40 text-amber-400">
              Print &amp; Display Ready
            </span>
          </div>
          <p
            className={`text-xs mt-1 ${
              isDay ? "text-stone-600" : "text-zinc-400"
            }`}
          >
            Generate high-resolution printable table tent cards, smoker trailer signage, to-go stickers, and review cards for Marion&rsquo;s catering events.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              copySuccess
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                : isDay
                ? "bg-white border-stone-300 text-stone-800 hover:border-[#EA580C]"
                : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:border-amber-500/50"
            }`}
            title="Copy current QR destination link"
          >
            <span>{copySuccess ? "✓ Copied Link!" : "📋 Copy Destination Link"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isDay
                ? "bg-white border-stone-300 text-stone-800 hover:border-[#EA580C]"
                : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:border-amber-500/50"
            }`}
            title="Download crisp 800x800px QR Code PNG"
          >
            <span>📥 Download QR PNG</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="Print sheet directly or save as PDF"
          >
            <span>🖨️ Print Active Sheet (PDF)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          HERO SPOTLIGHT: PITMASTER EXECUTIVE BUSINESS CARD STUDIO (3.5" x 2")
          Modeled on executive card studio with dual themes & authentic ATS brand tokens
          ========================================================================= */}
      <div
        className={`p-5 sm:p-7 rounded-2xl border transition-all ${
          isDay
            ? "bg-white border-stone-300 shadow-md border-t-4 border-t-[#EA580C]"
            : "bg-gradient-to-br from-[#181512] via-[#141210] to-[#0D0C0A] border-[#33251B] shadow-2xl border-t-4 border-t-[#EA580C]"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-zinc-800/80">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#EA580C]/20 border border-[#EA580C]/40 text-[#FF7A00]">
                Standard US 3.5&quot; × 2&quot; • Pocket &amp; Wallet Size
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 border border-amber-500/30 text-amber-400">
                10-Card Avery 5371 / 5376 Ready
              </span>
            </div>
            <h3 className={`font-display text-lg sm:text-xl font-bold tracking-tight ${isDay ? "text-stone-900" : "text-white"}`}>
              Pitmaster Executive Business Card Kit
            </h3>
            <p className={`text-xs mt-1 ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
              Double-sided pocket card for live-fire tastings, corporate event planners, wedding catering inquiries, and Saturday drop pickups.
            </p>
          </div>

          {/* Theme & Mode Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode: Modern vs Original Scan */}
            <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs ${isDay ? "bg-stone-100 border-stone-300" : "bg-black/60 border-zinc-800"}`}>
              <button
                type="button"
                onClick={() => setCardViewMode("modern")}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  cardViewMode === "modern"
                    ? "bg-[#EA580C] text-white shadow-sm"
                    : isDay ? "text-stone-600 hover:text-stone-900" : "text-zinc-400 hover:text-white"
                }`}
              >
                ✨ 2026 Enhanced
              </button>
              <button
                type="button"
                onClick={() => setCardViewMode("original")}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  cardViewMode === "original"
                    ? "bg-[#EA580C] text-white shadow-sm"
                    : isDay ? "text-stone-600 hover:text-stone-900" : "text-zinc-400 hover:text-white"
                }`}
              >
                📷 Original Card Scan
              </button>
            </div>

            {/* Aesthetic Theme: Dark Pit vs Light Butcher Paper */}
            {cardViewMode === "modern" && (
              <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs ${isDay ? "bg-stone-100 border-stone-300" : "bg-black/60 border-zinc-800"}`}>
                <button
                  type="button"
                  onClick={() => setCardTheme("dark")}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                    cardTheme === "dark"
                      ? "bg-[#251B14] text-white border border-[#EA580C] shadow-sm"
                      : isDay ? "text-stone-600 hover:text-stone-900" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>🔥</span>
                  <span>Smokehouse Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCardTheme("light")}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                    cardTheme === "light"
                      ? "bg-[#FAF5EE] text-stone-900 border border-[#C8A97E] shadow-sm font-black"
                      : isDay ? "text-stone-600 hover:text-stone-900" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>📜</span>
                  <span>Butcher Light (Ink-Saver)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Visual Card Showcase */}
        {cardViewMode === "modern" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {/* FRONT CARD PREVIEW */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Front Side • Distressed Master Crest
              </span>
              <div
                className={`w-full max-w-[340px] aspect-[7/4] rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl border transition-all ${
                  cardTheme === "dark"
                    ? "bg-[#100D0B] border-[#4D382A] text-white"
                    : "bg-[#FAF5EE] border-[#D6C7B2] text-stone-900"
                }`}
              >
                <div className="relative w-28 h-20 mb-1">
                  <Image
                    src="/brand/allthesmoke-master-crest.png"
                    alt="All The Smoke Master Crest"
                    fill
                    className="object-contain"
                  />
                </div>
                <div
                  className={`font-display text-[10px] font-extrabold uppercase tracking-widest ${
                    cardTheme === "dark" ? "text-amber-400" : "text-[#C2410C]"
                  }`}
                >
                  CHICAGOLAND&apos;S PREMIER LIVE-FIRE SMOKEHOUSE
                </div>
                <div
                  className={`text-[9px] mt-0.5 font-medium ${
                    cardTheme === "dark" ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Pitmaster Marion Bolden • Low &amp; Slow Hardwood Smoke
                </div>
              </div>
            </div>

            {/* BACK CARD PREVIEW */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Back Side • &quot;Mr. Smoke&quot; Live Fire + Camera QR
              </span>
              <div
                className={`w-full max-w-[340px] aspect-[7/4] rounded-xl p-3.5 flex items-center justify-between relative overflow-hidden shadow-xl border transition-all ${
                  cardTheme === "dark"
                    ? "bg-[#120E0B] border-[#4D382A] text-white"
                    : "bg-[#FFFDF9] border-[#D6C7B2] text-stone-900"
                }`}
              >
                {/* Flame strip on left */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-8 opacity-90 pointer-events-none"
                  style={{
                    background:
                      cardTheme === "dark"
                        ? "linear-gradient(180deg, #F59E0B 0%, #EA580C 50%, #990000 100%)"
                        : "linear-gradient(180deg, rgba(245, 158, 11, 0.4) 0%, rgba(234, 88, 12, 0.4) 50%, rgba(153, 0, 0, 0.4) 100%)",
                  }}
                />

                <div className="pl-6 flex-1 pr-2 space-y-1 text-left z-10">
                  <div>
                    <span
                      className={`text-xl sm:text-2xl font-bold leading-none block ${
                        cardTheme === "dark" ? "text-amber-400" : "text-[#9A3412]"
                      }`}
                      style={{ fontFamily: "'Satisfy', cursive" }}
                    >
                      Mr. Smoke
                    </span>
                    <div
                      className={`w-20 h-0.5 mt-0.5 rounded-full ${
                        cardTheme === "dark" ? "bg-amber-400" : "bg-[#9A3412]"
                      }`}
                    />
                  </div>
                  <div
                    className={`text-[9px] font-black uppercase tracking-wider ${
                      cardTheme === "dark" ? "text-[#FF7A00]" : "text-[#C2410C]"
                    }`}
                  >
                    PITMASTER MARION BOLDEN
                  </div>
                  <div className="space-y-0.5 pt-0.5 text-[9px] font-mono leading-tight">
                    <div className="font-bold flex items-center gap-1">
                      <span>📞</span>
                      <span>(773) 707-9988</span>
                    </div>
                    <div
                      className={`truncate ${
                        cardTheme === "dark" ? "text-zinc-300" : "text-stone-700"
                      }`}
                    >
                      bbqcateringking83@gmail.com
                    </div>
                  </div>
                  <div
                    className={`text-[9px] font-bold tracking-tight pt-0.5 ${
                      cardTheme === "dark" ? "text-amber-400" : "text-[#C2410C]"
                    }`}
                  >
                    allthesmokecatering.com
                  </div>
                </div>

                {/* QR Code Block */}
                <div className="shrink-0 z-10 flex flex-col items-center">
                  <div className="p-1.5 bg-white rounded-lg border border-stone-200 shadow-sm">
                    <div
                      className="w-16 h-16 sm:w-18 sm:h-18"
                      dangerouslySetInnerHTML={{ __html: qrSvgPrimary }}
                    />
                  </div>
                  <span className="text-[7px] font-extrabold uppercase tracking-tight text-zinc-400 mt-1">
                    Scan For Quotes
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <span>📷</span>
                <span>Original Physical Card Scan (Front Side)</span>
              </span>
              <div className="w-full max-w-[340px] aspect-[7/4] rounded-xl overflow-hidden border border-zinc-700 shadow-xl relative bg-black">
                <Image
                  src="/brand/card-front-scan.jpg"
                  alt="Original Business Card Front Scan"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <span>📷</span>
                <span>Original Physical Card Scan (Back Side)</span>
              </span>
              <div className="w-full max-w-[340px] aspect-[7/4] rounded-xl overflow-hidden border border-zinc-700 shadow-xl relative bg-black">
                <Image
                  src="/brand/card-back-scan.jpg"
                  alt="Original Business Card Back Scan"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Feature Checklist */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl border text-xs mb-5 ${
            isDay ? "bg-stone-50 border-stone-200 text-stone-700" : "bg-black/40 border-zinc-800 text-zinc-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-[#EA580C] font-bold">✓</span>
            <span>Standard 3.5&quot; × 2&quot; US Specs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#EA580C] font-bold">✓</span>
            <span>1-Click 300 DPI VistaPrint Export</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#EA580C] font-bold">✓</span>
            <span>Avery 5371 / 5376 10-Card Sheets</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#EA580C] font-bold">✓</span>
            <span>95% Ink-Saving Butcher Light</span>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <a
              href="/business-card.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>💳</span>
              <span>Open Card Studio &amp; Print Sheets</span>
            </a>

            <button
              type="button"
              onClick={handleCardCopy}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                cardCopied
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                  : isDay
                  ? "bg-white border-stone-300 text-stone-800 hover:border-[#EA580C]"
                  : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:border-amber-500/50"
              }`}
            >
              <span>{cardCopied ? "✓ Link Copied!" : "📋 Copy Card QR Link"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span>Scan Target:</span>
            <span
              className={`px-2 py-1 rounded border text-[11px] truncate max-w-[200px] sm:max-w-[260px] ${
                isDay ? "bg-stone-100 border-stone-200 text-stone-800" : "bg-black/60 border-zinc-800 text-amber-400"
              }`}
            >
              {customUrl}
            </span>
          </div>
        </div>
      </div>

      {/* Template & Destination Selector Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Template Type Tabs */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDay ? "bg-white border-stone-300 shadow-sm" : "bg-[#141210] border-zinc-800 shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                Step 1: Choose Display Format
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Standard 8.5x11 Paper</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  id: "business-card",
                  label: "Executive Business Card",
                  icon: "💳",
                  desc: "3.5x2 double-sided pocket card & 10-up sheet",
                },
                {
                  id: "table-tent",
                  label: "Foldable Table Tent",
                  icon: "⛺",
                  desc: "2-Sided 4x6 for dining tables & buffets",
                },
                {
                  id: "trailer-banner",
                  label: "Rig & Trailer Sign",
                  icon: "🚚",
                  desc: "Large 8.5x11 display for smoker trailer",
                },
                {
                  id: "reheating-card",
                  label: "Box Insert Card",
                  icon: "📦",
                  desc: "4x6 leave-behind & reheating guide",
                },
                {
                  id: "sticker-sheet",
                  label: "2x2 Sticker Grid",
                  icon: "🏷️",
                  desc: "Multi-up sheet for to-go pans & wraps",
                },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedTemplate(tmpl.id as QRTemplateType)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedTemplate === tmpl.id
                      ? "bg-[#EA580C]/15 border-[#EA580C] text-white shadow-sm"
                      : isDay
                      ? "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 dark:text-white">
                    <span>{tmpl.icon}</span>
                    <span>{tmpl.label}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1">{tmpl.desc}</p>
                </button>
              ))}
            </div>

            {/* Tent Fold Orientation Setting (When Table Tent is Selected) */}
            {selectedTemplate === "table-tent" && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <span>🔄</span>
                    <span>Tent Fold Orientation</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {invertTopPanel ? "Top Inverted (180°)" : "Both Upright (Flat)"}
                  </span>
                </div>
                <label className="flex items-start gap-2 cursor-pointer text-stone-700 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={invertTopPanel}
                    onChange={(e) => setInvertTopPanel(e.target.checked)}
                    className="mt-0.5 rounded text-[#EA580C] focus:ring-0"
                  />
                  <span className="text-[11px] leading-tight">
                    <strong>Invert top side 180° for standing tent fold.</strong>
                    <span className="block text-[10px] text-zinc-400 mt-0.5">
                      Guarantees both sides stand right-side up when folded along the top ridge. Uncheck only if cutting into 2 separate flat cards.
                    </span>
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* 2. Destination Preset Selector */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDay ? "bg-white border-stone-300 shadow-sm" : "bg-[#141210] border-zinc-800 shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                Step 2: QR Destination Link
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Live Scan Target</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 block">Preset Purpose:</label>
              <select
                value={selectedPresetId}
                onChange={(e) => handlePresetChange(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold border outline-none ${
                  isDay
                    ? "bg-stone-50 border-stone-300 text-stone-900"
                    : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                }`}
              >
                {QR_DESTINATION_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 block">Target URL:</label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-xl text-xs font-mono border outline-none ${
                  isDay
                    ? "bg-stone-50 border-stone-300 text-stone-900"
                    : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                }`}
              />
            </div>
          </div>

          {/* 3. Text & Copy Customizer */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDay ? "bg-white border-stone-300 shadow-sm" : "bg-[#141210] border-zinc-800 shadow-md"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] block">
              Step 3: Customize Card Copy
            </span>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-0.5">Headline:</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-xl text-xs font-bold border outline-none ${
                    isDay
                      ? "bg-stone-50 border-stone-300 text-stone-900"
                      : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-0.5">Subhead Instructions:</label>
                <textarea
                  rows={2}
                  value={subhead}
                  onChange={(e) => setSubhead(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-xl text-xs border outline-none ${
                    isDay
                      ? "bg-stone-50 border-stone-300 text-stone-900"
                      : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-0.5">Footer Note:</label>
                <input
                  type="text"
                  value={footerNote}
                  onChange={(e) => setFooterNote(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-xl text-xs border outline-none ${
                    isDay
                      ? "bg-stone-50 border-stone-300 text-stone-900"
                      : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                  }`}
                />
              </div>

              {/* WiFi Toggle */}
              <div className="pt-2 border-t border-zinc-800/60">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={includeWifiNote}
                    onChange={(e) => setIncludeWifiNote(e.target.checked)}
                    className="rounded text-[#EA580C] focus:ring-0"
                  />
                  <span>Include Event Guest WiFi details on card</span>
                </label>
                {includeWifiNote && (
                  <input
                    type="text"
                    value={wifiText}
                    onChange={(e) => setWifiText(e.target.value)}
                    placeholder="e.g. WiFi: JohnsonWedding / Pass: BBQ2026"
                    className="w-full mt-2 px-3 py-1 rounded-lg text-xs bg-zinc-900 border border-zinc-700 text-white outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 4. Color / Paper Theme Selector */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              isDay ? "bg-white border-stone-300 shadow-sm" : "bg-[#141210] border-zinc-800 shadow-md"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] block">
              Step 4: Card Color Theme
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "smokehouse-dark", label: "Dark & Gold", desc: "Premium Slate" },
                { id: "butcher-paper", label: "Butcher Paper", desc: "Rustic Kraft" },
                { id: "ink-saver-white", label: "Laser White", desc: "Ink Saver" },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setStyleTheme(style.id as QRStyleTheme)}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    styleTheme === style.id
                      ? "bg-[#EA580C] text-white border-[#EA580C] font-bold shadow-sm"
                      : isDay
                      ? "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="text-xs font-bold">{style.label}</div>
                  <div className="text-[9px] opacity-75">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Printable Sheet Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
              <span>👁️</span>
              <span>Live Print Preview (Scale: Fit to Screen • Prints at 300 DPI)</span>
            </span>
            <span className="text-[11px] text-amber-400 font-bold">
              {selectedTemplate === "table-tent"
                ? "2-Sided Standing Tent (Fold in Center)"
                : selectedTemplate === "trailer-banner"
                ? "Full 8.5x11 Trailer Rig Display"
                : selectedTemplate === "reheating-card"
                ? "4x6 Catering Box Leave-Behind"
                : "2x2 Adhesive Sticker Sheet (6-Up)"}
            </span>
          </div>

          {/* PRINTABLE CONTAINER (Isolated by print CSS) */}
          <div
            id="printable-qr-display-sheet"
            ref={printAreaRef}
            className={`p-4 sm:p-6 rounded-2xl border transition-all shadow-xl overflow-hidden ${
              styleTheme === "smokehouse-dark"
                ? "bg-[#0F1012] text-white border-zinc-700/80"
                : styleTheme === "butcher-paper"
                ? "bg-[#D8C7B0] text-stone-900 border-[#B59F82]"
                : "bg-white text-stone-900 border-stone-300"
            }`}
          >
            {/* TEMPLATE 0: EXECUTIVE BUSINESS CARD (3.5" x 2" & 10-UP SHEET) */}
            {selectedTemplate === "business-card" && (
              <div className="space-y-6">
                <div className="text-center pb-2 border-b border-zinc-800">
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#FF7A00]">
                    Executive Business Card • Standard US 3.5&quot; × 2&quot; Double-Sided
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Front: Master Distressed Crest • Back: &quot;Mr. Smoke&quot; Live Fire, Direct Contacts &amp; Camera QR Code
                  </p>
                </div>

                {/* Side-by-Side Preview in Printable Sheet */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* FRONT */}
                  <div
                    className={`aspect-[7/4] rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-lg border ${
                      styleTheme === "smokehouse-dark"
                        ? "bg-[#100D0B] border-[#4D382A] text-white"
                        : "bg-[#FAF5EE] border-[#D6C7B2] text-stone-900"
                    }`}
                  >
                    <div className="relative w-32 h-20 mb-1">
                      <Image
                        src="/brand/allthesmoke-master-crest.png"
                        alt="Master Crest Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div
                      className={`font-display text-[11px] font-extrabold uppercase tracking-widest ${
                        styleTheme === "smokehouse-dark" ? "text-amber-400" : "text-[#C2410C]"
                      }`}
                    >
                      CHICAGOLAND&apos;S PREMIER LIVE-FIRE SMOKEHOUSE
                    </div>
                    <div
                      className={`text-[9px] mt-0.5 font-medium ${
                        styleTheme === "smokehouse-dark" ? "text-zinc-400" : "text-stone-600"
                      }`}
                    >
                      Authentic Hardwood Smoked • Weddings &amp; Events
                    </div>
                  </div>

                  {/* BACK */}
                  <div
                    className={`aspect-[7/4] rounded-xl p-3.5 flex items-center justify-between relative overflow-hidden shadow-lg border ${
                      styleTheme === "smokehouse-dark"
                        ? "bg-[#120E0B] border-[#4D382A] text-white"
                        : "bg-[#FFFDF9] border-[#D6C7B2] text-stone-900"
                    }`}
                  >
                    {/* Flame strip on left */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-8 opacity-90 pointer-events-none"
                      style={{
                        background:
                          styleTheme === "smokehouse-dark"
                            ? "linear-gradient(180deg, #F59E0B 0%, #EA580C 50%, #990000 100%)"
                            : "linear-gradient(180deg, rgba(245, 158, 11, 0.4) 0%, rgba(234, 88, 12, 0.4) 50%, rgba(153, 0, 0, 0.4) 100%)",
                      }}
                    />

                    <div className="pl-6 flex-1 pr-2 space-y-1 text-left z-10">
                      <div>
                        <span
                          className={`text-xl font-bold leading-none block ${
                            styleTheme === "smokehouse-dark" ? "text-amber-400" : "text-[#9A3412]"
                          }`}
                          style={{ fontFamily: "'Satisfy', cursive" }}
                        >
                          Mr. Smoke
                        </span>
                        <div
                          className={`w-18 h-0.5 mt-0.5 rounded-full ${
                            styleTheme === "smokehouse-dark" ? "bg-amber-400" : "bg-[#9A3412]"
                          }`}
                        />
                      </div>
                      <div
                        className={`text-[9px] font-black uppercase tracking-wider ${
                          styleTheme === "smokehouse-dark" ? "text-[#FF7A00]" : "text-[#C2410C]"
                        }`}
                      >
                        PITMASTER MARION BOLDEN
                      </div>
                      <div className="space-y-0.5 pt-0.5 text-[9px] font-mono leading-tight">
                        <div className="font-bold flex items-center gap-1">
                          <span>📞</span>
                          <span>(773) 707-9988</span>
                        </div>
                        <div
                          className={`truncate ${
                            styleTheme === "smokehouse-dark" ? "text-zinc-300" : "text-stone-700"
                          }`}
                        >
                          bbqcateringking83@gmail.com
                        </div>
                      </div>
                      <div
                        className={`text-[9px] font-bold tracking-tight pt-0.5 ${
                          styleTheme === "smokehouse-dark" ? "text-amber-400" : "text-[#C2410C]"
                        }`}
                      >
                        allthesmokecatering.com
                      </div>
                    </div>

                    {/* QR Code Block */}
                    <div className="shrink-0 z-10 flex flex-col items-center">
                      <div className="p-1.5 bg-white rounded-lg border border-stone-200 shadow-sm">
                        <div
                          className="w-16 h-16"
                          dangerouslySetInnerHTML={{ __html: qrSvgPrimary }}
                        />
                      </div>
                      <span className="text-[7px] font-extrabold uppercase tracking-tight text-zinc-400 mt-1">
                        Scan For Quotes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Studio Launch CTA */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="text-left space-y-0.5">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <span>🖨️</span>
                      <span>Need Avery 5371 / 5376 10-Card Print Sheets?</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      The dedicated Business Card Studio formats 10 cards per letter sheet with exact Avery perforation alignment and 300 DPI VistaPrint export.
                    </p>
                  </div>
                  <a
                    href="/business-card.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-xs font-bold uppercase tracking-wider shrink-0 transition-all hover:scale-105"
                  >
                    Open Card Studio ↗
                  </a>
                </div>
              </div>
            )}

            {/* TEMPLATE 1: FOLDABLE 2-SIDED TABLE TENT */}
            {selectedTemplate === "table-tent" && (
              <div className="space-y-6">
                {/* Table Tent Orientation Banner Guide */}
                {invertTopPanel && (
                  <div className="text-center py-1.5 px-3 text-[10px] text-amber-400 font-mono tracking-widest border border-dashed border-amber-500/40 rounded-xl bg-amber-500/10">
                    ▼ BOTTOM BASE OF FRONT SIDE (Rests on Table Surface) ▼
                  </div>
                )}

                {/* SIDE A: FRONT (Menu & Quote Tray - Inverted 180° for true 2-sided tent standing) */}
                <div
                  className={`p-6 rounded-2xl border flex flex-col items-center text-center space-y-4 transition-transform duration-300 origin-center ${
                    invertTopPanel ? "rotate-180" : ""
                  } ${
                    styleTheme === "smokehouse-dark"
                      ? "bg-[#18191D] border-amber-500/30 shadow-md"
                      : styleTheme === "butcher-paper"
                      ? "bg-[#E5D7C3] border-[#A89274]"
                      : "bg-stone-50 border-stone-300 shadow-sm"
                  }`}
                >
                  {/* Brand Crest */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10">
                      <Image
                        src="/brand/allthesmoke-logo.png"
                        alt="All The Smoke"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <h3 className="font-display text-base font-black tracking-wider uppercase">
                        All The Smoke
                      </h3>
                      <p className="text-[10px] tracking-widest uppercase font-bold text-[#EA580C]">
                        Catering • Chicago, IL
                      </p>
                    </div>
                  </div>

                  {/* Headline & Subhead */}
                  <div>
                    <h4 className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-[#FF7A00]">
                      {headline}
                    </h4>
                    <p
                      className={`text-xs mt-1 max-w-md mx-auto ${
                        styleTheme === "smokehouse-dark" ? "text-zinc-300" : "text-stone-700"
                      }`}
                    >
                      {subhead}
                    </p>
                  </div>

                  {/* High-Res QR Code Frame */}
                  <div className="p-3.5 bg-white rounded-2xl shadow-xl border-2 border-[#EA580C] inline-block relative">
                    <div
                      className="w-48 h-48 sm:w-56 sm:h-56"
                      dangerouslySetInnerHTML={{ __html: qrSvgPrimary }}
                    />
                    {/* Embedded Center Crest Emblem */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-black/95 border-2 border-[#EA580C] p-1.5 shadow-lg flex items-center justify-center">
                        <span className="text-lg">🔥</span>
                      </div>
                    </div>
                  </div>

                  <div className="inline-block px-3 py-1 rounded-full bg-[#EA580C]/20 border border-[#EA580C]/40 text-[#FF7A00] text-[11px] font-black uppercase tracking-widest">
                    ★ Point Phone Camera to Scan ★
                  </div>

                  {/* Footer & WiFi */}
                  <div className="pt-2 border-t border-zinc-700/40 text-[10px] space-y-0.5">
                    <p className="font-semibold">{footerNote}</p>
                    {includeWifiNote && (
                      <p className="font-mono font-bold text-[#EA580C]">{wifiText}</p>
                    )}
                  </div>
                </div>

                {/* FOLD CUT LINE INDICATOR */}
                <div className="py-2 flex items-center gap-3 text-zinc-500 font-mono text-[10px] uppercase">
                  <div className="flex-1 border-t-2 border-dashed border-[#EA580C]/80" />
                  <span className="px-3 py-1 rounded-full bg-[#EA580C]/20 text-[#FF7A00] border border-[#EA580C]/50 font-bold tracking-wider">
                    ▲ CREASE &amp; FOLD HERE (TOP RIDGE OF TENT) ▲
                  </span>
                  <div className="flex-1 border-t-2 border-dashed border-[#EA580C]/80" />
                </div>

                {/* SIDE B: BACK (Google 5-Star Reviews & Thank You) */}
                <div
                  className={`p-6 rounded-2xl border flex flex-col items-center text-center space-y-4 ${
                    styleTheme === "smokehouse-dark"
                      ? "bg-[#18191D] border-amber-500/30 shadow-md"
                      : styleTheme === "butcher-paper"
                      ? "bg-[#E5D7C3] border-[#A89274]"
                      : "bg-stone-50 border-stone-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 text-lg">★★★★★</span>
                    <h3 className="font-display text-base font-black tracking-wider uppercase">
                      5-Star Pitmaster Review
                    </h3>
                    <span className="text-amber-400 text-lg">★★★★★</span>
                  </div>

                  <div>
                    <h4 className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-[#FF7A00]">
                      {sideBHeadline}
                    </h4>
                    <p
                      className={`text-xs mt-1 max-w-md mx-auto ${
                        styleTheme === "smokehouse-dark" ? "text-zinc-300" : "text-stone-700"
                      }`}
                    >
                      {sideBSubhead}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-2xl shadow-xl border-2 border-amber-500 inline-block relative">
                    <div
                      className="w-48 h-48 sm:w-56 sm:h-56"
                      dangerouslySetInnerHTML={{ __html: qrSvgSecondary }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-black/95 border-2 border-amber-500 p-1.5 shadow-lg flex items-center justify-center text-amber-400 font-bold text-xs">
                        ⭐ 5★
                      </div>
                    </div>
                  </div>

                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[11px] font-black uppercase tracking-widest">
                    ★ Takes 30 Seconds • Tap 5 Stars ★
                  </div>

                  <div className="pt-2 border-t border-zinc-700/40 text-[10px]">
                    <p className="font-semibold">
                      Thank you for supporting Chicago Local Small Business! • All The Smoke Catering
                    </p>
                  </div>
                </div>

                {/* Table Tent Bottom Base Guide */}
                {invertTopPanel && (
                  <div className="text-center py-1.5 px-3 text-[10px] text-amber-400 font-mono tracking-widest border border-dashed border-amber-500/40 rounded-xl bg-amber-500/10">
                    ▼ BOTTOM BASE OF BACK SIDE (Rests on Table Surface) ▼
                  </div>
                )}
              </div>
            )}

            {/* TEMPLATE 2: SMOKER RIG & TRAILER BANNER SIGN */}
            {selectedTemplate === "trailer-banner" && (
              <div className="p-8 sm:p-12 flex flex-col items-center text-center space-y-6">
                {/* Gigantic Header */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EA580C]/20 border border-[#EA580C]/50 text-[#FF7A00] text-xs font-black uppercase tracking-widest">
                    <span>🔥</span>
                    <span>Pitmaster Marion Bolden Live Smokehouse</span>
                    <span>🔥</span>
                  </div>
                  <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
                    ALL THE SMOKE
                  </h1>
                  <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-widest text-[#FF7A00]">
                    CATERING &amp; EVENTS
                  </h2>
                </div>

                <div className="max-w-lg">
                  <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white">
                    {headline}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      styleTheme === "smokehouse-dark" ? "text-zinc-300" : "text-stone-700"
                    }`}
                  >
                    {subhead}
                  </p>
                </div>

                {/* Massive 300px QR Code Frame */}
                <div className="p-5 bg-white rounded-3xl shadow-2xl border-4 border-[#EA580C] relative">
                  <div
                    className="w-64 h-64 sm:w-72 sm:h-72"
                    dangerouslySetInnerHTML={{ __html: qrSvgPrimary }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-black/95 border-2 border-[#EA580C] p-2 shadow-xl flex items-center justify-center">
                      <span className="text-2xl">🔥</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 max-w-md">
                  <div className="px-5 py-2 rounded-xl bg-[#EA580C] text-white font-black text-sm uppercase tracking-wider shadow-lg">
                    📱 Point Phone Camera Here to Scan
                  </div>
                  <p className="text-xs font-mono font-bold text-zinc-400">
                    allthesmokecatering.com • Call/Text (773) 707-9988
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500 font-semibold">
                  Chicago’s Northwest Side • Insulated Drop-Off &amp; On-Site Mobile Smoker Trailer
                </div>
              </div>
            )}

            {/* TEMPLATE 3: REHEATING CARD & BOX INSERT */}
            {selectedTemplate === "reheating-card" && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
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
                      <h3 className="font-display text-sm font-bold uppercase">All The Smoke Catering</h3>
                      <p className="text-[10px] text-[#EA580C] font-bold">Pitmaster Reheating Guide</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-400">Hot Drop-Off Care</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-3">
                    <h4 className="font-display text-lg font-black uppercase text-[#FF7A00]">
                      HOW TO ENJOY YOUR SMOKEHOUSE FEAST
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      All meats were cured, rubbed, and slow-rendered over seasoned hickory and oak. Keep in foil pans until ready to serve.
                    </p>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/30 border border-zinc-800">
                        <strong className="text-amber-400 block">🥩 Brisket &amp; BBQ Ribs:</strong>
                        <span className="text-zinc-300">
                          Preheat oven to 225°F. Add 2 tbsp water or broth, cover tightly with foil, and warm for 15–20 minutes.
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/30 border border-zinc-800">
                        <strong className="text-amber-400 block">🍗 Pit Wings:</strong>
                        <span className="text-zinc-300">
                          Warm uncovered at 375°F for 8–10 minutes to restore skin crispness. Toss in pit sauce.
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/30 border border-zinc-800">
                        <strong className="text-amber-400 block">🧀 4-Cheese Mac &amp; Baked Beans:</strong>
                        <span className="text-zinc-300">
                          Cover with foil and heat at 325°F for 15 minutes until bubbling.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* QR Scan Re-Order Column */}
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-black/40 border border-zinc-800 text-center space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
                      Order Again &amp; Review
                    </span>
                    <div className="p-2 bg-white rounded-xl shadow-md">
                      <div
                        className="w-32 h-32"
                        dangerouslySetInnerHTML={{ __html: qrSvgPrimary }}
                      />
                    </div>
                    <span className="text-[11px] font-black text-white">
                      Scan for 10% Off Next Gig
                    </span>
                    <p className="text-[10px] text-zinc-400 leading-snug">
                      Book online or call Marion: (773) 707-9988
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 text-center text-[10px] text-zinc-500 font-semibold">
                  All The Smoke Catering • 14-Hour Low &amp; Slow Hardwood Smoke • Chicago, IL
                </div>
              </div>
            )}

            {/* TEMPLATE 4: 2X2 STICKER SHEET (6-UP GRID) */}
            {selectedTemplate === "sticker-sheet" && (
              <div className="space-y-4">
                <div className="text-center pb-2 border-b border-zinc-800">
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#FF7A00]">
                    2&quot; x 2&quot; Takeout &amp; Butcher Wrap Sticker Grid (6 Stickers per Letter Page)
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Print on standard Avery 2&quot; square sticker paper or trim with scissors.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div
                      key={num}
                      className={`p-3 rounded-2xl border flex flex-col items-center text-center space-y-2 ${
                        styleTheme === "smokehouse-dark"
                          ? "bg-[#18191D] border-zinc-700"
                          : "bg-white border-stone-300 text-stone-900"
                      }`}
                    >
                      <div className="flex items-center gap-1 text-[11px] font-black uppercase text-[#EA580C]">
                        <span>🔥</span>
                        <span>ALL THE SMOKE</span>
                      </div>
                      <div className="p-2 bg-white rounded-xl shadow-sm border border-stone-200">
                        <div
                          className="w-24 h-24"
                          dangerouslySetInnerHTML={{ __html: qrSvgPrimary }}
                        />
                      </div>
                      <div className="text-[9px] font-mono font-bold leading-tight">
                        <span>SCAN FOR PIT MENU</span>
                        <br />
                        <span className="text-zinc-400">(773) 707-9988</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRINTING & DISPLAY GUIDELINES (4-PILLAR BEST PRACTICES)
          Modeled on agency standards with authentic smokehouse specs
          ========================================================================= */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isDay
            ? "bg-white border-stone-300 shadow-sm"
            : "bg-[#141210] border-zinc-800 shadow-md"
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-base">🖨️</span>
            <h3 className={`font-display text-base font-bold ${isDay ? "text-stone-900" : "text-white"}`}>
              Display Stand &amp; Business Card Printing Guidelines
            </h3>
          </div>
          <span className="text-[11px] font-mono font-bold text-[#EA580C]">
            Avery &amp; VistaPrint Calibrated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
          {/* Pillar 1: Home Printing */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            isDay ? "bg-stone-50 border-stone-200" : "bg-black/30 border-zinc-800"
          }`}>
            <div className="flex items-center gap-1.5 font-bold text-amber-500">
              <span>🏠</span>
              <span>Home Printing (Avery 5371/5376)</span>
            </div>
            <p className={`leading-relaxed text-[11px] ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
              Always select the <strong>Butcher Paper Light</strong> theme for home printers. The background is 100% transparent to save 95% of your black ink cartridge. Use Avery 5371 (Clean Edge White) or 5376 (Ivory) 8.5&quot; × 11&quot; sheets (10 cards per page).
            </p>
            <div className="text-[10px] font-mono text-emerald-400 font-semibold">
              Tip: Set printer scale to 100% (disable &apos;Fit to Page&apos;).
            </div>
          </div>

          {/* Pillar 2: Professional Printing */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            isDay ? "bg-stone-50 border-stone-200" : "bg-black/30 border-zinc-800"
          }`}>
            <div className="flex items-center gap-1.5 font-bold text-[#EA580C]">
              <span>🏭</span>
              <span>VistaPrint / MOO / Local Shop</span>
            </div>
            <p className={`leading-relaxed text-[11px] ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
              Open the <strong>Card Studio</strong> and click &quot;Export 300 DPI PNG&quot;. The generated images (1050 × 600 px) include standard 1/8&quot; bleed margins. We recommend <strong>16pt Heavy Matte</strong> or <strong>Uncoated Linen</strong> stock for an authentic smokehouse feel.
            </p>
            <div className="text-[10px] font-mono text-amber-400 font-semibold">
              Smokehouse Dark looks stunning with spot-UV gloss on flames!
            </div>
          </div>

          {/* Pillar 3: Tabletop Stands */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            isDay ? "bg-stone-50 border-stone-200" : "bg-black/30 border-zinc-800"
          }`}>
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <span>⛺</span>
              <span>Buffet Line Acrylic Table Stands</span>
            </div>
            <p className={`leading-relaxed text-[11px] ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
              For wedding buffets and corporate catering lines, insert the 4&quot; × 6&quot; table tent into vertical L-shaped or T-shaped clear acrylic stands. Acrylic protects the QR code from barbecue sauce splatters, moisture, and outdoor tailgating wind.
            </p>
            <div className="text-[10px] font-mono text-zinc-400 font-semibold">
              Place 1 stand next to brisket carving station &amp; 1 at bar.
            </div>
          </div>

          {/* Pillar 4: Direct Zelle Line */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            isDay ? "bg-stone-50 border-stone-200" : "bg-black/30 border-zinc-800"
          }`}>
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <span>💳</span>
              <span>Direct Phone &amp; Zelle Integration</span>
            </div>
            <p className={`leading-relaxed text-[11px] ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
              Both the business cards and tabletop signs feature Marion&apos;s direct line <strong>(773) 707-9988</strong> and <strong>bbqcateringking83@gmail.com</strong>. This matches his registered Zelle account for instant consultation deposits and Saturday drop pre-orders.
            </p>
            <div className="text-[10px] font-mono text-emerald-400 font-semibold">
              Instant quote form populates customer specs automatically.
            </div>
          </div>
        </div>
      </div>

      {/* PRINT-SPECIFIC CSS (Auto-applied during window.print()) */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-qr-display-sheet,
          #printable-qr-display-sheet * {
            visibility: visible;
          }
          #printable-qr-display-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 16px;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          @page {
            size: letter portrait;
            margin: 0.25in;
          }
        }
      `}</style>
    </div>
  );
}


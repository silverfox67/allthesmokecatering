"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PITMASTER_MENU_ITEMS,
  MENU_CATEGORIES,
  WEEKLY_CHALKBOARD,
  WeeklyChalkboardItem,
  MenuItem,
  MenuCategory,
} from "@/data/pitmaster-menu";
import { SITE_CONFIG, DeliveryZone } from "@/config/site-config";
import { useOrderTray } from "@/context/OrderTrayContext";

// Chicagoland Zip Code Lookup Map (3-Zone Heated Delivery Engine)
const ZONE_1_ZIPS = new Set([
  "60634", "60630", "60631", "60641", "60656", "60706", "60707",
  "60018", "60068", "60131", "60171", "60639", "60646", "60638",
  "60176", "60625", "60618", "60076", "60714", "60651"
]);

const ZONE_2_ZIPS = new Set([
  "60601", "60602", "60603", "60604", "60605", "60606", "60607",
  "60610", "60611", "60612", "60614", "60622", "60642", "60647",
  "60654", "60657", "60661", "60201", "60202", "60077", "60173",
  "60193", "60148", "60301", "60302", "60304", "60016", "60053",
  "60025", "60101", "60126", "60181", "60521", "60523", "60137",
  "60004", "60005", "60008", "60062", "60091"
]);

const ZONE_3_ZIPS = new Set([
  "60615", "60637", "60653", "60643", "60619", "60620", "60628",
  "60540", "60563", "60564", "60502", "60504", "60505", "60035",
  "60462", "60467", "60477", "60440", "60045", "60010", "60453",
  "60458", "60439", "60187", "60188", "60089", "60015", "60446",
  "60515", "60516", "60532", "60559", "60107", "60110", "60169"
]);

interface CheckedZipResult {
  zone: DeliveryZone;
  zip: string;
}

function parsePrices(priceStr: string): { single?: number; half?: number; full?: number } {
  const halfMatch = priceStr.match(/Half[^(]*?(?:\([^)]*\))?\s*\$(\d+)/i);
  const fullMatch = priceStr.match(/Full[^(]*?(?:\([^)]*\))?\s*\$(\d+)/i);

  if (halfMatch && fullMatch) {
    return {
      half: parseInt(halfMatch[1], 10),
      full: parseInt(fullMatch[1], 10),
    };
  }

  const singleMatch = priceStr.match(/\$(\d+)/);
  if (singleMatch) {
    return { single: parseInt(singleMatch[1], 10) };
  }

  return { single: 50 };
}

export function ButcherBlockMenu() {
  const [activeTab, setActiveTab] = useState<MenuCategory["id"]>("smoked-meats");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [zipDrawerOpen, setZipDrawerOpen] = useState(false);
  const [zipInput, setZipInput] = useState("");
  const [zipResult, setZipResult] = useState<CheckedZipResult | null>(null);
  const [zipError, setZipError] = useState("");
  const { addItem, subtotal, totalItemCount, openTray } = useOrderTray();
  const MIN_DELIVERY_SUBTOTAL = 150;
  const remainingForMin = Math.max(0, MIN_DELIVERY_SUBTOTAL - subtotal);
  const isMinMet = subtotal >= MIN_DELIVERY_SUBTOTAL;

  const evaluateZip = (rawZip: string) => {
    const clean = rawZip.trim();
    if (!/^\d{5}$/.test(clean)) {
      setZipError("Enter a valid 5-digit Chicagoland ZIP code.");
      setZipResult(null);
      return;
    }
    setZipError("");
    if (ZONE_1_ZIPS.has(clean)) {
      setZipResult({ zone: SITE_CONFIG.deliveryZones[0], zip: clean });
    } else if (ZONE_2_ZIPS.has(clean)) {
      setZipResult({ zone: SITE_CONFIG.deliveryZones[1], zip: clean });
    } else if (ZONE_3_ZIPS.has(clean)) {
      setZipResult({ zone: SITE_CONFIG.deliveryZones[2], zip: clean });
    } else if (clean.startsWith("60")) {
      const num = parseInt(clean, 10);
      if (num >= 60000 && num <= 60699) {
        setZipResult({ zone: SITE_CONFIG.deliveryZones[1], zip: clean });
      } else {
        setZipResult({ zone: SITE_CONFIG.deliveryZones[2], zip: clean });
      }
    } else {
      setZipResult({
        zone: {
          zone: 3,
          name: "Extended Midwest Route (Custom Quote)",
          minMiles: 35.1,
          maxMiles: 100,
          fee: 150.0,
          minOrder: 750.0,
          description: "Outside standard 35-mile radius. Custom smoker trailer dispatch.",
          coverageAreas: ["Greater Illinois", "Northwest Indiana", "Southern Wisconsin"],
        },
        zip: clean,
      });
    }
  };

  const currentCategory =
    MENU_CATEGORIES.find((cat) => cat.id === activeTab) || MENU_CATEGORIES[0];
  const items = PITMASTER_MENU_ITEMS.filter((item) => item.category === activeTab);

  // Jump from chalkboard item directly to the item card in the menu below
  const handleJumpToMenuItem = (special: WeeklyChalkboardItem) => {
    setActiveTab(special.categoryTab);
    setHighlightedId(special.menuTargetId);

    setTimeout(() => {
      const el = document.getElementById(special.menuTargetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);

    // Clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedId(null);
    }, 3500);
  };

  const handleAddChalkboardSpecial = (special: WeeklyChalkboardItem) => {
    addItem({
      id: special.id,
      baseId: special.menuTargetId,
      name: special.name,
      selectedOption: special.price,
      price: special.parsedPrice,
      category: "Weekly Chalkboard Special",
    });
  };

  const handleAddSingle = (item: MenuItem, price: number) => {
    addItem({
      id: `${item.id}-std`,
      baseId: item.id,
      name: item.name,
      selectedOption: item.portion || "Standard",
      price,
      image: item.image,
      portion: item.portion,
      category: item.category,
    });
  };

  const handleAddOption = (item: MenuItem, optionName: string, price: number) => {
    const slug = optionName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    addItem({
      id: `${item.id}-${slug}`,
      baseId: item.id,
      name: item.name,
      selectedOption: optionName,
      price,
      image: item.image,
      portion: item.portion,
      category: item.category,
    });
  };

  return (
    <section
      id="menu"
      className="bg-[#FAF8F5] text-[#1E293B] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E5E0D8] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="mb-3">
            <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-950 px-4 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-2 shadow-sm">
              <span>★</span>
              <span>BY THE POUND • PARTY PANS • WHOLE BIRDS</span>
              <span>★</span>
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Pitmaster Catering Menu
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Hardwood smoked low-and-slow on Marion&rsquo;s custom live-fire trailer rig. 
            All party pans and bulk meats include sternos, serving tongs, and house pit sauce.
          </p>
        </div>

        {/* 1. AUTHENTIC HANDCRAFTED 4-PIECE MITERED TIMBER CHALKBOARD FRAME */}
        <div className="mb-16 mitered-wood-frame-container">
          
          {/* 4 Mitered Timber Rails with True Grain Orientation */}
          <div className="frame-rail-top" aria-hidden="true" />
          <div className="frame-rail-bottom" aria-hidden="true" />
          <div className="frame-rail-left" aria-hidden="true" />
          <div className="frame-rail-right" aria-hidden="true" />

          {/* 4 Precision 45° Miter Cut Seams */}
          <div className="frame-miter-corner-tl" aria-hidden="true" />
          <div className="frame-miter-corner-tr" aria-hidden="true" />
          <div className="frame-miter-corner-bl" aria-hidden="true" />
          <div className="frame-miter-corner-br" aria-hidden="true" />

          {/* Recessed Inner Rabbet Lip Framing the Slate */}
          <div className="frame-inner-lip" aria-hidden="true" />

          {/* Deep Slate Chalkboard Surface */}
          <div className="chalkboard-slate rounded-xs p-5 sm:p-7 md:p-9 relative z-[1] overflow-hidden">
            
            {/* Hand-Drawn Dashed Chalk Perimeter */}
            <div className="border border-dashed border-white/20 rounded-xl p-4 sm:p-6 md:p-7">
              
              {/* Chalkboard Header */}
              <div className="text-center pb-5 border-b border-dashed border-white/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="font-chalk chalk-yellow text-xs sm:text-sm tracking-widest font-bold">
                    ★ {WEEKLY_CHALKBOARD.badge} ★
                  </span>
                </div>
                <h3 className="font-chalk chalk-orange text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide">
                  {WEEKLY_CHALKBOARD.headline}
                </h3>
                <p className="font-chalk chalk-white text-xs sm:text-sm opacity-85 mt-1">
                  {WEEKLY_CHALKBOARD.season}
                </p>
              </div>

              {/* Pure Chalk Handwritten Specials List - Compact Single-Line Dishes (No Cluttered Descriptions) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mt-6">
                {WEEKLY_CHALKBOARD.items.map((special, idx) => (
                  <div
                    key={special.id}
                    className={`group border-b border-dashed border-white/15 py-2.5 flex-col gap-1.5 hover:bg-white/[0.03] rounded-lg px-2 transition-all ${
                      idx >= 3 ? "hidden md:flex" : "flex"
                    }`}
                  >
                    {/* Dish Number & Name */}
                    <div className="flex items-baseline gap-2">
                      <span className="font-chalk chalk-yellow text-xs sm:text-sm font-bold shrink-0">
                        #{idx + 1}
                      </span>
                      <h4 className="font-chalk chalk-white text-base sm:text-lg font-bold group-hover:text-[#FB923C] transition-colors leading-snug">
                        {special.name}
                      </h4>
                    </div>

                    {/* Price & Action CTAs */}
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pl-7">
                      <span className="font-chalk chalk-yellow text-xs sm:text-sm font-bold whitespace-nowrap">
                        {special.price}
                      </span>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {/* 1. View In Menu CTA (Scrolls to photo & full description below) */}
                        <button
                          type="button"
                          onClick={() => handleJumpToMenuItem(special)}
                          className="font-chalk text-[11px] sm:text-xs text-neutral-300 hover:text-white bg-white/5 hover:bg-white/15 px-3 py-1 min-h-12 sm:min-h-0 flex-1 sm:flex-none justify-center rounded border border-white/15 transition flex items-center gap-1"
                          title="View photo and description in menu below"
                        >
                          <span>Menu</span>
                          <span>↓</span>
                        </button>

                        {/* 2. Direct Add to Tray CTA */}
                        <button
                          type="button"
                          onClick={() => handleAddChalkboardSpecial(special)}
                          className="font-chalk chalk-orange bg-[#FB923C]/10 hover:bg-[#FB923C]/25 text-xs font-bold px-3 py-1 min-h-12 sm:min-h-0 flex-1 sm:flex-none justify-center rounded border border-[#FB923C]/40 transition flex items-center gap-1 shadow-sm active:scale-95"
                        >
                          <span>+ Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Chalkboard CTA: See All Weekly Specials on Dedicated Chalkboard Page */}
              <div className="mt-7 pt-4 border-t border-dashed border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 md:hidden">
                <div className="text-center sm:text-left">
                  <p className="font-chalk chalk-white text-xs opacity-90">
                    ★ Showing 3 of {WEEKLY_CHALKBOARD.items.length} rotating smoker specials
                  </p>
                  <p className="font-chalk chalk-yellow text-[11px] opacity-75">
                    Smoked fresh on Marion&rsquo;s trailer rig
                  </p>
                </div>
                <Link
                  href="/specials"
                  className="w-full sm:w-auto font-chalk text-center bg-[#FB923C] hover:bg-[#F97316] text-[#0F172A] font-black text-sm px-6 py-2.5 rounded-lg shadow-lg hover:shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>See All Weekly Specials</span>
                  <span className="text-base font-bold">→</span>
                </Link>
              </div>

            </div>
          </div>

        </div>

        {/* 2. STICKY CATEGORY PILL BAR (All 5 Categories Visible on Mobile & Desktop — Zero Horizontal Scroll) */}
        <div className="sticky top-16 md:top-20 z-20 bg-[#FAF8F5]/95 backdrop-blur-md py-3 -mx-4 px-3 sm:px-4 mb-8 border-y border-[#E5E0D8] shadow-sm space-y-2.5">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 items-center">
            {MENU_CATEGORIES.map((cat, idx) => {
              const isActive = activeTab === cat.id;
              const isLastOdd = idx === MENU_CATEGORIES.length - 1 && MENU_CATEGORIES.length % 2 !== 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  type="button"
                  className={`${
                    isLastOdd ? "col-span-2 sm:col-span-1" : ""
                  } px-3.5 lg:px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#0F172A] text-white shadow-md ring-2 ring-[#EA580C]"
                      : "bg-[#EDE7DE] text-slate-700 hover:bg-[#E2D8CC] hover:text-[#0F172A]"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Live Smart $150 Heated Delivery Minimum Bar + Inline ZIP Calculator */}
          <div className="max-w-3xl mx-auto rounded-xl bg-[#0F172A] text-white px-3.5 py-2.5 border border-slate-800 shadow-sm text-xs space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span>{isMinMet ? "✅" : "🚚"}</span>
                {totalItemCount === 0 ? (
                  <span className="text-slate-200 font-semibold">
                    Heated Chicagoland Delivery Minimum: <strong className="text-[#F59E0B]">$150.00</strong> <span className="hidden md:inline text-slate-400">• Dispatched from Chicago’s Northwest Side</span>
                  </span>
                ) : isMinMet ? (
                  <span className="text-emerald-400 font-bold">
                    $150 Delivery Minimum Met! (${subtotal.toFixed(0)} in tray)
                  </span>
                ) : (
                  <span className="text-amber-300 font-bold">
                    Tray: ${subtotal.toFixed(0)} / $150 Min — Add ${remainingForMin.toFixed(0)} more for delivery
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {/* Inline ZIP Calculator Trigger */}
                <button
                  type="button"
                  onClick={() => setZipDrawerOpen((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] transition cursor-pointer shrink-0 flex items-center gap-1 ${
                    zipDrawerOpen
                      ? "bg-[#EA580C] border-[#FF7A00] text-white"
                      : "bg-slate-800/90 hover:bg-slate-800 border-[#C8A97E]/40 text-[#C8A97E] hover:text-white"
                  }`}
                >
                  <span>📍</span>
                  <span>{zipResult ? `ZIP ${zipResult.zip}: $${zipResult.zone.fee} Fee` : "Check Delivery ZIP"}</span>
                  <span>{zipDrawerOpen ? "▲" : "▼"}</span>
                </button>

                {totalItemCount > 0 && (
                  <button
                    type="button"
                    onClick={openTray}
                    className="px-2.5 py-1 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-[11px] uppercase tracking-wider transition cursor-pointer shrink-0"
                  >
                    Quote Tray ({totalItemCount}) &rarr;
                  </button>
                )}
              </div>
            </div>

            {/* Expandable Inline Delivery ZIP & Zone Calculator Drawer */}
            {zipDrawerOpen && (
              <div className="pt-2.5 border-t border-slate-800/90 space-y-2.5 animate-in fade-in duration-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    evaluateZip(zipInput);
                  }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                >
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{5}"
                      maxLength={5}
                      value={zipInput}
                      onChange={(e) => setZipInput(e.target.value)}
                      placeholder="Enter 5-digit Event ZIP (e.g. 60634, 60607, 60540)"
                      className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-400 font-mono text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                    <button
                      type="submit"
                      className="h-9 px-3.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer transition"
                    >
                      Calculate Fee
                    </button>
                  </div>

                  {/* Quick Test ZIP Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Quick Check:</span>
                    {[
                      { zip: "60634", label: "60634 (NW Side)" },
                      { zip: "60607", label: "60607 (Loop)" },
                      { zip: "60201", label: "60201 (North)" },
                      { zip: "60540", label: "60540 (Suburbs)" },
                    ].map((chip) => (
                      <button
                        key={chip.zip}
                        type="button"
                        onClick={() => {
                          setZipInput(chip.zip);
                          evaluateZip(chip.zip);
                        }}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </form>

                {zipError && (
                  <p className="text-[11px] text-red-400 font-semibold">{zipError}</p>
                )}

                {zipResult && (
                  <div className="p-2.5 rounded-lg bg-slate-900/95 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
                        ZIP {zipResult.zip} • {zipResult.zone.name}
                      </span>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        {zipResult.zone.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase">Heated Transit Fee</span>
                        <span className="text-sm font-black text-[#C8A97E]">${zipResult.zone.fee.toFixed(0)}</span>
                      </div>
                      <div className="text-right border-l border-slate-800 pl-3">
                        <span className="text-[10px] text-slate-400 block uppercase">Delivery Min</span>
                        <span className="text-sm font-black text-white">${MIN_DELIVERY_SUBTOTAL}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Active Category Header Banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E5E0D8] pb-3">
          <div>
            <h3 className="text-2xl font-black text-[#0F172A] flex items-center gap-2">
              <span>{currentCategory.icon}</span>
              <span>{currentCategory.name}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {currentCategory.subtitle}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#EA580C] bg-[#EA580C]/10 px-3 py-1 rounded-full self-start sm:self-auto">
            {items.length} Smokehouse Offerings
          </span>
        </div>

        {/* 3. MENU ITEMS GRID (With Photos, Full Details & Highlight Flash on Jump) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => {
            const priceInfo = parsePrices(item.price);
            const isHighlighted = highlightedId === item.id;

            return (
              <div
                id={item.id}
                key={item.id}
                className={`bg-[#FFFDF9] rounded-xl overflow-hidden border transition-all duration-500 flex flex-col justify-between group ${
                  isHighlighted
                    ? "border-[#EA580C] ring-4 ring-[#EA580C]/30 shadow-2xl scale-[1.01]"
                    : "border-[#E2D5C5] shadow-sm hover:border-[#EA580C]/60 hover:shadow-md"
                }`}
              >
                {/* Food Photo */}
                {item.image && (
                  <div className="relative w-full h-44 sm:h-48 bg-stone-900 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-2 right-2 font-black text-sm text-white bg-[#EA580C] px-2.5 py-1 rounded-md shadow-md">
                      {item.price}
                    </span>
                  </div>
                )}

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header Row: Badges & Price (shown if no image) */}
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.skull && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-red-950 text-red-300 border border-red-700/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span>☠️</span>
                            <span>Very Hot</span>
                          </span>
                        )}
                        {item.popular && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EA580C] text-white px-2 py-0.5 rounded-md">
                            Top Seller
                          </span>
                        )}
                        {item.badge && !item.skull && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-[#C8A97E] border border-[#C8A97E]/30 px-2 py-0.5 rounded-md">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {!item.image && (
                        <span className="shrink-0 font-black text-base sm:text-lg text-[#EA580C] bg-[#FFF4ED] px-3 py-1 rounded-lg border border-[#FDBA74]/50">
                          {item.price}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-extrabold text-lg text-[#0F172A] group-hover:text-[#EA580C] transition-colors leading-snug">
                      {item.name}
                    </h4>

                    {/* Portion/Yield indicator */}
                    {item.portion && (
                      <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                        {item.portion}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Footer: One-Click Add To Tray Action */}
                  <div className="mt-4 pt-3 border-t border-[#EAE0D5] flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <span>Smokehouse fresh</span>
                      <span>•</span>
                      <span>Chicagoland drop-off</span>
                    </span>

                    {/* Action Buttons: Dual Half/Full Pan Buttons or Single Item Button */}
                    <div className="flex items-center gap-2">
                      {priceInfo.half && priceInfo.full ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleAddOption(item, "Half Pan", priceInfo.half!)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#EA580C] text-white text-xs font-bold transition shadow-sm"
                          >
                            <span>+ Half Pan</span>
                            <span className="text-[#F59E0B]">(${priceInfo.half})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddOption(item, "Full Pan", priceInfo.full!)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold transition shadow-sm"
                          >
                            <span>+ Full Pan</span>
                            <span>(${priceInfo.full})</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddSingle(item, priceInfo.single || 50)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#EA580C] text-white text-xs font-bold transition shadow-sm"
                        >
                          <span>+ Add to Tray</span>
                          <span className="text-[#F59E0B]">(${priceInfo.single || 50})</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. BOTTOM DIRECT LINE CALLOUT */}
        <div className="mt-12 p-6 rounded-2xl bg-[#EDE7DE] border border-[#E2D5C5] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-black text-[#0F172A]">
              Planning a Large Event or Custom Smokehouse Order?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              For gatherings over 50 guests, custom whole hog roasts, or corporate tailgate packages, talk directly with Pitmaster Marion Bolden.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:7737079988"
              className="px-5 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-md"
            >
              <span>📞</span>
              <span>Call (773) 707-9988</span>
            </a>
            <a
              href="#contact"
              className="px-5 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition shadow-md"
            >
              Get A Free Quote &rarr;
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

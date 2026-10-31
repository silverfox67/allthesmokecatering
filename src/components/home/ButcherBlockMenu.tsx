"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  PITMASTER_MENU_ITEMS,
  MENU_CATEGORIES,
  WEEKLY_CHALKBOARD,
  WeeklyChalkboardItem,
  MenuItem,
  MenuCategory,
} from "@/data/pitmaster-menu";
import { useOrderTray } from "@/context/OrderTrayContext";

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
  const { addItem } = useOrderTray();

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
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-dashed border-white/20 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
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

                {/* Chalk Note */}
                <div className="max-w-xs bg-black/45 p-3 rounded-lg border border-dashed border-white/15">
                  <p className="font-chalk chalk-white text-xs leading-relaxed opacity-90">
                    ✎ {WEEKLY_CHALKBOARD.note}
                  </p>
                </div>
              </div>

              {/* Pure Chalk Handwritten Specials List (2 Columns on Desktop, 1 Column on Mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-7">
                {WEEKLY_CHALKBOARD.items.map((special, idx) => (
                  <div
                    key={special.id}
                    className="group border-b border-dashed border-white/15 pb-4 flex flex-col justify-between hover:bg-white/[0.02] rounded-lg p-2 transition-all"
                  >
                    <div>
                      {/* Special Header: Title, Badge, Price */}
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-chalk chalk-yellow text-xs font-bold">
                            #{idx + 1}
                          </span>
                          <h4 className="font-chalk chalk-white text-lg sm:text-xl font-bold group-hover:text-[#FB923C] transition-colors">
                            {special.name}
                          </h4>
                        </div>
                      </div>

                      {/* Tagline / Ingredients in White Chalk */}
                      <p className="font-chalk text-xs sm:text-sm text-neutral-300 mt-1 leading-relaxed opacity-85">
                        {special.tagline}
                      </p>
                    </div>

                    {/* Footer Row: Yellow Chalk Price & Interactive Action CTAs */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2">
                      <span className="font-chalk chalk-yellow text-sm sm:text-base font-bold">
                        {special.price}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* 1. View In Menu CTA (Scrolls to photo & full details below) */}
                        <button
                          type="button"
                          onClick={() => handleJumpToMenuItem(special)}
                          className="font-chalk text-[11px] sm:text-xs text-neutral-300 hover:text-white bg-white/5 hover:bg-white/15 px-2.5 py-1 rounded border border-white/15 transition flex items-center gap-1"
                        >
                          <span>See in Menu</span>
                          <span>↓</span>
                        </button>

                        {/* 2. Direct Add to Tray CTA */}
                        <button
                          type="button"
                          onClick={() => handleAddChalkboardSpecial(special)}
                          className="font-chalk chalk-orange bg-[#FB923C]/10 hover:bg-[#FB923C]/25 text-xs font-bold px-3 py-1 rounded border border-[#FB923C]/40 transition flex items-center gap-1 shadow-sm"
                        >
                          <span>+ Add to Tray</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* 2. STICKY CATEGORY PILL BAR */}
        <div className="sticky top-16 md:top-20 z-20 bg-[#FAF8F5]/95 backdrop-blur-md py-3.5 -mx-4 px-4 mb-8 border-y border-[#E5E0D8] shadow-sm">
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar md:justify-center items-center">
            {MENU_CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  type="button"
                  className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-[#0F172A] text-white shadow-lg ring-2 ring-[#EA580C]"
                      : "bg-[#EDE7DE] text-slate-700 hover:bg-[#E2D8CC] hover:text-[#0F172A]"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
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
                        {item.badge && !item.skull && !item.popular && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-slate-200 px-2 py-0.5 rounded-md">
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
              className="px-5 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-bold transition shadow-md"
            >
              Build Custom Quote &rarr;
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

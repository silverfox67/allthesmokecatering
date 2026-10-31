"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  PITMASTER_MENU_ITEMS,
  MENU_CATEGORIES,
  WEEKLY_CHALKBOARD,
  MenuCategory,
} from "@/data/pitmaster-menu";

export function ButcherBlockMenu() {
  const [activeTab, setActiveTab] = useState<MenuCategory["id"]>("smoked-meats");

  const currentCategory =
    MENU_CATEGORIES.find((cat) => cat.id === activeTab) || MENU_CATEGORIES[0];
  const items = PITMASTER_MENU_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section
      id="menu"
      className="bg-[#FAF8F5] text-[#1E293B] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E5E0D8] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EA580C]/10 border border-[#EA580C]/20 text-[#EA580C] text-xs font-bold uppercase tracking-widest mb-3">
            <span>🔥</span>
            <span>By The Pound • Party Pans • Whole Birds</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Pitmaster Catering Menu
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Hardwood smoked low-and-slow on Marion&rsquo;s custom live-fire trailer rig. 
            All party pans and bulk meats include sternos, serving tongs, and house pit sauce.
          </p>
        </div>

        {/* 1. WEEKLY CHALKBOARD DISPLAY (Marion's Seasonal Specials) */}
        <div className="mb-14 rounded-2xl bg-[#14161A] border-4 border-[#3A2E26] shadow-2xl p-6 sm:p-8 text-neutral-100 relative overflow-hidden">
          <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none" />

          {/* Chalkboard Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-dashed border-white/20 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#F59E0B]">
                  {WEEKLY_CHALKBOARD.badge}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-wider text-white font-mono mt-1">
                {WEEKLY_CHALKBOARD.headline}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-0.5">
                {WEEKLY_CHALKBOARD.season}
              </p>
            </div>
            <div className="text-xs sm:text-sm font-mono text-neutral-400 bg-black/40 px-3.5 py-2 rounded-lg border border-white/10 max-w-xs">
              {WEEKLY_CHALKBOARD.note}
            </div>
          </div>

          {/* Chalkboard 4-Column Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {WEEKLY_CHALKBOARD.items.map((special, idx) => (
              <div
                key={special.name}
                className="bg-black/50 rounded-xl overflow-hidden border border-white/10 hover:border-[#F59E0B]/60 transition-all flex flex-col justify-between group"
              >
                {/* Special Thumbnail Photo */}
                {special.image && (
                  <div className="relative w-full h-32 bg-stone-900 overflow-hidden">
                    <Image
                      src={special.image}
                      alt={special.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono uppercase tracking-wider text-[#F59E0B] bg-black/70 px-2 py-0.5 rounded border border-[#F59E0B]/30 backdrop-blur-sm">
                      Special #{idx + 1}
                    </span>
                  </div>
                )}

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {!special.image && (
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/30">
                          Special #{idx + 1}
                        </span>
                        {special.badge && (
                          <span className="text-[10px] font-sans text-neutral-300 bg-white/10 px-2 py-0.5 rounded-full">
                            {special.badge}
                          </span>
                        )}
                      </div>
                    )}
                    <h4 className="font-bold text-base text-white group-hover:text-[#F59E0B] transition-colors leading-snug">
                      {special.name}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed line-clamp-3">
                      {special.tagline}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-black font-mono text-[#F59E0B]">
                      {special.price}
                    </span>
                    <a
                      href={`#contact?item=${encodeURIComponent(special.name)}`}
                      className="text-[11px] font-bold text-white hover:text-[#F59E0B] transition flex items-center gap-1"
                    >
                      <span>Reserve</span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
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

        {/* 3. MENU ITEMS GRID (Compact 2-line rows with daylight contrast) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFDF9] rounded-xl overflow-hidden border border-[#E2D5C5] shadow-sm hover:border-[#EA580C]/60 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Optional Food Photo */}
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

                {/* Card Footer Action */}
                <div className="mt-4 pt-3 border-t border-[#EAE0D5] flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <span>Smokehouse fresh</span>
                    <span>•</span>
                    <span>Chicagoland drop-off</span>
                  </span>
                  <a
                    href={`#contact?menuItem=${encodeURIComponent(item.name)}&cat=${item.category}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#EA580C] text-white text-xs font-bold transition shadow-sm"
                  >
                    <span>Add to Quote</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
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

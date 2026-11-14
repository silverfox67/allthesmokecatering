"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { WEEKLY_CHALKBOARD, WeeklyChalkboardItem } from "@/data/pitmaster-menu";
import { OrderTrayProvider, useOrderTray } from "@/context/OrderTrayContext";
import { useLiveSmokerStatus } from "@/utils/smoker-live-status";
import { useWeeklyChalkboard } from "@/utils/chalkboard-specials";
import { SmokehouseOrderTray } from "@/components/tray/SmokehouseOrderTray";
import { SmokehouseTrayButton } from "@/components/tray/SmokehouseTrayButton";
import { QuoteModal } from "@/components/forms/QuoteModal";
import { WeekendDropCard } from "@/components/home/WeekendDropCard";
import { Footer } from "@/components/layout/Footer";

function ChalkboardContent() {
  const { addItem, subtotal, totalItemCount, openTray } = useOrderTray();
  const { getItemStatus } = useLiveSmokerStatus();
  const { chalkboard: weeklyChalkboard } = useWeeklyChalkboard();
  const [addedId, setAddedId] = useState<string | null>(null);
  const MIN_DELIVERY_SUBTOTAL = 150;
  const remainingForMin = Math.max(0, MIN_DELIVERY_SUBTOTAL - subtotal);
  const isMinMet = subtotal >= MIN_DELIVERY_SUBTOTAL;

  const handleAddSpecial = (special: WeeklyChalkboardItem) => {
    addItem({
      id: special.id,
      baseId: special.menuTargetId,
      name: special.name,
      selectedOption: special.price,
      price: special.parsedPrice,
      category: "Weekly Chalkboard Special",
    });

    setAddedId(special.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Live Smart $150 Heated Delivery Minimum Bar */}
      <div className="max-w-3xl mx-auto rounded-xl bg-[#141210] text-white px-4 py-2.5 border border-[#C8A97E]/30 shadow-lg flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span>{isMinMet ? "✅" : "🚚"}</span>
          {totalItemCount === 0 ? (
            <span className="text-zinc-200 font-semibold">
              Heated Chicagoland Delivery Minimum: <strong className="text-[#F59E0B]">$150.00</strong> <span className="hidden sm:inline text-zinc-400">• Mix &amp; match specials and menu pans</span>
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

        {totalItemCount > 0 && (
          <button
            type="button"
            onClick={openTray}
            className="px-3 py-1 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-[11px] uppercase tracking-wider transition cursor-pointer shrink-0"
          >
            Quote Tray ({totalItemCount}) &rarr;
          </button>
        )}
      </div>

      {/* Exclusive Weekend Dinner Drop Pop-Up */}
      <WeekendDropCard />

      {/* 4-PIECE MITERED WEATHERED BARNWOOD TIMBER FRAME */}
      <div className="mitered-wood-frame-container shadow-2xl">
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
        <div className="chalkboard-slate rounded-xs p-5 sm:p-8 md:p-10 relative z-[1] overflow-hidden">
          {/* Hand-Drawn Dashed Chalk Perimeter */}
          <div className="border border-dashed border-white/20 rounded-xl p-4 sm:p-7 md:p-8">
            
            {/* Chalkboard Header */}
            <div className="text-center pb-6 border-b border-dashed border-white/20">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="font-chalk chalk-yellow text-sm sm:text-base font-bold">
                  ★ {weeklyChalkboard.badge} ★
                </span>
              </div>
              <h1 className="font-chalk chalk-orange text-4xl sm:text-5xl md:text-6xl font-bold tracking-normal leading-tight">
                {weeklyChalkboard.headline}
              </h1>
              <p className="font-chalk chalk-white text-sm sm:text-base opacity-90 mt-1">
                {weeklyChalkboard.season} • Complete Smoker Lineup
              </p>
            </div>

            {/* All 8 Pure Chalk Handwritten Specials (Compact Single-Row Format - No Cluttered Descriptions) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 mt-7">
              {weeklyChalkboard.items
                .filter((special) => special.active !== false)
                .map((special, idx) => {
                  const isJustAdded = addedId === special.id;
                  const live = getItemStatus(special.menuTargetId);
                  const isSmokingLive = live.status === "smoking-now";
                  const isSoldOut = special.soldOut || live.status === "sold-out";

                  return (
                    <div
                      key={special.id}
                      className={`group border-b border-dashed border-white/15 py-3 flex-col gap-1.5 rounded-lg px-2.5 transition-all flex ${
                        isSmokingLive
                          ? "bg-[#EA580C]/10 border-[#EA580C]/40"
                          : "hover:bg-white/[0.03]"
                      } ${isSoldOut ? "opacity-75" : ""}`}
                    >
                      {/* Dish Number, Name & Live Smoke Badges */}
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-chalk chalk-yellow text-sm sm:text-base font-bold shrink-0">
                          #{idx + 1}
                        </span>
                        <h2
                          className={`font-chalk text-lg sm:text-xl font-bold group-hover:text-[#FB923C] transition-colors leading-snug ${
                            isSoldOut ? "chalk-white line-through opacity-70" : "chalk-white"
                          }`}
                        >
                          {special.name}
                        </h2>
                        {special.badge && !isSoldOut && (
                          <span className="font-sans text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                            {special.badge}
                          </span>
                        )}
                        {isSmokingLive && !isSoldOut && (
                          <span className="font-chalk chalk-orange text-[10px] sm:text-[11px] font-bold bg-[#FB923C]/20 border border-[#FB923C]/50 px-2 py-0.5 rounded animate-pulse flex items-center gap-1">
                            <span>🔥</span>
                            <span>Smoking Live Today • Ready {live.readyTime || "~5:00 PM"}</span>
                          </span>
                        )}
                        {isSoldOut && (
                          <span className="font-chalk chalk-white text-[10px] sm:text-[11px] font-bold bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded opacity-80">
                            🚫 Sold Out Today (Pre-Order)
                          </span>
                        )}
                      </div>

                      {/* Price & Action CTAs */}
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pl-7">
                        <span className="font-chalk chalk-yellow text-sm sm:text-base font-bold whitespace-nowrap">
                          {special.price}
                        </span>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          {/* 1. View in Menu Link */}
                          <Link
                            href={`/#menu`}
                            className="font-sans text-[11px] font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/15 px-2.5 py-1 min-h-11 sm:min-h-0 flex-1 sm:flex-none justify-center rounded border border-white/15 transition flex items-center gap-1"
                            title="View photo and full description in menu"
                          >
                            <span>Menu</span>
                            <span>→</span>
                          </Link>

                          {/* 2. Direct Add to Tray CTA */}
                          {isSoldOut ? (
                            <span className="font-sans text-[11px] font-bold text-stone-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                              Sold Out
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddSpecial(special)}
                              className={`font-sans text-xs font-bold px-2.5 py-1 min-h-11 sm:min-h-0 flex-1 sm:flex-none justify-center rounded border transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
                                isJustAdded
                                  ? "bg-emerald-600/90 text-white border-emerald-500"
                                  : "chalk-orange bg-[#FB923C]/10 hover:bg-[#FB923C]/25 border-[#FB923C]/40"
                              }`}
                            >
                              <span>{isJustAdded ? "✓ Added" : "+ Add"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Bottom Chalk Notice */}
            <div className="mt-8 pt-5 border-t border-dashed border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="font-chalk chalk-white text-xs opacity-90">
                  ★ Smoked fresh on Marion Bolden&rsquo;s live-fire trailer rig in Chicago.
                </p>
                <p className="font-chalk chalk-yellow text-[11px] opacity-80 mt-0.5">
                  Heated drop-off delivery across Chicago, Cook, Will, DuPage &amp; Lake counties ($150 min order).
                </p>
              </div>

              <a
                href="tel:7737079988"
                className="font-chalk text-xs chalk-orange hover:underline shrink-0"
              >
                Questions? Call/Text (773) 707-9988
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export function SpecialsClient() {
  return (
    <OrderTrayProvider>
      <main className="min-h-screen bg-[#0A0A0A] text-neutral-100 flex flex-col relative">
        {/* Top Sticky Navigation */}
        <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/#menu"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-zinc-300 hover:text-white transition-colors"
            >
              <span>←</span>
              <span>Back to Menu</span>
            </Link>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#C8A97E]/50">
                <Image
                  src="/brand/allthesmoke-logo.png"
                  alt="All The Smoke Official Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-display font-bold text-sm tracking-wider text-white group-hover:text-[#FF7A00] transition-colors">
                ALL THE SMOKE
              </span>
            </Link>

            <a
              href="/#contact"
              className="inline-flex h-9 px-4 items-center justify-center rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white font-display text-xs font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(234,88,12,0.35)] transition-all hover:scale-105 active:scale-95"
            >
              Get A Free Quote
            </a>
          </div>
        </header>

        {/* Ambient Amber Glow Background */}
        <div className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#141210] via-[#0A0A0A] to-[#121214] flex-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 h-[450px] w-[650px] rounded-full bg-[#EA580C]/10 blur-[160px]"
          />

          {/* Section Heading */}
          <div className="max-w-3xl mx-auto text-center mb-10 relative z-10">
            <div className="mb-3">
              <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-900/90 px-4 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-2 shadow-sm">
                <span>★</span>
                <span>CHICAGOLAND LIVE-FIRE SMOKER SPECIALS</span>
                <span>★</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Pitmaster Weekly Chalkboard
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
              All 8 rotating hardwood cuts and pit specials currently rolling on Marion Bolden&rsquo;s trailer smoker.
            </p>
          </div>

          {/* The Handcrafted Full Chalkboard */}
          <div className="relative z-10">
            <ChalkboardContent />
          </div>

          {/* Bottom Full Menu CTA */}
          <div className="text-center mt-12 relative z-10">
            <Link
              href="/#menu"
              className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 py-3 rounded-full bg-gradient-to-r from-[#EA580C] to-[#C84A0A] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-sm font-black tracking-wide border border-[#FF7A00]/60 shadow-[0_0_24px_rgba(234,88,12,0.4)] hover:shadow-[0_0_32px_rgba(255,122,0,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Explore Full Catering Menu &amp; Party Pans</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <Footer />

        {/* Modals & Trays */}
        <QuoteModal />
        <SmokehouseOrderTray />
        <SmokehouseTrayButton />
      </main>
    </OrderTrayProvider>
  );
}

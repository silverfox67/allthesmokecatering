"use client";

import React, { useState, MouseEvent } from "react";
import {
  PER_PERSON_PACKAGES,
  TURNKEY_BUNDLES,
  MEAL_PREP_TIERS,
  PerPersonPackage,
  TurnkeyPartyBundle,
  MealPrepTier,
} from "@/data/catering-packages";
import {
  PackageDetailModal,
  PackageModalData,
} from "./PackageDetailModal";

type TabKey = "per-person" | "turnkey" | "meal-prep";

interface CategoryMeta {
  key: TabKey;
  title: string;
  countBadge: string;
  priceAnchor: string;
  tagline: string;
  icon: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    key: "per-person",
    title: "Per-Person Buffet",
    countBadge: "3 Signature Tiers",
    priceAnchor: "Starting at $24.95 / person",
    tagline: "Full buffet spreads for 20+ guests with hardwood meats & scratch sides.",
    icon: "🍖",
  },
  {
    key: "turnkey",
    title: "Turnkey Party Pans",
    countBadge: "3 Ready Bundles",
    priceAnchor: "Bundles from $285 flat",
    tagline: "Drop-off smokehouse pans hot & ready for game days & tailgates (12–35 guests).",
    icon: "🔥",
  },
  {
    key: "meal-prep",
    title: "Weekly Meal Prep",
    countBadge: "3 Clean Tiers",
    priceAnchor: "From $15.62 / meal",
    tagline: "Vacuum-sealed high-protein smoked meats & wholesome clean sides.",
    icon: "🥗",
  },
];

function SpotlightCard({
  children,
  className = "",
  isHighlighted = false,
}: {
  children: React.ReactNode;
  className?: string;
  isHighlighted?: boolean;
}) {
  const [coords, setCoords] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setCoords((prev) => ({ ...prev, active: false }));
  };

  // If highlighted with animated amber/gold border-beam effect
  if (isHighlighted) {
    return (
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative p-[2px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 lg:-translate-y-2 z-20 flex flex-col h-full"
      >
        {/* Animated Illuminated Amber Border Beam */}
        <div
          aria-hidden="true"
          className="absolute inset-[-150%] animate-border-beam bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_60deg,#EA580C_120deg,#FF8C38_180deg,transparent_240deg)]"
        />

        {/* Inner Card Container */}
        <div
          style={{
            background: coords.active
              ? `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(234, 88, 12, 0.18), rgba(20, 20, 22, 0.98) 70%)`
              : undefined,
          }}
          className={`relative z-10 bg-[#161619] rounded-[14px] p-6 sm:p-7 flex flex-col justify-between h-full border-2 border-[#EA580C]/80 shadow-[0_0_30px_rgba(234,88,12,0.25)] ${className}`}
        >
          {children}
        </div>
      </div>
    );
  }

  // Standard Spotlight Card
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: coords.active
          ? `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(200, 169, 126, 0.12), rgba(20, 20, 22, 0.92) 70%)`
          : undefined,
      }}
      className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between border border-zinc-800 hover:border-[#C8A97E]/50 bg-[#161619]/90 transition-all duration-300 shadow-xl h-full ${className}`}
    >
      {children}
    </div>
  );
}

export function PackageGrid() {
  const [activeTab, setActiveTab] = useState<TabKey>("per-person");
  const [modalData, setModalData] = useState<PackageModalData | null>(null);

  const handleOpenModal = (data: PackageModalData) => {
    setModalData(data);
  };

  const handleCloseModal = () => {
    setModalData(null);
  };

  const handleBookPackage = (packageId: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-quote-modal", { detail: { packageId } })
      );
    }
  };

  // Render cards for a specific category (shared between Desktop grid & Mobile accordion)
  const renderCards = (category: TabKey) => {
    if (category === "per-person") {
      return PER_PERSON_PACKAGES.map((pkg: PerPersonPackage) => {
        const isPopular = pkg.id === "pitmaster-feast";
        return (
          <SpotlightCard key={pkg.id} isHighlighted={isPopular}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs uppercase font-extrabold tracking-widest ${
                    isPopular ? "text-[#FF8C38]" : "text-[#C8A97E]"
                  }`}
                >
                  {pkg.minimumGuests}+ Guests Minimum
                </span>
                {isPopular && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-gradient-to-r from-[#EA580C] to-[#9A3412] border border-[#FF7A00]/80 text-white font-display font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_14px_rgba(234,88,12,0.5)]">
                    ★ MOST POPULAR ★
                  </span>
                )}
              </div>

              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide leading-tight min-h-[36px]">
                {pkg.name}
              </h3>

              <div className="flex items-baseline gap-2">
                <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                  Starting at
                </span>
                <span
                  className={`text-3xl sm:text-4xl font-black ${
                    isPopular ? "text-[#FF8C38]" : "text-[#C8A97E]"
                  }`}
                >
                  ${pkg.pricePerPerson.toFixed(2)}
                </span>
                <span className="text-xs text-zinc-400 font-medium">/ person</span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed min-h-[44px]">
                {pkg.description}
              </p>

              <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap gap-1.5">
                <span className="text-[11px] bg-zinc-900 border border-zinc-700/80 px-2.5 py-1 rounded text-zinc-200 font-semibold inline-flex items-center gap-1">
                  <span className="text-amber-400">🍖</span> Choose {pkg.meatsAllowed} Meats
                </span>
                <span className="text-[11px] bg-zinc-900 border border-zinc-700/80 px-2.5 py-1 rounded text-zinc-200 font-semibold inline-flex items-center gap-1">
                  <span className="text-amber-400">🥗</span> Choose {pkg.sidesAllowed} Sides
                </span>
                <span className="text-[11px] bg-zinc-900 border border-zinc-700/80 px-2.5 py-1 rounded text-zinc-200 font-semibold inline-flex items-center gap-1">
                  <span className="text-amber-400">✓</span> Buns &amp; Sauces
                </span>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-zinc-800/80 space-y-2.5">
              <button
                type="button"
                onClick={() => handleOpenModal({ type: "per-person", pkg })}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-zinc-700 hover:border-amber-500/80 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🔍</span> View Full Spread &amp; Options
              </button>

              <button
                type="button"
                onClick={() => handleBookPackage(pkg.id)}
                className={`w-full min-h-[46px] px-5 py-3 rounded-xl font-display text-base font-bold tracking-wider uppercase transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center text-center ${
                  isPopular
                    ? "bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] text-white [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)]"
                    : "bg-black/60 border border-[#C8A97E] backdrop-blur-md text-[#C8A97E] hover:border-[#FF7A00] hover:text-white hover:bg-black/80"
                }`}
              >
                Book {pkg.name} →
              </button>
            </div>
          </SpotlightCard>
        );
      });
    }

    if (category === "turnkey") {
      return TURNKEY_BUNDLES.map((bundle: TurnkeyPartyBundle) => {
        const isPopular = bundle.popular;
        return (
          <SpotlightCard key={bundle.id} isHighlighted={isPopular}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs uppercase font-extrabold tracking-wider ${
                    isPopular ? "text-[#FF8C38]" : "text-[#C8A97E]"
                  }`}
                >
                  {bundle.serves}
                </span>
                {isPopular && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-gradient-to-r from-[#EA580C] to-[#9A3412] border border-[#FF7A00]/80 text-white font-display font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_14px_rgba(234,88,12,0.5)]">
                    ★ MOST POPULAR ★
                  </span>
                )}
              </div>

              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide leading-tight min-h-[36px]">
                {bundle.name}
              </h3>

              <div className="flex items-baseline gap-2">
                <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                  Turnkey Bundle:
                </span>
                <span
                  className={`text-3xl sm:text-4xl font-black ${
                    isPopular ? "text-[#FF8C38]" : "text-[#C8A97E]"
                  }`}
                >
                  ${bundle.price.toFixed(2)}
                </span>
                <span className="text-xs text-zinc-400">flat</span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed min-h-[44px]">
                {bundle.description}
              </p>

              <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap gap-1.5">
                <span className="text-[11px] bg-zinc-900 border border-zinc-700/80 px-2.5 py-1 rounded text-zinc-200 font-semibold inline-flex items-center gap-1">
                  <span className="text-amber-400">🔥</span> Ready Hot Pans
                </span>
                <span className="text-[11px] bg-zinc-900 border border-zinc-700/80 px-2.5 py-1 rounded text-zinc-200 font-semibold inline-flex items-center gap-1">
                  <span className="text-amber-400">👥</span> {bundle.serves}
                </span>
                <span className="text-[11px] bg-zinc-900 border border-zinc-700/80 px-2.5 py-1 rounded text-zinc-200 font-semibold inline-flex items-center gap-1">
                  <span className="text-amber-400">✓</span> Serving Kit &amp; Sauce
                </span>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-zinc-800/80 space-y-2.5">
              <button
                type="button"
                onClick={() => handleOpenModal({ type: "turnkey", pkg: bundle })}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-zinc-700 hover:border-amber-500/80 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🔍</span> View Full Spread &amp; Options
              </button>

              <button
                type="button"
                onClick={() => handleBookPackage(bundle.id)}
                className={`w-full min-h-[46px] px-5 py-3 rounded-xl font-display text-base font-bold tracking-wider uppercase transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center text-center ${
                  isPopular
                    ? "bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] text-white [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)]"
                    : "bg-black/60 border border-[#C8A97E] backdrop-blur-md text-[#C8A97E] hover:border-[#FF7A00] hover:text-white hover:bg-black/80"
                }`}
              >
                Reserve {bundle.name} →
              </button>
            </div>
          </SpotlightCard>
        );
      });
    }

    // meal-prep
    return MEAL_PREP_TIERS.map((tier: MealPrepTier) => {
      const isPopular = tier.id === "mp-10" || tier.mealCount === 10;
      return (
        <SpotlightCard key={tier.id} isHighlighted={isPopular}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isPopular ? "text-[#FF8C38]" : "text-[#C8A97E]"
                }`}
              >
                {tier.mealCount} Vacuum-Sealed Meals
              </span>
              {isPopular && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-gradient-to-r from-[#EA580C] to-[#9A3412] border border-[#FF7A00]/80 text-white font-display font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_14px_rgba(234,88,12,0.5)]">
                  ★ MOST POPULAR ★
                </span>
              )}
            </div>

            <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide leading-tight min-h-[36px]">
              {tier.name}
            </h3>

            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl sm:text-4xl font-black ${
                  isPopular ? "text-[#FF8C38]" : "text-[#C8A97E]"
                }`}
              >
                ${tier.price.toFixed(2)}
              </span>
              <span className="text-xs text-zinc-400">
                (${tier.pricePerMeal.toFixed(2)}/meal)
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed min-h-[44px]">
              {tier.description}
            </p>

            <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap gap-1.5">
              <span className="text-[11px] bg-zinc-900 border border-zinc-700/80 px-2.5 py-1 rounded text-zinc-200 font-semibold inline-flex items-center gap-1">
                <span className="text-amber-400">🥗</span> {tier.mealCount} Meals
              </span>
              <span className="text-[11px] bg-zinc-900 border border-zinc-700/80 px-2.5 py-1 rounded text-zinc-200 font-semibold inline-flex items-center gap-1">
                <span className="text-amber-400">🍖</span> Smoked Lean Meats
              </span>
              <span className="text-[11px] bg-zinc-900 border border-zinc-700/80 px-2.5 py-1 rounded text-zinc-200 font-semibold inline-flex items-center gap-1">
                <span className="text-amber-400">⚡</span> 3-Min Quick Reheat
              </span>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-zinc-800/80 space-y-2.5">
            <button
              type="button"
              onClick={() => handleOpenModal({ type: "meal-prep", pkg: tier })}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-zinc-700 hover:border-amber-500/80 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🔍</span> View Full Spread &amp; Options
            </button>

            <button
              type="button"
              onClick={() => handleBookPackage(tier.id)}
              className={`w-full min-h-[46px] px-5 py-3 rounded-xl font-display text-base font-bold tracking-wider uppercase transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center text-center ${
                isPopular
                  ? "bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] text-white [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)]"
                  : "bg-black/60 border border-[#C8A97E] backdrop-blur-md text-[#C8A97E] hover:border-[#FF7A00] hover:text-white hover:bg-black/80"
              }`}
            >
              Order {tier.name} →
            </button>
          </div>
        </SpotlightCard>
      );
    });
  };

  return (
    <section
      id="packages"
      className="py-16 sm:py-28 px-4 sm:px-8 bg-[#121214] border-y border-zinc-800/80 relative overflow-hidden"
      aria-labelledby="packages-heading"
    >
      {/* Ambient Radial Ember Backlight to break dead space */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-amber-600/5 blur-[160px]"
      />

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm">
            ★ SMOKEHOUSE MENU TIERS ★
          </span>
          <h2
            id="packages-heading"
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4EFEA] leading-tight"
          >
            Spotlight Catering Packages
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base leading-relaxed">
            Choose from per-person guest packages, turnkey game-day party bundles,
            or weekly high-protein vacuum-sealed meal prep tiers.
          </p>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP VIEW (hidden on mobile, visible on md: and up)   */}
        {/* ======================================================== */}
        <div className="hidden md:block space-y-10">
          {/* 3-Category Selector Cards */}
          <div
            role="tablist"
            aria-label="Catering package categories"
            className="grid grid-cols-3 gap-4 max-w-5xl mx-auto"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.key;
              return (
                <button
                  key={cat.key}
                  role="tab"
                  id={`tab-desktop-${cat.key}`}
                  aria-selected={isActive}
                  aria-controls={`panel-desktop-${cat.key}`}
                  onClick={() => setActiveTab(cat.key)}
                  className={`p-5 rounded-2xl text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between group cursor-pointer ${
                    isActive
                      ? "bg-[#1A1816] border-2 border-[#EA580C] shadow-[0_0_24px_rgba(234,88,12,0.3)] ring-1 ring-[#EA580C]/50"
                      : "bg-[#151518]/90 border border-zinc-800 hover:border-zinc-700 hover:bg-[#1A1A1E]"
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EA580C] via-[#FF8C38] to-[#C8A97E]" />
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xl" aria-hidden="true">{cat.icon}</span>
                      <span
                        className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isActive
                            ? "bg-[#EA580C]/20 border-[#EA580C]/60 text-[#FF8C38]"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400"
                        }`}
                      >
                        {cat.countBadge}
                      </span>
                    </div>

                    <h3
                      className={`font-display text-xl sm:text-2xl font-bold tracking-wide transition-colors ${
                        isActive ? "text-white" : "text-zinc-200 group-hover:text-white"
                      }`}
                    >
                      {cat.title}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {cat.tagline}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <span
                      className={`text-xs font-black tracking-wide ${
                        isActive ? "text-[#FF8C38]" : "text-[#C8A97E]"
                      }`}
                    >
                      {cat.priceAnchor}
                    </span>

                    <span
                      className={`text-[11px] font-bold inline-flex items-center gap-1 ${
                        isActive ? "text-[#FF8C38]" : "text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    >
                      {isActive ? "● Viewing" : "Select →"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Desktop 3-Card Grid for Active Category */}
          <div
            id={`panel-desktop-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-desktop-${activeTab}`}
            className="grid grid-cols-3 gap-6 lg:gap-8 items-stretch pt-2"
          >
            {renderCards(activeTab)}
          </div>
        </div>

        {/* ======================================================== */}
        {/* MOBILE ACCORDION (block on mobile, hidden on md: and up) */}
        {/* ======================================================== */}
        <div className="block md:hidden space-y-4">
          <p className="text-center text-xs text-amber-400/90 font-semibold tracking-wider uppercase mb-2">
            ▼ Tap a category below to explore its packages
          </p>

          {CATEGORIES.map((cat) => {
            const isExpanded = activeTab === cat.key;
            return (
              <div
                key={cat.key}
                className="space-y-3 rounded-2xl overflow-hidden transition-all duration-300"
              >
                {/* Category Accordion Header Card */}
                <button
                  type="button"
                  id={`tab-mobile-${cat.key}`}
                  aria-expanded={isExpanded}
                  aria-controls={`panel-mobile-${cat.key}`}
                  onClick={() => {
                    // Toggle or select
                    setActiveTab(cat.key);
                  }}
                  className={`w-full p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between group cursor-pointer ${
                    isExpanded
                      ? "bg-[#1A1816] border-2 border-[#EA580C] shadow-[0_0_24px_rgba(234,88,12,0.35)] ring-1 ring-[#EA580C]/50"
                      : "bg-[#151518]/95 border border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {isExpanded && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EA580C] via-[#FF8C38] to-[#C8A97E]" />
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl" aria-hidden="true">{cat.icon}</span>
                        <h3 className="font-display text-xl font-bold tracking-wide text-white">
                          {cat.title}
                        </h3>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isExpanded
                            ? "bg-[#EA580C]/20 border-[#EA580C]/60 text-[#FF8C38]"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400"
                        }`}
                      >
                        {cat.countBadge}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {cat.tagline}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <span
                      className={`text-xs font-black tracking-wide ${
                        isExpanded ? "text-[#FF8C38]" : "text-[#C8A97E]"
                      }`}
                    >
                      {cat.priceAnchor}
                    </span>

                    <span
                      className={`text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                        isExpanded
                          ? "bg-[#EA580C] text-white shadow-md font-black"
                          : "bg-zinc-900 text-stone-300 border border-zinc-700"
                      }`}
                    >
                      {isExpanded ? (
                        <>
                          <span>Viewing Tiers</span>
                          <span className="text-[10px]">▲</span>
                        </>
                      ) : (
                        <>
                          <span>View Tiers</span>
                          <span className="text-[10px]">▼</span>
                        </>
                      )}
                    </span>
                  </div>
                </button>

                {/* Unfolded Packages (Inline directly underneath the category card!) */}
                {isExpanded && (
                  <div
                    id={`panel-mobile-${cat.key}`}
                    role="region"
                    aria-labelledby={`tab-mobile-${cat.key}`}
                    className="space-y-4 pt-1 pb-3 px-1 animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    <div className="flex items-center gap-2 pl-2 text-xs text-zinc-400 font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-pulse" />
                      <span>{cat.title} — Choose From 3 Packages:</span>
                    </div>

                    {renderCards(cat.key)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. The Full Manifest Detail Popup Modal (Shared) */}
      <PackageDetailModal
        isOpen={!!modalData}
        data={modalData}
        onClose={handleCloseModal}
        onBook={handleBookPackage}
      />
    </section>
  );
}

"use client";

import React, { useState, MouseEvent } from "react";
import {
  PER_PERSON_PACKAGES,
  TURNKEY_BUNDLES,
  MEAL_PREP_TIERS,
  PerPersonPackage,
} from "@/data/catering-packages";

type TabKey = "per-person" | "turnkey" | "meal-prep";

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
        className="relative p-[2px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 lg:-translate-y-2 z-20"
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
          className={`relative z-10 bg-[#161619] rounded-[14px] p-7 flex flex-col justify-between h-full border-2 border-[#EA580C]/80 shadow-[0_0_30px_rgba(234,88,12,0.25)] ${className}`}
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
      className={`relative rounded-2xl p-7 flex flex-col justify-between border border-zinc-800 hover:border-[#C8A97E]/40 bg-[#161619]/90 transition-all duration-300 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function PackageGrid() {
  const [activeTab, setActiveTab] = useState<TabKey>("per-person");

  return (
    <section
      id="packages"
      className="py-20 sm:py-28 px-4 sm:px-8 bg-[#121214] border-y border-zinc-800/80 relative overflow-hidden"
      aria-labelledby="packages-heading"
    >
      {/* Ambient Radial Ember Backlight to break dead space */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-amber-600/5 blur-[160px]"
      />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm">
            ★ SMOKEHOUSE MENU TIERS ★
          </span>
          <h2
            id="packages-heading"
            className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#F4EFEA] leading-tight"
          >
            Spotlight Catering Packages
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Choose from per-person guest packages, turnkey game-day party bundles,
            or weekly high-protein vacuum-sealed meal prep tiers.
          </p>

          {/* Tab Switcher */}
          <div
            role="tablist"
            aria-label="Catering package categories"
            className="inline-flex p-1.5 rounded-2xl bg-zinc-950/90 border-2 border-[#EA580C]/70 shadow-[0_0_24px_rgba(234,88,12,0.25)] mt-4 flex-wrap justify-center gap-1.5 backdrop-blur-md"
          >
            <button
              role="tab"
              id="tab-per-person"
              aria-selected={activeTab === "per-person"}
              aria-controls="panel-per-person"
              onClick={() => setActiveTab("per-person")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all min-h-[48px] flex items-center justify-center ${
                activeTab === "per-person"
                  ? "bg-[#C8A97E] text-[#0A0A0A] shadow-md font-extrabold"
                  : "text-stone-300 hover:text-[#FF8C38] hover:bg-zinc-900/80"
              }`}
            >
              Per-Person Catering
            </button>
            <button
              role="tab"
              id="tab-turnkey"
              aria-selected={activeTab === "turnkey"}
              aria-controls="panel-turnkey"
              onClick={() => setActiveTab("turnkey")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all min-h-[48px] flex items-center justify-center ${
                activeTab === "turnkey"
                  ? "bg-[#C8A97E] text-[#0A0A0A] shadow-md font-extrabold"
                  : "text-stone-300 hover:text-[#FF8C38] hover:bg-zinc-900/80"
              }`}
            >
              Turnkey Party Pans
            </button>
            <button
              role="tab"
              id="tab-meal-prep"
              aria-selected={activeTab === "meal-prep"}
              aria-controls="panel-meal-prep"
              onClick={() => setActiveTab("meal-prep")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all min-h-[48px] flex items-center justify-center ${
                activeTab === "meal-prep"
                  ? "bg-[#C8A97E] text-[#0A0A0A] shadow-md font-extrabold"
                  : "text-stone-300 hover:text-[#FF8C38] hover:bg-zinc-900/80"
              }`}
            >
              Weekly Meal Prep
            </button>
          </div>
        </div>

        {/* Tab Panel 1: Per-Person Catering */}
        {activeTab === "per-person" && (
          <div
            id="panel-per-person"
            role="tabpanel"
            aria-labelledby="tab-per-person"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4"
          >
            {PER_PERSON_PACKAGES.map((pkg: PerPersonPackage) => {
              const isPitmasterFeast = pkg.id === "pitmaster-feast";
              return (
                <SpotlightCard
                  key={pkg.id}
                  isHighlighted={isPitmasterFeast}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs uppercase font-extrabold tracking-widest ${isPitmasterFeast ? "text-[#FF8C38]" : "text-[#C8A97E]"}`}>
                        {pkg.minimumGuests}+ Guests Minimum
                      </span>
                      {isPitmasterFeast && (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-gradient-to-r from-[#EA580C] to-[#9A3412] border border-[#FF7A00]/80 text-white font-display font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_14px_rgba(234,88,12,0.5)]">
                          ★ MOST POPULAR ★
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-3xl sm:text-4xl text-white tracking-wide leading-none">
                      {pkg.name}
                    </h3>

                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl sm:text-5xl font-black ${isPitmasterFeast ? "text-[#FF8C38]" : "text-[#C8A97E]"}`}>
                        ${pkg.pricePerPerson.toFixed(2)}
                      </span>
                      <span className="text-sm text-zinc-400 font-medium">
                        / person
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed min-h-[48px]">
                      {pkg.description}
                    </p>

                    <div className="pt-4 border-t border-zinc-800 space-y-2">
                      <span className="text-xs font-bold text-zinc-200 block uppercase tracking-wider">
                        Choose {pkg.meatsAllowed} Smoked Meats:
                      </span>
                      <ul className="text-xs text-zinc-300 space-y-1">
                        {pkg.meatOptions.map((meat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className={`${isPitmasterFeast ? "text-[#FF8C38]" : "text-[#C8A97E]"} font-bold`}>▪</span>
                            <span>{meat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-zinc-800 space-y-2">
                      <span className="text-xs font-bold text-zinc-200 block uppercase tracking-wider">
                        Choose {pkg.sidesAllowed} Scratch Sides:
                      </span>
                      <ul className="text-xs text-zinc-300 space-y-1">
                        {pkg.sideOptions.map((side, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className={`${isPitmasterFeast ? "text-[#FF8C38]" : "text-[#C8A97E]"} font-bold`}>▪</span>
                            <span>{side}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-zinc-800 space-y-1 text-xs text-zinc-400">
                      <span className="font-bold text-zinc-300 block">Includes:</span>
                      {pkg.includes.map((inc, idx) => (
                        <p key={idx} className="text-zinc-300">
                          <span className={isPitmasterFeast ? "text-[#FF8C38]" : "text-[#C8A97E]"}>✓</span> {inc}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-zinc-800">
                    <a
                      href={`#quote?pkg=${pkg.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (typeof window !== "undefined") {
                          window.dispatchEvent(
                            new CustomEvent("open-quote-modal", { detail: { packageId: pkg.id } })
                          );
                        }
                      }}
                      className={`w-full min-h-[48px] px-6 py-3.5 items-center justify-center rounded-[14px] font-display text-lg sm:text-xl font-bold tracking-wider uppercase transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex text-center ${
                        isPitmasterFeast
                          ? "bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] text-white [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)]"
                          : "bg-black/60 border border-[#C8A97E] backdrop-blur-md shadow-[0_0_12px_rgba(200,169,126,0.15)] text-[#C8A97E] hover:border-[#FF7A00] hover:text-white hover:bg-black/80 hover:shadow-[0_0_18px_rgba(255,122,0,0.4)] [text-shadow:_0_1px_2px_rgba(0,0,0,0.95)]"
                      }`}
                    >
                      Book {pkg.name}
                    </a>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}

        {/* Tab Panel 2: Turnkey Party Pans */}
        {activeTab === "turnkey" && (
          <div
            id="panel-turnkey"
            role="tabpanel"
            aria-labelledby="tab-turnkey"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4"
          >
            {TURNKEY_BUNDLES.map((bundle) => (
              <SpotlightCard key={bundle.id} isHighlighted={bundle.popular}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs uppercase font-extrabold tracking-wider ${bundle.popular ? "text-[#FF8C38]" : "text-[#C8A97E]"}`}>
                      {bundle.serves}
                    </span>
                    {bundle.popular && (
                      <span className="inline-flex items-center gap-1 text-[11px] bg-gradient-to-r from-[#EA580C] to-[#9A3412] border border-[#FF7A00]/80 text-white font-display font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_14px_rgba(234,88,12,0.5)]">
                        ★ MOST POPULAR ★
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-3xl sm:text-4xl text-white tracking-wide leading-none">
                    {bundle.name}
                  </h3>

                  <div className={`text-4xl sm:text-5xl font-black ${bundle.popular ? "text-[#FF8C38]" : "text-[#C8A97E]"}`}>
                    ${bundle.price.toFixed(2)}
                  </div>

                  <p className="text-xs text-zinc-300 min-h-[40px]">
                    {bundle.description}
                  </p>

                  <div className="pt-4 border-t border-zinc-800 space-y-2">
                    <span className="text-xs font-bold text-zinc-200 block uppercase tracking-wider">
                      Full Spread Manifest:
                    </span>
                    <ul className="text-xs text-zinc-300 space-y-2">
                      {bundle.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`${bundle.popular ? "text-[#FF8C38]" : "text-[#C8A97E]"} font-bold mt-0.5`}>▪</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-800">
                  <a
                    href={`#quote?bundle=${bundle.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(
                          new CustomEvent("open-quote-modal", { detail: { packageId: bundle.id } })
                        );
                      }
                    }}
                    className={`w-full min-h-[48px] px-6 py-3.5 items-center justify-center rounded-[14px] font-display text-lg sm:text-xl font-bold tracking-wider uppercase transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex text-center ${
                      bundle.popular
                        ? "bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] text-white [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)]"
                        : "bg-black/60 border border-[#C8A97E] backdrop-blur-md shadow-[0_0_12px_rgba(200,169,126,0.15)] text-[#C8A97E] hover:border-[#FF7A00] hover:text-white hover:bg-black/80 hover:shadow-[0_0_18px_rgba(255,122,0,0.4)] [text-shadow:_0_1px_2px_rgba(0,0,0,0.95)]"
                    }`}
                  >
                    Reserve {bundle.name}
                  </a>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}

        {/* Tab Panel 3: Weekly Meal Prep */}
        {activeTab === "meal-prep" && (
          <div
            id="panel-meal-prep"
            role="tabpanel"
            aria-labelledby="tab-meal-prep"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4"
          >
            {MEAL_PREP_TIERS.map((tier) => {
              const isPopularPrep = tier.id === "mp-10" || tier.mealCount === 10;
              return (
                <SpotlightCard key={tier.id} isHighlighted={isPopularPrep}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase tracking-wider ${isPopularPrep ? "text-[#FF8C38]" : "text-[#C8A97E]"}`}>
                        {tier.mealCount} Vacuum-Sealed Meals
                      </span>
                      {isPopularPrep && (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-gradient-to-r from-[#EA580C] to-[#9A3412] border border-[#FF7A00]/80 text-white font-display font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_14px_rgba(234,88,12,0.5)]">
                          ★ MOST POPULAR ★
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-3xl sm:text-4xl text-white tracking-wide leading-none">
                      {tier.name}
                    </h3>

                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl sm:text-5xl font-black ${isPopularPrep ? "text-[#FF8C38]" : "text-[#C8A97E]"}`}>
                        ${tier.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-zinc-400">
                        (${tier.pricePerMeal.toFixed(2)}/meal)
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 min-h-[40px]">
                      {tier.description}
                    </p>

                    <div className="pt-4 border-t border-zinc-800 space-y-2">
                      <span className="text-xs font-bold text-zinc-200 block uppercase tracking-wider">
                        Featured Smoked Proteins:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tier.proteinHighlights.map((prot, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-zinc-900 border border-zinc-700 px-2.5 py-1 rounded text-zinc-300"
                          >
                            {prot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-zinc-800">
                    <a
                      href={`#quote?prep=${tier.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (typeof window !== "undefined") {
                          window.dispatchEvent(
                            new CustomEvent("open-quote-modal", { detail: { packageId: tier.id } })
                          );
                        }
                      }}
                      className={`w-full min-h-[48px] px-6 py-3.5 items-center justify-center rounded-[14px] font-display text-lg sm:text-xl font-bold tracking-wider uppercase transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex text-center ${
                        isPopularPrep
                          ? "bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] text-white [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)]"
                          : "bg-black/60 border border-[#C8A97E] backdrop-blur-md shadow-[0_0_12px_rgba(200,169,126,0.15)] text-[#C8A97E] hover:border-[#FF7A00] hover:text-white hover:bg-black/80 hover:shadow-[0_0_18px_rgba(255,122,0,0.4)] [text-shadow:_0_1px_2px_rgba(0,0,0,0.95)]"
                      }`}
                    >
                      Order {tier.name}
                    </a>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

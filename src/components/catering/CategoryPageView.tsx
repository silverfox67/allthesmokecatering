"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site-config";
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
import { QuoteModal } from "@/components/forms/QuoteModal";
import { Footer } from "@/components/layout/Footer";

export type CategoryKey = "per-person" | "turnkey" | "meal-prep";

interface CategoryData {
  key: CategoryKey;
  route: string;
  badge: string;
  title: string;
  priceAnchor: string;
  tagline: string;
  description: string;
  icon: string;
  trustPoints: string[];
}

export const CATEGORY_INFO: Record<CategoryKey, CategoryData> = {
  "per-person": {
    key: "per-person",
    route: "/catering/per-person",
    badge: "★ 3 SIGNATURE TIERS • HARDWOOD LIVE-FIRE ★",
    title: "Per-Person Smokehouse Buffet",
    priceAnchor: "Starting at $24.95 / person",
    tagline: "Full buffet spreads for 20+ guests with hardwood smoked meats & scratch sides.",
    description:
      "Engineered for weddings, corporate galas, and backyard celebrations. Every tier includes your choice of seasoned hardwood-smoked proteins, scratch-made Southern sides, brioche buns, craft barbecue sauces, and complete disposable buffet setup.",
    icon: "🍖",
    trustPoints: [
      "20+ Guest Minimum",
      "Hardwood Smoked Over Hickory & Fruitwood",
      "Scratch Southern Sides & Fresh Buns",
      "Full Chafing & Serving Setup Included",
    ],
  },
  turnkey: {
    key: "turnkey",
    route: "/catering/party-pans",
    badge: "★ 3 READY DROP-OFF BUNDLES • SERVES 12–35 ★",
    title: "Turnkey Party Pans & Bundles",
    priceAnchor: "Bundles from $285 flat",
    tagline: "Drop-off smokehouse pans hot & ready for game days, tailgates, and office lunches.",
    description:
      "Skip the per-person head counting. Order ready-to-serve deep aluminum catering pans delivered steaming hot with serving tongs, sauces, and buns. Perfect for watch parties, fantasy drafts, and casual family cookouts.",
    icon: "★",
    trustPoints: [
      "Serves 12 to 35 Guests",
      "Delivered Steaming Hot & Ready to Serve",
      "Heavy-Duty Chafing Kits & Serving Tongs",
      "Zero Kitchen Prep or Cook Time Required",
    ],
  },
  "meal-prep": {
    key: "meal-prep",
    route: "/catering/meal-prep",
    badge: "★ 3 HIGH-PROTEIN TIERS • VACUUM-SEALED ★",
    title: "Weekly Smoked Meal Prep",
    priceAnchor: "From $15.62 / meal",
    tagline: "Vacuum-sealed high-protein smoked meats & wholesome clean sides.",
    description:
      "Restaurant-quality smokehouse meals sealed in vacuum pouches to lock in natural hickory moisture and nutrients. Ready in 3 minutes via water bath or microwave reheat. Ideal for athletes, busy executives, and healthy foodies.",
    icon: "🥗",
    trustPoints: [
      "Vacuum-Sealed Freshness Lock",
      "3-Minute Quick Reheat",
      "High-Protein & Clean Macro Friendly",
      "Weekly Batch Smoke Pick-Up & Delivery",
    ],
  },
};

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

  if (isHighlighted) {
    return (
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative p-[2px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 lg:-translate-y-2 z-20 flex flex-col h-full"
      >
        <div
          aria-hidden="true"
          className="absolute inset-[-150%] animate-border-beam bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_60deg,#EA580C_120deg,#FF8C38_180deg,transparent_240deg)]"
        />
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

export function CategoryPageView({ category }: { category: CategoryKey }) {
  const info = CATEGORY_INFO[category];
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

  // Other two categories for fast cross-switching
  const otherCategories = (
    Object.keys(CATEGORY_INFO) as CategoryKey[]
  ).filter((k) => k !== category);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 flex flex-col">
      {/* 1. STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full bg-[#0E0E10]/90 backdrop-blur-md border-b border-zinc-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          {/* Back Button */}
          <Link
            href="/#packages"
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-zinc-900/90 border border-zinc-700/80 hover:border-[#EA580C] text-zinc-300 hover:text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md group cursor-pointer"
          >
            <span className="text-[#EA580C] group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            <span>Back to All Packages</span>
          </Link>

          {/* Center Brand Monogram */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            title="All The Smoke Catering Home"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <Image
                src="/brand/ats-monogram.png"
                alt="ATS Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-display text-sm sm:text-base font-bold tracking-wider text-[#F4EFEA] hidden md:inline">
              ALL THE SMOKE
            </span>
          </Link>

          {/* Quick Contact & Quote CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${SITE_CONFIG.phoneFormatted}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-[#EA580C] text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              <span>📞</span>
              <span>{SITE_CONFIG.phone}</span>
            </a>

            <button
              type="button"
              onClick={() => handleBookPackage("pitmaster-feast")}
              className="inline-flex h-9 px-3.5 sm:px-4 items-center justify-center rounded-xl bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border border-[#FF7A00] font-display text-xs sm:text-sm font-bold tracking-wider text-white uppercase shadow-[0_0_12px_rgba(255,122,0,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              Get Quote
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO / CATEGORY HEADER */}
      <section className="relative pt-10 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-8 border-b border-zinc-800/80 bg-gradient-to-b from-[#141210] to-[#0A0A0A] overflow-hidden">
        {/* Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-amber-600/10 blur-[140px]"
        />

        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 relative z-10 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 font-semibold tracking-wide">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/#packages" className="hover:text-amber-400 transition-colors">
              Catering Packages
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-bold">{info.title}</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#FF8C38] bg-[#EA580C]/15 border border-[#EA580C]/40 px-3.5 py-1.5 rounded-full shadow-sm">
            <span>{info.icon}</span>
            <span>{info.badge}</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4EFEA] leading-tight">
            {info.title}
          </h1>

          {/* Price Anchor */}
          <p className="text-lg sm:text-2xl font-black text-[#C8A97E]">
            {info.priceAnchor}
          </p>

          {/* Description */}
          <p className="text-zinc-300 text-xs sm:text-base leading-relaxed max-w-3xl mx-auto">
            {info.description}
          </p>

          {/* Trust Points Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {info.trustPoints.map((pt, idx) => (
              <span
                key={idx}
                className="text-[11px] sm:text-xs bg-zinc-900/90 border border-zinc-800 text-zinc-300 font-medium px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm"
              >
                <span className="text-[#EA580C]">✓</span>
                <span>{pt}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE 3 PACKAGE CARDS */}
      <section className="py-12 sm:py-20 px-4 sm:px-8 flex-1">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">
              Select one of our 3 curated tiers below:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
            {/* PER-PERSON CARDS */}
            {category === "per-person" &&
              PER_PERSON_PACKAGES.map((pkg: PerPersonPackage) => {
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

                      <h2 className="font-display text-2xl sm:text-3xl text-white tracking-wide leading-tight min-h-[36px]">
                        {pkg.name}
                      </h2>

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
                        <span>🔍</span> View Full Spread &amp; Calculate
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
              })}

            {/* TURNKEY CARDS */}
            {category === "turnkey" &&
              TURNKEY_BUNDLES.map((bundle: TurnkeyPartyBundle) => {
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

                      <h2 className="font-display text-2xl sm:text-3xl text-white tracking-wide leading-tight min-h-[36px]">
                        {bundle.name}
                      </h2>

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
                          <span className="text-[#C8A97E]">★</span> Ready Hot Pans
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
              })}

            {/* MEAL PREP CARDS */}
            {category === "meal-prep" &&
              MEAL_PREP_TIERS.map((tier: MealPrepTier) => {
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

                      <h2 className="font-display text-2xl sm:text-3xl text-white tracking-wide leading-tight min-h-[36px]">
                        {tier.name}
                      </h2>

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
              })}
          </div>

          {/* 4. RETURN & EXPLORE MORE SECTION */}
          <div className="pt-12 sm:pt-16 mt-12 border-t border-zinc-800/80 max-w-4xl mx-auto space-y-8">
            {/* Primary Return Button */}
            <div className="text-center space-y-3">
              <Link
                href="/#packages"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-700 hover:border-[#EA580C] text-white font-display text-base sm:text-lg font-bold tracking-wide transition-all shadow-xl group cursor-pointer"
              >
                <span className="text-[#EA580C] group-hover:-translate-x-1 transition-transform text-xl">
                  ←
                </span>
                <span>Back to All Catering Packages</span>
              </Link>
              <p className="text-xs text-zinc-400">
                Return to the main page to compare all 3 catering categories.
              </p>
            </div>

            {/* Quick Switch to Other Categories */}
            <div className="bg-[#141417] p-5 sm:p-6 rounded-2xl border border-zinc-800 space-y-3">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#C8A97E] text-center">
                Explore Our Other Catering Formats:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherCategories.map((otherKey) => {
                  const other = CATEGORY_INFO[otherKey];
                  return (
                    <Link
                      key={otherKey}
                      href={other.route}
                      className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-[#EA580C]/80 hover:bg-[#1A1816] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl" aria-hidden="true">
                          {other.icon}
                        </span>
                        <div>
                          <h4 className="font-display text-sm font-bold text-white group-hover:text-[#FF8C38] transition-colors">
                            {other.title}
                          </h4>
                          <span className="text-xs text-zinc-400">
                            {other.priceAnchor}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#EA580C] group-hover:translate-x-1 transition-transform">
                        View →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Direct Consultation Contact Banner */}
            <div className="bg-gradient-to-r from-zinc-950 via-[#181310] to-zinc-950 p-6 rounded-2xl border border-amber-900/40 text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF8C38]">
                ★ Bespoke Smokehouse Consultations ★
              </span>
              <h3 className="font-display text-xl sm:text-2xl text-white font-bold">
                Need Custom Whole Meats or Special Timing?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto">
                Call or text Master Pitmaster Marion Bolden directly for custom guest counts, dietary accommodations, or on-site smoker rig bookings.
              </p>
              <div className="pt-2">
                <a
                  href={`tel:${SITE_CONFIG.phoneFormatted}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C84A0A] text-white font-bold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <span>📞</span>
                  <span>Call Marion: {SITE_CONFIG.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <Footer />

      {/* 6. MODALS */}
      <PackageDetailModal
        isOpen={!!modalData}
        data={modalData}
        onClose={handleCloseModal}
        onBook={handleBookPackage}
      />
      <QuoteModal />
    </div>
  );
}

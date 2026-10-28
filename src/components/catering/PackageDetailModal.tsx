"use client";

import React, { useState, useEffect } from "react";
import {
  PerPersonPackage,
  TurnkeyPartyBundle,
  MealPrepTier,
} from "@/data/catering-packages";

export type PackageModalData =
  | { type: "per-person"; pkg: PerPersonPackage }
  | { type: "turnkey"; pkg: TurnkeyPartyBundle }
  | { type: "meal-prep"; pkg: MealPrepTier };

interface PackageDetailModalProps {
  isOpen: boolean;
  data: PackageModalData | null;
  onClose: () => void;
  onBook: (packageId: string) => void;
}

export function PackageDetailModal({
  isOpen,
  data,
  onClose,
  onBook,
}: PackageDetailModalProps) {
  const [guestCount, setGuestCount] = useState<number>(30);

  // Sync guest count with package minimum when opened
  useEffect(() => {
    if (data && data.type === "per-person") {
      setGuestCount(Math.max(data.pkg.minimumGuests, 30));
    }
  }, [data]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const { type, pkg } = data;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="package-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#141417] border-2 border-[#EA580C]/60 rounded-3xl shadow-[0_0_50px_rgba(234,88,12,0.25)] overflow-hidden my-6 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Ambient Corner Ember Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-500/15 blur-[80px]"
        />

        {/* Modal Header */}
        <div className="bg-zinc-950/95 border-b border-zinc-800/80 px-6 py-5 flex items-start justify-between relative z-10 shrink-0">
          <div className="space-y-1.5 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF8C38] bg-[#EA580C]/15 border border-[#EA580C]/40 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                {type === "per-person" && "★ Per-Person Smokehouse Buffet"}
                {type === "turnkey" && "★ Turnkey Game-Day Party Pan"}
                {type === "meal-prep" && "★ Weekly Smoked Meal Prep Tier"}
              </span>

              {"popular" in pkg && pkg.popular && (
                <span className="text-[11px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#EA580C] to-[#9A3412] border border-[#FF7A00]/80 px-2.5 py-0.5 rounded-full shadow-sm">
                  Most Popular Choice
                </span>
              )}
            </div>

            <h2
              id="package-modal-title"
              className="font-display text-2xl sm:text-3xl lg:text-4xl text-white tracking-wide leading-tight"
            >
              {pkg.name}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400">
              {type === "per-person" && (pkg as PerPersonPackage).tagline}
              {type === "turnkey" && `Full Pan Catering Spread • ${(pkg as TurnkeyPartyBundle).serves}`}
              {type === "meal-prep" && `${(pkg as MealPrepTier).mealCount} Individual Vacuum-Sealed Clean Meals`}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close package details"
            className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-lg transition-colors border border-zinc-700 shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-7 overflow-y-auto relative z-10 text-zinc-200">
          {/* Price & Summary Box */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-zinc-400 block mb-1">
                Pricing &amp; Servings
              </span>
              <div className="flex items-baseline gap-2">
                {type === "per-person" && (
                  <>
                    <span className="font-display text-3xl sm:text-4xl font-black text-[#FF8C38]">
                      ${(pkg as PerPersonPackage).pricePerPerson.toFixed(2)}
                    </span>
                    <span className="text-sm text-zinc-400 font-medium">/ person</span>
                    <span className="text-xs text-zinc-400 ml-2">
                      ({(pkg as PerPersonPackage).minimumGuests} guests min)
                    </span>
                  </>
                )}
                {type === "turnkey" && (
                  <>
                    <span className="font-display text-3xl sm:text-4xl font-black text-[#FF8C38]">
                      ${(pkg as TurnkeyPartyBundle).price.toFixed(2)}
                    </span>
                    <span className="text-sm text-zinc-400 font-medium">flat party bundle</span>
                    <span className="text-xs text-amber-400 font-semibold ml-2">
                      ({(pkg as TurnkeyPartyBundle).serves})
                    </span>
                  </>
                )}
                {type === "meal-prep" && (
                  <>
                    <span className="font-display text-3xl sm:text-4xl font-black text-[#FF8C38]">
                      ${(pkg as MealPrepTier).price.toFixed(2)}
                    </span>
                    <span className="text-sm text-zinc-400 font-medium">
                      (${(pkg as MealPrepTier).pricePerMeal.toFixed(2)} / meal)
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="text-xs text-zinc-400 sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800">
              <span className="text-zinc-200 font-bold block">Hardwood Smoked Fresh</span>
              <span>Hickory &amp; Fruitwood Slow Smoke</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#C8A97E]">
              Pitmaster Flavor Profile
            </h3>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {pkg.description}
            </p>
          </div>

          {/* TYPE 1: PER-PERSON DETAILS */}
          {type === "per-person" && (
            <>
              {/* Quick Guest Estimator Slider */}
              <div className="p-5 rounded-2xl bg-[#161619] border border-amber-900/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                      Instant Guest Cost Estimator
                    </span>
                    <p className="text-xs text-zinc-400">
                      Adjust your guest count to see estimated food subtotal.
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-2xl font-black text-white">
                      ${(guestCount * (pkg as PerPersonPackage).pricePerPerson).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-xs text-zinc-400 block">
                      estimated for {guestCount} guests
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="range"
                    min={(pkg as PerPersonPackage).minimumGuests}
                    max={250}
                    step={5}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    aria-label="Guest count slider"
                    className="w-full accent-[#EA580C] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Min: {(pkg as PerPersonPackage).minimumGuests} guests</span>
                    <span>100</span>
                    <span>250+ guests</span>
                  </div>
                </div>
              </div>

              {/* Meats Choice Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#FF8C38]">
                    Choose {(pkg as PerPersonPackage).meatsAllowed} Smoked Meats:
                  </h3>
                  <span className="text-[11px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    Select in Quote Form
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(pkg as PerPersonPackage).meatOptions.map((meat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3 text-xs sm:text-sm text-zinc-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#EA580C]/20 border border-[#EA580C]/60 flex items-center justify-center text-[#FF8C38] font-bold text-xs shrink-0">
                        ✓
                      </span>
                      <span className="font-semibold">{meat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sides Choice Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#FF8C38]">
                    Choose {(pkg as PerPersonPackage).sidesAllowed} Scratch Sides:
                  </h3>
                  <span className="text-[11px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    Select in Quote Form
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(pkg as PerPersonPackage).sideOptions.map((side, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3 text-xs sm:text-sm text-zinc-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#C8A97E]/20 border border-[#C8A97E]/60 flex items-center justify-center text-[#C8A97E] font-bold text-xs shrink-0">
                        ✓
                      </span>
                      <span className="font-semibold">{side}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#C8A97E]">
                  Complete Package Manifest &amp; Serviceware Included:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(pkg as PerPersonPackage).includes.map((inc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-300 flex items-start gap-2.5"
                    >
                      <span className="text-amber-400 mt-0.5 shrink-0">★</span>
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TYPE 2: TURNKEY PARTY BUNDLE DETAILS */}
          {type === "turnkey" && (
            <>
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#FF8C38]">
                  Full Spread Manifest (Hot &amp; Ready To Serve):
                </h3>
                <div className="space-y-2.5">
                  {(pkg as TurnkeyPartyBundle).items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3 text-xs sm:text-sm text-zinc-200"
                    >
                      <span className="w-6 h-6 rounded-lg bg-[#EA580C]/20 border border-[#EA580C]/60 flex items-center justify-center text-[#FF8C38] font-bold text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 space-y-2">
                <div className="flex items-center gap-2 text-zinc-200 font-bold">
                  <span className="text-[#C8A97E]">★</span>
                  <span>Turnkey Drop-Off Logistics:</span>
                </div>
                <p>
                  Delivered in heavy-duty commercial catering pans hot and ready to serve immediately. Includes serving tongs, disposable buffet utensils, napkins, and signature sauces.
                </p>
              </div>
            </>
          )}

          {/* TYPE 3: MEAL PREP TIER DETAILS */}
          {type === "meal-prep" && (
            <>
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#FF8C38]">
                  Featured Smoked Lean Proteins:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(pkg as MealPrepTier).proteinHighlights.map((prot, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center text-xs font-bold text-zinc-200"
                    >
                      <span className="text-amber-400 block text-lg mb-1">🍖</span>
                      {prot}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 space-y-2">
                <div className="flex items-center gap-2 text-zinc-200 font-bold">
                  <span className="text-amber-400">🥗</span>
                  <span>Nutritional &amp; Storage Guidelines:</span>
                </div>
                <ul className="space-y-1 text-zinc-400 list-disc list-inside">
                  <li>Vacuum-sealed in food-grade BPA-free containers.</li>
                  <li>Keeps fresh for 7 days refrigerated or 60 days frozen.</li>
                  <li>Reheats to juicy smokehouse tenderness in 3 minutes via microwave or skillet.</li>
                  <li>Pick-up in Chicago or weekly scheduled refrigerated delivery.</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Modal Sticky Footer Bar */}
        <div className="bg-zinc-950 border-t border-zinc-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 shrink-0">
          <div className="text-xs text-zinc-400 text-center sm:text-left">
            <span>Ready to lock in your smoker date?</span>
            <span className="text-white font-bold block sm:inline sm:ml-1">
              {type === "per-person" && `From $${(pkg as PerPersonPackage).pricePerPerson.toFixed(2)} / person`}
              {type === "turnkey" && `$${(pkg as TurnkeyPartyBundle).price.toFixed(2)} flat`}
              {type === "meal-prep" && `$${(pkg as MealPrepTier).price.toFixed(2)} total`}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-colors border border-zinc-800 min-h-[44px] flex-1 sm:flex-initial"
            >
              Back
            </button>

            <button
              onClick={() => {
                onClose();
                onBook(pkg.id);
              }}
              className="px-6 py-3 rounded-xl bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] font-display text-base font-bold tracking-wider text-white uppercase [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)] hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[44px] flex items-center justify-center gap-2 flex-1 sm:flex-initial text-center cursor-pointer"
            >
              Book {pkg.name} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

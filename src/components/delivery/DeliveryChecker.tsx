"use client";

import React, { useState } from "react";
import { SITE_CONFIG, DeliveryZone } from "@/config/site-config";

// Chicagoland Zip Code Lookup Map
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

interface CheckedResult {
  zone: DeliveryZone;
  zip: string;
  isCustomQuote?: boolean;
}

export function DeliveryChecker() {
  const [zipInput, setZipInput] = useState("");
  const [result, setResult] = useState<CheckedResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const checkZip = (zipToTest: string) => {
    const clean = zipToTest.trim();
    if (!/^\d{5}$/.test(clean)) {
      setErrorMsg("Please enter a valid 5-digit Chicagoland ZIP code.");
      setResult(null);
      return;
    }

    setErrorMsg("");

    if (ZONE_1_ZIPS.has(clean)) {
      setResult({ zone: SITE_CONFIG.deliveryZones[0], zip: clean });
    } else if (ZONE_2_ZIPS.has(clean)) {
      setResult({ zone: SITE_CONFIG.deliveryZones[1], zip: clean });
    } else if (ZONE_3_ZIPS.has(clean)) {
      setResult({ zone: SITE_CONFIG.deliveryZones[2], zip: clean });
    } else if (clean.startsWith("60")) {
      const num = parseInt(clean, 10);
      if (num >= 60000 && num <= 60699) {
        setResult({ zone: SITE_CONFIG.deliveryZones[1], zip: clean });
      } else {
        setResult({ zone: SITE_CONFIG.deliveryZones[2], zip: clean });
      }
    } else {
      setResult({
        zone: {
          zone: 3,
          name: "Extended Midwest Dispatch / Custom Pitmaster Route",
          minMiles: 35.1,
          maxMiles: 100,
          fee: 150.0,
          minOrder: 750.0,
          description: "Outside standard 35-mile radius. Requires custom smoker trailer deployment schedule.",
          coverageAreas: ["Greater Illinois", "Northwest Indiana", "Southern Wisconsin"],
        },
        zip: clean,
        isCustomQuote: true,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkZip(zipInput);
  };

  const handleQuickZip = (quickZip: string) => {
    setZipInput(quickZip);
    checkZip(quickZip);
  };

  return (
    <section
      id="delivery"
      className="w-full bg-[#F5F0EB] py-20 px-4 sm:px-6 lg:px-8 border-y border-stone-300/70"
      aria-labelledby="delivery-heading"
    >
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B45309] block mb-2 text-center">
            ★ CHICAGOLAND DELIVERY RADIUS ★
          </span>
          <h2
            id="delivery-heading"
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1917] text-center mb-3"
          >
            Delivery Radius Calculator
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto text-center mb-8">
            All orders dispatch hot directly from our commercial kitchen hub on{" "}
            <strong className="text-stone-900 font-semibold">Chicago’s Northwest Side (Dunning / 60634)</strong>.
            Enter your event ZIP code below to see instant delivery fees and minimum food requirements.
          </p>
        </div>

        {/* Calculator Card: Cast-Iron Charcoal Card on Butcher Paper */}
        <div className="bg-[#141210] rounded-2xl sm:rounded-3xl shadow-2xl shadow-stone-900/40 border border-stone-800/80 p-6 sm:p-8 max-w-3xl mx-auto space-y-8 relative overflow-hidden">
          {/* Subtle Ambient Amber Glow inside the dark card */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-500/10 blur-[60px]" />

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <label
              htmlFor="zip-input"
              className="block text-xs font-bold text-stone-300 uppercase tracking-wider"
            >
              Enter Event or Venue ZIP Code:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="zip-input"
                type="text"
                pattern="[0-9]{5}"
                maxLength={5}
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                placeholder="e.g. 60634, 60607, 60540"
                className="w-full h-12 px-4 rounded-xl bg-[#FAF8F5] border border-stone-300 text-stone-900 placeholder:text-stone-400 font-mono text-base font-semibold focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all"
                aria-describedby="zip-error"
                required
              />
              <button
                type="submit"
                className="h-12 px-6 rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] text-white font-display font-bold text-base tracking-wider uppercase transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shrink-0 cursor-pointer [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)]"
              >
                CHECK DELIVERY ZONE
              </button>
            </div>
            {errorMsg && (
              <p id="zip-error" className="text-xs text-red-400 font-semibold" role="alert">
                {errorMsg}
              </p>
            )}

            {/* Quick Test Chips */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-stone-400">
              <span className="font-semibold text-stone-300">Quick Test:</span>
              <button
                type="button"
                onClick={() => handleQuickZip("60634")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1C1814] text-stone-200 border border-[#C8A97E]/30 hover:border-[#FF7A00] hover:bg-gradient-to-r hover:from-[#EA580C]/20 hover:to-[#C84A0A]/20 hover:text-white hover:scale-105 hover:shadow-[0_0_12px_rgba(234,88,12,0.35)] transition-all duration-200 active:scale-95"
              >
                60634 (Hub)
              </button>
              <button
                type="button"
                onClick={() => handleQuickZip("60607")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1C1814] text-stone-200 border border-[#C8A97E]/30 hover:border-[#FF7A00] hover:bg-gradient-to-r hover:from-[#EA580C]/20 hover:to-[#C84A0A]/20 hover:text-white hover:scale-105 hover:shadow-[0_0_12px_rgba(234,88,12,0.35)] transition-all duration-200 active:scale-95"
              >
                60607 (West Loop)
              </button>
              <button
                type="button"
                onClick={() => handleQuickZip("60201")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1C1814] text-stone-200 border border-[#C8A97E]/30 hover:border-[#FF7A00] hover:bg-gradient-to-r hover:from-[#EA580C]/20 hover:to-[#C84A0A]/20 hover:text-white hover:scale-105 hover:shadow-[0_0_12px_rgba(234,88,12,0.35)] transition-all duration-200 active:scale-95"
              >
                60201 (Evanston)
              </button>
              <button
                type="button"
                onClick={() => handleQuickZip("60540")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1C1814] text-stone-200 border border-[#C8A97E]/30 hover:border-[#FF7A00] hover:bg-gradient-to-r hover:from-[#EA580C]/20 hover:to-[#C84A0A]/20 hover:text-white hover:scale-105 hover:shadow-[0_0_12px_rgba(234,88,12,0.35)] transition-all duration-200 active:scale-95"
              >
                60540 (Naperville)
              </button>
            </div>
          </form>

          {/* Dynamic Result Panel */}
          <div aria-live="polite" className="relative z-10">
            {result && (
              <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-amber-500/40 space-y-6 shadow-inner animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-stone-400 block uppercase">
                      Calculated Result for ZIP: <strong className="text-white">{result.zip}</strong>
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                      {result.zone.name}
                    </h3>
                  </div>
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    Zone {result.zone.zone} Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#181512] p-4 rounded-xl border border-stone-800 space-y-1">
                    <span className="text-xs text-stone-400 block font-semibold uppercase">
                      Estimated Transit Fee:
                    </span>
                    <span className="text-3xl font-black text-[#C8A97E]">
                      ${result.zone.fee.toFixed(2)}
                    </span>
                    <p className="text-[11px] text-stone-400">
                      Cambro insulated heated carrier dispatch
                    </p>
                  </div>

                  <div className="bg-[#181512] p-4 rounded-xl border border-stone-800 space-y-1">
                    <span className="text-xs text-stone-400 block font-semibold uppercase">
                      Minimum Food Order:
                    </span>
                    <span className="text-3xl font-black text-white">
                      ${result.zone.minOrder.toFixed(2)}
                    </span>
                    <p className="text-[11px] text-stone-400">
                      Food package &amp; pan subtotal threshold
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-stone-300 pt-1">
                  <span className="font-bold text-stone-200 block uppercase">
                    Delivery Corridor Coverage:
                  </span>
                  <p className="leading-relaxed text-stone-400">
                    {result.zone.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-stone-400 flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 17a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM3 9h12a2 2 0 012 2v6H3V9zm14 3h3.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V17h-7v-5zM6 9V5a1 1 0 011-1h6a1 1 0 011 1v4" />
                    </svg>
                    Dispatched from Chicago’s Northwest Side (Dunning / 60634)
                  </span>
                  <a
                    href={`#quote?zip=${result.zip}&zone=${result.zone.zone}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(
                          new CustomEvent("open-quote-modal", { detail: { packageId: "pitmaster-feast" } })
                        );
                      }
                    }}
                    className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] text-white font-display font-bold text-base tracking-wider uppercase transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center text-center cursor-pointer [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)]"
                  >
                    Lock In Delivery for {result.zip}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Static Zone Overview Matrix */}
          <div className="pt-6 border-t border-stone-800/80 space-y-3 relative z-10">
            <span className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
              Official Chicagoland Zone Matrix:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="group rounded-xl border border-[#C8A97E]/30 bg-[#0D0B0A] hover:bg-[#161311] p-4 text-center transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#EA580C]/90 hover:shadow-[0_8px_25px_rgba(234,88,12,0.3)] space-y-1 cursor-default">
                <span className="text-stone-200 font-bold text-sm block group-hover:text-[#F4EFEA] transition-colors">Zone 1 (0–10 mi)</span>
                <span className="text-[#C8A97E] font-black text-xl block group-hover:text-[#FF8C38] group-hover:scale-105 transition-all">$35 Fee</span>
                <span className="text-stone-300 text-xs block font-medium">$150 Min Order</span>
                <span className="text-stone-400 text-xs block group-hover:text-stone-300 transition-colors">NW Side, O’Hare, Portage Park</span>
              </div>

              <div className="group rounded-xl border border-[#C8A97E]/30 bg-[#0D0B0A] hover:bg-[#161311] p-4 text-center transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#EA580C]/90 hover:shadow-[0_8px_25px_rgba(234,88,12,0.3)] space-y-1 cursor-default">
                <span className="text-stone-200 font-bold text-sm block group-hover:text-[#F4EFEA] transition-colors">Zone 2 (10–20 mi)</span>
                <span className="text-[#C8A97E] font-black text-xl block group-hover:text-[#FF8C38] group-hover:scale-105 transition-all">$65 Fee</span>
                <span className="text-stone-300 text-xs block font-medium">$300 Min Order</span>
                <span className="text-stone-400 text-xs block group-hover:text-stone-300 transition-colors">The Loop, West Loop, Evanston</span>
              </div>

              <div className="group rounded-xl border border-[#C8A97E]/30 bg-[#0D0B0A] hover:bg-[#161311] p-4 text-center transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#EA580C]/90 hover:shadow-[0_8px_25px_rgba(234,88,12,0.3)] space-y-1 cursor-default">
                <span className="text-stone-200 font-bold text-sm block group-hover:text-[#F4EFEA] transition-colors">Zone 3 (20–35 mi)</span>
                <span className="text-[#C8A97E] font-black text-xl block group-hover:text-[#FF8C38] group-hover:scale-105 transition-all">$95 Fee</span>
                <span className="text-stone-300 text-xs block font-medium">$500 Min Order</span>
                <span className="text-stone-400 text-xs block group-hover:text-stone-300 transition-colors">Naperville, Aurora, South Side</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

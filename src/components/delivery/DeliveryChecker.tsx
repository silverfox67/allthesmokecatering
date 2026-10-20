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
      className="py-20 sm:py-28 px-4 sm:px-8 bg-[#0A0A0A] border-b border-zinc-800/80 relative overflow-hidden"
      aria-labelledby="delivery-heading"
    >
      {/* Ambient Radial Ember Glow behind Calculator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[750px] rounded-full bg-amber-600/5 blur-[150px]"
      />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-amber-400 text-xs uppercase font-bold tracking-widest bg-zinc-900 px-3.5 py-1.5 rounded-full border border-amber-500/30 inline-flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Chicagoland Delivery Radius</span>
          </span>
          <h2
            id="delivery-heading"
            className="font-display text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-none"
          >
            Delivery Radius Calculator
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            All orders dispatch hot directly from our commercial kitchen hub at{" "}
            <strong className="text-white">3401 N Orange Ave, Chicago, IL 60634</strong>.
            Enter your event ZIP code below to see instant delivery fees and minimum food requirements.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="max-w-3xl mx-auto bg-[#141417] border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/80 space-y-8 relative overflow-hidden">
          {/* Subtle Corner Glow */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-500/10 blur-[60px]" />

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <label
              htmlFor="zip-input"
              className="block text-xs font-bold text-zinc-300 uppercase tracking-wider"
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
                className="flex-1 bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-5 py-3.5 text-white placeholder-zinc-500 font-mono text-base outline-none transition-all"
                aria-describedby="zip-error"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold px-8 py-3.5 rounded-xl text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-lg min-h-[48px] flex items-center justify-center shrink-0"
              >
                CHECK DELIVERY ZONE
              </button>
            </div>
            {errorMsg && (
              <p id="zip-error" className="text-xs text-red-500 font-semibold" role="alert">
                {errorMsg}
              </p>
            )}

            {/* Quick Test Chips */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span>Quick Test:</span>
              <button
                type="button"
                onClick={() => handleQuickZip("60634")}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
              >
                60634 (Hub)
              </button>
              <button
                type="button"
                onClick={() => handleQuickZip("60607")}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
              >
                60607 (West Loop)
              </button>
              <button
                type="button"
                onClick={() => handleQuickZip("60201")}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
              >
                60201 (Evanston)
              </button>
              <button
                type="button"
                onClick={() => handleQuickZip("60540")}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
              >
                60540 (Naperville)
              </button>
            </div>
          </form>

          {/* Dynamic Result Panel */}
          <div aria-live="polite" className="relative z-10">
            {result && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-amber-500/40 space-y-6 shadow-inner animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-zinc-400 block uppercase">
                      Calculated Result for ZIP: <strong className="text-white">{result.zip}</strong>
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl text-white">
                      {result.zone.name}
                    </h3>
                  </div>
                  <span className="bg-amber-500 text-black text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    Zone {result.zone.zone} Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-1">
                    <span className="text-xs text-zinc-400 block font-semibold uppercase">
                      Estimated Transit Fee:
                    </span>
                    <span className="text-3xl font-black text-amber-400">
                      ${result.zone.fee.toFixed(2)}
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      Cambro insulated heated carrier dispatch
                    </p>
                  </div>

                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-1">
                    <span className="text-xs text-zinc-400 block font-semibold uppercase">
                      Minimum Food Order:
                    </span>
                    <span className="text-3xl font-black text-white">
                      ${result.zone.minOrder.toFixed(2)}
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      Food package &amp; pan subtotal threshold
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-zinc-300 pt-1">
                  <span className="font-bold text-zinc-200 block uppercase">
                    Delivery Corridor Coverage:
                  </span>
                  <p className="leading-relaxed text-zinc-400">
                    {result.zone.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 17a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM3 9h12a2 2 0 012 2v6H3V9zm14 3h3.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V17h-7v-5zM6 9V5a1 1 0 011-1h6a1 1 0 011 1v4" />
                    </svg>
                    Dispatched from 3401 N Orange Ave, Chicago 60634
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
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-6 py-3 rounded-xl text-center text-sm uppercase tracking-wider transition-all min-h-[48px] flex items-center justify-center shadow-lg"
                  >
                    Lock In Delivery for {result.zip}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Static Zone Overview Matrix */}
          <div className="pt-6 border-t border-zinc-800 space-y-3 relative z-10">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Official Chicagoland Zone Matrix:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-amber-400 font-bold block">Zone 1 (0–10 mi)</span>
                <span className="text-white font-extrabold text-base">$35 Fee</span>
                <span className="text-zinc-400 block">$150 Min Order</span>
                <span className="text-[11px] text-zinc-500 block">NW Side, O’Hare, Portage Park</span>
              </div>

              <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-amber-400 font-bold block">Zone 2 (10–20 mi)</span>
                <span className="text-white font-extrabold text-base">$65 Fee</span>
                <span className="text-zinc-400 block">$300 Min Order</span>
                <span className="text-[11px] text-zinc-500 block">The Loop, West Loop, Evanston</span>
              </div>

              <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-amber-400 font-bold block">Zone 3 (20–35 mi)</span>
                <span className="text-white font-extrabold text-base">$95 Fee</span>
                <span className="text-zinc-400 block">$500 Min Order</span>
                <span className="text-[11px] text-zinc-500 block">Naperville, Aurora, South Side</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

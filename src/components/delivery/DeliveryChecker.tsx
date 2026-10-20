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
      // Heuristic fallback for outer Chicagoland
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
      className="py-20 sm:py-28 px-4 sm:px-8 bg-charcoal/40 border-b border-white/10"
      aria-labelledby="delivery-heading"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-ember text-xs uppercase font-bold tracking-widest bg-charcoal px-3 py-1 rounded-full border border-ember/30 inline-block">
            📍 Chicagoland Delivery Radius
          </span>
          <h2
            id="delivery-heading"
            className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase leading-none"
          >
            Delivery Radius Calculator
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            All orders dispatch hot directly from our commercial kitchen hub at{" "}
            <strong className="text-white">3401 N Orange Ave, Chicago, IL 60634</strong>.
            Enter your event ZIP code below to see instant delivery fees and minimum food requirements.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="max-w-3xl mx-auto bg-charcoal border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label
              htmlFor="zip-input"
              className="block text-xs font-bold text-neutral-300 uppercase tracking-wider"
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
                className="flex-1 bg-obsidian border border-white/20 focus:border-ember focus:ring-1 focus:ring-ember rounded-xl px-5 py-3.5 text-white placeholder-neutral-500 font-mono text-base outline-none transition-all"
                aria-describedby="zip-error"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-ember to-ember-dark text-obsidian font-extrabold px-8 py-3.5 rounded-xl text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-lg min-h-[48px] flex items-center justify-center flex-shrink-0"
              >
                CHECK DELIVERY ZONE
              </button>
            </div>
            {errorMsg && (
              <p id="zip-error" className="text-xs text-crimson font-semibold" role="alert">
                {errorMsg}
              </p>
            )}

            {/* Quick Test Chips */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
              <span>Quick Test:</span>
              <button
                type="button"
                onClick={() => handleQuickZip("60634")}
                className="bg-obsidian hover:bg-white/10 text-neutral-300 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
              >
                60634 (Hub)
              </button>
              <button
                type="button"
                onClick={() => handleQuickZip("60607")}
                className="bg-obsidian hover:bg-white/10 text-neutral-300 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
              >
                60607 (West Loop)
              </button>
              <button
                type="button"
                onClick={() => handleQuickZip("60201")}
                className="bg-obsidian hover:bg-white/10 text-neutral-300 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
              >
                60201 (Evanston)
              </button>
              <button
                type="button"
                onClick={() => handleQuickZip("60540")}
                className="bg-obsidian hover:bg-white/10 text-neutral-300 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
              >
                60540 (Naperville)
              </button>
            </div>
          </form>

          {/* Dynamic Result Panel */}
          <div aria-live="polite">
            {result && (
              <div className="p-6 rounded-2xl bg-obsidian border border-ember/40 space-y-6 shadow-inner animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-neutral-400 block uppercase">
                      Calculated Result for ZIP: <strong className="text-white">{result.zip}</strong>
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl text-white">
                      {result.zone.name}
                    </h3>
                  </div>
                  <span className="bg-ember text-obsidian text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    Zone {result.zone.zone} Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-charcoal p-4 rounded-xl border border-white/10 space-y-1">
                    <span className="text-xs text-neutral-400 block font-semibold uppercase">
                      Estimated Transit Fee:
                    </span>
                    <span className="text-3xl font-extrabold text-ember">
                      ${result.zone.fee.toFixed(2)}
                    </span>
                    <p className="text-[11px] text-neutral-400">
                      Cambro insulated heated carrier dispatch
                    </p>
                  </div>

                  <div className="bg-charcoal p-4 rounded-xl border border-white/10 space-y-1">
                    <span className="text-xs text-neutral-400 block font-semibold uppercase">
                      Minimum Food Order:
                    </span>
                    <span className="text-3xl font-extrabold text-white">
                      ${result.zone.minOrder.toFixed(2)}
                    </span>
                    <p className="text-[11px] text-neutral-400">
                      Food package &amp; pan subtotal threshold
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-neutral-300 pt-1">
                  <span className="font-bold text-neutral-200 block uppercase">
                    Delivery Corridor Coverage:
                  </span>
                  <p className="leading-relaxed text-neutral-400">
                    {result.zone.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-neutral-400">
                    🚚 Dispatched from 3401 N Orange Ave, Chicago 60634
                  </span>
                  <a
                    href={`#quote?zip=${result.zip}&zone=${result.zone.zone}`}
                    className="w-full sm:w-auto bg-ember hover:bg-ember-dark text-obsidian font-extrabold px-6 py-3 rounded-xl text-center text-sm uppercase tracking-wider transition-all min-h-[48px] flex items-center justify-center shadow-lg"
                  >
                    Lock In Delivery for {result.zip}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Static Zone Overview Matrix */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Official Chicagoland Zone Matrix:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-obsidian/70 p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-ember font-bold block">Zone 1 (0–10 mi)</span>
                <span className="text-white font-extrabold text-base">$35 Fee</span>
                <span className="text-neutral-400 block">$150 Min Order</span>
                <span className="text-[11px] text-neutral-500 block">NW Side, O’Hare, Portage Park</span>
              </div>

              <div className="bg-obsidian/70 p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-ember font-bold block">Zone 2 (10–20 mi)</span>
                <span className="text-white font-extrabold text-base">$65 Fee</span>
                <span className="text-neutral-400 block">$300 Min Order</span>
                <span className="text-[11px] text-neutral-500 block">The Loop, West Loop, Evanston</span>
              </div>

              <div className="bg-obsidian/70 p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-ember font-bold block">Zone 3 (20–35 mi)</span>
                <span className="text-white font-extrabold text-base">$95 Fee</span>
                <span className="text-neutral-400 block">$500 Min Order</span>
                <span className="text-[11px] text-neutral-500 block">Naperville, Aurora, South Side</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { AdminTheme } from "./AdminPortal";
import { PER_PERSON_PACKAGES, PerPersonPackage } from "@/data/catering-packages";
import { PITMASTER_MENU_ITEMS, MenuItem } from "@/data/pitmaster-menu";
import { SITE_CONFIG } from "@/config/site-config";

export interface MeatAvailabilityItem {
  id: string;
  name: string;
  category: "meats" | "slabs" | "wings" | "specialties";
  basePrice: string;
  status: "in-stock" | "smoking-now" | "sold-out";
  batchNote: string;
  isSpecialty?: boolean;
}

export interface PartyPanPricingItem {
  id: string;
  name: string;
  category: "sides" | "meats";
  halfPanPrice: number;
  fullPanPrice: number;
  servesHalf: string;
  servesFull: string;
}

export interface SmokerConfigState {
  deliveryMinimum: number;
  standardLeadTimeHours: number;
  trailerRigDepositPercent: number;
  packages: {
    id: string;
    name: string;
    pricePerPerson: number;
    minimumGuests: number;
    tagline: string;
  }[];
  meatItems: MeatAvailabilityItem[];
  partyPans: PartyPanPricingItem[];
  lastSaved: string;
}

const DEFAULT_MEAT_ITEMS: MeatAvailabilityItem[] = [
  {
    id: "meat-brisket",
    name: "14-Hour Prime Texas Brisket",
    category: "meats",
    basePrice: "$34 / lb",
    status: "in-stock",
    batchNote: "Prime Black Angus briskets rubbed in coarse black pepper & kosher salt.",
  },
  {
    id: "meat-st-louis-ribs",
    name: "St. Louis Cut Spare Rib Slabs",
    category: "slabs",
    basePrice: "$32 / slab",
    status: "smoking-now",
    batchNote: "Slow-rendered with cherry and hickory wood. Deep mahogany bark.",
  },
  {
    id: "meat-turkey-chops",
    name: "Pit-Smoked Turkey Chops",
    category: "meats",
    basePrice: "$28 / lb",
    status: "in-stock",
    batchNote: "Brined 24 hours, seasoned with poultry dry rub, juicy and tender.",
  },
  {
    id: "meat-hot-links",
    name: "Chicago Beef Hot Links",
    category: "meats",
    basePrice: "$22 / lb",
    status: "in-stock",
    batchNote: "Course ground all-beef hot links with red pepper flakes and smoke snap.",
  },
  {
    id: "meat-pit-wings",
    name: "Crispy Whole Smoked Pit Wings",
    category: "wings",
    basePrice: "$24 / dozen",
    status: "in-stock",
    batchNote: "Oak-smoked then charred over pit coals. Tossed in Honey Garlic or Mild.",
  },
  {
    id: "meat-salmon",
    name: "Cedar-Plank Wild Salmon Fillet",
    category: "specialties",
    basePrice: "$28 / portion",
    status: "smoking-now",
    batchNote: "Charred cedar planks with brown sugar mustard glaze and fresh dill.",
  },
  {
    id: "meat-burnt-ends",
    name: "Double-Smoked Brisket Burnt Ends",
    category: "specialties",
    basePrice: "$32 / lb",
    status: "sold-out",
    batchNote: "Cubed prime brisket point candied in dark molasses pit glaze.",
    isSpecialty: true,
  },
  {
    id: "meat-oxtails",
    name: "Slow-Simmered Smoked Oxtails",
    category: "specialties",
    basePrice: "$38 / lb",
    status: "sold-out",
    batchNote: "Chef reserve item. Requires 72-hour advance booking.",
    isSpecialty: true,
  },
];

const DEFAULT_PARTY_PANS: PartyPanPricingItem[] = [
  {
    id: "pan-mac-cheese",
    name: "4-Cheese Pitmaster Mac & Cheese",
    category: "sides",
    halfPanPrice: 50,
    fullPanPrice: 90,
    servesHalf: "12–15 guests",
    servesFull: "25–30 guests",
  },
  {
    id: "pan-baked-beans",
    name: "Smokehouse Baked Beans (w/ Turkey)",
    category: "sides",
    halfPanPrice: 45,
    fullPanPrice: 80,
    servesHalf: "12–15 guests",
    servesFull: "25–30 guests",
  },
  {
    id: "pan-potato-salad",
    name: "Southern Mustard Potato Salad",
    category: "sides",
    halfPanPrice: 40,
    fullPanPrice: 75,
    servesHalf: "12–15 guests",
    servesFull: "25–30 guests",
  },
  {
    id: "pan-coleslaw",
    name: "Creamy Sweet Pepper Coleslaw",
    category: "sides",
    halfPanPrice: 35,
    fullPanPrice: 65,
    servesHalf: "12–15 guests",
    servesFull: "25–30 guests",
  },
  {
    id: "pan-cornbread",
    name: "Honey Butter Skillet Cornbread",
    category: "sides",
    halfPanPrice: 35,
    fullPanPrice: 65,
    servesHalf: "15 squares",
    servesFull: "30 squares",
  },
  {
    id: "pan-spaghetti",
    name: "Pit-Style Smokehouse Spaghetti",
    category: "sides",
    halfPanPrice: 50,
    fullPanPrice: 95,
    servesHalf: "12–15 guests",
    servesFull: "25–30 guests",
  },
  {
    id: "pan-pulled-pork",
    name: "Slow-Smoked Pulled Pork Pan",
    category: "meats",
    halfPanPrice: 85,
    fullPanPrice: 160,
    servesHalf: "12–15 guests",
    servesFull: "25–30 guests",
  },
  {
    id: "pan-brisket-slices",
    name: "Sliced Texas Prime Brisket Pan",
    category: "meats",
    halfPanPrice: 130,
    fullPanPrice: 245,
    servesHalf: "12–15 guests",
    servesFull: "25–30 guests",
  },
];

interface AdminPriceConfiguratorProps {
  theme: AdminTheme;
}

export function AdminPriceConfigurator({ theme }: AdminPriceConfiguratorProps) {
  const isDay = theme === "day";
  const [activeSection, setActiveSection] = useState<"packages" | "meats" | "pans" | "delivery">("packages");
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Initial State from Catering Packages Data
  const [config, setConfig] = useState<SmokerConfigState>(() => ({
    deliveryMinimum: 150,
    standardLeadTimeHours: 48,
    trailerRigDepositPercent: 25,
    packages: PER_PERSON_PACKAGES.map((p) => ({
      id: p.id,
      name: p.name,
      pricePerPerson: p.pricePerPerson,
      minimumGuests: p.minimumGuests,
      tagline: p.tagline,
    })),
    meatItems: DEFAULT_MEAT_ITEMS,
    partyPans: DEFAULT_PARTY_PANS,
    lastSaved: "Default System Settings",
  }));

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ats_smoker_price_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setConfig(parsed);
        } catch (e) {
          console.warn("Could not parse saved smoker config:", e);
        }
      }
    }
  }, []);

  const saveConfig = () => {
    const updated = {
      ...config,
      lastSaved: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" }),
    };
    setConfig(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ats_smoker_price_config", JSON.stringify(updated));
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const resetDefaults = () => {
    if (confirm("Reset all menu pricing, availability, and delivery parameters to master defaults?")) {
      const defState: SmokerConfigState = {
        deliveryMinimum: 150,
        standardLeadTimeHours: 48,
        trailerRigDepositPercent: 25,
        packages: PER_PERSON_PACKAGES.map((p) => ({
          id: p.id,
          name: p.name,
          pricePerPerson: p.pricePerPerson,
          minimumGuests: p.minimumGuests,
          tagline: p.tagline,
        })),
        meatItems: DEFAULT_MEAT_ITEMS,
        partyPans: DEFAULT_PARTY_PANS,
        lastSaved: "Reset to System Defaults",
      };
      setConfig(defState);
      if (typeof window !== "undefined") {
        localStorage.removeItem("ats_smoker_price_config");
      }
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  // Updaters
  const updatePackage = (id: string, field: "pricePerPerson" | "minimumGuests", value: number) => {
    setConfig((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg) =>
        pkg.id === id ? { ...pkg, [field]: value } : pkg
      ),
    }));
  };

  const updateMeatStatus = (id: string, status: MeatAvailabilityItem["status"]) => {
    setConfig((prev) => ({
      ...prev,
      meatItems: prev.meatItems.map((m) =>
        m.id === id ? { ...m, status } : m
      ),
    }));
  };

  const updateMeatPrice = (id: string, basePrice: string) => {
    setConfig((prev) => ({
      ...prev,
      meatItems: prev.meatItems.map((m) =>
        m.id === id ? { ...m, basePrice } : m
      ),
    }));
  };

  const updatePartyPan = (id: string, field: "halfPanPrice" | "fullPanPrice", value: number) => {
    setConfig((prev) => ({
      ...prev,
      partyPans: prev.partyPans.map((pan) =>
        pan.id === id ? { ...pan, [field]: value } : pan
      ),
    }));
  };

  const copyPriceSheetToClipboard = () => {
    const text = `🔥 ALL THE SMOKE CATERING — CURRENT PRICE SHEET 🔥
Pitmaster Marion Bolden | (773) 707-9988 | allthesmokecatering.com
Chicago's Northwest Side (60634) • $150 Heated Delivery Minimum

--- PER-PERSON CATERING PACKAGES ---
${config.packages.map((p) => `• ${p.name}: $${p.pricePerPerson.toFixed(2)}/guest (Min ${p.minimumGuests} guests)\n  ${p.tagline}`).join("\n")}

--- SMOKEHOUSE PARTY PANS (HALF / FULL) ---
${config.partyPans.map((pan) => `• ${pan.name}: Half Pan $${pan.halfPanPrice} (${pan.servesHalf}) | Full Pan $${pan.fullPanPrice} (${pan.servesFull})`).join("\n")}

--- LIVE SMOKER MEAT STATUS ---
${config.meatItems.map((m) => `• ${m.name}: ${m.basePrice} [${m.status === "in-stock" ? "IN STOCK" : m.status === "smoking-now" ? "SMOKING LIVE" : "SOLD OUT"}]`).join("\n")}

*Prices include heat delivery kit and pit sauces. 25% deposit locks event date.`;

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2
              className={`font-display text-xl sm:text-2xl font-bold tracking-tight ${
                isDay ? "text-stone-900" : "text-white"
              }`}
            >
              Smoker Menu &amp; Price Configurator
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              Live Control
            </span>
          </div>
          <p
            className={`text-xs mt-1 ${
              isDay ? "text-stone-600" : "text-zinc-400"
            }`}
          >
            Manage per-person package pricing, live meat smoking availability, party pans, and delivery minimums.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copyPriceSheetToClipboard}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              copySuccess
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                : isDay
                ? "bg-white border-stone-300 text-stone-800 hover:border-[#EA580C]"
                : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:border-amber-500/50"
            }`}
            title="Copy formatted text price sheet to clipboard for SMS or email quotes"
          >
            <span>{copySuccess ? "✓ Copied to Clipboard!" : "📋 Copy Client Price Sheet"}</span>
          </button>

          <button
            type="button"
            onClick={resetDefaults}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isDay
                ? "border-stone-300 text-stone-600 hover:text-stone-900"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Reset
          </button>

          <button
            type="button"
            onClick={saveConfig}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>Save Menu Changes</span>
          </button>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>Menu &amp; price sheet updated! Changes saved locally for Marion&rsquo;s session.</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400/80">{config.lastSaved}</span>
        </div>
      )}

      {/* Navigation Pill Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveSection("packages")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSection === "packages"
              ? "bg-[#EA580C] text-white shadow-sm"
              : isDay
              ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          }`}
        >
          🥩 Per-Person Packages ({config.packages.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("meats")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSection === "meats"
              ? "bg-[#EA580C] text-white shadow-sm"
              : isDay
              ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          }`}
        >
          🔥 Smoker Meats &amp; Availability ({config.meatItems.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("pans")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSection === "pans"
              ? "bg-[#EA580C] text-white shadow-sm"
              : isDay
              ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          }`}
        >
          🥘 Party Pans &amp; Bulk Sides ({config.partyPans.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("delivery")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSection === "delivery"
              ? "bg-[#EA580C] text-white shadow-sm"
              : isDay
              ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          }`}
        >
          🚚 Delivery &amp; Booking Rules
        </button>
      </div>

      {/* SECTION 1: PER-PERSON PACKAGES */}
      {activeSection === "packages" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {config.packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                  isDay
                    ? "bg-white border-stone-300 shadow-sm"
                    : "bg-[#141210] border-amber-500/25 shadow-md"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-display text-base font-bold ${
                        isDay ? "text-stone-900" : "text-white"
                      }`}
                    >
                      {pkg.name}
                    </h3>
                    <span className="text-[10px] font-mono uppercase bg-amber-500/15 text-[#FF7A00] border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                      {pkg.id}
                    </span>
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isDay ? "text-stone-600" : "text-zinc-400"
                    }`}
                  >
                    {pkg.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/60 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                      Price / Guest ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.05"
                        min="1"
                        value={pkg.pricePerPerson}
                        onChange={(e) =>
                          updatePackage(pkg.id, "pricePerPerson", parseFloat(e.target.value) || 0)
                        }
                        className={`w-full pl-6 pr-2 py-1.5 rounded-xl text-xs font-bold border outline-none ${
                          isDay
                            ? "bg-stone-50 border-stone-300 text-stone-900 focus:border-[#EA580C]"
                            : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                      Min Guests
                    </label>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      value={pkg.minimumGuests}
                      onChange={(e) =>
                        updatePackage(pkg.id, "minimumGuests", parseInt(e.target.value, 10) || 10)
                      }
                      className={`w-full px-3 py-1.5 rounded-xl text-xs font-bold border outline-none ${
                        isDay
                          ? "bg-stone-50 border-stone-300 text-stone-900 focus:border-[#EA580C]"
                          : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                      }`}
                    />
                  </div>
                </div>

                <div
                  className={`p-2.5 rounded-xl text-[11px] flex items-center justify-between ${
                    isDay ? "bg-stone-100 text-stone-700" : "bg-zinc-950 text-zinc-400"
                  }`}
                >
                  <span>Min Package Total:</span>
                  <span className="font-bold text-[#FF7A00]">
                    ${(pkg.pricePerPerson * pkg.minimumGuests).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: SMOKER MEATS & LIVE AVAILABILITY */}
      {activeSection === "meats" && (
        <div className="space-y-4">
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              isDay
                ? "bg-amber-50 border-amber-200 text-amber-900"
                : "bg-amber-950/20 border-amber-500/30 text-amber-200"
            }`}
          >
            <span>
              💡 <strong>Pitmaster Tip:</strong> Switch a meat cut to <em>&quot;Smoking Live&quot;</em> to highlight current weekend pit cooks, or <em>&quot;Sold Out&quot;</em> when daily smoker capacity is booked.
            </span>
            <span className="text-[11px] font-semibold text-amber-400 shrink-0">
              Instant Status Toggles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {config.meatItems.map((meat) => {
              const statusColor =
                meat.status === "in-stock"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : meat.status === "smoking-now"
                  ? "bg-amber-500/20 text-[#FF7A00] border-amber-500/40 animate-pulse"
                  : "bg-red-500/20 text-red-400 border-red-500/40";

              const statusText =
                meat.status === "in-stock"
                  ? "In Stock / Smoking"
                  : meat.status === "smoking-now"
                  ? "Smoking Live Today"
                  : "Sold Out / Next Cook";

              return (
                <div
                  key={meat.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isDay
                      ? "bg-white border-stone-300 shadow-sm"
                      : "bg-[#141210] border-amber-500/25 shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-display text-sm font-bold ${
                            isDay ? "text-stone-900" : "text-white"
                          }`}
                        >
                          {meat.name}
                        </h4>
                        {meat.isSpecialty && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40">
                            Chef Reserve
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs mt-0.5 line-clamp-1 ${
                          isDay ? "text-stone-500" : "text-zinc-400"
                        }`}
                      >
                        {meat.batchNote}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border shrink-0 ${statusColor}`}
                    >
                      {statusText}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-2">
                    {/* Price Input */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-zinc-400">Price:</span>
                      <input
                        type="text"
                        value={meat.basePrice}
                        onChange={(e) => updateMeatPrice(meat.id, e.target.value)}
                        className={`w-28 px-2 py-1 rounded-lg text-xs font-bold border outline-none ${
                          isDay
                            ? "bg-stone-50 border-stone-300 text-stone-900"
                            : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                        }`}
                      />
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="inline-flex rounded-xl border border-zinc-800 p-0.5 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => updateMeatStatus(meat.id, "in-stock")}
                        className={`px-2 py-1 rounded-lg transition-all ${
                          meat.status === "in-stock"
                            ? "bg-emerald-500 text-white font-extrabold"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        In Stock
                      </button>
                      <button
                        type="button"
                        onClick={() => updateMeatStatus(meat.id, "smoking-now")}
                        className={`px-2 py-1 rounded-lg transition-all ${
                          meat.status === "smoking-now"
                            ? "bg-[#EA580C] text-white font-extrabold"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Live Smoke
                      </button>
                      <button
                        type="button"
                        onClick={() => updateMeatStatus(meat.id, "sold-out")}
                        className={`px-2 py-1 rounded-lg transition-all ${
                          meat.status === "sold-out"
                            ? "bg-red-600 text-white font-extrabold"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Sold Out
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: PARTY PANS & BULK SIDES */}
      {activeSection === "pans" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {config.partyPans.map((pan) => (
              <div
                key={pan.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isDay
                    ? "bg-white border-stone-300 shadow-sm"
                    : "bg-[#141210] border-amber-500/25 shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4
                    className={`font-display text-sm font-bold ${
                      isDay ? "text-stone-900" : "text-white"
                    }`}
                  >
                    {pan.name}
                  </h4>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      pan.category === "meats"
                        ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                        : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {pan.category === "meats" ? "Smoked Meat" : "Scratch Side"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/60">
                  {/* Half Pan */}
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isDay ? "bg-stone-50 border-stone-200" : "bg-zinc-950 border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">
                        Half Pan
                      </span>
                      <span className="text-[9px] text-zinc-500">{pan.servesHalf}</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="10"
                        step="5"
                        value={pan.halfPanPrice}
                        onChange={(e) =>
                          updatePartyPan(pan.id, "halfPanPrice", parseInt(e.target.value, 10) || 0)
                        }
                        className={`w-full pl-5 pr-2 py-1 rounded-lg text-xs font-bold border outline-none ${
                          isDay
                            ? "bg-white border-stone-300 text-stone-900"
                            : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Full Pan */}
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isDay ? "bg-stone-50 border-stone-200" : "bg-zinc-950 border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">
                        Full Pan
                      </span>
                      <span className="text-[9px] text-zinc-500">{pan.servesFull}</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="20"
                        step="5"
                        value={pan.fullPanPrice}
                        onChange={(e) =>
                          updatePartyPan(pan.id, "fullPanPrice", parseInt(e.target.value, 10) || 0)
                        }
                        className={`w-full pl-5 pr-2 py-1 rounded-lg text-xs font-bold border outline-none ${
                          isDay
                            ? "bg-white border-stone-300 text-stone-900"
                            : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: DELIVERY & BOOKING PARAMETERS */}
      {activeSection === "delivery" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Delivery Minimum */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isDay
                ? "bg-white border-stone-300 shadow-sm"
                : "bg-[#141210] border-amber-500/25 shadow-md"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-lg">
              🚚
            </div>
            <div>
              <h4
                className={`font-display text-sm font-bold ${
                  isDay ? "text-stone-900" : "text-white"
                }`}
              >
                Heated Delivery Minimum
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Minimum order amount required for hot insulated drop-off delivery across Cook County.
              </p>
            </div>
            <div className="relative pt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">
                $
              </span>
              <input
                type="number"
                step="10"
                min="50"
                value={config.deliveryMinimum}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    deliveryMinimum: parseInt(e.target.value, 10) || 150,
                  }))
                }
                className={`w-full pl-7 pr-3 py-2 rounded-xl text-sm font-bold border outline-none ${
                  isDay
                    ? "bg-stone-50 border-stone-300 text-stone-900"
                    : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                }`}
              />
            </div>
          </div>

          {/* Lead Time */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isDay
                ? "bg-white border-stone-300 shadow-sm"
                : "bg-[#141210] border-amber-500/25 shadow-md"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-lg">
              ⏱️
            </div>
            <div>
              <h4
                className={`font-display text-sm font-bold ${
                  isDay ? "text-stone-900" : "text-white"
                }`}
              >
                Minimum Smoker Lead Time
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Advance notice required for curing and low-and-slow hardwood pit cooks.
              </p>
            </div>
            <div className="relative pt-1">
              <input
                type="number"
                step="6"
                min="12"
                value={config.standardLeadTimeHours}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    standardLeadTimeHours: parseInt(e.target.value, 10) || 48,
                  }))
                }
                className={`w-full px-3 py-2 rounded-xl text-sm font-bold border outline-none ${
                  isDay
                    ? "bg-stone-50 border-stone-300 text-stone-900"
                    : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">
                Hours
              </span>
            </div>
          </div>

          {/* Deposit Percent */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isDay
                ? "bg-white border-stone-300 shadow-sm"
                : "bg-[#141210] border-amber-500/25 shadow-md"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-lg">
              🔒
            </div>
            <div>
              <h4
                className={`font-display text-sm font-bold ${
                  isDay ? "text-stone-900" : "text-white"
                }`}
              >
                Event Date Lock Deposit
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Standard percentage required to lock Marion&rsquo;s mobile smoker rig on the calendar.
              </p>
            </div>
            <div className="relative pt-1">
              <input
                type="number"
                step="5"
                min="10"
                max="50"
                value={config.trailerRigDepositPercent}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    trailerRigDepositPercent: parseInt(e.target.value, 10) || 25,
                  }))
                }
                className={`w-full px-3 py-2 rounded-xl text-sm font-bold border outline-none ${
                  isDay
                    ? "bg-stone-50 border-stone-300 text-stone-900"
                    : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">
                % Deposit
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

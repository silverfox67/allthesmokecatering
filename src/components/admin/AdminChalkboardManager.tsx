"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  WeeklyChalkboard,
  WeeklyChalkboardItem,
  WEEKLY_CHALKBOARD,
} from "@/data/pitmaster-menu";
import {
  useWeeklyChalkboard,
  saveStoredWeeklyChalkboard,
  resetStoredWeeklyChalkboard,
} from "@/utils/chalkboard-specials";

export interface AdminChalkboardManagerProps {
  theme?: "day" | "night" | "dark" | "butcher-paper";
}

// Pre-configured Signature Smoker Cuts for Marion's 1-Click Vault Swaps
export const SIGNATURE_PRESET_SPECIALS = [
  {
    name: "Double-Smoked Brisket Burnt Ends",
    price: "$32 / lb • Half Pan $110",
    parsedPrice: 32,
    tagline: "Cubed prime point candied in dark molasses glaze with crunchy mahogany bark",
    badge: "Crown Jewel",
    categoryTab: "specialties" as const,
    menuTargetId: "burnt-ends-specialty",
  },
  {
    name: "Cedar-Plank Smoked Salmon Fillet",
    price: "$28 / portion • Half $140",
    parsedPrice: 28,
    tagline: "Wild Pacific fillet on charred cedar with brown sugar mustard glaze & fresh dill",
    badge: "Chicago Favorite",
    categoryTab: "specialties" as const,
    menuTargetId: "cedar-plank-salmon",
  },
  {
    name: "Slow-Simmered Brisket Burnt-End Chili",
    price: "Half Pan $65 • Full Pan $120",
    parsedPrice: 65,
    tagline: "14-hour smoked brisket burnt ends, dark stout, roasted chiles & kidney beans",
    badge: "Game Day Hit",
    categoryTab: "specialties" as const,
    menuTargetId: "smoked-brisket-chili",
  },
  {
    name: "Habanero Cheddar Skillet Cornbread",
    price: "Half Pan $35 • Full Pan $65",
    parsedPrice: 35,
    tagline: "Fresh cast-iron cornbread with sharp Wisconsin cheddar & mild flame-roasted habanero",
    badge: "Scratch Baked",
    categoryTab: "specialties" as const,
    menuTargetId: "habanero-cornbread",
  },
  {
    name: "Whole Fruitwood Smoked Duck",
    price: "$95 Flat (Feeds 4–6)",
    parsedPrice: 95,
    tagline: "Crisp skin duck slow-rendered over cherry and apple wood with pomegranate glaze",
    badge: "Artisan Smoke",
    categoryTab: "specialties" as const,
    menuTargetId: "whole-smoked-duck",
  },
  {
    name: "Whole Hickory Smoked Pit Turkey",
    price: "$135 Flat (Feeds 12–15)",
    parsedPrice: 135,
    tagline: "48-hour brined whole 14-16 lb bird slow-smoked over hickory until mahogany and juicy",
    badge: "Holiday Feast",
    categoryTab: "specialties" as const,
    menuTargetId: "whole-smoked-turkey",
  },
  {
    name: "Smoked Turkey Legs & Whole Wings",
    price: "10 lbs Bulk Pan • $120",
    parsedPrice: 120,
    tagline: "10 lbs jumbo drums and wings seasoned with Marion's poultry rub and smoked tender",
    badge: "Crowd Pleaser",
    categoryTab: "smoked-meats" as const,
    menuTargetId: "turkey-legs-wings",
  },
  {
    name: "Southside Chicago Smoked Rib Tips",
    price: "Half Pan $75 • Full Pan $150",
    parsedPrice: 75,
    tagline: "Tender bite-sized pork rib tips slow-smoked, chopped to order, and drenched in sauce",
    badge: "Chicago Tradition",
    categoryTab: "bbq-slabs" as const,
    menuTargetId: "rib-tips",
  },
  {
    name: "Smoked Beef Oxtails",
    price: "$38 / portion (Feeds 2–3)",
    parsedPrice: 38,
    tagline: "Rich, gelatinous USDA choice oxtails smoked low and slow in a dark rich beef reduction",
    badge: "Pitmaster Reserve",
    categoryTab: "specialties" as const,
    menuTargetId: "smoked-oxtails",
  },
  {
    name: "Jumbo Smoked Turkey Chops",
    price: "$26 / portion (2 Chops)",
    parsedPrice: 26,
    tagline: "Thick-cut turkey chops marinated in savory spices and smoked to golden perfection",
    badge: "Pit Favorite",
    categoryTab: "smoked-meats" as const,
    menuTargetId: "turkey-chops",
  },
  {
    name: "Peach Habanero Pit Wings",
    price: "Half Pan $65 • Full Pan $125",
    parsedPrice: 65,
    tagline: "Jumbo whole wings tossed in house-made peach puree and slow-fire habanero glaze",
    badge: "Sweet & Heat",
    categoryTab: "wings" as const,
    menuTargetId: "wings-peach-habanero",
  },
  {
    name: "Southside All-Beef Hot Links",
    price: "Half Pan $60 • Full Pan $115",
    parsedPrice: 60,
    tagline: "Coarse-ground spicy beef sausage smoked in natural casing with Southside cayenne kick",
    badge: "Southside Classic",
    categoryTab: "smoked-meats" as const,
    menuTargetId: "smoked-beef-sausage",
  },
  {
    name: "4-Cheese Pitmaster Mac & Cheese",
    price: "Half Pan $75 • Full Pan $135",
    parsedPrice: 75,
    tagline: "Cavatappi baked in sharp Wisconsin cheddar, smoked gouda, Monterey jack & gruyère cream",
    badge: "Scratch Side",
    categoryTab: "sides" as const,
    menuTargetId: "pitmaster-mac",
  },
  {
    name: "Smokehouse Baked Beans (w/ Burnt Ends)",
    price: "Half Pan $55 • Full Pan $95",
    parsedPrice: 55,
    tagline: "Slow-simmered navy beans simmered with brisket burnt ends, brown sugar & dark molasses",
    badge: "Smokehouse Classic",
    categoryTab: "sides" as const,
    menuTargetId: "smokehouse-beans",
  },
];

export function AdminChalkboardManager({ theme = "night" }: AdminChalkboardManagerProps) {
  const isDay = theme === "day" || theme === "butcher-paper";
  const { chalkboard: liveChalkboard, saveChalkboard, resetChalkboard } = useWeeklyChalkboard();

  // Local draft state for editing before saving
  const [draft, setDraft] = useState<WeeklyChalkboard>(liveChalkboard);
  const [saveAlert, setSaveAlert] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Sync draft whenever liveChalkboard changes
  useEffect(() => {
    setDraft(liveChalkboard);
  }, [liveChalkboard]);

  const handleUpdateHeader = (field: keyof Omit<WeeklyChalkboard, "items">, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateItem = (
    index: number,
    field: keyof WeeklyChalkboardItem,
    value: any
  ) => {
    setDraft((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = { ...nextItems[index], [field]: value };
      return { ...prev, items: nextItems };
    });
  };

  const handleQuickSwapItem = (index: number, presetName: string) => {
    const preset = SIGNATURE_PRESET_SPECIALS.find((p) => p.name === presetName);
    if (!preset) return;

    setDraft((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = {
        ...nextItems[index],
        name: preset.name,
        price: preset.price,
        parsedPrice: preset.parsedPrice,
        tagline: preset.tagline,
        badge: preset.badge,
        categoryTab: preset.categoryTab,
        menuTargetId: preset.menuTargetId,
        soldOut: false,
        active: true,
      };
      return { ...prev, items: nextItems };
    });
  };

  const handleSaveAll = () => {
    saveChalkboard(draft);
    setSaveAlert("✓ Weekly Specials Chalkboard published live! Home page and /specials updated immediately.");
    setTimeout(() => setSaveAlert(null), 4000);
  };

  const handleResetToDefaults = () => {
    if (confirm("Reset the Weekly Specials chalkboard back to original smokehouse defaults?")) {
      resetChalkboard();
      setDraft(WEEKLY_CHALKBOARD);
      setSaveAlert("↺ Chalkboard reset to original smokehouse defaults!");
      setTimeout(() => setSaveAlert(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* TOP HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FF7A00] text-white">
              Weekly Specials
            </span>
            <span className={`text-xs font-bold ${isDay ? "text-stone-600" : "text-stone-400"}`}>
              {draft.items.filter((i) => i.active !== false).length} of {draft.items.length} Specials Active
            </span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black font-display tracking-tight mt-1 ${isDay ? "text-stone-900" : "text-white"}`}>
            Pitmaster Weekly Specials Chalkboard Manager
          </h2>
          <p className={`text-xs mt-0.5 ${isDay ? "text-stone-600" : "text-stone-400"}`}>
            Edit the 8 seasonal specials displayed on the handcrafted wooden chalkboard at{" "}
            <strong>allthesmokecatering.com</strong> and <strong>/specials</strong> without touching code.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              showLivePreview
                ? isDay
                  ? "bg-amber-100 border-amber-300 text-amber-900"
                  : "bg-amber-950/60 border-amber-600/50 text-amber-300"
                : isDay
                ? "bg-white border-stone-300 text-stone-700 hover:bg-stone-100"
                : "bg-zinc-800 border-zinc-700 text-stone-300 hover:bg-zinc-750"
            }`}
          >
            <span>{showLivePreview ? "👁️ Hide Slate Preview" : "👁️ Show Slate Preview"}</span>
          </button>

          <Link
            href="/specials"
            target="_blank"
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
              isDay
                ? "bg-white border-stone-300 text-black hover:bg-stone-100"
                : "bg-zinc-800 border-zinc-700 text-stone-200 hover:bg-zinc-700"
            }`}
          >
            <span>🌐 View Live Chalkboard Page</span>
            <span className="text-[10px]">↗</span>
          </Link>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C84A0A] hover:from-[#C84A0A] hover:to-[#9E3406] text-white text-xs font-black flex items-center gap-1.5 shadow-md hover:scale-103 active:scale-97 transition-all cursor-pointer"
          >
            <span>💾</span>
            <span>Save &amp; Publish Live</span>
          </button>
        </div>
      </div>

      {/* SUCCESS NOTIFICATION ALERT */}
      {saveAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-base">✓</span>
            <span className="font-semibold">{saveAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveAlert(null)}
            className="text-emerald-400 hover:text-white font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* LIVE SLATE PREVIEW (AUTHENTIC TIMBER FRAME CHALKBOARD) */}
      {showLivePreview && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black uppercase tracking-wider ${isDay ? "text-stone-700" : "text-stone-300"}`}>
              ★ Real-Time Chalkboard Slate Preview (How Customers See It)
            </span>
            <span className={`text-[11px] italic ${isDay ? "text-stone-600" : "text-stone-400"}`}>
              Font: Authentic Satisfy &amp; Dancing Script Chalk Typography
            </span>
          </div>

          <div className="mitered-wood-frame-container shadow-xl">
            <div className="frame-rail-top" aria-hidden="true" />
            <div className="frame-rail-bottom" aria-hidden="true" />
            <div className="frame-rail-left" aria-hidden="true" />
            <div className="frame-rail-right" aria-hidden="true" />
            <div className="frame-miter-corner-tl" aria-hidden="true" />
            <div className="frame-miter-corner-tr" aria-hidden="true" />
            <div className="frame-miter-corner-bl" aria-hidden="true" />
            <div className="frame-miter-corner-br" aria-hidden="true" />
            <div className="frame-inner-lip" aria-hidden="true" />

            <div className="chalkboard-slate rounded-xs p-4 sm:p-6 md:p-8 relative z-[1] overflow-hidden">
              <div className="border border-dashed border-white/20 rounded-xl p-3 sm:p-5 md:p-6">
                
                {/* Header */}
                <div className="text-center pb-4 border-b border-dashed border-white/20">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="font-chalk chalk-yellow text-xs sm:text-sm font-bold">
                      ★ {draft.badge} ★
                    </span>
                  </div>
                  <h3 className="font-chalk chalk-orange text-3xl sm:text-4xl md:text-5xl font-bold tracking-normal leading-tight">
                    {draft.headline}
                  </h3>
                  <p className="font-chalk chalk-white text-xs sm:text-sm opacity-90 mt-1">
                    {draft.season}
                  </p>
                </div>

                {/* Grid of 8 Specials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 mt-5">
                  {draft.items.map((special, idx) => {
                    const isHidden = special.active === false;
                    const isSoldOut = special.soldOut;

                    return (
                      <div
                        key={special.id || idx}
                        className={`border-b border-dashed border-white/15 py-2 flex flex-col gap-1 rounded px-2 transition-all ${
                          isHidden ? "opacity-35 bg-black/40" : ""
                        }`}
                      >
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-chalk chalk-yellow text-xs sm:text-sm font-bold shrink-0">
                            #{idx + 1}
                          </span>
                          <span
                            className={`font-chalk chalk-white text-base sm:text-lg font-bold leading-snug ${
                              isSoldOut ? "line-through opacity-60" : ""
                            }`}
                          >
                            {special.name}
                          </span>
                          {special.badge && (
                            <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase tracking-wider">
                              {special.badge}
                            </span>
                          )}
                          {isSoldOut && (
                            <span className="text-[10px] font-sans font-black bg-red-600 text-white px-1.5 py-0.2 rounded uppercase tracking-wider">
                              SOLD OUT
                            </span>
                          )}
                          {isHidden && (
                            <span className="text-[10px] font-sans font-bold text-stone-400 italic">
                              (Hidden from Board)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pl-5">
                          <span className="font-chalk chalk-yellow text-xs sm:text-sm font-bold">
                            {special.price}
                          </span>
                          <span className="text-[11px] font-sans text-neutral-400 italic line-clamp-1 max-w-[200px]">
                            {special.tagline}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHALKBOARD HEADER & ATMOSPHERE SETTINGS */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border shadow-sm space-y-4 ${
          isDay ? "bg-white border-stone-300" : "bg-[#141210] border-zinc-800"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-2 border-stone-200 dark:border-zinc-800">
          <h3 className={`text-sm font-black uppercase tracking-wider ${isDay ? "text-stone-900" : "text-white"}`}>
            1. Chalkboard Atmosphere &amp; Headings
          </h3>
          <span className={`text-[11px] font-bold ${isDay ? "text-stone-500" : "text-stone-400"}`}>
            Updates the title bar &amp; subtitles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={`text-[11px] font-black uppercase tracking-wider block mb-1 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
              Chalkboard Headline:
            </label>
            <input
              type="text"
              value={draft.headline}
              onChange={(e) => handleUpdateHeader("headline", e.target.value)}
              placeholder="Pitmaster Weekly Specials"
              className={`w-full text-xs h-9 px-3 rounded-xl border font-bold focus:outline-none transition-colors ${
                isDay
                  ? "bg-stone-50 border-stone-400 text-black focus:border-[#FF7A00]"
                  : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
              }`}
            />
          </div>

          <div>
            <label className={`text-[11px] font-black uppercase tracking-wider block mb-1 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
              Top Star Badge:
            </label>
            <input
              type="text"
              value={draft.badge}
              onChange={(e) => handleUpdateHeader("badge", e.target.value)}
              placeholder="Rolling Hardwood Smoke This Week"
              className={`w-full text-xs h-9 px-3 rounded-xl border font-bold focus:outline-none transition-colors ${
                isDay
                  ? "bg-stone-50 border-stone-400 text-black focus:border-[#FF7A00]"
                  : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
              }`}
            />
          </div>

          <div>
            <label className={`text-[11px] font-black uppercase tracking-wider block mb-1 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
              Season / Subtitle:
            </label>
            <input
              type="text"
              value={draft.season}
              onChange={(e) => handleUpdateHeader("season", e.target.value)}
              placeholder="Chicagoland Fall & Game-Day Smoker Specials"
              className={`w-full text-xs h-9 px-3 rounded-xl border font-bold focus:outline-none transition-colors ${
                isDay
                  ? "bg-stone-50 border-stone-400 text-black focus:border-[#FF7A00]"
                  : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`text-[11px] font-black uppercase tracking-wider block mb-1 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
            Commissary / Smoker Rig Footer Note:
          </label>
          <input
            type="text"
            value={draft.note}
            onChange={(e) => handleUpdateHeader("note", e.target.value)}
            placeholder="Small-batch specialty cuts smoked fresh on Marion's trailer rig..."
            className={`w-full text-xs h-9 px-3 rounded-xl border font-bold focus:outline-none transition-colors ${
              isDay
                ? "bg-stone-50 border-stone-400 text-black focus:border-[#FF7A00]"
                : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
            }`}
          />
        </div>
      </div>

      {/* THE 8 SPECIALS ROTATION SLOTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-black uppercase tracking-wider ${isDay ? "text-stone-900" : "text-white"}`}>
            2. The 8 Chalkboard Smoker Slots
          </h3>
          <span className={`text-xs ${isDay ? "text-stone-600" : "text-stone-400"}`}>
            Use the <strong>"⚡ Quick Swap"</strong> dropdown to pull proven meats from Marion's Smoker Vault.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {draft.items.map((item, idx) => {
            const isHidden = item.active === false;
            const isSoldOut = item.soldOut;

            return (
              <div
                key={item.id || idx}
                className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                  isHidden
                    ? isDay
                      ? "bg-stone-100 border-stone-300 opacity-60"
                      : "bg-zinc-950 border-zinc-800 opacity-60"
                    : isDay
                    ? "bg-white border-stone-300 shadow-sm"
                    : "bg-[#141210] border-zinc-800 shadow-sm"
                }`}
              >
                {/* Header Row: Slot Number + Quick Swap Dropdown + Status Badges */}
                <div className="flex items-center justify-between gap-2 border-b pb-2.5 border-stone-200 dark:border-zinc-800 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#FF7A00] text-white font-black text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className={`font-black text-xs ${isDay ? "text-stone-900" : "text-white"}`}>
                      Slot #{idx + 1}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* 1-Click Vault Quick Swap */}
                  <div className="flex items-center gap-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-wider ${isDay ? "text-stone-500" : "text-stone-400"}`}>
                      ⚡ Quick Swap:
                    </label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleQuickSwapItem(idx, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      defaultValue=""
                      className={`text-xs h-7 px-2 rounded-lg border font-bold cursor-pointer focus:outline-none ${
                        isDay
                          ? "bg-stone-100 border-stone-300 text-stone-900"
                          : "bg-zinc-800 border-zinc-700 text-stone-200"
                      }`}
                    >
                      <option value="" disabled>
                        Choose from Pitmaster Vault...
                      </option>
                      {SIGNATURE_PRESET_SPECIALS.map((preset) => (
                        <option key={preset.name} value={preset.name}>
                          {preset.name} ({preset.price.split("•")[0].trim()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dish Name & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-7">
                    <label className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
                      Dish Name (Shown on Chalkboard):
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(idx, "name", e.target.value)}
                      className={`w-full text-xs h-8 px-2.5 rounded-lg border font-bold focus:outline-none ${
                        isDay
                          ? "bg-stone-50 border-stone-400 text-black focus:border-[#FF7A00]"
                          : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
                      Chalk Price Display:
                    </label>
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) => handleUpdateItem(idx, "price", e.target.value)}
                      className={`w-full text-xs h-8 px-2.5 rounded-lg border font-bold focus:outline-none ${
                        isDay
                          ? "bg-stone-50 border-stone-400 text-black focus:border-[#FF7A00]"
                          : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                      }`}
                    />
                  </div>
                </div>

                {/* Tagline / Flavor Notes */}
                <div>
                  <label className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
                    Flavor Tagline (Shown in Details):
                  </label>
                  <input
                    type="text"
                    value={item.tagline}
                    onChange={(e) => handleUpdateItem(idx, "tagline", e.target.value)}
                    className={`w-full text-xs h-8 px-2.5 rounded-lg border font-medium focus:outline-none ${
                      isDay
                        ? "bg-stone-50 border-stone-400 text-black focus:border-[#FF7A00]"
                        : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                    }`}
                  />
                </div>

                {/* Badge Text & Base Unit Price for Ordering */}
                <div className="grid grid-cols-2 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-6">
                    <label className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
                      Specialty Badge:
                    </label>
                    <input
                      type="text"
                      value={item.badge || ""}
                      onChange={(e) => handleUpdateItem(idx, "badge", e.target.value)}
                      placeholder="e.g. Crown Jewel, Game Day Hit"
                      className={`w-full text-xs h-8 px-2.5 rounded-lg border font-bold focus:outline-none ${
                        isDay
                          ? "bg-stone-50 border-stone-400 text-black focus:border-[#FF7A00]"
                          : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
                      Base Price ($ for Tray):
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                        $
                      </span>
                      <input
                        type="number"
                        value={item.parsedPrice}
                        onChange={(e) =>
                          handleUpdateItem(idx, "parsedPrice", parseFloat(e.target.value) || 0)
                        }
                        className={`w-full text-xs h-8 pl-6 pr-2.5 rounded-lg border font-bold focus:outline-none ${
                          isDay
                            ? "bg-stone-50 border-stone-400 text-black focus:border-[#FF7A00]"
                            : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Toggles: Active / Sold Out */}
                <div className="pt-2 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Active Toggle */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold select-none">
                      <input
                        type="checkbox"
                        checked={item.active !== false}
                        onChange={(e) => handleUpdateItem(idx, "active", e.target.checked)}
                        className="accent-[#FF7A00] w-3.5 h-3.5 rounded"
                      />
                      <span className={item.active !== false ? "text-emerald-500 font-black" : "text-stone-400"}>
                        {item.active !== false ? "Active on Board" : "Hidden"}
                      </span>
                    </label>

                    {/* Sold Out Toggle */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold select-none">
                      <input
                        type="checkbox"
                        checked={!!item.soldOut}
                        onChange={(e) => handleUpdateItem(idx, "soldOut", e.target.checked)}
                        className="accent-red-600 w-3.5 h-3.5 rounded"
                      />
                      <span className={item.soldOut ? "text-red-500 font-black" : "text-stone-400"}>
                        {item.soldOut ? "Marked Sold Out" : "In Stock"}
                      </span>
                    </label>
                  </div>

                  <span className={`text-[10px] font-mono ${isDay ? "text-stone-500" : "text-stone-400"}`}>
                    Tab: {item.categoryTab}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div
        className={`sticky bottom-4 z-20 p-4 rounded-2xl border shadow-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
          isDay
            ? "bg-stone-100/95 border-stone-300 backdrop-blur-md"
            : "bg-[#1A1613]/95 border-zinc-700 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className={`text-xs font-bold ${isDay ? "text-stone-800" : "text-stone-200"}`}>
            Ready to publish changes to customer-facing wooden chalkboard.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isDay
                ? "bg-white border-stone-400 text-stone-700 hover:bg-stone-200"
                : "bg-zinc-800 border-zinc-700 text-stone-300 hover:bg-zinc-700"
            }`}
          >
            ↺ Reset to Defaults
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C84A0A] hover:from-[#C84A0A] hover:to-[#9E3406] text-white text-xs font-black flex items-center gap-2 shadow-lg hover:scale-103 active:scale-97 transition-all cursor-pointer"
          >
            <span>💾</span>
            <span>Publish Changes to Live Chalkboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}


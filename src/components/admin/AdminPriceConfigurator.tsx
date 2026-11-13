"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AdminTheme } from "./AdminPortal";
import { AdminGuide } from "./AdminGuide";
import { AdminChalkboardManager } from "./AdminChalkboardManager";
import { PER_PERSON_PACKAGES } from "@/data/catering-packages";
import { PITMASTER_MENU_ITEMS, MENU_CATEGORIES, MenuCategory } from "@/data/pitmaster-menu";
import {
  SmokerItemStatus,
  READY_TIME_PRESETS,
  STORAGE_KEY_LIVE_STATUS,
  STORAGE_KEY_PRICE_CONFIG,
  saveStoredLiveMenuOverrides,
  getStoredLiveMenuOverrides,
  syncLiveSmokeToCalendar,
} from "@/utils/smoker-live-status";

export interface SmokerConfigMenuItem {
  id: string;
  name: string;
  category: "smoked-meats" | "bbq-slabs" | "wings" | "specialties" | "sides";
  basePrice: string;
  status: SmokerItemStatus;
  readyTime?: string;
  syncCalendar?: boolean;
  batchNote: string;
  badge?: string;
  popular?: boolean;
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
  menuItems: SmokerConfigMenuItem[];
  partyPans: PartyPanPricingItem[];
  lastSaved: string;
}

const DEFAULT_MENU_ITEMS: SmokerConfigMenuItem[] = PITMASTER_MENU_ITEMS.map((item) => {
  const isDefaultSmoking = item.id === "st-louis-ribs" || item.id === "cedar-plank-salmon";
  const isDefaultSoldOut = item.id === "burnt-ends-specialty" || item.id === "smoked-oxtails";

  return {
    id: item.id,
    name: item.name,
    category: item.category,
    basePrice: item.price,
    status: isDefaultSmoking ? "smoking-now" : isDefaultSoldOut ? "sold-out" : "in-stock",
    readyTime: item.id === "st-louis-ribs" ? "~5:00 PM" : item.id === "cedar-plank-salmon" ? "~6:00 PM" : "~5:00 PM",
    syncCalendar: true,
    batchNote: item.portion ? `${item.portion}` : item.description,
    badge: item.badge,
    popular: item.popular,
  };
});

const DEFAULT_PARTY_PANS: PartyPanPricingItem[] = [
  {
    id: "pan-mac-cheese",
    name: "4-Cheese Pitmaster Mac & Cheese",
    category: "sides",
    halfPanPrice: 75,
    fullPanPrice: 135,
    servesHalf: "12–15 guests",
    servesFull: "25–30 guests",
  },
  {
    id: "pan-baked-beans",
    name: "Smokehouse Baked Beans (w/ Burnt Ends)",
    category: "sides",
    halfPanPrice: 55,
    fullPanPrice: 95,
    servesHalf: "15–20 guests",
    servesFull: "30–40 guests",
  },
  {
    id: "pan-potato-salad",
    name: "Southern Mustard Potato Salad",
    category: "sides",
    halfPanPrice: 45,
    fullPanPrice: 75,
    servesHalf: "15–20 guests",
    servesFull: "30–40 guests",
  },
  {
    id: "pan-coleslaw",
    name: "Creamy Sweet Pepper Coleslaw",
    category: "sides",
    halfPanPrice: 40,
    fullPanPrice: 65,
    servesHalf: "20–25 guests",
    servesFull: "40–50 guests",
  },
  {
    id: "pan-cornbread",
    name: "Habanero Cheddar Skillet Cornbread",
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
    halfPanPrice: 55,
    fullPanPrice: 95,
    servesHalf: "12–15 guests",
    servesFull: "25–30 guests",
  },
  {
    id: "pan-rib-tips",
    name: "Southside Chicago Rib Tips Pan",
    category: "meats",
    halfPanPrice: 75,
    fullPanPrice: 150,
    servesHalf: "12–15 guests",
    servesFull: "25–30 guests",
  },
  {
    id: "pan-chili",
    name: "Slow-Simmered Brisket Burnt-End Chili Pan",
    category: "meats",
    halfPanPrice: 65,
    fullPanPrice: 120,
    servesHalf: "12–15 guests",
    servesFull: "25–30 guests",
  },
];

type MainTab = "packages" | "menu" | "pans" | "delivery" | "chalkboard";
const MAIN_TABS: MainTab[] = ["packages", "menu", "pans", "delivery", "chalkboard"];
function isMainTab(v: string | undefined): v is MainTab {
  return !!v && (MAIN_TABS as string[]).includes(v);
}

interface GuideCopy {
  title: string;
  summary: string;
  steps: { title: string; desc: string }[];
  tip?: string;
}

const GUIDE_COPY: Record<MainTab, GuideCopy> = {
  menu: {
    title: "How the Smoker Menu works",
    summary: "Turn items on or off and set what's ready today.",
    steps: [
      { title: "Check what's smoking", desc: "Flip an item to Available or Sold Out so customers only see what you can actually serve." },
      { title: "Update a price", desc: "Tap a price, type the new number, and it changes everywhere on your site." },
      { title: "Save", desc: "Hit Save Menu Changes at the top. Nothing goes live until you save." },
    ],
    tip: "Use Copy Client Price Sheet to text a customer your current prices in one tap.",
  },
  packages: {
    title: "How Per-Person Packages work",
    summary: "Set the price per guest for each catering package.",
    steps: [
      { title: "Pick a package", desc: "Each card is a package a customer can book for a party or event." },
      { title: "Change the per-person price", desc: "Type the new price. The quote calculator uses it right away." },
      { title: "Save", desc: "Press Save Menu Changes so the new price goes live." },
    ],
  },
  pans: {
    title: "How Party Pans work",
    summary: "Half-pan and full-pan prices for bulk sides and meats.",
    steps: [
      { title: "Find the pan", desc: "Each row shows the half pan and full pan price and how many people it feeds." },
      { title: "Edit the price", desc: "Tap a price, type the new number." },
      { title: "Save", desc: "Press Save Menu Changes when you're done." },
    ],
  },
  delivery: {
    title: "How Delivery & Booking Rules work",
    summary: "Delivery minimum, lead time, and deposit percent.",
    steps: [
      { title: "Set your minimum", desc: "The smallest order you'll deliver. Customers under it are asked to add more." },
      { title: "Set lead time", desc: "How many hours of notice you need before an event." },
      { title: "Set the deposit", desc: "The percent a customer pays up front to hold the date." },
    ],
    tip: "Change these before a big weekend so the quote form matches what you can handle.",
  },
  chalkboard: {
    title: "How the Weekly Chalkboard works",
    summary: "Post this week's specials for your customers.",
    steps: [
      { title: "Add a special", desc: "Name it, set a price, and write one short line about it." },
      { title: "Turn it on", desc: "Only items switched on show on your public chalkboard." },
      { title: "Save", desc: "Press save so customers see it right away." },
    ],
  },
};

interface AdminPriceConfiguratorProps {
  theme: AdminTheme;
  /** Driven by the sidebar: menu | packages | pans | delivery | chalkboard */
  subTab?: string;
}

export function AdminPriceConfigurator({ theme, subTab }: AdminPriceConfiguratorProps) {
  const isDay = theme === "day";
  const activeMainTab: MainTab = isMainTab(subTab) ? subTab : "menu";
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Initial State from Master Menu & Catering Packages
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
    menuItems: DEFAULT_MENU_ITEMS,
    partyPans: DEFAULT_PARTY_PANS,
    lastSaved: "Default System Settings",
  }));

  // Load from LocalStorage (with legacy migration support)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedConfigRaw = localStorage.getItem(STORAGE_KEY_PRICE_CONFIG);
        const savedLiveRaw = localStorage.getItem(STORAGE_KEY_LIVE_STATUS);

        let mergedItems = [...DEFAULT_MENU_ITEMS];

        // 1. If old or previous config exists
        if (savedConfigRaw) {
          const parsed = JSON.parse(savedConfigRaw);
          if (parsed && Array.isArray(parsed.menuItems) && parsed.menuItems.length > 0) {
            // Map saved item settings onto master items
            const savedMap = new Map<string, SmokerConfigMenuItem>(
              parsed.menuItems.map((m: SmokerConfigMenuItem) => [m.id, m])
            );
            mergedItems = DEFAULT_MENU_ITEMS.map((item) => {
              const found = savedMap.get(item.id);
              if (found) {
                return {
                  ...item,
                  basePrice: found.basePrice || item.basePrice,
                  status: found.status || item.status,
                  readyTime: found.readyTime || item.readyTime,
                  syncCalendar: found.syncCalendar ?? item.syncCalendar,
                };
              }
              return item;
            });
          }
        }

        // 2. If live status storage exists, overlay it
        if (savedLiveRaw) {
          const liveState = JSON.parse(savedLiveRaw);
          if (liveState && typeof liveState.items === "object") {
            mergedItems = mergedItems.map((item) => {
              const live = liveState.items[item.id];
              if (live) {
                return {
                  ...item,
                  status: live.status || item.status,
                  readyTime: live.readyTime || item.readyTime,
                  basePrice: live.priceOverride || item.basePrice,
                };
              }
              return item;
            });
          }
        }

        setConfig((prev) => ({
          ...prev,
          menuItems: mergedItems,
        }));
      } catch (e) {
        console.warn("Could not load smoker config state:", e);
      }
    }
  }, []);

  // Save config to both localStorage endpoints and sync to calendar
  const saveConfig = () => {
    const updated: SmokerConfigState = {
      ...config,
      lastSaved: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      }),
    };
    setConfig(updated);

    if (typeof window !== "undefined") {
      // 1. Save general config
      localStorage.setItem(STORAGE_KEY_PRICE_CONFIG, JSON.stringify(updated));

      // 2. Build live overrides map for public website consumption
      const liveOverrides: Record<string, any> = {};
      updated.menuItems.forEach((m) => {
        liveOverrides[m.id] = {
          id: m.id,
          status: m.status,
          readyTime: m.readyTime,
          priceOverride: m.basePrice,
          batchNote: m.batchNote,
          syncToCalendar: m.syncCalendar,
        };

        // 3. Auto-sync Live Smoke items to Marion's Smokehouse Calendar
        if (m.syncCalendar) {
          syncLiveSmokeToCalendar(m.id, m.name, m.status, m.readyTime);
        }
      });

      saveStoredLiveMenuOverrides(liveOverrides);
    }

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const resetDefaults = () => {
    if (confirm("Reset all 32 menu items, live smoker statuses, and pricing to master defaults?")) {
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
        menuItems: DEFAULT_MENU_ITEMS,
        partyPans: DEFAULT_PARTY_PANS,
        lastSaved: "Reset to Master Defaults",
      };
      setConfig(defState);
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY_PRICE_CONFIG);
        localStorage.removeItem(STORAGE_KEY_LIVE_STATUS);
      }
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  // Updaters
  const updateMenuItemStatus = (id: string, status: SmokerItemStatus) => {
    setConfig((prev) => {
      const updatedItems = prev.menuItems.map((m) => {
        if (m.id === id) {
          const readyTime = status === "smoking-now" ? (m.readyTime || "~5:00 PM") : m.readyTime;
          return { ...m, status, readyTime };
        }
        return m;
      });

      // Instantly update calendar if item is smoking now or switched off
      const target = updatedItems.find((m) => m.id === id);
      if (target && target.syncCalendar) {
        syncLiveSmokeToCalendar(target.id, target.name, status, target.readyTime);
      }

      return { ...prev, menuItems: updatedItems };
    });
  };

  const updateMenuItemReadyTime = (id: string, readyTime: string) => {
    setConfig((prev) => {
      const updatedItems = prev.menuItems.map((m) =>
        m.id === id ? { ...m, readyTime } : m
      );

      const target = updatedItems.find((m) => m.id === id);
      if (target && target.status === "smoking-now" && target.syncCalendar) {
        syncLiveSmokeToCalendar(target.id, target.name, target.status, readyTime);
      }

      return { ...prev, menuItems: updatedItems };
    });
  };

  const updateMenuItemPrice = (id: string, basePrice: string) => {
    setConfig((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((m) =>
        m.id === id ? { ...m, basePrice } : m
      ),
    }));
  };

  const toggleMenuItemCalendarSync = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((m) =>
        m.id === id ? { ...m, syncCalendar: !m.syncCalendar } : m
      ),
    }));
  };

  const updatePackage = (id: string, field: "pricePerPerson" | "minimumGuests", value: number) => {
    setConfig((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg) =>
        pkg.id === id ? { ...pkg, [field]: value } : pkg
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

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    return config.menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.batchNote.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [config.menuItems, selectedCategory, searchQuery]);

  // Statistics
  const smokingNowCount = config.menuItems.filter((m) => m.status === "smoking-now").length;
  const soldOutCount = config.menuItems.filter((m) => m.status === "sold-out").length;
  const inStockCount = config.menuItems.filter((m) => m.status === "in-stock").length;

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: config.menuItems.length };
    config.menuItems.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, [config.menuItems]);

  const copyPriceSheetToClipboard = () => {
    const text = `🔥 ALL THE SMOKE CATERING — PITMASTER LIVE PRICE SHEET 🔥
Pitmaster Marion Bolden | (773) 707-9988 | allthesmokecatering.com
Chicago's Northwest Side (60634) • $150 Heated Delivery Minimum

--- 🥩 PER-PERSON CATERING PACKAGES ---
${config.packages
  .map(
    (p) =>
      `• ${p.name}: $${p.pricePerPerson.toFixed(2)}/guest (Min ${p.minimumGuests} guests)\n  ${p.tagline}`
  )
  .join("\n")}

--- 🔥 SMOKER MEATS & LIVE RIG STATUS ---
${config.menuItems
  .map((m) => {
    const statusNote =
      m.status === "smoking-now"
        ? `🔥 SMOKING LIVE TODAY (Ready ${m.readyTime || "~5:00 PM"})`
        : m.status === "sold-out"
        ? "🚫 SOLD OUT TODAY (Pre-Order)"
        : "✅ IN STOCK";
    return `• ${m.name}: ${m.basePrice} [${statusNote}]\n  Yield: ${m.batchNote}`;
  })
  .join("\n")}

--- 🥘 SMOKEHOUSE PARTY PANS (HALF / FULL) ---
${config.partyPans
  .map(
    (pan) =>
      `• ${pan.name}: Half Pan $${pan.halfPanPrice} (${pan.servesHalf}) | Full Pan $${pan.fullPanPrice} (${pan.servesFull})`
  )
  .join("\n")}

*Prices include heated catering insulation kit and house pit sauces. 25% deposit locks event date.`;

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
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
            Manage live smoking status, ready times, 32 handcrafted cuts, party pans, and catering packages.
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
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>
              All 32 menu items, live smoker ready times, and calendar events synchronized successfully!
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400/80">{config.lastSaved}</span>
        </div>
      )}

      {/* Sidebar drives the sub-tab; plain-English guide per section */}
      <AdminGuide
        guideId={`services-${activeMainTab}`}
        theme={theme}
        title={GUIDE_COPY[activeMainTab].title}
        summary={GUIDE_COPY[activeMainTab].summary}
        steps={GUIDE_COPY[activeMainTab].steps}
        tip={GUIDE_COPY[activeMainTab].tip}
      />

      {/* SECTION 1: SMOKER MENU & LIVE AVAILABILITY (ALL 32 ITEMS) */}
      {activeMainTab === "menu" && (
        <div className="space-y-4">
          {/* Live Smoke Quick Summary Bar */}
          <div
            className={`p-3.5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
              isDay
                ? "bg-amber-50/80 border-amber-200 text-amber-950"
                : "bg-amber-950/20 border-amber-500/30 text-amber-200"
            }`}
          >
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-bold flex items-center gap-1.5">
                <span>🔥</span>
                <span>Active Live Smokes:</span>
                <span className="px-2 py-0.5 rounded-full bg-[#EA580C] text-white font-black">
                  {smokingNowCount}
                </span>
              </span>
              <span className="text-zinc-500">•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>In Stock:</span>
                <strong>{inStockCount}</strong>
              </span>
              <span className="text-zinc-500">•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                <span>Sold Out:</span>
                <strong>{soldOutCount}</strong>
              </span>
            </div>

            <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
              <span>📅</span>
              <span>1-Tap &quot;Live Smoke&quot; updates customer cards &amp; Smoke Calendar instantly</span>
            </div>
          </div>

          {/* Subcategory Filter Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {[
                { id: "all", label: "All Items", count: categoryCounts.all || 32, icon: "📋" },
                { id: "smoked-meats", label: "Smoked Meats", count: categoryCounts["smoked-meats"] || 8, icon: "🍖" },
                { id: "bbq-slabs", label: "BBQ Slabs & Ribs", count: categoryCounts["bbq-slabs"] || 6, icon: "🔥" },
                { id: "wings", label: "Pit Wings", count: categoryCounts.wings || 6, icon: "🍗" },
                { id: "specialties", label: "Chef Specialties", count: categoryCounts.specialties || 6, icon: "★" },
                { id: "sides", label: "Scratch Sides", count: categoryCounts.sides || 6, icon: "🧀" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? "bg-zinc-800 text-[#FF7A00] border border-[#FF7A00]/50 shadow-sm"
                      : isDay
                      ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-75">({cat.count})</span>
                </button>
              ))}
            </div>

            {/* Quick Search Input */}
            <div className="sm:w-64 relative">
              <input
                type="text"
                placeholder="Search cuts (e.g. Brisket, Ribs, Wings)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-3 py-1.5 pl-8 rounded-xl text-xs border outline-none ${
                  isDay
                    ? "bg-white border-stone-300 text-stone-900 focus:border-[#EA580C]"
                    : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                }`}
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                🔍
              </span>
            </div>
          </div>

          {/* 32-Item Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenuItems.map((item) => {
              const isSmoking = item.status === "smoking-now";
              const isSoldOut = item.status === "sold-out";

              const statusBadgeColor = isSmoking
                ? "bg-[#EA580C]/20 text-[#FF7A00] border-[#EA580C]/50 animate-pulse"
                : isSoldOut
                ? "bg-red-500/20 text-red-400 border-red-500/40"
                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";

              const statusBadgeText = isSmoking
                ? `🔥 Smoking Live • ${item.readyTime || "~5:00 PM"}`
                : isSoldOut
                ? "🚫 Sold Out / Next Cook"
                : "In Stock / Smoking";

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isSmoking
                      ? isDay
                        ? "bg-amber-50/50 border-[#EA580C] shadow-md ring-1 ring-[#EA580C]/30"
                        : "bg-[#18130e] border-[#EA580C]/60 shadow-lg ring-1 ring-[#EA580C]/40"
                      : isDay
                      ? "bg-white border-stone-300 shadow-sm"
                      : "bg-[#141210] border-zinc-800 shadow-md hover:border-zinc-700"
                  }`}
                >
                  <div>
                    {/* Header: Title, Category & Status Pill */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h4
                            className={`font-display text-sm font-bold ${
                              isDay ? "text-stone-900" : "text-white"
                            }`}
                          >
                            {item.name}
                          </h4>
                          {item.badge && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              {item.badge}
                            </span>
                          )}
                          {item.popular && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-[#EA580C]/20 text-[#FF7A00]">
                              Popular
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-1 line-clamp-2 ${
                            isDay ? "text-stone-500" : "text-zinc-400"
                          }`}
                        >
                          {item.batchNote}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border shrink-0 ${statusBadgeColor}`}
                      >
                        {statusBadgeText}
                      </span>
                    </div>

                    {/* Price & 3-Way Status Toggle */}
                    <div className="pt-3 mt-2 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-2">
                      {/* Price Input */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-zinc-400">Price:</span>
                        <input
                          type="text"
                          value={item.basePrice}
                          onChange={(e) => updateMenuItemPrice(item.id, e.target.value)}
                          className={`w-28 px-2 py-1 rounded-lg text-xs font-bold border outline-none ${
                            isDay
                              ? "bg-stone-50 border-stone-300 text-stone-900"
                              : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                          }`}
                        />
                      </div>

                      {/* 3-Way Status Toggle Buttons */}
                      <div className="inline-flex rounded-xl border border-zinc-800 p-0.5 text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => updateMenuItemStatus(item.id, "in-stock")}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            item.status === "in-stock"
                              ? "bg-emerald-500 text-white font-extrabold shadow-sm"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          In Stock
                        </button>
                        <button
                          type="button"
                          onClick={() => updateMenuItemStatus(item.id, "smoking-now")}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            item.status === "smoking-now"
                              ? "bg-[#EA580C] text-white font-extrabold shadow-sm"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          <span>🔥</span>
                          <span>Live Smoke</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateMenuItemStatus(item.id, "sold-out")}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            item.status === "sold-out"
                              ? "bg-red-600 text-white font-extrabold shadow-sm"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          Sold Out
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable 1-Tap Ready Time Selector (Visible when Smoking Live) */}
                  {isSmoking && (
                    <div className="p-3 rounded-xl bg-black/30 border border-[#EA580C]/40 space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-[#FF7A00] flex items-center gap-1">
                          <span>⏱️</span>
                          <span>Select Customer Ready Time:</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          {item.readyTime || "~5:00 PM"}
                        </span>
                      </div>

                      {/* Preset Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {READY_TIME_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => updateMenuItemReadyTime(item.id, preset)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              item.readyTime === preset
                                ? "bg-[#EA580C] text-white shadow-sm"
                                : isDay
                                ? "bg-white border border-stone-300 text-stone-700 hover:border-[#EA580C]"
                                : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:text-white hover:border-amber-500/50"
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>

                      {/* Custom Time Input & Calendar Sync Checkbox */}
                      <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-zinc-400">Custom:</span>
                          <input
                            type="text"
                            placeholder="e.g. ~4:30 PM"
                            value={item.readyTime || ""}
                            onChange={(e) => updateMenuItemReadyTime(item.id, e.target.value)}
                            className="w-24 px-2 py-0.5 rounded text-[11px] font-bold bg-zinc-900 border border-zinc-700 text-white outline-none focus:border-[#EA580C]"
                          />
                        </div>

                        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-zinc-300 hover:text-white">
                          <input
                            type="checkbox"
                            checked={item.syncCalendar ?? true}
                            onChange={() => toggleMenuItemCalendarSync(item.id)}
                            className="rounded border-zinc-700 text-[#EA580C] focus:ring-0"
                          />
                          <span>Sync to Today&apos;s Calendar</span>
                        </label>
                      </div>

                      {/* Public Card Badge Preview */}
                      <div className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                        <span>Public Badge:</span>
                        <span className="px-2 py-0.5 rounded bg-[#EA580C]/20 text-[#FF7A00] border border-[#EA580C]/40 font-bold">
                          🔥 SMOKING LIVE TODAY • READY AT {item.readyTime || "~5:00 PM"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Sold Out Public Badge Preview */}
                  {isSoldOut && (
                    <div className="p-2 rounded-xl bg-red-950/20 border border-red-500/30 text-[10px] text-red-300 flex items-center justify-between">
                      <span>Public Badge: <strong>SOLD OUT TODAY • PRE-ORDER FOR NEXT SMOKE</strong></span>
                      <span className="text-[9px] text-red-400">Adds as Pre-Order in tray</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: PER-PERSON CATERING PACKAGES */}
      {activeMainTab === "packages" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {config.packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-5 rounded-2xl border space-y-4 transition-all ${
                  isDay
                    ? "bg-white border-stone-300 shadow-sm"
                    : "bg-[#141210] border-amber-500/25 shadow-md"
                }`}
              >
                <div>
                  <h4
                    className={`font-display text-base font-bold ${
                      isDay ? "text-stone-900" : "text-white"
                    }`}
                  >
                    {pkg.name}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                    {pkg.tagline}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-zinc-800/60">
                  {/* Price Per Person */}
                  <div>
                    <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                      Price Per Person ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.5"
                        min="5"
                        value={pkg.pricePerPerson}
                        onChange={(e) =>
                          updatePackage(pkg.id, "pricePerPerson", parseFloat(e.target.value) || 0)
                        }
                        className={`w-full pl-7 pr-3 py-1.5 rounded-xl text-xs font-bold border outline-none ${
                          isDay
                            ? "bg-stone-50 border-stone-300 text-stone-900"
                            : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Minimum Guests */}
                  <div>
                    <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                      Minimum Guest Count
                    </label>
                    <input
                      type="number"
                      step="5"
                      min="10"
                      value={pkg.minimumGuests}
                      onChange={(e) =>
                        updatePackage(pkg.id, "minimumGuests", parseInt(e.target.value, 10) || 0)
                      }
                      className={`w-full px-3 py-1.5 rounded-xl text-xs font-bold border outline-none ${
                        isDay
                          ? "bg-stone-50 border-stone-300 text-stone-900"
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
                    ${(pkg.pricePerPerson * pkg.minimumGuests).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: PARTY PANS & BULK SIDES */}
      {activeMainTab === "pans" && (
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
      {activeMainTab === "delivery" && (
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
                Minimum food total required for hot insulated drop-off delivery across Cook County.
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
                Advance notice required for curing, brining, and low-and-slow hardwood pit cooks.
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

      {/* SECTION 5: WEEKLY SPECIALS CHALKBOARD MANAGER */}
      {activeMainTab === "chalkboard" && <AdminChalkboardManager theme={theme} />}
    </div>
  );
}

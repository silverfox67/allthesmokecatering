"use client";

import React, { useState, useEffect, useRef } from "react";
import { AdminTheme } from "./AdminPortal";
import {
  SmokerItemStatus,
  LiveSmokerItemOverride,
  READY_TIME_PRESETS,
  getStoredLiveMenuOverrides,
  saveStoredLiveMenuOverrides,
  syncLiveSmokeToCalendar,
} from "@/utils/smoker-live-status";

interface AdminPitmasterAppProps {
  theme: AdminTheme;
}

interface SmokeTimerSession {
  id: string;
  meatId: string;
  meatName: string;
  icon: string;
  chamberTarget: string;
  internalTarget: string;
  totalDurationHours: number;
  startTime: number | null; // timestamp
  elapsedSeconds: number;
  isRunning: boolean;
  currentMilestoneIndex: number;
  milestones: {
    label: string;
    targetHour: number;
    targetTemp: string;
    completed: boolean;
    note: string;
  }[];
}

interface WoodLogEntry {
  id: string;
  time: string;
  woodType: string;
  splitCount: number;
  pitTemp: number;
}

interface PitCheatItem {
  cut: string;
  chamberTemp: string;
  pullTemp: string;
  feelTest: string;
  restTime: string;
  woodPairing: string;
}

const FLAGSHIP_CUTS = [
  { id: "whole-brisket", name: "14-Hour Prime Texas Brisket", icon: "🥩", cutType: "Beef" },
  { id: "st-louis-ribs", name: "St. Louis Cut Spare Rib Slabs", icon: "🍖", cutType: "Pork" },
  { id: "turkey-chops", name: "Pit-Smoked Turkey Chops", icon: "🍗", cutType: "Poultry" },
  { id: "smoked-beef-sausage", name: "Chicago Beef Hot Links", icon: "🌭", cutType: "Beef" },
  { id: "wings-peach-habanero", name: "Crispy Whole Smoked Pit Wings", icon: "🔥", cutType: "Poultry" },
  { id: "cedar-plank-salmon", name: "Cedar-Plank Wild Salmon Fillet", icon: "🐟", cutType: "Seafood" },
  { id: "burnt-ends-specialty", name: "Double-Smoked Brisket Burnt Ends", icon: "✨", cutType: "Reserve" },
  { id: "smoked-oxtails", name: "Slow-Simmered Smoked Oxtails", icon: "👑", cutType: "Reserve" },
];

const INITIAL_SESSIONS: SmokeTimerSession[] = [
  {
    id: "session-brisket",
    meatId: "whole-brisket",
    meatName: "14-Hour Prime Texas Brisket",
    icon: "🥩",
    chamberTarget: "250°F Low & Slow",
    internalTarget: "203°F Probe Butter-Tender",
    totalDurationHours: 14,
    startTime: null,
    elapsedSeconds: 0,
    isRunning: false,
    currentMilestoneIndex: 0,
    milestones: [
      { label: "Bark Formation", targetHour: 6, targetTemp: "155°F - 160°F", completed: false, note: "Pecan/Cherry smoke bath. Do not spritz first 3 hours." },
      { label: "The Stall & Butcher Paper Wrap", targetHour: 8, targetTemp: "165°F", completed: false, note: "Wrap tightly in pink peach paper with smoked tallow." },
      { label: "Collagen Breakdown & Render", targetHour: 12, targetTemp: "200°F - 203°F", completed: false, note: "Test probe in thickest flat; should slide like warm butter." },
      { label: "Cooler / Cambro Rest", targetHour: 14, targetTemp: "145°F - 150°F Slice", completed: false, note: "Minimum 2 hours in insulated cooler before slicing against grain." },
    ],
  },
  {
    id: "session-ribs",
    meatId: "st-louis-ribs",
    meatName: "St. Louis Cut Spare Rib Slabs (3-2-1)",
    icon: "🍖",
    chamberTarget: "225°F - 250°F",
    internalTarget: "200°F (90° Bend Crack)",
    totalDurationHours: 6,
    startTime: null,
    elapsedSeconds: 0,
    isRunning: false,
    currentMilestoneIndex: 0,
    milestones: [
      { label: "Phase 1: Naked Smoke", targetHour: 3, targetTemp: "160°F", completed: false, note: "Heavy cherry wood smoke. Spritz apple cider vinegar every 45 min." },
      { label: "Phase 2: Foil Wrap (Tenderize)", targetHour: 5, targetTemp: "190°F", completed: false, note: "Meat side down on butter, dark brown sugar, and clover honey." },
      { label: "Phase 3: Glaze Set & Bark Tighten", targetHour: 6, targetTemp: "200°F", completed: false, note: "Unwrap, brush Marion's pit glaze, caramelize 45 minutes." },
    ],
  },
  {
    id: "session-wings",
    meatId: "wings-peach-habanero",
    meatName: "Crispy Whole Smoked Pit Wings",
    icon: "🔥",
    chamberTarget: "275°F - 300°F (Crisp Skin)",
    internalTarget: "175°F - 180°F (Bite-Through)",
    totalDurationHours: 2.5,
    startTime: null,
    elapsedSeconds: 0,
    isRunning: false,
    currentMilestoneIndex: 0,
    milestones: [
      { label: "Smoke Bath", targetHour: 1.5, targetTemp: "155°F", completed: false, note: "Hickory & oak smoke. Render subcutaneous fat evenly." },
      { label: "Direct Coal Char Finish", targetHour: 2.2, targetTemp: "175°F", completed: false, note: "Flash crisp over red coals for signature crunch." },
      { label: "Toss in Marion's Glaze", targetHour: 2.5, targetTemp: "Serve Hot", completed: false, note: "Toss hot in Honey Garlic or Devil's Dessert sauce." },
    ],
  },
  {
    id: "session-salmon",
    meatId: "cedar-plank-salmon",
    meatName: "Cedar-Plank Wild Salmon Fillet",
    icon: "🐟",
    chamberTarget: "225°F Gentle Sweet Smoke",
    internalTarget: "145°F Moist Flake",
    totalDurationHours: 1.5,
    startTime: null,
    elapsedSeconds: 0,
    isRunning: false,
    currentMilestoneIndex: 0,
    milestones: [
      { label: "Char Plank & Smoke Ingestion", targetHour: 0.75, targetTemp: "120°F", completed: false, note: "Charred cedar delivers aromatic steam into fish." },
      { label: "Brown Sugar Mustard Glaze", targetHour: 1.25, targetTemp: "140°F", completed: false, note: "Brush sweet mustard glaze. Watch for fine white albumin beads." },
      { label: "Fresh Dill & Garnish Pull", targetHour: 1.5, targetTemp: "145°F", completed: false, note: "Pull instantly. Let carryover cooking rest 5 minutes." },
    ],
  },
];

const PIT_CHEATS: PitCheatItem[] = [
  {
    cut: "Prime Texas Brisket",
    chamberTemp: "225°F - 250°F",
    pullTemp: "203°F (200°F-205°F)",
    feelTest: "Probe slides into flat with zero resistance like warm butter; jiggly feel.",
    restTime: "2 to 4 hours in faux cambro (cooler + towels). Essential for juices.",
    woodPairing: "Post Oak & Hickory, backed by Cherry for deep mahogany bark.",
  },
  {
    cut: "St. Louis Rib Slabs",
    chamberTemp: "225°F - 250°F",
    pullTemp: "200°F - 203°F",
    feelTest: "Tongs lift slab from middle: bend to 90° with a slight surface crack; bones exposed 1/4\".",
    restTime: "15 to 20 minutes loose foil tent before slicing between bones.",
    woodPairing: "Cherry & Apple wood for rich sweet smoke ring.",
  },
  {
    cut: "Pit-Smoked Turkey Chops",
    chamberTemp: "250°F - 275°F",
    pullTemp: "165°F exact",
    feelTest: "Juices run completely clear; meat is supple with pale pink smoke ring.",
    restTime: "15 minutes covered in foil with melted herbed butter.",
    woodPairing: "Pecan & Apple (avoid heavy mesquite on poultry).",
  },
  {
    cut: "Chicago Beef Hot Links",
    chamberTemp: "225°F",
    pullTemp: "160°F",
    feelTest: "Casing is taut, glossy and snaps loudly when pinched.",
    restTime: "5 to 10 minutes rest on butcher paper.",
    woodPairing: "Hickory & Oak for classic Southside smoke bite.",
  },
  {
    cut: "Crispy Whole Pit Wings",
    chamberTemp: "275°F - 300°F",
    pullTemp: "175°F - 180°F",
    feelTest: "Higher temp breaks down wing collagen; skin turns bite-through crisp.",
    restTime: "Toss immediately in sauce and serve piping hot.",
    woodPairing: "Hickory & Cherry blend.",
  },
  {
    cut: "Double-Smoked Burnt Ends",
    chamberTemp: "250°F",
    pullTemp: "205°F - 208°F",
    feelTest: "Cubes yield like meat candy; exterior glaze is glossy and tacky.",
    restTime: "10 minutes cooling in pan before serving.",
    woodPairing: "Oak & Hickory with dark molasses glaze.",
  },
  {
    cut: "Cedar-Plank Wild Salmon",
    chamberTemp: "225°F",
    pullTemp: "140°F - 145°F",
    feelTest: "Delicate white albumin dots appear; flesh flakes under gentle thumb press.",
    restTime: "5 minutes carryover on charred plank.",
    woodPairing: "Alder, Apple or Light Cherry.",
  },
  {
    cut: "Slow-Simmered Smoked Oxtails",
    chamberTemp: "250°F",
    pullTemp: "205°F - 208°F",
    feelTest: "Gelatinous rendering; meat pulls freely from bone with fork.",
    restTime: "30 minutes resting in braising liquor.",
    woodPairing: "Hickory & Oak (heavy smoke tolerance).",
  },
];

export function AdminPitmasterApp({ theme }: AdminPitmasterAppProps) {
  const isDay = theme === "day";

  // Pit Environment & Fuel State
  const [pitTemp, setPitTemp] = useState<number>(250);
  const [damperSetting, setDamperSetting] = useState<number>(50); // percentage
  const [activeWood, setActiveWood] = useState<string>("Hickory & Cherry");
  const [splitCountToday, setSplitCountToday] = useState<number>(6);
  const [woodLogs, setWoodLogs] = useState<WoodLogEntry[]>([
    { id: "log-1", time: "6:15 AM", woodType: "Hickory Splits", splitCount: 3, pitTemp: 245 },
    { id: "log-2", time: "8:30 AM", woodType: "Cherry & Oak", splitCount: 2, pitTemp: 252 },
    { id: "log-3", time: "10:45 AM", woodType: "Pecan Wood", splitCount: 1, pitTemp: 248 },
  ]);

  // Timers & Active Cook Sessions
  const [sessions, setSessions] = useState<SmokeTimerSession[]>(INITIAL_SESSIONS);
  const [activeTab, setActiveTab] = useState<"timers" | "status-flipper" | "cheat-sheet" | "fuel-log">("timers");
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Live Smoker Status Overrides (Synced with public menu & price configurator)
  const [liveOverrides, setLiveOverrides] = useState<Record<string, LiveSmokerItemOverride>>({});
  const [selectedReadyTime, setSelectedReadyTime] = useState<string>("~5:00 PM");

  // Load stored state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Load live status overrides
      const stored = getStoredLiveMenuOverrides();
      setLiveOverrides(stored);

      // 2. Load stored timers from localStorage if available
      try {
        const savedSessions = localStorage.getItem("ats_pit_active_sessions");
        if (savedSessions) {
          const parsed = JSON.parse(savedSessions);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSessions(parsed);
          }
        }

        const savedFuel = localStorage.getItem("ats_pit_fuel_logs");
        if (savedFuel) {
          const parsedFuel = JSON.parse(savedFuel);
          if (Array.isArray(parsedFuel)) {
            setWoodLogs(parsedFuel);
            const total = parsedFuel.reduce((sum, item) => sum + (item.splitCount || 0), 0);
            setSplitCountToday(total);
          }
        }
      } catch (err) {
        console.warn("Could not load stored pit sessions:", err);
      }
    }
  }, []);

  // Timer interval ticker (increments active running timers)
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prev) =>
        prev.map((s) => {
          if (!s.isRunning) return s;
          const nextSec = s.elapsedSeconds + 1;

          // Check if milestone target is reached
          const nextHours = nextSec / 3600;
          const updatedMilestones = s.milestones.map((m) => {
            if (!m.completed && nextHours >= m.targetHour) {
              return { ...m, completed: true };
            }
            return m;
          });

          return {
            ...s,
            elapsedSeconds: nextSec,
            milestones: updatedMilestones,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save sessions to localStorage when updated
  const saveSessionsToStorage = (updated: SmokeTimerSession[]) => {
    setSessions(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ats_pit_active_sessions", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save pit sessions:", err);
      }
    }
  };

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  // Timer Controls
  const handleToggleTimer = (sessionId: string) => {
    const updated = sessions.map((s) => {
      if (s.id === sessionId) {
        const nextRunning = !s.isRunning;
        return {
          ...s,
          isRunning: nextRunning,
          startTime: s.startTime || Date.now(),
        };
      }
      return s;
    });
    saveSessionsToStorage(updated);
    const target = updated.find((s) => s.id === sessionId);
    showToast(target?.isRunning ? `⏱️ Started timer for ${target.meatName}` : `⏸️ Paused timer for ${target?.meatName}`);
  };

  const handleResetTimer = (sessionId: string) => {
    const updated = sessions.map((s) => {
      if (s.id === sessionId) {
        return {
          ...s,
          isRunning: false,
          startTime: null,
          elapsedSeconds: 0,
          currentMilestoneIndex: 0,
          milestones: s.milestones.map((m) => ({ ...m, completed: false })),
        };
      }
      return s;
    });
    saveSessionsToStorage(updated);
    showToast("Timer reset to 0:00:00");
  };

  const handleCheckMilestone = (sessionId: string, milestoneIdx: number) => {
    const updated = sessions.map((s) => {
      if (s.id === sessionId) {
        const nextMilestones = [...s.milestones];
        nextMilestones[milestoneIdx].completed = !nextMilestones[milestoneIdx].completed;
        return { ...s, milestones: nextMilestones };
      }
      return s;
    });
    saveSessionsToStorage(updated);
    showToast("✓ Milestone milestone status updated");
  };

  // Fuel Logger Actions
  const handleAddWoodSplit = (splitsToAdd: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const newEntry: WoodLogEntry = {
      id: `wood-${Date.now()}`,
      time: timeStr,
      woodType: activeWood,
      splitCount: splitsToAdd,
      pitTemp: pitTemp,
    };

    const nextLogs = [newEntry, ...woodLogs];
    setWoodLogs(nextLogs);
    setSplitCountToday((prev) => prev + splitsToAdd);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ats_pit_fuel_logs", JSON.stringify(nextLogs));
      } catch (err) {
        console.error(err);
      }
    }
    showToast(`🪵 Logged +${splitsToAdd} split (${activeWood}) at ${timeStr}`);
  };

  // Glove-Friendly 1-Tap Meat Status Flipper
  const handleSetMeatStatus = (meatId: string, meatName: string, newStatus: SmokerItemStatus) => {
    const current = liveOverrides[meatId] || {
      id: meatId,
      status: "in-stock",
    };

    const updatedOverride: LiveSmokerItemOverride = {
      ...current,
      id: meatId,
      status: newStatus,
      readyTime: newStatus === "smoking-now" ? selectedReadyTime : undefined,
    };

    const nextOverrides = {
      ...liveOverrides,
      [meatId]: updatedOverride,
    };

    setLiveOverrides(nextOverrides);
    saveStoredLiveMenuOverrides(nextOverrides);

    // Sync to Calendar if Smoking Live
    syncLiveSmokeToCalendar(meatId, meatName, newStatus, updatedOverride.readyTime);

    const statusLabel =
      newStatus === "smoking-now"
        ? `🔥 SMOKING LIVE TODAY (Ready ${selectedReadyTime})`
        : newStatus === "sold-out"
        ? "🚫 SOLD OUT TODAY"
        : "✅ IN STOCK & AVAILABLE";

    showToast(`Updated "${meatName}" → ${statusLabel}`);
  };

  const formatElapsedTime = (totalSeconds: number): string => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. TOP MOBILE COCKPIT / GLOVE-FRIENDLY HEADER */}
      <div
        className={`rounded-2xl p-4 sm:p-6 transition-all border shadow-lg ${
          isDay
            ? "bg-white border-[#E6DDD2] text-[#1C1917]"
            : "bg-[#141416] border-zinc-800 text-neutral-100"
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#E65100] flex items-center justify-center text-white text-2xl shadow-md shrink-0">
              🔥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Trailer Rig Live Mode
                </span>
                <span className="text-xs text-zinc-500">Pitmaster Marion Bolden</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-wide mt-0.5">
                SMOKER RIG OPERATIONS HUD
              </h1>
            </div>
          </div>

          {/* Quick Temperature & Fuel Indicator Readouts */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Pit Temp Readout */}
            <div
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl border flex items-center gap-2.5 ${
                isDay ? "bg-[#FAF7F2] border-[#E6DDD2]" : "bg-black/40 border-zinc-700/60"
              }`}
            >
              <span className="text-xl">🌡️</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500">Chamber Temp</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-[#FF7A00]">{pitTemp}°F</span>
                  <span className="text-[10px] text-zinc-400">Sweet Spot</span>
                </div>
              </div>
            </div>

            {/* Wood Splits Added Today */}
            <div
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl border flex items-center gap-2.5 ${
                isDay ? "bg-[#FAF7F2] border-[#E6DDD2]" : "bg-black/40 border-zinc-700/60"
              }`}
            >
              <span className="text-xl">🪵</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500">Splits Logged</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-amber-500">{splitCountToday}</span>
                  <span className="text-[10px] text-zinc-400">cords burn</span>
                </div>
              </div>
            </div>

            {/* Quick 1-Tap Split Logger Button */}
            <button
              type="button"
              onClick={() => handleAddWoodSplit(1)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-md flex items-center gap-2 transition active:scale-95 shrink-0"
              title="Add 1 split of wood to firebox"
            >
              <span>+1 Split</span>
            </button>
          </div>
        </div>

        {/* Toast / Status Alert Banner */}
        {notificationMsg && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
            <span>🔔</span>
            <span>{notificationMsg}</span>
          </div>
        )}
      </div>

      {/* 2. SUB-NAVIGATION TABS (Mobile Friendly Pinned Bar) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: "timers", label: "Active Smoke Timers", icon: "⏱️" },
          { key: "status-flipper", label: "Trailer Menu Flipper", icon: "⚡" },
          { key: "cheat-sheet", label: "Internal Temp Targets", icon: "🎯" },
          { key: "fuel-log", label: "Wood Fuel & Pit Log", icon: "🪵" },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all min-h-[44px] ${
                isActive
                  ? "bg-[#FF7A00] text-white shadow-md shadow-orange-950/20"
                  : isDay
                  ? "bg-stone-200/80 hover:bg-stone-300 text-stone-700"
                  : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB A: ACTIVE SMOKE TIMERS & MULTI-CUT TRACKER */}
      {activeTab === "timers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-display tracking-wide">
                Active Smoker Racks & Phase Trackers
              </h2>
              <p className="text-xs text-zinc-400">
                Live stopwatches & milestone temperatures for low-and-slow rendering.
              </p>
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              Auto-syncs with Marion's mobile browser
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session) => {
              const elapsedHours = session.elapsedSeconds / 3600;
              const progressPct = Math.min(100, Math.round((elapsedHours / session.totalDurationHours) * 100));

              return (
                <div
                  key={session.id}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                    session.isRunning
                      ? isDay
                        ? "bg-amber-50/60 border-amber-300 shadow-md ring-1 ring-amber-400/30"
                        : "bg-[#181512] border-amber-500/40 shadow-xl ring-1 ring-amber-500/20"
                      : isDay
                      ? "bg-white border-[#E6DDD2]"
                      : "bg-[#121214] border-zinc-800"
                  }`}
                >
                  {/* Top: Meat Icon, Name, Target Temps */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-xl bg-black/20 shrink-0">
                          {session.icon}
                        </span>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold font-display leading-tight">
                            {session.meatName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              Chamber: {session.chamberTarget}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Pull: {session.internalTarget}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Running Badge */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                          session.isRunning
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        {session.isRunning ? "Smoking Now" : "Paused / Ready"}
                      </span>
                    </div>

                    {/* Big Digital Stopwatch Display */}
                    <div className="my-4 p-3 rounded-xl bg-black/40 border border-zinc-800 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-mono uppercase text-zinc-400">Elapsed Time</p>
                        <p className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-[#FF7A00]">
                          {formatElapsedTime(session.elapsedSeconds)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-mono uppercase text-zinc-400">Total Planned</p>
                        <p className="text-sm font-bold font-mono text-zinc-300">
                          ~{session.totalDurationHours} Hours
                        </p>
                        <p className="text-[11px] text-zinc-400">{progressPct}% Complete</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-800/80 rounded-full h-2 mb-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-[#FF7A00] h-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {/* Step-by-Step Phase Milestones Checklist */}
                    <div className="space-y-2 mb-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Pitmaster Phase Milestones:
                      </p>
                      <div className="space-y-1.5">
                        {session.milestones.map((m, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleCheckMilestone(session.id, idx)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start justify-between gap-2.5 ${
                              m.completed
                                ? isDay
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                                  : "bg-emerald-950/30 border-emerald-600/40 text-emerald-300"
                                : isDay
                                ? "bg-white hover:bg-stone-50 border-[#E6DDD2]"
                                : "bg-zinc-900/60 hover:bg-zinc-800 border-zinc-800"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-sm mt-0.5">
                                {m.completed ? "✅" : "⭕"}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">{m.label}</span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 font-mono">
                                    Hour {m.targetHour}
                                  </span>
                                  <span className="text-[10px] font-semibold text-amber-500">
                                    Target: {m.targetTemp}
                                  </span>
                                </div>
                                <p className="text-[11px] opacity-80 mt-0.5">{m.note}</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-zinc-400 shrink-0 mt-0.5">
                              {m.completed ? "Done" : "Tap to complete"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Timer Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/60">
                    <button
                      type="button"
                      onClick={() => handleToggleTimer(session.id)}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95 ${
                        session.isRunning
                          ? "bg-amber-600 hover:bg-amber-500 text-white"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white"
                      }`}
                    >
                      <span>{session.isRunning ? "⏸️ Pause Cook Timer" : "▶️ Start Smoke Timer"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResetTimer(session.id)}
                      className="py-3 px-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition"
                      title="Reset timer to 0"
                    >
                      🔄 Reset
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB B: GLOVE-FRIENDLY TRAILER MENU FLIPPER */}
      {activeTab === "status-flipper" && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-2xl border ${
              isDay ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-amber-950/20 border-amber-800/40 text-amber-300"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <span>⚡ 1-Tap Smoker Menu Status Control</span>
                </h3>
                <p className="text-xs opacity-90 mt-0.5">
                  Tapping these big buttons updates the live menu ticker, chalkboard specials, and ordering cart instantly!
                </p>
              </div>

              {/* Ready Time Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-zinc-400">Ready Time:</span>
                <select
                  value={selectedReadyTime}
                  onChange={(e) => setSelectedReadyTime(e.target.value)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#FF7A00] ${
                    isDay
                      ? "bg-white border-[#D8CEC1] text-[#1C1917]"
                      : "bg-[#18181A] border-zinc-700 text-white"
                  }`}
                >
                  {READY_TIME_PRESETS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cuts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3.5">
            {FLAGSHIP_CUTS.map((meat) => {
              const currentOverride = liveOverrides[meat.id];
              const status: SmokerItemStatus = currentOverride?.status || "in-stock";
              const readyTime = currentOverride?.readyTime;

              return (
                <div
                  key={meat.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    status === "smoking-now"
                      ? isDay
                        ? "bg-amber-50/80 border-amber-400 shadow-md ring-1 ring-amber-400"
                        : "bg-[#1C160F] border-amber-500/60 shadow-lg ring-1 ring-amber-500/30"
                      : status === "sold-out"
                      ? isDay
                        ? "bg-red-50/60 border-red-200"
                        : "bg-[#1A1212] border-red-900/50"
                      : isDay
                      ? "bg-white border-[#E6DDD2]"
                      : "bg-[#121214] border-zinc-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1.5 rounded-lg bg-black/20">{meat.icon}</span>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base leading-snug">{meat.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] uppercase font-bold text-zinc-400">{meat.cutType}</span>
                          {status === "smoking-now" && (
                            <span className="text-[11px] font-bold text-amber-500 animate-pulse">
                              • Smoking Live ({readyTime || selectedReadyTime})
                            </span>
                          )}
                          {status === "sold-out" && (
                            <span className="text-[11px] font-bold text-red-400">• Sold Out Today</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                        status === "smoking-now"
                          ? "bg-amber-500 text-black font-black"
                          : status === "sold-out"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {status === "smoking-now" ? "🔥 LIVE" : status === "sold-out" ? "SOLD OUT" : "IN STOCK"}
                    </span>
                  </div>

                  {/* 3 Massive 50px Touch Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {/* 1. In Stock */}
                    <button
                      type="button"
                      onClick={() => handleSetMeatStatus(meat.id, meat.name, "in-stock")}
                      className={`min-h-[48px] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm active:scale-95 ${
                        status === "in-stock"
                          ? "bg-emerald-600 text-white ring-2 ring-emerald-400 font-black shadow-emerald-950/20"
                          : isDay
                          ? "bg-stone-200/90 text-stone-700 hover:bg-stone-300"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      <span>In Stock</span>
                    </button>

                    {/* 2. Smoking Live */}
                    <button
                      type="button"
                      onClick={() => handleSetMeatStatus(meat.id, meat.name, "smoking-now")}
                      className={`min-h-[48px] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm active:scale-95 ${
                        status === "smoking-now"
                          ? "bg-gradient-to-r from-amber-500 to-[#FF7A00] text-white ring-2 ring-amber-400 font-black shadow-orange-950/30"
                          : isDay
                          ? "bg-stone-200/90 text-stone-700 hover:bg-stone-300"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      <span>🔥 Smoking</span>
                    </button>

                    {/* 3. Sold Out */}
                    <button
                      type="button"
                      onClick={() => handleSetMeatStatus(meat.id, meat.name, "sold-out")}
                      className={`min-h-[48px] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm active:scale-95 ${
                        status === "sold-out"
                          ? "bg-red-600 text-white ring-2 ring-red-400 font-black shadow-red-950/20"
                          : isDay
                          ? "bg-stone-200/90 text-stone-700 hover:bg-stone-300"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      <span>🚫 Sold Out</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB C: INTERNAL TEMPERATURE TARGETS & PULL CHEAT SHEET */}
      {activeTab === "cheat-sheet" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-display tracking-wide">
                Pitmaster Target Pull Temperatures & Feel Guide
              </h2>
              <p className="text-xs text-zinc-400">
                Master references for exact doneness, collagen breakdown, and resting times.
              </p>
            </div>
            <span className="text-xs font-mono text-[#FF7A00] font-bold">Marion’s Rule: Feel beats temp</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {PIT_CHEATS.map((cheat, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isDay ? "bg-white border-[#E6DDD2]" : "bg-[#121214] border-zinc-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-zinc-800/60">
                  <h3 className="font-bold text-base font-display">{cheat.cut}</h3>
                  <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Pull: {cheat.pullTemp}
                  </span>
                </div>

                <div className="space-y-2 mt-3 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-zinc-400 w-28 shrink-0">Chamber Temp:</span>
                    <span className="font-semibold text-amber-400">{cheat.chamberTemp}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-zinc-400 w-28 shrink-0">Feel Test:</span>
                    <span className="font-medium text-zinc-200">{cheat.feelTest}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-zinc-400 w-28 shrink-0">Rest Time:</span>
                    <span className="font-semibold text-emerald-400">{cheat.restTime}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-zinc-400 w-28 shrink-0">Wood Species:</span>
                    <span className="font-medium text-amber-300">{cheat.woodPairing}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB D: WOOD FUEL & FIREBOX PIT LOG */}
      {activeTab === "fuel-log" && (
        <div className="space-y-4">
          <div
            className={`p-5 rounded-2xl border ${
              isDay ? "bg-white border-[#E6DDD2]" : "bg-[#121214] border-zinc-800"
            }`}
          >
            <h3 className="text-base font-bold font-display mb-3">Add Wood Splits to Firebox</h3>
            
            {/* Wood Species Selection */}
            <div className="mb-4">
              <label className="text-xs font-bold text-zinc-400 block mb-1.5">
                Current Wood Blend:
              </label>
              <div className="flex flex-wrap gap-2">
                {["Hickory & Cherry", "100% Post Oak", "Apple & Hickory", "Pecan & Peach", "Sugar Maple"].map(
                  (wood) => (
                    <button
                      key={wood}
                      type="button"
                      onClick={() => setActiveWood(wood)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition min-h-[40px] ${
                        activeWood === wood
                          ? "bg-amber-600 text-white shadow-sm"
                          : isDay
                          ? "bg-stone-200 text-stone-700"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {wood}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Chamber Temp Adjuster */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">
                  Chamber Temperature (°F):
                </label>
                <div className="flex items-center gap-2">
                  {[225, 250, 275, 300].map((temp) => (
                    <button
                      key={temp}
                      type="button"
                      onClick={() => setPitTemp(temp)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                        pitTemp === temp
                          ? "bg-[#FF7A00] text-white"
                          : isDay
                          ? "bg-stone-200 text-stone-700"
                          : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {temp}°F
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">
                  Damper Opening: {damperSetting}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={damperSetting}
                  onChange={(e) => setDamperSetting(Number(e.target.value))}
                  className="w-full accent-[#FF7A00]"
                />
              </div>
            </div>

            {/* Split Logger Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleAddWoodSplit(1)}
                className="flex-1 min-h-[48px] rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>🪵 Throw +1 Split</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddWoodSplit(2)}
                className="flex-1 min-h-[48px] rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>🪵🪵 Throw +2 Splits</span>
              </button>
            </div>
          </div>

          {/* Previous Fuel Logs Table */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border ${
              isDay ? "bg-white border-[#E6DDD2]" : "bg-[#121214] border-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm font-display">Today's Firebox Log Timeline</h4>
              <span className="text-xs text-zinc-400 font-mono">
                Total Today: {splitCountToday} Splits Logged
              </span>
            </div>

            <div className="space-y-2">
              {woodLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                    isDay ? "bg-stone-50 border-stone-200" : "bg-black/30 border-zinc-800/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#FF7A00]">{log.time}</span>
                    <span className="font-medium text-zinc-300">
                      Added {log.splitCount} {log.splitCount === 1 ? "split" : "splits"} of {log.woodType}
                    </span>
                  </div>
                  <span className="font-mono text-zinc-400 bg-black/40 px-2 py-0.5 rounded text-[11px]">
                    {log.pitTemp}°F Pit
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


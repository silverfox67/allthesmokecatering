"use client";

import React from "react";

export interface AiRoiScoreboardBannerProps {
  theme?: "day" | "night";
  compact?: boolean;
}

export function AiRoiScoreboardBanner({
  theme = "night",
  compact = false,
}: AiRoiScoreboardBannerProps) {
  const isDay = theme === "day";

  const metrics = [
    { label: "Monthly AI Actions", value: "18", sub: "Reviews, Quotes & Alerts" },
    { label: "Hours Saved", value: "7.5 hrs", sub: "This Month" },
    { label: "Pipeline Handled", value: "$6,450", sub: "Tracked Inquiries" },
    { label: "Safety Mode", value: "1-Tap Approve", sub: "Owner Control Active" },
  ];

  if (compact) {
    return (
      <div className="rounded-2xl bg-[#120F10]/90 border border-[#EA580C]/35 p-3.5 text-left space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7A00]">
            ⚡ AI Employees ROI Scoreboard
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Active
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl bg-[#181416] border border-zinc-800 px-2.5 py-2"
            >
              <span className="block text-[10px] text-zinc-400 font-semibold">
                {m.label}
              </span>
              <span className="block text-sm font-extrabold text-white mt-0.5">
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label="AI Employees ROI Scoreboard"
      className={`mb-6 rounded-2xl p-4 sm:p-5 border transition-colors ${
        isDay
          ? "bg-[#FAF8F5] border-[#D8CEC1] text-[#1C1917] shadow-sm"
          : "bg-zinc-900/80 border-[#EA580C]/35 text-zinc-100"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#EA580C]">
            ⚡ AI Employees ROI Scoreboard
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
            Live Operations
          </span>
        </div>
        <p className={`text-xs ${isDay ? "text-stone-600" : "text-zinc-400"}`}>
          Automated review tracking, quote routing &amp; pitmaster time saved
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`rounded-xl p-3 border ${
              isDay
                ? "bg-white border-[#E4DDD2]"
                : "bg-zinc-950/70 border-zinc-800"
            }`}
          >
            <span
              className={`block text-[10px] font-bold uppercase tracking-wider ${
                isDay ? "text-stone-600" : "text-zinc-400"
              }`}
            >
              {m.label}
            </span>
            <span className="block font-display text-lg sm:text-xl font-extrabold mt-0.5">
              {m.value}
            </span>
            <span
              className={`block text-[11px] mt-0.5 ${
                isDay ? "text-stone-500" : "text-zinc-500"
              }`}
            >
              {m.sub}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

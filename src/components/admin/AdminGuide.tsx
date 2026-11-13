"use client";

import React, { useEffect, useState } from "react";

export interface AdminGuideStep {
  title: string;
  desc: string;
}

interface AdminGuideProps {
  /** Unique id per page/sub-tab, used to remember open/closed state */
  guideId: string;
  theme: "day" | "night";
  title: string;
  /** One short line shown while collapsed */
  summary: string;
  steps: AdminGuideStep[];
  tip?: string;
}

/**
 * Collapsible plain-English "How this page works" bar.
 * Collapsed by default (one slim line) so it never eats screen space;
 * tap to read the steps, tap again to shrink it back down.
 */
export function AdminGuide({ guideId, theme, title, summary, steps, tip }: AdminGuideProps) {
  const isDay = theme === "day";
  const [open, setOpen] = useState(false);

  // Remember if she left it open on this page
  useEffect(() => {
    try {
      setOpen(localStorage.getItem(`ats_guide_${guideId}`) === "open");
    } catch {
      /* ignore */
    }
  }, [guideId]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    try {
      localStorage.setItem(`ats_guide_${guideId}`, next ? "open" : "closed");
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className={`rounded-2xl border mb-4 transition-all duration-300 ease-in-out ${
        isDay ? "bg-white border-[#D8CEC1]" : "bg-[#141210] border-zinc-800"
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="w-full min-h-[48px] flex items-center justify-between gap-3 px-4 py-2.5 text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base shrink-0" aria-hidden>
            💡
          </span>
          <div className="min-w-0">
            <div className={`text-xs font-black ${isDay ? "text-black" : "text-white"}`}>{title}</div>
            {!open && (
              <div className={`text-[11px] truncate ${isDay ? "text-stone-700" : "text-zinc-400"}`}>{summary}</div>
            )}
          </div>
        </div>
        <span
          className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
            isDay
              ? "border-[#C84A0A] text-[#8B3A14] bg-[#FFF4EC]"
              : "border-zinc-700 text-[#FF8C38] bg-zinc-900"
          }`}
        >
          {open ? "Hide ▲" : "How it works ▼"}
        </span>
      </button>

      {open && (
        <div className={`px-4 pb-4 pt-1 space-y-3 border-t ${isDay ? "border-[#E8DFD2]" : "border-zinc-800"}`}>
          <ol className="space-y-2.5 pt-3">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#EA580C] text-white text-[11px] font-black flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <div className={`text-xs font-black ${isDay ? "text-black" : "text-white"}`}>{s.title}</div>
                  <div className={`text-xs leading-relaxed ${isDay ? "text-stone-800" : "text-zinc-300"}`}>{s.desc}</div>
                </div>
              </li>
            ))}
          </ol>
          {tip && (
            <div
              className={`text-xs rounded-xl px-3 py-2 border ${
                isDay
                  ? "bg-amber-50 border-amber-300 text-amber-950"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-300"
              }`}
            >
              <span className="font-black">Pro tip: </span>
              {tip}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


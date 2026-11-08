"use client";

import React, { useState } from "react";
import { useWeekendDrop } from "@/utils/weekend-drop-store";
import { WeekendDropModal } from "@/components/forms/WeekendDropModal";

export function WeekendDropCard() {
  const { drop, isLoaded, isCutoffPassed } = useWeekendDrop();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOptId, setSelectedOptId] = useState<string | undefined>(undefined);

  if (!isLoaded || !drop.isActive) return null;

  const handleOpenModal = (optionId?: string) => {
    setSelectedOptId(optionId);
    setModalOpen(true);
  };

  return (
    <>
      <section
        id="weekend-drop"
        className="pt-4 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-[#121214] border-b border-zinc-800/80 relative z-20 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto">
          
          {/* MAIN CONTAINER WITH ANIMATED ROTATING EMBER BEAM BORDER */}
          <div className="relative p-[2.5px] rounded-3xl overflow-hidden group shadow-[0_0_60px_-15px_rgba(234,88,12,0.4)]">
            
            {/* Rotating Conic Ember Light Beam */}
            <div
              aria-hidden="true"
              className="absolute -inset-[150%] animate-border-beam pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 65deg, #EA580C 115deg, #FF9E2C 135deg, #F59E0B 155deg, #990000 185deg, transparent 245deg, transparent 360deg)",
              }}
            />

            {/* Ambient Blurred Ember Halo */}
            <div
              aria-hidden="true"
              className="absolute -inset-[150%] animate-border-beam blur-xl opacity-60 pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 75deg, #EA580C 120deg, #FF7A00 145deg, #F59E0B 165deg, transparent 210deg, transparent 360deg)",
              }}
            />

            {/* INNER CARD CORE */}
            <div className="relative rounded-[22px] bg-gradient-to-b from-[#181310] via-[#110E0C] to-[#0A0908] p-6 sm:p-8 md:p-9 overflow-hidden z-10">
              
              {/* Subtle Background Radial Ambient */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#EA580C]/10 blur-[90px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 blur-[90px] rounded-full pointer-events-none" />

              {/* TOP HEADER */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#382618] pb-5">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EA580C]/20 border border-[#EA580C]/40 text-[#FF7A00] text-xs font-black uppercase tracking-widest shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span>Live Weekend Pit Drop</span>
                    <span>•</span>
                    <span>Limited Batch Run</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                    {drop.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-stone-300 font-medium">
                    {drop.eventDateLabel} • Hardwood smoked in small artisan batches on Marion&rsquo;s trailer rig.
                  </p>
                </div>

                {/* CUTOFF STATUS BADGE */}
                <div className="shrink-0 bg-black/60 border border-amber-500/30 rounded-2xl p-3 sm:p-3.5 text-left md:text-right">
                  <span className="text-[10px] sm:text-xs uppercase font-extrabold text-amber-400 block tracking-wider">
                    ⚠️ Pre-Order Cutoff Deadline
                  </span>
                  <strong className="text-sm font-black text-white font-mono block mt-0.5">
                    Orders in by {drop.orderCutoffLabel}
                  </strong>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    {isCutoffPassed ? (
                      <span className="text-red-400 font-bold">● Orders Closed for this Batch</span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">● Pre-Orders Open (1st Come, 1st Served)</span>
                    )}
                  </span>
                </div>
              </div>

              {/* 2 DINNER PLATES GRID (TIGHTENED & PUNCHY) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 my-6">
                {drop.options.map((opt, idx) => (
                  <div
                    key={opt.id}
                    className="rounded-2xl bg-black/60 border border-[#3A281C] hover:border-[#EA580C]/80 transition-all duration-300 p-5 flex flex-col justify-between space-y-4 hover:-translate-y-0.5 shadow-lg group/card"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-mono font-bold text-amber-500/90 block mb-0.5">
                            Option #{idx + 1}
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-white group-hover/card:text-[#FF7A00] transition-colors leading-tight">
                            {opt.title}
                          </h3>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-2xl font-black font-mono text-amber-400">
                            ${opt.price}
                          </span>
                          <span className="text-[9.5px] text-stone-400 block font-semibold">
                            Complete Dinner
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed font-normal">
                        {opt.description}
                      </p>

                      {/* Included Sides Chips */}
                      {opt.includedSides && (
                        <div className="pt-2 border-t border-stone-800/80">
                          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
                            ✓ Includes 3 Scratch Sides:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {opt.includedSides.map((side) => (
                              <span
                                key={side}
                                className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-[#251A10] border border-amber-500/20 text-amber-200"
                              >
                                {side}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pre-Order Action Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        disabled={isCutoffPassed}
                        onClick={() => handleOpenModal(opt.id)}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-xs font-bold uppercase tracking-wider transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>🔥 Reserve {opt.title.split(" ")[0]} Dinner (${opt.price}) &rarr;</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* LOGISTICS & ZELLE CALLOUT FOOTER */}
              <div className="rounded-2xl bg-[#1A140F]/90 border border-amber-500/25 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-300">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-1 text-white font-semibold text-xs">
                    <span>📍 Pickup: <strong>{drop.pickupTime} on Mason Ave</strong></span>
                    <span>•</span>
                    <span>🚚 Delivery: <strong>After {drop.deliveryStartTime} for fee</strong></span>
                  </div>
                  <p className="text-[10.5px] text-amber-200/85">
                    ⚡ Pre-paid customers receive 1st priority. Once the pit hits capacity, orders close immediately.
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleOpenModal()}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-stone-900 border border-stone-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm text-center"
                  >
                    View Details &rarr;
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      <WeekendDropModal
        drop={drop}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preSelectedOptionId={selectedOptId}
      />
    </>
  );
}


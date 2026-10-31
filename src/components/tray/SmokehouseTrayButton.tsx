"use client";

import React from "react";
import { useOrderTray } from "@/context/OrderTrayContext";

export function SmokehouseTrayButton() {
  const { totalItemCount, subtotal, openTray } = useOrderTray();

  if (totalItemCount === 0) return null;

  return (
    <button
      onClick={openTray}
      type="button"
      className="fixed bottom-6 right-6 z-40 bg-[#0F172A] hover:bg-[#1E293B] text-white border-2 border-[#EA580C] px-5 py-3 rounded-full shadow-[0_4px_25px_rgba(234,88,12,0.45)] hover:shadow-[0_4px_30px_rgba(234,88,12,0.65)] transition-all flex items-center gap-3 group animate-in slide-in-from-bottom-5 duration-300"
      aria-label="Open Smokehouse Order Tray"
    >
      <span className="text-xl group-hover:scale-110 transition-transform">🍖</span>
      <div className="text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Order Tray
          </span>
          <span className="text-[11px] font-mono font-black bg-[#EA580C] text-white px-2 py-0.2 rounded-full">
            {totalItemCount}
          </span>
        </div>
        <p className="text-xs font-mono font-bold text-[#F59E0B]">
          ${subtotal.toFixed(2)}
        </p>
      </div>
      <span className="text-xs text-neutral-400 group-hover:translate-x-1 transition-transform">
        &rarr;
      </span>
    </button>
  );
}


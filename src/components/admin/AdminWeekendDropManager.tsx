"use client";

import React, { useState } from "react";
import {
  useWeekendDrop,
  saveStoredWeekendDrop,
  DEFAULT_WEEKEND_DROP,
  getStoredDropOrders,
} from "@/utils/weekend-drop-store";
import { WeekendDrop } from "@/types/weekend-drop";
import { AdminGuide } from "./AdminGuide";

export interface AdminWeekendDropManagerProps {
  theme?: "day" | "night" | "dark" | "butcher-paper";
  /** "current" (drop editor) | "popups" (live preview + pre-orders). Defaults to "current". */
  subTab?: string;
}

export function AdminWeekendDropManager({ theme = "night", subTab }: AdminWeekendDropManagerProps) {
  const activeTab = subTab === "popups" ? "popups" : "current";
  const isDay = theme === "day" || theme === "butcher-paper";
  const { drop, isCutoffPassed } = useWeekendDrop();
  const [formData, setFormData] = useState<WeekendDrop>({ ...drop });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedReviewText, setCopiedReviewText] = useState(false);
  const orders = getStoredDropOrders();

  const handleToggleActive = () => {
    const updated = { ...formData, isActive: !formData.isActive };
    setFormData(updated);
    saveStoredWeekendDrop(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredWeekendDrop(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset to default Saturday Smokehouse template?")) {
      setFormData(DEFAULT_WEEKEND_DROP);
      saveStoredWeekendDrop(DEFAULT_WEEKEND_DROP);
    }
  };

  const handleCopyForWebTeam = () => {
    const summary = `HEY TRIDENT TEAM — NEW WEEKEND DROP TO REVIEW:
Title: ${formData.title}
Event Date: ${formData.eventDateLabel}
Orders Close: ${formData.orderCutoffLabel}
Option #1: ${formData.options[0]?.title} - $${formData.options[0]?.price}
Option #2: ${formData.options[1]?.title} - $${formData.options[1]?.price}
Pickup: ${formData.pickupTime} at ${formData.pickupLocation}
Zelle: ${formData.zellePhone} / ${formData.zelleEmail}
Notes: ${formData.notice}`;

    navigator.clipboard.writeText(summary);
    setCopiedReviewText(true);
    setTimeout(() => setCopiedReviewText(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {activeTab === "current" ? (
        <AdminGuide
          guideId="weekend-current"
          theme={isDay ? "day" : "night"}
          title="How to post a weekend dinner drop"
          summary="Set up this Saturday's plates, then flip it live."
          steps={[
            { title: "Fill in the basics", desc: "Give the drop a headline, the date, when orders close, and where and when folks pick up." },
            { title: "Set your plates and prices", desc: "Name each dinner option, write what comes with it, and set the price." },
            { title: "Add your Zelle info", desc: "Put in the phone and email customers should send payment to." },
            { title: "Save and go live", desc: "Hit Save & Publish, and make sure the Live switch at the top is on so customers can see it." },
          ]}
          tip="Not ready yet? Leave the switch on Draft and nothing shows on the website."
        />
      ) : (
        <AdminGuide
          guideId="weekend-popups"
          theme={isDay ? "day" : "night"}
          title="Checking your pop-up dinner preview and orders"
          summary="See what customers see, and who has ordered."
          steps={[
            { title: "Look at the preview card", desc: "This is how your drop looks on the website. Check the headline, date and prices read right." },
            { title: "Check the published tag", desc: "PUBLISHED means customers can order. DRAFT means it is hidden." },
            { title: "Read the pre-orders", desc: "Each order shows the name, phone, pickup or delivery, and what they ordered." },
          ]}
          tip="Use the pre-order list as your prep sheet before Saturday's cook."
        />
      )}

      {/* HEADER SECTION */}
      {activeTab === "current" && (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30 mb-1">
            <span>🔥 Drop Publisher</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black font-display tracking-tight ${isDay ? "text-stone-900" : "text-white"}`}>
            Weekend Drops &amp; Dinner Pop-Up Manager
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${isDay ? "text-stone-600" : "text-stone-400"}`}>
            Configure limited-run Saturday plate pre-orders with Zelle reservations &amp; automated cutoff deadlines.
          </p>
        </div>

        {/* LIVE SWITCH TOGGLE */}
        <div className="flex items-center gap-3 bg-black/40 p-2.5 rounded-2xl border border-stone-800 shrink-0">
          <span className="text-xs font-bold text-stone-300">
            {formData.isActive ? "🟢 Live on Website" : "⚪ Draft (Hidden)"}
          </span>
          <button
            type="button"
            onClick={handleToggleActive}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              formData.isActive ? "bg-emerald-600" : "bg-stone-700"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                formData.isActive ? "left-6.5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>
      )}

      {/* TWO COLUMN GRID: EDITOR ON LEFT, LIVE PREVIEW ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: EDITOR FORM (7 Cols) */}
        {activeTab === "current" && (
        <form onSubmit={handleSave} className="lg:col-span-12 space-y-6">
          
          {/* 1. DROP BASICS */}
          <div className={`p-5 rounded-2xl border ${isDay ? "bg-white border-stone-300" : "bg-[#141210] border-zinc-800"} space-y-4`}>
            <h3 className={`text-xs font-black uppercase tracking-wider ${isDay ? "text-stone-900" : "text-amber-400"}`}>
              1. Drop Title &amp; Schedule
            </h3>

            <div>
              <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                Drop Headline:
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xs h-10 px-3 rounded-xl bg-black/50 border border-stone-700 text-white font-bold focus:border-[#EA580C] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                  Event Date Label:
                </label>
                <input
                  type="text"
                  value={formData.eventDateLabel}
                  onChange={(e) => setFormData({ ...formData, eventDateLabel: e.target.value })}
                  placeholder="e.g. This Saturday, November 14th"
                  className="w-full text-xs h-10 px-3 rounded-xl bg-black/50 border border-stone-700 text-white focus:border-[#EA580C] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                  Pre-Order Cutoff Deadline:
                </label>
                <input
                  type="text"
                  value={formData.orderCutoffLabel}
                  onChange={(e) => setFormData({ ...formData, orderCutoffLabel: e.target.value })}
                  placeholder="e.g. Wednesday, Nov 11 (11:59 PM)"
                  className="w-full text-xs h-10 px-3 rounded-xl bg-black/50 border border-stone-700 text-white focus:border-[#EA580C] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                  Pickup Location &amp; Time:
                </label>
                <input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full text-xs h-10 px-3 rounded-xl bg-black/50 border border-stone-700 text-white focus:border-[#EA580C] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                  Pickup Ready Time:
                </label>
                <input
                  type="text"
                  value={formData.pickupTime}
                  onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                  placeholder="e.g. 4:00 PM"
                  className="w-full text-xs h-10 px-3 rounded-xl bg-black/50 border border-stone-700 text-white focus:border-[#EA580C] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. DINNER OPTIONS */}
          <div className={`p-5 rounded-2xl border ${isDay ? "bg-white border-stone-300" : "bg-[#141210] border-zinc-800"} space-y-4`}>
            <h3 className={`text-xs font-black uppercase tracking-wider ${isDay ? "text-stone-900" : "text-amber-400"}`}>
              2. Dinner Options &amp; Pricing
            </h3>

            {formData.options.map((opt, idx) => (
              <div key={opt.id} className="p-4 rounded-xl bg-black/40 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">
                    Option #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-stone-400 font-bold">$</span>
                    <input
                      type="number"
                      value={opt.price}
                      onChange={(e) => {
                        const updated = [...formData.options];
                        updated[idx].price = parseInt(e.target.value, 10) || 0;
                        setFormData({ ...formData, options: updated });
                      }}
                      className="w-16 text-xs h-8 px-2 rounded-lg bg-black border border-stone-700 text-white font-mono font-bold text-right"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={opt.title}
                    onChange={(e) => {
                      const updated = [...formData.options];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, options: updated });
                    }}
                    placeholder="Plate Title"
                    className="w-full text-xs h-9 px-3 rounded-lg bg-black/60 border border-stone-700 text-white font-bold"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={opt.description}
                    onChange={(e) => {
                      const updated = [...formData.options];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, options: updated });
                    }}
                    placeholder="Description & sides..."
                    className="w-full text-xs p-2.5 rounded-lg bg-black/60 border border-stone-700 text-stone-200"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 3. ZELLE RECIPIENT SETTINGS */}
          <div className={`p-5 rounded-2xl border ${isDay ? "bg-white border-stone-300" : "bg-[#141210] border-zinc-800"} space-y-4`}>
            <h3 className={`text-xs font-black uppercase tracking-wider ${isDay ? "text-stone-900" : "text-amber-400"}`}>
              3. Zelle Payment Recipient Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                  Zelle Mobile Phone:
                </label>
                <input
                  type="text"
                  value={formData.zellePhone}
                  onChange={(e) => setFormData({ ...formData, zellePhone: e.target.value })}
                  className="w-full text-xs h-10 px-3 rounded-xl bg-black/50 border border-stone-700 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                  Zelle Email:
                </label>
                <input
                  type="email"
                  value={formData.zelleEmail}
                  onChange={(e) => setFormData({ ...formData, zelleEmail: e.target.value })}
                  className="w-full text-xs h-10 px-3 rounded-xl bg-black/50 border border-stone-700 text-white font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
            >
              💾 Save &amp; Publish Live
            </button>

            <button
              type="button"
              onClick={handleCopyForWebTeam}
              className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition cursor-pointer"
            >
              {copiedReviewText ? "✓ Copied Draft for Web Team" : "📋 Copy Draft for Web Team"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="py-3 px-4 rounded-xl bg-transparent hover:bg-white/5 text-stone-500 hover:text-stone-400 text-xs font-semibold transition cursor-pointer"
            >
              ↺ Reset
            </button>

            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-bold animate-pulse">
                ✓ Live Website Updated!
              </span>
            )}
          </div>

        </form>
        )}

        {/* RIGHT COLUMN: LIVE CARD PREVIEW */}
        {activeTab === "popups" && (
        <div className="lg:col-span-12 space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">
              Live Card Preview
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${formData.isActive ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-stone-800 text-stone-400"}`}>
              {formData.isActive ? "PUBLISHED" : "DRAFT"}
            </span>
          </div>

          {/* THE PREVIEW CARD */}
          <div className="rounded-3xl bg-gradient-to-b from-[#181310] to-[#0A0908] border-2 border-amber-500/40 p-5 space-y-5 shadow-2xl text-stone-200 text-xs">
            <div className="space-y-1 border-b border-[#382618] pb-3">
              <span className="text-[10px] font-black uppercase text-[#FF7A00] tracking-wider">
                ★ Exclusive Weekend Smokehouse Drop ★
              </span>
              <h4 className="text-lg font-black text-white font-display">
                {formData.title}
              </h4>
              <p className="text-[11px] text-stone-400">
                {formData.eventDateLabel}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30 text-[11px]">
              <span className="text-amber-400 font-bold block">
                ⚠️ Orders close {formData.orderCutoffLabel}
              </span>
              <span className="text-stone-400">
                Pickup @ {formData.pickupTime} on Mason • Delivery available
              </span>
            </div>

            {/* Dishes */}
            <div className="space-y-3">
              {formData.options.map((opt, i) => (
                <div key={opt.id} className="p-3 rounded-xl bg-black/40 border border-stone-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-white text-xs font-bold">
                      #{i + 1} {opt.title}
                    </strong>
                    <span className="text-amber-400 font-mono font-black text-sm">
                      ${opt.price}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center text-[10px] text-stone-400">
              ⚡ Pre-paid customers receive 1st priority via Zelle.
            </div>
          </div>

          {/* RECENT DROP PRE-ORDERS */}
          <div className={`p-4 rounded-2xl border ${isDay ? "bg-white border-stone-300" : "bg-[#141210] border-zinc-800"} space-y-3 mt-6`}>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                📦 Drop Pre-Orders ({orders.length})
              </h4>
              <span className="text-[10px] text-stone-400">Auto-synced</span>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-stone-500 py-3 text-center">
                No dinner drop pre-orders received yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-2.5 rounded-xl bg-black/50 border border-stone-800 text-[11px] space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-white">
                        {ord.customerName} (#{ord.ticketNumber})
                      </strong>
                      <span className="text-amber-400 font-mono font-bold">
                        ${ord.total}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400">
                      📞 {ord.customerPhone} • {ord.fulfillmentType.toUpperCase()}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold">
                      {ord.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
        )}

      </div>

    </div>
  );
}


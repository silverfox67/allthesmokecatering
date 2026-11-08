"use client";

import React, { useState } from "react";
import { WeekendDrop, WeekendDropOption } from "@/types/weekend-drop";
import { saveDropOrder } from "@/utils/weekend-drop-store";

interface WeekendDropModalProps {
  drop: WeekendDrop;
  isOpen: boolean;
  onClose: () => void;
  preSelectedOptionId?: string;
}

export function WeekendDropModal({
  drop,
  isOpen,
  onClose,
  preSelectedOptionId,
}: WeekendDropModalProps) {
  // Quantities for each option
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    drop.options.forEach((opt) => {
      init[opt.id] = opt.id === preSelectedOptionId ? 1 : 0;
    });
    // If none pre-selected, default first item to 1
    if (!preSelectedOptionId && drop.options.length > 0) {
      init[drop.options[0].id] = 1;
    }
    return init;
  });

  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{
    ticketNumber: string;
    total: number;
    itemsSummary: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const DELIVERY_FEE = 15; // Standard base drop delivery fee
  const subtotal = drop.options.reduce((sum, opt) => {
    return sum + (quantities[opt.id] || 0) * opt.price;
  }, 0);
  const totalItemCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const total = subtotal + (fulfillment === "delivery" ? DELIVERY_FEE : 0);

  const updateQuantity = (optionId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[optionId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [optionId]: next };
    });
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalItemCount === 0) {
      alert("Please select at least 1 dinner plate.");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Please provide your name and mobile phone.");
      return;
    }

    setIsSubmitting(true);

    const ticketNumber = `ATS-${Math.floor(1000 + Math.random() * 9000)}`;
    const items = drop.options
      .filter((opt) => (quantities[opt.id] || 0) > 0)
      .map((opt) => ({
        optionId: opt.id,
        title: opt.title,
        quantity: quantities[opt.id],
        price: opt.price,
      }));

    const itemsSummary = items
      .map((i) => `${i.quantity}x ${i.title}`)
      .join(", ");

    const orderPayload = {
      id: `drop-order-${Date.now()}`,
      ticketNumber,
      dropId: drop.id,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      fulfillmentType: fulfillment,
      deliveryAddress: fulfillment === "delivery" ? deliveryAddress.trim() : undefined,
      deliveryFee: fulfillment === "delivery" ? DELIVERY_FEE : 0,
      items,
      subtotal,
      total,
      paymentMethod: "zelle" as const,
      paymentStatus: "awaiting_zelle" as const,
      orderNotes: orderNotes.trim(),
      createdAt: new Date().toISOString(),
    };

    saveDropOrder(orderPayload);

    // Optional background dispatch to /api/orders
    try {
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      }).catch(() => {});
    } catch (_) {}

    setIsSubmitting(false);
    setSubmittedTicket({
      ticketNumber,
      total,
      itemsSummary,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-6 bg-gradient-to-b from-[#161412] to-[#0D0B0A] border border-[#3D2C20] rounded-3xl shadow-2xl overflow-hidden text-stone-100">
        
        {/* HEADER BAR */}
        <div className="p-5 sm:p-6 border-b border-[#291E16] flex items-center justify-between bg-black/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EA580C]/20 text-[#FF7A00] text-[10px] sm:text-xs font-black uppercase tracking-widest border border-[#EA580C]/30 mb-1">
              <span>🔥 Limited Smokehouse Batch</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-display">
              {submittedTicket ? "Reservation Locked In!" : "Pre-Order Saturday Dinner"}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {drop.eventDateLabel} • 1st Come, 1st Served
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center text-lg font-bold transition cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* CONTENT STAGE */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto space-y-6">

          {submittedTicket ? (
            /* STEP 2: VERIFIED ZELLE INSTRUCTION TICKET */
            <div className="space-y-6 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-400 text-3xl flex items-center justify-center mx-auto shadow-lg">
                ✓
              </div>

              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                  Your Reservation Ticket
                </span>
                <h4 className="text-3xl sm:text-4xl font-mono font-black text-[#FF7A00] tracking-wider mt-1">
                  #{submittedTicket.ticketNumber}
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 mt-1">
                  Reserved for <strong>{customerName}</strong> ({submittedTicket.itemsSummary})
                </p>
              </div>

              {/* ZELLE PAYMENT INSTRUCTION CARD */}
              <div className="rounded-2xl border-2 border-amber-500/60 bg-[#1E1710] p-5 text-left space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h5 className="font-black text-white text-base">
                        Complete via Zelle to Secure Priority
                      </h5>
                      <p className="text-[11px] text-amber-200/80">
                        Pre-paid orders receive 1st smoker pull priority.
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Due</span>
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      ${submittedTicket.total}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-stone-200">
                  {/* Phone Option */}
                  <div className="p-3 rounded-xl bg-black/50 border border-stone-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">
                        Zelle Phone (Marion Bolden):
                      </span>
                      <strong className="text-sm font-mono text-white">
                        {drop.zellePhone}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(drop.zellePhone.replace(/[^0-9]/g, ""), "phone")}
                      className="px-3 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold transition shadow-sm cursor-pointer shrink-0"
                    >
                      {copiedField === "phone" ? "✓ Copied" : "Copy Phone"}
                    </button>
                  </div>

                  {/* Email Option */}
                  <div className="p-3 rounded-xl bg-black/50 border border-stone-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">
                        Zelle Email:
                      </span>
                      <strong className="text-xs sm:text-sm font-mono text-white break-all">
                        {drop.zelleEmail}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(drop.zelleEmail, "email")}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition shadow-sm cursor-pointer shrink-0"
                    >
                      {copiedField === "email" ? "✓ Copied" : "Copy Email"}
                    </button>
                  </div>

                  {/* Memo Note Required */}
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400/90 block">
                        ⚠️ Please include in Zelle memo:
                      </span>
                      <strong className="font-mono text-white">
                        Ticket #{submittedTicket.ticketNumber} - {customerName}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(`Ticket #${submittedTicket.ticketNumber} - ${customerName}`, "memo")}
                      className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 hover:bg-amber-500/30 transition cursor-pointer shrink-0"
                    >
                      {copiedField === "memo" ? "✓ Copied" : "Copy Note"}
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-stone-400 leading-relaxed">
                  📍 <strong>Pickup Info:</strong> Ready at {drop.pickupTime} on Mason Ave (Chicago). Marion will text exact pickup coordination to <strong>{customerPhone}</strong> once Zelle is recorded.
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`sms:7737079988?body=${encodeURIComponent(
                    `Hi Marion! I just reserved Ticket #${submittedTicket.ticketNumber} for ${customerName} (${submittedTicket.itemsSummary}). Total: $${submittedTicket.total}. Sending via Zelle now!`
                  )}`}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
                >
                  <span>💬 Text Marion My Zelle Confirmation</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-3.5 px-6 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs sm:text-sm font-bold transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* STEP 1: DINNER SELECTION & DETAILS FORM */
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* 1. DINNER OPTIONS SELECTOR */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center justify-between">
                  <span>1. Choose Your Dinner Plates</span>
                  <span className="text-[11px] text-stone-400 font-normal">
                    Includes all 3 scratch sides
                  </span>
                </label>

                <div className="space-y-2.5">
                  {drop.options.map((opt) => {
                    const qty = quantities[opt.id] || 0;
                    return (
                      <div
                        key={opt.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                          qty > 0
                            ? "bg-[#251A10] border-[#EA580C] shadow-md"
                            : "bg-black/40 border-stone-800 hover:border-stone-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-white text-sm sm:text-base">
                                {opt.title}
                              </h4>
                              {opt.badge && (
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {opt.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-400 leading-relaxed">
                              {opt.description}
                            </p>
                            <div className="text-amber-400 font-bold text-sm pt-1">
                              ${opt.price} <span className="text-xs text-stone-400 font-normal">/ dinner plate</span>
                            </div>
                          </div>

                          {/* Quantity Controls (min 48px touch targets) */}
                          <div className="flex items-center gap-2 shrink-0 bg-black/60 rounded-xl p-1 border border-stone-800">
                            <button
                              type="button"
                              onClick={() => updateQuantity(opt.id, -1)}
                              className="w-10 h-10 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-base font-bold flex items-center justify-center transition cursor-pointer select-none"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold text-sm text-white font-mono">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(opt.id, 1)}
                              className="w-10 h-10 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white text-base font-bold flex items-center justify-center transition cursor-pointer select-none"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. FULFILLMENT CHOICE */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-amber-400 block">
                  2. Pickup or Heated Delivery
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFulfillment("pickup")}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      fulfillment === "pickup"
                        ? "bg-[#251A10] border-[#EA580C] text-white shadow-md ring-1 ring-[#EA580C]"
                        : "bg-black/40 border-stone-800 text-stone-400 hover:text-white"
                    }`}
                  >
                    <span className="text-lg block mb-1">📍</span>
                    <strong className="text-xs sm:text-sm block text-white font-bold">
                      Pickup @ 4:00 PM
                    </strong>
                    <span className="text-[11px] text-emerald-400 font-semibold block">
                      Free (Mason Ave Hub)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillment("delivery")}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      fulfillment === "delivery"
                        ? "bg-[#251A10] border-[#EA580C] text-white shadow-md ring-1 ring-[#EA580C]"
                        : "bg-black/40 border-stone-800 text-stone-400 hover:text-white"
                    }`}
                  >
                    <span className="text-lg block mb-1">🚚</span>
                    <strong className="text-xs sm:text-sm block text-white font-bold">
                      Delivery After 5:00 PM
                    </strong>
                    <span className="text-[11px] text-amber-300 font-semibold block">
                      +${DELIVERY_FEE} Heated Courier
                    </span>
                  </button>
                </div>

                {fulfillment === "delivery" && (
                  <div className="pt-2 animate-fade-in">
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter Chicago delivery street address & ZIP code..."
                      className="w-full text-xs h-11 px-3.5 rounded-xl bg-black/60 border border-stone-700 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                )}
              </div>

              {/* 3. CONTACT INFO */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-amber-400 block">
                  3. Your Contact Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full text-xs h-11 px-3 rounded-xl bg-black/60 border border-stone-700 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                      Mobile Phone (for Text Updates) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(773) 000-0000"
                      className="w-full text-xs h-11 px-3 rounded-xl bg-black/60 border border-stone-700 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                    Email Address (for Receipt)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full text-xs h-11 px-3 rounded-xl bg-black/60 border border-stone-700 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              {/* SUMMARY & ORDER SUBMIT BUTTON */}
              <div className="pt-3 border-t border-[#291E16] space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-300">
                  <span>Dinners Subtotal ({totalItemCount} plates):</span>
                  <span className="font-mono font-bold text-white">${subtotal}</span>
                </div>
                {fulfillment === "delivery" && (
                  <div className="flex items-center justify-between text-xs text-stone-300">
                    <span>Heated Courier Delivery:</span>
                    <span className="font-mono font-bold text-amber-300">+${DELIVERY_FEE}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base font-bold text-white pt-1 border-t border-stone-800">
                  <span>Total Amount:</span>
                  <span className="font-mono text-xl text-amber-400">${total}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || totalItemCount === 0}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-sm font-bold uppercase tracking-wider transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Reserving Ticket...</span>
                  ) : (
                    <>
                      <span>Reserve Dinner &amp; Get Zelle Instructions &rarr;</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-stone-400">
                  ⚡ Pre-paid orders get 1st smoker pull priority. Orders close {drop.orderCutoffLabel}.
                </p>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}


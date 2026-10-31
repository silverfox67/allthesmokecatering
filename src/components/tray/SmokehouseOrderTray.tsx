"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useOrderTray } from "@/context/OrderTrayContext";
import { CalendarDatePicker } from "@/components/forms/CalendarDatePicker";

// Chicago delivery zones
const TIER_1_ZIPS = new Set([
  "60634", "60630", "60631", "60641", "60656", "60706", "60707",
  "60018", "60068", "60131", "60171", "60639", "60646", "60638",
  "60176", "6025", "60618", "60076", "60714", "60651"
]);

const TIER_2_ZIPS = new Set([
  "60601", "60602", "60603", "60604", "60605", "60606", "60607",
  "60610", "60611", "60612", "60614", "60622", "60642", "60647",
  "60654", "60657", "60661", "60201", "60202", "60077", "60173",
  "60193", "60148", "60301", "60302", "60304", "60016", "60053",
  "60025", "60101", "60126", "60181", "60521", "60523", "60137",
  "60004", "60005", "60008", "60062", "60091"
]);

export function SmokehouseOrderTray() {
  const {
    trayItems,
    isOpen,
    closeTray,
    updateQuantity,
    removeItem,
    clearTray,
    totalItemCount,
    subtotal,
  } = useOrderTray();

  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [deliveryZip, setDeliveryZip] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryZoneLabel, setDeliveryZoneLabel] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("1:00 PM");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  // Handle ZIP code change for delivery calculation
  const handleZipChange = (zip: string) => {
    setDeliveryZip(zip);
    const clean = zip.trim();
    if (clean.length === 5) {
      if (TIER_1_ZIPS.has(clean)) {
        setDeliveryFee(35);
        setDeliveryZoneLabel("Zone 1: Local Drop-Off (+$35)");
      } else if (TIER_2_ZIPS.has(clean)) {
        setDeliveryFee(65);
        setDeliveryZoneLabel("Zone 2: Extended Metro (+$65)");
      } else if (clean.startsWith("60") || clean.startsWith("61") || clean.startsWith("46")) {
        setDeliveryFee(115);
        setDeliveryZoneLabel("Zone 3: Outer Metro / Long-Haul (+$115)");
      } else {
        setDeliveryFee(150);
        setDeliveryZoneLabel("Custom Destination Delivery (+$150)");
      }
    } else {
      setDeliveryFee(0);
      setDeliveryZoneLabel("");
    }
  };

  const finalTotal = subtotal + (fulfillment === "delivery" ? deliveryFee : 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (trayItems.length === 0) {
      setErrorMessage("Your tray is empty.");
      return;
    }
    if (!customerName || customerName.trim().length < 2) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!customerPhone || customerPhone.trim().length < 7) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }
    if (!customerEmail || !customerEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (fulfillment === "delivery" && (!deliveryAddress || deliveryAddress.trim().length < 5)) {
      setErrorMessage("Please enter your complete delivery street address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        eventDate: eventDate || "Date Pending",
        guestCount: totalItemCount * 5, // rough estimate
        packageName: `Smokehouse Tray Order (${totalItemCount} items)`,
        serviceStyle: fulfillment === "pickup" ? "Customer Commissary Pickup" : `Heated Drop-Off Delivery (${deliveryZoneLabel || "Zone Pending"})`,
        deliveryAddress: fulfillment === "delivery" ? `${deliveryAddress}, ZIP ${deliveryZip}` : "Commissary Pickup: 5400 W Belmont Ave, Chicago",
        selectedProteins: trayItems.map(
          (item) => `${item.name} (${item.selectedOption || "Standard"}) x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
        ),
        notes: `Ready Time: ${eventTime}. Subtotal: $${subtotal.toFixed(2)}. Delivery Fee: $${deliveryFee}. Total: $${finalTotal.toFixed(2)}. Notes: ${orderNotes}`,
        client: "allthesmoke",
      };

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit order request.");
      }

      setTicketId(data.ticketId || "ATS-ORDER-" + Math.floor(1000 + Math.random() * 9000));
      setSubmitSuccess(true);
      clearTray();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please call (773) 707-9988.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        onClick={closeTray}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-[#111317] border-l border-white/10 text-neutral-100 flex flex-col shadow-2xl relative">
          
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-white/10 bg-[#15181E] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[#EA580C] text-sm">🔥</span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#F59E0B]">
                  All The Smoke BBQ
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-0.5 flex items-center gap-2">
                <span>Smokehouse Order Tray</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                  {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
                </span>
              </h3>
            </div>
            <button
              onClick={closeTray}
              type="button"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
              aria-label="Close Tray"
            >
              ✕
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* SUCCESS STATE */}
            {submitSuccess ? (
              <div className="py-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center text-3xl mx-auto">
                  ✓
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#F59E0B]">
                    Order Request Received
                  </span>
                  <h4 className="text-2xl font-black text-white mt-1">
                    We&rsquo;re Firing Up The Pit!
                  </h4>
                  <p className="text-sm font-mono font-bold text-neutral-300 mt-1">
                    Ticket #{ticketId}
                  </p>
                </div>

                <div className="bg-[#181B22] p-5 rounded-2xl border border-white/10 text-left text-xs sm:text-sm space-y-2.5">
                  <p className="text-neutral-300">
                    Marion Bolden and the pit crew have received your kitchen dispatch ticket. We review all weekend smokehouse orders within 12 hours.
                  </p>
                  <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
                    <p className="font-bold text-white">💰 50% Deposit &amp; Payment Options:</p>
                    <p className="text-neutral-400 text-xs">
                      • <strong>Zelle:</strong> Send 50% deposit to <span className="text-[#F59E0B] font-mono font-bold">773-707-9988</span> (memo: #{ticketId}).
                    </p>
                    <p className="text-neutral-400 text-xs">
                      • <strong>Card / Apple Pay:</strong> Marion will text or email your official invoice link.
                    </p>
                  </div>
                  <p className="text-neutral-400 text-xs pt-1">
                    Direct commissary line: <strong className="text-white">(773) 707-9988</strong>
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSubmitSuccess(false);
                    closeTray();
                  }}
                  className="w-full py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm transition"
                >
                  Done
                </button>
              </div>
            ) : trayItems.length === 0 ? (
              /* EMPTY STATE */
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-2xl flex items-center justify-center mx-auto text-neutral-400">
                  🍖
                </div>
                <h4 className="text-lg font-bold text-white">Your tray is currently empty</h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Browse the Pitmaster Menu or Weekly Chalkboard and click &ldquo;Order / Add to Tray&rdquo; to build your game-day feast!
                </p>
                <button
                  onClick={closeTray}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                >
                  Browse Smokehouse Menu
                </button>
              </div>
            ) : (
              /* ACTIVE TRAY CONTENTS */
              <>
                {/* 1. Item List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="font-mono uppercase tracking-wider">Items in Tray</span>
                    <button
                      onClick={clearTray}
                      type="button"
                      className="text-red-400 hover:text-red-300 text-[11px] underline"
                    >
                      Clear All
                    </button>
                  </div>

                  {trayItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#171A20] p-3.5 rounded-xl border border-white/10 flex items-center justify-between gap-3"
                    >
                      {/* Image Thumbnail */}
                      {item.image && (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-stone-900 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-sm text-white truncate">{item.name}</h5>
                        {item.selectedOption && (
                          <p className="text-[11px] font-mono text-[#F59E0B]">
                            {item.selectedOption}
                          </p>
                        )}
                        <p className="text-xs font-mono font-bold text-neutral-300 mt-0.5">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-black/40 rounded-lg p-1 border border-white/10 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-500 hover:text-red-400 p-1 text-sm transition"
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* 2. Fulfillment Options (Pickup vs. Delivery) */}
                <div className="bg-[#171A20] p-4 rounded-xl border border-white/10 space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                    Fulfillment Method
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFulfillment("pickup");
                        setDeliveryFee(0);
                      }}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        fulfillment === "pickup"
                          ? "bg-[#EA580C]/15 border-[#EA580C] text-white"
                          : "bg-black/30 border-white/10 text-neutral-400 hover:text-white"
                      }`}
                    >
                      <span className="font-bold text-xs sm:text-sm">🏢 Pickup (Free)</span>
                      <span className="text-[10px] text-neutral-400 mt-1">
                        5400 W Belmont Ave
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillment("delivery")}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        fulfillment === "delivery"
                          ? "bg-[#EA580C]/15 border-[#EA580C] text-white"
                          : "bg-black/30 border-white/10 text-neutral-400 hover:text-white"
                      }`}
                    >
                      <span className="font-bold text-xs sm:text-sm">🚚 Heated Drop-Off</span>
                      <span className="text-[10px] text-neutral-400 mt-1">
                        Chicagoland delivery
                      </span>
                    </button>
                  </div>

                  {fulfillment === "delivery" && (
                    <div className="pt-2 space-y-2">
                      <label className="text-xs text-neutral-300 block">
                        Enter Delivery ZIP Code:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={5}
                          value={deliveryZip}
                          onChange={(e) => handleZipChange(e.target.value)}
                          placeholder="e.g. 60634"
                          className="w-28 px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#EA580C]"
                        />
                        {deliveryZoneLabel && (
                          <span className="text-xs font-mono text-emerald-400 flex items-center">
                            ✓ {deliveryZoneLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Event Date & Time */}
                <div className="bg-[#171A20] p-4 rounded-xl border border-white/10 space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                    Preferred Date &amp; Time (Min 48h Notice)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <CalendarDatePicker
                        value={eventDate}
                        onChange={setEventDate}
                        theme="dark"
                        placeholder="Select Date..."
                      />
                    </div>
                    <div>
                      <select
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full h-11 px-3 bg-[#111317] border border-white/20 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#EA580C]"
                      >
                        <option value="11:30 AM">11:30 AM (Lunch)</option>
                        <option value="12:30 PM">12:30 PM (Lunch)</option>
                        <option value="2:00 PM">2:00 PM (Afternoon)</option>
                        <option value="4:00 PM">4:00 PM (Early Dinner)</option>
                        <option value="5:30 PM">5:30 PM (Dinner Rush)</option>
                        <option value="7:00 PM">7:00 PM (Evening)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Customer Contact Details */}
                <div className="bg-[#171A20] p-4 rounded-xl border border-white/10 space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                    Contact &amp; Delivery Information
                  </span>

                  <div className="space-y-2.5">
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-black/40 border border-white/15 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#EA580C]"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2.5 bg-black/40 border border-white/15 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#EA580C]"
                      />
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3 py-2.5 bg-black/40 border border-white/15 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    {fulfillment === "delivery" && (
                      <input
                        type="text"
                        placeholder="Delivery Street Address *"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-3 py-2.5 bg-black/40 border border-white/15 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#EA580C]"
                      />
                    )}

                    <textarea
                      rows={2}
                      placeholder="Special instructions (e.g. extra sauce, gate code, serving tongs)..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-950/80 border border-red-700/60 rounded-xl text-xs text-red-200">
                    ⚠ {errorMessage}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Drawer Footer (Summary & Action) */}
          {!submitSuccess && trayItems.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-[#15181E] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Food Subtotal ({totalItemCount} items)</span>
                  <span className="font-mono font-bold text-white">${subtotal.toFixed(2)}</span>
                </div>
                {fulfillment === "delivery" && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Heated Drop-Off Delivery</span>
                    <span className="font-mono font-bold text-[#F59E0B]">
                      {deliveryFee > 0 ? `+$${deliveryFee}.00` : "Enter ZIP"}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-white">Estimated Order Total</span>
                  <span className="text-xl font-black font-mono text-[#EA580C]">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin text-lg">⏳</span>
                    <span>Dispatching Order to Marion...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Smokehouse Order</span>
                    <span>&rarr;</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-neutral-400">
                50% deposit required upon confirmation via Zelle or Card. No immediate charge.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

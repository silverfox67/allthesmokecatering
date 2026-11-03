"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useOrderTray } from "@/context/OrderTrayContext";
import { CalendarDatePicker } from "@/components/forms/CalendarDatePicker";
import { useLiveSmokerStatus } from "@/utils/smoker-live-status";

// Chicago delivery zones
const TIER_1_ZIPS = new Set([
  "60634", "60630", "60631", "60641", "60656", "60706", "60707",
  "60018", "60068", "60131", "60171", "60639", "60646", "60638",
  "60176", "60625", "60618", "60076", "60714", "60651"
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
    addItem,
    updateQuantity,
    removeItem,
    clearTray,
    totalItemCount,
    subtotal,
  } = useOrderTray();
  const { getItemStatus } = useLiveSmokerStatus();

  const MIN_DELIVERY_SUBTOTAL = 150;
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

  // Prevent background scrolling and handle Escape key on mobile & desktop
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeTray();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeTray]);

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

  const finalTotal = subtotal + deliveryFee;
  const remainingForMin = Math.max(0, MIN_DELIVERY_SUBTOTAL - subtotal);
  const isMinMet = subtotal >= MIN_DELIVERY_SUBTOTAL;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (trayItems.length === 0) {
      setErrorMessage("Your tray is empty.");
      return;
    }
    if (!isMinMet) {
      setErrorMessage(
        `Minimum food order for heated catering delivery is $${MIN_DELIVERY_SUBTOTAL}. Please add $${remainingForMin.toFixed(0)} more to your tray.`
      );
      return;
    }
    if (!deliveryZip || deliveryZip.trim().length !== 5) {
      setErrorMessage("Please enter your 5-digit Chicagoland delivery ZIP code.");
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
    if (!deliveryAddress || deliveryAddress.trim().length < 5) {
      setErrorMessage("Please enter your complete delivery street address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        fulfillmentType: "delivery",
        deliveryAddress: `${deliveryAddress.trim()} (ZIP: ${deliveryZip.trim()})`,
        deliveryZip: deliveryZip.trim(),
        eventDate: eventDate || "Weekend Batch / As Soon As Available",
        eventTime,
        orderNotes: orderNotes.trim(),
        items: trayItems,
        subtotal,
        deliveryFee,
        finalTotal,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit quote request.");
      }

      setTicketId(data.ticketId || "ATS-QUOTE-" + Math.floor(1000 + Math.random() * 9000));
      setSubmitSuccess(true);
      clearTray();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please call (773) 707-9988.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Smokehouse Quote Tray"
      className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end overflow-hidden p-0"
    >
      {/* Backdrop overlay */}
      <div
        onClick={closeTray}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* Cart Container: Centered on Mobile (mx-auto, w-full), Slide-Over Drawer on Desktop (sm:max-w-lg sm:mr-0) */}
      <div className="relative w-full h-full max-h-screen sm:max-w-lg bg-[#111317] border-x sm:border-x-0 sm:border-l border-white/10 text-neutral-100 flex flex-col shadow-2xl z-10 overflow-hidden mx-auto sm:mr-0">
        
        {/* Drawer Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#15181E] flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[#EA580C] text-sm">🔥</span>
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#F59E0B] truncate">
                All The Smoke BBQ • Smoked To Order
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-0.5 flex items-center gap-2">
              <span className="truncate">Smokehouse Quote Tray</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 shrink-0">
                {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
              </span>
            </h3>
            <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
              Build your custom pan &amp; meat lineup for Pitmaster Marion&rsquo;s approval
            </p>
          </div>
          <button
            onClick={closeTray}
            type="button"
            className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 active:bg-[#EA580C] text-white flex items-center justify-center text-lg font-bold transition shrink-0 cursor-pointer shadow-md border border-white/15"
            aria-label="Close Tray"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
            
            {/* SUCCESS STATE */}
            {submitSuccess ? (
              <div className="py-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center text-3xl mx-auto">
                  ✓
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#F59E0B]">
                    Itemized Quote Request Received
                  </span>
                  <h4 className="text-2xl font-black text-white mt-1">
                    Sent to Pitmaster Marion!
                  </h4>
                  <p className="text-sm font-mono font-bold text-neutral-300 mt-1">
                    Quote Ticket #{ticketId}
                  </p>
                </div>

                <div className="bg-[#181B22] p-5 rounded-2xl border border-white/10 text-left text-xs sm:text-sm space-y-2.5">
                  <p className="text-neutral-300">
                    Pitmaster Marion Bolden has received your itemized tray request and will review his smoker schedule to confirm availability for your date within <strong>12 hours</strong>.
                  </p>
                  <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
                    <p className="font-bold text-white">🔥 Next Steps &amp; Approval:</p>
                    <p className="text-neutral-400 text-xs">
                      • <strong>No Immediate Charge:</strong> Because every brisket, slab, and pan is smoked fresh over hardwood logs, Marion confirms your date and meat availability first.
                    </p>
                    <p className="text-neutral-400 text-xs">
                      • <strong>50% Deposit Upon Approval:</strong> Once Marion confirms your smoke schedule, you can lock it in via Zelle (<span className="text-[#F59E0B] font-mono font-bold">773-707-9988</span>) or invoice link.
                    </p>
                  </div>
                  <p className="text-neutral-400 text-xs pt-1">
                    Direct Pitmaster Line: <strong className="text-white">(773) 707-9988</strong>
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
                <h4 className="text-lg font-bold text-white">Your quote tray is currently empty</h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Browse the Pitmaster Menu or Weekly Chalkboard and click &ldquo;+ Half Pan&rdquo;, &ldquo;+ Full Pan&rdquo;, or &ldquo;+ Add to Tray&rdquo; to build your custom quote!
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
                    <span className="font-mono uppercase tracking-wider">Items in Your Quote Tray</span>
                    <button
                      onClick={clearTray}
                      type="button"
                      className="text-red-400 hover:text-red-300 text-[11px] underline"
                    >
                      Clear All
                    </button>
                  </div>

                  {trayItems.map((item) => {
                    const live = getItemStatus(item.baseId || item.id);
                    const isSmokingLive = live.status === "smoking-now";
                    const isSoldOut = live.status === "sold-out";

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                          isSmokingLive
                            ? "bg-[#1d1712] border-[#EA580C]/50 shadow-sm"
                            : "bg-[#171A20] border-white/10"
                        }`}
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
                          {isSmokingLive && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF7A00] bg-[#EA580C]/20 border border-[#EA580C]/40 px-1.5 py-0.5 rounded mt-0.5 animate-pulse">
                              <span>🔥</span>
                              <span>Smoking on rig today • Ready {live.readyTime || "~5:00 PM"}</span>
                            </span>
                          )}
                          {isSoldOut && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-400 bg-black/40 border border-neutral-700 px-1.5 py-0.5 rounded mt-0.5">
                              <span>🚫</span>
                              <span>Queued for next smoker cook</span>
                            </span>
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
                  );
                })}
                </div>

                {/* 1B. Complete the Feast 1-Click Upsell Strip (Jack Stack Pattern) */}
                {(() => {
                  const UPSELL_ADDONS = [
                    {
                      id: "habanero-cornbread-half-pan",
                      baseId: "habanero-cornbread",
                      name: "Habanero Cheddar Skillet Cornbread",
                      shortLabel: "+ Cornbread Half Pan ($35)",
                      selectedOption: "Half Pan (15 squares)",
                      price: 35,
                      image: "/images/menu/habanero-cheddar-cornbread.jpg",
                      category: "specialties",
                    },
                    {
                      id: "baked-beans-half-pan",
                      baseId: "baked-beans",
                      name: "Smokehouse Baked Beans w/ Burnt Ends",
                      shortLabel: "+ Baked Beans Half Pan ($55)",
                      selectedOption: "Half Pan (15–20)",
                      price: 55,
                      image: "/images/menu/smokehouse-baked-beans.jpg",
                      category: "sides",
                    },
                    {
                      id: "mac-cheese-half-pan",
                      baseId: "mac-cheese",
                      name: "Pitmaster Baked Mac & Cheese",
                      shortLabel: "+ 4-Cheese Mac Half Pan ($75)",
                      selectedOption: "Half Pan (12–15)",
                      price: 75,
                      image: "/images/menu/pitmaster-mac-and-cheese.jpg",
                      category: "sides",
                    },
                  ];
                  const availableAddons = UPSELL_ADDONS.filter(
                    (addon) => !trayItems.some((t) => t.baseId === addon.baseId)
                  );
                  if (availableAddons.length === 0) return null;

                  return (
                    <div className="bg-[#181512] p-3.5 rounded-xl border border-[#EA580C]/35 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#F59E0B] flex items-center gap-1.5">
                          <span>🔥</span>
                          <span>Complete Your Feast (1-Click Add)</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {availableAddons.map((addon) => (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() =>
                              addItem({
                                id: addon.id.trim(),
                                baseId: addon.baseId,
                                name: addon.name,
                                selectedOption: addon.selectedOption,
                                price: addon.price,
                                image: addon.image,
                                category: addon.category,
                              })
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-black/50 hover:bg-[#EA580C] border border-[#C8A97E]/30 hover:border-[#EA580C] text-[11px] font-bold text-neutral-200 hover:text-white transition"
                          >
                            {addon.shortLabel}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 2. Chicagoland ZIP Code Delivery Calculator */}
                <div className="bg-[#171A20] p-4 rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#F59E0B] font-bold flex items-center gap-1.5">
                      <span>🚚</span>
                      <span>Heated Chicagoland Delivery</span>
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      Dispatched from Chicago&rsquo;s NW Side
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-neutral-300 block">
                      Enter Event / Venue 5-Digit ZIP Code *:
                    </label>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <input
                        type="text"
                        maxLength={5}
                        value={deliveryZip}
                        onChange={(e) => handleZipChange(e.target.value)}
                        placeholder="e.g. 60634"
                        className="w-28 px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#EA580C]"
                      />
                      {deliveryZoneLabel ? (
                        <span className="text-xs font-mono text-emerald-400 flex items-center">
                          ✓ {deliveryZoneLabel}
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-400">
                          Calculates instant zone fee
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Event Date & Time */}
                <div className="bg-[#171A20] p-4 rounded-xl border border-white/10 space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                    Requested Date &amp; Time (Subject to Smoker Schedule)
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
                    Contact &amp; Venue Information
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

                    <input
                      type="text"
                      placeholder="Delivery Street Address & City *"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2.5 bg-black/40 border border-white/15 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#EA580C]"
                    />

                    <textarea
                      rows={2}
                      placeholder="Special requests (e.g. dietary notes, extra pit sauce, gate code)..."
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
              {/* Smart $150 Delivery Minimum Progress Bar */}
              <div
                className={`p-3 rounded-xl border ${
                  isMinMet
                    ? "bg-emerald-950/40 border-emerald-500/40"
                    : "bg-[#1C1612] border-[#EA580C]/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  {isMinMet ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span>✓</span>
                      <span>$150 Delivery Minimum Met!</span>
                    </span>
                  ) : (
                    <span className="text-[#F59E0B] flex items-center gap-1.5">
                      <span>🔥</span>
                      <span>
                        Add ${remainingForMin.toFixed(0)} more to hit $150 delivery minimum
                      </span>
                    </span>
                  )}
                  <span className="font-mono text-[11px] text-neutral-300">
                    ${subtotal.toFixed(0)} / ${MIN_DELIVERY_SUBTOTAL}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isMinMet ? "bg-emerald-500" : "bg-gradient-to-r from-[#EA580C] to-[#F59E0B]"
                    }`}
                    style={{
                      width: `${Math.min(100, Math.round((subtotal / MIN_DELIVERY_SUBTOTAL) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Estimated Food Subtotal ({totalItemCount} items)</span>
                  <span className="font-mono font-bold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Heated Drop-Off Delivery</span>
                  <span className="font-mono font-bold text-[#F59E0B]">
                    {deliveryFee > 0 ? `+$${deliveryFee}.00` : "Enter ZIP above"}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-white">Estimated Quote Total</span>
                  <span className="text-xl font-black font-mono text-[#EA580C]">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting || !isMinMet}
                className="w-full py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-display font-bold tracking-wider uppercase text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin text-lg">⏳</span>
                    <span>SENDING QUOTE TRAY TO MARION...</span>
                  </>
                ) : !isMinMet ? (
                  <span>Add ${remainingForMin.toFixed(0)} More for Delivery ($150 Min)</span>
                ) : (
                  <>
                    <span>GET A FREE QUOTE FOR THIS TRAY</span>
                    <span>&rarr;</span>
                  </>
                )}
              </button>

              {/* Mobile & Desktop Secondary Close Button */}
              <button
                type="button"
                onClick={closeTray}
                className="w-full py-2.5 rounded-xl border border-white/15 hover:border-white/30 text-neutral-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer bg-white/5 active:bg-white/10"
              >
                <span>&larr;</span>
                <span>Continue Browsing Smokehouse Menu</span>
              </button>

              <p className="text-[11px] text-center text-neutral-400 leading-snug">
                🔥 <strong className="text-neutral-200">Smoked to Order — Pitmaster Approval:</strong> Submitting sends your itemized tray to Marion Bolden to confirm smoker availability for your date. No payment due until approved.
              </p>
            </div>
          )}

        </div>
      </div>
  );
}

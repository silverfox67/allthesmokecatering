"use client";

import React, { useState, useEffect } from "react";
import { SITE_CONFIG } from "@/config/site-config";
import {
  PER_PERSON_PACKAGES,
  TURNKEY_BUNDLES,
  MEAL_PREP_TIERS,
} from "@/data/catering-packages";

const ALL_PACKAGES = [
  ...PER_PERSON_PACKAGES.map((p) => ({
    id: p.id,
    name: p.name,
    category: "Per-Person Buffet",
    categoryKey: "per-person" as const,
    priceLabel: `$${p.pricePerPerson.toFixed(2)}/pp`,
    sub: `Min ${p.minimumGuests} guests`,
  })),
  ...TURNKEY_BUNDLES.map((b) => ({
    id: b.id,
    name: b.name,
    category: "Turnkey Party Pans",
    categoryKey: "turnkey" as const,
    priceLabel: `$${b.price.toFixed(2)} flat`,
    sub: b.serves,
  })),
  ...MEAL_PREP_TIERS.map((m) => ({
    id: m.id,
    name: m.name,
    category: "Weekly Meal Prep",
    categoryKey: "meal-prep" as const,
    priceLabel: `$${m.price.toFixed(2)} total`,
    sub: `${m.mealCount} meals ($${m.pricePerMeal.toFixed(2)}/ea)`,
  })),
];

interface QuoteModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultPackageId?: string;
}

export function QuoteModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  defaultPackageId = "pitmaster-feast",
}: QuoteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Form State
  const [eventType, setEventType] = useState("Corporate Event");
  const [guestCount, setGuestCount] = useState(35);
  const [eventDate, setEventDate] = useState("");
  const [packageId, setPackageId] = useState(defaultPackageId);
  const [modalPkgCategory, setModalPkgCategory] = useState<"per-person" | "turnkey" | "meal-prep">("per-person");
  const [selectedProteins, setSelectedProteins] = useState<string[]>([
    "St. Louis Cut Spare Rib Slabs",
    "Tender Smoked Turkey Chops",
  ]);
  const [selectedSides, setSelectedSides] = useState<string[]>([
    "4-Cheese Baked Mac & Cheese",
    "Southern Baked Beans",
  ]);
  const [serviceStyle, setServiceStyle] = useState("Heated Drop-Off Delivery");
  const [venueAddress, setVenueAddress] = useState("");
  const [venueZip, setVenueZip] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Listen for global custom event 'open-quote-modal'
  useEffect(() => {
    const handleGlobalOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ packageId?: string }>;
      if (customEvent.detail?.packageId) {
        const pid = customEvent.detail.packageId;
        setPackageId(pid);
        const match = ALL_PACKAGES.find((p) => p.id === pid);
        if (match) {
          setModalPkgCategory(match.categoryKey);
        }
      }
      setIsOpen(true);
      setStep(1);
      setSubmitSuccess(false);
    };

    window.addEventListener("open-quote-modal", handleGlobalOpen);
    return () => window.removeEventListener("open-quote-modal", handleGlobalOpen);
  }, []);

  // Sync controlled state
  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen);
      if (controlledIsOpen) {
        setStep(1);
        setSubmitSuccess(false);
      }
    }
  }, [controlledIsOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (controlledOnClose) controlledOnClose();
  };

  const toggleProtein = (protein: string) => {
    if (selectedProteins.includes(protein)) {
      setSelectedProteins(selectedProteins.filter((p) => p !== protein));
    } else {
      setSelectedProteins([...selectedProteins, protein]);
    }
  };

  const toggleSide = (side: string) => {
    if (selectedSides.includes(side)) {
      setSelectedSides(selectedSides.filter((s) => s !== side));
    } else {
      setSelectedSides([...selectedSides, side]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const selectedPkg = ALL_PACKAGES.find((p) => p.id === packageId);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          guestCount,
          eventDate,
          packageId,
          packageName: selectedPkg?.name || "Custom Pitmaster Spread",
          selectedProteins,
          selectedSides,
          serviceStyle,
          deliveryAddress: `${venueAddress}${venueZip ? ` (${venueZip})` : ""}`,
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit catering inquiry");
      }

      setTicketId(data.ticketId || `ATS-${Date.now().toString().slice(-4)}`);
      setSubmitSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while submitting. Please call (773) 707-9988 directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Modal Container: Warm Smoked Cast-Iron Frame with Flame Ember Glow */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#121110] border-2 border-[#EA580C]/40 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.95),_0_0_25px_rgba(234,88,12,0.2)] overflow-hidden my-6"
      >
        {/* Ambient Corner Ember Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-[#EA580C]/25 to-transparent blur-[80px]"
        />

        {/* Header Bar */}
        <div className="bg-[#181614] border-b border-[#2C241E] px-6 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] shadow-[0_0_8px_#EA580C] animate-pulse" aria-hidden="true" />
            <h2 id="quote-modal-title" className="font-display text-xl sm:text-2xl text-[#F4EFEA] font-bold tracking-wide">
              All The Smoke Catering Quote &amp; Booking
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close quote modal"
            className="w-9 h-9 rounded-full bg-[#201D1A] hover:bg-[#2C2622] text-stone-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors border border-[#3C322A] hover:border-[#EA580C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar (if not submitted) */}
        {!submitSuccess && (
          <div className="bg-[#141210] px-4 sm:px-6 py-3 border-b border-[#28221D] flex items-center justify-between text-xs text-stone-400 relative z-10 gap-2">
            <span className="font-mono text-[#FF8C38] font-bold shrink-0 tracking-wider">STEP {step}/4</span>
            <div className="flex gap-1.5 sm:gap-2 shrink-0">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-5 sm:w-8 h-1.5 rounded-full transition-all ${
                    s <= step
                      ? "bg-gradient-to-r from-[#EA580C] to-[#FF8C38] shadow-[0_0_6px_rgba(234,88,12,0.5)]"
                      : "bg-[#28221D]"
                  }`}
                />
              ))}
            </div>
            <span className="text-[#E7DFD5] font-semibold truncate text-right">
              {step === 1 && "Event & Guests"}
              {step === 2 && "Smokehouse Menu"}
              {step === 3 && "Venue & Logistics"}
              {step === 4 && "Contact & Dispatch"}
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto relative z-10">
          {submitSuccess ? (
            /* Success Screen */
            <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#EA580C]/20 border-2 border-[#EA580C] flex items-center justify-center text-[#FF8C38] shadow-[0_0_25px_rgba(234,88,12,0.3)]">
                <svg className="h-10 w-10 text-[#FF8C38]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#FF8C38] font-black">
                  Inquiry Dispatched Successfully
                </span>
                <h3 className="font-display text-3xl sm:text-4xl text-[#F4EFEA] font-bold">
                  Ticket #{ticketId} Logged
                </h3>
                <p className="text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{clientName}</strong>! Marion Bolden and the pitmaster crew have received your catering inquiry.
                  We will review our smoker schedule and follow up within <strong>12 business hours</strong>.
                </p>
              </div>

              <div className="bg-[#181512] p-5 rounded-2xl border border-[#2E2721] max-w-md mx-auto text-xs text-stone-300 space-y-2 text-left">
                <p><strong>Client:</strong> {clientName} ({clientPhone})</p>
                <p><strong>Event Date:</strong> {eventDate || "Date TBD"}</p>
                <p><strong>Guests:</strong> {guestCount} Guests</p>
                <p><strong>Service Style:</strong> {serviceStyle}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href={`tel:${SITE_CONFIG.phoneFormatted}`}
                  className="rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] text-white font-display font-bold px-6 py-3 text-sm uppercase tracking-wider transition-all min-h-[48px] flex items-center justify-center [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Call Marion Directly: {SITE_CONFIG.phone}
                </a>
                <button
                  onClick={handleClose}
                  className="bg-[#201D1A] hover:bg-[#282420] text-stone-300 hover:text-white font-bold px-6 py-3 rounded-xl text-sm transition-all min-h-[48px] border border-[#3C322A]"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* STEP 1: Event Type & Guest Count */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#E7DFD5] uppercase tracking-wider block">
                      Select Event Type *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        "Wedding Reception",
                        "Corporate Event",
                        "Private Backyard BBQ",
                        "Birthday Gala",
                        "Game-Day Tailgate",
                        "Community Rally",
                      ].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setEventType(t)}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                            eventType === t
                              ? "bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] text-white shadow-[0_0_14px_rgba(255,122,0,0.4)] [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)]"
                              : "bg-[#191614] border-[#2E2721] text-[#D8CEC1] hover:border-[#EA580C]/60 hover:bg-[#201C18]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="modal-guest-count" className="text-xs font-bold text-[#E7DFD5] uppercase tracking-wider">
                        Estimated Guest Count: <strong className="text-[#FF8C38] text-base font-extrabold">{guestCount} Guests</strong>
                      </label>
                      <span className="text-[11px] text-stone-400">Min 15 — 500+</span>
                    </div>
                    <input
                      id="modal-guest-count"
                      type="range"
                      min="15"
                      max="300"
                      step="5"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full accent-[#EA580C] bg-[#221E1A] h-2 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-event-date" className="text-xs font-bold text-[#E7DFD5] uppercase tracking-wider block">
                      Target Event Date *
                    </label>
                    <input
                      id="modal-event-date"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className="w-full bg-[#191614] border border-[#3A312A] focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] rounded-xl px-4 py-3 text-[#F4EFEA] text-sm outline-none transition-colors"
                    />
                    <p className="text-[11px] text-stone-400">
                      * 48 to 72 hours advance notice required for whole meats and live-fire pit rigs.
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-[#2A231D]">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full sm:w-auto rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] font-display text-base font-bold tracking-wider text-white uppercase [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)] hover:scale-[1.02] active:scale-[0.98] transition-all px-8 py-3.5 min-h-[48px] flex items-center justify-center cursor-pointer text-center"
                    >
                      Next: Choose Menu →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Package & Protein Selections */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-bold text-[#E7DFD5] uppercase tracking-wider block">
                        Select Base Smokehouse Package:
                      </label>
                      <div className="flex rounded-xl bg-[#191614] p-1 border border-[#2E2721] gap-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setModalPkgCategory("per-person")}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                            modalPkgCategory === "per-person"
                              ? "bg-[#EA580C] text-white shadow-md font-black"
                              : "text-stone-400 hover:text-white"
                          }`}
                        >
                          Per-Person
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalPkgCategory("turnkey")}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                            modalPkgCategory === "turnkey"
                              ? "bg-[#EA580C] text-white shadow-md font-black"
                              : "text-stone-400 hover:text-white"
                          }`}
                        >
                          Party Pans
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalPkgCategory("meal-prep")}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                            modalPkgCategory === "meal-prep"
                              ? "bg-[#EA580C] text-white shadow-md font-black"
                              : "text-stone-400 hover:text-white"
                          }`}
                        >
                          Meal Prep
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {ALL_PACKAGES.filter((p) => p.categoryKey === modalPkgCategory).map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setPackageId(pkg.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            packageId === pkg.id
                              ? "bg-[#221B16] border-2 border-[#EA580C] shadow-[0_0_16px_rgba(234,88,12,0.3)] ring-1 ring-[#EA580C]"
                              : "bg-[#191614] border-[#2E2721] hover:border-[#3E342B]"
                          }`}
                        >
                          <span className="font-display text-lg text-[#F4EFEA] block font-bold">
                            {pkg.name}
                          </span>
                          <span className="text-[#FF8C38] font-black text-sm block mt-1">
                            {pkg.priceLabel}
                          </span>
                          <span className="text-[10px] text-stone-400 block mt-1">
                            {pkg.sub}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Protein Selections */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#E7DFD5] uppercase tracking-wider block">
                      Preferred Smoked Proteins:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        "Prime Texas Sliced Brisket (14-Hr)",
                        "St. Louis Cut Spare Rib Slabs",
                        "Tender Smoked Turkey Chops",
                        "Smoked Beef Polish Sausage",
                        "Slow-Smoked Rib Tips",
                        "Carved Smoked Whole Chicken",
                        "Slow-Smoked Savory Oxtails",
                      ].map((prot) => (
                        <label
                          key={prot}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#191614] border border-[#2E2721] hover:border-[#EA580C]/50 cursor-pointer text-xs text-[#E7DFD5] transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedProteins.includes(prot)}
                            onChange={() => toggleProtein(prot)}
                            className="accent-[#EA580C] w-4 h-4 rounded cursor-pointer"
                          />
                          <span>{prot}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sides Selections */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#E7DFD5] uppercase tracking-wider block">
                      Preferred Scratch Sides:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        "4-Cheese Baked Mac & Cheese",
                        "Southern Baked Beans (w/ Turkey)",
                        "Traditional Mustard Potato Salad",
                        "Cheesy Broccoli Casserole",
                        "Scratch Southern Spaghetti",
                        "Creamy Southern Coleslaw",
                      ].map((side) => (
                        <label
                          key={side}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#191614] border border-[#2E2721] hover:border-[#EA580C]/50 cursor-pointer text-xs text-[#E7DFD5] transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSides.includes(side)}
                            onChange={() => toggleSide(side)}
                            className="accent-[#EA580C] w-4 h-4 rounded cursor-pointer"
                          />
                          <span>{side}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-[#2A231D]">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-[#201D1A] hover:bg-[#282420] text-stone-300 hover:text-white text-xs font-bold px-5 py-3 rounded-xl text-center border border-[#3C322A] transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-full sm:w-auto rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] font-display text-base font-bold tracking-wider text-white uppercase [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)] hover:scale-[1.02] active:scale-[0.98] transition-all px-8 py-3.5 min-h-[48px] flex items-center justify-center cursor-pointer text-center"
                    >
                      Next: Venue Details →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Venue Address & Service Style */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-[#E7DFD5] uppercase tracking-wider block">
                      Choose Service Execution Style *
                    </label>
                    <div className="space-y-2.5">
                      {[
                        {
                          title: "Heated Drop-Off Delivery",
                          desc: "Pre-heated Cambro insulated transit direct from our commercial kitchen. Set up hot on chafers.",
                        },
                        {
                          title: "Live-Fire On-Site Pitmaster Rig",
                          desc: "Marion Bolden & crew deploy mobile smoker trailer for theatrical on-site slicing.",
                        },
                        {
                          title: "Kitchen Commissary Pickup",
                          desc: "Curbside scheduled pickup at our Chicago Northwest Side commercial kitchen hub.",
                        },
                      ].map((item) => (
                        <label
                          key={item.title}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                            serviceStyle === item.title
                              ? "bg-[#221B16] border-2 border-[#EA580C] shadow-[0_0_14px_rgba(234,88,12,0.3)] ring-1 ring-[#EA580C]"
                              : "bg-[#191614] border-[#2E2721] hover:border-[#3E342B]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="serviceStyle"
                            checked={serviceStyle === item.title}
                            onChange={() => setServiceStyle(item.title)}
                            className="accent-[#EA580C] mt-1 w-4 h-4 cursor-pointer"
                          />
                          <div>
                            <span className="font-bold text-[#F4EFEA] text-xs block font-display">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-stone-400">
                              {item.desc}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-venue-address" className="text-xs font-bold text-[#E7DFD5] uppercase tracking-wider block">
                      Venue Address / Street:
                    </label>
                    <input
                      id="modal-venue-address"
                      type="text"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      placeholder="e.g. 1200 S Lake Shore Dr, Chicago"
                      className="w-full bg-[#191614] border border-[#3A312A] focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] rounded-xl px-4 py-3 text-[#F4EFEA] text-sm outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-venue-zip" className="text-xs font-bold text-[#E7DFD5] uppercase tracking-wider block">
                      Event ZIP Code:
                    </label>
                    <input
                      id="modal-venue-zip"
                      type="text"
                      maxLength={5}
                      value={venueZip}
                      onChange={(e) => setVenueZip(e.target.value)}
                      placeholder="e.g. 60605"
                      className="w-full bg-[#191614] border border-[#3A312A] focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] rounded-xl px-4 py-3 text-[#F4EFEA] text-sm outline-none font-mono transition-colors"
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-[#2A231D]">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-[#201D1A] hover:bg-[#282420] text-stone-300 hover:text-white text-xs font-bold px-5 py-3 rounded-xl text-center border border-[#3C322A] transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="w-full sm:w-auto rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] font-display text-base font-bold tracking-wider text-white uppercase [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)] hover:scale-[1.02] active:scale-[0.98] transition-all px-8 py-3.5 min-h-[48px] flex items-center justify-center cursor-pointer text-center"
                    >
                      Next: Contact Info →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Contact Details & Submit */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="modal-client-name" className="text-xs font-bold text-[#E7DFD5] uppercase tracking-wider block">
                        Your Full Name *
                      </label>
                      <input
                        id="modal-client-name"
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Marcus Vance"
                        className="w-full bg-[#191614] border border-[#3A312A] focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] rounded-xl px-4 py-3 text-[#F4EFEA] text-sm outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="modal-client-phone" className="text-xs font-bold text-[#E7DFD5] uppercase tracking-wider block">
                        Phone Number *
                      </label>
                      <input
                        id="modal-client-phone"
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="(773) 555-0199"
                        className="w-full bg-[#191614] border border-[#3A312A] focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] rounded-xl px-4 py-3 text-[#F4EFEA] text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-client-email" className="text-xs font-bold text-[#E7DFD5] uppercase tracking-wider block">
                      Email Address *
                    </label>
                    <input
                      id="modal-client-email"
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="marcus@example.com"
                      className="w-full bg-[#191614] border border-[#3A312A] focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] rounded-xl px-4 py-3 text-[#F4EFEA] text-sm outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-client-notes" className="text-xs font-bold text-[#E7DFD5] uppercase tracking-wider block">
                      Special Pitmaster Requests / Notes:
                    </label>
                    <textarea
                      id="modal-client-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Dietary requests, timing nuances, specific meat cuts..."
                      className="w-full bg-[#191614] border border-[#3A312A] focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] rounded-xl px-4 py-3 text-[#F4EFEA] text-sm outline-none resize-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-[#2A231D]">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-[#201D1A] hover:bg-[#282420] text-stone-300 hover:text-white text-xs font-bold px-5 py-3 rounded-xl text-center border border-[#3C322A] transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] font-display text-base font-bold tracking-wider text-white uppercase [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)] hover:scale-[1.02] active:scale-[0.98] transition-all px-8 py-3.5 min-h-[48px] flex items-center justify-center cursor-pointer disabled:opacity-50 text-center"
                    >
                      {isSubmitting ? "DISPATCHING INQUIRY..." : "SUBMIT CATERING INQUIRY"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

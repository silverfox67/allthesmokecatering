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
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          eventDate: eventDate || "TBD",
          guestCount,
          packageId,
          packageName: selectedPkg ? selectedPkg.name : "Custom Smoker Package",
          deliveryAddress: venueZip ? `${venueAddress} (ZIP: ${venueZip})` : venueAddress,
          serviceStyle,
          selectedProteins,
          selectedSides,
          notes: `Event Type: ${eventType}\n${notes}`,
          formLoadedAt: Date.now() - 5000,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit catering inquiry");
      }

      setTicketId(data.ticketId || "ATS-QUOTE");
      setSubmitSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting quote request";
      setErrorMessage(msg);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Modal Container: Warm Charcoal Frame */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#121214] border border-zinc-800 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden my-8"
      >
        {/* Ambient Corner Ember Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-[80px]"
        />

        {/* Header Bar */}
        <div className="bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
            <h2 id="quote-modal-title" className="font-display text-xl sm:text-2xl text-white tracking-wide">
              All The Smoke Catering Quote &amp; Booking
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close quote modal"
            className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-lg transition-colors border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar (if not submitted) */}
        {!submitSuccess && (
          <div className="bg-zinc-950/60 px-4 sm:px-6 py-3 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400 relative z-10 gap-2">
            <span className="font-mono text-amber-400 font-bold shrink-0">STEP {step}/4</span>
            <div className="flex gap-1.5 sm:gap-2 shrink-0">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-5 sm:w-8 h-1.5 rounded-full transition-all ${
                    s <= step ? "bg-amber-500" : "bg-zinc-800"
                  }`}
                />
              ))}
            </div>
            <span className="text-zinc-300 font-semibold truncate text-right">
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
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400">
                <svg className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                  Inquiry Dispatched Successfully
                </span>
                <h3 className="font-display text-3xl sm:text-4xl text-white">
                  Ticket #{ticketId} Logged
                </h3>
                <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{clientName}</strong>! Marion Bolden and the pitmaster crew have received your catering inquiry.
                  We will review our smoker schedule and follow up within <strong>12 business hours</strong>.
                </p>
              </div>

              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 max-w-md mx-auto text-xs text-zinc-300 space-y-2 text-left">
                <p><strong>Client:</strong> {clientName} ({clientPhone})</p>
                <p><strong>Event Date:</strong> {eventDate || "Date TBD"}</p>
                <p><strong>Guests:</strong> {guestCount} Guests</p>
                <p><strong>Service Style:</strong> {serviceStyle}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href={`tel:${SITE_CONFIG.phoneFormatted}`}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-6 py-3 rounded-xl text-sm uppercase tracking-wider transition-all min-h-[48px] flex items-center justify-center"
                >
                  Call Marion Directly: {SITE_CONFIG.phone}
                </a>
                <button
                  onClick={handleClose}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all min-h-[48px]"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-white text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* STEP 1: Event Type & Guest Count */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
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
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                            eventType === t
                              ? "bg-amber-500 text-black border-amber-500 shadow-md"
                              : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="modal-guest-count" className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                        Estimated Guest Count: <strong className="text-amber-400 text-base">{guestCount} Guests</strong>
                      </label>
                      <span className="text-[11px] text-zinc-400">Min 15 — 500+</span>
                    </div>
                    <input
                      id="modal-guest-count"
                      type="range"
                      min="15"
                      max="300"
                      step="5"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full accent-amber-500 bg-zinc-950 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-event-date" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                      Target Event Date *
                    </label>
                    <input
                      id="modal-event-date"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-3 text-white text-sm outline-none"
                    />
                    <p className="text-[11px] text-zinc-400">
                      * 48 to 72 hours advance notice required for whole meats and live-fire pit rigs.
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-zinc-800">
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
                      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                        Select Base Smokehouse Package:
                      </label>
                      <div className="flex rounded-lg bg-zinc-950 p-1 border border-zinc-800 gap-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setModalPkgCategory("per-person")}
                          className={`px-2.5 py-1 rounded font-bold transition-all ${
                            modalPkgCategory === "per-person"
                              ? "bg-amber-500 text-black shadow-sm"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          Per-Person
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalPkgCategory("turnkey")}
                          className={`px-2.5 py-1 rounded font-bold transition-all ${
                            modalPkgCategory === "turnkey"
                              ? "bg-amber-500 text-black shadow-sm"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          Party Pans
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalPkgCategory("meal-prep")}
                          className={`px-2.5 py-1 rounded font-bold transition-all ${
                            modalPkgCategory === "meal-prep"
                              ? "bg-amber-500 text-black shadow-sm"
                              : "text-zinc-400 hover:text-white"
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
                              ? "bg-zinc-900 border-amber-500 shadow-md ring-1 ring-amber-500"
                              : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          <span className="font-display text-lg text-white block">
                            {pkg.name}
                          </span>
                          <span className="text-amber-400 font-extrabold text-sm block">
                            {pkg.priceLabel}
                          </span>
                          <span className="text-[10px] text-zinc-400 block mt-1">
                            {pkg.sub}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Protein Selections */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
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
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer text-xs text-zinc-200"
                        >
                          <input
                            type="checkbox"
                            checked={selectedProteins.includes(prot)}
                            onChange={() => toggleProtein(prot)}
                            className="accent-amber-500 w-4 h-4 rounded"
                          />
                          <span>{prot}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sides Selections */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
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
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer text-xs text-zinc-200"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSides.includes(side)}
                            onChange={() => toggleSide(side)}
                            className="accent-amber-500 w-4 h-4 rounded"
                          />
                          <span>{side}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-zinc-400 hover:text-white text-xs font-bold px-4 py-2.5 text-center"
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
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                      Choose Service Execution Style *
                    </label>
                    <div className="space-y-2.5">
                      {[
                        {
                          title: "Heated Drop-Off Delivery",
                          desc: "Pre-heated Cambro insulated transit direct from 60634 hub. Set up hot on chafers.",
                        },
                        {
                          title: "Live-Fire On-Site Pitmaster Rig",
                          desc: "Marion Bolden & crew deploy mobile smoker trailer for theatrical on-site slicing.",
                        },
                        {
                          title: "Kitchen Commissary Pickup",
                          desc: "Curbside scheduled pickup at 3401 N Orange Ave, Chicago 60634.",
                        },
                      ].map((item) => (
                        <label
                          key={item.title}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                            serviceStyle === item.title
                              ? "bg-zinc-900 border-amber-500 ring-1 ring-amber-500"
                              : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="serviceStyle"
                            checked={serviceStyle === item.title}
                            onChange={() => setServiceStyle(item.title)}
                            className="accent-amber-500 mt-1 w-4 h-4"
                          />
                          <div>
                            <span className="font-bold text-white text-xs block">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              {item.desc}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-venue-address" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                      Venue Address / Street:
                    </label>
                    <input
                      id="modal-venue-address"
                      type="text"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      placeholder="e.g. 1200 S Lake Shore Dr, Chicago"
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-3 text-white text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-venue-zip" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                      Event ZIP Code:
                    </label>
                    <input
                      id="modal-venue-zip"
                      type="text"
                      maxLength={5}
                      value={venueZip}
                      onChange={(e) => setVenueZip(e.target.value)}
                      placeholder="e.g. 60605"
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-3 text-white text-sm outline-none font-mono"
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-zinc-400 hover:text-white text-xs font-bold px-4 py-2.5 text-center"
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
                      <label htmlFor="modal-client-name" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                        Your Full Name *
                      </label>
                      <input
                        id="modal-client-name"
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Marcus Vance"
                        className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-3 text-white text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="modal-client-phone" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                        Phone Number *
                      </label>
                      <input
                        id="modal-client-phone"
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="(773) 555-0199"
                        className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-3 text-white text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-client-email" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                      Email Address *
                    </label>
                    <input
                      id="modal-client-email"
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="marcus@example.com"
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-3 text-white text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-client-notes" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                      Special Pitmaster Requests / Notes:
                    </label>
                    <textarea
                      id="modal-client-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Dietary requests, timing nuances, specific meat cuts..."
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-3 text-white text-sm outline-none"
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-zinc-400 hover:text-white text-xs font-bold px-4 py-2.5 text-center"
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

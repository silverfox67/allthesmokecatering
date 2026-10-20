"use client";

import React, { useState, useEffect } from "react";
import { SITE_CONFIG } from "@/config/site-config";
import { PER_PERSON_PACKAGES } from "@/data/catering-packages";

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
        setPackageId(customEvent.detail.packageId);
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
      const selectedPkg = PER_PERSON_PACKAGES.find((p) => p.id === packageId);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-obsidian/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-charcoal border border-white/20 rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header Bar */}
        <div className="bg-obsidian border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-ember animate-pulse" aria-hidden="true" />
            <h2 id="quote-modal-title" className="font-display text-xl sm:text-2xl text-white tracking-wide">
              All The Smoke Catering Quote &amp; Booking
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close quote modal"
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ember"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar (if not submitted) */}
        {!submitSuccess && (
          <div className="bg-obsidian/50 px-6 py-3 border-b border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <span className="font-mono text-ember font-bold">STEP {step} OF 4</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-1.5 rounded-full transition-all ${
                    s <= step ? "bg-ember" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <span className="text-neutral-300 font-semibold">
              {step === 1 && "Event & Guests"}
              {step === 2 && "Smokehouse Menu"}
              {step === 3 && "Venue & Logistics"}
              {step === 4 && "Contact & Dispatch"}
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {submitSuccess ? (
            /* Success Screen */
            <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 mx-auto rounded-full bg-ember/20 border-2 border-ember flex items-center justify-center text-ember text-4xl">
                🔥
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-ember font-bold">
                  Inquiry Dispatched Successfully
                </span>
                <h3 className="font-display text-3xl sm:text-4xl text-white">
                  Ticket #{ticketId} Logged
                </h3>
                <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{clientName}</strong>! Marion Bolden and the pitmaster crew have received your catering inquiry.
                  We will review our smoker schedule and follow up within <strong>12 business hours</strong>.
                </p>
              </div>

              <div className="bg-obsidian p-5 rounded-2xl border border-white/10 max-w-md mx-auto text-xs text-neutral-300 space-y-2 text-left">
                <p><strong>Client:</strong> {clientName} ({clientPhone})</p>
                <p><strong>Event Date:</strong> {eventDate || "Date TBD"}</p>
                <p><strong>Guests:</strong> {guestCount} Guests</p>
                <p><strong>Service Style:</strong> {serviceStyle}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href={`tel:${SITE_CONFIG.phoneFormatted}`}
                  className="bg-ember hover:bg-ember-dark text-obsidian font-extrabold px-6 py-3 rounded-xl text-sm uppercase tracking-wider transition-all min-h-[48px] flex items-center justify-center"
                >
                  Call Marion Directly: {SITE_CONFIG.phone}
                </a>
                <button
                  onClick={handleClose}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all min-h-[48px]"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-crimson/20 border border-crimson text-white text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* STEP 1: Event Type & Guest Count */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
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
                              ? "bg-ember text-obsidian border-ember shadow-md"
                              : "bg-obsidian border-white/10 text-neutral-300 hover:border-white/30"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="modal-guest-count" className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                        Estimated Guest Count: <strong className="text-ember text-base">{guestCount} Guests</strong>
                      </label>
                      <span className="text-[11px] text-neutral-400">Min 15 — 500+</span>
                    </div>
                    <input
                      id="modal-guest-count"
                      type="range"
                      min="15"
                      max="300"
                      step="5"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full accent-ember bg-obsidian cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-event-date" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                      Target Event Date *
                    </label>
                    <input
                      id="modal-event-date"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className="w-full bg-obsidian border border-white/20 focus:border-ember focus:ring-1 focus:ring-ember rounded-xl px-4 py-3 text-white text-sm outline-none"
                    />
                    <p className="text-[11px] text-neutral-400">
                      * 48 to 72 hours advance notice required for whole meats and live-fire pit rigs.
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-ember hover:bg-ember-dark text-obsidian font-extrabold px-8 py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all min-h-[48px]"
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
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                      Select Base Smokehouse Package:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {PER_PERSON_PACKAGES.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setPackageId(pkg.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            packageId === pkg.id
                              ? "bg-charcoal border-ember shadow-md ring-1 ring-ember"
                              : "bg-obsidian border-white/10 hover:border-white/20"
                          }`}
                        >
                          <span className="font-display text-lg text-white block">
                            {pkg.name}
                          </span>
                          <span className="text-ember font-extrabold text-sm block">
                            ${pkg.pricePerPerson.toFixed(2)}/pp
                          </span>
                          <span className="text-[10px] text-neutral-400 block mt-1">
                            Min {pkg.minimumGuests} guests
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Protein Selections */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
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
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-obsidian border border-white/10 hover:border-white/20 cursor-pointer text-xs text-neutral-200"
                        >
                          <input
                            type="checkbox"
                            checked={selectedProteins.includes(prot)}
                            onChange={() => toggleProtein(prot)}
                            className="accent-ember w-4 h-4 rounded"
                          />
                          <span>{prot}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sides Selections */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
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
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-obsidian border border-white/10 hover:border-white/20 cursor-pointer text-xs text-neutral-200"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSides.includes(side)}
                            onChange={() => toggleSide(side)}
                            className="accent-ember w-4 h-4 rounded"
                          />
                          <span>{side}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-neutral-400 hover:text-white text-xs font-bold px-4 py-3"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-ember hover:bg-ember-dark text-obsidian font-extrabold px-8 py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all min-h-[48px]"
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
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
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
                              ? "bg-charcoal border-ember ring-1 ring-ember"
                              : "bg-obsidian border-white/10 hover:border-white/20"
                          }`}
                        >
                          <input
                            type="radio"
                            name="serviceStyle"
                            checked={serviceStyle === item.title}
                            onChange={() => setServiceStyle(item.title)}
                            className="accent-ember mt-1 w-4 h-4"
                          />
                          <div>
                            <span className="font-bold text-white text-xs block">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-neutral-400">
                              {item.desc}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-venue-address" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                      Venue Address / Street:
                    </label>
                    <input
                      id="modal-venue-address"
                      type="text"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      placeholder="e.g. 1200 S Lake Shore Dr, Chicago"
                      className="w-full bg-obsidian border border-white/20 focus:border-ember focus:ring-1 focus:ring-ember rounded-xl px-4 py-3 text-white text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-venue-zip" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                      Event ZIP Code:
                    </label>
                    <input
                      id="modal-venue-zip"
                      type="text"
                      maxLength={5}
                      value={venueZip}
                      onChange={(e) => setVenueZip(e.target.value)}
                      placeholder="e.g. 60605"
                      className="w-full bg-obsidian border border-white/20 focus:border-ember focus:ring-1 focus:ring-ember rounded-xl px-4 py-3 text-white text-sm outline-none font-mono"
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-neutral-400 hover:text-white text-xs font-bold px-4 py-3"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="bg-ember hover:bg-ember-dark text-obsidian font-extrabold px-8 py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all min-h-[48px]"
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
                      <label htmlFor="modal-client-name" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                        Your Full Name *
                      </label>
                      <input
                        id="modal-client-name"
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Marcus Vance"
                        className="w-full bg-obsidian border border-white/20 focus:border-ember focus:ring-1 focus:ring-ember rounded-xl px-4 py-3 text-white text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="modal-client-phone" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                        Phone Number *
                      </label>
                      <input
                        id="modal-client-phone"
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="(773) 555-0199"
                        className="w-full bg-obsidian border border-white/20 focus:border-ember focus:ring-1 focus:ring-ember rounded-xl px-4 py-3 text-white text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-client-email" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                      Email Address *
                    </label>
                    <input
                      id="modal-client-email"
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="marcus@example.com"
                      className="w-full bg-obsidian border border-white/20 focus:border-ember focus:ring-1 focus:ring-ember rounded-xl px-4 py-3 text-white text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-client-notes" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                      Special Pitmaster Requests / Notes:
                    </label>
                    <textarea
                      id="modal-client-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Dietary requests, timing nuances, specific meat cuts..."
                      className="w-full bg-obsidian border border-white/20 focus:border-ember focus:ring-1 focus:ring-ember rounded-xl px-4 py-3 text-white text-sm outline-none"
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-neutral-400 hover:text-white text-xs font-bold px-4 py-3"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-ember to-ember-dark text-obsidian font-extrabold px-8 py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all min-h-[48px] flex items-center justify-center shadow-xl disabled:opacity-50"
                    >
                      {isSubmitting ? "DISPATCHING INQUIRY..." : "SUBMIT CATERING INQUIRY 🔥"}
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

"use client";

import React, { useState } from "react";

export function HomepageLeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{
    ticketId: string;
    message: string;
    orderSummary?: {
      client?: string;
      email?: string;
      phone?: string;
      guestCount?: number;
    };
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    guestCount: "35",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          guestCount: Number(formData.guestCount) || 35,
          notes: formData.message,
          packageName: "The Pitmaster Feast",
          serviceStyle: "Heated Drop-Off Delivery",
          formLoadedAt: (Date.now() - 5000).toString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit catering inquiry");
      }

      setSuccessData(data);

      if (typeof window !== "undefined") {
        try {
          const generatedId = data.ticketId || `ATS-QUOTE-${Math.floor(1000 + Math.random() * 9000)}`;
          const existingRaw = localStorage.getItem("ats_pitmaster_leads");
          const existing = existingRaw ? JSON.parse(existingRaw) : [];
          const newLead = {
            id: generatedId,
            ticketId: generatedId,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            guestCount: Number(formData.guestCount) || 35,
            eventDate: "Date Pending",
            packageName: "The Pitmaster Feast",
            serviceStyle: "Heated Drop-Off Delivery",
            deliveryAddress: "Chicago Area",
            notes: formData.message || "Submitted via Homepage Reservation Form",
            status: "new",
            createdAt: new Date().toISOString(),
            source: "Homepage Reservation Form",
            estimatedTotal: (Number(formData.guestCount) || 35) * 32,
          };
          localStorage.setItem("ats_pitmaster_leads", JSON.stringify([newLead, ...existing]));
          window.dispatchEvent(new Event("storage"));
        } catch (e) {
          console.warn("Could not save to local leads cache:", e);
        }
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "An unexpected error occurred. Please call Pitmaster Marion directly at (773) 707-9988."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="relative z-10 py-8 px-4 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500/60 shadow-[0_0_24px_rgba(16,185,129,0.35)] text-emerald-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-amber-500/20 text-[#FF7A00] border border-amber-500/40">
            TICKET #{successData.ticketId || "ATS-CONFIRMED"}
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-white">
            Catering Inquiry Received!
          </h3>
          <p className="text-stone-300 text-sm sm:text-base max-w-lg mx-auto">
            {successData.message || "Marion Bolden will review your live-fire menu requests and contact you within 12 business hours."}
          </p>
        </div>

        <div className="max-w-md mx-auto p-4 rounded-xl bg-stone-900/90 border border-stone-800 text-left space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-stone-400">
            <span>Primary Contact:</span>
            <span className="text-stone-100 font-semibold">{formData.name}</span>
          </div>
          <div className="flex justify-between text-stone-400">
            <span>Email Confirmation:</span>
            <span className="text-stone-100 font-semibold">{formData.email}</span>
          </div>
          <div className="flex justify-between text-stone-400">
            <span>Phone:</span>
            <span className="text-stone-100 font-semibold">{formData.phone}</span>
          </div>
          <div className="flex justify-between text-stone-400">
            <span>Estimated Guests:</span>
            <span className="text-stone-100 font-semibold">{formData.guestCount} guests</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSuccessData(null);
            setFormData({
              name: "",
              phone: "",
              email: "",
              guestCount: "35",
              message: "",
            });
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="lead-name" className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
            Your Full Name *
          </label>
          <input
            id="lead-name"
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Marcus Vance"
            className="w-full h-12 px-4 rounded-xl bg-[#FAF8F5] border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="lead-phone" className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
            Contact Phone Number *
          </label>
          <input
            id="lead-phone"
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="(773) 555-0199"
            className="w-full h-12 px-4 rounded-xl bg-[#FAF8F5] border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="lead-email" className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
            Email Address *
          </label>
          <input
            id="lead-email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="marcus@example.com"
            className="w-full h-12 px-4 rounded-xl bg-[#FAF8F5] border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="lead-guestCount" className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
            Estimated Guest Count *
          </label>
          <input
            id="lead-guestCount"
            type="number"
            name="guestCount"
            min="10"
            required
            value={formData.guestCount}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl bg-[#FAF8F5] border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="lead-message" className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
          Event Type, Desired Menu, or Preferred Date
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Details on event venue, requested packages (The Pitmaster Feast, Brisket, Turkey Chops), serving style..."
          className="w-full bg-[#FAF8F5] border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] resize-none min-h-[110px] p-4 rounded-xl transition-all"
        />
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-700/60 text-red-300 text-sm flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 mt-4 inline-flex items-center justify-center rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] font-display text-xl font-bold tracking-wider text-white uppercase [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            TRANSMITTING INQUIRY...
          </span>
        ) : (
          "SUBMIT CATERING INQUIRY"
        )}
      </button>
    </form>
  );
}

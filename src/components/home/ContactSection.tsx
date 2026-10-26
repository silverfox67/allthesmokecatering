"use client";

import React, { useState } from "react";
import { SITE_CONFIG } from "@/config/site-config";
import { CalendarDatePicker } from "@/components/forms/CalendarDatePicker";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [successData, setSuccessData] = useState<{
    ticketId: string;
    message: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventType: "wedding",
    guestCount: "50",
    eventDate: "",
    budgetOrPackage: "The Pitmaster Feast ($30/pp)",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) {
      // Burn bot time
      setSuccessData({
        ticketId: "ATS-QUOTE-9912",
        message: "Catering quote submitted successfully.",
      });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          phone: formData.phone,
          email: formData.email,
          eventType: formData.eventType,
          guestCount: Number(formData.guestCount) || 50,
          eventDate: formData.eventDate || "Date Pending",
          packageName: formData.budgetOrPackage,
          notes: formData.message,
          serviceStyle: "Heated Drop-Off or On-Site Rig",
          formLoadedAt: (Date.now() - 5000).toString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit catering inquiry");
      }

      const generatedTicket = data.ticketId || `ATS-QUOTE-${Math.floor(1000 + Math.random() * 9000)}`;

      setSuccessData({
        ticketId: generatedTicket,
        message: data.message || "Catering quote submitted successfully. Marion Bolden will contact you within 12 business hours.",
      });

      // Synchronize immediately to dashboard pipeline
      if (typeof window !== "undefined") {
        try {
          const existingRaw = localStorage.getItem("ats_pitmaster_leads");
          const existing = existingRaw ? JSON.parse(existingRaw) : [];
          const newLead = {
            id: generatedTicket,
            ticketId: generatedTicket,
            name: fullName,
            phone: formData.phone,
            email: formData.email,
            guestCount: Number(formData.guestCount) || 50,
            eventDate: formData.eventDate || "Date Pending",
            packageName: formData.budgetOrPackage,
            serviceStyle: "Heated Drop-Off Delivery",
            deliveryAddress: "Chicago Area",
            notes: formData.message || "Submitted via Homepage Contact Form",
            status: "new",
            createdAt: new Date().toISOString(),
            source: "Homepage Contact Section",
            estimatedTotal: (Number(formData.guestCount) || 50) * 32,
          };
          localStorage.setItem("ats_pitmaster_leads", JSON.stringify([newLead, ...existing]));
          window.dispatchEvent(new Event("storage"));
        } catch (e) {
          console.warn("Could not cache lead to localStorage:", e);
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

  return (
    <section
      id="contact"
      className="w-full bg-[#0E0D0C] py-20 px-4 sm:px-6 lg:px-8 border-t border-stone-800/80 relative overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Target anchor for #quote backward compatibility */}
      <div id="quote" className="absolute -top-24 left-0" />

      {/* Ambient Live-Fire Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-600/10 via-orange-600/5 to-transparent blur-[120px]"
      />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF7A00] block mb-2 text-center">
            ★ GET YOUR SMOKEHOUSE QUOTE ★
          </span>
          <h2
            id="contact-heading"
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4EFEA] text-center mb-4"
          >
            Lock In Your Live-Fire Smoke Schedule
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto text-center">
            Ready to elevate your event with authentic Texas-style hardwood barbecue? Send us your event details for a personalized proposal from Pitmaster Marion Bolden within 12 business hours.
          </p>
        </div>

        {/* Two-Column Layout (Form on Left, Info & Why Choose on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: THE CONTACT FORM CARD (7 Columns) */}
          <div className="lg:col-span-7 rounded-3xl border border-stone-800 bg-[#141210] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Ambient Corner Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-[#EA580C]/10 blur-[60px]"
            />

            {successData ? (
              <div className="relative z-10 py-10 px-4 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500/60 shadow-[0_0_24px_rgba(16,185,129,0.35)] text-emerald-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-amber-500/20 text-[#FF7A00] border border-amber-500/40">
                    TICKET #{successData.ticketId}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-white">
                    Catering Inquiry Received!
                  </h3>
                  <p className="text-stone-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                    {successData.message}
                  </p>
                </div>

                <div className="max-w-md mx-auto p-4 rounded-xl bg-stone-900/90 border border-stone-800 text-left space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-stone-400">
                    <span>Primary Contact:</span>
                    <span className="text-stone-100 font-semibold">{formData.firstName} {formData.lastName}</span>
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
                  <div className="flex justify-between text-stone-400">
                    <span>Selected Package:</span>
                    <span className="text-[#FF7A00] font-semibold">{formData.budgetOrPackage}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSuccessData(null);
                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      eventType: "wedding",
                      guestCount: "50",
                      eventDate: "",
                      budgetOrPackage: "The Pitmaster Feast ($30/pp)",
                      message: "",
                    });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10 text-xs sm:text-sm">
                {/* Honeypot */}
                <input
                  type="text"
                  name="honeypot"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* 1. First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-firstName" className="font-bold text-stone-300 uppercase tracking-wider block text-xs">
                      First Name *
                    </label>
                    <input
                      id="contact-firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="e.g. Todd"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#FAF8F5] border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-lastName" className="font-bold text-stone-300 uppercase tracking-wider block text-xs">
                      Last Name *
                    </label>
                    <input
                      id="contact-lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="e.g. Davis"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#FAF8F5] border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all font-medium"
                    />
                  </div>
                </div>

                {/* 2. Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="font-bold text-stone-300 uppercase tracking-wider block text-xs">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="todd@example.com"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#FAF8F5] border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-phone" className="font-bold text-stone-300 uppercase tracking-wider block text-xs">
                      Phone Number *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="(773) 555-0199"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#FAF8F5] border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all font-medium"
                    />
                  </div>
                </div>

                {/* 3. Event Type & Guest Count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-eventType" className="font-bold text-stone-300 uppercase tracking-wider block text-xs">
                      Event Type
                    </label>
                    <select
                      id="contact-eventType"
                      value={formData.eventType}
                      onChange={(e) => handleInputChange("eventType", e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#FAF8F5] border border-stone-300 text-stone-900 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all font-medium cursor-pointer"
                    >
                      <option value="wedding">Wedding / Reception</option>
                      <option value="corporate">Corporate Summit / Gala</option>
                      <option value="private-party">Backyard BBQ / Private Party</option>
                      <option value="birthday-anniversary">Birthday or Anniversary</option>
                      <option value="graduation">Graduation Celebration</option>
                      <option value="other">Other Event Style</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-guestCount" className="font-bold text-stone-300 uppercase tracking-wider block text-xs">
                      Guest Count *
                    </label>
                    <input
                      id="contact-guestCount"
                      type="number"
                      min="10"
                      required
                      value={formData.guestCount}
                      onChange={(e) => handleInputChange("guestCount", e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#FAF8F5] border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all font-medium"
                    />
                  </div>
                </div>

                {/* 4. Event Date & Budget / Package */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-eventDate" className="font-bold text-stone-300 uppercase tracking-wider block text-xs">
                      Event Date *
                    </label>
                    <CalendarDatePicker
                      id="contact-eventDate"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={(dateStr) => handleInputChange("eventDate", dateStr)}
                      required
                      placeholder="Select event date..."
                      theme="light"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-package" className="font-bold text-stone-300 uppercase tracking-wider block text-xs">
                      Desired Package / Budget
                    </label>
                    <select
                      id="contact-package"
                      value={formData.budgetOrPackage}
                      onChange={(e) => handleInputChange("budgetOrPackage", e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#FAF8F5] border border-stone-300 text-stone-900 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all font-medium cursor-pointer"
                    >
                      <option value="The Pitmaster Feast ($30/pp)">The Pitmaster Feast ($30/pp)</option>
                      <option value="Prime Brisket Experience ($35/pp)">Prime Brisket Experience ($35/pp)</option>
                      <option value="Whole Smoked Turkey Chops ($28/pp)">Whole Smoked Turkey Chops ($28/pp)</option>
                      <option value="Full Live-Fire Smokehouse ($45/pp)">Full Live-Fire Smokehouse ($45/pp)</option>
                      <option value="Heated Drop-Off Delivery ($1,000 - $2,500)">Heated Drop-Off Delivery ($1,000 - $2,500)</option>
                      <option value="On-Site Smoker Trailer Rig ($2,500 - $6,000)">On-Site Smoker Trailer Rig ($2,500 - $6,000)</option>
                      <option value="Large Festival / Gala ($6,000+)">Large Festival / Gala ($6,000+)</option>
                      <option value="Custom Pitmaster Consultation">Custom Pitmaster Consultation</option>
                    </select>
                  </div>
                </div>

                {/* 5. Message */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="font-bold text-stone-300 uppercase tracking-wider block text-xs">
                    Tell us about your event
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please describe your event vision, requested meats (Brisket, Turkey Chops, Ribs), venue details, serving style, or any dietary requests..."
                    className="w-full bg-[#FAF8F5] border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] resize-none min-h-[105px] p-3.5 rounded-xl transition-all font-medium"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-700 text-red-300 text-xs flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-13 mt-2 inline-flex items-center justify-center gap-3 rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] font-display text-lg sm:text-xl font-bold tracking-wider text-white uppercase [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2.5">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      TRANSMITTING INQUIRY...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>GET MY CATERING QUOTE</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: CONTACT INFORMATION & WHY CHOOSE US (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card 1: Direct Contact Information */}
            <div className="rounded-3xl border border-stone-800 bg-[#141210] p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide border-b border-stone-800 pb-3">
                Contact Information
              </h3>

              <div className="space-y-5 text-xs sm:text-sm">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-[#FF7A00]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100 uppercase tracking-wider text-xs">Our Operations Hub</h4>
                    <p className="text-stone-300 font-medium mt-0.5">Chicago’s Northwest Side, Chicago, IL</p>
                    <p className="text-[11px] text-[#FF7A00] font-semibold mt-0.5">Commercial Smokehouse Commissary — By Appointment Only</p>
                    <p className="text-[11px] text-stone-400 mt-1 italic leading-relaxed">
                      We bring authentic live-fire smoker trailers and heated catering directly to your venue or private estate!
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-[#FF7A00]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100 uppercase tracking-wider text-xs">Direct Pitmaster Line</h4>
                    <a
                      href={`tel:${SITE_CONFIG.phoneFormatted}`}
                      className="text-[#FF7A00] hover:text-[#EA580C] font-display text-base sm:text-lg font-bold transition-colors inline-block mt-0.5"
                    >
                      {SITE_CONFIG.phone}
                    </a>
                    <p className="text-[11px] text-stone-400">Pitmaster Marion Bolden • Mon–Sun 8:00 AM – 8:00 PM</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-[#FF7A00]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100 uppercase tracking-wider text-xs">Direct Email</h4>
                    <a
                      href={`mailto:${SITE_CONFIG.brandEmail}`}
                      className="text-stone-200 hover:text-[#FF7A00] font-semibold transition-colors inline-block mt-0.5 truncate max-w-[220px]"
                    >
                      {SITE_CONFIG.brandEmail}
                    </a>
                    <p className="text-[11px] text-stone-400">Inquiries answered within 12 business hours</p>
                  </div>
                </div>

                {/* Service Area */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-[#FF7A00]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100 uppercase tracking-wider text-xs">Service Radius</h4>
                    <p className="text-stone-200 font-semibold mt-0.5">Greater Chicagoland &amp; Suburbs</p>
                    <p className="text-[11px] text-stone-400">Cook, DuPage, Lake, Will, and Kane Counties</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Why Choose All The Smoke BBQ? */}
            <div className="rounded-3xl border border-amber-900/40 bg-gradient-to-br from-[#1A1613] to-[#12100E] p-6 sm:p-8 space-y-5 shadow-xl">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide border-b border-amber-900/30 pb-3">
                Why Choose All The Smoke?
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-[#FF7A00] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ★
                  </div>
                  <div>
                    <span className="font-bold text-stone-100 block">Authentic Hardwood Live-Fire</span>
                    <span className="text-stone-400 text-xs leading-relaxed">
                      100% oak, hickory &amp; pecan wood offset smokers. No electric boxes, liquid smoke, or reheated compromises.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-[#FF7A00] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ⏱
                  </div>
                  <div>
                    <span className="font-bold text-stone-100 block">On-Time Dispatch Guarantee</span>
                    <span className="text-stone-400 text-xs leading-relaxed">
                      Insulated commercial Cambro hot-holding units ensure your feast arrives at the optimal serving temperature.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-[#FF7A00] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    🛡
                  </div>
                  <div>
                    <span className="font-bold text-stone-100 block">Fully Licensed &amp; Insured</span>
                    <span className="text-stone-400 text-xs leading-relaxed">
                      Certified commercial commissary operations adhering to strict ServSafe hygiene standards.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-[#FF7A00] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    🥩
                  </div>
                  <div>
                    <span className="font-bold text-stone-100 block">Prime Brisket &amp; Signature Turkey Chops</span>
                    <span className="text-stone-400 text-xs leading-relaxed">
                      Signature cuts seasoned with bold custom rubs, delivering the deep mahogany smoke ring Chicago barbecue lovers rave about.
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

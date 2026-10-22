import React from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/config/site-config";
import { Hero } from "@/components/home/Hero";
import { PackageGrid } from "@/components/catering/PackageGrid";
import { DeliveryChecker } from "@/components/delivery/DeliveryChecker";
import { TikTokReels } from "@/components/social/TikTokReels";
import { Footer } from "@/components/layout/Footer";
import { QuoteModal } from "@/components/forms/QuoteModal";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-neutral-100 flex flex-col">
      {/* 1. Hero: Deep Obsidian (#0A0A0A) + Amber Ember Radial Glow + Borderless Brisket */}
      <Hero />

      {/* 2. Spotlight Packages: Rich Charcoal (#121214) with Top/Bottom Borders & Ambient Ember Glow */}
      <PackageGrid />

      {/* 3. Delivery Calculator: Deep Obsidian (#0A0A0A) with Centered Radial Glow */}
      <DeliveryChecker />

      {/* 4. TikTok Pitmaster Reels: Warm Hickory Smoke Tint (#161311) */}
      <TikTokReels />

      {/* 5. Quote Inquiry & Date Booking Form: Warm Butcher-Paper Section + Cast-Iron Card */}
      <section
        id="quote"
        className="w-full bg-[#F5F0EB] py-20 px-4 sm:px-6 lg:px-8 border-y border-stone-300/70 relative overflow-hidden"
        aria-labelledby="quote-heading"
      >
        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B45309] block mb-2 text-center">
              ★ LIVE-FIRE SMOKER RESERVATION ★
            </span>
            <h2
              id="quote-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1917] text-center mb-3"
            >
              Reserve Your Catering Date
            </h2>
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto text-center mb-8">
              Lock in Marion Bolden’s live-fire pitmaster trailers for your Chicago wedding,
              corporate summit, or private backyard celebration. Inquiries are audited and responded to within 12 business hours.
            </p>
          </div>

          {/* Cast-Iron Reservation Form Card */}
          <div className="mx-auto max-w-4xl rounded-2xl sm:rounded-3xl border border-stone-800/80 bg-[#141210] p-6 sm:p-12 shadow-2xl shadow-stone-900/40 relative overflow-hidden space-y-8">
            {/* Ambient Ember Backlight in the form corner */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-[80px]"
            />

            <form action="/api/lead" method="POST" className="space-y-6 relative z-10">
              <input type="hidden" name="formLoadedAt" value={Date.now().toString()} />
              {/* Honeypot anti-spam */}
              <input
                type="text"
                name="honey"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

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
                    defaultValue="35"
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
                  placeholder="Details on event venue, requested packages (The Pitmaster Feast, Brisket, Turkey Chops), serving style..."
                  className="w-full bg-[#FAF8F5] border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] resize-none min-h-[110px] p-4 rounded-xl transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full h-14 mt-4 inline-flex items-center justify-center rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] font-display text-xl font-bold tracking-wider text-white uppercase [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)] transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                SUBMIT CATERING INQUIRY
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer with statutory notices, hub details, and official master circular crest */}
      <Footer />

      {/* Multi-Step Interactive Quote & Booking Modal */}
      <QuoteModal />
    </main>
  );
}

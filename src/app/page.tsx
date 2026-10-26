import React from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/config/site-config";
import { Hero } from "@/components/home/Hero";
import { PackageGrid } from "@/components/catering/PackageGrid";
import { DeliveryChecker } from "@/components/delivery/DeliveryChecker";
import { TikTokReels } from "@/components/social/TikTokReels";
import { Footer } from "@/components/layout/Footer";
import { QuoteModal } from "@/components/forms/QuoteModal";
import { HomepageLeadForm } from "@/components/forms/HomepageLeadForm";

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

            <HomepageLeadForm />
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

import React from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/config/site-config";
import { Hero } from "@/components/home/Hero";
import { PackageGrid } from "@/components/catering/PackageGrid";
import { DeliveryChecker } from "@/components/delivery/DeliveryChecker";
import { TikTokReels } from "@/components/social/TikTokReels";
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

      {/* 5. Quote Inquiry & Date Booking Form: Deep Obsidian (#0A0A0A) with Framed Warm Card */}
      <section
        id="quote"
        className="py-20 sm:py-28 px-4 sm:px-8 bg-[#0A0A0A] border-b border-zinc-800/80 relative overflow-hidden"
        aria-labelledby="quote-heading"
      >
        {/* Ambient Ember Backlight in the background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-amber-600/5 blur-[150px]"
        />

        <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-[#121214] p-8 sm:p-14 shadow-2xl shadow-black/80 relative overflow-hidden space-y-8">
          {/* Ambient Ember Backlight in the form corner */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-[80px]"
          />

          <div className="space-y-3 relative z-10">
            <span className="text-amber-400 text-xs uppercase font-extrabold tracking-widest bg-zinc-900 px-3.5 py-1.5 rounded-full border border-amber-500/30 inline-block">
              ★ Live-Fire Smoker Reservation ★
            </span>
            <h2
              id="quote-heading"
              className="font-display text-4xl sm:text-6xl text-white font-black uppercase leading-none"
            >
              Reserve Your Catering Date
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Lock in Marion Bolden’s live-fire pitmaster trailers for your Chicago wedding,
              corporate summit, or private backyard celebration. Inquiries are audited and responded to within 12 business hours.
            </p>
          </div>

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
                <label htmlFor="lead-name" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Your Full Name *
                </label>
                <input
                  id="lead-name"
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lead-phone" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Contact Phone Number *
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  name="phone"
                  required
                  placeholder="(773) 555-0199"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="lead-email" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Email Address *
                </label>
                <input
                  id="lead-email"
                  type="email"
                  name="email"
                  required
                  placeholder="marcus@example.com"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lead-guestCount" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Estimated Guest Count *
                </label>
                <input
                  id="lead-guestCount"
                  type="number"
                  name="guestCount"
                  min="10"
                  defaultValue="35"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="lead-message" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Event Type, Desired Menu, or Preferred Date
              </label>
              <textarea
                id="lead-message"
                name="message"
                rows={4}
                placeholder="Details on event venue, requested packages (The Pitmaster Feast, Brisket, Turkey Chops), serving style..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold py-4 rounded-xl text-base tracking-wider hover:brightness-110 transition-all shadow-xl min-h-[48px] flex items-center justify-center uppercase"
            >
              SUBMIT CATERING INQUIRY
            </button>
          </form>
        </div>
      </section>

      {/* Footer with statutory notices, hub details, and official master circular crest */}
      <footer className="bg-[#0e0e10] border-t border-zinc-800/80 py-14 px-4 sm:px-8 text-zinc-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 shrink-0 overflow-hidden rounded-full border border-amber-500/40">
                <Image
                  src="/brand/allthesmoke-logo.png"
                  alt="All The Smoke Official Master Crest"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-display text-2xl text-white">ALL THE SMOKE</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Booked-to-order live-fire smokehouse &amp; culinary commissary operations.
              Exclusive Chicago wedding, corporate, and private catering dispatch.
            </p>
          </div>

          <div>
            <span className="font-bold text-white block mb-3 uppercase tracking-wider text-sm">
              Operations Hub
            </span>
            <p className="text-zinc-300 leading-relaxed">
              {SITE_CONFIG.hubAddress.street}
              <br />
              Chicago, IL {SITE_CONFIG.hubAddress.zip}
              <br />
              <span className="text-zinc-500 text-[11px] block mt-1">
                (By booked dispatch only; exclusive smokehouse commissary)
              </span>
            </p>
          </div>

          <div>
            <span className="font-bold text-white block mb-3 uppercase tracking-wider text-sm">
              Direct Dispatch
            </span>
            <p className="text-zinc-300 leading-relaxed space-y-1">
              <span>Direct: </span>
              <a href={`tel:${SITE_CONFIG.phoneFormatted}`} className="text-amber-400 font-semibold hover:underline">
                {SITE_CONFIG.phone}
              </a>
              <br />
              <span>Inquiries: </span>
              <a href={`mailto:${SITE_CONFIG.brandEmail}`} className="text-zinc-300 hover:text-white">
                {SITE_CONFIG.brandEmail}
              </a>
              <br />
              <span>TikTok: </span>
              <a
                href={SITE_CONFIG.socials.tiktok}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline font-semibold"
              >
                @allthesmokebbq_catering
              </a>
            </p>
          </div>

          <div>
            <span className="font-bold text-white block mb-3 uppercase tracking-wider text-sm">
              Authentic Credentials
            </span>
            <p className="text-zinc-300 leading-relaxed space-y-1">
              <span>© {new Date().getFullYear()} {SITE_CONFIG.brandName}.</span>
              <br />
              <span>Principal: <strong>{SITE_CONFIG.legalName}</strong></span>
              <br />
              <span className="text-[11px] text-zinc-400 block pt-1">
                Anti-AI Documentary Image Verification: Passed &amp; Certified.
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* Multi-Step Interactive Quote & Booking Modal */}
      <QuoteModal />
    </main>
  );
}

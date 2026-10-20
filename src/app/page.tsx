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
    <main className="min-h-screen bg-obsidian text-neutral-100 flex flex-col">
      {/* 1. Hero Section with Top Utility Bar, Badge, Dual CTAs, Split Layout, Trust Bar */}
      <Hero />

      {/* 2. Spotlight Package Grid with Cursor Radial Gradients, Gold Border Beam, Tab Switcher */}
      <PackageGrid />

      {/* 3. Delivery Radius Calculator with Zip Checker against Zones 1-3 */}
      <DeliveryChecker />

      {/* 4. TikTok Reel Showcase with Looping Smoked Meat Reels Carousel */}
      <TikTokReels />

      {/* 5. Quote Inquiry & Date Booking Form */}
      <section
        id="quote"
        className="py-20 sm:py-28 px-4 sm:px-8 bg-obsidian border-b border-white/10"
        aria-labelledby="quote-heading"
      >
        <div className="max-w-4xl mx-auto bg-charcoal border border-white/15 rounded-3xl p-8 sm:p-14 shadow-2xl space-y-8">
          <div className="space-y-3">
            <span className="text-ember text-xs uppercase font-extrabold tracking-widest bg-obsidian px-3 py-1 rounded-full border border-ember/30 inline-block">
              ● Live-Fire Smoker Reservation
            </span>
            <h2
              id="quote-heading"
              className="font-display text-4xl sm:text-6xl text-white font-bold uppercase leading-none"
            >
              Reserve Your Catering Date
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Lock in Marion Bolden’s live-fire pitmaster trailers for your Chicago wedding,
              corporate summit, or private backyard celebration. Inquiries are audited and responded to within 12 business hours.
            </p>
          </div>

          <form action="/api/lead" method="POST" className="space-y-6">
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
                <label htmlFor="lead-name" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                  Your Full Name *
                </label>
                <input
                  id="lead-name"
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-obsidian border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-ember text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lead-phone" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                  Contact Phone Number *
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  name="phone"
                  required
                  placeholder="(773) 555-0199"
                  className="w-full bg-obsidian border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-ember text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="lead-email" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                  Email Address *
                </label>
                <input
                  id="lead-email"
                  type="email"
                  name="email"
                  required
                  placeholder="marcus@example.com"
                  className="w-full bg-obsidian border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-ember text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lead-guestCount" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                  Estimated Guest Count *
                </label>
                <input
                  id="lead-guestCount"
                  type="number"
                  name="guestCount"
                  min="10"
                  defaultValue="35"
                  className="w-full bg-obsidian border border-white/20 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-ember text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="lead-message" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Event Type, Desired Menu, or Preferred Date
              </label>
              <textarea
                id="lead-message"
                name="message"
                rows={4}
                placeholder="Details on event venue, requested packages (The Pitmaster Feast, Brisket, Turkey Chops), serving style..."
                className="w-full bg-obsidian border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-ember text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-ember to-ember-dark text-obsidian font-extrabold py-4 rounded-xl text-base tracking-wider hover:brightness-110 transition-all shadow-xl min-h-[48px] flex items-center justify-center uppercase"
            >
              SUBMIT CATERING INQUIRY
            </button>
          </form>
        </div>
      </section>

      {/* Footer with statutory notices and founder credentials */}
      <footer className="bg-charcoal border-t border-white/10 py-14 px-4 sm:px-8 text-neutral-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/brand/allthesmoke-logo.png"
                  alt="All The Smoke Official Master Crest"
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
              <span className="font-display text-2xl text-white">ALL THE SMOKE</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Booked-to-order live-fire smokehouse &amp; culinary commissary operations.
              Exclusive Chicago wedding, corporate, and private catering dispatch.
            </p>
          </div>

          <div>
            <span className="font-bold text-white block mb-3 uppercase tracking-wider text-sm">
              Operations Hub
            </span>
            <p className="text-neutral-300 leading-relaxed">
              {SITE_CONFIG.hubAddress.street}
              <br />
              Chicago, IL {SITE_CONFIG.hubAddress.zip}
              <br />
              <span className="text-neutral-500 text-[11px] block mt-1">
                (By booked dispatch only; exclusive smokehouse commissary)
              </span>
            </p>
          </div>

          <div>
            <span className="font-bold text-white block mb-3 uppercase tracking-wider text-sm">
              Direct Dispatch
            </span>
            <p className="text-neutral-300 leading-relaxed space-y-1">
              <span>Direct: </span>
              <a href={`tel:${SITE_CONFIG.phoneFormatted}`} className="text-ember font-semibold hover:underline">
                {SITE_CONFIG.phone}
              </a>
              <br />
              <span>Inquiries: </span>
              <a href={`mailto:${SITE_CONFIG.brandEmail}`} className="text-neutral-300 hover:text-white">
                {SITE_CONFIG.brandEmail}
              </a>
              <br />
              <span>TikTok: </span>
              <a
                href={SITE_CONFIG.socials.tiktok}
                target="_blank"
                rel="noreferrer"
                className="text-ember hover:underline font-semibold"
              >
                @allthesmokebbq_catering
              </a>
            </p>
          </div>

          <div>
            <span className="font-bold text-white block mb-3 uppercase tracking-wider text-sm">
              Authentic Credentials
            </span>
            <p className="text-neutral-300 leading-relaxed space-y-1">
              <span>© {new Date().getFullYear()} {SITE_CONFIG.brandName}.</span>
              <br />
              <span>Principal: <strong>{SITE_CONFIG.legalName}</strong></span>
              <br />
              <span className="text-[11px] text-neutral-400 block pt-1">
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


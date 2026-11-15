import React from "react";
import { GOOGLE_REVIEW_URL } from "@/utils/reviews-store";

const GOOGLE_MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=All+The+Smoke+BBQ+%26+Catering+Chicago+IL+60634";

const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d180000!2d-87.84!3d41.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2678ec651ad7958d%3A0xc7f45f60c0fa5df1!2sAll%20The%20Smoke%20BBQ%20%26%20Catering!5e0!3m2!1sen!2sus!4v1794701800000!5m2!1sen!2sus";

export function GoogleBusinessMap() {
  return (
    <section
      id="service-area-map"
      className="w-full bg-[#0A0A0A] py-16 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80"
      aria-labelledby="gbp-map-heading"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="space-y-3">
            <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm">
              ★ VERIFIED GOOGLE BUSINESS PROFILE ★
            </span>
            <h2
              id="gbp-map-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white"
            >
              Chicagoland Service Area &amp; Live Hours
            </h2>
            <p className="text-sm sm:text-base text-stone-200 max-w-xl leading-relaxed">
              View our verified Chicagoland coverage area, live operating &amp; holiday hours,
              and Google reviews directly on Google Maps.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-5 py-3 rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.45),_inset_0_0_8px_rgba(255,122,0,0.25)] text-white font-display font-bold text-sm tracking-wider uppercase transition-transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2 whitespace-nowrap [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)]"
            >
              <span>Open in Google Maps</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-5 py-3 rounded-[14px] bg-[#1C1814] border border-[#C8A97E]/40 hover:border-[#FF7A00] text-amber-300 hover:text-white text-sm font-bold inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
            >
              <span>⭐ Google Reviews</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-stone-800 shadow-2xl bg-[#141210]">
          <iframe
            title="All The Smoke BBQ & Catering on Google Maps"
            src={GOOGLE_MAPS_EMBED_URL}
            className="w-full h-[360px] sm:h-[420px] border-0 block"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* 3-Column Operating Hours, Holiday Schedule & Advance Booking Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-[#141210] border border-[#C8A97E]/25 p-5 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C8A97E] block">
              Operating Hours
            </span>
            <p className="text-base font-bold text-white">
              Tue – Sun: 8:00 AM – 8:00 PM
            </p>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Monday: Closed • Est. March 2024
            </p>
          </div>

          <div className="rounded-2xl bg-[#141210] border border-[#C8A97E]/25 p-5 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C8A97E] block">
              Holiday Hours
            </span>
            <p className="text-base font-bold text-white">
              Closed Major Holidays
            </p>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Thanksgiving (Nov 26), Christmas (Dec 25) &amp; New Year’s Day (Jan 1) — special orders by inquiry.
            </p>
          </div>

          <div className="rounded-2xl bg-[#141210] border border-[#C8A97E]/25 p-5 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C8A97E] block">
              Advance Booking
            </span>
            <p className="text-base font-bold text-white">
              48–72 Hours Notice
            </p>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Required for live-fire catering &amp; whole meats. Dispatched from NW Side Chicago (60634).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

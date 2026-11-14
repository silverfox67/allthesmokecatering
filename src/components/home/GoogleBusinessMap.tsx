import React from "react";
import { GOOGLE_REVIEW_URL } from "@/utils/reviews-store";

const GOOGLE_MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=All+The+Smoke+BBQ+%26+Catering+Chicago+IL";

const GOOGLE_MAPS_EMBED_URL =
  "https://maps.google.com/maps?q=Chicago,+IL+60634&t=&z=11&ie=UTF8&iwloc=&output=embed";

export function GoogleBusinessMap() {
  return (
    <section
      id="service-area-map"
      className="w-full bg-[#0A0A0A] py-16 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80"
      aria-labelledby="gbp-map-heading"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest inline-block">
              Verified Google Business Profile
            </span>
            <h2
              id="gbp-map-heading"
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
            >
              Chicagoland Service Area &amp; Live Hours
            </h2>
            <p className="text-sm text-stone-400 max-w-2xl">
              View our verified Chicagoland coverage area, live operating &amp; holiday hours,
              and Google reviews directly on Google Maps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-5 py-3 rounded-xl bg-[#181512] border border-[#C8A97E]/40 hover:border-[#FF7A00] text-amber-400 hover:text-amber-300 text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <span>Open in Google Maps</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-5 py-3 rounded-xl bg-[#181512] border border-stone-700 hover:border-[#C8A97E] text-stone-200 hover:text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
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
      </div>
    </section>
  );
}

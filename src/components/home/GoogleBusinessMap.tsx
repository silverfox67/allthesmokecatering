import React from "react";
import { GOOGLE_REVIEW_URL } from "@/utils/reviews-store";

const GOOGLE_MAPS_LINK =
  "https://www.google.com/maps/place//data=!4m3!3m2!1s0x2678ec651ad7958d:0xc7f45f60c0fa5df1";

const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d380513.7160580949!2d-87.7985!3d41.9462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2678ec651ad7958d%3A0xc7f45f60c0fa5df1!2sAll%20The%20Smoke%20BBQ%20%26%20Catering!5e0!3m2!1sen!2sus!4v1794701800000!5m2!1sen!2sus";

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

"use client";

import React from "react";
import Link from "next/link";
import { useCustomerReviews, GOOGLE_REVIEW_URL } from "@/utils/reviews-store";

export function TestimonialSection() {
  const { reviews } = useCustomerReviews();
  const featuredReviews = reviews.filter((r) => r.isFeatured || r.rating === 5).slice(0, 3);

  // If no authentic reviews have been approved yet, silently hide section to preserve integrity
  if (featuredReviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0A0A0A] via-[#110E0C] to-[#0A0A0A] border-t border-[#291E16] relative overflow-hidden">
      {/* Background Ember Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#EA580C]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF7A00]/15 border border-[#FF7A00]/40 text-[#FF7A00] text-xs font-black uppercase tracking-widest">
            <span>★ Chicagoland Client Proof ★</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight">
            What Chicago Planners &amp; Families Say
          </h2>

          <p className="text-sm sm:text-base text-stone-400 font-medium">
            From Fulton Market weddings to downtown corporate luncheons and backyard tailgates, our 14-hour post oak smoke speaks for itself.
          </p>

          <div className="flex items-center justify-center gap-3 pt-1 text-xs text-stone-300">
            <span className="flex items-center text-amber-400 text-sm">
              ★★★★★
            </span>
            <span className="font-bold">5.0 Star Average</span>
            <span className="text-stone-500">•</span>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF7A00] hover:underline font-bold"
            >
              Verified Google Business Reviews ↗
            </a>
          </div>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 sm:p-7 rounded-3xl bg-[#141210]/90 border border-[#33251B] hover:border-[#FF7A00]/50 transition-all duration-300 shadow-xl flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Star Row & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400 text-sm tracking-wider">
                    {"★".repeat(rev.rating)}
                  </div>
                  <span className="text-stone-600 text-xl font-serif select-none">
                    &ldquo;
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-stone-200 font-medium leading-relaxed italic">
                  &ldquo;{rev.reviewText}&rdquo;
                </p>

                {/* Flavor Highlights Chips */}
                {rev.favoriteHighlights && rev.favoriteHighlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {rev.favoriteHighlights.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 border border-[#3D2C20] text-amber-300/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Client Info Subline */}
              <div className="pt-5 mt-5 border-t border-[#291E16] flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm text-white group-hover:text-[#FF7A00] transition-colors">
                    {rev.clientName}
                  </h4>
                  <p className="text-[11px] text-stone-400 font-semibold">
                    {rev.eventType}
                  </p>
                </div>

                <div className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#251A0D] text-amber-400 border border-[#FF7A00]/30">
                  Verified Gig
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="pt-4 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/review"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-700 bg-stone-900/80 hover:bg-stone-850 text-stone-300 hover:text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>⭐ Catered by Marion? Leave a Review</span>
            <span>→</span>
          </Link>

          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C84A0A] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-xs font-black shadow-md hover:scale-103 active:scale-97 transition-all"
          >
            <span>★ Read Reviews on Google Maps</span>
            <span className="text-[10px]">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}


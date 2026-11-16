"use client";

import React from "react";
import Link from "next/link";
import { useCustomerReviews, GOOGLE_REVIEW_URL } from "@/utils/reviews-store";

export function ReviewsPageClient() {
  const { reviews } = useCustomerReviews();
  const publishedReviews = reviews.filter((r) => r.status === "published");
  const totalReviews = publishedReviews.length;
  const averageRating =
    totalReviews > 0
      ? (publishedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

  return (
    <div className="bg-[#0A0A0A] text-neutral-100">
      {/* Top Hero & Action Bar */}
      <section className="relative pt-16 pb-14 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] max-w-full h-[260px] bg-[#EA580C]/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-[#C8A97E]/30 text-[#C8A97E] text-xs font-extrabold uppercase tracking-widest shadow-sm">
            ★ VERIFIED GOOGLE REVIEWS ★
          </span>

          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white">
            Chicago Client Reviews
          </h1>

          <p className="text-sm sm:text-base text-stone-200 max-w-2xl mx-auto leading-relaxed">
            Real feedback from Chicagoland families, event planners, and BBQ fans on our verified Google Business Profile.
          </p>

          {/* Rating Summary Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-2 rounded-2xl bg-[#FAF8F5] border border-[#C8A97E] text-[#1C1917] shadow-lg">
            <span className="text-[#EA580C] text-base tracking-wider" aria-label={`${averageRating} out of 5 stars`}>
              ★★★★★
            </span>
            <span className="font-display font-bold text-sm sm:text-base">
              {averageRating} Star Average
            </span>
            <span className="text-stone-400" aria-hidden="true">•</span>
            <span className="text-xs sm:text-sm font-semibold text-stone-700">
              {totalReviews} Verified {totalReviews === 1 ? "Review" : "Reviews"}
            </span>
          </div>

          {/* Primary Review CTAs (Top of Page for Easy Access) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.45),_inset_0_0_8px_rgba(255,122,0,0.25)] text-white font-display font-bold text-sm tracking-wider uppercase transition-transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2 whitespace-nowrap [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)]"
            >
              <span>★ Leave a Google Review</span>
              <span aria-hidden="true">↗</span>
            </a>

            <Link
              href="/review"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-[14px] bg-[#FAF8F5] hover:bg-white border-2 border-[#C8A97E] shadow-lg text-[#1C1917] font-display font-bold text-sm tracking-wider uppercase inline-flex items-center justify-center gap-2 whitespace-nowrap transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Share Event Feedback</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {publishedReviews.map((rev) => (
            <article
              key={rev.id}
              className="h-full p-6 sm:p-7 rounded-2xl bg-[#FAF8F5] border border-[#C8A97E]/60 border-t-4 border-t-[#EA580C] shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4 pb-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center text-[#EA580C] text-base tracking-wider" aria-label={`${rev.rating} stars`}>
                    {"★".repeat(rev.rating)}
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-[#1C1917] border border-[#C8A97E]/70">
                    {rev.source === "google" ? "Google Review" : "Client Review"}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-[#1C1917] font-medium leading-relaxed">
                  &ldquo;{rev.reviewText}&rdquo;
                </p>

                {rev.favoriteHighlights && rev.favoriteHighlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rev.favoriteHighlights.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-white border border-[#C8A97E]/60 text-[#9A3412]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-[#C8A97E]/40 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="font-display font-bold text-base text-[#1C1917]">
                      {rev.clientName}
                    </h2>
                    <p className="text-xs text-stone-700 font-semibold">
                      {[rev.reviewerBadge, rev.displayDate].filter(Boolean).join(" • ") || rev.eventType}
                    </p>
                  </div>

                  <a
                    href={GOOGLE_REVIEW_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#C84A0A] hover:underline shrink-0"
                  >
                    Google ↗
                  </a>
                </div>

                {rev.adminResponse && (
                  <div className="md:min-h-[128px] rounded-xl bg-white/90 border border-[#C8A97E]/50 border-l-4 border-l-[#EA580C] p-3 text-xs text-stone-800 leading-relaxed">
                    <span className="block font-extrabold uppercase tracking-wider text-[10px] text-[#C84A0A] mb-1">
                      Owner Reply
                    </span>
                    <p>{rev.adminResponse}</p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom Booking Conversion Band */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 border-t border-stone-800/80 bg-[#110E0C]">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Planning an Event in Chicagoland?
          </h2>
          <p className="text-sm sm:text-base text-stone-200 max-w-xl mx-auto leading-relaxed">
            Book Pitmaster Marion Bolden for weddings, corporate luncheons, graduations, and private backyard feasts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
            <Link
              href="/#contact"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.45),_inset_0_0_8px_rgba(255,122,0,0.25)] text-white font-display font-bold text-sm tracking-wider uppercase transition-transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2 whitespace-nowrap [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)]"
            >
              <span>Get a Free Quote</span>
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/#packages"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-[14px] bg-[#FAF8F5] hover:bg-white border-2 border-[#C8A97E] shadow-lg text-[#1C1917] font-display font-bold text-sm tracking-wider uppercase inline-flex items-center justify-center gap-2 whitespace-nowrap transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>View Catering Packages</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

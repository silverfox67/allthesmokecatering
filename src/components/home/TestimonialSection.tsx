"use client";

import React from "react";
import Link from "next/link";
import { useCustomerReviews, GOOGLE_REVIEW_URL } from "@/utils/reviews-store";

export function TestimonialSection() {
  const { reviews } = useCustomerReviews();
  const publishedReviews = reviews.filter((r) => r.status === "published");
  const featuredReviews = publishedReviews
    .filter((r) => r.isFeatured || r.rating === 5)
    .slice(0, 3);

  // If no authentic reviews have been approved yet, silently hide section to preserve integrity
  if (featuredReviews.length === 0) {
    return null;
  }

  const totalReviews = publishedReviews.length;
  const averageRating = (
    publishedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
  ).toFixed(1);

  return (
    <section
      id="reviews"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0A0A0A] via-[#110E0C] to-[#0A0A0A] border-t border-[#291E16] relative overflow-hidden"
    >
      {/* Background Ember Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] max-w-full h-[260px] bg-[#EA580C]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-[#C8A97E]/30 text-[#C8A97E] text-xs font-extrabold uppercase tracking-widest shadow-sm">
            <span>★ VERIFIED GOOGLE REVIEWS ★</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight">
            What Chicago Clients Are Saying
          </h2>

          <p className="text-sm sm:text-base text-stone-200 font-medium leading-relaxed">
            Real feedback from our verified Google Business Profile—authentic post-oak smoke, consistent flavor, and generous portions across Chicagoland.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs sm:text-sm text-stone-200">
            <span className="flex items-center text-amber-400 text-base" aria-label={`${averageRating} out of 5 stars`}>
              ★★★★★
            </span>
            <span className="font-bold text-white">
              {averageRating} Star Average ({totalReviews} {totalReviews === 1 ? "Review" : "Reviews"})
            </span>
            <span className="text-stone-500" aria-hidden="true">•</span>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF7A00] hover:underline font-bold"
            >
              View on Google Maps ↗
            </a>
          </div>
        </div>

        {/* 3-Card Grid (Warm Butcher Paper Surface) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredReviews.map((rev) => (
            <article
              key={rev.id}
              className="p-6 sm:p-7 rounded-2xl bg-[#FAF8F5] border border-[#C8A97E]/60 border-t-4 border-t-[#EA580C] shadow-xl flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Star Row & Google Attribution */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center text-[#EA580C] text-base tracking-wider" aria-label={`${rev.rating} stars`}>
                    {"★".repeat(rev.rating)}
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-[#1C1917] border border-[#C8A97E]/70">
                    {rev.source === "google" ? "Google Review" : "Client Review"}
                  </span>
                </div>

                {/* Verbatim Review Text */}
                <p className="text-sm sm:text-base text-[#1C1917] font-medium leading-relaxed">
                  &ldquo;{rev.reviewText}&rdquo;
                </p>

                {/* Highlight Chips (only when explicitly present) */}
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

              {/* Reviewer Info Subline */}
              <div className="pt-4 mt-5 border-t border-[#C8A97E]/40 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#1C1917]">
                      {rev.clientName}
                    </h3>
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
                  <div className="rounded-xl bg-white/90 border border-[#C8A97E]/50 border-l-4 border-l-[#EA580C] p-3 text-xs text-stone-800 leading-relaxed">
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

        {/* CTA Bar */}
        <div className="pt-2 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
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
  );
}


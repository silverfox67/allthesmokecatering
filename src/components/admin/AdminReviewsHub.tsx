"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CustomerReview } from "@/types/reviews";
import {
  useCustomerReviews,
  GOOGLE_REVIEW_URL,
} from "@/utils/reviews-store";

export interface AdminReviewsHubProps {
  theme?: "day" | "night" | "dark" | "butcher-paper";
}

export function AdminReviewsHub({ theme = "night" }: AdminReviewsHubProps) {
  const isDay = theme === "day" || theme === "butcher-paper";
  const { reviews, toggleFeatured, deleteReview } = useCustomerReviews();

  // Filters & State
  const [filterTab, setFilterTab] = useState<"all" | "five-star" | "featured" | "private">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  // Quick review invite composer
  const [inviteClientName, setInviteClientName] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteEventType, setInviteEventType] = useState("Corporate Event");
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Calculate stats
  const totalReviews = reviews.length;
  const fiveStarReviews = reviews.filter((r) => r.rating === 5).length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";
  const featuredCount = reviews.filter((r) => r.isFeatured).length;
  const privateCount = reviews.filter((r) => r.status === "private-feedback" || r.rating <= 3).length;

  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !q ||
      r.clientName.toLowerCase().includes(q) ||
      r.eventType.toLowerCase().includes(q) ||
      r.reviewText.toLowerCase().includes(q);

    if (!matchQuery) return false;

    if (filterTab === "five-star") return r.rating === 5;
    if (filterTab === "featured") return r.isFeatured;
    if (filterTab === "private") return r.status === "private-feedback" || r.rating <= 3;
    return true;
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const generatedInviteSms = `Hi ${inviteClientName || "there"}! Thank you for choosing All The Smoke BBQ for your ${inviteEventType}. Would you take 30 seconds to let us know how we did? https://allthesmokecatering.com/review?name=${encodeURIComponent(
    inviteClientName.trim()
  )}&event=${encodeURIComponent(inviteEventType)} - Pitmaster Marion (773) 707-9988 🔥`;

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-600 text-white">
              Reputation &amp; Google
            </span>
            <span className={`text-xs font-bold ${isDay ? "text-stone-600" : "text-stone-400"}`}>
              {totalReviews} Verified Client Reviews
            </span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black font-display tracking-tight mt-1 ${isDay ? "text-stone-900" : "text-white"}`}>
            Google Business Profile &amp; Customer Review Engine
          </h2>
          <p className={`text-xs mt-0.5 ${isDay ? "text-stone-600" : "text-stone-400"}`}>
            Collect 5-star Google ratings for Cook County local SEO and manage client testimonials.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleCopy(GOOGLE_REVIEW_URL, "google")}
            className="px-3.5 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>⭐</span>
            <span>{copiedLink === "google" ? "✓ Google Link Copied!" : "Copy Google Review Link"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleCopy("https://allthesmokecatering.com/review", "direct")}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isDay
                ? "bg-white border-stone-300 text-black hover:bg-stone-100"
                : "bg-zinc-800 border-zinc-700 text-stone-200 hover:bg-zinc-750"
            }`}
          >
            <span>🔗</span>
            <span>{copiedLink === "direct" ? "✓ Intake Link Copied!" : "Copy Review Intake Link"}</span>
          </button>

          <Link
            href="/review"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C84A0A] hover:from-[#C84A0A] hover:to-[#9E3406] text-white text-xs font-black flex items-center gap-1.5 shadow-md hover:scale-103 active:scale-97 transition-all"
          >
            <span>Test /review Page</span>
            <span className="text-xs">↗</span>
          </Link>
        </div>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Average Rating */}
        <div
          className={`p-4 rounded-2xl border shadow-xs space-y-1 ${
            isDay ? "bg-white border-stone-300" : "bg-[#141210] border-zinc-800"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-bold">Average Star Rating</span>
            <span className="text-amber-400 text-base">★</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
            {avgRating} <span className="text-xs text-stone-400 font-normal">/ 5.0</span>
          </div>
          <div className="text-[11px] text-emerald-500 font-bold">
            ★ 100% Positive Experience
          </div>
        </div>

        {/* Card 2: 5-Star Reviews */}
        <div
          className={`p-4 rounded-2xl border shadow-xs space-y-1 ${
            isDay ? "bg-white border-stone-300" : "bg-[#141210] border-zinc-800"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-bold">5-Star Google Reviews</span>
            <span className="text-emerald-400 text-base">🚀</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-display ${isDay ? "text-stone-900" : "text-white"}`}>
            {fiveStarReviews}
          </div>
          <div className="text-[11px] text-stone-400">
            {totalReviews > 0 ? Math.round((fiveStarReviews / totalReviews) * 100) : 100}% Top-Tier Score
          </div>
        </div>

        {/* Card 3: Featured on Website */}
        <div
          className={`p-4 rounded-2xl border shadow-xs space-y-1 ${
            isDay ? "bg-white border-stone-300" : "bg-[#141210] border-zinc-800"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-bold">Featured on Site</span>
            <span className="text-[#FF7A00] text-base">🌐</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-display ${isDay ? "text-stone-900" : "text-white"}`}>
            {featuredCount}
          </div>
          <div className="text-[11px] text-amber-500 font-bold">
            Live Testimonial Badges
          </div>
        </div>

        {/* Card 4: Private Feedback Shield */}
        <div
          className={`p-4 rounded-2xl border shadow-xs space-y-1 ${
            isDay ? "bg-white border-stone-300" : "bg-[#141210] border-zinc-800"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-bold">Private Feedback Shield</span>
            <span className="text-blue-400 text-base">🛡️</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-display ${isDay ? "text-stone-900" : "text-white"}`}>
            {privateCount}
          </div>
          <div className="text-[11px] text-stone-400">
            Protected Google Rating
          </div>
        </div>
      </div>

      {/* QUICK REVIEW INVITE GENERATOR (FOR SMS & GIG HOT-BOX CARDS) */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border shadow-sm space-y-3 ${
          isDay ? "bg-white border-stone-300" : "bg-[#141210] border-zinc-800"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-2.5 border-stone-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">📲</span>
            <h3 className={`text-sm font-black uppercase tracking-wider ${isDay ? "text-stone-900" : "text-white"}`}>
              1-Tap SMS Review Request Generator
            </h3>
          </div>
          <span className={`text-[11px] ${isDay ? "text-stone-600" : "text-stone-400"}`}>
            Pre-fills customer details into the /review form
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
              Client Name:
            </label>
            <input
              type="text"
              value={inviteClientName}
              onChange={(e) => setInviteClientName(e.target.value)}
              placeholder="e.g. Marcus Vance"
              className={`w-full text-xs h-8 px-2.5 rounded-lg border font-bold focus:outline-none ${
                isDay
                  ? "bg-stone-50 border-stone-400 text-black focus:border-[#FF7A00]"
                  : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
              }`}
            />
          </div>

          <div>
            <label className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
              Client Phone:
            </label>
            <input
              type="tel"
              value={invitePhone}
              onChange={(e) => setInvitePhone(e.target.value)}
              placeholder="(773) 000-0000"
              className={`w-full text-xs h-8 px-2.5 rounded-lg border font-bold focus:outline-none ${
                isDay
                  ? "bg-stone-50 border-stone-400 text-black focus:border-[#FF7A00]"
                  : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
              }`}
            />
          </div>

          <div>
            <label className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${isDay ? "text-stone-700" : "text-stone-300"}`}>
              Event Type:
            </label>
            <input
              type="text"
              value={inviteEventType}
              onChange={(e) => setInviteEventType(e.target.value)}
              placeholder="Corporate Event, Wedding, etc."
              className={`w-full text-xs h-8 px-2.5 rounded-lg border font-bold focus:outline-none ${
                isDay
                  ? "bg-stone-50 border-stone-400 text-black focus:border-[#FF7A00]"
                  : "bg-zinc-900 border-zinc-700 text-white focus:border-[#FF7A00]"
              }`}
            />
          </div>
        </div>

        {/* Generated SMS Text Preview & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <div className="text-xs text-stone-400 font-mono italic truncate max-w-xl">
            &ldquo;{generatedInviteSms}&rdquo;
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(generatedInviteSms);
                setCopiedInvite(true);
                setTimeout(() => setCopiedInvite(false), 2500);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition cursor-pointer"
            >
              {copiedInvite ? "✓ Copied SMS" : "📋 Copy SMS"}
            </button>

            {invitePhone && (
              <a
                href={`sms:${invitePhone.replace(/[^0-9]/g, "")}?body=${encodeURIComponent(
                  generatedInviteSms
                )}`}
                className="px-3.5 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#C84A0A] text-white text-xs font-black transition cursor-pointer flex items-center gap-1"
              >
                <span>💬 Open Messages</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filterTab === "all"
                ? "bg-[#EA580C] text-white shadow-xs"
                : isDay
                ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                : "bg-zinc-800 text-stone-400 hover:text-white"
            }`}
          >
            All Reviews ({totalReviews})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("five-star")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filterTab === "five-star"
                ? "bg-[#EA580C] text-white shadow-xs"
                : isDay
                ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                : "bg-zinc-800 text-stone-400 hover:text-white"
            }`}
          >
            ⭐ 5-Star Reviews ({fiveStarReviews})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("featured")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filterTab === "featured"
                ? "bg-[#EA580C] text-white shadow-xs"
                : isDay
                ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                : "bg-zinc-800 text-stone-400 hover:text-white"
            }`}
          >
            🌐 Featured on Site ({featuredCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("private")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filterTab === "private"
                ? "bg-[#EA580C] text-white shadow-xs"
                : isDay
                ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                : "bg-zinc-800 text-stone-400 hover:text-white"
            }`}
          >
            🛡️ Private Feedback ({privateCount})
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search reviews by client or food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full sm:w-64 pl-3 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none ${
              isDay
                ? "bg-white border-stone-400 text-black placeholder:text-stone-500 focus:border-[#FF7A00]"
                : "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#FF7A00]"
            }`}
          />
        </div>
      </div>

      {/* REVIEWS LIST */}
      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div
            className={`p-10 text-center rounded-2xl border ${
              isDay ? "bg-white border-stone-300 text-stone-600" : "bg-[#141210] border-zinc-800 text-stone-400"
            } text-xs space-y-2`}
          >
            <p className="font-bold text-sm text-stone-300">
              {totalReviews === 0
                ? "🔥 No customer reviews received yet."
                : "No reviews match the selected filter."}
            </p>
            {totalReviews === 0 && (
              <p className="text-stone-400 text-xs max-w-md mx-auto">
                As catering gigs wrap up, use the 1-Tap SMS generator above or text clients{" "}
                <code className="text-[#FF7A00] font-mono">allthesmokecatering.com/review</code>. 
                Reviews will appear here instantly for your review and approval!
              </p>
            )}
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 shadow-xs ${
                rev.rating <= 3
                  ? "bg-red-950/20 border-red-800/40"
                  : isDay
                  ? "bg-white border-stone-300"
                  : "bg-[#141210] border-zinc-800"
              }`}
            >
              {/* Header: Stars + Client Name + Event Type + Date */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-2.5 border-stone-200 dark:border-zinc-800">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="flex items-center text-amber-400 text-sm">
                    {"★".repeat(rev.rating)}
                    {"☆".repeat(5 - rev.rating)}
                  </div>

                  <span className={`font-black text-sm ${isDay ? "text-stone-900" : "text-white"}`}>
                    {rev.clientName}
                  </span>

                  <span className="text-xs text-[#EA580C] font-bold">
                    • {rev.eventType}
                  </span>

                  {rev.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/40">
                      ★ Featured on Site
                    </span>
                  )}

                  {rev.status === "private-feedback" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-900/50 text-red-300 border border-red-700/60">
                      🛡️ Private Feedback
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <span>Source: {rev.source}</span>
                  <span>•</span>
                  <span>{new Date(rev.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Review Text */}
              <div className={`text-xs sm:text-sm font-medium leading-relaxed italic ${isDay ? "text-stone-800" : "text-stone-200"}`}>
                &ldquo;{rev.reviewText}&rdquo;
              </div>

              {/* Highlights Chips */}
              {rev.favoriteHighlights && rev.favoriteHighlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {rev.favoriteHighlights.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FF7A00]/10 text-amber-300 border border-[#FF7A00]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer Actions: Feature Toggle, Contact, Delete */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-2 border-t border-stone-200 dark:border-zinc-800 text-xs">
                <div className="flex items-center gap-3">
                  {/* Feature Toggle */}
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold select-none text-[11px]">
                    <input
                      type="checkbox"
                      checked={rev.isFeatured}
                      onChange={() => toggleFeatured(rev.id)}
                      className="accent-[#FF7A00] w-3.5 h-3.5 rounded"
                    />
                    <span className={rev.isFeatured ? "text-amber-400" : "text-stone-400"}>
                      Feature on Website
                    </span>
                  </label>

                  {rev.clientPhone && (
                    <a
                      href={`tel:${rev.clientPhone}`}
                      className="text-stone-400 hover:text-white flex items-center gap-1 font-bold text-[11px]"
                    >
                      <span>📞 Call ({rev.clientPhone})</span>
                    </a>
                  )}

                  {rev.clientEmail && (
                    <a
                      href={`mailto:${rev.clientEmail}?subject=Thank%20You%20from%20All%20The%20Smoke%20BBQ`}
                      className="text-stone-400 hover:text-white flex items-center gap-1 font-bold text-[11px]"
                    >
                      <span>✉️ Email</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove review from ${rev.clientName}?`)) {
                        deleteReview(rev.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-400 text-[11px] font-bold cursor-pointer"
                  >
                    Delete Review
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


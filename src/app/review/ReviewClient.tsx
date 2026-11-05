"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATERING_HIGHLIGHT_TAGS, ReviewRating } from "@/types/reviews";
import { addCustomerReview, GOOGLE_REVIEW_URL } from "@/utils/reviews-store";
import { Footer } from "@/components/layout/Footer";

const RATING_DESCRIPTIONS: Record<ReviewRating, { label: string; sub: string; color: string }> = {
  5: {
    label: "Legendary Barbecue! (5 Stars)",
    sub: "Bark, smoke ring, tenderness, and service were absolute perfection.",
    color: "text-amber-400",
  },
  4: {
    label: "Really Great Feast! (4 Stars)",
    sub: "Delicious smokehouse food and solid event execution.",
    color: "text-amber-300",
  },
  3: {
    label: "Decent Meal, Room to Grow (3 Stars)",
    sub: "Food was okay, but some aspects could be improved.",
    color: "text-stone-300",
  },
  2: {
    label: "Needs Improvement (2 Stars)",
    sub: "Did not meet our catering expectations.",
    color: "text-orange-400",
  },
  1: {
    label: "Disappointing Experience (1 Star)",
    sub: "We encountered significant issues with our order or service.",
    color: "text-red-400",
  },
};

export function ReviewClient() {
  const searchParams = useSearchParams();

  // Form State
  const [rating, setRating] = useState<ReviewRating>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [eventType, setEventType] = useState("Corporate Event");
  const [eventDate, setEventDate] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([
    "🔥 14-Hour Texas Brisket Bark",
    "🚚 Punctual & Piping Hot Delivery",
  ]);
  const [permissionToFeature, setPermissionToFeature] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-fill from URL parameters (e.g. from SMS / Email link)
  useEffect(() => {
    if (searchParams) {
      const name = searchParams.get("name");
      const email = searchParams.get("email");
      const phone = searchParams.get("phone");
      const event = searchParams.get("event");
      const date = searchParams.get("date");
      const r = searchParams.get("rating");

      if (name) setClientName(name);
      if (email) setClientEmail(email);
      if (phone) setClientPhone(phone);
      if (event) setEventType(event);
      if (date) setEventDate(date);
      if (r && [1, 2, 3, 4, 5].includes(Number(r))) {
        setRating(Number(r) as ReviewRating);
      }
    }
  }, [searchParams]);

  const handleToggleHighlight = (tag: string) => {
    if (selectedHighlights.includes(tag)) {
      setSelectedHighlights((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectedHighlights((prev) => [...prev, tag]);
    }
  };

  const handleCopyText = () => {
    if (reviewText.trim()) {
      navigator.clipboard.writeText(reviewText.trim());
      setCopiedReview(true);
      setTimeout(() => setCopiedReview(false), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      setErrorMessage("Please enter your name so Marion knows who to thank.");
      return;
    }
    if (!reviewText.trim()) {
      setErrorMessage("Please write a few words about your catering experience.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const isCritical = Number(rating) <= 3;
    const payload = {
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim() || undefined,
      clientPhone: clientPhone.trim() || undefined,
      eventType: eventType.trim(),
      eventDate: eventDate.trim() || undefined,
      rating,
      reviewText: reviewText.trim(),
      favoriteHighlights: selectedHighlights,
      permissionToFeature,
      isFeatured: rating >= 5,
      status: (isCritical ? "private-feedback" : "published") as "private-feedback" | "published",
      source: "web-direct" as const,
    };

    try {
      // 1. Dispatch to serverless Brevo alert endpoint
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // 2. Save locally for instant real-time admin sync
      addCustomerReview(payload);

      // Auto-copy high reviews for easy Google pasting
      if (rating >= 4) {
        navigator.clipboard.writeText(reviewText.trim());
        setCopiedReview(true);
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.warn("API dispatch error, fallback to local storage:", err);
      addCustomerReview(payload);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeDisplayRating = hoverRating !== null ? hoverRating : rating;
  const ratingDetails =
    RATING_DESCRIPTIONS[activeDisplayRating as ReviewRating] || RATING_DESCRIPTIONS[5];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 flex flex-col justify-between">
      {/* TOP HEADER */}
      <header className="border-b border-[#251A0D] bg-[#0E0C0A]/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#1A1613] border border-[#FF7A00]/40 flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
              🔥
            </div>
            <div>
              <span className="font-display font-black text-sm sm:text-base tracking-wider text-white block">
                ALL THE SMOKE
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#FF7A00] font-bold block">
                ★ Live-Fire BBQ &amp; Catering ★
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-bold text-stone-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>← Back to Menu</span>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* SUCCESS / COMPLETION SCREEN */}
        {isSubmitted ? (
          <div className="rounded-3xl border border-[#C8A97E]/30 bg-gradient-to-b from-[#181411] to-[#0D0B0A] p-6 sm:p-10 text-center shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {rating >= 4 ? (
              // 4 or 5 Stars: Celebration & Google Review Redirection
              <>
                <div className="w-20 h-20 rounded-full bg-[#FF7A00]/15 border border-[#FF7A00]/50 flex items-center justify-center text-4xl mx-auto shadow-lg animate-bounce">
                  ⭐
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-black uppercase tracking-wider">
                    <span>✓ Review Recorded Successfully</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
                    Thank You, {clientName}!
                  </h1>
                  <p className="text-sm sm:text-base text-stone-300 max-w-lg mx-auto font-medium leading-relaxed">
                    You are the reason Pitmaster Marion Bolden fires up the hardwood pits before dawn.
                    Your feedback means everything to our independent Chicago smokehouse.
                  </p>
                </div>

                {/* GOOGLE REDIRECTION BOX */}
                <div className="rounded-2xl border border-amber-500/40 bg-[#251A0D]/70 p-5 sm:p-6 text-left space-y-4 max-w-xl mx-auto shadow-inner">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">🚀</span>
                    <div>
                      <h3 className="text-base font-black text-amber-200">
                        Help Other Chicago Families &amp; Companies Discover Us
                      </h3>
                      <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                        We copied your review text to your clipboard! Paste it onto our official Google Business profile in 10 seconds:
                      </p>
                    </div>
                  </div>

                  {/* Review Text Snippet Box */}
                  <div className="p-3.5 rounded-xl bg-black/60 border border-stone-800 text-xs text-stone-200 italic relative">
                    &ldquo;{reviewText}&rdquo;
                    {copiedReview && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                        ✓ Copied to Clipboard
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <a
                      href={GOOGLE_REVIEW_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C84A0A] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg hover:scale-103 active:scale-97 transition-all"
                    >
                      <span>★ Paste Review on Google Business Profile ★</span>
                      <span className="text-xs">↗</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyText}
                      className="w-full sm:w-auto py-3 px-4 rounded-xl border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      {copiedReview ? "✓ Text Copied" : "📋 Copy Text Again"}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/"
                    className="text-xs text-stone-400 hover:text-white underline font-bold"
                  >
                    Return to All The Smoke Catering Homepage
                  </Link>
                </div>
              </>
            ) : (
              // 1 to 3 Stars: Private Feedback Shield with Marion's Personal Follow-Up
              <>
                <div className="w-18 h-18 rounded-full bg-red-950/40 border border-red-700/50 flex items-center justify-center text-3xl mx-auto">
                  🛡️
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/60 text-amber-300 text-xs font-black uppercase tracking-wider">
                    <span>Private Feedback Received</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                    Thank You for Your Honesty, {clientName}.
                  </h1>
                  <p className="text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
                    We take every single smoke session and catering gig to heart. Your honest feedback
                    has been delivered directly to Marion Bolden&rsquo;s personal inbox so we can resolve any shortcomings.
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-[#141210] p-5 text-left space-y-3 max-w-lg mx-auto text-xs text-stone-300">
                  <p className="font-bold text-white">
                    Our Commitment to You:
                  </p>
                  <p className="leading-relaxed">
                    Marion Bolden will review your notes and contact you directly at{" "}
                    <strong>{clientPhone || clientEmail || "your contact"}</strong> to make this right.
                  </p>
                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">Want to speak right now?</span>
                    <a
                      href="tel:7737079988"
                      className="text-[#FF7A00] font-black hover:underline"
                    >
                      📞 Call Marion: (773) 707-9988
                    </a>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/"
                    className="text-xs text-stone-400 hover:text-white underline font-bold"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </>
            )}
          </div>
        ) : (
          // THE REVIEW SUBMISSION INTAKE FORM
          <div className="rounded-3xl border border-[#38281B] bg-gradient-to-b from-[#16120F] to-[#0E0C0A] p-5 sm:p-8 md:p-10 shadow-2xl space-y-7">
            {/* Header Title */}
            <div className="text-center space-y-2 pb-4 border-b border-[#2C1F15]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7A00]/15 border border-[#FF7A00]/40 text-[#FF7A00] text-xs font-black uppercase tracking-widest">
                <span>★ Official Catering Guest Review ★</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
                How Was Your Smokehouse Feast?
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
                Whether Marion catered a corporate summit, wedding reception, or weekend party pan pickup, we would love your honest rating!
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-700 text-red-200 text-xs font-bold flex items-center justify-between">
                <span>⚠️ {errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-red-300 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. STAR RATING SELECTOR */}
              <div className="text-center space-y-2 p-5 rounded-2xl bg-black/40 border border-[#2B1D14]">
                <label className="text-xs font-black uppercase tracking-widest text-[#FF7A00] block">
                  1. Overall Experience Rating:
                </label>

                <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
                  {([1, 2, 3, 4, 5] as ReviewRating[]).map((starVal) => {
                    const isLit = activeDisplayRating >= starVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="text-3xl sm:text-4xl transition-all transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-none p-1"
                        title={`${starVal} Star${starVal > 1 ? "s" : ""}`}
                      >
                        <span className={isLit ? "text-amber-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.5)]" : "text-stone-700"}>
                          ★
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-0.5">
                  <div className={`text-sm sm:text-base font-black ${ratingDetails.color}`}>
                    {ratingDetails.label}
                  </div>
                  <p className="text-xs text-stone-400 italic">
                    {ratingDetails.sub}
                  </p>
                </div>
              </div>

              {/* 2. QUICK-PICK FLAVOR & SERVICE HIGHLIGHTS */}
              <div className="space-y-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-stone-300 block">
                  2. What Stood Out Most? (Select All That Apply):
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATERING_HIGHLIGHT_TAGS.map((tag) => {
                    const isSelected = selectedHighlights.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleHighlight(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-[#EA580C] text-white border-[#FF7A00] shadow-sm scale-102"
                            : "bg-[#181512] text-stone-400 border-zinc-800 hover:border-zinc-700 hover:text-stone-200"
                        }`}
                      >
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. YOUR DETAILED REVIEW COMMENTS */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-stone-300 block">
                  3. Your Comments &amp; Food Highlights:
                </label>
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about the meat tenderness, seasoning, the live-fire presentation, and what your guests said..."
                  className="w-full p-4 rounded-2xl bg-[#141210] border border-zinc-700 text-white placeholder:text-zinc-500 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#FF7A00] leading-relaxed transition-colors"
                />
                <div className="text-[11px] text-stone-500 flex justify-between items-center">
                  <span>Authentic guest feedback helps our Chicago smokehouse thrive.</span>
                  <span>{reviewText.length} characters</span>
                </div>
              </div>

              {/* 4. CLIENT & EVENT DETAILS */}
              <div className="space-y-3 pt-2 border-t border-[#291E16]">
                <label className="text-xs font-black uppercase tracking-wider text-stone-300 block">
                  4. About You &amp; Your Gathering:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-400 block mb-1">
                      Your Name / Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Marcus Vance or Elena R."
                      className="w-full text-xs h-9 px-3 rounded-xl bg-[#141210] border border-zinc-700 text-white font-bold focus:outline-none focus:border-[#FF7A00]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-400 block mb-1">
                      Event Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full text-xs h-9 px-3 rounded-xl bg-[#141210] border border-zinc-700 text-white font-bold focus:outline-none focus:border-[#FF7A00] cursor-pointer"
                    >
                      <option value="Corporate Luncheon">Corporate Luncheon / Summit</option>
                      <option value="Wedding Reception">Wedding Reception / Rehearsal</option>
                      <option value="Game-Day Tailgate">Game-Day / Bears Tailgate</option>
                      <option value="Birthday Celebration">Birthday / Milestone Celebration</option>
                      <option value="Family Reunion">Family Reunion / Backyard Cookout</option>
                      <option value="Church or Community Gig">Church or Community Feast</option>
                      <option value="Graduation Party">Graduation Party</option>
                      <option value="Weekend Pan Pickup">Weekend Party Pan Pickup</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-400 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full text-xs h-9 px-3 rounded-xl bg-[#141210] border border-zinc-700 text-white focus:outline-none focus:border-[#FF7A00]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-400 block mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="(773) 000-0000"
                      className="w-full text-xs h-9 px-3 rounded-xl bg-[#141210] border border-zinc-700 text-white focus:outline-none focus:border-[#FF7A00]"
                    />
                  </div>
                </div>
              </div>

              {/* 5. PERMISSION CHECKBOX */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-300 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={permissionToFeature}
                    onChange={(e) => setPermissionToFeature(e.target.checked)}
                    className="accent-[#FF7A00] w-4 h-4 rounded cursor-pointer mt-0.5"
                  />
                  <span>
                    Permission to feature this review &amp; first name on <strong>allthesmokecatering.com</strong>
                  </span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#EA580C] to-[#C84A0A] hover:from-[#FF7A00] hover:to-[#EA580C] text-white text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-101 active:scale-99 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Submitting Your Feedback...</span>
                    </>
                  ) : (
                    <>
                      <span>🔥</span>
                      <span>Submit Catering Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

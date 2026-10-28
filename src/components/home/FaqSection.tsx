"use client";

import React, { useState } from "react";
import { SITE_CONFIG } from "@/config/site-config";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "booking-timeline",
    question: "How far in advance do I need to book catering in Chicagoland?",
    answer:
      "We recommend booking 2 to 4 weeks in advance for weekend celebrations, weddings, and corporate events to guarantee your date on our smokehouse pit schedule. However, we do accept short-notice catering requests (minimum 48 hours notice) depending on daily smoker capacity.",
  },
  {
    id: "mobile-trailer-rig",
    question: "Does All The Smoke bring the custom mobile smoker trailer to my venue?",
    answer:
      "Yes! For on-site live-fire catering events, our custom mobile trailer smoker rolls straight to your location—delivering authentic oak & hickory smoke, rich aromas, and fresh live carving directly to private estates, corporate parking lots, park districts, and outdoor venues across Chicagoland.",
  },
  {
    id: "guest-count-minimums",
    question: "What is the minimum guest count for catering packages?",
    answer:
      "Our Per-Person Full Buffet spreads (The Smokehouse Feast, The Pitmaster Reserve, and The All-Star Celebration) start at a minimum of 20 guests. For smaller gatherings or game days (12–35 guests), our Turnkey Party Pans are the perfect hot drop-off solution with no per-person minimums.",
  },
  {
    id: "delivery-service-area",
    question: "What areas of Chicago and the suburbs do you serve?",
    answer:
      "We dispatch hot directly from our Northwest Chicago commercial kitchen hub (60634) and serve the entire City of Chicago along with Cook, DuPage, Will, Lake, and Kane counties. You can use our instant Delivery Radius Calculator on this page to check travel fees and minimums for your specific ZIP code.",
  },
  {
    id: "food-presentation-warmers",
    question: "How does the food arrive, and are warming stands/sternos included?",
    answer:
      "All food arrives piping hot in heavy-duty commercial catering pans. Our turnkey packages and full buffet tiers include heavy-duty wire chafing racks, twin sterno flame heaters, and serving utensils so your barbecue stays hot, tender, and smokehouse-fresh throughout your entire event.",
  },
  {
    id: "dietary-pork-free",
    question: "Can you accommodate pork-free, halal, or dietary preferences?",
    answer:
      "Absolutely. Our signature prime beef brisket, smoked half chickens, whole wings, and turkey options are prepared with non-pork custom rubs. We also offer scratch-made vegetarian sides including four-cheese baked mac & cheese, sweet cornbread, creamy potato salad, and seasoned green beans.",
  },
  {
    id: "deposits-payments",
    question: "How do payments, deposits, and final event balances work?",
    answer:
      "To lock in your event date on Marion’s pit schedule, we require a standard 50% deposit via digital invoice, debit/credit card, or Zelle. The remaining balance is due prior to delivery or live-fire on-site dispatch.",
  },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // Google Schema.org FAQPage structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section
      id="faq"
      className="w-full bg-[#F5F0EB] py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-stone-300/70 relative"
      aria-labelledby="faq-heading"
    >
      {/* Google FAQPage JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        
        {/* Compact Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#B45309] block mb-1.5 text-center">
            ★ FREQUENTLY ASKED QUESTIONS ★
          </span>
          <h2
            id="faq-heading"
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1C1917] text-center"
          >
            Smokehouse Catering FAQ
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-2 text-center">
            Quick answers regarding our live-fire mobile rig, delivery minimums, and booking timelines.
          </p>
        </div>

        {/* Single Unified Container with Hairline Dividers */}
        <div className="bg-[#FAF8F5] border border-stone-300/80 rounded-2xl shadow-sm divide-y divide-stone-200/90 overflow-hidden">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="transition-colors hover:bg-white/70">
                <button
                  type="button"
                  id={`faq-btn-${item.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${item.id}`}
                  onClick={() => toggleFaq(item.id)}
                  className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#EA580C]"
                >
                  <span className="font-display text-sm sm:text-base font-bold text-[#1C1917] leading-snug">
                    {item.question}
                  </span>

                  <span
                    className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center transition-transform duration-200 ${
                      isOpen
                        ? "bg-[#EA580C] text-white rotate-180"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`faq-content-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-btn-${item.id}`}
                    className="px-5 sm:px-6 pb-4 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed bg-white/60"
                  >
                    <p className="border-t border-stone-200/60 pt-2.5">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Compact Support Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-center sm:text-left text-xs text-stone-600">
          <span>
            Have a custom event question? Call Marion directly at{" "}
            <a
              href={`tel:${SITE_CONFIG.phoneFormatted}`}
              className="font-bold text-[#B45309] hover:underline"
            >
              {SITE_CONFIG.phone}
            </a>
          </span>
          <a
            href="#contact"
            className="inline-flex h-8 px-3.5 items-center justify-center rounded-lg bg-[#141210] hover:bg-black text-[#C8A97E] hover:text-white font-display text-[11px] font-bold tracking-wider uppercase transition-colors shrink-0"
          >
            Ask In Quote Form ↑
          </a>
        </div>

      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/config/site-config";

export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenQuoteModal = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-quote-modal"));
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#0A0A0A] min-h-[700px] lg:min-h-[820px] flex flex-col justify-between">
      
      {/* 1. FULL-WIDTH BACKGROUND CANVAS (Edge-to-Edge) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-brisket-carve.jpg"
          alt="Pitmaster Marion Bolden carving slow-smoked Texas brisket with deep mahogany bark"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_70%] lg:object-[right_bottom]"
        />
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#0A0A0A]/90 via-[#0A0A0A]/40 to-transparent pointer-events-none z-[1]" />
      </div>
      {/* 2. TOP UTILITY BAR (Phone, Location, Direct Email) */}
      <aside
        aria-label="Service Alert and Dispatch Contacts"
        className="relative z-20 bg-black/60 border-b border-white/10 backdrop-blur-sm text-xs py-2 px-4 sm:px-8"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between sm:justify-center gap-y-2 gap-x-6 text-zinc-300">
          {/* Phone */}
          <a
            href={`tel:${SITE_CONFIG.phoneFormatted}`}
            className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors font-medium"
            aria-label={`Call Marion Bolden at ${SITE_CONFIG.phone}`}
          >
            <svg
              className="h-3.5 w-3.5 text-amber-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{SITE_CONFIG.phone}</span>
          </a>

          <span className="hidden sm:inline text-zinc-700" aria-hidden="true">•</span>

          {/* Location */}
          <div className="inline-flex items-center gap-2 font-medium">
            <svg
              className="h-3.5 w-3.5 text-amber-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Based in Chicago</span>
          </div>

          <span className="hidden sm:inline text-zinc-700" aria-hidden="true">•</span>

          {/* Email */}
          <a
            href={`mailto:${SITE_CONFIG.brandEmail}`}
            className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors font-medium"
            aria-label={`Email Marion Bolden at ${SITE_CONFIG.brandEmail}`}
          >
            <svg
              className="h-3.5 w-3.5 text-amber-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{SITE_CONFIG.brandEmail}</span>
          </a>
        </div>
      </aside>

      {/* 3. MAIN HEADER / NAVIGATION (Full-Width Frosted Backdrop) */}
      <div className="relative z-20 w-full bg-[#0A0A0A]/75 backdrop-blur-md border-b border-zinc-800/50">
        <header className="px-4 sm:px-8 py-3.5 max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Official Master Crest Alone (Clean transparent PNG, no duplicate text box) */}
          <a href="/" className="group flex-shrink-0 relative z-30 -mb-10 sm:-mb-12 lg:-mb-14">
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36 drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)]">
              <Image
                src="/brand/allthesmoke-logo.png"
                alt="All The Smoke BBQ &amp; Catering Official Master Crest"
                fill
                className="object-contain"
                priority
              />
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-7"
          >
            <a
              href="#hero"
              className="text-zinc-200 hover:text-[#C8A97E] text-sm font-medium tracking-wide transition-colors"
            >
              Home
            </a>
            <a
              href="#experience"
              className="text-zinc-200 hover:text-[#C8A97E] text-sm font-medium tracking-wide transition-colors"
            >
              The Experience
            </a>
            <a
              href="#packages"
              className="text-zinc-200 hover:text-[#C8A97E] text-sm font-medium tracking-wide transition-colors"
            >
              Menus
            </a>
            <a
              href="#reels"
              className="text-zinc-200 hover:text-[#C8A97E] text-sm font-medium tracking-wide transition-colors"
            >
              Gallery
            </a>
            <a
              href="#delivery"
              className="text-zinc-200 hover:text-[#C8A97E] text-sm font-medium tracking-wide transition-colors"
            >
              About
            </a>
            <a
              href="#quote"
              onClick={handleOpenQuoteModal}
              className="text-zinc-200 hover:text-[#C8A97E] text-sm font-medium tracking-wide transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* CTA: REQUEST A QUOTE (Header CTA Button) */}
          <div className="flex items-center gap-3">
            <a
              href="#quote"
              onClick={handleOpenQuoteModal}
              className="inline-flex h-11 px-6 items-center justify-center rounded-[12px] bg-gradient-to-b from-[#EA580C] to-[#9A3412] border border-[#FF8C38]/80 shadow-[0_0_20px_rgba(234,88,12,0.55)] font-display text-sm font-black tracking-wider text-white uppercase transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              REQUEST A QUOTE
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="relative z-30 lg:hidden bg-zinc-950 border-b border-zinc-800 px-6 py-4 space-y-3 text-sm font-semibold">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-[#C8A97E]"
          >
            Home
          </a>
          <a
            href="#packages"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-[#C8A97E]"
          >
            Menus
          </a>
          <a
            href="#reels"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-[#C8A97E]"
          >
            Gallery
          </a>
          <a
            href="#delivery"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-[#C8A97E]"
          >
            About
          </a>
          <a
            href="#quote"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleOpenQuoteModal(e);
            }}
            className="block text-[#C8A97E] font-bold"
          >
            Contact
          </a>
        </div>
      )}

      {/* 4. FOREGROUND CONTENT LAYER (Positioned over clean upper-left quadrant) */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 w-full flex-1 flex flex-col justify-center">
        <div className="max-w-xl lg:max-w-2xl space-y-5 sm:space-y-6">
          
          {/* Subheading Star Kicker */}
          <p className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-[0.2em] text-[#C8A97E] uppercase">
            <span>★</span>
            <span>CHICAGOLAND’S PREMIER LIVE-FIRE CATERING</span>
            <span>★</span>
          </p>

          {/* Main Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#F4EFEA] leading-[0.95]">
            Elevated BBQ &amp; <br />
            Smokehouse Catering <br />
            For Your Special Events
          </h1>

          {/* Value Proposition Subhead */}
          <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[#D8D2C6]">
            Bringing the rich, authentic artistry of slow-smoked brisket, ribs, and theatrical culinary 
            experiences to your weddings, corporate gatherings, and private celebrations.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#packages"
              className="inline-flex h-[54px] px-8 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#EA580C] to-[#9A3412] border border-[#FF8C38]/80 shadow-[0_0_24px_rgba(234,88,12,0.65)] font-display text-lg font-black tracking-wider text-white uppercase transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              VIEW OUR MENUS
            </a>
            <a
              href="#quote"
              onClick={handleOpenQuoteModal}
              className="inline-flex h-[54px] px-8 items-center justify-center rounded-[14px] bg-[#0A0A0A]/70 border border-[#C8A97E]/70 backdrop-blur-md font-display text-lg font-black tracking-wider text-[#C8A97E] uppercase transition-colors hover:border-[#FF8C38] hover:text-white"
            >
              BOOK YOUR DATE
            </a>
          </div>

        </div>
      </div>

      {/* 5. UNIFIED TRUST BAR (Single Tier React Component) */}
      <div className="relative z-20 border-t border-zinc-800/80 bg-black/80 backdrop-blur-md">
        <div className="w-full max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Feature 1: On-Site Pitmasters */}
          <div className="flex items-center gap-3.5">
            <svg className="h-8 w-8 text-[#C8A97E] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 17c3.5-1.5 6.5-2 10-2s6.5.5 10 2M6.5 15.2c0-4.2 1.5-8.2 5.5-8.2s5.5 4 5.5 8.2" />
            </svg>
            <span className="font-display text-lg font-bold tracking-wide text-[#C8A97E]">On-Site Pitmasters</span>
          </div>

          {/* Feature 2: Tailored Event Menus */}
          <div className="flex items-center gap-3.5">
            <svg className="h-8 w-8 text-[#C8A97E] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="font-display text-lg font-bold tracking-wide text-[#C8A97E]">Tailored Event Menus</span>
          </div>

          {/* Feature 3: Full-Service Hospitality */}
          <div className="flex items-center gap-3.5">
            <svg className="h-8 w-8 text-[#C8A97E] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="font-display text-lg font-bold tracking-wide text-[#C8A97E]">Full-Service Hospitality</span>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;

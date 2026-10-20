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

        {/* Targeted Radial Scrim: Darkens upper-left quadrant directly behind headline text, preserving bottom-left glowing coals & right-side live fire */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(10,10,10,0.95)_0%,rgba(10,10,10,0.75)_45%,transparent_80%)] pointer-events-none" />
        
        {/* Subtle Top Vignette for Nav Area */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0A0A0A]/80 to-transparent pointer-events-none" />
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

      {/* 3. MAIN HEADER / NAVIGATION (Master Circular Crest Alone on Left, Nav Links on Right) */}
      <header className="relative z-20 px-4 sm:px-8 pt-3 pb-2 max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Official Master Crest Alone (Clean transparent PNG, no duplicate text box) */}
        <a href="/" className="group flex-shrink-0">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)]">
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
          className="hidden lg:flex items-center gap-7 text-sm font-semibold text-zinc-300"
        >
          <a href="#hero" className="hover:text-amber-400 transition-colors">
            Home
          </a>
          <a href="#experience" className="hover:text-amber-400 transition-colors">
            The Experience
          </a>
          <a href="#packages" className="hover:text-amber-400 transition-colors">
            Menus
          </a>
          <a href="#reels" className="hover:text-amber-400 transition-colors">
            Gallery
          </a>
          <a href="#delivery" className="hover:text-amber-400 transition-colors">
            About
          </a>
          <a
            href="#quote"
            onClick={handleOpenQuoteModal}
            className="hover:text-amber-400 transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* CTA: REQUEST A QUOTE (Warm Amber Neon Glow) */}
        <div className="flex items-center gap-3">
          <a
            href="#quote"
            onClick={handleOpenQuoteModal}
            className="relative inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-400/50 hover:brightness-110 hover:shadow-[0_0_30px_rgba(245,158,11,0.7)] transition-all active:scale-95"
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="relative z-30 lg:hidden bg-zinc-950 border-b border-zinc-800 px-6 py-4 space-y-3 text-sm font-semibold">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-amber-400"
          >
            Home
          </a>
          <a
            href="#packages"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-amber-400"
          >
            Menus
          </a>
          <a
            href="#reels"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-amber-400"
          >
            Gallery
          </a>
          <a
            href="#delivery"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-amber-400"
          >
            About
          </a>
          <a
            href="#quote"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleOpenQuoteModal(e);
            }}
            className="block text-amber-400 font-bold"
          >
            Contact
          </a>
        </div>
      )}

      {/* 4. FOREGROUND CONTENT LAYER (Positioned over clean upper-left quadrant) */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 w-full flex-1 flex flex-col justify-center">
        <div className="max-w-xl lg:max-w-2xl space-y-5 sm:space-y-6">
          
          {/* Subheading Star Kicker */}
          <p className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-[0.2em] text-amber-500 uppercase">
            <span>★</span>
            <span>CHICAGOLAND’S PREMIER LIVE-FIRE CATERING</span>
            <span>★</span>
          </p>

          {/* Main Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.95]">
            Elevated BBQ &amp; <br />
            Smokehouse Catering <br />
            For Your Special Events
          </h1>

          {/* Value Proposition Subhead */}
          <p className="max-w-xl text-base sm:text-lg leading-relaxed text-zinc-300">
            Bringing the rich, authentic artistry of slow-smoked brisket, ribs, and theatrical culinary 
            experiences to your weddings, corporate gatherings, and private celebrations.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#packages"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 px-8 py-4 text-sm font-black tracking-wider text-white uppercase shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all hover:brightness-110 hover:shadow-[0_0_35px_rgba(245,158,11,0.7)] hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
            >
              VIEW OUR MENUS
            </a>
            <a
              href="#quote"
              onClick={handleOpenQuoteModal}
              className="inline-flex items-center justify-center rounded-lg border border-amber-600/40 bg-black/60 px-8 py-4 text-sm font-black tracking-wider text-zinc-200 uppercase backdrop-blur-sm transition-all hover:border-amber-400 hover:text-white hover:bg-black/80 min-h-[48px]"
            >
              BOOK YOUR DATE
            </a>
          </div>

          {/* Credential Checks */}
          <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Exclusive Booked-to-Order
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              48–72 Hr Pit Curing
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Marion Bolden, Lead Pitmaster
            </div>
          </div>

        </div>
      </div>

      {/* 5. EXACT TRUST BAR STYLING (Target Mockup Specification) */}
      <div className="relative z-20 bg-black/80 backdrop-blur-md border-t border-amber-900/40">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            
            {/* Feature 1: On-Site Pitmasters */}
            <div className="flex items-center justify-center gap-3 text-center sm:justify-start">
              <svg className="h-5 w-5 text-[#D4AF37] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm font-semibold tracking-wide text-zinc-200">On-Site Pitmasters</span>
            </div>

            {/* Feature 2: Tailored Event Menus */}
            <div className="flex items-center justify-center gap-3 text-center">
              <svg className="h-5 w-5 text-[#D4AF37] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="text-sm font-semibold tracking-wide text-zinc-200">Tailored Event Menus</span>
            </div>

            {/* Feature 3: Full-Service Hospitality */}
            <div className="flex items-center justify-center gap-3 text-center sm:justify-end">
              <svg className="h-5 w-5 text-[#D4AF37] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-semibold tracking-wide text-zinc-200">Full-Service Hospitality</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

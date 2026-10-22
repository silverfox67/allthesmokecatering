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
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between sm:justify-center gap-y-2 gap-x-6 sm:gap-x-8 text-[#C8A97E]">
          {/* Phone */}
          <a
            href={`tel:${SITE_CONFIG.phoneFormatted}`}
            className="inline-flex items-center gap-2 text-[#C8A97E] hover:text-[#FF7A00] transition-colors font-medium"
            aria-label={`Call Marion Bolden at ${SITE_CONFIG.phone}`}
          >
            <svg
              className="h-3.5 w-3.5 text-[#C8A97E] shrink-0"
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

          {/* Location */}
          <div className="inline-flex items-center gap-2 text-[#C8A97E] font-medium">
            <svg
              className="h-3.5 w-3.5 text-[#C8A97E] shrink-0"
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

          {/* Email */}
          <a
            href={`mailto:${SITE_CONFIG.brandEmail}`}
            className="inline-flex items-center gap-2 text-[#C8A97E] hover:text-[#FF7A00] transition-colors font-medium"
            aria-label={`Email Marion Bolden at ${SITE_CONFIG.brandEmail}`}
          >
            <svg
              className="h-3.5 w-3.5 text-[#C8A97E] shrink-0"
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
      <div className="relative z-20 w-full bg-[#0A0A0A]/75 backdrop-blur-md border-b border-zinc-800/50 overflow-visible">
        <header className="px-4 sm:px-8 py-3.5 max-w-7xl mx-auto w-full flex items-center justify-between relative overflow-visible">
          {/* Official Master Crest Alone Breakout */}
          <div className="absolute top-2 left-4 sm:left-8 z-50">
            <a
              href="/"
              className="block relative w-[150px] h-[150px] sm:w-[175px] sm:h-[175px] lg:w-[200px] lg:h-[200px] drop-shadow-[0_16px_32px_rgba(0,0,0,0.95)] z-50 transition-transform hover:scale-105"
            >
              <Image
                src="/brand/allthesmoke-logo.png"
                alt="All The Smoke BBQ &amp; Catering Official Emblem"
                fill
                priority
                className="object-contain"
              />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-7 pl-48 lg:pl-56 overflow-visible"
          >
            <a
              href="#hero"
              className="text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
            >
              Home
            </a>
            <a
              href="#experience"
              className="text-[#C8A97E] hover:text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
            >
              The Experience
            </a>
            <a
              href="#packages"
              className="text-[#C8A97E] hover:text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
            >
              Menus
            </a>
            <a
              href="#reels"
              className="text-[#C8A97E] hover:text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
            >
              Gallery
            </a>
            <a
              href="#delivery"
              className="text-[#C8A97E] hover:text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
            >
              About
            </a>
            <a
              href="#quote"
              onClick={handleOpenQuoteModal}
              className="text-[#C8A97E] hover:text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* CTA: REQUEST A QUOTE (Header CTA Button) */}
          <div className="ml-auto lg:ml-0 flex items-center gap-3">
            <a
              href="#quote"
              onClick={handleOpenQuoteModal}
              className="inline-flex h-11 px-6 items-center justify-center rounded-[12px] bg-gradient-to-b from-[#EA580C] to-[#9A3412] border-2 border-[#FF7A00] shadow-[0_0_16px_rgba(255,106,0,0.45)] font-display text-base sm:text-lg font-bold tracking-wide text-white uppercase [text-shadow:_0_2px_4px_rgba(0,0,0,0.9)] transition-all hover:scale-[1.02] active:scale-[0.98]"
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
            className="block text-[#FF7A00]"
          >
            Home
          </a>
          <a
            href="#packages"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#C8A97E] hover:text-[#FF7A00]"
          >
            Menus
          </a>
          <a
            href="#reels"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#C8A97E] hover:text-[#FF7A00]"
          >
            Gallery
          </a>
          <a
            href="#delivery"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#C8A97E] hover:text-[#FF7A00]"
          >
            About
          </a>
          <a
            href="#quote"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleOpenQuoteModal(e);
            }}
            className="block text-[#C8A97E] hover:text-[#FF7A00] font-bold"
          >
            Contact
          </a>
        </div>
      )}

      {/* 4. FOREGROUND CONTENT LAYER (Positioned over clean upper-left quadrant) */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 w-full flex-1 flex flex-col justify-center">
        <div className="max-w-xl lg:max-w-2xl space-y-5 sm:space-y-6 pt-16 sm:pt-20 lg:pt-24 flex flex-col justify-center">
          
          {/* Subheading Star Kicker */}
          <p className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-[0.2em] text-[#C8A97E] uppercase">
            <span>★</span>
            <span>CHICAGOLAND’S PREMIER LIVE-FIRE CATERING</span>
            <span>★</span>
          </p>

          {/* Main Headline */}
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-[#F4EFEA] tracking-tight leading-[1.08]">
            <span className="block">Elevated BBQ &amp;</span>
            <span className="block">Smokehouse Catering</span>
            <span className="block">For Your Special Events</span>
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
              className="inline-flex h-[48px] px-7 items-center justify-center rounded-[12px] bg-gradient-to-b from-[#EA580C] to-[#9A3412] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,106,0,0.45)] font-display text-xl sm:text-2xl font-bold tracking-wide text-white uppercase [text-shadow:_0_2px_4px_rgba(0,0,0,0.9)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              VIEW OUR MENUS
            </a>
            <a
              href="#quote"
              onClick={handleOpenQuoteModal}
              className="inline-flex h-[48px] px-7 items-center justify-center rounded-[12px] bg-black/60 border border-[#C8A97E] backdrop-blur-md font-display text-xl sm:text-2xl font-bold tracking-wide text-[#C8A97E] uppercase [text-shadow:_0_2px_4px_rgba(0,0,0,0.95)] transition-all hover:border-[#FF7A00] hover:text-white"
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

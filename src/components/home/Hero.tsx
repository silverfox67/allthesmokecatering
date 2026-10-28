"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/config/site-config";
import { HeroPlatterSlider } from "./HeroPlatterSlider";

export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenQuoteModal = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-quote-modal"));
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#0A0A0A] min-h-[720px] lg:min-h-[850px] flex flex-col justify-between">
      
      {/* 1. FULL-WIDTH BACKGROUND CANVAS (Edge-to-Edge) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-brisket-carve.jpg"
          alt="Pitmaster Marion Bolden carving slow-smoked Texas brisket with deep mahogany bark"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_70%] lg:object-[right_bottom] opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/90 to-[#0A0A0A]/75 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#0A0A0A]/95 via-[#0A0A0A]/50 to-transparent pointer-events-none z-[1]" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none z-[1]" />
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
            aria-label={`Email All The Smoke Catering at ${SITE_CONFIG.brandEmail}`}
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
          <div className="absolute top-1 sm:top-2 left-3 sm:left-8 z-50">
            <a
              href="/"
              className="block relative w-[76px] h-[76px] xs:w-[92px] xs:h-[92px] sm:w-[150px] sm:h-[150px] lg:w-[200px] lg:h-[200px] drop-shadow-[0_16px_32px_rgba(0,0,0,0.95)] z-50 transition-transform hover:scale-105"
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
              href="#packages"
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
              href="/gallery"
              className="text-[#C8A97E] hover:text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
            >
              Gallery
            </a>
            <a
              href="#about"
              className="text-[#C8A97E] hover:text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-[#C8A97E] hover:text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* CTA: REQUEST A QUOTE (Header CTA Button) */}
          <div className="ml-auto lg:ml-0 flex items-center gap-2 sm:gap-3">
            <a
              href="#contact"
              className="inline-flex h-9 sm:h-11 px-3 sm:px-6 items-center justify-center rounded-[12px] sm:rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] font-display text-xs sm:text-base lg:text-lg font-bold tracking-wider text-white uppercase [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              <span className="hidden sm:inline">REQUEST A QUOTE</span>
              <span className="sm:hidden">GET QUOTE</span>
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
            The Experience
          </a>
          <a
            href="#packages"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#C8A97E] hover:text-[#FF7A00]"
          >
            Menus
          </a>
          <a
            href="/gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#C8A97E] hover:text-[#FF7A00]"
          >
            Gallery
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#C8A97E] hover:text-[#FF7A00]"
          >
            About
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#C8A97E] hover:text-[#FF7A00] font-bold"
          >
            Contact
          </a>
        </div>
      )}

      {/* 4. FOREGROUND CONTENT LAYER (2-Column Grid: Copy on Left / Interactive Platter Showcase on Right) */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center pt-12 sm:pt-16 lg:pt-18">
          
          {/* Left Column: Headline, Value Proposition & Actions */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-5 sm:space-y-6 flex flex-col justify-center">
            
            {/* Subheading Star Kicker Pill */}
            <div>
              <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm">
                ★ CHICAGOLAND’S PREMIER LIVE-FIRE CATERING ★
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-5xl xl:text-6xl text-white tracking-tight leading-[1.1]">
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
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <a
                href="#packages"
                className="w-full sm:w-auto inline-flex h-[48px] px-7 items-center justify-center rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] font-display text-lg sm:text-xl font-bold tracking-wider text-white uppercase [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-center"
              >
                VIEW OUR MENUS
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex h-[48px] px-7 items-center justify-center rounded-[14px] bg-black/60 border border-[#C8A97E] backdrop-blur-md shadow-[0_0_12px_rgba(200,169,126,0.15)] font-display text-lg sm:text-xl font-bold tracking-wider text-[#C8A97E] uppercase [text-shadow:_0_1px_2px_rgba(0,0,0,0.95)] transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-[#FF7A00] hover:text-white hover:bg-black/80 hover:shadow-[0_0_18px_rgba(255,122,0,0.4)] cursor-pointer text-center"
              >
                BOOK YOUR DATE
              </a>
            </div>

            {/* Quick Proof Highlights */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-zinc-300 font-medium">
              <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                <span className="text-[#FF7A00]">🪵</span> 100% Hardwood Oak &amp; Cherry
              </span>
              <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                <span className="text-[#FF7A00]">🚚</span> Mobile Single-Axle Rig On-Site
              </span>
              <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                <span className="text-amber-400">★</span> 5-Star Greater Chicagoland
              </span>
            </div>

          </div>

          {/* Right Column: 3-Platter Auto-Play Slider Showcase */}
          <div className="lg:col-span-6 xl:col-span-6 w-full flex justify-center lg:justify-end">
            <HeroPlatterSlider />
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

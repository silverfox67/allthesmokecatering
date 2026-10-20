"use client";

import React, { useState, useRef } from "react";
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
    <div className="relative w-full bg-[#0A0A0A] text-neutral-100 overflow-hidden border-b border-white/10">
      {/* Ambient Smoke & Fire Backlight Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 right-0 h-[650px] w-[650px] -translate-y-1/2 rounded-full bg-amber-600/15 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/4 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-orange-700/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 right-1/4 h-[350px] w-[350px] rounded-full bg-amber-500/10 blur-[100px]"
      />

      {/* 1. Top Utility Bar: Phone, Location, Direct Email with sleek amber SVGs */}
      <aside
        aria-label="Service Alert and Dispatch Contacts"
        className="bg-[#0e0e0e] border-b border-white/10 text-xs py-2 px-4 sm:px-8"
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

      {/* 2. Main Navigation Bar with the Master Circular Crest */}
      <header className="px-4 sm:px-8 py-4 sm:py-5 max-w-7xl mx-auto flex items-center justify-between relative z-20">
        {/* Brand Logo & Name */}
        <a href="/" className="flex items-center gap-3.5 group">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_4px_24px_rgba(245,158,11,0.35)]">
            <Image
              src="/brand/allthesmoke-logo.png"
              alt="All The Smoke BBQ & Catering Official Master Crest"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-wide text-white uppercase leading-none">
              ALL THE SMOKE
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-amber-500 uppercase leading-tight mt-0.5">
              BBQ &amp; CATERING • CHICAGO
            </span>
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

        {/* CTA Button: REQUEST A QUOTE (Warm Amber Neon Glow) */}
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
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-6 py-4 space-y-3 text-sm font-semibold">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-amber-400"
          >
            Home
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-amber-400"
          >
            The Experience
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

      {/* 3. Hero Main Section: Split Layout (Left Copy & CTAs, Right Unboxed Documentary Visual) */}
      <section id="hero" className="relative px-4 sm:px-8 pt-4 pb-12 sm:pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Core Positioning, Headline & Dual CTAs */}
          <div className="z-10 lg:col-span-7 space-y-6 sm:space-y-7">
            
            {/* Star Kicker: ★ CHICAGOLAND'S PREMIER LIVE-FIRE CATERING ★ */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-[0.2em] text-amber-500 uppercase">
              <span className="text-amber-400">★</span>
              <span>CHICAGOLAND’S PREMIER LIVE-FIRE CATERING</span>
              <span className="text-amber-400">★</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-white leading-[0.94]">
              Elevated BBQ &amp;<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                Smokehouse Catering
              </span><br />
              For Your Special Events
            </h1>

            {/* Subhead */}
            <p className="max-w-xl text-base sm:text-lg leading-relaxed text-zinc-300">
              Bringing the rich, authentic artistry of slow-smoked brisket, ribs, and theatrical culinary
              experiences to your weddings, corporate gatherings, and private celebrations.
            </p>

            {/* Action Buttons: VIEW OUR MENUS & BOOK YOUR DATE */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary: VIEW OUR MENUS (Glowing amber/orange gradient) */}
              <a
                href="#packages"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-extrabold text-white uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.7)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[48px]"
              >
                VIEW OUR MENUS
              </a>

              {/* Secondary: BOOK YOUR DATE (Translucent dark with amber border) */}
              <a
                href="#quote"
                onClick={handleOpenQuoteModal}
                className="inline-flex items-center justify-center rounded-lg border border-amber-600/40 bg-zinc-950/60 px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-extrabold text-zinc-200 hover:text-white hover:border-amber-400 hover:bg-amber-500/10 uppercase tracking-wider backdrop-blur-sm transition-all min-h-[48px]"
              >
                BOOK YOUR DATE
              </a>
            </div>

            {/* Credential Checks */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-400 font-medium pt-2">
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

          {/* Right Column: Borderless Uncontained Documentary Visual */}
          <div className="relative lg:col-span-5">
            {/* Seamless edge blend wrapper — ZERO BORDERS, ZERO CARDS, ZERO PICTURE FRAMES */}
            <div className="relative h-[420px] w-full sm:h-[500px] lg:h-[560px]">
              <Image
                src="/images/hero-brisket-carve.jpg"
                alt="Pitmaster Marion Bolden carving slow-smoked Texas brisket with deep mahogany bark"
                fill
                priority
                className="object-cover object-center [mask-image:radial-gradient(ellipse_at_center,black_65%,transparent_100%)]"
              />
              {/* Subtle vignette gradient that melts dark cutting board into #0A0A0A */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-85" />
            </div>

            {/* Authenticity Caption Pill */}
            <div className="absolute bottom-3 right-2 flex items-center gap-2 rounded-full border border-amber-500/30 bg-black/85 px-3.5 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wider text-zinc-300 uppercase">
                Verified Documentary Smoke • Natural Bark &amp; Smoke Ring
              </span>
            </div>
          </div>

        </div>

        {/* 4. The Elevated Trust Bar — REFINED VECTOR SVGs, ZERO EMOJIS */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
          
          {/* Item 1: On-Site Pitmasters (Chef / Pitmaster Hat SVG) */}
          <div className="flex items-center gap-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide text-zinc-100 uppercase">On-Site Pitmasters</h3>
              <p className="mt-1 text-xs text-zinc-400">Live-fire smoker trailer &amp; pitmaster theatrics for rallies and weddings.</p>
            </div>
          </div>

          {/* Item 2: Tailored Event Menus (Menu / Clipboard SVG) */}
          <div className="flex items-center gap-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide text-zinc-100 uppercase">Tailored Event Menus</h3>
              <p className="mt-1 text-xs text-zinc-400">Custom smokehouse packages, whole briskets, and artisan scratch sides.</p>
            </div>
          </div>

          {/* Item 3: Full-Service Hospitality (Serving / Hospitality SVG) */}
          <div className="flex items-center gap-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide text-zinc-100 uppercase">Full-Service Hospitality</h3>
              <p className="mt-1 text-xs text-zinc-400">Cambro heated delivery at 150°F+, chafing setup, or staffed carving stations.</p>
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}

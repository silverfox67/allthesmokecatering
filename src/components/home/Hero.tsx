"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/config/site-config";

export function Hero() {
  const magneticBtnRef = useRef<HTMLAnchorElement>(null);
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!magneticBtnRef.current) return;
    const rect = magneticBtnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.28;
    const deltaY = (e.clientY - centerY) * 0.28;
    setBtnOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setBtnOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full bg-obsidian text-neutral-100 overflow-hidden border-b border-white/10">
      {/* 1. Top Utility Bar */}
      <aside
        aria-label="Service Alert and Dispatch Contacts"
        className="bg-charcoal border-b border-white/10 text-xs py-2.5 px-4 sm:px-8"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-neutral-300">
          <div className="flex items-center gap-2">
            <span className="text-ember font-medium flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-ember animate-pulse" aria-hidden="true" />
              📍 Serving Greater Chicago &amp; Suburbs | Kitchen Hub: 60634
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${SITE_CONFIG.phoneFormatted}`}
              className="text-ember font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-ember rounded px-1 transition-colors"
              aria-label={`Call All The Smoke Catering at ${SITE_CONFIG.phone}`}
            >
              📞 {SITE_CONFIG.phone}
            </a>
            <span className="text-neutral-500" aria-hidden="true">|</span>
            <a
              href={`mailto:${SITE_CONFIG.brandEmail}`}
              className="text-neutral-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-ember rounded px-1 transition-colors"
              aria-label={`Email Marion Bolden at ${SITE_CONFIG.brandEmail}`}
            >
              {SITE_CONFIG.brandEmail}
            </a>
          </div>
        </div>
      </aside>

      {/* Main Header / Navigation */}
      <header className="px-4 sm:px-8 py-5 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {/* 2. Official Badge: Top-left circular crest */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 drop-shadow-[0_4px_16px_rgba(245,158,11,0.25)]">
            <Image
              src="/brand/ats-full-badge.png"
              alt="All The Smoke BBQ & Catering Official Circular Crest"
              width={64}
              height={64}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <div>
            <span className="font-display text-2xl sm:text-3xl tracking-wide text-white block leading-none">
              ALL THE SMOKE
            </span>
            <span className="text-[11px] sm:text-xs tracking-widest text-ember uppercase font-bold">
              BBQ &amp; CATERING • CHICAGO
            </span>
          </div>
        </div>

        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-8 text-sm font-semibold text-neutral-300">
          <a href="#packages" className="hover:text-ember transition-colors">
            Catering Packages
          </a>
          <a href="#delivery" className="hover:text-ember transition-colors">
            Delivery Zones
          </a>
          <a href="#reels" className="hover:text-ember transition-colors">
            Pitmaster Reels
          </a>
          <a href="#quote" onClick={(e) => { e.preventDefault(); if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("open-quote-modal")); }} className="hover:text-ember transition-colors">
            Quote Inquiry
          </a>
        </nav>

        <a
          href="#quote" onClick={(e) => { e.preventDefault(); if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("open-quote-modal")); }}
          className="hidden sm:inline-flex items-center justify-center bg-gradient-to-r from-ember to-ember-dark text-obsidian font-extrabold text-sm px-6 py-2.5 rounded-lg shadow-lg hover:brightness-110 transition-all min-h-[48px]"
        >
          BOOK EVENT
        </a>
      </header>

      {/* Hero Section Split Layout */}
      <section className="relative px-4 sm:px-8 pt-6 pb-16 sm:pb-24 max-w-7xl mx-auto">
        {/* Ambient fire glow background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 bg-ember/15 blur-[120px] rounded-full"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Dual CTAs */}
          <div className="lg:col-span-7 space-y-7 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-charcoal border border-ember/40 text-ember text-xs font-bold uppercase tracking-wider shadow-inner">
              <span className="w-2 h-2 rounded-full bg-ember animate-ping" aria-hidden="true" />
              Chicagoland Premier Live-Fire Smoker Rig
            </div>

            {/* 3. Headline */}
            <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[0.95]">
              Elevated Live-Fire &amp; Smokehouse Catering For Your Special Events
            </h1>

            {/* 4. Subhead */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
              Bringing authentic slow-smoked brisket, ribs, and theatrical culinary experiences to your weddings, corporate gatherings, and private celebrations.
            </p>

            {/* 5. Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              {/* Amber button with spring magnetic tracking */}
              <a
                ref={magneticBtnRef}
                href="#quote" onClick={(e) => { e.preventDefault(); if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("open-quote-modal")); }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`,
                  transition: btnOffset.x === 0 ? "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "transform 0.08s ease-out",
                }}
                className="relative inline-flex items-center justify-center bg-gradient-to-r from-ember to-ember-dark text-obsidian font-extrabold text-base px-8 py-4 rounded-xl shadow-[0_10px_25px_rgba(245,158,11,0.35)] hover:shadow-[0_15px_35px_rgba(245,158,11,0.5)] hover:brightness-110 min-h-[48px] uppercase tracking-wider"
              >
                REQUEST A QUOTE
              </a>

              {/* Glass border button */}
              <a
                href="#packages"
                className="inline-flex items-center justify-center border border-white/20 hover:border-ember bg-white/5 hover:bg-white/10 backdrop-blur-md text-white hover:text-ember font-bold text-base px-8 py-4 rounded-xl transition-all shadow-md min-h-[48px] uppercase tracking-wider"
              >
                EXPLORE PACKAGES
              </a>
            </div>

            {/* Micro details */}
            <div className="flex items-center gap-4 text-xs text-neutral-400 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="text-ember font-bold">✓</span> Exclusive Booked-to-Order
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-ember font-bold">✓</span> 48–72 Hr Pit Curing
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-ember font-bold">✓</span> Marion Bolden Pitmaster
              </span>
            </div>
          </div>

          {/* Right Column: 6. Documentary Image Placement */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-charcoal shadow-2xl group">
              {/* Outer Ember Glow */}
              <div
                aria-hidden="true"
                className="absolute -inset-1 bg-gradient-to-r from-ember/30 to-crimson/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-700"
              />

              <div className="relative rounded-3xl overflow-hidden bg-charcoal">
                <Image
                  src="/hero/atsc-hero-brisket-carve.jpg"
                  alt="Authentic slow-smoked brisket carving with natural hardwood smoke and ember embers"
                  width={1200}
                  height={1000}
                  className="w-full h-[380px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  priority
                />

                {/* Documentary Badge Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent p-5 pt-12 flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-ember uppercase bg-obsidian/70 backdrop-blur-sm border border-ember/30 px-2 py-0.5 rounded">
                      ● Verified Documentary Shoot
                    </span>
                    <p className="text-xs font-semibold text-white">
                      Hickory-Smoked Prime Texas Cut
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      3401 N Orange Ave Hub • Natural Bark &amp; Smoke Ring
                    </p>
                  </div>

                  <div className="w-12 h-12 relative flex-shrink-0 bg-obsidian/80 backdrop-blur-md rounded-full p-1.5 border border-white/20">
                    <Image
                      src="/brand/ats-monogram.png"
                      alt="ATS Monogram Crest"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Trust Bar */}
        <div className="mt-14 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-charcoal/60 border border-white/5">
              <div className="w-12 h-12 rounded-lg bg-ember/10 border border-ember/30 flex items-center justify-center text-ember text-2xl flex-shrink-0">
                🪵
              </div>
              <div>
                <span className="font-display text-xl text-white block">
                  100% HARDWOOD FIRE
                </span>
                <span className="text-xs text-neutral-400">
                  Zero gas or artificial briquettes. Aged hickory, post oak, and fruitwood only.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-charcoal/60 border border-white/5">
              <div className="w-12 h-12 rounded-lg bg-ember/10 border border-ember/30 flex items-center justify-center text-ember text-2xl flex-shrink-0">
                🚛
              </div>
              <div>
                <span className="font-display text-xl text-white block">
                  MOBILE SMOKER TRAILER
                </span>
                <span className="text-xs text-neutral-400">
                  On-site theatrical live-fire pit for corporate outings, weddings, and private rallies.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-charcoal/60 border border-white/5">
              <div className="w-12 h-12 rounded-lg bg-ember/10 border border-ember/30 flex items-center justify-center text-ember text-2xl flex-shrink-0">
                🔥
              </div>
              <div>
                <span className="font-display text-xl text-white block">
                  DIRECT KITCHEN DROPS
                </span>
                <span className="text-xs text-neutral-400">
                  Cambro insulated carrier transit from 60634 direct to your chafers at 150°F+.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site-config";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0A0A]/75 backdrop-blur-md border-b border-zinc-800/50 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between relative overflow-visible">
        {/* Official Master Crest Alone Breakout */}
        <div className="absolute top-1 sm:top-2 left-3 sm:left-8 z-50">
          <Link
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
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-7 pl-48 lg:pl-56 overflow-visible"
        >
          <Link
            href="#hero"
            className="text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
          >
            Home
          </Link>
          <Link
            href="#experience"
            className="text-[#C8A97E] hover:text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
          >
            The Experience
          </Link>
          <Link
            href="#packages"
            className="text-[#C8A97E] hover:text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
          >
            Menus
          </Link>
          <Link
            href="#reels"
            className="text-[#C8A97E] hover:text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="#delivery"
            className="text-[#C8A97E] hover:text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
          >
            About
          </Link>
          <Link
            href="#quote"
            className="text-[#C8A97E] hover:text-[#FF7A00] text-sm font-medium tracking-wide transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Action CTA */}
        <a
          href="#quote"
          className="ml-auto lg:ml-0 inline-flex h-9 sm:h-11 px-3.5 sm:px-6 items-center justify-center rounded-[12px] sm:rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] font-display text-xs sm:text-base lg:text-lg font-bold tracking-wider text-white uppercase [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
        >
          <span className="hidden sm:inline">REQUEST A QUOTE</span>
          <span className="sm:hidden">GET QUOTE</span>
        </a>
      </div>
    </header>
  );
}

export default Navbar;

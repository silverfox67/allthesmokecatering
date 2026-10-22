import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site-config";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0A0A]/75 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
        {/* Official Master Crest Alone Breakout */}
        <Link
          href="/"
          className="relative -mb-10 h-28 w-28 sm:h-32 sm:w-32 drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] z-20 transition-transform hover:scale-105 flex-shrink-0"
        >
          <Image
            src="/brand/allthesmoke-logo.png"
            alt="All The Smoke BBQ &amp; Catering Official Master Crest"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-7"
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
          className="inline-flex h-11 px-6 items-center justify-center rounded-[12px] bg-gradient-to-b from-[#EA580C] to-[#9A3412] border-2 border-[#FF7A00] shadow-[0_0_16px_rgba(255,106,0,0.45)] font-display text-base sm:text-lg font-bold tracking-wide text-white uppercase [text-shadow:_0_2px_4px_rgba(0,0,0,0.9)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          REQUEST A QUOTE
        </a>
      </div>
    </header>
  );
}

export default Navbar;

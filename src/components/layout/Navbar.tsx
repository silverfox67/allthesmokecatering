import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site-config";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0A0A]/70 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
        {/* Official Master Crest Alone Breakout */}
        <Link href="/" className="group flex-shrink-0 relative z-30 -mb-10 sm:-mb-12 lg:-mb-14">
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36 drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)]">
            <Image
              src="/brand/allthesmoke-logo.png"
              alt="All The Smoke BBQ &amp; Catering Official Master Crest"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-7"
        >
          <Link
            href="#hero"
            className="text-zinc-200 hover:text-[#C8A97E] text-sm font-medium tracking-wide transition-colors"
          >
            Home
          </Link>
          <Link
            href="#experience"
            className="text-zinc-200 hover:text-[#C8A97E] text-sm font-medium tracking-wide transition-colors"
          >
            The Experience
          </Link>
          <Link
            href="#packages"
            className="text-zinc-200 hover:text-[#C8A97E] text-sm font-medium tracking-wide transition-colors"
          >
            Menus
          </Link>
          <Link
            href="#reels"
            className="text-zinc-200 hover:text-[#C8A97E] text-sm font-medium tracking-wide transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="#delivery"
            className="text-zinc-200 hover:text-[#C8A97E] text-sm font-medium tracking-wide transition-colors"
          >
            About
          </Link>
          <Link
            href="#quote"
            className="text-zinc-200 hover:text-[#C8A97E] text-sm font-medium tracking-wide transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Action CTA */}
        <a
          href="#quote"
          className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-[0_0_20px_rgba(245,158,11,0.35)] inline-flex items-center justify-center"
        >
          REQUEST A QUOTE
        </a>
      </div>
    </header>
  );
}

export default Navbar;

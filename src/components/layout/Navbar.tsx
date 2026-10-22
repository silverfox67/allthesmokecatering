import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site-config";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0A0A]/70 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-amber-500/40 shadow-sm shadow-amber-500/20">
            <Image
              src="/brand/allthesmoke-logo.png"
              alt="All The Smoke BBQ & Catering Official Master Crest"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg sm:text-xl font-black tracking-wider text-white uppercase leading-none">
              All The Smoke
            </span>
            <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase leading-tight mt-0.5">
              BBQ &amp; Catering • Chicago
            </span>
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
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-[0_0_20px_rgba(245,158,11,0.35)]"
        >
          REQUEST A QUOTE
        </a>
      </div>
    </header>
  );
}

export default Navbar;

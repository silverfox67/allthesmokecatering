import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site-config";

export function Navbar() {
  return (
    <header className="px-4 sm:px-8 py-4 sm:py-5 max-w-7xl mx-auto flex items-center justify-between relative z-20">
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
        className="hidden lg:flex items-center gap-7 text-sm font-semibold text-zinc-300"
      >
        <Link href="#hero" className="hover:text-amber-400 transition-colors">
          Home
        </Link>
        <Link href="#packages" className="hover:text-amber-400 transition-colors">
          Menus
        </Link>
        <Link href="#reels" className="hover:text-amber-400 transition-colors">
          Gallery
        </Link>
        <Link href="#delivery" className="hover:text-amber-400 transition-colors">
          Delivery
        </Link>
        <Link href="#quote" className="hover:text-amber-400 transition-colors">
          Contact
        </Link>
      </nav>

      {/* Action CTA */}
      <a
        href="#quote"
        className="relative inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-400/50 hover:brightness-110 transition-all active:scale-95"
      >
        REQUEST A QUOTE
      </a>
    </header>
  );
}

export default Navbar;

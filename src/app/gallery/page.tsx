import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/config/site-config";
import { Footer } from "@/components/layout/Footer";
import { QuoteModal } from "@/components/forms/QuoteModal";

export const metadata: Metadata = {
  title: "Live Smokehouse & Catering Gallery | All The Smoke Catering Chicago",
  description:
    "Explore authentic photos and live-fire pit videos from All The Smoke Catering in Chicagoland. Prime brisket, St. Louis ribs, custom mobile trailer smoker, and full banquet spreads.",
  openGraph: {
    title: "All The Smoke Catering | Smokehouse Photo & Video Gallery",
    description:
      "Real hardwood smoke, live mobile trailer smoker operations, and handcrafted BBQ catering throughout Chicagoland.",
    images: [{ url: "/images/about/pitmaster-brisket-carve.webp" }],
  },
};

interface GalleryPhoto {
  id: string;
  category: "craft" | "rig" | "buffet" | "menu";
  categoryLabel: string;
  title: string;
  description: string;
  src: string;
  alt: string;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "brisket-carving",
    category: "craft",
    categoryLabel: "Pitmaster Craft",
    title: "Hand-Carved Texas Prime Brisket",
    description: "14-hour low and slow oak smoke with peppery black bark and pink smoke ring.",
    src: "/images/about/pitmaster-brisket-carve.webp",
    alt: "Pitmaster slicing juicy prime smoked brisket on a wooden cutting board with black gloves",
  },
  {
    id: "st-louis-ribs",
    category: "craft",
    categoryLabel: "Pit-Smoked Slabs",
    title: "St. Louis Cut Spare Ribs",
    description: "Tender, pull-apart spare ribs slow-rendered with house custom dry rub.",
    src: "/reels/reel-glazed-ribs.webp",
    alt: "Foil pan of sliced St. Louis spare ribs with deep bark and cherry smoke ring",
  },
  {
    id: "mobile-trailer-rig",
    category: "rig",
    categoryLabel: "Mobile Trailer Rig",
    title: "Custom Dual-Axle Smoker Rig",
    description: "Heavy-gauge offset trailer smoker rolling live smoke on-site at your venue.",
    src: "/reels/reel-mobile-trailer.webp",
    alt: "Marion's custom black dual-axle trailer smoker rolling smoke outside at night",
  },
  {
    id: "pit-wings-links",
    category: "craft",
    categoryLabel: "Live Fire",
    title: "Pit Wings & Smoked Beef Links",
    description: "Crispy whole seasoned wings and spicy hot links sizzling over hardwood coals.",
    src: "/reels/reel-pit-wings.webp",
    alt: "Smoked chicken wings and sausages sizzling on iron pit grates",
  },
  {
    id: "banquet-spread",
    category: "buffet",
    categoryLabel: "Catering Banquet",
    title: "Full Smokehouse Buffet Setup",
    description: "Full-service banquet line featuring ribs, jerk chicken, baked mac & cheese, and southern sides.",
    src: "/reels/reel-banquet-spread.webp",
    alt: "Long catering buffet line loaded with ribs, chicken, baked mac, baked beans, and sides",
  },
  {
    id: "smoked-salmon",
    category: "menu",
    categoryLabel: "Chef Specialties",
    title: "Glazed Wild Smoked Salmon",
    description: "Gourmet glazed salmon fillet plated over seasoned wild rice and fresh broccoli.",
    src: "/reels/reel-smoked-salmon.webp",
    alt: "Plated glazed smoked salmon over wild rice and broccoli",
  },
  {
    id: "catering-box",
    category: "menu",
    categoryLabel: "Turnkey Packages",
    title: "Individual Smokehouse Meal Box",
    description: "Hot drop-off catering containers with smoked half chicken, mac & cheese, and cornbread.",
    src: "/images/menu/catering-meal-prep.webp",
    alt: "Catering takeout box with smoked half chicken, mac & cheese, and cornbread",
  },
];

const LIVE_VIDEOS = [
  {
    id: "vid-1",
    title: "Trailer Smoker Rolling Hardwood Smoke",
    tagline: "Live-fire oak and hickory smoke rolling from the custom trailer chimney.",
    src: "/videos/smoker-rolling-smoke.mp4",
  },
  {
    id: "vid-2",
    title: "Smoking Chamber: Chicken & Rib Slabs",
    tagline: "Inside look at seasoned meats rendering slowly over live pit coals.",
    src: "/videos/pit-meats-sizzle.mp4",
  },
  {
    id: "vid-3",
    title: "Live Mobile Rig On-Site Dispatch",
    tagline: "The mobile pit trailer ready to roll directly to Chicagoland venues.",
    src: "/videos/trailer-rig-setup.mp4",
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-neutral-100 flex flex-col">
      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#C8A97E] hover:text-[#FF7A00] transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#C8A97E]/50">
              <Image
                src="/brand/allthesmoke-logo.png"
                alt="All The Smoke Official Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-display font-bold text-sm tracking-wider text-white group-hover:text-[#FF7A00] transition-colors">
              ALL THE SMOKE
            </span>
          </Link>

          <a
            href="/#contact"
            className="inline-flex h-9 px-4 items-center justify-center rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white font-display text-xs font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(234,88,12,0.35)] transition-all hover:scale-105 active:scale-95"
          >
            Get Quote
          </a>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-[#141210] to-[#0A0A0A] border-b border-amber-950/40 overflow-hidden">
        {/* Amber Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-[450px] w-[600px] rounded-full bg-[#EA580C]/10 blur-[150px]"
        />

        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div>
            <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm">
              ★ SMOKEHOUSE PHOTO &amp; VIDEO ARCHIVE ★
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-wide leading-tight">
            All The Smoke{" "}
            <span className="bg-gradient-to-r from-[#FF7A00] via-[#FF9E40] to-[#E5A967] bg-clip-text text-transparent">
              Catering Gallery
            </span>
          </h1>

          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Documenting authentic hardwood pit sessions, whole-slab slicing, custom mobile smoker operations, and full catering spreads throughout Chicagoland.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#photos"
              className="inline-flex h-10 px-5 items-center justify-center rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[#C8A97E] hover:text-white font-display text-xs font-bold tracking-wider uppercase transition-colors"
            >
              Browse Photos ({GALLERY_PHOTOS.length})
            </a>
            <a
              href="#videos"
              className="inline-flex h-10 px-5 items-center justify-center rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[#C8A97E] hover:text-white font-display text-xs font-bold tracking-wider uppercase transition-colors"
            >
              Watch Pit Videos ({LIVE_VIDEOS.length})
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 1: Real Live Pit Videos */}
      <section id="videos" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-amber-950/30 bg-[#0E0D0C]">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm mb-2">
                ★ LIVE-FIRE CAPTURES ★
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wide">
                Live From the Pit
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
              Real clips of our mobile rig rolling hardwood smoke and pit racks loaded with meats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {LIVE_VIDEOS.map((vid) => (
              <div
                key={vid.id}
                className="rounded-2xl overflow-hidden bg-zinc-950 border border-amber-500/20 shadow-xl space-y-3 p-4 flex flex-col justify-between"
              >
                {/* 9:16 Video Container */}
                <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-black border border-zinc-800/80">
                  <video
                    src={vid.src}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="pt-1 space-y-1">
                  <h3 className="font-display text-base font-bold text-white tracking-wide">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-snug">
                    {vid.tagline}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 2: Authentic Photo Archive */}
      <section id="photos" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm mb-2">
                ★ HIGH-RESOLUTION CRAFT ★
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wide">
                The Smokehouse Photo Archive
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
              Every cut is hand-seasoned with custom rubs and cooked low-and-slow over split logs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {GALLERY_PHOTOS.map((photo) => (
              <div
                key={photo.id}
                className="group relative rounded-2xl overflow-hidden bg-zinc-950 border border-amber-500/20 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8)] hover:border-[#FF7A00]/70 hover:shadow-[0_0_30px_rgba(234,88,12,0.2)] transition-all duration-300 flex flex-col justify-end"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Gradient Vignette */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[#C8A97E] text-[11px] uppercase font-extrabold tracking-widest bg-zinc-900/90 px-3 py-1 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm">
                      ★ {photo.categoryLabel.toUpperCase()} ★
                    </span>
                  </div>

                  {/* Overlay Description */}
                  <div className="absolute bottom-0 inset-x-0 p-5 z-10 space-y-1.5">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-wide group-hover:text-amber-400 transition-colors">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-snug">
                      {photo.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Bottom Booking Banner */}
      <section className="py-14 px-4 sm:px-8 bg-gradient-to-r from-[#181410] via-[#121110] to-[#181410] border-t border-amber-950/40">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Ready to Bring This Live-Fire Experience to Your Venue?
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            From private celebrations and tailgates to corporate galas and weddings throughout Chicagoland, Marion brings the heat and the flavor.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/#packages"
              className="inline-flex h-11 px-6 items-center justify-center rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white font-display text-xs sm:text-sm font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all hover:scale-105"
            >
              Explore Catering Packages
            </Link>
            <Link
              href="/#contact"
              className="inline-flex h-11 px-6 items-center justify-center rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[#C8A97E] hover:text-white font-display text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors"
            >
              Request Event Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <QuoteModal />
    </main>
  );
}

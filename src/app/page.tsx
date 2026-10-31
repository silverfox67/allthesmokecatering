import React from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/config/site-config";
import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { PackageGrid } from "@/components/catering/PackageGrid";
import { ButcherBlockMenu } from "@/components/home/ButcherBlockMenu";
import { DeliveryChecker } from "@/components/delivery/DeliveryChecker";
import { TikTokReels } from "@/components/social/TikTokReels";
import { Footer } from "@/components/layout/Footer";
import { QuoteModal } from "@/components/forms/QuoteModal";
import { ContactSection } from "@/components/home/ContactSection";
import { FaqSection } from "@/components/home/FaqSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-neutral-100 flex flex-col">
      {/* 1. Hero: Deep Obsidian (#0A0A0A) + Amber Ember Radial Glow + Timed Platter Carousel */}
      <Hero />

      {/* 2. About All The Smoke Catering: Warm Butcher Paper & Stone Linen (#F5F0EB) */}
      <AboutSection />

      {/* 3. Spotlight 3x3 Packages: Rich Charcoal (#121214) with Glowing Orange Active State */}
      <PackageGrid />

      {/* 4. Pitmaster Menu: Warm Butcher Paper (#FAF8F5) with Sticky Category Pills & Weekly Chalkboard */}
      <ButcherBlockMenu />

      {/* 5. Delivery Calculator: Dark Obsidian (#0A0A0A) with 3-Zone Fee Engine */}
      <DeliveryChecker />

      {/* 6. TikTok Pitmaster Reels: Authentic Live-Fire Proof & Video Demonstrations */}
      <TikTokReels />

      {/* 7. Smokehouse FAQ: Warm Butcher Paper & Stone Linen (#FAF8F5) + Google Schema */}
      <FaqSection />

      {/* 8. Contact & Smokehouse Quote Intake: 2-Column Live-Fire Intake Form */}
      <ContactSection />

      {/* Footer with statutory notices, hub details, and official master circular crest */}
      <Footer />

      {/* Multi-Step Interactive Quote & Booking Modal */}
      <QuoteModal />
    </main>
  );
}

import React from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/config/site-config";
import { Hero } from "@/components/home/Hero";
import { PackageGrid } from "@/components/catering/PackageGrid";
import { DeliveryChecker } from "@/components/delivery/DeliveryChecker";
import { TikTokReels } from "@/components/social/TikTokReels";
import { Footer } from "@/components/layout/Footer";
import { QuoteModal } from "@/components/forms/QuoteModal";
import { ContactSection } from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-neutral-100 flex flex-col">
      {/* 1. Hero: Deep Obsidian (#0A0A0A) + Amber Ember Radial Glow + Borderless Brisket */}
      <Hero />

      {/* 2. Spotlight Packages: Rich Charcoal (#121214) with Top/Bottom Borders & Ambient Ember Glow */}
      <PackageGrid />

      {/* 3. Delivery Calculator: Deep Obsidian (#0A0A0A) with Centered Radial Glow */}
      <DeliveryChecker />

      {/* 4. TikTok Pitmaster Reels: Warm Hickory Smoke Tint (#161311) */}
      <TikTokReels />

      {/* 5. Contact & Smokehouse Quote Intake: 2-Column Blind Cook Layout & Live-Fire Styling */}
      <ContactSection />

      {/* Footer with statutory notices, hub details, and official master circular crest */}
      <Footer />

      {/* Multi-Step Interactive Quote & Booking Modal */}
      <QuoteModal />
    </main>
  );
}

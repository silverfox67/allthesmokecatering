import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReviewsPageClient } from "@/components/reviews/ReviewsPageClient";

export const metadata: Metadata = {
  title: "Verified Google Reviews & Client Feedback",
  description:
    "Read verified Google reviews for Pitmaster Marion Bolden and All The Smoke BBQ & Catering in Chicagoland, or leave your own review.",
  alternates: {
    canonical: "https://allthesmokecatering.com/reviews/",
  },
  openGraph: {
    title: "Verified Google Reviews | All The Smoke BBQ & Catering",
    description:
      "See what Chicago families and event planners say about All The Smoke BBQ & Catering, and share your own review.",
    url: "https://allthesmokecatering.com/reviews/",
    siteName: "All The Smoke BBQ & Catering",
    locale: "en_US",
    type: "website",
  },
};

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ReviewsPageClient />
      </main>
      <Footer />
    </div>
  );
}

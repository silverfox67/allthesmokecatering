import React, { Suspense } from "react";
import { Metadata } from "next";
import { ReviewClient } from "./ReviewClient";

export const metadata: Metadata = {
  title: "Rate Your Catering Experience | All The Smoke BBQ Chicago",
  description:
    "Share your feedback on Marion Bolden's live-fire barbecue catering. Help other Chicago families and companies discover authentic pit-smoked craft BBQ.",
  openGraph: {
    title: "How Was Your Smokehouse Feast? | All The Smoke BBQ & Catering",
    description:
      "Leave a review for Pitmaster Marion Bolden and the All The Smoke crew. Rate your smoked brisket, ribs, sides, and event experience.",
    url: "https://allthesmokecatering.com/review",
    siteName: "All The Smoke BBQ & Catering",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "/review",
  },
};

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-zinc-500 text-sm">
          Loading Review Intake...
        </div>
      }
    >
      <ReviewClient />
    </Suspense>
  );
}


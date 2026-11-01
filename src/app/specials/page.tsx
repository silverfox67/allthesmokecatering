import React from "react";
import { Metadata } from "next";
import { WEEKLY_CHALKBOARD } from "@/data/pitmaster-menu";
import { SpecialsClient } from "./SpecialsClient";

export const metadata: Metadata = {
  title: "Weekly Smoker Chalkboard Specials | All The Smoke BBQ & Catering Chicago",
  description:
    "Explore all 8 rotating pitmaster chalkboard specials smoked low-and-slow on Marion Bolden's trailer rig in Chicago. Burnt Ends, Cedar Salmon, Brisket Chili, Skillet Cornbread & more.",
  openGraph: {
    title: "Weekly Smoker Chalkboard Specials | All The Smoke Catering Chicago",
    description:
      "All 8 weekly pitmaster specials rolling on Marion Bolden's live-fire trailer rig in Chicagoland. Prime burnt ends, cedar-plank salmon, burnt-end chili, and whole pit-smoked birds.",
    url: "https://allthesmokecatering.com/specials",
    siteName: "All The Smoke BBQ & Catering",
    images: [
      {
        url: "/images/menu/smoked-burnt-ends.jpg",
        width: 1200,
        height: 630,
        alt: "Double-Smoked Brisket Burnt Ends tossed in caramelized pit glaze",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "/specials",
  },
};

export default function SpecialsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "name": "All The Smoke Pitmaster Weekly Chalkboard Specials",
    "description": "Rotating weekly hardwood smoked specialties on Marion Bolden's custom trailer rig in Chicago.",
    "hasMenuSection": [
      {
        "@type": "MenuSection",
        "name": "Weekly Chalkboard Specials",
        "hasMenuItem": WEEKLY_CHALKBOARD.items.map((item) => ({
          "@type": "MenuItem",
          "name": item.name,
          "description": item.tagline,
          "offers": {
            "@type": "Offer",
            "price": item.parsedPrice.toString(),
            "priceCurrency": "USD",
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SpecialsClient />
    </>
  );
}


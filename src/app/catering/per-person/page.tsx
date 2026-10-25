import type { Metadata } from "next";
import { CategoryPageView } from "@/components/catering/CategoryPageView";
import { SITE_CONFIG } from "@/config/site-config";

export const metadata: Metadata = {
  title: "Per-Person Smokehouse Buffet Packages | All The Smoke Catering",
  description:
    "Explore our 3 signature per-person BBQ catering packages starting at $24.95/person. Hardwood-smoked Texas brisket, ribs, scratch sides, and complete buffet setup across Chicagoland.",
  alternates: {
    canonical: "https://allthesmokecatering.com/catering/per-person",
  },
  openGraph: {
    title: "Per-Person Smokehouse Buffet Packages | All The Smoke Catering",
    description:
      "Explore 3 signature per-person BBQ catering tiers starting at $24.95/person with live guest cost calculator, meats, and scratch sides.",
    url: "https://allthesmokecatering.com/catering/per-person",
    siteName: SITE_CONFIG.brandName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://allthesmokecatering.com/images/og-image.jpg",
        secureUrl: "https://allthesmokecatering.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "All The Smoke Catering - Per-Person Smokehouse Buffet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Per-Person Smokehouse Buffet Packages | All The Smoke Catering",
    description:
      "Explore 3 signature per-person BBQ catering tiers starting at $24.95/person with meats, sides, and buffet setup.",
    images: ["https://allthesmokecatering.com/images/og-image.jpg"],
  },
};

export default function PerPersonCateringPage() {
  return <CategoryPageView category="per-person" />;
}

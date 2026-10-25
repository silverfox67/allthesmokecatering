import type { Metadata } from "next";
import { CategoryPageView } from "@/components/catering/CategoryPageView";
import { SITE_CONFIG } from "@/config/site-config";

export const metadata: Metadata = {
  title: "Weekly Smoked BBQ Meal Prep Tiers | All The Smoke Catering",
  description:
    "Vacuum-sealed, hardwood-smoked lean meats and wholesome clean sides. 5-pack, 10-pack, and bulk smokehouse tiers from $15.62/meal in Chicagoland.",
  alternates: {
    canonical: "https://allthesmokecatering.com/catering/meal-prep",
  },
  openGraph: {
    title: "Weekly Smoked BBQ Meal Prep Tiers | All The Smoke Catering",
    description:
      "Vacuum-sealed, hardwood-smoked lean meats and clean sides ready in 3 minutes. 5-pack, 10-pack, and bulk packs from $15.62/meal.",
    url: "https://allthesmokecatering.com/catering/meal-prep",
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
        alt: "All The Smoke Catering - Smoked BBQ Meal Prep",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weekly Smoked BBQ Meal Prep Tiers | All The Smoke Catering",
    description:
      "High-protein vacuum-sealed smokehouse meal prep. From $15.62 per meal with weekly delivery or pickup.",
    images: ["https://allthesmokecatering.com/images/og-image.jpg"],
  },
};

export default function MealPrepCateringPage() {
  return <CategoryPageView category="meal-prep" />;
}

import type { Metadata } from "next";
import { CategoryPageView } from "@/components/catering/CategoryPageView";
import { SITE_CONFIG } from "@/config/site-config";

export const metadata: Metadata = {
  title: "Turnkey BBQ Party Pans & Drop-Off Bundles | All The Smoke Catering",
  description:
    "Ready-to-serve smokehouse party pans delivered steaming hot for game days, tailgates, and office parties. Packages from $285 flat serving 12 to 35 guests in Chicago.",
  alternates: {
    canonical: "https://allthesmokecatering.com/catering/party-pans",
  },
  openGraph: {
    title: "Turnkey BBQ Party Pans & Drop-Off Bundles | All The Smoke Catering",
    description:
      "Ready-to-serve smokehouse party pans hot & delivered for game days, tailgates, and parties. Bundles from $285 flat for 12 to 35 guests.",
    url: "https://allthesmokecatering.com/catering/party-pans",
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
        alt: "All The Smoke Catering - Turnkey BBQ Party Pans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Turnkey BBQ Party Pans & Drop-Off Bundles | All The Smoke Catering",
    description:
      "Hot smokehouse party pans delivered ready to serve. 3 ready bundles from $285 flat serving 12–35 guests.",
    images: ["https://allthesmokecatering.com/images/og-image.jpg"],
  },
};

export default function PartyPansCateringPage() {
  return <CategoryPageView category="turnkey" />;
}

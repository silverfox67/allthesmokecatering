import type { Metadata, Viewport } from "next";
import { DigitalCardClient } from "./DigitalCardClient";

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Pitmaster Marion Bolden | Live Digital Business Card",
  description: "Official digital business card & direct contact save for Pitmaster Marion Bolden — All The Smoke BBQ & Catering Chicago.",
  openGraph: {
    title: "Pitmaster Marion Bolden | All The Smoke BBQ",
    description: "Save Marion to contacts, order Saturday smokehouse drops, or book live-fire BBQ catering.",
    url: "https://allthesmokecatering.com/card",
    images: ["/allthesmoke-og-card.png"],
  },
};

export default function DigitalCardPage() {
  return <DigitalCardClient />;
}

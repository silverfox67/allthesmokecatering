import type { Metadata, Viewport } from "next";
import { PublicCustomerAppClient } from "./PublicCustomerAppClient";

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "All The Smoke BBQ | Official Customer App",
  description: "Official mobile ordering, Saturday Smokehouse drops & catering quote calculator for All The Smoke BBQ Chicago.",
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://allthesmokecatering.com/app/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "All The Smoke",
  },
  icons: {
    icon: [
      { url: "/icons/customer-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/customer-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/customer-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function PublicAppPage() {
  return <PublicCustomerAppClient />;
}

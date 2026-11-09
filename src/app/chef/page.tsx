import type { Metadata, Viewport } from "next";
import { PitmasterAppClient } from "../app/PitmasterAppClient";

export const viewport: Viewport = {
  themeColor: "#EA580C",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "ATS Ops | Pitmaster Marion Bolden",
  description: "Executive catering operations console & live digital business card for Pitmaster Marion Bolden.",
  manifest: "/portal-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ATS Ops",
  },
  icons: {
    icon: [
      { url: "/icons/portal-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/portal-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/portal-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChefPortalPage() {
  return <PitmasterAppClient />;
}


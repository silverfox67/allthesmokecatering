import type { Metadata } from "next";
import { PitmasterAppClient } from "./PitmasterAppClient";

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
    icon: "/brand/allthesmoke-master-crest.png",
    apple: "/brand/allthesmoke-master-crest.png",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PitmasterAppPage() {
  return <PitmasterAppClient />;
}


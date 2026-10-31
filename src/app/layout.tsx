import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_CONFIG } from "@/config/site-config";

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.CF_PAGES_URL ? `https://${process.env.CF_PAGES_URL}` : undefined) ||
  `https://${SITE_CONFIG.primaryDomain}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_CONFIG.meta.title,
    template: `%s | ${SITE_CONFIG.brandName}`,
  },
  description: SITE_CONFIG.meta.description,
  applicationName: SITE_CONFIG.brandName,
  authors: [{ name: SITE_CONFIG.legalName }],
  creator: SITE_CONFIG.legalName,
  publisher: SITE_CONFIG.brandName,
  keywords: [
    "Chicago BBQ Catering",
    "All The Smoke Catering",
    "Live-Fire Smoker Chicago",
    "Slow Smoked Brisket",
    "Marion Bolden BBQ",
    "Chicagoland Corporate BBQ",
    "Cook County Wedding Catering",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/ats-monogram.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/brand/ats-full-badge.png", sizes: "740x740", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: SITE_CONFIG.meta.title,
    description: SITE_CONFIG.meta.description,
    url: "https://allthesmokecatering.com/",
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
        alt: `${SITE_CONFIG.brandName} - Premium Live-Fire Smokehouse Catering`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.meta.title,
    description: SITE_CONFIG.meta.description,
    images: ["https://allthesmokecatering.com/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://allthesmokecatering.com/",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: SITE_CONFIG.brandName,
  legalName: SITE_CONFIG.legalName,
  image: `https://${SITE_CONFIG.primaryDomain}/allthesmoke-og-card.png`,
  logo: `https://${SITE_CONFIG.primaryDomain}/brand/ats-full-badge.png`,
  telephone: SITE_CONFIG.phoneFormatted,
  email: SITE_CONFIG.brandEmail,
  url: `https://${SITE_CONFIG.primaryDomain}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE_CONFIG.hubAddress.street,
    addressLocality: SITE_CONFIG.hubAddress.city,
    addressRegion: SITE_CONFIG.hubAddress.state,
    postalCode: SITE_CONFIG.hubAddress.zip,
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: SITE_CONFIG.hubAddress.coordinates.latitude,
    longitude: SITE_CONFIG.hubAddress.coordinates.longitude,
  },
  servesCuisine: ["Barbecue", "American", "Soul Food", "Southern"],
  priceRange: "$$",
  areaServed: SITE_CONFIG.serviceArea,
  founder: {
    "@type": "Person",
    name: SITE_CONFIG.legalName,
    jobTitle: "Founder & Master Pitmaster",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Kalam:wght@400;700&family=Oswald:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-screen bg-obsidian text-neutral-100 font-sans antialiased selection:bg-ember selection:text-obsidian">
        {children}
      </body>
    </html>
  );
}

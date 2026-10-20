import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/config/site-config";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE_CONFIG.primaryDomain}`),
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
  openGraph: {
    title: SITE_CONFIG.meta.title,
    description: SITE_CONFIG.meta.description,
    url: `https://${SITE_CONFIG.primaryDomain}`,
    siteName: SITE_CONFIG.brandName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/allthesmoke-og-card.png",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.brandName} - Premium Live-Fire Smokehouse Catering`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.meta.title,
    description: SITE_CONFIG.meta.description,
    images: ["/allthesmoke-og-card.png"],
  },
  alternates: {
    canonical: `https://${SITE_CONFIG.primaryDomain}`,
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
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} dark scroll-smooth`}
    >
      <head>
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

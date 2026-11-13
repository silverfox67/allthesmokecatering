import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_CONFIG } from "@/config/site-config";

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const siteUrl = `https://${SITE_CONFIG.primaryDomain}`;

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
      { url: "/icons/customer-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/customer-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/customer-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "All The Smoke",
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
  manifest: "/manifest.json",
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
  sameAs: [SITE_CONFIG.socials.tiktok],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "20:00",
    },
  ],
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
        <link
          rel="preload"
          href="/fonts/oswald-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter-latin.woff2"
        />
        <link
          rel="preload"
          href="/fonts/satisfy-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/dancing-script.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/caveat-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="All The Smoke" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/customer-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/icons/customer-touch-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.deferredPwaPrompt = null;
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.deferredPwaPrompt = e;
              });
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function(err) {
                    console.warn('SW registration error:', err);
                  });
                });
              }
            `,
          }}
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

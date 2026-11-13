import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site-config";

/**
 * Dynamic XML Sitemap targeting primary Chicagoland Smokehouse Keywords:
 * - "Chicago BBQ catering"
 * - "Live fire catering Chicago"
 * - "Wedding BBQ catering 60634"
 * - "Slow smoked brisket Chicago"
 * Note: Trailing slashes match next.config.js (`trailingSlash: true`) to avoid 308 redirects in GSC.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `https://${SITE_CONFIG.primaryDomain}`;
  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catering/per-person/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/catering/party-pans/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/catering/meal-prep/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/specials/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/gallery/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/app/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/review/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}

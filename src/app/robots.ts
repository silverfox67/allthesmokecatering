import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site-config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = `https://${SITE_CONFIG.primaryDomain}`;
  const privateDisallows = [
    "/api/",
    "/admin/",
    "/chef",
    "/pitmaster",
    "/portal",
    "/crew",
    "/admin-app",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: privateDisallows,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site-config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = `https://${SITE_CONFIG.primaryDomain}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

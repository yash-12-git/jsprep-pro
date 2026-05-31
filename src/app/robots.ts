import { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/admin",
          "/analytics",
          "/mock-interview",
          "/study-plan",
          "/api/",
          "/auth",
        ],
      },
    ],
    sitemap: `${SITE.domain}/sitemap.xml`,
    host: SITE.domain,
  };
}
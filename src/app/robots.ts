import { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/seo";

// Private / app-only routes — no crawlable content, kept out of every crawler.
const DISALLOW = [
  "/dashboard",
  "/admin",
  "/analytics",
  "/mock-interview",
  "/study-plan",
  "/api/",
  "/auth",
];

// AI / LLM crawlers — explicitly welcomed for AI SEO (GEO). Listing a bot in its
// own group means it ignores the wildcard `*` group, so each needs its own rule.
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "Claude-Web",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "cohere-ai",
  "Bytespider",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: AI_BOTS,
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE.domain}/sitemap.xml`,
    host: SITE.domain,
  };
}

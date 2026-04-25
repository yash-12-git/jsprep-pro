import { MetadataRoute } from "next";
import {
  getPublishedBlogPosts,
  getPublishedQuestionSlugs,
  getTopicSlugs,
  getQuestions,
} from "@/lib/cachedQueries";

import { catToSlug, SITE } from "@/lib/seo/seo";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/, "")
    .slice(0, 80);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const [topicSlugs, blogPosts, questionSlugs, theoryResult] =
    await Promise.all([
      getTopicSlugs().catch(() => [] as string[]),
      getPublishedBlogPosts().catch(() => []),
      getPublishedQuestionSlugs().catch(() => [] as string[]),
      getQuestions({
        filters: { status: "published", type: "theory" },
        pageSize: 300,
      }).catch(() => ({ questions: [] })),
    ]);

  const categories = [
    ...new Set((theoryResult.questions as any[]).map((q) => q.category)),
  ] as string[];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE.domain,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // ── Roadmap — high priority, targets "frontend roadmap 2026" cluster ──
    {
      url: `${SITE.domain}/roadmap`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${SITE.domain}/javascript-interview-questions`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE.domain}/react-interview-questions`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE.domain}/javascript-output-questions`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE.domain}/javascript-tricky-questions`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.domain}/javascript-interview-cheatsheet`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.domain}/react-interview-cheatsheet`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.domain}/topics/javascript`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.domain}/topics/react`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.domain}/blog/javascript`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE.domain}/blog/react`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE.domain}/output-quiz`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE.domain}/sprint`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.domain}/debug-lab`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const topicPages: MetadataRoute.Sitemap = topicSlugs.map((slug) => ({
    url: `${SITE.domain}/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE.domain}/questions/${catToSlug(cat)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const questionPages: MetadataRoute.Sitemap = questionSlugs.map((slug) => ({
    url: `${SITE.domain}/q/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const javascriptBlogPages: MetadataRoute.Sitemap = blogPosts
    .filter((post) => post.track === "javascript")
    .map((post) => ({
      url: `${SITE.domain}/blog/javascript/${post.slug}`,
      lastModified: new Date(
        post.modifiedAt ?? post.publishedAt ?? now,
      ).toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const reactBlogPages: MetadataRoute.Sitemap = blogPosts
    .filter((post) => post.track === "react")
    .map((post) => ({
      url: `${SITE.domain}/blog/react/${post.slug}`,
      lastModified: new Date(
        post.modifiedAt ?? post.publishedAt ?? now,
      ).toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [
    ...staticPages,
    ...topicPages,
    ...categoryPages,
    ...questionPages,
    ...javascriptBlogPages,
    ...reactBlogPages,
  ];
}

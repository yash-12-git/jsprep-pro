import { MetadataRoute } from "next";
import {
  getPublishedBlogPosts,
  getPublishedQuestionSlugs,
  getTopicSlugs,
  getQuestions,
} from "@/lib/cachedQueries";

import { catToSlug, SITE } from "@/lib/seo/seo";
import { getServerTrack } from "@/lib/getServerTrack";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/, "")
    .slice(0, 80);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const track = await getServerTrack();

  const [topicSlugs, blogPosts, questionSlugs, theoryResult] =
    await Promise.all([
      getTopicSlugs().catch(() => [] as string[]),
      getPublishedBlogPosts().catch(() => []),
      getPublishedQuestionSlugs().catch(() => [] as string[]),
      // Only theory categories — output/debug have dedicated pages not /questions/[slug]
      getQuestions({
        filters: { status: "published", type: "theory" },
        pageSize: 300,
      }).catch((error) => ({ questions: [] })),
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
    {
      url: `${SITE.domain}/javascript-interview-questions`,
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
      url: `${SITE.domain}/topics/${track}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.domain}/blog/${track}`,
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

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE.domain}/blog/${track}/${post.slug}`,
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
    ...blogPages,
  ];
}

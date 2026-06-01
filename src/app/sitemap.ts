import { MetadataRoute } from "next";
import {
  getPublishedBlogPosts,
  getPublishedQuestionSlugs,
  getTopicSlugs,
  getQuestions,
} from "@/lib/cachedQueries";

import { catToSlug, SITE } from "@/lib/seo/seo";

// Approximate dates pages were last significantly updated.
// Better than `now` (which makes Google think everything changed on every deploy).
const DATES = {
  home: new Date("2026-05-01").toISOString(),
  questionsPages: new Date("2026-05-01").toISOString(),
  cheatsheets: new Date("2026-03-01").toISOString(),
  topics: new Date("2026-04-01").toISOString(),
  blog: new Date("2026-04-01").toISOString(),
};

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

  // Content-only pages — no interactive tools (sprint, output-quiz, debug-lab,
  // polyfill-lab, theory) because they are client-rendered shells with no
  // static content for crawlers.
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE.domain,
      lastModified: DATES.home,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE.domain}/roadmap`,
      lastModified: DATES.questionsPages,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${SITE.domain}/javascript-interview-questions`,
      lastModified: DATES.questionsPages,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE.domain}/react-interview-questions`,
      lastModified: DATES.questionsPages,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE.domain}/typescript-interview-questions`,
      lastModified: DATES.questionsPages,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE.domain}/javascript-output-questions`,
      lastModified: DATES.questionsPages,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.domain}/javascript-tricky-questions`,
      lastModified: DATES.questionsPages,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.domain}/javascript-interview-cheatsheet`,
      lastModified: DATES.cheatsheets,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.domain}/react-interview-cheatsheet`,
      lastModified: DATES.cheatsheets,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.domain}/topics/javascript`,
      lastModified: DATES.topics,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.domain}/topics/react`,
      lastModified: DATES.topics,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.domain}/topics/typescript`,
      lastModified: DATES.topics,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.domain}/blog/javascript`,
      lastModified: DATES.blog,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE.domain}/blog/react`,
      lastModified: DATES.blog,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE.domain}/blog/typescript`,
      lastModified: DATES.blog,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    // Removed (client-rendered tool pages — no crawlable static content):
    // /sprint, /output-quiz, /debug-lab, /polyfill-lab, /theory
  ];

  const topicPages: MetadataRoute.Sitemap = topicSlugs.map((slug) => ({
    url: `${SITE.domain}/${slug}`,
    lastModified: DATES.topics,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE.domain}/questions/${catToSlug(cat)}`,
    lastModified: DATES.topics,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Only theory question pages — output/debug are thin single-question pages
  // that Bing/Google flag for content quality issues.
  const theoryQuestionPages: MetadataRoute.Sitemap = questionSlugs
    .filter(
      (slug) =>
        !slug.startsWith("output-") &&
        !slug.startsWith("ts-output-") &&
        !slug.startsWith("debug-") &&
        !slug.startsWith("ts-debug-"),
    )
    .map((slug) => ({
      url: `${SITE.domain}/q/${slug}`,
      lastModified: DATES.questionsPages,
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

  const typescriptBlogPages: MetadataRoute.Sitemap = blogPosts
    .filter((post) => post.track === "typescript")
    .map((post) => ({
      url: `${SITE.domain}/blog/typescript/${post.slug}`,
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
    ...theoryQuestionPages,
    ...javascriptBlogPages,
    ...reactBlogPages,
    ...typescriptBlogPages,
  ];
}

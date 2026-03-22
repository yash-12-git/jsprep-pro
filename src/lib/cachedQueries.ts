/**
 * lib/cachedQueries.ts
 *
 * Next.js server-level cache for all public Firestore reads.
 *
 * HOW IT WORKS
 * ────────────
 * unstable_cache wraps an async function and stores its result in Next.js's
 * Data Cache. All server requests within the revalidate window share ONE
 * cached result — Firestore is only called when the cache misses or expires.
 *
 * WITHOUT this:  1000 visitors/hour = up to 1000 Firestore reads
 * WITH this:     1000 visitors/hour = 1 Firestore read (or 1 per revalidate cycle)
 *
 * ADMIN WRITES
 * ────────────
 * When content is updated in admin, call revalidateTag() to immediately
 * clear the relevant cache entry instead of waiting for TTL to expire.
 * See lib/adminRevalidate.ts for server action wrappers.
 *
 * RULES
 * ─────
 * ✅ Use these cached functions in all public server components and generateStaticParams
 * ❌ Never use these in admin forms or write paths — they need live data
 * ❌ Never use these in client components — unstable_cache is server-only
 */

import { unstable_cache } from "next/cache";

import {
  getTopics,
  getTopicBySlug as _getTopicBySlug,
  getRelatedTopics as _getRelatedTopics,
} from "@/lib/topics";

import {
  getBlogPosts,
  getBlogPostBySlug as _getBlogPostBySlug,
  getBlogPostsForTopic as _getBlogPostsForTopic,
} from "@/lib/blogPosts";

import { getWeeklyLeaderboard as _getWeeklyLeaderboard } from "@/lib/userProgress";

import {
  getQuestions as _getQuestions,
  getPublishedCategories as _getPublishedCategories,
  getQuestionBySlug as _getQuestionBySlug,
} from "@/lib/questions";

import type { GetQuestionsOptions } from "@/lib/questions";

// ─── Cache tags ───────────────────────────────────────────────────────────────
// Used to invalidate specific caches on admin write without waiting for TTL.

export const CACHE_TAGS = {
  topics: "topics",
  blogPosts: "blog-posts",
  questions: "questions",
  leaderboard: "leaderboard",
} as const;

// revalidate: false = cache forever, cleared only by revalidateTag() on admin write

// ─── Topics ───────────────────────────────────────────────────────────────────

/** All published topics — listings, sitemaps, generateStaticParams */
export const getPublishedTopics = unstable_cache(
  () => getTopics({ status: "published" }),
  ["published-topics"],
  { revalidate: false, tags: [CACHE_TAGS.topics] },
);

/** Topic slugs — lightweight for generateStaticParams */
export const getTopicSlugs = unstable_cache(
  async () => {
    const topics = await getTopics({ status: "published" });
    return topics.map((t) => t.slug);
  },
  ["topic-slugs"],
  { revalidate: false, tags: [CACHE_TAGS.topics] },
);

/** Weekly leaderboard — shared across all users */
export const getWeeklyLeaderboardCached = unstable_cache(
  () => _getWeeklyLeaderboard(10),
  ["weekly-leaderboard"],
  {
    revalidate: 60 * 60 * 2,
    tags: [CACHE_TAGS.leaderboard],
  },
);

/** Single topic by slug — slug baked into key AND per-slug tag for granular invalidation */
export const getTopicBySlug = (slug: string) =>
  unstable_cache(() => _getTopicBySlug(slug), ["topic-by-slug", slug], {
    revalidate: false,
    tags: [CACHE_TAGS.topics, `topic-${slug}`],
  })();

/** Related topics by slug array */
export const getRelatedTopics = (slugs: string[]) => {
  const key = [...slugs].sort().join(",");
  return unstable_cache(
    () => _getRelatedTopics(slugs),
    ["related-topics", key],
    { revalidate: false, tags: [CACHE_TAGS.topics] },
  )();
};

// ─── Blog posts ───────────────────────────────────────────────────────────────

/** All published posts — for /blog listing + sitemaps */
export const getPublishedBlogPosts = unstable_cache(
  () => getBlogPosts({ status: "published" }),
  ["published-blog-posts"],
  { revalidate: false, tags: [CACHE_TAGS.blogPosts] },
);

/** Blog post slugs — for generateStaticParams */
export const getBlogPostSlugs = unstable_cache(
  async () => {
    const posts = await getBlogPosts({ status: "published" });
    return posts.map((p) => p.slug);
  },
  ["blog-post-slugs"],
  { revalidate: false, tags: [CACHE_TAGS.blogPosts] },
);

/** Single post by slug — slug baked into key AND per-slug tag for granular invalidation */
export const getBlogPostBySlug = (slug: string) =>
  unstable_cache(() => _getBlogPostBySlug(slug), ["blog-post-by-slug", slug], {
    revalidate: false,
    tags: [CACHE_TAGS.blogPosts, `blog-${slug}`],
  })();

/** Posts linked to a topic — topicSlug baked into key */
export const getBlogPostsForTopic = (topicSlug: string) =>
  unstable_cache(
    () => _getBlogPostsForTopic(topicSlug),
    ["blog-posts-for-topic", topicSlug],
    { revalidate: false, tags: [CACHE_TAGS.blogPosts, CACHE_TAGS.topics] },
  )();

// ─── Questions ────────────────────────────────────────────────────────────────

/** Public question list with filters — each unique opts combo gets its own cache entry */
export const getQuestions = (opts: GetQuestionsOptions) => {
  const key = JSON.stringify(opts);
  return unstable_cache(() => _getQuestions(opts), ["questions", key], {
    revalidate: false,
    tags: [CACHE_TAGS.questions],
  })();
};

/** Published categories — for /questions/[slug] nav */
export const getPublishedCategories = unstable_cache(
  () => _getPublishedCategories(),
  ["published-categories"],
  { revalidate: false, tags: [CACHE_TAGS.questions] },
);

/** Question slugs — for generateStaticParams on /q/[slug] */
export const getPublishedQuestionSlugs = unstable_cache(
  async () => {
    const result = await _getQuestions({
      filters: { status: "published" },
      pageSize: 1000,
      orderByField: "order",
      orderDir: "asc",
    });
    return result.questions.map((q) => q.slug);
  },
  ["published-question-slugs"],
  { revalidate: false, tags: [CACHE_TAGS.questions] },
);

/** Single question by slug — cached per slug, cleared on admin write */
export const getQuestionBySlug = (slug: string) =>
  unstable_cache(() => _getQuestionBySlug(slug), ["question-by-slug", slug], {
    revalidate: false,
    tags: [CACHE_TAGS.questions, `question-${slug}`],
  })();

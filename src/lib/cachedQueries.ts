/**
 * lib/cachedQueries.ts
 *
 * Next.js server-level cache for all public Firestore reads.
 * Results are only stored when a read returned real data (see cacheNonEmpty).
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

import {
  getQuestions as _getQuestions,
  getPublishedCategories as _getPublishedCategories,
  getQuestionBySlug as _getQuestionBySlug,
} from "@/lib/questions";

import type { GetQuestionsOptions } from "@/lib/questions";
import type { Question } from "@/types/question";

// Embedding vectors are only used by the admin generation pipeline, which reads
// Firestore directly. They made up about 69% of the /sprint HTML, because these
// results get passed to client components.
function withoutEmbedding(question: Question): Question {
  const { embedding: _embedding, ...rest } = question;
  return rest;
}

// ─── Cache tags ───────────────────────────────────────────────────────────────
// Used to invalidate specific caches on admin write without waiting for TTL.

export const CACHE_TAGS = {
  topics: "topics",
  blogPosts: "blog-posts",
  questions: "questions",
  leaderboard: "leaderboard",
} as const;

// Cached entries also expire, so a bad entry can't live forever. Admin writes
// still clear them immediately through revalidateTag().
const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60;

/** Carries an empty result out of unstable_cache so that it isn't stored. */
class EmptyResult extends Error {
  constructor(readonly value: unknown) {
    super("Empty result, not cached");
  }
}

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  const questions = (value as { questions?: unknown[] }).questions;
  return Array.isArray(questions) && questions.length === 0;
}

/**
 * unstable_cache that only stores real results. Errors and empty results are
 * passed to the caller but never cached, because a failed or quota-limited read
 * can look empty, and caching that would blank a page until the entry expired.
 * The cost is that a genuinely empty query is read again on each request.
 */
function cacheNonEmpty<T>(
  read: () => Promise<T>,
  keyParts: string[],
  tags: string[],
): () => Promise<T> {
  const cached = unstable_cache(
    async () => {
      const value = await read();
      if (isEmpty(value)) throw new EmptyResult(value);
      return value;
    },
    keyParts,
    { revalidate: CACHE_TTL_SECONDS, tags },
  );
  return () =>
    cached().catch((err) => {
      if (err instanceof EmptyResult) return err.value as T;
      throw err;
    });
}

// ─── Topics ───────────────────────────────────────────────────────────────────

/** All published topics — listings, sitemaps, generateStaticParams */
export const getPublishedTopics = ({ track }: { track?: string } = {}) =>
  cacheNonEmpty(
    () => getTopics({ status: "published", track }),
    ["published-topics", track ? `track-${track}` : "all-tracks"],
    [CACHE_TAGS.topics],
  )();

/** Topic slugs — lightweight for generateStaticParams */
export const getTopicSlugs = async ({ track }: { track?: string } = {}) =>
  cacheNonEmpty(
    async () => {
      const topics = await getTopics({ status: "published", track });
      return topics.map((t) => t.slug);
    },
    ["topic-slugs", track ? `track-${track}` : "all-tracks"],
    [CACHE_TAGS.topics],
  )();

/** Single topic by slug — slug baked into key AND per-slug tag for granular invalidation */
export const getTopicBySlug = (slug: string) =>
  cacheNonEmpty(
    () => _getTopicBySlug(slug),
    ["topic-by-slug", slug],
    [CACHE_TAGS.topics, `topic-${slug}`],
  )();

/** Related topics by slug array */
export const getRelatedTopics = (slugs: string[], track?: string) => {
  const key = [...slugs].sort().join(",");
  return cacheNonEmpty(
    () => _getRelatedTopics({ slugs, track }),
    ["related-topics", key],
    [CACHE_TAGS.topics],
  )();
};

// ─── Blog posts ───────────────────────────────────────────────────────────────

/** All published posts — for /blog listing + sitemaps */
export const getPublishedBlogPosts = ({ track }: { track?: string } = {}) =>
  cacheNonEmpty(
    () => getBlogPosts({ status: "published", track }),
    ["published-blog-posts", track ? `track-${track}` : "all-tracks"],
    [CACHE_TAGS.blogPosts],
  )();

/** Blog post slugs — for generateStaticParams */
export const getBlogPostSlugs = ({ track }: { track?: string } = {}) =>
  cacheNonEmpty(
    async () => {
      const posts = await getBlogPosts({ status: "published", track });
      return posts.map((p) => p.slug);
    },
    ["blog-post-slugs", track ? `track-${track}` : "all-tracks"],
    [CACHE_TAGS.blogPosts],
  )();

/** Single post by slug — slug baked into key AND per-slug tag for granular invalidation */
export const getBlogPostBySlug = (slug: string) =>
  cacheNonEmpty(
    () => _getBlogPostBySlug(slug),
    ["blog-post-by-slug", slug],
    [CACHE_TAGS.blogPosts, `blog-${slug}`],
  )();

/** Posts linked to a topic — topicSlug baked into key */
export const getBlogPostsForTopic = (topicSlug: string) =>
  cacheNonEmpty(
    () => _getBlogPostsForTopic(topicSlug),
    ["blog-posts-for-topic", topicSlug],
    [CACHE_TAGS.blogPosts, CACHE_TAGS.topics],
  )();

// ─── Questions ────────────────────────────────────────────────────────────────

/** Public question list with filters — each unique opts combo gets its own cache entry */
export const getQuestions = (opts: GetQuestionsOptions) => {
  const key = JSON.stringify(opts);
  return cacheNonEmpty(
    async () => {
      const result = await _getQuestions(opts);
      return { ...result, questions: result.questions.map(withoutEmbedding) };
    },
    ["questions", key],
    [CACHE_TAGS.questions],
  )();
};

/** Published categories — for /questions/[slug] nav */
export const getPublishedCategories = ({ track }: { track?: string } = {}) =>
  cacheNonEmpty(
    () => _getPublishedCategories({ track }),
    ["published-categories", track ? `track-${track}` : "all-tracks"],
    [CACHE_TAGS.questions],
  )();

/** Question slugs — for generateStaticParams on /q/[slug] */
export const getPublishedQuestionSlugs = cacheNonEmpty(
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
  [CACHE_TAGS.questions],
);

/** Single question by slug — cached per slug, cleared on admin write */
export const getQuestionBySlug = (slug: string) =>
  cacheNonEmpty(
    async () => {
      const question = await _getQuestionBySlug(slug);
      return question && withoutEmbedding(question);
    },
    ["question-by-slug", slug],
    [CACHE_TAGS.questions, `question-${slug}`],
  )();

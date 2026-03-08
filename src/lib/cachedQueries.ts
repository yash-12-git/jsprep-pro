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

import { unstable_cache } from 'next/cache'

import {
  getTopics,
  getTopicBySlug as _getTopicBySlug,
  getRelatedTopics as _getRelatedTopics,
} from '@/lib/topics'

import {
  getBlogPosts,
  getBlogPostBySlug as _getBlogPostBySlug,
  getBlogPostsForTopic as _getBlogPostsForTopic,
} from '@/lib/blogPosts'

import {
  getQuestions as _getQuestions,
  getPublishedCategories as _getPublishedCategories,
} from '@/lib/questions'

import type { GetQuestionsOptions } from '@/lib/questions'

// ─── Cache tags ───────────────────────────────────────────────────────────────
// Used to invalidate specific caches on admin write without waiting for TTL.

export const CACHE_TAGS = {
  topics:    'topics',
  blogPosts: 'blog-posts',
  questions: 'questions',
} as const

// revalidate: false = cache forever, cleared only by revalidateTag() on admin write

// ─── Topics ───────────────────────────────────────────────────────────────────

/** All published topics — listings, sitemaps, generateStaticParams */
export const getPublishedTopics = unstable_cache(
  () => getTopics({ status: 'published' }),
  ['published-topics'],
  { revalidate: false, tags: [CACHE_TAGS.topics] },
)

/** Topic slugs — lightweight for generateStaticParams */
export const getTopicSlugs = unstable_cache(
  async () => {
    const topics = await getTopics({ status: 'published' })
    return topics.map(t => t.slug)
  },
  ['topic-slugs'],
  { revalidate: false, tags: [CACHE_TAGS.topics] },
)

/** Single topic by slug */
export const getTopicBySlug = unstable_cache(
  (slug: string) => _getTopicBySlug(slug),
  ['topic-by-slug'],
  { revalidate: false, tags: [CACHE_TAGS.topics] },
)

/** Related topics by slug array */
export const getRelatedTopics = unstable_cache(
  (slugs: string[]) => _getRelatedTopics(slugs),
  ['related-topics'],
  { revalidate: false, tags: [CACHE_TAGS.topics] },
)

// ─── Blog posts ───────────────────────────────────────────────────────────────

/** All published posts — for /blog listing + sitemaps */
export const getPublishedBlogPosts = unstable_cache(
  () => getBlogPosts({ status: 'published' }),
  ['published-blog-posts'],
  { revalidate: false, tags: [CACHE_TAGS.blogPosts] },
)

/** Blog post slugs — for generateStaticParams */
export const getBlogPostSlugs = unstable_cache(
  async () => {
    const posts = await getBlogPosts({ status: 'published' })
    return posts.map(p => p.slug)
  },
  ['blog-post-slugs'],
  { revalidate: false, tags: [CACHE_TAGS.blogPosts] },
)

/** Single post by slug */
export const getBlogPostBySlug = unstable_cache(
  (slug: string) => _getBlogPostBySlug(slug),
  ['blog-post-by-slug'],
  { revalidate: false, tags: [CACHE_TAGS.blogPosts] },
)

/** Posts linked to a topic — for /[topic] "Deep Dive Articles" section */
export const getBlogPostsForTopic = unstable_cache(
  (topicSlug: string) => _getBlogPostsForTopic(topicSlug),
  ['blog-posts-for-topic'],
  { revalidate: false, tags: [CACHE_TAGS.blogPosts, CACHE_TAGS.topics] },
)

// ─── Questions ────────────────────────────────────────────────────────────────

/** Public question list with filters — for topic pages, sitemaps, generateStaticParams */
export const getQuestions = unstable_cache(
  (opts: GetQuestionsOptions) => _getQuestions(opts),
  ['questions'],
  { revalidate: false, tags: [CACHE_TAGS.questions] },
)

/** Published categories — for /questions/[slug] nav */
export const getPublishedCategories = unstable_cache(
  () => _getPublishedCategories(),
  ['published-categories'],
  { revalidate: false, tags: [CACHE_TAGS.questions] },
)

/** Question slugs — for generateStaticParams on /q/[slug] */
export const getPublishedQuestionSlugs = unstable_cache(
  async () => {
    const result = await _getQuestions({
      filters: { status: 'published' },
      pageSize: 1000,
      orderByField: 'order',
      orderDir: 'asc',
    })
    return result.questions.map(q => q.slug)
  },
  ['published-question-slugs'],
  { revalidate: false, tags: [CACHE_TAGS.questions] },
)
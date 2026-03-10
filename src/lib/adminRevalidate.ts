/**
 * lib/adminRevalidate.ts
 *
 * Granular cache invalidation — only clear what actually changed.
 *
 * BEFORE (broken): saving one topic → revalidateTag('topics') → ALL 35 topic
 * cache entries cleared → next visitor to any topic page = Firestore read.
 *
 * AFTER (fixed): saving topic 'closures' → revalidateTag('topic-javascript-closure-...')
 * → only that one topic's cache clears → other 34 topics unaffected.
 *
 * Broad tags (revalidateTopics, revalidateBlogPosts) kept for bulk ops like seeding.
 */

"use server";

import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cachedQueries";

// ─── Granular — use these in admin save handlers ──────────────────────────────

/** Clears only the cache for a single topic slug. Use after editing one topic. */
export async function revalidateTopic(slug: string) {
  revalidateTag(`topic-${slug}`);
  // Also clear the topics list (for /topics page and sitemaps)
  revalidateTag(CACHE_TAGS.topics);
}

/** Clears only the cache for a single blog post slug. Use after editing one post. */
export async function revalidateBlogPost(slug: string) {
  revalidateTag(`blog-${slug}`);
  // Also clear the posts list (for /blog page and sitemaps)
  revalidateTag(CACHE_TAGS.blogPosts);
}

/** Clears question caches — questions don't have individual slugs in cache yet */
export async function revalidateQuestions() {
  revalidateTag(CACHE_TAGS.questions);
}

// ─── Broad — only for bulk operations (seeding, migrations) ──────────────────

/** Clears ALL topic caches. Use only after bulk topic migrations. */
export async function revalidateTopics() {
  revalidateTag(CACHE_TAGS.topics);
}

/** Clears ALL blog post caches. Use only after bulk blog migrations. */
export async function revalidateBlogPosts() {
  revalidateTag(CACHE_TAGS.blogPosts);
}

/** Nuclear: clears everything. Use after bulk data migrations only. */
export async function revalidateAll() {
  revalidateTag(CACHE_TAGS.topics);
  revalidateTag(CACHE_TAGS.blogPosts);
  revalidateTag(CACHE_TAGS.questions);
}

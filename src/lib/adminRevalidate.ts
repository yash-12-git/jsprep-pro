/**
 * lib/adminRevalidate.ts
 *
 * Call these after any admin write to immediately clear the relevant
 * cache entries — visitors see updated content within seconds, not
 * waiting up to an hour for the TTL to expire.
 *
 * Usage in admin save handlers:
 *   await updateTopic(id, data)
 *   await revalidateTopics()        ← add this line
 *
 * These are server actions — must be called from server components
 * or route handlers, NOT from client components directly.
 */

'use server'

import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cachedQueries'

export async function revalidateTopics() {
  revalidateTag(CACHE_TAGS.topics)
}

export async function revalidateBlogPosts() {
  revalidateTag(CACHE_TAGS.blogPosts)
}

export async function revalidateQuestions() {
  revalidateTag(CACHE_TAGS.questions)
}

/** Nuclear option — clears everything. Use after bulk migrations. */
export async function revalidateAll() {
  revalidateTag(CACHE_TAGS.topics)
  revalidateTag(CACHE_TAGS.blogPosts)
  revalidateTag(CACHE_TAGS.questions)
}
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
 *
 * Browser side: adds the signed-in admin's token, which the server actions check.
 */

import { auth } from "@/lib/firebase";
import {
  revalidateBlogPostAction,
  revalidateTagsAction,
  revalidateTopicAction,
} from "@/lib/adminRevalidateActions";

async function adminToken(): Promise<string> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Sign in as an admin to clear the cache");
  return token;
}

// ─── Granular — use these in admin save handlers ──────────────────────────────

/** Clears only the cache for a single topic slug. Use after editing one topic. */
export async function revalidateTopic(slug: string) {
  await revalidateTopicAction(await adminToken(), slug);
}

/** Clears only the cache for a single blog post slug. Use after editing one post. */
export async function revalidateBlogPost(slug: string) {
  await revalidateBlogPostAction(await adminToken(), slug);
}

/** Clears question caches — questions don't have individual slugs in cache yet */
export async function revalidateQuestions() {
  await revalidateTagsAction(await adminToken(), ["questions"]);
}

// ─── Broad — only for bulk operations (seeding, migrations) ──────────────────

/** Clears ALL topic caches. Use only after bulk topic migrations. */
export async function revalidateTopics() {
  await revalidateTagsAction(await adminToken(), ["topics"]);
}

/** Clears ALL blog post caches. Use only after bulk blog migrations. */
export async function revalidateBlogPosts() {
  await revalidateTagsAction(await adminToken(), ["blogPosts"]);
}

/** Clears the given collections' caches. The admin layout registers this with lib/contentCache. */
export async function revalidateContent(tags: ("topics" | "blogPosts" | "questions")[]) {
  if (tags.length) await revalidateTagsAction(await adminToken(), tags);
}

/** Clears everything: after bulk migrations, or edits made outside the admin. */
export async function revalidateAll() {
  await revalidateTagsAction(await adminToken(), [
    "topics",
    "blogPosts",
    "questions",
  ]);
}

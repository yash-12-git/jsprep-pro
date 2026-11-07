/**
 * lib/adminRevalidateActions.ts
 *
 * Server actions behind lib/adminRevalidate.ts. Server actions are public POST
 * endpoints, and clearing the cache forces Firestore re-reads that count against
 * the daily quota, so each one checks for the admin claim.
 */

"use server";

import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cachedQueries";
import { verifyAdmin } from "@/lib/firebaseAdmin";

async function requireAdmin(idToken: string) {
  if (!(await verifyAdmin(`Bearer ${idToken}`))) {
    throw new Error("Unauthorized");
  }
}

export async function revalidateTopicAction(idToken: string, slug: string) {
  await requireAdmin(idToken);
  revalidateTag(`topic-${slug}`);
  // Also clear the topics list (for /topics page and sitemaps)
  revalidateTag(CACHE_TAGS.topics);
}

export async function revalidateBlogPostAction(idToken: string, slug: string) {
  await requireAdmin(idToken);
  revalidateTag(`blog-${slug}`);
  // Also clear the posts list (for /blog page and sitemaps)
  revalidateTag(CACHE_TAGS.blogPosts);
}

export async function revalidateTagsAction(
  idToken: string,
  tags: (keyof typeof CACHE_TAGS)[],
) {
  await requireAdmin(idToken);
  for (const tag of tags) revalidateTag(CACHE_TAGS[tag]);
}

/**
 * Clears the public pages' cached copy of a content collection after an admin
 * write, so the change shows on the live site at once. Every write function
 * in lib/questions, lib/topics and lib/blogPosts calls this, which covers every
 * admin screen without each one having to remember.
 *
 * It clears the whole collection's tag rather than one slug: a write can change
 * a slug, a status or an order, which affects lists and other pages too. Admin
 * writes are rare, so the extra reads are small.
 *
 * The admin layout registers the clearer. This file must not import
 * lib/adminRevalidate itself, even dynamically: those libs are also bundled
 * into server and edge routes (the topic share image), and the server actions
 * behind it pull in firebase-admin, which the edge runtime can't build.
 */

export type ContentKind = "questions" | "topics" | "blogPosts";

type Clearer = (kinds: ContentKind[]) => Promise<void>;

let clearer: Clearer | null = null;

export function registerContentCacheClearer(fn: Clearer) {
  clearer = fn;
}

export async function clearContentCache(...kinds: ContentKind[]) {
  // Server code (cachedQueries) imports the same libs but never writes.
  if (typeof window === "undefined") return;
  try {
    if (!clearer) throw new Error("No cache clearer registered outside /admin");
    await clearer(kinds);
  } catch (err) {
    // The write itself succeeded, so don't fail it; say what to do instead.
    console.error("[contentCache] could not clear the site cache", err);
    window.alert(
      "Saved. The live site couldn't be refreshed, so the change may not show yet. " +
        "Use “Refresh site content” on the admin dashboard.",
    );
  }
}

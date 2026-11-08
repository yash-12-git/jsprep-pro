/**
 * Browser-side memo for the signed-in user's own Firestore reads (sprints,
 * interviews, interview log, readiness). Moving between pages reuses the last
 * read instead of paying for it again.
 *
 * Kept correct by the write functions: each one calls forget() for what it
 * changed once the write lands. Changes made on another device show up after
 * SESSION_TTL_MS or a reload.
 */

export const SESSION_TTL_MS = 10 * 60 * 1000;

const store = new Map<string, { at: number; value: Promise<unknown> }>();

/** Returns the remembered result for `key`, or runs `read` and remembers it. */
export function remember<T>(key: string, read: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  const value =
    hit && Date.now() - hit.at < SESSION_TTL_MS ? (hit.value as Promise<T>) : null;
  if (value) return value.then(copy);

  const fresh = read();
  store.set(key, { at: Date.now(), value: fresh });
  // Never keep a failed read.
  fresh.catch(() => {
    if (store.get(key)?.value === fresh) store.delete(key);
  });
  return fresh.then(copy);
}

/** Drops every remembered read whose key starts with `prefix`. */
export function forget(prefix: string) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

// Callers get their own array, so sorting or filtering one can't change another's.
function copy<T>(value: T): T {
  return (Array.isArray(value) ? [...value] : value) as T;
}

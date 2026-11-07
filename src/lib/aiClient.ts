/**
 * Browser helper for POST /api/ai. Sends the signed-in user's ID token when
 * there is one, and throws on any non-2xx response so callers can't mistake an
 * error body for an AI reply.
 */

import { auth } from "@/lib/firebase";

export class AIRequestError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "AIRequestError";
  }
}

/** A message for the user explaining why an AI request failed. */
export function aiErrorMessage(err: unknown): string {
  switch (err instanceof AIRequestError ? err.status : null) {
    case 401:
      return "Please sign in again to use this.";
    case 402:
      // The free allowance is used up; the server says which one.
      return (err as AIRequestError).message;
    case 403:
      return "This needs an active Pro plan.";
    case 429:
      return "You've used today's AI limit. It resets tomorrow.";
    case 503:
      return "The AI is busy right now. Try again in a minute.";
    default:
      return "We couldn't get a response from the AI. Try again in a moment.";
  }
}

export async function postAI(payload: unknown): Promise<{ text: string }> {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
    // Longer than the server's own limit of 20s per model, so this only fires
    // if the request is truly stuck.
    signal: AbortSignal.timeout(60_000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new AIRequestError(res.status, data.error ?? "AI request failed");
  }
  return data;
}

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

export async function postAI(payload: unknown): Promise<{ text: string }> {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new AIRequestError(res.status, data.error ?? "AI request failed");
  }
  return data;
}

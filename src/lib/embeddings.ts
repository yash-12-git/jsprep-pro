/**
 * src/lib/embeddings.ts
 *
 * Embedding generation + cosine similarity + RAG helpers.
 *
 * Uses Cohere embed-english-light-v3.0 — free trial key, no credit card,
 * works on Vercel serverless (pure HTTP, no model download).
 *
 * Free tier: ~1000 calls/month on trial key — more than enough for the
 * admin generate pipeline (a few calls per session).
 *
 * Sign up at cohere.com → API Keys → copy the trial key
 *
 * Add to .env.local AND Vercel env vars:
 *   COHERE_API_KEY=...
 *
 * Dimensions: 384 (embed-english-light-v3.0)
 */

import type { Question } from "@/types/question";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SimilarQuestion {
  id: string;
  title: string;
  type: string;
  category: string;
  score: number;
}

// ─── Embedding generation (Cohere — works on Vercel) ─────────────────────────

export async function getEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) throw new Error("COHERE_API_KEY not set");

  const res = await fetch("https://api.cohere.com/v2/embed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "embed-english-light-v3.0",
      texts: [text.slice(0, 512)],
      input_type: "search_document",
      embedding_types: ["float"],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cohere error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.embeddings.float[0] as number[];
}

/**
 * Build type-aware embedding input — kept under 512 chars.
 *
 * Theory:  title + answer (stripped) + explanation
 * Output:  title + code + expectedOutput
 * Debug:   title + bugDescription + brokenCode
 */
export function buildEmbeddingInput(q: {
  title?: string;
  question?: string;
  answer?: string;
  explanation?: string;
  code?: string;
  expectedOutput?: string;
  brokenCode?: string;
  bugDescription?: string;
  type?: string;
}): string {
  const type = q.type ?? "theory";
  const title = q.title || q.question || "";
  const parts: string[] = [title];

  if (type === "output") {
    if (q.code) parts.push(q.code.slice(0, 200));
    if (q.expectedOutput) parts.push(`Output: ${q.expectedOutput}`);
  } else if (type === "debug") {
    if (q.bugDescription) parts.push(q.bugDescription);
    if (q.brokenCode) parts.push(q.brokenCode.slice(0, 200));
  } else {
    if (q.answer) parts.push(q.answer.replace(/<[^>]*>/g, "").slice(0, 200));
    if (q.explanation) parts.push(q.explanation.slice(0, 100));
  }

  return parts.filter(Boolean).join(" ").slice(0, 512);
}

// ─── Cosine similarity ────────────────────────────────────────────────────────

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length || a.length === 0) return 0;
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

// ─── Similarity search ────────────────────────────────────────────────────────

export function findSimilarQuestions(
  targetEmbedding: number[],
  questions: Question[],
  topK: number = 5,
  minScore: number = 0.3,
): SimilarQuestion[] {
  return questions
    .filter((q) => q.embedding && q.embedding.length > 0)
    .map((q) => ({
      id: q.id,
      title: q.title,
      type: q.type,
      category: q.category,
      score: cosineSimilarity(targetEmbedding, q.embedding!),
    }))
    .filter((q) => q.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export function findDuplicate(
  targetEmbedding: number[],
  questions: Question[],
  threshold: number = 0.85,
): SimilarQuestion | null {
  const similar = findSimilarQuestions(
    targetEmbedding,
    questions,
    1,
    threshold,
  );
  return similar[0] ?? null;
}

// ─── RAG context builder ──────────────────────────────────────────────────────

export function buildRAGContext(similar: SimilarQuestion[]): string {
  if (!similar || similar.length === 0) return "";
  const lines = similar
    .slice(0, 5)
    .map((q) => `- [${q.type}] ${q.title} (${q.category})`);
  return `Related questions already in the database:\n${lines.join("\n")}`;
}

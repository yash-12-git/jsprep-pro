/**
 * src/app/api/cron/route.ts
 *
 * Weekly question generation cron job.
 * Triggered by Vercel Cron (configure in vercel.json).
 * Generates 2-3 candidate questions per thin category and stores
 * them in `questions_pending` collection for admin review.
 *
 * Add to vercel.json:
 * {
 *   "crons": [{"path": "/api/cron", "schedule": "0 9 * * 1"}]
 * }
 *
 * Add to .env.local:
 *   CRON_SECRET=your-random-secret-here
 *   ADMIN_EMAIL=your@email.com
 */

import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  getEmbedding,
  buildEmbeddingInput,
  findDuplicate,
} from "@/lib/embeddings";
import type { Question } from "@/types/question";

const QUESTIONS_COL = "questions";
const PENDING_COL = "questions_pending";
const DUPLICATE_THRESHOLD = 0.85;
const QUESTIONS_PER_CATEGORY = 2;

// ── SANDBOX CONTRACT ──────────────────────────────────────────────────────────
// output + debug questions MUST satisfy:
//   - Pure JS only (no fetch, DOM, React, Node.js APIs)
//   - All output via console.log
//   - debug: brokenCode runs without throwing — produces WRONG output
//   - debug: fixedCode produces expectedOutput
//   - expectedOutput never contains "Error", "TypeError" etc.
//   - One concept per question
const GENERATION_TARGETS = [
  // Theory — no sandbox restrictions
  {
    type: "theory",
    category: "Async JS",
    difficulty: "advanced",
    topics: [
      "Promise.all vs Promise.allSettled",
      "async iterator patterns",
      "microtask vs macrotask",
    ],
  },
  {
    type: "theory",
    category: "Closures",
    difficulty: "core",
    topics: [
      "closure over mutable state",
      "module pattern",
      "memoization with closures",
    ],
  },
  {
    type: "theory",
    category: "Modern JS",
    difficulty: "core",
    topics: [
      "optional chaining edge cases",
      "nullish coalescing vs OR",
      "WeakMap vs Map",
    ],
  },
  {
    type: "theory",
    category: "'this' Keyword",
    difficulty: "core",
    topics: [
      "bind vs call vs apply",
      "arrow function this",
      "this in constructors",
    ],
  },
  // Output — pure JS only, deterministic console.log
  {
    type: "output",
    category: "Event Loop & Promises",
    difficulty: "advanced",
    topics: [
      "Promise microtask order",
      "queueMicrotask vs setTimeout",
      "async/await execution order",
    ],
  },
  {
    type: "output",
    category: "Closures & Scope",
    difficulty: "core",
    topics: [
      "var in for loop",
      "IIFE scope capture",
      "let vs var in callbacks",
    ],
  },
  {
    type: "output",
    category: "Type Coercion",
    difficulty: "easy",
    topics: [
      "loose equality quirks",
      "plus operator coercion",
      "truthy falsy values",
    ],
  },
  {
    type: "output",
    category: "Hoisting",
    difficulty: "easy",
    topics: ["var hoisting", "function declaration hoisting", "var vs let TDZ"],
  },
  // Debug — pure JS, bug produces WRONG OUTPUT (never throws), fixedCode correct
  {
    type: "debug",
    category: "Closures & Scope",
    difficulty: "medium",
    topics: [
      "loop closure var bug",
      "shared state across factory calls",
      "stale closure mutation",
    ],
  },
  {
    type: "debug",
    category: "'this' Binding",
    difficulty: "medium",
    topics: [
      "method detached from object",
      "regular callback loses this",
      "bind vs arrow in class",
    ],
  },
  {
    type: "debug",
    category: "Array & Object Mutations",
    difficulty: "easy",
    topics: [
      "sort mutates original",
      "map with object reference",
      "Object.assign first arg mutation",
    ],
  },
  {
    type: "debug",
    category: "Type Coercion",
    difficulty: "easy",
    topics: [
      "NaN comparison bug",
      "loose equality wrong branch",
      "plus operator string concat",
    ],
  },
];

async function fetchExistingQuestions(): Promise<Question[]> {
  const snap = await getDocs(
    query(collection(db, QUESTIONS_COL), where("status", "==", "published")),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Question);
}

async function generateAndSavePending(
  target: (typeof GENERATION_TARGETS)[0],
  topic: string,
  existing: Question[],
): Promise<{ saved: boolean; reason: string; title?: string }> {
  try {
    // Call generate endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
      body: JSON.stringify({
        type: target.type,
        category: target.category,
        difficulty: target.difficulty,
        topic,
        count: 1,
      }),
    });

    const data = await res.json();
    const candidate = data.candidates?.[0];

    if (!candidate || candidate.error || !candidate.question) {
      return { saved: false, reason: candidate?.error ?? "Generation failed" };
    }

    if (candidate.isDuplicate) {
      return {
        saved: false,
        reason: `Duplicate of "${candidate.duplicateOf?.title}" (similarity: ${(candidate.duplicateOf?.score * 100).toFixed(0)}%)`,
        title: candidate.question.title,
      };
    }

    // Save to pending collection for admin review
    await addDoc(collection(db, PENDING_COL), {
      ...candidate.question,
      embedding: candidate.embedding,
      topSimilar: candidate.topSimilar,
      similarityScore: candidate.similarityScore,
      generatedAt: Timestamp.now(),
      generatedTopic: topic,
      status: "pending", // pending | approved | rejected
      reviewedAt: null,
      reviewedBy: null,
    });

    return {
      saved: true,
      reason: "Saved to pending review",
      title: candidate.question.title,
    };
  } catch (err) {
    return { saved: false, reason: String(err) };
  }
}

export async function GET(req: NextRequest) {
  // Vercel cron sends Authorization header with CRON_SECRET
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const results: {
    target: string;
    topic: string;
    saved: boolean;
    reason: string;
    title?: string;
  }[] = [];

  try {
    const existing = await fetchExistingQuestions();
    console.log(`[Cron] Fetched ${existing.length} existing questions`);

    // Shuffle topics for variety across runs
    for (const target of GENERATION_TARGETS) {
      const shuffled = [...target.topics].sort(() => Math.random() - 0.5);
      const topics = shuffled.slice(0, QUESTIONS_PER_CATEGORY);

      for (const topic of topics) {
        const result = await generateAndSavePending(target, topic, existing);
        results.push({
          target: `${target.type}:${target.category}`,
          topic,
          ...result,
        });
        // Rate limit between generations
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    const saved = results.filter((r) => r.saved).length;
    const rejected = results.filter((r) => !r.saved).length;
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(
      `[Cron] Done: ${saved} saved, ${rejected} rejected in ${duration}s`,
    );

    return NextResponse.json({
      ok: true,
      saved,
      rejected,
      duration: `${duration}s`,
      results,
    });
  } catch (err) {
    console.error("[Cron] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

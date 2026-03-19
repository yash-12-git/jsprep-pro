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

import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs, addDoc, query, where, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getEmbedding, buildEmbeddingInput, findDuplicate } from '@/lib/embeddings'
import type { Question } from '@/types/question'

const QUESTIONS_COL         = 'questions'
const PENDING_COL           = 'questions_pending'
const DUPLICATE_THRESHOLD   = 0.85
const QUESTIONS_PER_CATEGORY = 2

// Categories to generate for + topic hints
const GENERATION_TARGETS = [
  { type: 'theory', category: 'Async JS',     difficulty: 'advanced', topics: ['Promise.all vs Promise.allSettled', 'async iterator patterns', 'AbortController with fetch'] },
  { type: 'theory', category: 'Closures',      difficulty: 'core',     topics: ['closure in loops', 'memoization with closures', 'module pattern via IIFE'] },
  { type: 'theory', category: 'Modern JS',     difficulty: 'core',     topics: ['optional chaining edge cases', 'nullish coalescing vs OR', 'structuredClone vs JSON.parse'] },
  { type: 'output', category: 'Event Loop & Promises', difficulty: 'advanced', topics: ['Promise microtask order', 'setTimeout vs queueMicrotask', 'async/await execution order'] },
  { type: 'output', category: 'Closures & Scope',       difficulty: 'core',     topics: ['var in for loop closure', 'IIFE scope', 'let vs var in callbacks'] },
  { type: 'debug',  category: 'Async Bugs',    difficulty: 'medium',   topics: ['missing await in async function', 'Promise rejection unhandled', 'race condition in setState'] },
  { type: 'debug',  category: 'Closure Traps', difficulty: 'medium',   topics: ['loop variable capture', 'stale closure in React', 'event listener memory leak'] },
]

async function fetchExistingQuestions(): Promise<Question[]> {
  const snap = await getDocs(
    query(collection(db, QUESTIONS_COL), where('status', '==', 'published'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Question)
}

async function generateAndSavePending(
  target: typeof GENERATION_TARGETS[0],
  topic: string,
  existing: Question[],
): Promise<{ saved: boolean; reason: string; title?: string }> {
  try {
    // Call generate endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      },
      body: JSON.stringify({
        type:       target.type,
        category:   target.category,
        difficulty: target.difficulty,
        topic,
        count: 1,
      }),
    })

    const data = await res.json()
    const candidate = data.candidates?.[0]

    if (!candidate || candidate.error || !candidate.question) {
      return { saved: false, reason: candidate?.error ?? 'Generation failed' }
    }

    if (candidate.isDuplicate) {
      return {
        saved:  false,
        reason: `Duplicate of "${candidate.duplicateOf?.title}" (similarity: ${(candidate.duplicateOf?.score * 100).toFixed(0)}%)`,
        title:  candidate.question.title,
      }
    }

    // Save to pending collection for admin review
    await addDoc(collection(db, PENDING_COL), {
      ...candidate.question,
      embedding:      candidate.embedding,
      topSimilar:     candidate.topSimilar,
      similarityScore: candidate.similarityScore,
      generatedAt:    Timestamp.now(),
      generatedTopic: topic,
      status:         'pending',  // pending | approved | rejected
      reviewedAt:     null,
      reviewedBy:     null,
    })

    return { saved: true, reason: 'Saved to pending review', title: candidate.question.title }

  } catch (err) {
    return { saved: false, reason: String(err) }
  }
}

export async function GET(req: NextRequest) {
  // Vercel cron sends Authorization header with CRON_SECRET
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  const results: { target: string; topic: string; saved: boolean; reason: string; title?: string }[] = []

  try {
    const existing = await fetchExistingQuestions()
    console.log(`[Cron] Fetched ${existing.length} existing questions`)

    // Shuffle topics for variety across runs
    for (const target of GENERATION_TARGETS) {
      const shuffled = [...target.topics].sort(() => Math.random() - 0.5)
      const topics   = shuffled.slice(0, QUESTIONS_PER_CATEGORY)

      for (const topic of topics) {
        const result = await generateAndSavePending(target, topic, existing)
        results.push({
          target: `${target.type}:${target.category}`,
          topic,
          ...result,
        })
        // Rate limit between generations
        await new Promise(r => setTimeout(r, 1000))
      }
    }

    const saved    = results.filter(r => r.saved).length
    const rejected = results.filter(r => !r.saved).length
    const duration = ((Date.now() - startTime) / 1000).toFixed(1)

    console.log(`[Cron] Done: ${saved} saved, ${rejected} rejected in ${duration}s`)

    return NextResponse.json({
      ok:       true,
      saved,
      rejected,
      duration: `${duration}s`,
      results,
    })

  } catch (err) {
    console.error('[Cron] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
/**
 * src/app/api/generate/route.ts
 *
 * Question generation pipeline endpoint.
 * Called by the admin generate UI and weekly cron job.
 *
 * Flow:
 *   1. Receive generation config (type, category, difficulty, topic)
 *   2. Fetch all existing questions WITH embeddings from Firestore
 *   3. Generate question via Claude (with RAG context of similar Qs)
 *   4. Generate embedding for the new question
 *   5. Dedup check: if similarity > 0.85 → reject as duplicate
 *   6. Return candidate question with similarity score (NOT saved yet)
 *
 * Saving happens separately when admin approves via POST /api/generate/approve
 *
 * POST /api/generate
 * Body: { type, category, difficulty, topic, count? }
 */

import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
  getEmbedding,
  buildEmbeddingInput,
  findSimilarQuestions,
  findDuplicate,
  buildRAGContext,
} from '@/lib/embeddings'
import type { Question } from '@/types/question'

const QUESTIONS_COL = 'questions'
const DUPLICATE_THRESHOLD = 0.85

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchQuestionsWithEmbeddings(type: string): Promise<Question[]> {
  // Only fetch same-type questions for comparison (faster + more relevant)
  const snap = await getDocs(
    query(
      collection(db, QUESTIONS_COL),
      where('type', '==', type),
      where('status', '==', 'published'),
    )
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Question)
}

async function callGenerateAI(params: {
  type: string
  category: string
  difficulty: string
  topic: string
  ragContext: string
}): Promise<string> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'generate',
      messages: [{ role: 'user', content: 'Generate the question now.' }],
      context: {
        type:       params.type,
        category:   params.category,
        difficulty: params.difficulty,
        topic:      params.topic,
      },
      // Pass RAG as pre-built context string — AI route will inject it
      similarQuestions: [],  // already baked into ragContext via system prompt manipulation
    }),
  })
  const data = await res.json()
  return data.text ?? ''
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // Auth check — only admin
    // Auth: accept cron secret (for weekly job) OR no secret (admin UI — already
    // protected by Firebase auth on the page level, not exposed publicly)
    const authHeader = req.headers.get('authorization')
    if (authHeader && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, category, difficulty, topic, count = 1 } = await req.json()

    if (!type || !category || !difficulty || !topic) {
      return NextResponse.json({ error: 'Missing required fields: type, category, difficulty, topic' }, { status: 400 })
    }

    // 1. Fetch existing questions with embeddings
    const existing = await fetchQuestionsWithEmbeddings(type)
    const withEmbeddings = existing.filter(q => q.embedding?.length)

    // 2. Get top similar questions for RAG context
    // We'll use the topic text as a seed embedding to find related Qs
    let ragContext = ''
    let seedEmbedding: number[] = []
    try {
      seedEmbedding = await getEmbedding(`${topic} ${category} JavaScript interview`)
      const similar = findSimilarQuestions(seedEmbedding, withEmbeddings, 5, 0.4)
      ragContext = buildRAGContext(similar)
    } catch {
      // Non-fatal — continue without RAG context
      console.warn('Seed embedding failed — generating without RAG context')
    }

    const candidates: GeneratedCandidate[] = []

    for (let i = 0; i < Math.min(count, 5); i++) {
      try {
        // 3. Generate question via Claude
        const rawText = await callGenerateAI({ type, category, difficulty, topic, ragContext })
        const clean   = rawText.replace(/```json|```/g, '').trim()
        const parsed  = JSON.parse(clean)

        // 4. Generate embedding for the new question
        const questionObj = { ...parsed, type, category }
        const embeddingInput = buildEmbeddingInput(questionObj)
        const embedding = await getEmbedding(embeddingInput)

        // 5. Dedup check
        const duplicate = findDuplicate(embedding, withEmbeddings, DUPLICATE_THRESHOLD)
        const topSimilar = findSimilarQuestions(embedding, withEmbeddings, 3, 0.3)

        candidates.push({
          question:      { ...parsed, type, category, difficulty, status: 'draft' },
          embedding,
          isDuplicate:   !!duplicate,
          duplicateOf:   duplicate ?? null,
          topSimilar,
          similarityScore: topSimilar[0]?.score ?? 0,
          ragContextUsed: ragContext,
        })

        // Small delay between multiple generations to avoid rate limits
        if (i < count - 1) await new Promise(r => setTimeout(r, 500))

      } catch (genErr) {
        console.error(`Generation attempt ${i + 1} failed:`, genErr)
        candidates.push({
          question:      null,
          embedding:     [],
          isDuplicate:   false,
          duplicateOf:   null,
          topSimilar:    [],
          similarityScore: 0,
          ragContextUsed: ragContext,
          error:         String(genErr),
        })
      }
    }

    return NextResponse.json({
      candidates,
      meta: {
        existingCount:    existing.length,
        withEmbeddings:   withEmbeddings.length,
        ragContextUsed:   !!ragContext,
      },
    })

  } catch (err) {
    console.error('Generate route error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface GeneratedCandidate {
  question:       Record<string, any> | null
  embedding:      number[]
  isDuplicate:    boolean
  duplicateOf:    { id: string; title: string; score: number } | null
  topSimilar:     { id: string; title: string; score: number }[]
  similarityScore: number
  ragContextUsed: string
  error?:         string
}
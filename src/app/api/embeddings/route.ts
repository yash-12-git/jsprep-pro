/**
 * src/app/api/embeddings/route.ts
 *
 * Server-side embedding generation endpoint.
 * Called by the admin generate UI and backfill script.
 *
 * POST /api/embeddings
 * Body: { text: string } | { question: QuestionInput }
 */

import { NextRequest, NextResponse } from 'next/server'
import { getEmbedding, buildEmbeddingInput } from '@/lib/embeddings'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    let text: string

    if (typeof body.text === 'string') {
      // Raw text mode
      text = body.text
    } else if (body.question) {
      // Question object mode — builds type-aware input
      text = buildEmbeddingInput(body.question)
    } else {
      return NextResponse.json({ error: 'Provide text or question' }, { status: 400 })
    }

    if (!text.trim()) {
      return NextResponse.json({ error: 'Empty text' }, { status: 400 })
    }

    const embedding = await getEmbedding(text)
    return NextResponse.json({ embedding, dims: embedding.length })

  } catch (err: any) {
    console.error('Embeddings route error:', err)
    return NextResponse.json({ error: err.message ?? 'Embedding failed' }, { status: 500 })
  }
} 
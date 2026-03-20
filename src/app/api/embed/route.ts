/**
 * src/app/api/embed/route.ts
 *
 * Server-side embedding endpoint.
 * Called by the admin seed page — COHERE_API_KEY is only available server-side,
 * never in 'use client' components.
 *
 * POST /api/embed
 * Body: { text: string }
 * Returns: { embedding: number[] }
 */

import { NextRequest, NextResponse } from 'next/server'

const COHERE_URL  = 'https://api.cohere.ai/v1/embed'
const EMBED_MODEL = 'embed-english-light-v3.0'

export async function POST(req: NextRequest) {
  const apiKey = process.env.COHERE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'COHERE_API_KEY not set on server' }, { status: 500 })
  }

  try {
    const { text } = await req.json()
    if (!text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    const res = await fetch(COHERE_URL, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:      EMBED_MODEL,
        texts:      [text.slice(0, 4000)],
        input_type: 'search_document',
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `Cohere error: ${err}` }, { status: 502 })
    }

    const data = await res.json()
    const embedding: number[] = data.embeddings[0]

    return NextResponse.json({ embedding })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
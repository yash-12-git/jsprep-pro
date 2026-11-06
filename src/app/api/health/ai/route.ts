/**
 * GET /api/health/ai
 *
 * Checks that every configured Groq model still answers with valid JSON, and
 * returns 503 if any doesn't. Polled daily by .github/workflows/ai-health.yml,
 * whose failure notification is the alert. The fallback model hides a dead
 * primary from users, so this deliberately tests each model on its own.
 *
 * Requires `Authorization: Bearer <CRON_SECRET>`.
 */

import { NextRequest, NextResponse } from "next/server";
import { callGroqModel, GROQ_MODELS } from "@/lib/groq";

export const dynamic = "force-dynamic";

async function checkModel(model: (typeof GROQ_MODELS)[number]) {
  try {
    const text = await callGroqModel(model, {
      systemPrompt: 'Respond with ONLY this JSON object: {"ok": true}',
      messages: [{ role: "user", content: "Health check." }],
      maxTokens: 200,
      temperature: 0,
      json: true,
    });
    return { model: model.id, ok: JSON.parse(text).ok === true };
  } catch (err) {
    console.error("[health/ai] model failed:", err);
    return { model: model.id, ok: false };
  }
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const models = await Promise.all(GROQ_MODELS.map(checkModel));
  const ok = models.every((m) => m.ok);
  return NextResponse.json({ ok, models }, { status: ok ? 200 : 503 });
}

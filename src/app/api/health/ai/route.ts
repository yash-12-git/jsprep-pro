/**
 * GET /api/health/ai
 *
 * Checks that every configured Groq model still answers with valid JSON and that
 * the Firestore Admin SDK can read, and returns 503 if not. Polled daily by .github/workflows/ai-health.yml,
 * whose failure notification is the alert. The fallback model hides a dead
 * primary from users, so this deliberately tests each model on its own.
 *
 * Requires `Authorization: Bearer <CRON_SECRET>`.
 */

import { NextRequest, NextResponse } from "next/server";
import { withFirestoreTimeout } from "@/lib/aiAccess";
import { getAdminDb } from "@/lib/firebaseAdmin";
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

// AI limits and Pro payments rely on the Admin SDK, which can run out of quota
// while pages, using the client SDK, still look healthy.
async function checkFirestore() {
  try {
    await withFirestoreTimeout(
      getAdminDb().collection("users").limit(1).select().get(),
    );
    return true;
  } catch (err) {
    console.error("[health/ai] Firestore failed:", err);
    return false;
  }
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [models, firestore] = await Promise.all([
    Promise.all(GROQ_MODELS.map(checkModel)),
    checkFirestore(),
  ]);
  const ok = firestore && models.every((m) => m.ok);
  return NextResponse.json({ ok, models, firestore }, { status: ok ? 200 : 503 });
}

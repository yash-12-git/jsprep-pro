/**
 * scripts/backfill-embeddings.js
 *
 * One-time script — generates embeddings for all existing questions.
 * Uses Cohere embed API (same as production) — free trial key, no credit card.
 *
 * Setup (run from scripts/ folder):
 *   npm install firebase-admin dotenv node-fetch@2
 *
 * Run:
 *   node backfill-embeddings.js
 *
 * Cost: $0.00 (Cohere trial key)
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

const admin = require("firebase-admin");
const fetch = require("node-fetch");

// ─── Config ───────────────────────────────────────────────────────────────────

const COHERE_API_KEY = process.env.COHERE_API_KEY;
const QUESTIONS_COL = "questions";
const DELAY_MS = 200; // 5 req/sec — well within Cohere free tier

if (!COHERE_API_KEY) {
  console.error("❌ COHERE_API_KEY not found in .env.local");
  console.error("   Get a free trial key at cohere.com → API Keys");
  process.exit(1);
}

// ─── Firebase init ────────────────────────────────────────────────────────────

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildEmbeddingInput(q) {
  const type = q.type ?? "theory";
  const title = q.title || q.question || "";
  const parts = [title];

  if (type === "output") {
    if (q.code) parts.push(q.code.slice(0, 200));
    if (q.expectedOutput) parts.push(`Output: ${q.expectedOutput}`);
  } else if (type === "debug") {
    if (q.bugDescription) parts.push(q.bugDescription);
    if (q.brokenCode) parts.push(q.brokenCode.slice(0, 200));
  } else {
    const answer = (q.answer ?? "").replace(/<[^>]*>/g, "");
    if (answer) parts.push(answer.slice(0, 200));
    if (q.explanation) parts.push((q.explanation ?? "").slice(0, 100));
  }

  return parts.filter(Boolean).join(" ").slice(0, 512);
}

async function getEmbedding(text, retries = 2) {
  const res = await fetch("https://api.cohere.com/v2/embed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${COHERE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "embed-english-light-v3.0",
      texts: [text],
      input_type: "search_document",
      embedding_types: ["float"],
    }),
  });

  if (!res.ok) {
    // 429 rate limit — back off and retry
    if (res.status === 429 && retries > 0) {
      console.log("\n  ⏳ Rate limited, waiting 3s...");
      await sleep(3000);
      return getEmbedding(text, retries - 1);
    }
    const err = await res.text();
    throw new Error(`Cohere ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.embeddings.float[0];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Test the API key first
  console.log("🔑 Testing Cohere API key...");
  try {
    await getEmbedding("test");
    console.log("✅ API key valid\n");
  } catch (e) {
    console.error("❌ Cohere API key test failed:", e.message);
    process.exit(1);
  }

  console.log("🔍 Fetching questions from Firestore...");
  const snap = await db.collection(QUESTIONS_COL).get();
  const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Force re-embed ALL questions to replace xenova embeddings with Cohere
  const needsEmbedding = all;
  console.log(
    `📋 Total: ${all.length} | Already embedded: ${all.length - needsEmbedding.length} | To process: ${needsEmbedding.length}\n`,
  );

  if (needsEmbedding.length === 0) {
    console.log("🎉 All questions already have embeddings!");
    process.exit(0);
  }

  let processed = 0,
    failed = 0;

  for (const q of needsEmbedding) {
    try {
      const input = buildEmbeddingInput(q);
      const embedding = await getEmbedding(input);

      await db.collection(QUESTIONS_COL).doc(q.id).update({ embedding });
      processed++;

      const pct = ((processed / needsEmbedding.length) * 100).toFixed(0);
      process.stdout.write(
        `\r  [${pct}%] ${processed}/${needsEmbedding.length} done, ${failed} failed`,
      );
    } catch (err) {
      failed++;
      console.error(`\n  ⚠ Failed: ${q.title?.slice(0, 50)} — ${err.message}`);
    }

    await sleep(DELAY_MS);
  }

  console.log("\n\n────────────────────────────");
  console.log(`✅ Processed: ${processed}`);
  console.log(`❌ Failed:    ${failed}`);
  console.log(`💰 Cost:      $0.00`);
  console.log("────────────────────────────");
  console.log("Done! Delete scripts/serviceAccountKey.json now.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

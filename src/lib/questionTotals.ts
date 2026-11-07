/**
 * Published question counts and IDs per mode for the visitor's track. Server
 * only. Served from the Next.js Data Cache, so repeat visits don't hit Firestore.
 */

import { getQuestions } from "@/lib/cachedQueries";
import { getServerTrack } from "@/lib/getServerTrack";
import type { QuestionTotals } from "@/lib/readiness";

export async function getQuestionTotals(): Promise<QuestionTotals> {
  const track = await getServerTrack();
  const [theory, output, debug, polyfill] = await Promise.all(
    (["theory", "output", "debug", "polyfill"] as const).map((type) =>
      getQuestions({ filters: { track, status: "published", type }, pageSize: 300 }).catch(
        () => ({ questions: [] }),
      ),
    ),
  );

  return {
    theoryTotal: theory.questions.length,
    outputTotal: output.questions.length,
    debugTotal: debug.questions.length,
    polyfillTotal: polyfill.questions.length,
    // IDs so the client can cross-reference them against solvedIds.
    outputIds: output.questions.map((q) => q.id),
    debugIds: debug.questions.map((q) => q.id),
    polyfillIds: polyfill.questions.map((q) => q.id),
  };
}

import type { Metadata } from "next";
import { pageMeta, SITE } from "@/lib/seo/seo";
import SprintWrapper from "./SprintWrapper";
import { getServerTrack } from "@/lib/getServerTrack";
import { getQuestions } from "@/lib/cachedQueries";

export const metadata: Metadata = pageMeta({
  title: "JavaScript Interview Sprint — Are You Truly Interview Ready?",
  description:
    "A timed challenge mixing theory, output prediction, and debugging questions. AI-evaluated answers, gamified scoring, and shareable results. The best way to test if you're JavaScript interview ready.",
  path: `/sprint`,
});

export default async function SprintPage() {
  const track = await getServerTrack();
  const [theory, output, debug] = await Promise.all([
    getQuestions({
      filters: { track, status: "published", type: "theory" },
      pageSize: 300,
    }).catch(() => ({ questions: [] })),
    getQuestions({
      filters: { track, status: "published", type: "output" },
      pageSize: 300,
    }).catch(() => ({ questions: [] })),
    getQuestions({
      filters: { track, status: "published", type: "debug" },
      pageSize: 300,
    }).catch(() => ({ questions: [] })),
  ]);
  const allQuestions = {
    theory: theory.questions,
    debug: debug.questions,
    output: output.questions,
  };
  return <SprintWrapper allQuestions={allQuestions} />;
}

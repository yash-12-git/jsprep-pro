import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo/seo";
import { getServerTrack } from "@/lib/getServerTrack";
import { getQuestions } from "@/lib/cachedQueries";
import AnalyticsClientPage from "./AnalyticsClientPage";

export const metadata: Metadata = pageMeta({
  title:
    "JavaScript Analytics — Gain Insights into Your JS Learning Journey with JSPrep Pro",
  description:
    "Unlock powerful analytics on JSPrep Pro to track your JavaScript learning progress. Visualize your strengths and weaknesses, monitor improvement over time, and make data-driven decisions to optimize your study plan. Start analyzing your JS journey today!",
  path: `/analytics`,
});

export default async function AnalyticsPage() {
  const track = await getServerTrack();
  const [theory, output, debug, polyfill] = await Promise.all([
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
    getQuestions({
      filters: { track, status: "published", type: "polyfill" },
      pageSize: 300,
    }).catch(() => ({ questions: [] })),
  ]);
  const allQuestions = {
    theory: theory.questions,
    debug: debug.questions,
    output: output.questions,
    polyfill: polyfill.questions,
  };
  return <AnalyticsClientPage allQuestions={allQuestions} />;
}

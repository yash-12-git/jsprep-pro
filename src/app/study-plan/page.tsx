import { getQuestions } from "@/lib/cachedQueries";
import { getServerTrack } from "@/lib/getServerTrack";
import StudyPlanClientPage from "./StudyPlanClientWrapper";
import { pageMeta } from "@/lib/seo/seo";
import { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "Javascript Study Plan — Structured Learning Path for JS Mastery with JSPrep Pro",
  description: "Follow our comprehensive JavaScript study plan on JSPrep Pro, designed to take you from beginner to interview-ready. Structured learning paths, curated resources, and practice questions to master JavaScript concepts effectively. Start your JS journey today!",
  path: `/study-plan`,
});

export default async function StudyPlanPage() {
  const track = await getServerTrack();
  const { questions } = await getQuestions({
    filters: { track, status: "published", type: "theory" },
    pageSize: 300,
  });

  const categories = Array.from(
    new Set(questions.map((q) => q.category)),
  ).sort();

  return (
    <StudyPlanClientPage questions={questions} categories={categories ?? []} />
  );
}

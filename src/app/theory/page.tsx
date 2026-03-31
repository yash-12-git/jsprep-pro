import { getQuestions } from "@/lib/cachedQueries";
import { getServerTrack } from "@/lib/getServerTrack";
import TheoryPageClientWrapper from "./TheoryPageClientWrapper";
import { Metadata } from "next";
import { pageMeta } from "@/lib/seo/seo";

export const metadata: Metadata = pageMeta({
  title: "JavaScript Theory Questions — Deepen Your JS Knowledge with JSPrep Pro",
  description: "Explore a vast collection of JavaScript theory questions on JSPrep Pro. Perfect for interview preparation and deepening your understanding of JavaScript concepts. Start mastering JS theory today!",
  path: `/theory`,
});

export default async function TheoryPage() {
  const track = await getServerTrack();
  const { questions } = await getQuestions({
    filters: { track, status: "published", type: "theory" },
    pageSize: 500,
  });

  const categories = Array.from(
    new Set(questions.map((q) => q.category)),
  ).sort();

  return (
    <TheoryPageClientWrapper questions={questions} categories={categories} />
  );
}

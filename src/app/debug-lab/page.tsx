import { getQuestions } from "@/lib/cachedQueries";
import { getServerTrack } from "@/lib/getServerTrack";
import DebugLabClientPage from "./DebugLabClientWrapper";
import { pageMeta } from "@/lib/seo/seo";
import { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "JavaScript Debug Lab — Enhance Your Debugging Skills with JSPrep Pro",
  description: "Improve your JavaScript debugging skills with the Debug Lab on JSPrep Pro. Learn to identify and fix issues in your code effectively, enhancing your problem-solving abilities and coding proficiency. Start debugging like a pro today!",
  path: `/debug-lab`,
});

export default async function DebugLabPage() {
  const track = await getServerTrack();
  const { questions } = await getQuestions({
    filters: { track, status: "published", type: "debug" },
    pageSize: 300,
  });

  const categories = Array.from(
    new Set(questions.map((q) => q.category)),
  ).sort();

  return (
    <DebugLabClientPage debugQuestions={questions} categories={categories} />
  );
}

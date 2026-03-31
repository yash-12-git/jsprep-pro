import { getQuestions } from "@/lib/cachedQueries";
import { getServerTrack } from "@/lib/getServerTrack";
import OutputQuizClientPage from "./OutputClientWrapper";
import { pageMeta } from "@/lib/seo/seo";
import { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "JavaScript Output Quiz — Test Your JS Knowledge with JSPrep Pro",
  description: "Challenge yourself with the JavaScript Output Quiz on JSPrep Pro. Test your understanding of JavaScript concepts through practical questions and improve your coding skills. Start your JS journey today!",
  path: `/output-quiz`,
});

export default async function OutputQuizPage() {
  const track = await getServerTrack();
  const { questions } = await getQuestions({
    filters: { track, status: "published", type: "output" },
    pageSize: 300,
  });

  const categories = Array.from(
    new Set(questions.map((q) => q.category)),
  ).sort();

  return (
    <OutputQuizClientPage outputQuestions={questions} categories={categories} />
  );
}

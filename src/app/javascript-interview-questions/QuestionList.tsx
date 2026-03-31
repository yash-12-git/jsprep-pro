import { getQuestions } from "@/lib/cachedQueries";
import { getServerTrack } from "@/lib/getServerTrack";
import { pageMeta } from "@/lib/seo/seo";
import { Metadata } from "next";
import QuestionListClientWrapper from "./QuestionListClientWrapper";

export const metadata: Metadata = pageMeta({
  title:
    "JavaScript Interview Questions — Comprehensive List for JS Prep | JSPrep Pro",
  description:
    "Dive into the JavaScript Interview Questions on JSPrep Pro. Learn by exploring a comprehensive list of questions, enhancing your understanding of core JavaScript concepts and improving your coding skills. Start mastering JavaScript today!",
  path: `/javascript-interview-questions`,
});

export default async function InterviewQuestionList() {
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
  const allQuestions = [...theory.questions, ...output.questions, ...debug.questions];

  const categories = Array.from(
    new Set(
      allQuestions.map((q) => q.category),
    ),
  ).sort();

  return (
    <QuestionListClientWrapper
      questions={allQuestions}
      categories={categories}
    />
  );
}

import { getQuestions } from "@/lib/cachedQueries";
import { getServerTrack } from "@/lib/getServerTrack";
import { Track } from "@/lib/tracks";
import QuestionListClientWrapper from "./QuestionListClientWrapper";

export default async function InterviewQuestionList({ forcedTrack }: { forcedTrack?: Track } = {}) {
  const track = forcedTrack ?? (await getServerTrack());
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

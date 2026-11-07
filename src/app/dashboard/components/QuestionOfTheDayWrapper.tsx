import { Suspense } from "react";
import { Question } from "@/types/question";
import { getQuestions } from "@/lib/cachedQueries";
import { getServerTrack } from "@/lib/getServerTrack";
import QOTDInteractive, { QOTDSkeleton } from "./QOTDInteractive";

// ─── Async inner component — Suspense boundary catches the await ──────────────

export function getDayIndex(): number {
  return Math.floor(Date.now() / 86_400_000);
}

/** Deterministic question selection — same seed → same question for all users. */
function pickQuestion(questions: Question[], dayIndex: number): Question {
  return questions[dayIndex % questions.length];
}

export function getQOTDStorageKey(dayIndex: number): string {
  return `qotd_done_${dayIndex}`;
}

async function QOTDContent() {
  let question;
  try {
    const track = await getServerTrack();
    const { questions } = await getQuestions({
      filters: { track, status: "published", type: "theory" },
      pageSize: 300,
    }).catch(() => ({ questions: [] }));

    question = pickQuestion(questions, getDayIndex());
  } catch (err) {
    // Graceful degradation — Firestore unavailable shouldn't crash the page
    console.error("[QOTD] Failed to fetch today's question:", err);
    return null;
  }

  const storageKey = getQOTDStorageKey(getDayIndex());
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {question && (
        <QOTDInteractive
          question={question}
          storageKey={storageKey}
          formattedDate={formattedDate}
        />
      )}
    </>
  );
}

export default function QuestionOfTheDay() {
  return (
    <Suspense fallback={<QOTDSkeleton />}>
      <QOTDContent />
    </Suspense>
  );
}

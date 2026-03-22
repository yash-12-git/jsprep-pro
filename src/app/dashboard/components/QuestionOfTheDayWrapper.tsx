import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Question } from "@/types/question";
import { getQuestions } from "@/lib/cachedQueries";

// ─── Client interactive shell — lazy loaded, never SSR'd ─────────────────────

const QOTDInteractive = dynamic(() => import("./QuestionOfTheDay"), {
  ssr: false,
  loading: () => <QOTDSkeleton />,
});

// ─── Skeleton — pure inline styles, safe to server-render ────────────────────

function QOTDSkeleton() {
  return (
    <div
      style={{
        background: "#f7f7f5",
        border: "1px solid #e9e9e7",
        borderRadius: "0.75rem",
        padding: "1.25rem",
      }}
    >
      {[
        ["7rem", "0.75rem"],
        ["85%", "1.25rem"],
        ["65%", "1.25rem"],
      ].map(([w, h], i) => (
        <div
          key={i}
          style={{
            height: h,
            width: w,
            borderRadius: "0.375rem",
            background: "#ebebea",
            marginBottom: i < 2 ? "0.625rem" : 0,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}

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
  const { questions } = await getQuestions({
    filters: { status: "published", type: "theory" },
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
    <QOTDInteractive
      question={question}
      storageKey={storageKey}
      formattedDate={formattedDate}
    />
  );
}



export default function QuestionOfTheDay() {
  return (
    <Suspense fallback={<QOTDSkeleton />}>
      <QOTDContent />
    </Suspense>
  );
}

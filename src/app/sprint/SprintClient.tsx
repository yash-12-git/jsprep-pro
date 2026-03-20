/** @jsxImportSource @emotion/react */
"use client";

import { css, keyframes } from "@emotion/react";
import { useState, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAllQuestions } from "@/contexts/QuestionsContext";
import { awardProgressXP } from "@/lib/userProgress";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Question } from "@/types/question";
import type {
  SprintConfig,
  QuestionResult,
  SprintSummary,
  SprintOutcome,
} from "./types";
import { SPRINT_POINTS, MAX_POINTS } from "./types";
import SprintLobby from "./components/SprintLobby";
import SprintHUD from "./components/SprintHUD";
import TheorySprintCard from "./components/TheorySprintCard";
import OutputSprintCard from "./components/OutputSprintCard";
import DebugSprintCard from "./components/DebugSprintCard";
import SprintResults from "./components/SprintResults";
import { C, RADIUS } from "@/styles/tokens";

// ─── Styles ───────────────────────────────────────────────────────────────────

const loadWrap = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: ${C.bg};
  color: ${C.muted};
`;

const runnerWrap = css`
  min-height: 100vh;
  background: ${C.bg};
`;

const questionArea = css`
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 4rem;
`;

const fadeIn = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`;

const questionMeta = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  animation: ${fadeIn} 0.25s ease;
`;

const qNumBadge = css`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.muted};
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  padding: 3px 10px;
  border-radius: 20px;
`;

const errorToast = css`
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: ${C.redSubtle};
  border: 1px solid ${C.redBorder};
  border-radius: ${RADIUS.md};
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  color: ${C.red};
  z-index: 100;
  white-space: nowrap;
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildMix(
  theory: Question[],
  output: Question[],
  debug: Question[],
  count: number,
): Question[] {
  const dMin = Math.max(1, Math.floor(count * 0.2));
  const oMin = Math.max(1, Math.floor(count * 0.3));
  const tMin = count - dMin - oMin;
  const mixed = [
    ...shuffle(theory).slice(0, Math.max(1, tMin)),
    ...shuffle(output).slice(0, oMin),
    ...shuffle(debug).slice(0, dMin),
  ];
  return shuffle(mixed).slice(0, count);
}

function computeInsights(results: QuestionResult[]) {
  const catMap = new Map<string, { correct: number; total: number }>();
  for (const r of results) {
    if (r.outcome === "skipped") continue;
    const entry = catMap.get(r.category) ?? { correct: 0, total: 0 };
    entry.total++;
    if (r.outcome === "correct") entry.correct++;
    catMap.set(r.category, entry);
  }
  const cats = Array.from(catMap.entries())
    .filter(([, v]) => v.total >= 1)
    .map(([cat, v]) => ({ cat, pct: Math.round((v.correct / v.total) * 100) }))
    .sort((a, b) => b.pct - a.pct);
  return {
    strengths: cats
      .filter((c) => c.pct >= 70)
      .slice(0, 3)
      .map((c) => c.cat),
    weakAreas: cats
      .filter((c) => c.pct < 50)
      .slice(-3)
      .map((c) => c.cat),
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  uid: string | null;
  isPro: boolean;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SprintClient({ uid, isPro }: Props) {
  const [phase, setPhase] = useState<
    "lobby" | "loading" | "active" | "results"
  >("lobby");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [score, setScore] = useState(0);
  const [config, setConfig] = useState<SprintConfig | null>(null);
  const [summary, setSummary] = useState<SprintSummary | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);

  const {
    theoryQs: ctxTheoryQs,
    outputQs: ctxOutputQs,
    debugQs: ctxDebugQs,
    loading: qLoading,
  } = useAllQuestions();

  // ── Load and start ──────────────────────────────────────────────────────────

  function loadAndStart(cfg: SprintConfig) {
    setConfig(cfg);
    setLoadError(null);
    if (qLoading) {
      setLoadError(
        "Questions are still loading, please try again in a moment.",
      );
      return;
    }
    if (!ctxTheoryQs.length && !ctxOutputQs.length && !ctxDebugQs.length) {
      setLoadError("No questions found. Make sure questions are published.");
      return;
    }
    const mixed = buildMix(
      ctxTheoryQs,
      ctxOutputQs,
      ctxDebugQs,
      cfg.questionCount,
    );
    if (mixed.length === 0) {
      setLoadError("Not enough questions for a sprint. Please try again.");
      return;
    }
    setQuestions(mixed);
    setResults([]);
    setScore(0);
    setCurrentIdx(0);
    startTimeRef.current = Date.now();
    setPhase("active");
  }

  // ── Question complete ───────────────────────────────────────────────────────

  const handleQuestionComplete = useCallback(
    (outcome: SprintOutcome, aiScore?: number) => {
      const q = questions[currentIdx];
      if (!q) return;
      const points = SPRINT_POINTS[outcome];
      const result: QuestionResult = {
        questionId: q.id,
        type: q.type as "theory" | "output" | "debug",
        category: q.category,
        points,
        outcome,
        aiScore,
      };
      const newResults = [...results, result];
      const newScore = score + points;
      setResults(newResults);
      setScore(newScore);
      if (currentIdx >= questions.length - 1)
        finishSprint(newResults, newScore);
      else setCurrentIdx((i) => i + 1);
    },
    [questions, currentIdx, results, score],
  );

  // ── Time up ─────────────────────────────────────────────────────────────────

  const handleTimeUp = useCallback(() => {
    if (phase !== "active") return;
    finishSprint(results, score);
  }, [phase, results, score]);

  // ── Finish sprint ───────────────────────────────────────────────────────────

  function finishSprint(finalResults: QuestionResult[], finalScore: number) {
    const timeUsedSecs = Math.round((Date.now() - startTimeRef.current) / 1000);
    const attempted = finalResults.filter((r) => r.outcome !== "skipped");
    const correct = finalResults.filter((r) => r.outcome === "correct");
    const accuracy =
      attempted.length > 0
        ? Math.round((correct.length / attempted.length) * 100)
        : 0;
    const maxScore =
      (config?.questionCount ?? finalResults.length) * MAX_POINTS;
    const { strengths, weakAreas } = computeInsights(finalResults);

    const s: SprintSummary = {
      score: finalScore,
      maxScore,
      accuracy,
      timeUsedSecs,
      results: finalResults,
      strengths,
      weakAreas,
      questionCount: finalResults.length,
      completedAt: new Date().toISOString(),
    };
    setSummary(s);
    setPhase("results");

    if (uid && isPro) {
      const sprintId = `${uid}_${Date.now()}`;
      setDoc(doc(db, "users", uid, "sprints", sprintId), {
        score: finalScore,
        maxScore,
        accuracy,
        timeUsedSecs,
        questionCount: finalResults.length,
        strengths,
        weakAreas,
        completedAt: s.completedAt,
      }).catch(() => {});
      const xpEarned = Math.max(10, Math.floor(finalScore / 2));
      awardProgressXP(uid, xpEarned, 0).catch(() => {});
    }
  }

  // ── Retry ───────────────────────────────────────────────────────────────────

  function handleRetry() {
    setPhase("lobby");
    setSummary(null);
    setQuestions([]);
    setResults([]);
    setScore(0);
    setCurrentIdx(0);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  if (phase === "lobby") {
    return (
      <>
        {loadError && <div css={errorToast}>{loadError}</div>}
        <SprintLobby isPro={isPro} onStart={loadAndStart} uid={uid} />
      </>
    );
  }

  if (phase === "loading") {
    return (
      <div css={loadWrap}>
        <Loader2
          size={26}
          color={C.accent}
          style={{ animation: "spin 1s linear infinite" }}
        />
        <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: C.text }}>
          Building your sprint…
        </span>
        <span style={{ fontSize: "0.8125rem", color: C.muted }}>
          Mixing question types
        </span>
      </div>
    );
  }

  if (phase === "results" && summary) {
    return <SprintResults summary={summary} onRetry={handleRetry} />;
  }

  // Active sprint
  const totalSecs =
    (config?.questionCount ?? 10) <= 5
      ? 300
      : (config?.questionCount ?? 10) === 10
        ? 600
        : (config?.questionCount ?? 10) === 15
          ? 900
          : 1200;

  const currentQ = questions[currentIdx];
  if (!currentQ) return null;

  return (
    <div css={runnerWrap}>
      <SprintHUD
        score={score}
        currentIdx={currentIdx}
        totalQuestions={questions.length}
        totalSecs={totalSecs}
        onTimeUp={handleTimeUp}
      />

      <div css={questionArea}>
        <div css={questionMeta}>
          <span css={qNumBadge}>
            Question {currentIdx + 1} of {questions.length}
          </span>
        </div>

        {currentQ.type === "theory" && (
          <TheorySprintCard
            key={currentQ.id}
            q={currentQ}
            questionNumber={currentIdx + 1}
            totalQuestions={questions.length}
            onComplete={handleQuestionComplete}
          />
        )}
        {currentQ.type === "output" && (
          <OutputSprintCard
            key={currentQ.id}
            q={currentQ}
            onComplete={handleQuestionComplete}
          />
        )}
        {currentQ.type === "debug" && (
          <DebugSprintCard
            key={currentQ.id}
            q={currentQ}
            onComplete={handleQuestionComplete}
          />
        )}
      </div>
    </div>
  );
}

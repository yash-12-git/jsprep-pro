/** @jsxImportSource @emotion/react */
"use client";

import { css, keyframes } from "@emotion/react";
import { useState } from "react";
import {
  Loader2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import type { Question } from "@/types/question";
import type { SprintOutcome } from "../types";

interface EvalResult {
  score: number;
  grade: string;
  verdict: string;
  strengths: string[];
  missing: string[];
  betterAnswer: string;
}
interface Props {
  q: Question;
  questionNumber: number;
  totalQuestions: number;
  onComplete: (outcome: SprintOutcome, aiScore?: number) => void;
}

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;

// ─── Styles ───────────────────────────────────────────────────────────────────

const card = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease;
`;

const typeTag = css`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.accentText};
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  padding: 3px 10px;
  border-radius: 20px;
`;

const questionBody = css`
  padding: 1.375rem 1.375rem 0.75rem;
`;

const questionTitle = css`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${C.text};
  line-height: 1.45;
  letter-spacing: -0.02em;
  margin: 0.875rem 0 0.75rem;
`;

const metaRow = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const diffBadge = (color: string, bg: string, border: string) => css`
  display: inline-flex;
  align-items: center;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${color};
  background: ${bg};
  border: 1px solid ${border};
  padding: 2px 8px;
  border-radius: 10px;
`;

const catBadge = css`
  font-size: 0.75rem;
  color: ${C.muted};
  font-weight: 500;
`;

const divider = css`
  height: 1px;
  background: ${C.border};
`;

const answerPhase = css`
  padding: 1.125rem 1.375rem;
  animation: ${fadeIn} 0.25s ease;
`;

const answerLabel = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.amber};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.625rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const textarea = css`
  width: 100%;
  box-sizing: border-box;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.875rem;
  font-size: 0.9375rem;
  color: ${C.text};
  line-height: 1.65;
  font-family: inherit;
  outline: none;
  min-height: 120px;
  resize: vertical;
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease;
  &::placeholder {
    color: ${C.placeholder};
  }
  &:focus {
    border-color: ${C.amber};
    box-shadow: 0 0 0 2px ${C.amberSubtle};
  }
`;

const submitBtn = (active: boolean) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.75rem;
  padding: 0.5625rem 1.125rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 600;
  background: ${active ? C.accent : C.bgSubtle};
  color: ${active ? "#ffffff" : C.muted};
  border: 1px solid ${active ? C.accent : C.border};
  cursor: ${active ? "pointer" : "not-allowed"};
  transition: opacity 0.12s ease;
  flex-shrink: 0;
  ${active && "&:hover { opacity: 0.88; }"}
`;

const evalWrap = css`
  animation: ${fadeIn} 0.3s ease;
`;

const scoreCard = css`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1rem;
  margin-bottom: 1rem;
`;

const scoreNum = (n: number) => css`
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  color: ${n >= 7 ? C.green : n >= 5 ? C.amber : C.red};
  flex-shrink: 0;
`;

const gradeText = (g: string) => css`
  font-size: 0.75rem;
  font-weight: 700;
  margin-top: 0.25rem;
  color: ${g === "A"
    ? C.green
    : g === "B"
      ? C.accent
      : g === "C"
        ? C.amber
        : C.red};
`;

const verdict = css`
  font-size: 0.875rem;
  color: ${C.muted};
  line-height: 1.5;
`;

const barTrack = css`
  height: 4px;
  background: ${C.border};
  border-radius: 9999px;
  overflow: hidden;
  margin: 0.5rem 0;
`;
const barFill = (n: number) => css`
  height: 100%;
  width: ${n * 10}%;
  background: ${n >= 7 ? C.green : n >= 5 ? C.amber : C.red};
  border-radius: 9999px;
  transition: width 0.6s ease;
`;

const feedSection = css`
  margin-top: 0.875rem;
`;
const feedTitle = (c: string) => css`
  font-size: 0.625rem;
  font-weight: 700;
  color: ${c};
  margin-bottom: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;
const feedItem = css`
  display: flex;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: ${C.muted};
  margin-bottom: 0.25rem;
  line-height: 1.5;
`;

const betterToggle = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: ${C.muted};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.12s ease;
  &:hover {
    color: ${C.text};
  }
`;
const betterBox = css`
  margin-top: 0.5rem;
  padding: 0.875rem;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  font-size: 0.8125rem;
  color: ${C.muted};
  line-height: 1.7;
  animation: ${fadeIn} 0.2s ease;
`;

const actionsRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.375rem;
  border-top: 1px solid ${C.border};
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const tryBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5625rem 1.125rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
  color: ${C.amber};
  transition: opacity 0.12s ease;
  &:hover {
    opacity: 0.8;
  }
`;

const skipBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.875rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  border: 1px solid ${C.border};
  color: ${C.muted};
  transition: all 0.12s ease;
  &:hover {
    border-color: ${C.borderStrong};
    color: ${C.text};
    background: ${C.bgHover};
  }
`;

const nextBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5625rem 1.375rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  background: ${C.accent};
  border: none;
  color: #ffffff;
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
`;

// ─── Diff meta ────────────────────────────────────────────────────────────────
const DIFF_META: Record<
  string,
  { color: string; bg: string; border: string; label: string }
> = {
  beginner: {
    color: C.green,
    bg: C.greenSubtle,
    border: C.greenBorder,
    label: "Beginner",
  },
  core: {
    color: C.green,
    bg: C.greenSubtle,
    border: C.greenBorder,
    label: "Core",
  },
  easy: {
    color: C.green,
    bg: C.greenSubtle,
    border: C.greenBorder,
    label: "Easy",
  },
  advanced: {
    color: C.amber,
    bg: C.amberSubtle,
    border: C.amberBorder,
    label: "Advanced",
  },
  medium: {
    color: C.amber,
    bg: C.amberSubtle,
    border: C.amberBorder,
    label: "Medium",
  },
  expert: {
    color: C.red,
    bg: C.redSubtle,
    border: C.redBorder,
    label: "Expert",
  },
  hard: { color: C.red, bg: C.redSubtle, border: C.redBorder, label: "Hard" },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function TheorySprintCard({ q, onComplete }: Props) {
  const [phase, setPhase] = useState<
    "read" | "answering" | "evaluating" | "done"
  >("read");
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<EvalResult | null>(null);
  const [showBetter, setShowBetter] = useState(false);

  const dm = DIFF_META[q.difficulty] ?? DIFF_META.core;

  async function evaluate() {
    if (!userAnswer.trim()) return;
    setPhase("evaluating");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "evaluate",
          messages: [{ role: "user", content: userAnswer }],
          context: {
            question: q.title,
            idealAnswer: (q.answer ?? "")
              .replace(/<[^>]*>/g, "")
              .replace(/\s+/g, " ")
              .trim(),
          },
        }),
      });
      const data = await res.json();
      const parsed = JSON.parse(
        data.text.replace(/```json|```/g, "").trim(),
      ) as EvalResult;
      setResult(parsed);
      setPhase("done");
    } catch {
      setResult({
        score: 3,
        grade: "C",
        verdict: "Could not evaluate — good effort!",
        strengths: [],
        missing: [],
        betterAnswer: "",
      });
      setPhase("done");
    }
  }

  function handleNext() {
    if (!result) return;
    onComplete(result.score >= 7 ? "correct" : "attempted", result.score);
  }

  return (
    <div css={card}>
      <div css={questionBody}>
        <div css={typeTag}>📖 Theory</div>
        <p css={questionTitle}>{q.title}</p>
        <div css={metaRow}>
          <span css={diffBadge(dm.color, dm.bg, dm.border)}>{dm.label}</span>
          <span css={catBadge}>{q.category}</span>
        </div>
      </div>

      <div css={divider} />

      {(phase === "answering" ||
        phase === "evaluating" ||
        phase === "done") && (
        <div css={answerPhase}>
          <div css={answerLabel}>
            <Zap size={12} /> Answer as you would in an interview
          </div>

          {phase !== "done" ? (
            <>
              <textarea
                css={textarea}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
                autoFocus
                disabled={phase === "evaluating"}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.metaKey) evaluate();
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <button
                  css={submitBtn(!!userAnswer.trim() && phase === "answering")}
                  onClick={evaluate}
                  disabled={!userAnswer.trim() || phase === "evaluating"}
                >
                  {phase === "evaluating" ? (
                    <>
                      <Loader2
                        size={13}
                        style={{ animation: "spin 1s linear infinite" }}
                      />{" "}
                      Evaluating...
                    </>
                  ) : (
                    <>Submit Answer</>
                  )}
                </button>
                <span style={{ fontSize: "0.7rem", color: C.muted }}>
                  ⌘ + Enter to submit
                </span>
              </div>
            </>
          ) : (
            result && (
              <div css={evalWrap}>
                <textarea
                  css={[
                    textarea,
                    css`
                      opacity: 0.5;
                      min-height: 80px;
                      cursor: default;
                    `,
                  ]}
                  value={userAnswer}
                  readOnly
                />
                <div css={scoreCard}>
                  <div>
                    <div css={scoreNum(result.score)}>{result.score}</div>
                    <div style={{ fontSize: "0.6875rem", color: C.muted }}>
                      /10
                    </div>
                    <div css={gradeText(result.grade)}>{result.grade}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div css={barTrack}>
                      <div css={barFill(result.score)} />
                    </div>
                    <div css={verdict}>{result.verdict}</div>
                    {result.strengths?.length > 0 && (
                      <div css={feedSection}>
                        <div css={feedTitle(C.green)}>✓ Covered</div>
                        {result.strengths.map((s, i) => (
                          <div key={i} css={feedItem}>
                            <CheckCircle
                              size={10}
                              style={{
                                marginTop: 3,
                                flexShrink: 0,
                                color: C.green,
                              }}
                            />
                            {s}
                          </div>
                        ))}
                      </div>
                    )}
                    {result.missing?.length > 0 && (
                      <div css={feedSection}>
                        <div css={feedTitle(C.red)}>✗ Missing</div>
                        {result.missing.map((m, i) => (
                          <div key={i} css={feedItem}>
                            <XCircle
                              size={10}
                              style={{
                                marginTop: 3,
                                flexShrink: 0,
                                color: C.red,
                              }}
                            />
                            {m}
                          </div>
                        ))}
                      </div>
                    )}
                    {result.betterAnswer && (
                      <>
                        <button
                          css={betterToggle}
                          onClick={() => setShowBetter((v) => !v)}
                        >
                          {showBetter ? (
                            <ChevronUp size={12} />
                          ) : (
                            <ChevronDown size={12} />
                          )}
                          {showBetter ? "Hide" : "Show"} model answer
                        </button>
                        {showBetter && (
                          <div css={betterBox}>{result.betterAnswer}</div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <div css={actionsRow}>
        {phase === "read" && (
          <>
            <button css={tryBtn} onClick={() => setPhase("answering")}>
              <Zap size={13} /> Try to Answer
            </button>
            <button css={skipBtn} onClick={() => onComplete("skipped")}>
              Skip
            </button>
          </>
        )}
        {phase === "answering" && (
          <button css={skipBtn} onClick={() => onComplete("skipped")}>
            Skip question
          </button>
        )}
        {phase === "done" && result && (
          <button css={nextBtn} onClick={handleNext}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

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

// ─── Types ────────────────────────────────────────────────────────────────────

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
  /** Called when user submits an answer and we have a result (or they skip) */
  onComplete: (outcome: SprintOutcome, aiScore?: number) => void;
}

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const pulse = keyframes`0%,100% { opacity:1 } 50% { opacity:0.6 }`;

// ─── Styles ───────────────────────────────────────────────────────────────────

const card = css`
  background: ${C.card};
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: ${RADIUS.xxl};
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease;
`;

const typeTag = css`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #c4b5fd;
  background: rgba(124, 106, 247, 0.12);
  padding: 3px 10px 3px 8px;
  border-radius: 20px;
`;

const questionBody = css`
  padding: 1.5rem 1.5rem 0.75rem;
`;

const questionTitle = css`
  font-size: 1.25rem;
  font-weight: 800;
  color: #f0f0f8;
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

const diffBadge = (color: string, bg: string) => css`
  display: inline-flex;
  align-items: center;
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${color};
  background: ${bg};
  padding: 2px 8px;
  border-radius: 10px;
`;

const catBadge = css`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 600;
`;

const divider = css`
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 0;
`;

// ─── Answer phase ─────────────────────────────────────────────────────────────

const answerPhase = css`
  padding: 1.25rem 1.5rem;
  animation: ${fadeIn} 0.25s ease;
`;

const answerLabel = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: #f7c76a;
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
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${RADIUS.lg};
  padding: 0.875rem;
  font-size: 0.9375rem;
  color: #e0e0f0;
  line-height: 1.65;
  font-family: inherit;
  outline: none;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s;
  &::placeholder {
    color: rgba(255, 255, 255, 0.22);
  }
  &:focus {
    border-color: rgba(247, 199, 106, 0.35);
  }
`;

const submitBtn = (active: boolean) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.75rem;
  padding: 0.625rem 1.25rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 700;
  background: ${active ? "#f7c76a" : "rgba(255,255,255,0.06)"};
  color: ${active ? "#111" : "rgba(255,255,255,0.25)"};
  border: none;
  cursor: ${active ? "pointer" : "not-allowed"};
  transition: all 0.15s;
  flex-shrink: 0;
  ${active && "&:hover { background: #ffd96a; transform: translateY(-1px); }"}
`;

const evalWrap = css`
  animation: ${fadeIn} 0.3s ease;
`;

const scoreCard = css`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: rgba(0, 0, 0, 0.25);
  border-radius: ${RADIUS.lg};
  padding: 1rem;
  margin-bottom: 1rem;
`;

const scoreNum = (n: number) => css`
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
  color: ${n >= 7 ? "#6af7c0" : n >= 5 ? "#f7c76a" : "#f76a6a"};
  flex-shrink: 0;
`;

const gradeText = (g: string) => css`
  font-size: 0.75rem;
  font-weight: 800;
  margin-top: 0.25rem;
  color: ${g === "A"
    ? "#6af7c0"
    : g === "B"
      ? "#a5f3fc"
      : g === "C"
        ? "#f7c76a"
        : "#f76a6a"};
`;

const verdict = css`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
`;

const barTrack = css`
  height: 4px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 9999px;
  overflow: hidden;
  margin: 0.5rem 0;
`;
const barFill = (n: number) => css`
  height: 100%;
  width: ${n * 10}%;
  background: ${n >= 7 ? "#6af7c0" : n >= 5 ? "#f7c76a" : "#f76a6a"};
  border-radius: 9999px;
  transition: width 0.6s ease;
`;

const feedSection = css`
  margin-top: 0.875rem;
`;
const feedTitle = (c: string) => css`
  font-size: 0.625rem;
  font-weight: 800;
  color: ${c};
  margin-bottom: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;
const feedItem = css`
  display: flex;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.25rem;
  line-height: 1.5;
`;

const betterToggle = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  &:hover {
    color: rgba(255, 255, 255, 0.65);
  }
`;
const betterBox = css`
  margin-top: 0.5rem;
  padding: 0.875rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: ${RADIUS.lg};
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
  animation: ${fadeIn} 0.2s ease;
`;

// ─── Actions row ─────────────────────────────────────────────────────────────

const actionsRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const tryBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.25rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  background: rgba(247, 199, 106, 0.12);
  border: 1px solid rgba(247, 199, 106, 0.25);
  color: #f7c76a;
  transition: all 0.15s;
  &:hover {
    background: rgba(247, 199, 106, 0.2);
  }
`;

const skipBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.625rem 1rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: rgba(255, 255, 255, 0.35);
  transition: all 0.15s;
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.6);
  }
`;

const nextBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.5rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;
  background: ${C.accent};
  border: none;
  color: white;
  transition: all 0.15s;
  &:hover {
    background: #9b8bff;
    transform: translateY(-1px);
  }
`;

const loadingDot = css`
  animation: ${pulse} 1s ease infinite;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
`;

// ─── Diff meta ────────────────────────────────────────────────────────────────

const DIFF_META: Record<string, { color: string; bg: string; label: string }> =
  {
    beginner: { color: C.accent3, bg: `${C.accent3}1a`, label: "Beginner" },
    core: { color: C.accent3, bg: `${C.accent3}1a`, label: "Core" },
    easy: { color: C.accent3, bg: `${C.accent3}1a`, label: "Easy" },
    advanced: { color: C.accent2, bg: `${C.accent2}1a`, label: "Advanced" },
    medium: { color: C.accent2, bg: `${C.accent2}1a`, label: "Medium" },
    expert: { color: C.danger, bg: `${C.danger}1a`, label: "Expert" },
    hard: { color: C.danger, bg: `${C.danger}1a`, label: "Hard" },
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
      // fallback — treat as attempted
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
    const outcome: SprintOutcome = result.score >= 7 ? "correct" : "attempted";
    onComplete(outcome, result.score);
  }

  return (
    <div css={card}>
      {/* ── Question ── */}
      <div css={questionBody}>
        <div css={typeTag}>📖 Theory</div>
        <p css={questionTitle}>{q.title}</p>
        <div css={metaRow}>
          <span css={diffBadge(dm.color, dm.bg)}>{dm.label}</span>
          <span css={catBadge}>{q.category}</span>
        </div>
      </div>

      <div css={divider} />

      {/* ── Answer phase ── */}
      {(phase === "answering" ||
        phase === "evaluating" ||
        phase === "done") && (
        <div css={answerPhase}>
          <div css={answerLabel}>
            <Zap size={12} />
            Answer as you would in an interview
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
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.22)",
                  }}
                >
                  ⌘ + Enter to submit
                </span>
              </div>
            </>
          ) : (
            result && (
              <div css={evalWrap}>
                {/* keep textarea visible but read-only */}
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
                    <div
                      css={css`
                        font-size: 0.6875rem;
                        color: rgba(255, 255, 255, 0.3);
                      `}
                    >
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
                        <div css={feedTitle("#6af7c0")}>✓ Covered</div>
                        {result.strengths.map((s, i) => (
                          <div key={i} css={feedItem}>
                            <CheckCircle
                              size={10}
                              style={{
                                marginTop: 3,
                                flexShrink: 0,
                                color: "#6af7c0",
                              }}
                            />
                            {s}
                          </div>
                        ))}
                      </div>
                    )}
                    {result.missing?.length > 0 && (
                      <div css={feedSection}>
                        <div css={feedTitle("#f76a6a")}>✗ Missing</div>
                        {result.missing.map((m, i) => (
                          <div key={i} css={feedItem}>
                            <XCircle
                              size={10}
                              style={{
                                marginTop: 3,
                                flexShrink: 0,
                                color: "#f76a6a",
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

      {/* ── Actions ── */}
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

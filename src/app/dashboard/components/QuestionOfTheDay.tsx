/** @jsxImportSource @emotion/react */
"use client";

import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import {
  CheckCircle,
  Flame,
  ChevronDown,
  ChevronUp,
  Loader2,
  Target,
} from "lucide-react";
import { useAllQuestions } from "@/contexts/QuestionsContext";
import type { Question } from "@/types/question";
import { C, RADIUS } from "@/styles/tokens";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDayIndex() {
  return Math.floor(Date.now() / 86400000);
}
function getTodayKey() {
  return `qotd_done_${getDayIndex()}`;
}
function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

interface EvalResult {
  score: number;
  grade: string;
  verdict: string;
  strengths: string[];
  missing: string[];
  betterAnswer: string;
}

// ─── Diff meta ────────────────────────────────────────────────────────────────
const DIFF: Record<
  string,
  { color: string; bg: string; border: string; label: string }
> = {
  core: {
    color: C.accent,
    bg: C.accentSubtle,
    border: C.border,
    label: "Core",
  },
  mid: {
    color: C.amber,
    bg: C.amberSubtle,
    border: C.amberBorder,
    label: "Mid",
  },
  adv: {
    color: C.red,
    bg: C.redSubtle,
    border: C.redBorder,
    label: "Advanced",
  },
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const wrap = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const wrapDone = css`
  border-color: ${C.greenBorder};
  background: ${C.greenSubtle};
`;

const topBar = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.125rem 0;
`;

const pill = css`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${C.accentText};
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  padding: 3px 10px;
  border-radius: 20px;
`;

const pillDone = css`
  color: ${C.green};
  background: ${C.greenSubtle};
  border-color: ${C.greenBorder};
`;

const dateLabel = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  margin-left: auto;
`;

const qWrap = css`
  padding: 0.75rem 1.125rem 0;
`;

const qText = css`
  font-size: 1rem;
  font-weight: 600;
  color: ${C.text};
  line-height: 1.45;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
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
  margin-right: 0.375rem;
`;

const catBadge = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  font-weight: 500;
`;

// answer reveal
const answerSection = css`
  border-top: 1px solid ${C.border};
  padding: 0.875rem 1.125rem;
  margin-top: 0.75rem;
`;

const hintBox = css`
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
  border-radius: ${RADIUS.md};
  padding: 0.625rem 0.875rem;
  font-size: 0.8rem;
  color: ${C.amber};
  line-height: 1.6;
  margin-bottom: 0.875rem;
`;

const answerBody = css`
  font-size: 0.875rem;
  line-height: 1.75;
  color: ${C.text};
  p {
    margin-bottom: 0.625rem;
    color: ${C.text};
  }
  strong {
    color: ${C.text};
    font-weight: 600;
  }
  pre {
    background: ${C.codeBg};
    border: 1px solid ${C.border};
    border-left: 3px solid ${C.accent};
    border-radius: ${RADIUS.md};
    padding: 0.875rem 1rem;
    overflow-x: auto;
    font-size: 0.8rem;
    margin: 0.625rem 0;
  }
  code {
    font-family: "JetBrains Mono", monospace;
    color: ${C.codeText};
    font-size: 0.8rem;
  }
  pre code {
    color: ${C.codeText};
  }
  .tip {
    background: ${C.accentSubtle};
    border-left: 3px solid ${C.accent};
    padding: 0.5rem 0.75rem;
    border-radius: 0 ${RADIUS.sm} ${RADIUS.sm} 0;
    margin: 0.625rem 0;
    font-size: 0.8rem;
    color: ${C.accentText};
  }
`;

// action row
const actionBar = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.125rem;
  border-top: 1px solid ${C.border};
`;

const revealBtn = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.875rem;
  border-radius: ${RADIUS.md};
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

const doneBtn = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.875rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  background: ${C.greenSubtle};
  border: 1px solid ${C.greenBorder};
  color: ${C.green};
  transition: opacity 0.12s ease;
  &:hover {
    opacity: 0.8;
  }
`;

const tryAiBtn = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.875rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  color: ${C.accentText};
  transition: border-color 0.12s ease;
  &:hover {
    border-color: ${C.accent};
  }
`;

const donePill = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${C.green};
`;

// inline evaluator
const evalWrap = css`
  margin: 0 1.125rem 0.875rem;
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1rem;
`;

const evalLabel = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.accentText};
  text-transform: uppercase;
  letter-spacing: 0.06em;
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
  border-radius: ${RADIUS.md};
  padding: 0.75rem;
  resize: vertical;
  font-size: 0.875rem;
  color: ${C.text};
  line-height: 1.6;
  font-family: inherit;
  outline: none;
  min-height: 100px;
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease;
  &::placeholder {
    color: ${C.placeholder};
  }
  &:focus {
    border-color: ${C.accent};
    box-shadow: 0 0 0 2px ${C.accentSubtle};
  }
`;

const submitBtn = (active: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.625rem;
  padding: 0.5rem 1rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8125rem;
  font-weight: 600;
  background: ${active ? C.accent : C.bgSubtle};
  color: ${active ? "#ffffff" : C.muted};
  border: 1px solid ${active ? C.accent : C.border};
  cursor: ${active ? "pointer" : "default"};
  transition: opacity 0.12s ease;
  &:hover {
    opacity: ${active ? 0.88 : 1};
  }
`;

const scoreCard = css`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.875rem;
  margin-top: 0.75rem;
`;

const scoreNum = (n: number) => css`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  color: ${n >= 8 ? C.green : n >= 6 ? C.amber : C.red};
`;

const scoreDenom = css`
  font-size: 0.875rem;
  color: ${C.muted};
  font-weight: 500;
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
  font-size: 0.8125rem;
  color: ${C.muted};
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;

const barTrack = css`
  height: 4px;
  background: ${C.border};
  border-radius: 9999px;
  overflow: hidden;
`;

const barFill = (n: number) => css`
  height: 100%;
  width: ${n * 10}%;
  border-radius: 9999px;
  background: ${n >= 8 ? C.green : n >= 6 ? C.amber : C.red};
`;

const feedSection = css`
  margin-top: 0.75rem;
`;

const feedTitle = (c: string) => css`
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${c};
  margin-bottom: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const feedItem = css`
  display: flex;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${C.muted};
  margin-bottom: 0.25rem;
  line-height: 1.5;
`;

const toggleBetterBtn = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: ${C.muted};
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.12s ease;
  &:hover {
    color: ${C.text};
  }
`;

const betterBox = css`
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.md};
  font-size: 0.8rem;
  color: ${C.muted};
  line-height: 1.7;
`;

const tryAgainBtn = css`
  margin-top: 0.625rem;
  font-size: 0.75rem;
  color: ${C.muted};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.12s ease;
  &:hover {
    color: ${C.text};
  }
`;

// ─── Skeleton placeholders ────────────────────────────────────────────────────
const skeletonLine = (w: string, h = "1rem") =>
  ({
    height: h,
    width: w,
    borderRadius: "0.375rem",
    background: C.bgSubtle,
    border: `1px solid ${C.border}`,
    marginBottom: "0.75rem",
  }) as React.CSSProperties;

interface Props {
  isPro: boolean;
}

export default function QuestionOfTheDay({ isPro }: Props) {
  const key = getTodayKey();
  const [q, setQ] = useState<Question | null>(null);
  const [done, setDone] = useState(false);
  const [answerOpen, setAnswerOpen] = useState(false);
  const [evalOpen, setEvalOpen] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const { theoryQs } = useAllQuestions();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [showBetter, setShowBetter] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined")
      setDone(localStorage.getItem(key) === "1");
  }, [key]);

  useEffect(() => {
    if (theoryQs.length) setQ(theoryQs[getDayIndex() % theoryQs.length]);
  }, [theoryQs]);

  function markDone() {
    localStorage.setItem(key, "1");
    setDone(true);
  }

  if (!q)
    return (
      <div css={[wrap, { padding: "1.25rem", marginBottom: "1.5rem" }]}>
        <div style={skeletonLine("7rem", "0.75rem")} />
        <div style={skeletonLine("85%", "1.25rem")} />
        <div style={skeletonLine("65%", "1.25rem")} />
      </div>
    );

  async function evaluate() {
    if (!userAnswer.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "evaluate",
          messages: [{ role: "user", content: userAnswer }],
          context: {
            question: q?.title,
            idealAnswer: (q?.answer ?? "")
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
      if (parsed.score >= 7) markDone();
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }

  const diffKey =
    q.difficulty === "advanced" || q.difficulty === "expert"
      ? "adv"
      : q.difficulty === "core"
        ? "mid"
        : "core";
  const dm = DIFF[diffKey];

  return (
    <div css={[wrap, done && wrapDone]}>
      {/* Header */}
      <div css={topBar}>
        <div css={[pill, done && pillDone]}>
          {done ? (
            <>
              <CheckCircle size={10} /> Done today
            </>
          ) : (
            <>
              <Flame size={10} /> Question of the Day
            </>
          )}
        </div>
        <span css={dateLabel}>{formatDate()}</span>
      </div>

      {/* Question */}
      <div css={qWrap}>
        <p css={qText}>{q.title}</p>
        <span css={diffBadge(dm.color, dm.bg, dm.border)}>{dm.label}</span>
        <span css={catBadge}>{q.category}</span>
      </div>

      {/* Actions */}
      <div css={actionBar}>
        {done ? (
          <div css={donePill}>
            <CheckCircle size={14} /> Completed today!
          </div>
        ) : (
          <>
            {!evalOpen ? (
              <button
                css={[tryAiBtn, { flex: 1 }]}
                onClick={() => {
                  setEvalOpen(true);
                  setAnswerOpen(false);
                }}
              >
                <Target size={13} /> Try to answer
              </button>
            ) : (
              <button
                css={[tryAiBtn, { flex: 1 }]}
                onClick={() => setEvalOpen(false)}
              >
                <Target size={13} /> Hide evaluator
              </button>
            )}
            <button
              css={revealBtn}
              onClick={() => setAnswerOpen((o) => !o)}
              title={answerOpen ? "Hide answer" : "Show answer"}
            >
              {answerOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {answerOpen ? "Hide" : "Answer"}
            </button>
            {!evalOpen && (
              <button css={doneBtn} onClick={markDone} title="I know this">
                <CheckCircle size={13} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Inline evaluator */}
      {evalOpen && (
        <div css={evalWrap}>
          <div css={evalLabel}>
            <Target size={12} /> Answer as you would in an interview
          </div>

          {!result ? (
            <>
              <textarea
                css={textarea}
                rows={5}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here — explain it in your own words..."
              />
              <button
                css={submitBtn(!!userAnswer.trim() && !loading)}
                onClick={evaluate}
                disabled={!userAnswer.trim() || loading}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={13}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Target size={13} /> Get AI Score
                  </>
                )}
              </button>
            </>
          ) : (
            <div>
              <div css={scoreCard}>
                <div style={{ flexShrink: 0 }}>
                  <div css={scoreNum(result.score)}>
                    {result.score}
                    <span css={scoreDenom}>/10</span>
                  </div>
                  <div css={gradeText(result.grade)}>{result.grade}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p css={verdict}>{result.verdict}</p>
                  <div css={barTrack}>
                    <div css={barFill(result.score)} />
                  </div>
                </div>
              </div>

              {result.strengths.length > 0 && (
                <div css={feedSection}>
                  <div css={feedTitle(C.green)}>✓ Got right</div>
                  {result.strengths.map((s, i) => (
                    <div key={i} css={feedItem}>
                      <span style={{ color: C.green, flexShrink: 0 }}>•</span>
                      {s}
                    </div>
                  ))}
                </div>
              )}

              {result.missing.length > 0 && (
                <div css={feedSection}>
                  <div css={feedTitle(C.red)}>✗ Missed</div>
                  {result.missing.map((m, i) => (
                    <div key={i} css={feedItem}>
                      <span style={{ color: C.red, flexShrink: 0 }}>•</span>
                      {m}
                    </div>
                  ))}
                </div>
              )}

              <button
                css={toggleBetterBtn}
                onClick={() => setShowBetter((b) => !b)}
              >
                {showBetter ? (
                  <ChevronUp size={12} />
                ) : (
                  <ChevronDown size={12} />
                )}
                {showBetter ? "Hide" : "See"} ideal answer
              </button>
              {showBetter && <div css={betterBox}>{result.betterAnswer}</div>}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "0.625rem",
                }}
              >
                <button
                  css={tryAgainBtn}
                  onClick={() => {
                    setResult(null);
                    setUserAnswer("");
                    setShowBetter(false);
                  }}
                >
                  Try again
                </button>
                {!done && result.score >= 7 && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: C.green,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <CheckCircle size={11} /> Marked as done!
                  </div>
                )}
                {!done && result.score < 7 && (
                  <button
                    css={doneBtn}
                    style={{ padding: "0.3rem 0.75rem", fontSize: "0.75rem" }}
                    onClick={markDone}
                  >
                    Mark done anyway
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full answer reveal */}
      {answerOpen && (
        <div css={answerSection}>
          {q.hint && <div css={hintBox}>💡 {q.hint}</div>}
          <div
            css={answerBody}
            dangerouslySetInnerHTML={{ __html: q.answer ?? "" }}
          />
        </div>
      )}
    </div>
  );
}

/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  Flame,
  ChevronDown,
  ChevronUp,
  Loader2,
  Target,
} from "lucide-react";
import { getQuestions } from "@/lib/questions";
import type { Question } from "@/types/question";
import { C, RADIUS } from "@/styles/tokens";

// ─── Deterministic daily pick ─────────────────────────────────────────────────
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

// ─── AI eval result shape ─────────────────────────────────────────────────────
interface EvalResult {
  score: number;
  grade: string;
  verdict: string;
  strengths: string[];
  missing: string[];
  betterAnswer: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const wrap = css`
  background: linear-gradient(
    135deg,
    rgba(124, 106, 247, 0.08) 0%,
    rgba(106, 247, 192, 0.05) 100%
  );
  border: 1px solid rgba(124, 106, 247, 0.2);
  border-radius: ${RADIUS.xxl};
  overflow: hidden;
  margin-bottom: 1.5rem;
`;
const wrapDone = css`
  border-color: rgba(106, 247, 192, 0.25);
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
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #c4b5fd;
  background: rgba(124, 106, 247, 0.15);
  padding: 3px 10px;
  border-radius: 20px;
`;
const pillDone = css`
  color: #6af7c0;
  background: rgba(106, 247, 192, 0.12);
`;
const dateLabel = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.28);
  margin-left: auto;
`;

const qWrap = css`
  padding: 0.75rem 1.125rem 0;
`;
const qText = css`
  font-size: 1rem;
  font-weight: 800;
  color: white;
  line-height: 1.45;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
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
  margin-right: 0.375rem;
`;
const catBadge = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.38);
  font-weight: 600;
`;

// answer reveal
const answerSection = css`
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding: 0.875rem 1.125rem;
  margin-top: 0.75rem;
`;
const hintBox = css`
  background: rgba(247, 199, 106, 0.07);
  border: 1px solid rgba(247, 199, 106, 0.15);
  border-radius: 0.625rem;
  padding: 0.625rem 0.875rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.6;
  margin-bottom: 0.875rem;
`;
const answerBody = css`
  font-size: 0.875rem;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.72);
  p {
    margin-bottom: 0.625rem;
  }
  strong {
    color: white;
  }
  pre {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 0.625rem;
    padding: 0.875rem 1rem;
    overflow-x: auto;
    font-size: 0.8rem;
    margin: 0.625rem 0;
  }
  code {
    font-family: "Fira Code", monospace;
    color: #a5f3fc;
    font-size: 0.8rem;
  }
  pre code {
    color: #c8c8d8;
  }
  .tip {
    background: rgba(124, 106, 247, 0.08);
    border-left: 3px solid #7c6af7;
    padding: 0.5rem 0.75rem;
    border-radius: 0 0.5rem 0.5rem 0;
    margin: 0.625rem 0;
    font-size: 0.8rem;
  }
`;

// action row
const actionBar = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.125rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;
const revealBtn = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  background: rgba(124, 106, 247, 0.12);
  border: 1px solid rgba(124, 106, 247, 0.25);
  color: #c4b5fd;
  transition: background 0.15s;
  &:hover {
    background: rgba(124, 106, 247, 0.22);
  }
`;
const doneBtn = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  background: rgba(106, 247, 192, 0.1);
  border: 1px solid rgba(106, 247, 192, 0.22);
  color: #6af7c0;
  transition: background 0.15s;
  &:hover {
    background: rgba(106, 247, 192, 0.18);
  }
`;
const tryAiBtn = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  background: rgba(247, 199, 106, 0.1);
  border: 1px solid rgba(247, 199, 106, 0.22);
  color: #f7c76a;
  transition: background 0.15s;
  &:hover {
    background: rgba(247, 199, 106, 0.18);
  }
`;
const donePill = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #6af7c0;
`;

// inline AI evaluator
const evalWrap = css`
  margin: 0 1.125rem 0.875rem;
  background: rgba(247, 199, 106, 0.05);
  border: 1px solid rgba(247, 199, 106, 0.15);
  border-radius: ${RADIUS.xl};
  padding: 1rem;
`;
const evalLabel = css`
  font-size: 0.75rem;
  font-weight: 800;
  color: #f7c76a;
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
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.625rem;
  padding: 0.75rem;
  resize: vertical;
  font-size: 0.875rem;
  color: #c8c8d8;
  line-height: 1.6;
  font-family: inherit;
  outline: none;
  min-height: 100px;
  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }
  &:focus {
    border-color: rgba(247, 199, 106, 0.35);
  }
`;
const submitBtn = (active: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.625rem;
  padding: 0.5rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 700;
  background: ${active ? "#f7c76a" : "rgba(255,255,255,0.06)"};
  color: ${active ? "#111" : "rgba(255,255,255,0.25)"};
  border: none;
  cursor: ${active ? "pointer" : "default"};
  transition:
    background 0.15s,
    color 0.15s;
`;
const scoreCard = css`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 0.75rem;
  padding: 0.875rem;
  margin-top: 0.75rem;
`;
const scoreNum = (n: number) => css`
  font-size: 2rem;
  font-weight: 900;
  line-height: 1;
  color: ${n >= 8 ? "#6af7c0" : n >= 6 ? "#f7c76a" : "#f76a6a"};
`;
const scoreDenom = css`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 600;
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
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;
const barTrack = css`
  height: 5px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 9999px;
  overflow: hidden;
`;
const barFill = (n: number) => css`
  height: 100%;
  width: ${n * 10}%;
  border-radius: 9999px;
  background: ${n >= 8 ? "#6af7c0" : n >= 6 ? "#f7c76a" : "#f76a6a"};
`;
const feedSection = css`
  margin-top: 0.75rem;
`;
const feedTitle = (c: string) => css`
  font-size: 0.6875rem;
  font-weight: 800;
  color: ${c};
  margin-bottom: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;
const feedItem = css`
  display: flex;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 0.25rem;
  line-height: 1.5;
`;
const toggleBetterBtn = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: rgba(255, 255, 255, 0.7);
  }
`;
const betterBox = css`
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 0.625rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
`;
const tryAgainBtn = css`
  margin-top: 0.625rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const responsiveText = css`
  display: none;

  @media (min-width: 400px) {
    display: inline;
  }
`;

// ─── Diff meta ────────────────────────────────────────────────────────────────
const DIFF: Record<string, { color: string; bg: string; label: string }> = {
  core: { color: "#6af7c0", bg: "rgba(106,247,192,0.12)", label: "Core" },
  mid: { color: "#f7c76a", bg: "rgba(247,199,106,0.12)", label: "Mid" },
  adv: { color: "#f76a6a", bg: "rgba(247,106,106,0.12)", label: "Advanced" },
};

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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [showBetter, setShowBetter] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined")
      setDone(localStorage.getItem(key) === "1");
    // Fetch all published theory questions, pick deterministically by day
    getQuestions({
      filters: { status: "published", type: "theory" },
      pageSize: 200,
    })
      .then(({ questions: all }) => {
        if (all.length) setQ(all[getDayIndex() % all.length]);
      })
      .catch(() => {});
  }, [key]);

  function markDone() {
    localStorage.setItem(key, "1");
    setDone(true);
  }

  if (!q)
    return (
      <div css={[wrap, { padding: "1.5rem", marginBottom: "1.5rem" }]}>
        <div
          style={{
            height: "0.875rem",
            width: "7rem",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.06)",
            marginBottom: "1rem",
          }}
        />
        <div
          style={{
            height: "1.5rem",
            width: "85%",
            borderRadius: "0.5rem",
            background: "rgba(255,255,255,0.05)",
            marginBottom: "0.5rem",
          }}
        />
        <div
          style={{
            height: "1.5rem",
            width: "65%",
            borderRadius: "0.5rem",
            background: "rgba(255,255,255,0.04)",
          }}
        />
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
      // fail silently — keep textarea open
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
      {/* ── Header ── */}
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

      {/* ── Question ── */}
      <div css={qWrap}>
        <p css={qText}>{q.title}</p>
        <span css={diffBadge(dm.color, dm.bg)}>{dm.label}</span>
        <span css={catBadge}>{q.category}</span>
      </div>

      <div css={actionBar}>
        {done ? (
          <div css={donePill}>
            <CheckCircle size={14} /> Completed today!
          </div>
        ) : (
          <>
            {/* Primary action — takes all available space */}
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
            {/* Secondary — icon only on narrow screens */}
            <button
              css={revealBtn}
              onClick={() => setAnswerOpen((o) => !o)}
              title={answerOpen ? "Hide answer" : "Show answer"}
            >
              {answerOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              <span css={responsiveText}>{answerOpen ? "Hide" : "Answer"}</span>
            </button>
            {!evalOpen && (
              <button css={doneBtn} onClick={markDone} title="I know this">
                <CheckCircle size={13} />
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Inline AI Evaluator ── */}
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
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
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
                  <div css={feedTitle("#6af7c0")}>✓ Got right</div>
                  {result.strengths.map((s, i) => (
                    <div key={i} css={feedItem}>
                      <span style={{ color: "#6af7c0", flexShrink: 0 }}>•</span>
                      {s}
                    </div>
                  ))}
                </div>
              )}

              {result.missing.length > 0 && (
                <div css={feedSection}>
                  <div css={feedTitle("#f76a6a")}>✗ Missed</div>
                  {result.missing.map((m, i) => (
                    <div key={i} css={feedItem}>
                      <span style={{ color: "#f76a6a", flexShrink: 0 }}>•</span>
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
                      color: "#6af7c0",
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

      {/* ── Full answer reveal ── */}
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

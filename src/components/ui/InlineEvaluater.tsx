/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import { useState } from "react";
import Link from "next/link";
import {
  Target,
  Loader2,
  ChevronDown,
  ChevronUp,
  Lock,
  Zap,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PaywallBanner from "./PaywallBanner/page";

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
  question: string;
  idealAnswer: string; // plain text (HTML stripped before passing)
  label?: string; // override heading text
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const wrap = css`
  margin-top: 1.25rem;
  border: 1px solid rgba(247, 199, 106, 0.2);
  border-radius: 1rem;
  overflow: hidden;
  background: rgba(247, 199, 106, 0.04);
`;

const triggerBtn = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem 1.125rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
  &:hover {
    background: rgba(247, 199, 106, 0.06);
  }
`;
const triggerIcon = css`
  width: 1.625rem;
  height: 1.625rem;
  border-radius: 50%;
  flex-shrink: 0;
  background: rgba(247, 199, 106, 0.15);
  border: 1px solid rgba(247, 199, 106, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const triggerLabel = css`
  font-size: 0.875rem;
  font-weight: 800;
  color: #f7c76a;
  flex: 1;
`;
const triggerSub = css`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
`;
const chevronStyle = (open: boolean) => css`
  color: rgba(255, 255, 255, 0.3);
  transition: transform 0.2s;
  transform: rotate(${open ? "180deg" : "0deg"});
  flex-shrink: 0;
`;

const body = css`
  padding: 0 1.125rem 1.125rem;
`;

// Auth states
const signInBox = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
`;
const signInText = css`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
`;
const signInBtn = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.875rem;
  background: #7c6af7;
  color: white;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s;
  &:hover {
    background: #6d5ce8;
  }
`;

const proGateBox = css`
  padding: 1rem;
  border: 1px solid rgba(124, 106, 247, 0.2);
  border-radius: 0.875rem;
  background: rgba(124, 106, 247, 0.06);
`;
const proGateText = css`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 0.875rem;
  line-height: 1.55;
`;
const proUpgradeBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: #7c6af7;
  color: white;
  border-radius: 0.625rem;
  font-size: 0.8rem;
  font-weight: 800;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #6d5ce8;
  }
`;

// Evaluator
const textarea = css`
  display: block;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  min-height: 96px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.625rem;
  padding: 0.75rem 0.875rem;
  font-size: 0.875rem;
  color: #c8c8d8;
  line-height: 1.65;
  font-family: inherit;
  outline: none;
  &::placeholder {
    color: rgba(255, 255, 255, 0.22);
  }
  &:focus {
    border-color: rgba(247, 199, 106, 0.35);
  }
`;
const evalBtn = (active: boolean) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 0.625rem;
  padding: 0.5625rem 1.125rem;
  border-radius: 0.625rem;
  border: none;
  cursor: ${active ? "pointer" : "default"};
  font-size: 0.8125rem;
  font-weight: 700;
  transition: all 0.15s;
  background: ${active ? "#f7c76a" : "rgba(255,255,255,0.06)"};
  color: ${active ? "#111" : "rgba(255,255,255,0.2)"};
  &:hover {
    background: ${active ? "#f5be50" : "rgba(255,255,255,0.06)"};
  }
`;

// Results
const resultWrap = css`
  margin-top: 0.875rem;
`;
const scoreRow = css`
  display: flex;
  gap: 0.875rem;
  align-items: flex-start;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.75rem;
  padding: 0.875rem;
  margin-bottom: 0.875rem;
`;
const scoreNum = (n: number) => css`
  font-size: 2rem;
  font-weight: 900;
  line-height: 1;
  color: ${n >= 8 ? "#6af7c0" : n >= 5 ? "#f7c76a" : "#f76a6a"};
`;
const scoreDenom = css`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 600;
`;
const gradeLabel = (g: string) => css`
  font-size: 0.6875rem;
  font-weight: 800;
  margin-top: 3px;
  letter-spacing: 0.04em;
  color: ${g === "A"
    ? "#6af7c0"
    : g === "B"
      ? "#a5f3fc"
      : g === "C"
        ? "#f7c76a"
        : "#f76a6a"};
`;
const verdictText = css`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;
const barTrack = css`
  height: 4px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 9999px;
`;
const barFill = (n: number) => css`
  height: 100%;
  border-radius: 9999px;
  width: ${n * 10}%;
  background: ${n >= 8 ? "#6af7c0" : n >= 5 ? "#f7c76a" : "#f76a6a"};
  transition: width 0.6s ease;
`;

const feedHead = (c: string) => css`
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${c};
  margin: 0.625rem 0 0.375rem;
`;
const feedItem = css`
  display: flex;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.62);
  line-height: 1.5;
  margin-bottom: 0.25rem;
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
  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;
const betterBox = css`
  margin-top: 0.5rem;
  padding: 0.75rem;
  font-size: 0.8rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.625rem;
`;
const tryAgainBtn = css`
  margin-top: 0.625rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function InlineEvaluator({
  question,
  idealAnswer,
  label,
}: Props) {
  const { user, progress } = useAuth();
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [showBetter, setShowBetter] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  async function evaluate() {
    if (!answer.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "evaluate",
          messages: [{ role: "user", content: answer }],
          context: { question, idealAnswer },
        }),
      });
      const data = await res.json();
      setResult(JSON.parse(data.text.replace(/```json|```/g, "").trim()));
    } catch {
      /* keep form open */
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setAnswer("");
    setShowBetter(false);
  }

  return (
    <>
      {showPaywall && (
        <PaywallBanner
          reason="AI Answer Evaluator is a Pro feature. Upgrade to get scored on your answers!"
          onClose={() => setShowPaywall(false)}
        />
      )}

      <div css={wrap}>
        {/* Trigger */}
        <button
          css={triggerBtn}
          onClick={() => {
            if (!user) {
              setOpen((o) => !o);
              return;
            }
            if (!progress?.isPro) {
              setShowPaywall(true);
              return;
            }
            setOpen((o) => !o);
          }}
        >
          <div css={triggerIcon}>
            <Target size={12} color="#f7c76a" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div css={triggerLabel}>{label ?? "Evaluate with AI"}</div>
            <div css={triggerSub}>
              {!user
                ? "Sign in to test your answer"
                : !progress?.isPro
                  ? "Pro feature — upgrade to unlock"
                  : "Type your answer, get scored 1–10"}
            </div>
          </div>
          {!user || progress?.isPro ? (
            <div css={chevronStyle(open)}>
              <ChevronDown size={15} />
            </div>
          ) : (
            <Lock
              size={14}
              style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }}
            />
          )}
        </button>

        {/* Body */}
        {open && (
          <div css={body}>
            {/* Not signed in */}
            {!user && (
              <div css={signInBox}>
                <span css={signInText}>
                  Sign in to test your answer with AI scoring
                </span>
                <Link href="/auth" css={signInBtn}>
                  <Zap size={12} /> Sign in free
                </Link>
              </div>
            )}

            {/* Signed in, free */}
            {user && !progress?.isPro && (
              <div css={proGateBox}>
                <p css={proGateText}>
                  AI Answer Evaluator is a Pro feature. Type your answer and get
                  a 1–10 score, see exactly what you got right, what you missed,
                  and a better answer.
                </p>
                <button
                  css={proUpgradeBtn}
                  onClick={() => {
                    setOpen(false);
                    setShowPaywall(true);
                  }}
                >
                  <Zap size={12} /> Upgrade to Pro
                </button>
              </div>
            )}

            {/* Pro — full evaluator */}
            {user && progress?.isPro && !result && (
              <>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: "0.625rem",
                  }}
                >
                  Answer as if you're in a real interview — don't look at the
                  answer above.
                </p>
                <textarea
                  css={textarea}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here…"
                  rows={5}
                />
                <button
                  css={evalBtn(!!answer.trim() && !loading)}
                  onClick={evaluate}
                  disabled={!answer.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={13}
                        style={{ animation: "spin 1s linear infinite" }}
                      />{" "}
                      Evaluating…
                    </>
                  ) : (
                    <>
                      <Target size={13} /> Get My Score
                    </>
                  )}
                </button>
              </>
            )}

            {/* Results */}
            {user && progress?.isPro && result && (
              <div css={resultWrap}>
                <div css={scoreRow}>
                  <div style={{ flexShrink: 0 }}>
                    <div css={scoreNum(result.score)}>
                      {result.score}
                      <span css={scoreDenom}>/10</span>
                    </div>
                    <div css={gradeLabel(result.grade)}>{result.grade}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p css={verdictText}>{result.verdict}</p>
                    <div css={barTrack}>
                      <div css={barFill(result.score)} />
                    </div>
                  </div>
                </div>

                {result.strengths.length > 0 && (
                  <>
                    <div css={feedHead("#6af7c0")}>✓ What you got right</div>
                    {result.strengths.map((s, i) => (
                      <div key={i} css={feedItem}>
                        <span style={{ color: "#6af7c0", flexShrink: 0 }}>
                          •
                        </span>
                        {s}
                      </div>
                    ))}
                  </>
                )}

                {result.missing.length > 0 && (
                  <>
                    <div css={feedHead("#f76a6a")}>✗ What you missed</div>
                    {result.missing.map((m, i) => (
                      <div key={i} css={feedItem}>
                        <span style={{ color: "#f76a6a", flexShrink: 0 }}>
                          •
                        </span>
                        {m}
                      </div>
                    ))}
                  </>
                )}

                <button
                  css={betterToggle}
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
                    gap: "0.875rem",
                    marginTop: "0.875rem",
                  }}
                >
                  <button css={tryAgainBtn} onClick={reset}>
                    Try again
                  </button>
                  {result.score >= 8 && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6af7c0",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <CheckCircle size={11} /> Excellent answer!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

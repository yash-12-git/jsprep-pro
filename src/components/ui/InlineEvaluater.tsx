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
import { C, RADIUS } from "@/styles/tokens";

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
  idealAnswer: string;
  label?: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const wrap = css`
  margin-top: 1.25rem;
  border: 1px solid ${C.amberBorder};
  border-radius: ${RADIUS.lg};
  overflow: hidden;
  background: ${C.amberSubtle};
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
  transition: background 0.12s ease;
  &:hover {
    background: ${C.bgHover};
  }
`;

const triggerIcon = css`
  width: 1.625rem;
  height: 1.625rem;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${C.bg};
  border: 1px solid ${C.amberBorder};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const triggerLabel = css`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${C.amber};
  flex: 1;
`;
const triggerSub = css`
  font-size: 0.75rem;
  color: ${C.muted};
`;

const chevronStyle = (open: boolean) => css`
  color: ${C.muted};
  transition: transform 0.18s ease;
  transform: rotate(${open ? "180deg" : "0deg"});
  flex-shrink: 0;
`;

const body = css`
  padding: 0 1.125rem 1.125rem;
`;

const signInBox = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  background: ${C.bgSubtle};
`;
const signInText = css`
  font-size: 0.8125rem;
  color: ${C.muted};
`;
const signInLink = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.875rem;
  background: ${C.accent};
  color: #ffffff;
  border-radius: ${RADIUS.md};
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity 0.12s ease;
  &:hover {
    opacity: 0.88;
  }
`;

const proGateBox = css`
  padding: 1rem;
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  background: ${C.bgSubtle};
`;
const proGateText = css`
  font-size: 0.8125rem;
  color: ${C.muted};
  margin-bottom: 0.875rem;
  line-height: 1.55;
`;
const proUpgradeBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.875rem;
  background: ${C.accent};
  color: #ffffff;
  border-radius: ${RADIUS.md};
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: opacity 0.12s ease;
  &:hover {
    opacity: 0.88;
  }
`;

const textareaStyle = css`
  display: block;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  min-height: 96px;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.75rem 0.875rem;
  font-size: 0.875rem;
  color: ${C.text};
  line-height: 1.65;
  font-family: inherit;
  outline: none;
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

const evalBtn = (active: boolean) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 0.625rem;
  padding: 0.5rem 1rem;
  border-radius: ${RADIUS.md};
  border: 1px solid ${active ? C.accent : C.border};
  cursor: ${active ? "pointer" : "default"};
  font-size: 0.8125rem;
  font-weight: 600;
  background: ${active ? C.accent : C.bgSubtle};
  color: ${active ? "#ffffff" : C.muted};
  transition: opacity 0.12s ease;
  &:hover {
    opacity: ${active ? 0.88 : 1};
  }
`;

const resultWrap = css`
  margin-top: 0.875rem;
`;

const scoreRow = css`
  display: flex;
  gap: 0.875rem;
  align-items: flex-start;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.875rem;
  margin-bottom: 0.875rem;
`;

const scoreNum = (n: number) => css`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  color: ${n >= 8 ? C.green : n >= 5 ? C.amber : C.red};
`;
const scoreDenom = css`
  font-size: 0.8125rem;
  color: ${C.muted};
  font-weight: 500;
`;
const gradeLabel = (g: string) => css`
  font-size: 0.6875rem;
  font-weight: 700;
  margin-top: 3px;
  letter-spacing: 0.04em;
  color: ${g === "A"
    ? C.green
    : g === "B"
      ? C.accent
      : g === "C"
        ? C.amber
        : C.red};
`;
const verdictText = css`
  font-size: 0.8125rem;
  color: ${C.muted};
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;
const barTrack = css`
  height: 4px;
  background: ${C.border};
  border-radius: 9999px;
`;
const barFill = (n: number) => css`
  height: 100%;
  border-radius: 9999px;
  width: ${n * 10}%;
  background: ${n >= 8 ? C.green : n >= 5 ? C.amber : C.red};
  transition: width 0.6s ease;
`;

const feedHead = (c: string) => css`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${c};
  margin: 0.625rem 0 0.375rem;
`;
const feedItem = css`
  display: flex;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: ${C.muted};
  line-height: 1.5;
  margin-bottom: 0.25rem;
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
  transition: color 0.12s ease;
  &:hover {
    color: ${C.text};
  }
`;
const betterBox = css`
  margin-top: 0.5rem;
  padding: 0.75rem;
  font-size: 0.8rem;
  line-height: 1.7;
  color: ${C.muted};
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.md};
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
            <Target size={12} color={C.amber} />
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
            <Lock size={14} style={{ color: C.muted, flexShrink: 0 }} />
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
                <Link href="/auth" css={signInLink}>
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
                  css={{
                    fontSize: "0.8rem",
                    color: C.muted,
                    marginBottom: "0.625rem",
                    lineHeight: 1.5,
                  }}
                >
                  Answer as if you're in a real interview — don't look at the
                  answer above.
                </p>
                <textarea
                  css={textareaStyle}
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
                    <div css={feedHead(C.green)}>✓ What you got right</div>
                    {result.strengths.map((s, i) => (
                      <div key={i} css={feedItem}>
                        <span style={{ color: C.green, flexShrink: 0 }}>•</span>
                        {s}
                      </div>
                    ))}
                  </>
                )}
                {result.missing.length > 0 && (
                  <>
                    <div css={feedHead(C.red)}>✗ What you missed</div>
                    {result.missing.map((m, i) => (
                      <div key={i} css={feedItem}>
                        <span style={{ color: C.red, flexShrink: 0 }}>•</span>
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
                        color: C.green,
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

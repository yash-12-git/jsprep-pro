"use client";
/**
 * SEOPredictionCard — interactive output prediction card for SEO pages.
 *
 * Used on /javascript-output-questions and /javascript-tricky-questions.
 * Inline styles only — no Emotion, works inside RSC pages.
 * No auth / Firestore — public SEO pages don't track progress.
 *
 * Free limit: first `freeLimit` cards (by globalIndex) are interactive.
 * Beyond that: code stays visible (SEO), prediction input is locked.
 * Answers never appear in the DOM until the user checks or reveals.
 */

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, EyeOff, RotateCcw, Lock } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";

export interface SEOQuestion {
  id: string | number;
  title: string;
  code?: string;
  answer: string;
  explanation?: string;
  keyInsight?: string;
  difficulty?: string;
  category?: string;
  tags?: string[];
}

interface Props {
  q: SEOQuestion;
  globalIndex: number;
  freeLimit: number;
  quizHref: string;
  accent: string; // per-page accent (kept for external callers)
  badgeLabel?: string;
}

// ─── Normalize for comparison ─────────────────────────────────────────────────
function normalizeOutput(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
}

// ─── Diff styles — full semantic tokens ──────────────────────────────────────
const DIFF_STYLE: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  easy: { color: C.green, bg: C.greenSubtle, border: C.greenBorder },
  beginner: { color: C.green, bg: C.greenSubtle, border: C.greenBorder },
  core: { color: C.green, bg: C.greenSubtle, border: C.greenBorder },
  medium: { color: C.amber, bg: C.amberSubtle, border: C.amberBorder },
  advanced: { color: C.amber, bg: C.amberSubtle, border: C.amberBorder },
  hard: { color: C.red, bg: C.redSubtle, border: C.redBorder },
  expert: { color: C.red, bg: C.redSubtle, border: C.redBorder },
};

const DIFF_LABEL: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  beginner: "Easy",
  core: "Easy",
  advanced: "Medium",
  expert: "Hard",
};

type State = "idle" | "correct" | "wrong" | "revealed";

// ─── Shared button shapes ─────────────────────────────────────────────────────
const ghostBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.4rem 0.875rem",
  background: "transparent",
  border: `1px solid ${C.border}`,
  color: C.muted,
  borderRadius: "0.5rem",
  fontWeight: 500,
  fontSize: "0.75rem",
  cursor: "pointer",
};

export default function SEOPredictionCard({
  q,
  globalIndex,
  freeLimit,
  quizHref,
  accent,
  badgeLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [state, setState] = useState<State>("idle");

  const isLocked = globalIndex >= freeLimit;
  const ds = q.difficulty
    ? (DIFF_STYLE[q.difficulty] ?? DIFF_STYLE.medium)
    : DIFF_STYLE.medium;
  const expectedRows = Math.max(3, q.answer.split("\n").length + 1);

  // Card border signals state
  const cardBorder =
    state === "correct"
      ? C.greenBorder
      : state === "wrong"
        ? C.redBorder
        : state === "revealed"
          ? C.borderStrong
          : C.border;

  const cardBg = state === "correct" ? C.greenSubtle : C.bg;

  function check() {
    setState(
      normalizeOutput(prediction) === normalizeOutput(q.answer)
        ? "correct"
        : "wrong",
    );
  }

  return (
    <article
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderLeft: `3px solid ${state === "correct" ? C.green : state === "wrong" ? C.red : "transparent"}`,
        borderRadius: "0.75rem",
        overflow: "hidden",
        transition: "border-color 0.15s ease",
      }}
      itemScope
      itemType="https://schema.org/Question"
    >
      {/* ── Header ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
        style={{
          padding: "0.875rem 1rem",
          cursor: "pointer",
          userSelect: "none",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
          transition: "background 0.12s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = C.bgHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {badgeLabel && (
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.625rem",
              fontWeight: 600,
              color: C.accentText,
              background: C.accentSubtle,
              border: `1px solid ${C.border}`,
              padding: "0.125rem 0.5rem",
              borderRadius: "0.25rem",
              flexShrink: 0,
              marginTop: "0.2rem",
            }}
          >
            {badgeLabel}
          </span>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "0.375rem",
            }}
          >
            <p
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: C.text,
                margin: 0,
              }}
              itemProp="name"
            >
              {q.title}
            </p>
            {isLocked && <Lock size={12} color={C.muted} />}
            {state === "correct" && <CheckCircle size={13} color={C.green} />}
          </div>

          <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
            {q.difficulty && (
              <span
                style={{
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                  border: `1px solid ${ds.border}`,
                  background: ds.bg,
                  color: ds.color,
                }}
              >
                {DIFF_LABEL[q.difficulty] ?? q.difficulty}
              </span>
            )}
            {q.category && (
              <span
                style={{
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                  border: `1px solid ${C.border}`,
                  background: C.bgSubtle,
                  color: C.muted,
                }}
              >
                {q.category}
              </span>
            )}
            {q.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "0.625rem",
                  color: C.muted,
                  background: C.bgSubtle,
                  border: `1px solid ${C.border}`,
                  padding: "0.125rem 0.375rem",
                  borderRadius: "0.25rem",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <span
          style={{
            fontSize: "0.75rem",
            color: C.muted,
            flexShrink: 0,
            marginTop: "0.125rem",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.18s ease",
          }}
        >
          ▾
        </span>
      </div>

      {/* ── Body ── */}
      {open && (
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {/* Code — always visible */}
          {q.code && (
            <div style={{ padding: "1rem 1rem 0" }}>
              <p
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  color: C.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: "0 0 0.5rem",
                }}
              >
                Code
              </p>
              <pre
                style={{
                  background: C.codeBg,
                  border: `1px solid ${C.border}`,
                  borderRadius: "0.625rem",
                  padding: "1rem",
                  fontSize: "0.8125rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  color: C.codeText,
                  overflow: "auto",
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                <code>{q.code}</code>
              </pre>
            </div>
          )}

          {/* LOCKED */}
          {isLocked ? (
            <div style={{ padding: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  background: C.bgSubtle,
                  border: `1px solid ${C.border}`,
                  borderRadius: "0.75rem",
                  padding: "1rem",
                }}
              >
                <Lock size={14} color={C.muted} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: C.text,
                      margin: "0 0 0.2rem",
                    }}
                  >
                    Practice this interactively in the quiz
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: C.muted,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Predict the output before revealing it. That&apos;s how you
                    actually learn it.
                  </p>
                </div>
                <Link
                  href={quizHref}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: C.accentText,
                    background: C.accentSubtle,
                    border: `1px solid ${C.border}`,
                    padding: "0.4375rem 0.875rem",
                    borderRadius: "0.5rem",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Open Interactive Quiz →
                </Link>
              </div>
            </div>
          ) : (
            /* UNLOCKED */
            <div
              style={{ padding: "0 1rem 1rem" }}
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <p
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  color: C.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: "0.875rem 0 0.5rem",
                }}
              >
                Your prediction{" "}
                <span
                  style={{
                    textTransform: "none",
                    letterSpacing: 0,
                    fontWeight: 400,
                  }}
                >
                  (one output per line)
                </span>
              </p>

              <textarea
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
                disabled={state === "correct"}
                placeholder={"Type the expected output...\nOne value per line"}
                rows={expectedRows}
                style={
                  {
                    width: "100%",
                    boxSizing: "border-box",
                    background: C.bg,
                    border: `1px solid ${
                      state === "wrong"
                        ? C.redBorder
                        : state === "correct"
                          ? C.greenBorder
                          : C.border
                    }`,
                    borderRadius: "0.625rem",
                    padding: "0.75rem 1rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.8125rem",
                    color: C.text,
                    outline: "none",
                    resize: "none",
                    lineHeight: 1.8,
                    opacity: state === "correct" ? 0.6 : 1
                  } as React.CSSProperties
                }
                onFocus={(e) => {
                  if (state === "idle") e.target.style.borderColor = C.accent;
                  e.target.style.boxShadow = `0 0 0 2px ${C.accentSubtle}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor =
                    state === "wrong"
                      ? C.redBorder
                      : state === "correct"
                        ? C.greenBorder
                        : C.border;
                  e.target.style.boxShadow = "none";
                }}
              />

              {/* Idle actions */}
              {state === "idle" && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "0.625rem",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={check}
                    disabled={!prediction.trim()}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.5rem 1.125rem",
                      background: prediction.trim() ? C.accent : C.bgSubtle,
                      color: prediction.trim() ? "#ffffff" : C.muted,
                      border: "none",
                      borderRadius: "0.5rem",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      cursor: prediction.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    ✓ Check Answer
                  </button>
                  <button onClick={() => setState("revealed")} style={ghostBtn}>
                    👁 Reveal
                  </button>
                </div>
              )}

              {/* Wrong actions */}
              {state === "wrong" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "0.625rem",
                      color: C.red,
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                    }}
                  >
                    <XCircle size={14} /> Not quite — check your output
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={check}
                      disabled={!prediction.trim()}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        padding: "0.5rem 1.125rem",
                        background: C.red,
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "0.5rem",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                      }}
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => setState("revealed")}
                      style={ghostBtn}
                    >
                      Show Answer
                    </button>
                  </div>
                </>
              )}

              {/* Correct / revealed actions */}
              {(state === "correct" || state === "revealed") && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "0.625rem",
                    flexWrap: "wrap",
                  }}
                >
                  {state === "revealed" && (
                    <button
                      onClick={() => {
                        setState("idle");
                        setPrediction("");
                      }}
                      style={ghostBtn}
                    >
                      <EyeOff size={11} /> Hide
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setPrediction("");
                      setState("idle");
                    }}
                    style={ghostBtn}
                  >
                    <RotateCcw size={11} /> Try Again
                  </button>
                </div>
              )}

              {/* Answer + explanation — only after check or reveal */}
              {(state === "correct" || state === "revealed") && (
                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                  itemProp="text"
                >
                  {/* Expected output */}
                  <div
                    style={{
                      background: C.greenSubtle,
                      border: `1px solid ${C.greenBorder}`,
                      borderRadius: "0.625rem",
                      padding: "0.875rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        color: state === "correct" ? C.green : C.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        margin: "0 0 0.5rem",
                      }}
                    >
                      {state === "correct"
                        ? "✓ Correct! 🎉"
                        : "Expected Output"}
                    </p>
                    <pre
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.875rem",
                        color: C.green,
                        margin: 0,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {q.answer}
                    </pre>
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div
                      style={{
                        background: C.bgSubtle,
                        border: `1px solid ${C.border}`,
                        borderRadius: "0.625rem",
                        padding: "0.875rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: C.accent,
                          marginBottom: "0.375rem",
                        }}
                      >
                        💡 Explanation
                      </p>
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: C.muted,
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {q.explanation}
                      </p>
                      {q.keyInsight && (
                        <div
                          style={{
                            marginTop: "0.75rem",
                            paddingTop: "0.75rem",
                            borderTop: `1px solid ${C.border}`,
                          }}
                        >
                          <p
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: C.amber,
                              marginBottom: "0.25rem",
                            }}
                          >
                            ⚡ Key Insight
                          </p>
                          <p
                            style={{
                              fontSize: "0.8125rem",
                              color: C.muted,
                              margin: 0,
                              lineHeight: 1.6,
                            }}
                          >
                            {q.keyInsight}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

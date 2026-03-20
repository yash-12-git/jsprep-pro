/** @jsxImportSource @emotion/react */
"use client";

import { useState } from "react";
import {
  ChevronDown,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  RotateCcw,
  Lock,
  Zap,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import * as Shared from "@/styles/shared";
import { C, RADIUS } from "@/styles/tokens";
import * as S from "./styles";
import type { Question } from "@/types/question";

export interface AIFeedback {
  correct: boolean;
  score: number;
  verdict: string;
  whatTheyGotRight: string;
  remainingIssues: string;
  betterApproach: string | null;
  hint: string;
  explanation: string;
}

type UIPhase = "editing" | "checking" | "feedback";

interface Props {
  q: Question;
  index: number;
  isPro: boolean;
  isLoggedIn: boolean;
  isSolved: (id: string) => boolean;
  isRevealed: (id: string) => boolean;
  recordSolved: (id: string) => Promise<void>;
  recordRevealed: (id: string) => Promise<void>;
  isLocked?: boolean;
  onPaywall?: () => void;
}

export default function DebugCard({
  q,
  index,
  isPro,
  isLoggedIn,
  isSolved,
  isRevealed,
  recordSolved,
  recordRevealed,
  isLocked = false,
  onPaywall,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [userCode, setUserCode] = useState(q.brokenCode || q.code || "");
  const [uiPhase, setUiPhase] = useState<UIPhase>("editing");
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [showReveal, setShowReveal] = useState(false);

  const persistedSolved = isSolved(q.id);
  const persistedRevealed = isRevealed(q.id);
  const hasEdited = userCode.trim() !== (q.brokenCode || q.code || "").trim();
  const isSolvedQ = feedback?.correct || persistedSolved;

  const ds = S.DIFF_STYLE[q.difficulty] ?? S.DIFF_STYLE.core;
  const cs = S.CAT_STYLE[q.category] ?? {
    bg: C.bgSubtle,
    color: C.muted,
    border: C.border,
  };

  const highlight: S.CardHighlight = isSolvedQ
    ? "correct"
    : uiPhase === "feedback" && !isSolvedQ
      ? "wrong"
      : persistedRevealed && showReveal
        ? "revealed"
        : "idle";

  const codeTextareaState = isSolvedQ
    ? "correct"
    : uiPhase === "feedback" && !isSolvedQ
      ? "wrong"
      : uiPhase === "checking"
        ? "checking"
        : "idle";

  async function checkWithAI() {
    if (!hasEdited) {
      alert("Edit the code to fix the bug first!");
      return;
    }
    setUiPhase("checking");
    setShowReveal(false);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "debugcheck",
          messages: [{ role: "user", content: userCode }],
          context: {
            brokenCode: q.brokenCode || q.code,
            bugDescription: q.bugDescription,
            fixedCode: q.fixedCode,
            userFix: userCode,
          },
        }),
      });
      const data = await res.json();
      const parsed: AIFeedback = JSON.parse(
        data.text.replace(/```json|```/g, "").trim(),
      );
      setFeedback(parsed);
      setUiPhase("feedback");
      if (parsed.correct && !persistedSolved) await recordSolved(q.id);
    } catch {
      setUiPhase("editing");
      alert("AI check failed — try again");
    }
  }

  async function revealAnswer() {
    if (!persistedSolved && !persistedRevealed && isPro)
      await recordRevealed(q.id);
    setShowReveal(true);
  }

  function reset() {
    setUserCode(q.brokenCode || q.code || "");
    setUiPhase("editing");
    setFeedback(null);
    setShowReveal(false);
  }
  function retryAI() {
    setUiPhase("editing");
    setFeedback(null);
  }

  return (
    <div css={S.questionCard(highlight, C.red)}>
      {/* Header */}
      <div css={S.cardHeader} onClick={() => setIsOpen((o) => !o)}>
        <span css={S.qNumber(C.red)}>
          #{String(index + 1).padStart(2, "0")}
        </span>
        <div css={{ flex: 1, minWidth: 0 }}>
          <div
            css={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "0.375rem",
            }}
          >
            <p css={{ fontWeight: 600, fontSize: "0.875rem", color: C.text }}>
              {q.title}
            </p>
            {isLocked && <Lock size={12} color={C.muted} />}
            {isSolvedQ && <CheckCircle size={14} color={C.green} />}
            {!persistedSolved && persistedRevealed && (
              <Eye size={14} color={C.muted} />
            )}
            {uiPhase === "feedback" && !isSolvedQ && (
              <XCircle size={14} color={C.red} />
            )}
          </div>
          <div css={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span
              css={{
                fontSize: "0.625rem",
                fontWeight: 600,
                padding: "0.125rem 0.5rem",
                borderRadius: "9999px",
                border: `1px solid ${ds.border}`,
                background: ds.bg,
                color: ds.color,
              }}
            >
              {S.DIFF_LABEL[q.difficulty] ?? q.difficulty}
            </span>
            <span
              css={{
                fontSize: "0.625rem",
                fontWeight: 500,
                padding: "0.125rem 0.5rem",
                borderRadius: "9999px",
                border: `1px solid ${cs.border}`,
                background: cs.bg,
                color: cs.color,
              }}
            >
              {q.category}
            </span>
            <span
              css={{
                fontSize: "0.625rem",
                fontWeight: 600,
                padding: "0.125rem 0.5rem",
                borderRadius: "9999px",
                border: `1px solid ${C.redBorder}`,
                background: C.redSubtle,
                color: C.red,
              }}
            >
              Debug
            </span>
          </div>
        </div>
        <div css={S.chevronWrapper(isOpen)}>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div css={S.cardBody}>
          {isLocked ? (
            <div css={[S.bodyInner, { paddingTop: "1.25rem" }]}>
              <div
                css={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1.5rem",
                  background: C.redSubtle,
                  border: `1px solid ${C.redBorder}`,
                  borderRadius: RADIUS.lg,
                  textAlign: "center",
                }}
              >
                <Lock size={22} color={C.red} />
                <div>
                  <p
                    css={{
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      color: C.text,
                      marginBottom: "0.25rem",
                    }}
                  >
                    Pro Challenge
                  </p>
                  <p
                    css={{
                      fontSize: "0.8125rem",
                      color: C.muted,
                      lineHeight: 1.6,
                    }}
                  >
                    Upgrade to access all debug challenges + AI-powered fix
                    checking
                  </p>
                </div>
                <button
                  css={Shared.primaryBtn(C.red)}
                  style={{ width: "auto", padding: "0.5rem 1.5rem" }}
                  onClick={onPaywall}
                >
                  <Zap size={13} /> Upgrade to Pro
                </button>
              </div>
            </div>
          ) : (
            <div css={S.bodyInner}>
              {q.question && (
                <div css={S.descriptionBox}>
                  <AlertTriangle
                    size={14}
                    color={C.red}
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  <p
                    css={{
                      fontSize: "0.875rem",
                      color: C.text,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {q.question}
                  </p>
                </div>
              )}

              <div>
                <p css={S.sectionLabel(C.red)}>🔴 Broken Code</p>
                <pre css={Shared.codeBlock(C.redBorder)}>
                  <code>{q.brokenCode || q.code}</code>
                </pre>
              </div>

              <div>
                <p css={S.sectionLabel(C.green)}>
                  ✏️ Your Fix
                  <span
                    css={{
                      textTransform: "none",
                      letterSpacing: 0,
                      fontWeight: 400,
                      color: C.muted,
                      marginLeft: "0.25rem",
                    }}
                  >
                    — edit the broken code above to fix the bug
                  </span>
                </p>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  disabled={uiPhase === "checking" || isSolvedQ}
                  rows={Math.max(6, userCode.split("\n").length + 1)}
                  spellCheck={false}
                  css={S.codeTextarea(codeTextareaState)}
                />
              </div>

              {/* Action row */}
              <div css={S.actionRow}>
                {isPro ? (
                  <button
                    css={Shared.primaryBtn(C.accent)}
                    onClick={checkWithAI}
                    disabled={uiPhase === "checking" || !hasEdited || isSolvedQ}
                    style={{ flex: 1 }}
                  >
                    {uiPhase === "checking" ? (
                      <>
                        <Loader2
                          size={13}
                          css={{ animation: "spin 1s linear infinite" }}
                        />{" "}
                        AI is checking…
                      </>
                    ) : (
                      <>
                        <Zap size={13} /> Check with AI
                      </>
                    )}
                  </button>
                ) : isLoggedIn ? (
                  <button
                    css={Shared.primaryBtn(C.accent)}
                    onClick={onPaywall}
                    style={{ flex: 1 }}
                  >
                    <Lock size={12} /> Check with AI{" "}
                    <span css={{ fontSize: "0.625rem", opacity: 0.7 }}>
                      · Pro
                    </span>
                  </button>
                ) : (
                  <a
                    href="/auth"
                    css={Shared.primaryBtn(C.accent)}
                    style={{
                      flex: 1,
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    <Zap size={13} /> Sign in to check with AI
                  </a>
                )}
                {!showReveal && (
                  <button
                    css={Shared.actionBtn(C.muted)}
                    onClick={revealAnswer}
                  >
                    <Eye size={13} /> Show Answer
                  </button>
                )}
                {showReveal && (
                  <button
                    css={Shared.actionBtn(C.muted)}
                    onClick={() => setShowReveal(false)}
                  >
                    <EyeOff size={13} /> Hide Answer
                  </button>
                )}
                {(uiPhase === "feedback" || (showReveal && !isSolvedQ)) && (
                  <button
                    css={Shared.ghostBtn}
                    onClick={reset}
                    title="Reset to original broken code"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
              </div>

              {/* AI Feedback */}
              {uiPhase === "feedback" && feedback && (
                <div css={S.feedbackBox(feedback.correct)}>
                  <div css={S.scoreRow}>
                    <div>
                      <span
                        css={S.scoreNumber(feedback.correct, feedback.score)}
                      >
                        {feedback.score}
                      </span>
                      <span css={S.scoreDenom}>/10</span>
                    </div>
                    <div css={{ flex: 1 }}>
                      <div
                        css={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.375rem",
                        }}
                      >
                        {feedback.correct ? (
                          <CheckCircle size={15} color={C.green} />
                        ) : (
                          <XCircle size={15} color={C.red} />
                        )}
                        <p
                          css={{
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            color: C.text,
                          }}
                        >
                          {feedback.verdict}
                        </p>
                      </div>
                      <div css={S.scoreBarTrack}>
                        <div
                          css={S.scoreBarFill(
                            feedback.score * 10,
                            feedback.correct
                              ? C.green
                              : feedback.score >= 5
                                ? C.amber
                                : C.red,
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div css={S.feedbackRow}>
                    <p css={S.feedbackRowTitle(C.green)}>
                      ✓ What you got right
                    </p>
                    <p css={S.feedbackRowText}>{feedback.whatTheyGotRight}</p>
                  </div>
                  {feedback.remainingIssues !== "None" && (
                    <div css={S.feedbackRow}>
                      <p css={S.feedbackRowTitle(C.red)}>
                        ✗ Still needs fixing
                      </p>
                      <p css={S.feedbackRowText}>{feedback.remainingIssues}</p>
                    </div>
                  )}
                  {!feedback.correct && feedback.hint && (
                    <div css={S.hintBox}>
                      <p
                        css={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: C.amber,
                          marginBottom: "0.25rem",
                        }}
                      >
                        💡 Hint
                      </p>
                      <p css={S.feedbackRowText}>{feedback.hint}</p>
                    </div>
                  )}
                  {feedback.betterApproach && (
                    <div css={S.feedbackRow}>
                      <p css={S.feedbackRowTitle(C.accent)}>
                        ⚡ Better approach
                      </p>
                      <p css={S.feedbackRowText}>{feedback.betterApproach}</p>
                    </div>
                  )}
                  <div css={S.feedbackRow}>
                    <p css={S.feedbackRowTitle(C.muted)}>📖 Explanation</p>
                    <p css={S.feedbackRowText}>{feedback.explanation}</p>
                  </div>
                  {!feedback.correct && (
                    <button css={Shared.primaryBtn(C.accent)} onClick={retryAI}>
                      Try Again
                    </button>
                  )}
                </div>
              )}

              {/* Revealed diff */}
              {showReveal && (
                <div
                  css={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <div css={S.diffGrid}>
                    <div>
                      <p css={S.diffLabel(C.red)}>❌ Broken</p>
                      <pre
                        css={Shared.codeBlock(C.redBorder)}
                        style={{ maxHeight: "13rem", overflow: "auto" }}
                      >
                        <code>{q.brokenCode || q.code}</code>
                      </pre>
                    </div>
                    <div>
                      <p css={S.diffLabel(C.green)}>✅ Fixed</p>
                      <pre
                        css={Shared.codeBlock(C.greenBorder)}
                        style={{ maxHeight: "13rem", overflow: "auto" }}
                      >
                        <code css={{ color: C.green }}>{q.fixedCode}</code>
                      </pre>
                    </div>
                  </div>
                  <div css={S.revealCard}>
                    <p
                      css={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: C.red,
                        marginBottom: "0.375rem",
                      }}
                    >
                      🐛 The Bug
                    </p>
                    <p
                      css={{
                        fontSize: "0.75rem",
                        color: C.muted,
                        marginBottom: "0.75rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {q.bugDescription}
                    </p>
                    <p
                      css={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: C.accent,
                        marginBottom: "0.375rem",
                      }}
                    >
                      💡 Explanation
                    </p>
                    <p
                      css={{
                        fontSize: "0.75rem",
                        color: C.muted,
                        marginBottom: q.keyInsight ? "0.75rem" : 0,
                        lineHeight: 1.6,
                      }}
                    >
                      {q.explanation}
                    </p>
                    {q.keyInsight && (
                      <>
                        <p
                          css={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: C.amber,
                            marginBottom: "0.375rem",
                          }}
                        >
                          ⚡ Key Insight
                        </p>
                        <p
                          css={{
                            fontSize: "0.75rem",
                            color: C.muted,
                            lineHeight: 1.6,
                          }}
                        >
                          {q.keyInsight}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

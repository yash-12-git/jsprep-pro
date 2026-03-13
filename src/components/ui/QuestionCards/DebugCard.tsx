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
import { C } from "@/styles/tokens";
import * as S from "./styles";
import type { Question } from "@/types/question";

/**
 * STATE MODEL
 * ──────────────────────────────────────────────────────────────────────────
 * Same separation as OutputCard:
 *   Firestore state = progress badge in header only (has the user ever solved/revealed?)
 *   Local state = drives all visible UI
 *
 *   showReveal  — whether the fixed-code diff + explanation is currently shown
 *   aiFeedback  — current AI check result (local, not persisted)
 *   uiPhase     — 'editing' | 'checking' | 'feedback'
 *
 * This means:
 *   - reset() truly blanks the card back to the original broken code
 *   - "Show answer" / "Hide answer" toggles freely
 *   - AI check always available if isPro, regardless of prior Firestore state
 */

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
  /** Hides code — show a locked upgrade card instead */
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

  const toggle = () => setIsOpen((o) => !o);

  const persistedSolved = isSolved(q.id);
  const persistedRevealed = isRevealed(q.id);
  const hasEdited = userCode.trim() !== (q.brokenCode || q.code || "").trim();
  const isSolvedQ = feedback?.correct || persistedSolved;

  const ds = S.DIFF_STYLE[q.difficulty] ?? S.DIFF_STYLE.core;
  const cs = S.CAT_STYLE[q.category] ?? {
    bg: C.border,
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
    if (!persistedSolved && !persistedRevealed && isPro) await recordRevealed(q.id);
    setShowReveal(true);
  }

  function hideReveal() {
    setShowReveal(false);
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
    <div css={S.questionCard(highlight, C.danger)}>
      {/* ── Header ── */}
      <div css={S.cardHeader} onClick={toggle}>
        <span css={S.qNumber(C.danger)}>
          #{String(index + 1).padStart(2, "00")}
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
            <p css={{ fontWeight: 700, fontSize: "0.875rem" }}>{q.title}</p>
            {isLocked && <Lock size={12} color={C.muted} />}
            {isSolvedQ && <CheckCircle size={14} color={C.accent3} />}
            {!persistedSolved && persistedRevealed && (
              <Eye size={14} color={C.muted} />
            )}
            {uiPhase === "feedback" && !isSolvedQ && (
              <XCircle size={14} color={C.danger} />
            )}
          </div>
          <div css={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span
              css={{
                fontSize: "0.625rem",
                fontWeight: 700,
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
                fontWeight: 700,
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
                fontWeight: 700,
                padding: "0.125rem 0.5rem",
                borderRadius: "9999px",
                border: `1px solid ${C.danger}33`,
                background: `${C.danger}0d`,
                color: C.danger,
              }}
            >
              Debug
            </span>
          </div>
        </div>
        <div css={S.chevronWrapper(isOpen)}>
          <ChevronDown size={16} color={C.muted} />
        </div>
      </div>

      {/* ── Body ── */}
      {isOpen && (
        <div css={S.cardBody}>
          {/* LOCKED: no code shown */}
          {isLocked ? (
            <div css={[S.bodyInner, { paddingTop: "1.25rem" }]}>
              <div
                css={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1.5rem",
                  background: `${C.danger}08`,
                  border: `1px solid ${C.danger}22`,
                  borderRadius: "0.75rem",
                  textAlign: "center",
                }}
              >
                <Lock size={22} color={C.danger} />
                <div>
                  <p
                    css={{
                      fontWeight: 800,
                      fontSize: "0.9375rem",
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
                  css={Shared.primaryBtn(C.danger)}
                  style={{ width: "auto", padding: "0.5rem 1.5rem" }}
                  onClick={onPaywall}
                >
                  <Zap size={13} /> Upgrade to Pro
                </button>
              </div>
            </div>
          ) : (
            <div css={S.bodyInner}>
              {/* Bug description */}
              {q.question && (
                <div css={S.descriptionBox}>
                  <AlertTriangle
                    size={14}
                    color={C.danger}
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  <p
                    css={{
                      fontSize: "0.875rem",
                      color: "#e8c8c8",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {q.question}
                  </p>
                </div>
              )}

              {/* Broken code reference */}
              <div>
                <p css={S.sectionLabel(C.danger)}>🔴 Broken Code</p>
                <pre css={Shared.codeBlock(`${C.danger}4d`)}>
                  <code>{q.brokenCode || q.code}</code>
                </pre>
              </div>

              {/* Editable fix */}
              <div>
                <p css={S.sectionLabel(C.accent3)}>
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
                {/* AI check button — handles all three states: pro, free+loggedIn, not logged in */}
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
                        AI is checking...
                      </>
                    ) : (
                      <>
                        <Zap size={13} /> Check with AI
                      </>
                    )}
                  </button>
                ) : isLoggedIn ? (
                  /* Logged in but free — show paywall */
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
                  /* Not logged in — sign in first */
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
                  <button css={Shared.actionBtn(C.muted)} onClick={hideReveal}>
                    <EyeOff size={13} /> Hide Answer
                  </button>
                )}
                {(uiPhase === "feedback" || showReveal && !isSolvedQ) && (
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
                          <CheckCircle size={15} color={C.accent3} />
                        ) : (
                          <XCircle size={15} color={C.danger} />
                        )}
                        <p css={{ fontWeight: 700, fontSize: "0.875rem" }}>
                          {feedback.verdict}
                        </p>
                      </div>
                      <div css={S.scoreBarTrack}>
                        <div
                          css={S.scoreBarFill(
                            feedback.score * 10,
                            feedback.correct
                              ? C.accent3
                              : feedback.score >= 5
                                ? C.accent2
                                : C.danger,
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div css={S.feedbackRow}>
                    <p css={S.feedbackRowTitle(C.accent3)}>
                      ✓ What you got right
                    </p>
                    <p css={S.feedbackRowText}>{feedback.whatTheyGotRight}</p>
                  </div>
                  {feedback.remainingIssues !== "None" && (
                    <div css={S.feedbackRow}>
                      <p css={S.feedbackRowTitle(C.danger)}>
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
                          color: C.accent2,
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

              {/* Revealed: side-by-side diff */}
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
                      <p css={S.diffLabel(C.danger)}>❌ Broken</p>
                      <pre
                        css={Shared.codeBlock(`${C.danger}4d`)}
                        style={{ maxHeight: "13rem", overflow: "auto" }}
                      >
                        <code>{q.brokenCode || q.code}</code>
                      </pre>
                    </div>
                    <div>
                      <p css={S.diffLabel(C.accent3)}>✅ Fixed</p>
                      <pre
                        css={Shared.codeBlock(`${C.accent3}4d`)}
                        style={{ maxHeight: "13rem", overflow: "auto" }}
                      >
                        <code css={{ color: C.accent3 }}>{q.fixedCode}</code>
                      </pre>
                    </div>
                  </div>
                  <div css={S.revealCard}>
                    <p
                      css={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: C.danger,
                        marginBottom: "0.375rem",
                      }}
                    >
                      🐛 The Bug
                    </p>
                    <p
                      css={{
                        fontSize: "0.75rem",
                        color: C.text,
                        marginBottom: "0.75rem",
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
                        color: C.text,
                        marginBottom: q.keyInsight ? "0.75rem" : 0,
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
                            color: C.accent2,
                            marginBottom: "0.375rem",
                          }}
                        >
                          ⚡ Key Insight
                        </p>
                        <p css={{ fontSize: "0.75rem", color: C.text }}>
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

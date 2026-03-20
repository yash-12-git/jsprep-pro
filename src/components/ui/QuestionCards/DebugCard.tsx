/** @jsxImportSource @emotion/react */
"use client";

/**
 * src/components/ui/QuestionCards/DebugCard.tsx
 *
 * Fixes applied:
 * 1. Detects API-dependent code (fetch, DOM, etc.) — shows a warning
 *    instead of running, so "no output" confusion is gone.
 * 2. Normalizes AI response — handles both response shapes the AI may return.
 * 3. Shows the correct AI score and verdict, never "0/10 Evaluation failed".
 */

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
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
  Play,
  Send,
  AlertTriangle,
} from "lucide-react";
import { css } from "@emotion/react";
import * as Shared from "@/styles/shared";
import { C } from "@/styles/tokens";
import * as S from "./styles";
import type { Question } from "@/types/question";
import type { RunResult } from "@/lib/codeRunner";

const CodeEditor = dynamic(
  () => import("@/components/ui/CodeEditor/CodeEditor"),
  { ssr: false },
);
const CodeConsole = dynamic(
  () => import("@/components/ui/CodeEditor/CodeConsole"),
  { ssr: false },
);

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

/**
 * Normalize whatever shape the AI returns into AIFeedback.
 * The AI sometimes returns {strengths, missing, betterAnswer, grade} instead
 * of our expected {whatTheyGotRight, remainingIssues, betterApproach}.
 */
function normalizeAIResponse(raw: any): AIFeedback {
  const score = typeof raw.score === "number" ? raw.score : 0;
  return {
    correct: raw.correct ?? score >= 6,
    score,
    verdict: raw.verdict ?? raw.grade ?? "",
    whatTheyGotRight:
      raw.whatTheyGotRight ??
      (Array.isArray(raw.strengths)
        ? raw.strengths.join(". ")
        : (raw.strengths ?? "")),
    remainingIssues:
      raw.remainingIssues ??
      (Array.isArray(raw.missing)
        ? raw.missing.join(". ")
        : (raw.missing ?? "")),
    betterApproach: raw.betterApproach ?? raw.betterAnswer ?? null,
    hint: raw.hint ?? "",
    explanation: raw.explanation ?? "",
  };
}

type UIPhase = "editing" | "running" | "checking" | "feedback";

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
  isOpen?: boolean;
  onToggle?: () => void;
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
  isOpen: controlledOpen,
  onToggle,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [userCode, setUserCode] = useState(q.brokenCode ?? q.code ?? "");
  const [uiPhase, setUiPhase] = useState<UIPhase>("editing");
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [runWarning, setRunWarning] = useState<string | null>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const toggle = onToggle ?? (() => setInternalOpen((o) => !o));

  const brokenCode = q.brokenCode ?? q.code ?? "";
  const persistedSolved = isSolved(q.id);
  const hasEdited = userCode.trim() !== brokenCode.trim();
  const isSolvedQ = feedback?.correct || persistedSolved;
  const ds = S.DIFF_STYLE[q.difficulty] ?? S.DIFF_STYLE.core;
  const catStyle = (S as any).CAT_STYLE?.[q.category] ?? {
    color: C.muted,
    bg: C.bgSubtle,
    border: C.border,
  };

  const editorHeight = (code: string) =>
    Math.min(Math.max(code.split("\n").length * 19 + 24, 120), 400);

  const handleRun = useCallback(async () => {
    const { codeUsesUnsupportedAPIs, runCode } =
      await import("@/lib/codeRunner");
    const blocked = codeUsesUnsupportedAPIs(userCode);
    if (blocked) {
      // Don't attempt to run — show a contextual warning instead
      setRunWarning(
        `This code uses "${blocked}" which requires a real server/browser environment and can't be run here. Fix the bug directly and use Submit Fix for AI evaluation.`,
      );
      return;
    }
    setRunWarning(null);
    setUiPhase("running");
    setRunResult(null);
    const result = await runCode(userCode);
    setRunResult(result);
    setUiPhase("editing");
  }, [userCode]);

  async function submitFix() {
    if (!isPro || !isLoggedIn) {
      onPaywall?.();
      return;
    }
    if (!hasEdited) return;

    setUiPhase("checking");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "debugcheck",
          messages: [
            {
              role: "user",
              content: `I fixed this buggy code:\n\n\`\`\`js\n${userCode}\n\`\`\``,
            },
          ],
          context: {
            questionTitle: q.title,
            bugDescription: q.bugDescription ?? "",
            brokenCode,
            fixedCode: q.fixedCode ?? "",
            userFix: userCode,
          },
        }),
      });
      const data = await res.json();

      // API returns { text: "```json\n{...}\n```" } or { result: {...} }
      // Extract the string from whichever field it arrives in
      let raw: any = data.result ?? data.text ?? data;
      if (typeof raw === "string") {
        // Strip markdown code fences if present
        const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
        const braced = raw.match(/({[\s\S]*})/);
        const jsonStr =
          fenced?.[1]?.trim() ?? braced?.[1]?.trim() ?? raw.trim();
        try {
          raw = JSON.parse(jsonStr);
        } catch {
          /* leave as string */
        }
      }

      const fb = normalizeAIResponse(raw);
      setFeedback(fb);
      if (fb.correct && isPro && !persistedSolved)
        recordSolved(q.id).catch(() => {});
    } catch (err: any) {
      // Show a real error, never "Could not reach AI" when the actual problem differs
      setFeedback({
        correct: false,
        score: 0,
        verdict: "Evaluation failed.",
        whatTheyGotRight: "",
        remainingIssues: err?.message ?? "Could not reach AI.",
        betterApproach: null,
        hint: "",
        explanation: "",
      });
    } finally {
      setUiPhase("feedback");
    }
  }

  function revealAnswer() {
    setShowReveal(true);
    if (!persistedSolved && !isRevealed(q.id) && isPro)
      recordRevealed(q.id).catch(() => {});
  }

  function reset() {
    setUserCode(brokenCode);
    setFeedback(null);
    setShowReveal(false);
    setRunResult(null);
    setRunWarning(null);
    setUiPhase("editing");
  }

  const highlight: S.CardHighlight = isSolvedQ
    ? "correct"
    : showReveal
      ? "revealed"
      : feedback && !feedback.correct
        ? "wrong"
        : "idle";

  return (
    <div css={S.questionCard(highlight, C.red)}>
      <div css={S.cardHeader} onClick={toggle}>
        <span css={S.qNumber(C.red)}>
          #{String(index + 1).padStart(2, "00")}
        </span>
        <div css={{ flex: 1, minWidth: 0 }}>
          <div
            css={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div>
              <div
                css={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  marginBottom: "0.375rem",
                }}
              >
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
                    border: `1px solid ${catStyle.border}`,
                    background: catStyle.bg,
                    color: catStyle.color,
                  }}
                >
                  {q.category}
                </span>
                {!isPro && <span css={S.proBadge}>PRO</span>}
              </div>
              <p
                css={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: C.text,
                  lineHeight: 1.4,
                }}
              >
                {q.title}
              </p>
            </div>
            <div
              css={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
              }}
            >
              {isLocked && <Lock size={12} color={C.muted} />}
              {isSolvedQ && <CheckCircle size={14} color={C.green} />}
              {showReveal && !isSolvedQ && <Eye size={14} color={C.amber} />}
              {feedback && !feedback.correct && (
                <XCircle size={14} color={C.red} />
              )}
              <div css={S.chevronWrapper(isOpen)}>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div css={S.cardBody}>
          {isLocked ? (
            <div css={{ padding: "1rem" }}>
              <div css={S.lockedBox}>
                <Lock size={14} color={C.muted} />
                <div css={{ flex: 1 }}>
                  <p
                    css={{
                      fontSize: "0.875rem",
                      color: C.text,
                      fontWeight: 600,
                      marginBottom: "0.25rem",
                    }}
                  >
                    Unlock debug questions
                  </p>
                  <p
                    css={{
                      fontSize: "0.75rem",
                      color: C.muted,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Pro unlocks all {q.category} challenges.
                  </p>
                </div>
                <button
                  css={Shared.primaryBtn(C.accent)}
                  onClick={onPaywall}
                  style={{ whiteSpace: "nowrap" }}
                >
                  <Zap size={12} /> Upgrade
                </button>
              </div>
            </div>
          ) : (
            <>
              {q.bugDescription && (
                <div css={{ padding: "0.75rem 1rem 0" }}>
                  <div css={bugBanner}>
                    <span css={bugLabel}>🐛 Bug</span>
                    <span css={bugText}>{q.bugDescription}</span>
                  </div>
                </div>
              )}

              <div css={{ padding: "0.75rem 1rem 0" }}>
                <div css={toolbar}>
                  <span css={toolbarLabel}>
                    Fix the code
                    {hasEdited && <span css={editedDot} title="Modified" />}
                  </span>
                  <div css={{ display: "flex", gap: 6 }}>
                    <button
                      css={[tbBtn, tbRun]}
                      onClick={handleRun}
                      disabled={uiPhase === "running" || uiPhase === "checking"}
                      title="Run in sandbox"
                    >
                      {uiPhase === "running" ? (
                        <>
                          <Loader2 size={12} css={spinCss} /> Running…
                        </>
                      ) : (
                        <>
                          <Play size={12} /> Run
                        </>
                      )}
                    </button>
                    <button
                      css={tbBtn}
                      onClick={reset}
                      title="Reset to original broken code"
                    >
                      <RotateCcw size={12} /> Reset
                    </button>
                  </div>
                </div>

                {/* API warning — shown instead of console when code can't run in sandbox */}
                {runWarning ? (
                  <div css={apiWarning}>
                    <AlertTriangle
                      size={13}
                      css={{ flexShrink: 0, marginTop: 1 }}
                    />
                    <span>{runWarning}</span>
                  </div>
                ) : null}

                <CodeEditor
                  value={userCode}
                  onChange={setUserCode}
                  readOnly={false}
                  height={editorHeight(userCode)}
                />
                {!runWarning && (
                  <CodeConsole
                    result={runResult}
                    running={uiPhase === "running"}
                  />
                )}
              </div>

              <div css={S.inputSection} style={{ paddingTop: "0.75rem" }}>
                <div css={S.actionRow}>
                  {isPro ? (
                    <button
                      css={Shared.primaryBtn(isSolvedQ ? C.green : C.red)}
                      onClick={submitFix}
                      disabled={
                        !hasEdited ||
                        uiPhase === "checking" ||
                        uiPhase === "running"
                      }
                    >
                      {uiPhase === "checking" ? (
                        <>
                          <Loader2 size={12} css={spinCss} /> Checking…
                        </>
                      ) : (
                        <>
                          <Send size={12} /> Submit Fix
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      css={Shared.primaryBtn(C.accent)}
                      onClick={onPaywall}
                    >
                      <Zap size={12} /> Upgrade to Submit Fix
                    </button>
                  )}
                  {!showReveal ? (
                    <button
                      css={Shared.actionBtn(C.muted)}
                      onClick={revealAnswer}
                    >
                      <Eye size={12} /> Show Answer
                    </button>
                  ) : (
                    <button
                      css={Shared.actionBtn(C.muted)}
                      onClick={() => setShowReveal(false)}
                    >
                      <EyeOff size={12} /> Hide Answer
                    </button>
                  )}
                </div>
                {!hasEdited && uiPhase !== "checking" && (
                  <p
                    css={{
                      fontSize: "0.75rem",
                      color: C.muted,
                      marginTop: "0.5rem",
                    }}
                  >
                    Edit the code above to enable Submit Fix
                  </p>
                )}
              </div>

              {uiPhase === "feedback" && feedback && (
                <div css={{ padding: "0 1rem 1rem" }}>
                  <div css={S.feedbackBox(feedback.correct)}>
                    <div css={S.scoreRow}>
                      <span
                        css={S.scoreNumber(feedback.correct, feedback.score)}
                      >
                        {feedback.score}
                      </span>
                      <span css={S.scoreDenom}>/10</span>
                      <div
                        css={S.scoreBarTrack}
                        style={{ flex: 1, marginLeft: "0.75rem" }}
                      >
                        <div
                          css={S.scoreBarFill(
                            feedback.score * 10,
                            feedback.correct ? C.green : C.red,
                          )}
                        />
                      </div>
                    </div>
                    {feedback.verdict && (
                      <p
                        css={{
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: C.text,
                          marginBottom: "0.5rem",
                        }}
                      >
                        {feedback.verdict}
                      </p>
                    )}
                    {feedback.whatTheyGotRight && (
                      <div css={S.feedbackRow}>
                        <p css={S.feedbackRowTitle(C.green)}>
                          ✓ What you got right
                        </p>
                        <p css={S.feedbackRowText}>
                          {feedback.whatTheyGotRight}
                        </p>
                      </div>
                    )}
                    {feedback.remainingIssues && (
                      <div css={S.feedbackRow}>
                        <p css={S.feedbackRowTitle(C.red)}>
                          ⚠ Remaining issues
                        </p>
                        <p css={S.feedbackRowText}>
                          {feedback.remainingIssues}
                        </p>
                      </div>
                    )}
                    {feedback.betterApproach && (
                      <div css={S.feedbackRow}>
                        <p css={S.feedbackRowTitle(C.accent)}>
                          💡 Better approach
                        </p>
                        <p css={S.feedbackRowText}>{feedback.betterApproach}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {showReveal && (
                <div css={{ padding: "0 1rem 1rem" }}>
                  {q.fixedCode && (
                    <div css={S.explanationBox}>
                      <p css={S.explanationTitle(C.green)}>✓ Fixed Code</p>
                      <div css={{ marginTop: "0.5rem" }}>
                        <CodeEditor
                          value={q.fixedCode}
                          readOnly
                          height={editorHeight(q.fixedCode)}
                        />
                      </div>
                    </div>
                  )}
                  {q.explanation && (
                    <div css={[S.explanationBox, { marginTop: "0.75rem" }]}>
                      <p css={S.explanationTitle(C.accent)}>💡 Explanation</p>
                      <p css={S.explanationText}>{q.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

const bugBanner = css`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  background: ${C.redSubtle};
  border: 1px solid ${C.redBorder};
  border-radius: 6px;
  margin-bottom: 4px;
`;
const bugLabel = css`
  font-size: 11.5px;
  font-weight: 700;
  color: ${C.red};
  white-space: nowrap;
  margin-top: 1px;
`;
const bugText = css`
  font-size: 13px;
  color: ${C.text};
  line-height: 1.55;
`;
const toolbar = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;
const toolbarLabel = css`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${C.muted};
  font-family: "JetBrains Mono", monospace;
`;
const editedDot = css`
  width: 6px;
  height: 6px;
  background: ${C.amber};
  border-radius: 50%;
  display: inline-block;
`;
const tbBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border: 1px solid ${C.border};
  border-radius: 5px;
  background: transparent;
  color: ${C.muted};
  font-size: 11.5px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  &:hover:not(:disabled) {
    background: ${C.surface};
    border-color: ${C.borderHover};
    color: ${C.text};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const tbRun = css`
  color: ${C.green};
  border-color: ${C.greenBorder};
  background: ${C.greenSubtle};
  &:hover:not(:disabled) {
    opacity: 0.85;
  }
`;
const spinCss = css`
  animation: spin 0.8s linear infinite;
`;
const apiWarning = css`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 12.5px;
  color: ${C.text};
  line-height: 1.55;
  svg {
    color: ${C.amber};
  }
`;

/** @jsxImportSource @emotion/react */
"use client";

/**
 * src/components/ui/QuestionCards/OutputCard.tsx
 *
 * Fixes applied:
 * - checkAnswer compares textarea against originalExpectedOut (always),
 *   but when user has run edited code, shows a note clarifying the
 *   prediction should be for the ORIGINAL code.
 * - "Edit & Run" mode clearly labelled as exploration mode.
 */

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  ChevronDown,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Lightbulb,
  Lock,
  Zap,
  RotateCcw,
  Play,
  Code2,
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

type AnswerState = "idle" | "correct" | "wrong" | "revealed";

interface Props {
  q: Question;
  index: number;
  isSolved: (id: string) => boolean;
  isRevealed: (id: string) => boolean;
  recordSolved: (id: string) => Promise<void>;
  recordRevealed: (id: string) => Promise<void>;
  isLocked?: boolean;
  onPaywall?: () => void;
  isPro: boolean;
}

export default function OutputCard({
  q,
  index,
  isSolved,
  isRevealed,
  recordSolved,
  recordRevealed,
  isLocked = false,
  onPaywall,
  isPro,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [localWrong, setLocalWrong] = useState(false);
  const [localRevealed, setLocalRevealed] = useState(false);
  const [manuallyReset, setManuallyReset] = useState(false);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");

  const [monacoMode, setMonacoMode] = useState<"readonly" | "edit">("readonly");
  const [editedCode, setEditedCode] = useState(q.code ?? "");
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  const state: AnswerState =
    !manuallyReset && (isSolved(q.id) || answerState === "correct")
      ? "correct"
      : localRevealed || (!manuallyReset && isRevealed(q.id))
        ? "revealed"
        : localWrong
          ? "wrong"
          : "idle";

  // Always compare against the ORIGINAL question's expected output,
  // not whatever the user may have edited and run.
  const originalExpectedOut = q.expectedOutput ?? q.answer ?? "";
  const ds = S.DIFF_STYLE[q.difficulty] ?? S.DIFF_STYLE.core;

  const handleRun = useCallback(async () => {
    setRunning(true);
    setRunResult(null);
    const { runCode, codeUsesUnsupportedAPIs } =
      await import("@/lib/codeRunner");
    const blocked = codeUsesUnsupportedAPIs(editedCode);
    if (blocked) {
      setRunResult({
        output: [],
        error: `Cannot run: "${blocked}" requires a real browser/server environment.`,
        timed_out: false,
      });
      setRunning(false);
      return;
    }
    const result = await runCode(editedCode);
    setRunResult(result);
    setRunning(false);
  }, [editedCode]);

  // ── Error-output detection ────────────────────────────────────────────────
  // Questions where the answer is an error/exception need concept-based matching
  // not exact string matching — we test understanding, not memorization.
  const ERROR_PATTERNS = [
    "ReferenceError",
    "TypeError",
    "SyntaxError",
    "RangeError",
    "Cannot access",
    "is not defined",
    "Cannot read propert",
    "is not a function",
    "Maximum call stack",
    "Assignment to constant",
  ];

  const isErrorQuestion = ERROR_PATTERNS.some((p) =>
    originalExpectedOut.includes(p),
  );

  // Keywords that signal the user understands the error concept
  const ERROR_CONCEPT_KEYWORDS: Record<string, string[]> = {
    ReferenceError: [
      "referenceerror",
      "reference error",
      "not defined",
      "tdz",
      "temporal",
      "hoisting",
    ],
    "Cannot access": [
      "tdz",
      "temporal dead zone",
      "referenceerror",
      "reference error",
      "before initialization",
      "let",
      "const",
      "hoisting",
      "block",
    ],
    TypeError: [
      "typeerror",
      "type error",
      "not a function",
      "cannot read",
      "undefined",
      "null",
    ],
    "is not defined": [
      "referenceerror",
      "reference error",
      "not defined",
      "undeclared",
      "hoisting",
    ],
    SyntaxError: ["syntaxerror", "syntax error", "invalid", "unexpected"],
    "is not a function": [
      "typeerror",
      "type error",
      "not a function",
      "undefined",
    ],
    "Cannot read propert": [
      "typeerror",
      "type error",
      "null",
      "undefined",
      "cannot read",
    ],
    "Maximum call stack": [
      "stack overflow",
      "infinite",
      "recursion",
      "call stack",
      "rangeerror",
    ],
    "Assignment to constant": [
      "typeerror",
      "const",
      "constant",
      "reassign",
      "cannot assign",
    ],
  };

  function conceptMatches(userAnswer: string): boolean {
    const ua = userAnswer.toLowerCase();
    for (const [pattern, keywords] of Object.entries(ERROR_CONCEPT_KEYWORDS)) {
      if (originalExpectedOut.includes(pattern)) {
        if (keywords.some((k) => ua.includes(k))) return true;
      }
    }
    return false;
  }

  async function checkAnswer() {
    const ua = answer.toLowerCase().trim();
    const correct = originalExpectedOut.toLowerCase().trim();

    // Exact match always works
    const exactMatch =
      ua === correct ||
      ua.split("\n").join(",") === correct.split("\n").join(",");

    // For error questions: concept-based match is enough
    const conceptMatch = isErrorQuestion && conceptMatches(answer);

    const match = exactMatch || conceptMatch;

    if (match) {
      !isSolved(q.id) && isPro && (await recordSolved(q.id));
      setLocalWrong(false);
      setManuallyReset(false);
      setAnswerState("correct");
    } else {
      setLocalWrong(true);
      setAnswerState("wrong");
    }
  }

  function reveal() {
    setLocalRevealed(true);
    setLocalWrong(false);
    if (!isSolved(q.id) && !isRevealed(q.id) && isPro)
      recordRevealed(q.id).catch(() => {});
  }
  function hideAnswer() {
    setLocalRevealed(false);
    setManuallyReset(true);
  }
  function reset() {
    setAnswer("");
    setLocalWrong(false);
    setLocalRevealed(false);
    setManuallyReset(true);
    setAnswerState("idle");
    setMonacoMode("readonly");
    setEditedCode(q.code ?? "");
    setRunResult(null);
  }

  const highlight: S.CardHighlight =
    state === "correct"
      ? "correct"
      : state === "wrong"
        ? "wrong"
        : state === "revealed"
          ? "revealed"
          : "idle";

  const editorHeight = (code: string) =>
    Math.min(Math.max(code.split("\n").length * 19 + 24, 80), 320);

  return (
    <div css={S.questionCard(highlight, C.amber)}>
      <div css={S.cardHeader} onClick={() => setIsOpen((o) => !o)}>
        <span css={S.qNumber(C.amber)}>
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
            {state === "correct" && <CheckCircle size={14} color={C.green} />}
            {state === "revealed" && <Eye size={14} color={C.amber} />}
            {state === "wrong" && <XCircle size={14} color={C.red} />}
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
                border: `1px solid ${C.border}`,
                background: C.bgSubtle,
                color: C.muted,
              }}
            >
              {q.category}
            </span>
          </div>
        </div>
        <div css={S.chevronWrapper(isOpen)}>
          <ChevronDown size={16} />
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
                    Unlock all output questions
                  </p>
                  <p
                    css={{
                      fontSize: "0.75rem",
                      color: C.muted,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Pro unlocks all questions.
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
              <div css={{ padding: "1rem 1rem 0" }}>
                {/* Toolbar */}
                <div css={toolbar}>
                  <span css={toolbarLabel}>Code</span>
                  <div css={{ display: "flex", gap: 6 }}>
                    {monacoMode === "readonly" ? (
                      <button
                        css={tbBtn}
                        onClick={() => {
                          setMonacoMode("edit");
                          setRunResult(null);
                        }}
                        title="Explore: edit and run the code"
                      >
                        <Code2 size={12} /> Edit &amp; Run
                      </button>
                    ) : (
                      <>
                        <button
                          css={[tbBtn, tbRun]}
                          onClick={handleRun}
                          disabled={running}
                        >
                          <Play size={12} /> {running ? "Running…" : "Run"}
                        </button>
                        <button
                          css={tbBtn}
                          onClick={() => {
                            setMonacoMode("readonly");
                            setEditedCode(q.code ?? "");
                            setRunResult(null);
                          }}
                        >
                          <RotateCcw size={12} /> Restore
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Exploration mode notice */}
                {monacoMode === "edit" && (
                  <div css={explorationBanner}>
                    💡 Exploration mode — edit freely. Your prediction below
                    should still be for the <strong>original</strong> code.
                  </div>
                )}

                <CodeEditor
                  value={
                    monacoMode === "readonly" ? (q.code ?? "") : editedCode
                  }
                  onChange={setEditedCode}
                  readOnly={monacoMode === "readonly"}
                  height={editorHeight(
                    monacoMode === "readonly" ? (q.code ?? "") : editedCode,
                  )}
                />
                <CodeConsole result={runResult} running={running} />
              </div>

              {/* Answer */}
              <div css={S.inputSection}>
                {/* Label changes based on question type */}
                <p css={S.sectionLabel()}>
                  {isErrorQuestion ? (
                    <>
                      What happens when this code runs?{" "}
                      <span
                        css={{
                          textTransform: "none",
                          letterSpacing: 0,
                          fontWeight: 400,
                          color: C.muted,
                        }}
                      >
                        describe the error type or behaviour
                      </span>
                    </>
                  ) : (
                    <>
                      Your prediction{" "}
                      <span
                        css={{
                          textTransform: "none",
                          letterSpacing: 0,
                          fontWeight: 400,
                          color: C.muted,
                        }}
                      >
                        (one output per line)
                      </span>
                    </>
                  )}
                </p>

                {/* When editor ran and produced an error, note it's the error to predict */}
                {isErrorQuestion &&
                  runResult?.error &&
                  monacoMode === "edit" && (
                    <div css={runErrorNote}>
                      ↑ That's the error this code throws. Now describe it in
                      your own words below.
                    </div>
                  )}

                <textarea
                  value={
                    state === "correct"
                      ? isErrorQuestion
                        ? "Correct ✓"
                        : originalExpectedOut
                      : answer
                  }
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={state === "correct"}
                  placeholder={
                    isErrorQuestion
                      ? 'e.g. "ReferenceError — x is in TDZ because let is hoisted but not initialized"'
                      : "Type the expected output...\nOne value per line"
                  }
                  rows={
                    isErrorQuestion
                      ? 2
                      : Math.max(3, originalExpectedOut.split("\n").length + 1)
                  }
                  css={Shared.textarea(state === "wrong" ? C.red : C.amber)}
                  style={{ opacity: state === "correct" ? 0.6 : 1 }}
                />

                {state === "idle" && (
                  <div css={S.actionRow}>
                    <button
                      css={Shared.primaryBtn(C.amber)}
                      onClick={checkAnswer}
                      disabled={!answer.trim()}
                    >
                      ✓ Check Answer
                    </button>
                    <button css={Shared.actionBtn(C.muted)} onClick={reveal}>
                      <Lightbulb size={12} /> Reveal
                    </button>
                  </div>
                )}
                {state === "wrong" && (
                  <div css={S.actionRow}>
                    <button
                      css={Shared.primaryBtn(C.red)}
                      onClick={checkAnswer}
                      disabled={!answer.trim()}
                    >
                      Try Again
                    </button>
                    <button css={Shared.actionBtn(C.muted)} onClick={reveal}>
                      <Lightbulb size={12} /> Show Answer
                    </button>
                  </div>
                )}
                {state === "revealed" && (
                  <div css={S.actionRow}>
                    <button
                      css={Shared.actionBtn(C.muted)}
                      onClick={hideAnswer}
                    >
                      <EyeOff size={12} /> Hide Answer
                    </button>
                    <button css={Shared.actionBtn(C.muted)} onClick={reset}>
                      <RotateCcw size={12} /> Try Again
                    </button>
                  </div>
                )}
                {state === "correct" && (
                  <button css={S.resetLink} onClick={reset}>
                    <RotateCcw
                      size={11}
                      style={{ display: "inline", marginRight: 4 }}
                    />{" "}
                    Reset
                  </button>
                )}
              </div>

              {(state === "correct" || state === "revealed") && (
                <div css={{ padding: "0 1rem 1rem" }}>
                  <div css={S.explanationBox}>
                    <div
                      css={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {state === "correct" ? (
                        <>
                          <CheckCircle size={14} color={C.green} />
                          <span css={S.explanationTitle(C.green)}>
                            Correct! 🎉
                          </span>
                        </>
                      ) : (
                        <span css={S.explanationTitle(C.muted)}>
                          {isErrorQuestion
                            ? "What this code throws:"
                            : "Expected Output:"}
                        </span>
                      )}
                    </div>
                    <pre
                      css={Shared.codeBlock(
                        isErrorQuestion ? C.redBorder : C.greenBorder,
                      )}
                    >
                      <code css={{ color: isErrorQuestion ? C.red : C.green }}>
                        {originalExpectedOut}
                      </code>
                    </pre>
                    {isErrorQuestion && state !== "correct" && (
                      <p
                        css={{
                          fontSize: "12px",
                          color: C.muted,
                          marginTop: "8px",
                          lineHeight: 1.5,
                        }}
                      >
                        💡 Exact wording isn't required — understanding{" "}
                        <em>why</em> this error occurs is what matters.
                      </p>
                    )}
                  </div>
                  {q.explanation && (
                    <div css={[S.explanationBox, { marginTop: "0.75rem" }]}>
                      <p css={S.explanationTitle(C.accent)}>💡 Explanation</p>
                      <p css={S.explanationText}>{q.explanation}</p>
                      {q.keyInsight && (
                        <div css={S.insightRow}>
                          <p css={S.explanationTitle(C.amber)}>
                            ⚡ Key Insight
                          </p>
                          <p css={S.explanationText}>{q.keyInsight}</p>
                        </div>
                      )}
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

const toolbar = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;
const toolbarLabel = css`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${C.muted};
  font-family: "JetBrains Mono", monospace;
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
const explorationBanner = css`
  font-size: 12px;
  color: ${C.muted};
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: 5px;
  padding: 6px 10px;
  margin-bottom: 6px;
  line-height: 1.5;
  strong {
    color: ${C.text};
    font-weight: 600;
  }
`;

const runErrorNote = css`
  font-size: 12px;
  color: ${C.amber};
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
  border-radius: 5px;
  padding: 6px 10px;
  margin-bottom: 8px;
  line-height: 1.5;
`;

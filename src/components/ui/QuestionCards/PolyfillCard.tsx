/** @jsxImportSource @emotion/react */
"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  ChevronDown,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Play,
  RotateCcw,
  Building2,
  Lock,
  Zap,
  FlaskConical,
} from "lucide-react";
import { css } from "@emotion/react";
import * as Shared from "@/styles/shared";
import { C } from "@/styles/tokens";
import type { PolyfillQuestion } from "@/data/polyfillQuestions";
import type { RunResult } from "@/lib/codeRunner";
import { Question } from "@/types/question";

const CodeEditor = dynamic(
  () => import("@/components/ui/CodeEditor/CodeEditor"),
  { ssr: false },
);
const CodeConsole = dynamic(
  () => import("@/components/ui/CodeEditor/CodeConsole"),
  { ssr: false },
);

interface TestResult {
  name: string;
  passed: boolean;
  detail?: string;
}

function parseTestResults(output: string[]): TestResult[] {
  return output.map((line) => {
    const passed = line.startsWith("PASS:");
    const name = line
      .replace(/^(PASS|FAIL):\s*/, "")
      .split(" — ")[0]
      .trim();
    const detail = line.includes(" — ")
      ? line.split(" — ").slice(1).join(" — ")
      : undefined;
    return { name, passed, detail };
  });
}

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

export default function PolyfillCard({
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
  const [userCode, setUserCode] = useState(q.code || "");
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [manuallyReset, setManuallyReset] = useState(false);

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const allPassed = !manuallyReset && isSolved(q.id);
  const anyFailed = hasRun && testResults.some((r) => !r.passed);
  const passCount = testResults.filter((r) => r.passed).length;

  const ds =
    q.difficulty === "beginner"
      ? {
          bg: C.greenSubtle,
          border: C.greenBorder,
          color: C.green,
          label: "Easy",
        }
      : q.difficulty === "core"
        ? {
            bg: C.amberSubtle,
            border: C.amberBorder,
            color: C.amber,
            label: "Medium",
          }
        : { bg: C.redSubtle, border: C.redBorder, color: C.red, label: "Hard" };

  const handleRunTests = useCallback(async () => {
    setRunning(true);
    setRunResult(null);
    setTestResults([]);
    setHasRun(false);
    try {
      const { runCode } = await import("@/lib/codeRunner");
      const fullCode = userCode + "\n\n" + q.testCode;
      const result = await runCode(fullCode);
      setRunResult(result);
      setHasRun(true);
      if (result.output.length > 0)
        setTestResults(parseTestResults(result.output));
      if (
        parseTestResults(result.output).every((r) => r.passed) &&
        !isSolved(q.id) &&
        isPro
      ) {
        setManuallyReset(false);
        recordSolved(q.id).catch(() => {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  }, [userCode, q.testCode]);

  function handleReset() {
    setUserCode(q.code ?? "");
    setRunResult(null);
    setTestResults([]);
    setManuallyReset(true);
    setHasRun(false);
    setShowSolution(false);
  }

  const editorH = (code: string) =>
    Math.min(Math.max(code.split("\n").length * 19 + 24, 120), 400);

  return (
    <div css={card(allPassed ? "pass" : anyFailed ? "fail" : "idle")}>
      {/* Header */}
      <div css={cardHeader} onClick={() => setIsOpen((o) => !o)}>
        <span css={qNum}>#{String(index + 1).padStart(2, "0")}</span>
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
            {allPassed && <CheckCircle size={14} color={C.green} />}
            {isRevealed(q.id) && <Eye size={14} color={C.amber} />}
            {anyFailed && <XCircle size={14} color={C.red} />}
          </div>
          <div
            css={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              alignItems: "center",
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
              {ds.label}
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
            {hasRun && (
              <span
                css={{
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                  border: `1px solid ${allPassed ? C.greenBorder : C.redBorder}`,
                  background: allPassed ? C.greenSubtle : C.redSubtle,
                  color: allPassed ? C.green : C.red,
                }}
              >
                {passCount}/{testResults.length} tests
              </span>
            )}
            {!!q?.companies?.length && (
              <div
                css={{ display: "inline-flex", alignItems: "center", gap: 4 }}
              >
                <Building2 size={10} css={{ color: C.muted }} />
                {q.companies?.slice(0, 3).map((c) => (
                  <span key={c} css={chip}>
                    {c}
                  </span>
                ))}
                {!!q?.companies?.length && q.companies.length > 3 && (
                  <span css={chip}>+{q.companies.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div
          css={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            color: C.muted,
          }}
        >
          <ChevronDown size={16} />
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div css={{ borderTop: `1px solid ${C.border}` }}>
          {isLocked ? (
            <div
              css={{
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                background: C.bgSubtle,
                borderRadius: "0 0 0.75rem 0.75rem",
              }}
            >
              <Lock size={14} color={C.muted} />
              <span css={{ fontSize: "0.875rem", color: C.muted, flex: 1 }}>
                Pro feature — upgrade to unlock all polyfill challenges
              </span>
              <button css={Shared.primaryBtn(C.accent)} onClick={onPaywall}>
                <Zap size={12} /> Upgrade
              </button>
            </div>
          ) : (
            <>
              {/* Company banner */}
              {!!q?.companies?.length && (
                <div
                  css={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    background: C.bgSubtle,
                    borderBottom: `1px solid ${C.border}`,
                    flexWrap: "wrap",
                  }}
                >
                  <Building2 size={11} css={{ color: C.accent }} />
                  <span
                    css={{ fontSize: "11px", color: C.muted, fontWeight: 500 }}
                  >
                    Asked at:
                  </span>
                  {q.companies?.map((c) => (
                    <span
                      key={c}
                      css={{
                        fontSize: "11px",
                        fontWeight: 500,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: `${C.accent}12`,
                        border: `1px solid ${C.accent}28`,
                        color: C.accent,
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}

              <div css={{ padding: "1rem" }}>
                {/* Description */}
                <p
                  css={{
                    fontSize: "0.875rem",
                    color: C.text,
                    lineHeight: 1.7,
                    marginBottom: "1rem",
                    padding: "0.75rem 1rem",
                    background: C.bgSubtle,
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.5rem",
                  }}
                >
                  {q.question}
                </p>

                {/* Toolbar + Monaco */}
                <div
                  css={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span
                    css={{
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".07em",
                      color: C.muted,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <FlaskConical size={12} /> Implementation
                  </span>
                  <div css={{ display: "flex", gap: 6 }}>
                    <button
                      css={runBtn}
                      onClick={handleRunTests}
                      disabled={running}
                    >
                      <Play size={12} /> {running ? "Running…" : "Run Tests"}
                    </button>
                    <button css={actionBtn} onClick={handleReset}>
                      <RotateCcw size={12} /> Reset
                    </button>
                  </div>
                </div>

                <CodeEditor
                  value={userCode}
                  onChange={setUserCode}
                  readOnly={false}
                  height={editorH(userCode)}
                />

                {/* Test results */}
                {hasRun && testResults.length > 0 && (
                  <div
                    css={{
                      marginTop: 10,
                      padding: "0.75rem 1rem",
                      background: C.bgSubtle,
                      border: `1px solid ${C.border}`,
                      borderRadius: "0.5rem",
                    }}
                  >
                    <div
                      css={{
                        fontSize: "0.6875rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: ".08em",
                        color: allPassed ? C.green : C.red,
                        marginBottom: 8,
                      }}
                    >
                      {allPassed
                        ? "🎉 All tests passed!"
                        : `${passCount}/${testResults.length} tests passing`}
                    </div>
                    <div
                      css={{ display: "flex", flexDirection: "column", gap: 5 }}
                    >
                      {testResults.map((t, i) => (
                        <div
                          key={i}
                          css={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 8,
                            padding: "4px 8px",
                            borderRadius: "4px",
                            background: t.passed ? C.greenSubtle : C.redSubtle,
                            border: `1px solid ${t.passed ? C.greenBorder : C.redBorder}`,
                            color: t.passed ? C.green : C.red,
                          }}
                        >
                          <span css={{ fontSize: "12px", fontWeight: 700 }}>
                            {t.passed ? "✓" : "✗"}
                          </span>
                          <span
                            css={{
                              fontSize: "12px",
                              fontFamily: '"JetBrains Mono",monospace',
                              flex: 1,
                            }}
                          >
                            {t.name}
                          </span>
                          {!t.passed && t.detail && (
                            <span
                              css={{
                                fontSize: "11px",
                                color: C.red,
                                fontFamily: '"JetBrains Mono",monospace',
                                opacity: 0.8,
                              }}
                            >
                              {t.detail}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Runtime error */}
                {runResult?.error && (
                  <CodeConsole result={runResult} running={false} />
                )}

                {/* Footer toggles */}
                <div
                  css={{
                    display: "flex",
                    gap: 8,
                    marginTop: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    css={[
                      actionBtn,
                      showTests &&
                        css`
                          border-color: ${C.accent};
                          color: ${C.accent};
                        `,
                    ]}
                    onClick={() => setShowTests((s) => !s)}
                  >
                    {showTests ? (
                      <>
                        <EyeOff size={12} /> Hide Tests
                      </>
                    ) : (
                      <>
                        <Eye size={12} /> Show Tests
                      </>
                    )}
                  </button>
                  <button
                    css={[
                      actionBtn,
                      showSolution &&
                        css`
                          border-color: ${C.green};
                          color: ${C.green};
                        `,
                    ]}
                    onClick={() => {
                      setShowSolution((s) => !s);
                      console.log(!isSolved(q.id), !isRevealed(q.id), isPro, "line227");
                      
                      if (
                        !isSolved(q.id) &&
                        !isRevealed(q.id) &&
                        isPro
                      )
                        console.log("recored reverald firebase");

                      recordRevealed(q.id).catch(() => {});
                    }}
                  >
                    {showSolution ? (
                      <>
                        <EyeOff size={12} /> Hide Solution
                      </>
                    ) : (
                      <>
                        <Eye size={12} /> Show Solution
                      </>
                    )}
                  </button>
                </div>

                {showTests && (
                  <div css={{ marginTop: 10 }}>
                    <p
                      css={{
                        fontSize: "0.6875rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: ".08em",
                        color: C.muted,
                        marginBottom: 6,
                      }}
                    >
                      Test Cases
                    </p>
                    <CodeEditor
                      value={q.testCode ?? ""}
                      onChange={() => {}}
                      readOnly
                      height={editorH(q.testCode ?? "")}
                    />
                  </div>
                )}

                {showSolution && (
                  <div css={{ marginTop: 10 }}>
                    <p
                      css={{
                        fontSize: "0.6875rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: ".08em",
                        color: C.muted,
                        marginBottom: 6,
                      }}
                    >
                      Reference Solution
                    </p>
                    <CodeEditor
                      value={q.solutionCode ?? ""}
                      onChange={() => {}}
                      readOnly
                      height={editorH(q.solutionCode ?? "")}
                    />
                    <div
                      css={{
                        marginTop: 10,
                        padding: "0.875rem 1rem",
                        background: C.bgSubtle,
                        border: `1px solid ${C.border}`,
                        borderRadius: "0.5rem",
                      }}
                    >
                      <p
                        css={{
                          fontSize: "0.8125rem",
                          color: C.text,
                          marginBottom: 6,
                          fontWeight: 600,
                        }}
                      >
                        💡 Explanation
                      </p>
                      <p
                        css={{
                          fontSize: "0.8125rem",
                          color: C.muted,
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {q.explanation}
                      </p>
                      <div
                        css={{
                          marginTop: 10,
                          padding: "0.625rem 0.875rem",
                          background: C.amberSubtle,
                          border: `1px solid ${C.amberBorder}`,
                          borderRadius: "0.375rem",
                        }}
                      >
                        <p
                          css={{
                            fontSize: "0.75rem",
                            color: C.amber,
                            fontWeight: 700,
                            margin: 0,
                          }}
                        >
                          ⚡ {q.keyInsight}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const card = (s: "pass" | "fail" | "idle") => css`
  border: 1px solid
    ${s === "pass" ? C.greenBorder : s === "fail" ? C.redBorder : C.border};
  border-radius: 0.75rem;
  background: ${C.card};
  overflow: hidden;
  transition: border-color 0.2s;
`;
const cardHeader = css`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.125rem;
  cursor: pointer;
  user-select: none;
`;
const qNum = css`
  font-size: 0.6875rem;
  font-weight: 800;
  font-family: "JetBrains Mono", monospace;
  color: ${C.muted};
  flex-shrink: 0;
`;
const chip = css`
  font-size: 10px;
  font-weight: 500;
  padding: 1px 6px;
  border-radius: 4px;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  color: ${C.muted};
  white-space: nowrap;
`;
const runBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border: 1px solid ${C.greenBorder};
  border-radius: 5px;
  background: ${C.greenSubtle};
  color: ${C.green};
  font-size: 11.5px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  &:hover:not(:disabled) {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const actionBtn = css`
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
  &:hover {
    background: ${C.surface};
    color: ${C.text};
  }
`;

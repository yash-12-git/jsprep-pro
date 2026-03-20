/** @jsxImportSource @emotion/react */
"use client";

import { useState } from "react";
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
} from "lucide-react";
import * as Shared from "@/styles/shared";
import { C, RADIUS } from "@/styles/tokens";
import * as S from "./styles";
import type { Question } from "@/types/question";

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

  const state: AnswerState =
    !manuallyReset && (isSolved(q.id) || answerState === "correct")
      ? "correct"
      : localRevealed || (!manuallyReset && isRevealed(q.id))
        ? "revealed"
        : localWrong
          ? "wrong"
          : "idle";

  const expectedOut = q.expectedOutput || q.answer || "";
  const ds = S.DIFF_STYLE[q.difficulty] ?? S.DIFF_STYLE.core;

  async function checkAnswer() {
    const ua = answer.toLowerCase().trim();
    const correct = expectedOut.toLowerCase().trim();
    const match =
      ua === correct ||
      ua.split("\n").join(",") === correct.split("\n").join(",");

    console.log(match , correct, ua, "line72");
    console.log(isPro, answerState,!isSolved(q.id), "line73");
    
    
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
  }

  const highlight: S.CardHighlight =
    state === "correct"
      ? "correct"
      : state === "wrong"
        ? "wrong"
        : state === "revealed"
          ? "revealed"
          : "idle";

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
                    Free tier includes the first 5. Pro unlocks all {q.category}{" "}
                    questions and more.
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
                <p css={S.sectionLabel()}>Code</p>
                <pre css={Shared.codeBlock()}>
                  <code>{q.code}</code>
                </pre>
              </div>

              <div css={S.inputSection}>
                <p css={S.sectionLabel()}>
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
                </p>
                <textarea
                  value={state === "correct" ? expectedOut : answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={state === "correct"}
                  placeholder={
                    "Type the expected output...\nOne value per line"
                  }
                  rows={Math.max(3, expectedOut.split("\n").length + 1)}
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
                          Expected Output:
                        </span>
                      )}
                    </div>
                    <pre css={Shared.codeBlock(C.greenBorder)}>
                      <code css={{ color: C.green }}>{expectedOut}</code>
                    </pre>
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

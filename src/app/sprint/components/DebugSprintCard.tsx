/** @jsxImportSource @emotion/react */
"use client";

import { css, keyframes } from "@emotion/react";
import { useState } from "react";
import { CheckCircle, XCircle, ChevronRight, RotateCcw } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import type { Question } from "@/types/question";
import type { SprintOutcome } from "../types";

const fadeIn = keyframes`from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}`;

// ─── Styles ───────────────────────────────────────────────────────────────────

const card = css`
  background: ${C.card};
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: ${RADIUS.xxl};
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease;
`;
const body = css`
  padding: 1.5rem 1.5rem 1rem;
`;

const typeTag = css`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #f76a6a;
  background: rgba(247, 106, 106, 0.1);
  padding: 3px 10px;
  border-radius: 20px;
`;
const title = css`
  font-size: 1.125rem;
  font-weight: 800;
  color: #f0f0f8;
  line-height: 1.45;
  margin: 0.875rem 0 0.375rem;
`;
const hint = css`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.38);
  margin-bottom: 1rem;
  line-height: 1.5;
`;
const label = (color = "rgba(255,255,255,0.3)") => css`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${color};
  margin-bottom: 0.4rem;
`;
const codeBlock = css`
  background: #0a0a14;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: ${RADIUS.lg};
  padding: 1rem 1.125rem;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: #c8d8e8;
  overflow-x: auto;
  white-space: pre;
  margin-bottom: 1rem;
`;
const textarea = (state: "idle" | "submitted") => css`
  width: 100%;
  box-sizing: border-box;
  background: #0a0a14;
  border: 1px solid
    ${state === "submitted"
      ? "rgba(255,255,255,0.15)"
      : "rgba(124,106,247,0.3)"};
  border-radius: ${RADIUS.lg};
  padding: 1rem 1.125rem;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: #c8d8e8;
  resize: vertical;
  outline: none;
  margin-bottom: 1rem;
  transition: border-color 0.15s;
  &:focus {
    border-color: rgba(124, 106, 247, 0.6);
  }
  ${state === "submitted" ? "opacity: 0.7; cursor: default;" : ""}
`;
const compRow = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.3s ease;
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;
const compPanel = (color: string, bg: string) => css`
  background: ${bg};
  border: 1px solid ${color}30;
  border-radius: ${RADIUS.lg};
  padding: 0.875rem 1rem;
`;
const compPre = css`
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.75rem;
  line-height: 1.7;
  color: #c8d8e8;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
`;
const bugNote = css`
  background: rgba(247, 106, 106, 0.06);
  border: 1px solid rgba(247, 106, 106, 0.15);
  border-radius: ${RADIUS.md};
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.6;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.3s ease;
`;
const divider = css`
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
`;

const actionsRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  gap: 0.75rem;
  flex-wrap: wrap;
`;
const submitBtn = (disabled: boolean) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.375rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 800;
  cursor: ${disabled ? "not-allowed" : "pointer"};
  background: ${disabled ? "rgba(124,106,247,0.08)" : "rgba(124,106,247,0.15)"};
  border: 1px solid
    ${disabled ? "rgba(124,106,247,0.15)" : "rgba(124,106,247,0.4)"};
  color: ${disabled ? "rgba(124,106,247,0.4)" : "#c4b5fd"};
  transition: all 0.15s;
  ${!disabled ? "&:hover{ background: rgba(124,106,247,0.25); }" : ""}
`;
const resetBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 0.875rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: rgba(255, 255, 255, 0.35);
  transition: all 0.15s;
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.6);
  }
`;
const skipBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.875rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: rgba(255, 255, 255, 0.35);
  transition: all 0.15s;
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.6);
  }
`;
const selfMarkRow = css`
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  animation: ${fadeIn} 0.25s ease;
`;
const selfMarkLabel = css`
  width: 100%;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.375rem;
`;
const gotItBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5625rem 1.125rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  background: rgba(106, 247, 192, 0.12);
  border: 1px solid rgba(106, 247, 192, 0.25);
  color: ${C.accent3};
  transition: all 0.15s;
  &:hover {
    background: rgba(106, 247, 192, 0.2);
  }
`;
const missedItBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5625rem 1.125rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  background: rgba(247, 106, 106, 0.1);
  border: 1px solid rgba(247, 106, 106, 0.2);
  color: #f76a6a;
  transition: all 0.15s;
  &:hover {
    background: rgba(247, 106, 106, 0.18);
  }
`;
const nextBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.5rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;
  background: ${C.accent};
  border: none;
  color: white;
  transition: all 0.15s;
  &:hover {
    background: #9b8bff;
    transform: translateY(-1px);
  }
`;
const resultBanner = (outcome: "correct" | "attempted") => css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${outcome === "correct"
    ? "rgba(106,247,192,0.05)"
    : "rgba(247,106,106,0.04)"};
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.875rem;
  font-weight: 700;
  color: ${outcome === "correct" ? C.accent3 : C.danger};
  animation: ${fadeIn} 0.2s ease;
`;

// ─── Component ────────────────────────────────────────────────────────────────

type Phase = "editing" | "comparing";

interface Props {
  q: Question;
  onComplete: (outcome: SprintOutcome) => void;
}

export default function DebugSprintCard({ q, onComplete }: Props) {
  const brokenCode = q.brokenCode || q.code || "";
  const fixedCode = q.fixedCode || "";
  const bugDesc = q.bugDescription || q.explanation || "";

  const [phase, setPhase] = useState<Phase>("editing");
  const [userCode, setUserCode] = useState(brokenCode);
  const [finalOutcome, setFinalOutcome] = useState<
    "correct" | "attempted" | null
  >(null);

  const hasEdited = userCode.trim() !== brokenCode.trim();

  function submitFix() {
    if (!hasEdited) return;
    setPhase("comparing");
  }

  function reset() {
    setUserCode(brokenCode);
    setPhase("editing");
    setFinalOutcome(null);
  }

  function mark(o: "correct" | "attempted") {
    setFinalOutcome(o);
  }

  return (
    <div css={card}>
      <div css={body}>
        <div css={typeTag}>🐛 Debug</div>
        <p css={title}>{q.title || "Find and fix the bug"}</p>
        <p css={hint}>
          {phase === "editing"
            ? "Edit the code below to fix the bug. When you're done, click Submit Fix."
            : "Compare your fix to the correct solution — then self-mark."}
        </p>

        {/* ── Phase: editing — show buggy code + textarea ── */}
        {phase === "editing" && (
          <>
            <div css={label()}>🔴 Buggy Code</div>
            <pre css={codeBlock}>{brokenCode}</pre>

            <div css={label("rgba(124,106,247,0.7)")}>✏️ Your Fix</div>
            <textarea
              css={textarea("idle")}
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const el = e.currentTarget;
                  const s = el.selectionStart,
                    en = el.selectionEnd;
                  setUserCode(
                    userCode.substring(0, s) + "  " + userCode.substring(en),
                  );
                  requestAnimationFrame(() => {
                    el.selectionStart = el.selectionEnd = s + 2;
                  });
                }
              }}
              rows={Math.max(6, brokenCode.split("\n").length + 1)}
              placeholder="Edit the code above to fix the bug…"
              spellCheck={false}
            />
          </>
        )}

        {/* ── Phase: comparing — show both side by side ── */}
        {phase === "comparing" && (
          <>
            {bugDesc && (
              <div css={bugNote}>
                <strong style={{ color: "#f76a6a" }}>Bug: </strong>
                {bugDesc}
              </div>
            )}
            <div css={compRow}>
              <div css={compPanel("#c4b5fd", "rgba(124,106,247,0.05)")}>
                <div
                  css={label("rgba(196,181,253,0.7)")}
                  style={{ marginBottom: "0.5rem" }}
                >
                  Your fix
                </div>
                <pre css={compPre}>{userCode}</pre>
              </div>
              <div css={compPanel("#6af7c0", "rgba(106,247,192,0.04)")}>
                <div css={label("#6af7c0")} style={{ marginBottom: "0.5rem" }}>
                  ✅ Correct fix
                </div>
                <pre css={compPre}>
                  {fixedCode || "No fixed code available"}
                </pre>
              </div>
            </div>
          </>
        )}
      </div>

      <div css={divider} />

      {/* ── Final outcome banner ── */}
      {finalOutcome ? (
        <>
          <div css={resultBanner(finalOutcome)}>
            {finalOutcome === "correct" ? (
              <>
                <CheckCircle size={15} /> Nice fix!
              </>
            ) : (
              <>
                <XCircle size={15} /> Noted for review
              </>
            )}
          </div>
          <div css={actionsRow}>
            <div />
            <button css={nextBtn} onClick={() => onComplete(finalOutcome)}>
              Next →
            </button>
          </div>
        </>
      ) : phase === "comparing" ? (
        /* ── Self-mark after seeing both ── */
        <div css={selfMarkRow}>
          <div css={selfMarkLabel}>
            Does your fix match the correct solution?
          </div>
          <button css={gotItBtn} onClick={() => mark("correct")}>
            <CheckCircle size={13} /> Yes, I got it
          </button>
          <button css={missedItBtn} onClick={() => mark("attempted")}>
            <XCircle size={13} /> Not quite
          </button>
        </div>
      ) : (
        /* ── Editing actions ── */
        <div css={actionsRow}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {hasEdited && (
              <button css={resetBtn} onClick={reset}>
                <RotateCcw size={12} /> Reset
              </button>
            )}
            <button css={skipBtn} onClick={() => onComplete("skipped")}>
              Skip
            </button>
          </div>
          <button
            css={submitBtn(!hasEdited)}
            onClick={submitFix}
            disabled={!hasEdited}
          >
            Submit Fix <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

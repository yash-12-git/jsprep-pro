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
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease;
`;

const body = css`
  padding: 1.375rem 1.375rem 1rem;
`;

const typeTag = css`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.red};
  background: ${C.redSubtle};
  border: 1px solid ${C.redBorder};
  padding: 3px 10px;
  border-radius: 20px;
`;

const title = css`
  font-size: 1.0625rem;
  font-weight: 600;
  color: ${C.text};
  line-height: 1.45;
  margin: 0.875rem 0 0.375rem;
  letter-spacing: -0.01em;
`;

const hint = css`
  font-size: 0.8125rem;
  color: ${C.muted};
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const label = (color: string = C.muted) => css`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${color};
  margin-bottom: 0.4rem;
`;

const codeBlock = css`
  background: ${C.codeBg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1rem 1.125rem;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: ${C.codeText};
  overflow-x: auto;
  white-space: pre;
  margin-bottom: 1rem;
`;

const textarea = (state: "idle" | "submitted") => css`
  width: 100%;
  box-sizing: border-box;
  background: ${C.bg};
  border: 1px solid ${state === "submitted" ? C.border : C.accent};
  border-radius: ${RADIUS.lg};
  padding: 1rem 1.125rem;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: ${C.text};
  resize: vertical;
  outline: none;
  margin-bottom: 1rem;
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease;
  &::placeholder {
    color: ${C.placeholder};
  }
  &:focus {
    border-color: ${C.accent};
    box-shadow: 0 0 0 2px ${C.accentSubtle};
  }
  ${state === "submitted" ? "opacity: 0.6; cursor: default;" : ""}
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
  color: ${C.codeText};
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
`;

const bugNote = css`
  background: ${C.redSubtle};
  border: 1px solid ${C.redBorder};
  border-radius: ${RADIUS.md};
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  color: ${C.text};
  line-height: 1.6;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.3s ease;
`;

const divider = css`
  height: 1px;
  background: ${C.border};
`;

const actionsRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.375rem;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const submitBtn = (disabled: boolean) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5625rem 1.25rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: ${disabled ? "not-allowed" : "pointer"};
  background: ${disabled ? C.bgSubtle : C.accent};
  border: 1px solid ${disabled ? C.border : C.accent};
  color: ${disabled ? C.muted : "#ffffff"};
  transition: opacity 0.12s ease;
  ${!disabled ? "&:hover{ opacity: 0.88; }" : ""}
`;

const ghostBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 0.875rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  border: 1px solid ${C.border};
  color: ${C.muted};
  transition: all 0.12s ease;
  &:hover {
    border-color: ${C.borderStrong};
    color: ${C.text};
    background: ${C.bgHover};
  }
`;

const selfMarkRow = css`
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
  padding: 0.875rem 1.375rem;
  border-top: 1px solid ${C.border};
  animation: ${fadeIn} 0.25s ease;
`;

const selfMarkLabel = css`
  width: 100%;
  font-size: 0.8rem;
  color: ${C.muted};
  margin-bottom: 0.25rem;
`;

const gotItBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  background: ${C.greenSubtle};
  border: 1px solid ${C.greenBorder};
  color: ${C.green};
  transition: opacity 0.12s ease;
  &:hover {
    opacity: 0.8;
  }
`;

const missedItBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  background: ${C.redSubtle};
  border: 1px solid ${C.redBorder};
  color: ${C.red};
  transition: opacity 0.12s ease;
  &:hover {
    opacity: 0.8;
  }
`;

const nextBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5625rem 1.375rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  background: ${C.accent};
  border: none;
  color: #ffffff;
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
`;

const resultBanner = (outcome: "correct" | "attempted") => css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.375rem;
  background: ${outcome === "correct" ? C.greenSubtle : C.redSubtle};
  border-top: 1px solid ${outcome === "correct" ? C.greenBorder : C.redBorder};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${outcome === "correct" ? C.green : C.red};
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

        {phase === "editing" && (
          <>
            <div css={label(C.red)}>🔴 Buggy Code</div>
            <pre css={codeBlock}>{brokenCode}</pre>
            <div css={label(C.accentText)}>✏️ Your Fix</div>
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

        {phase === "comparing" && (
          <>
            {bugDesc && (
              <div css={bugNote}>
                <strong style={{ color: C.red }}>Bug: </strong>
                {bugDesc}
              </div>
            )}
            <div css={compRow}>
              <div css={compPanel(C.accentText, C.accentSubtle)}>
                <div
                  css={label(C.accentText)}
                  style={{ marginBottom: "0.5rem" }}
                >
                  Your fix
                </div>
                <pre css={compPre}>{userCode}</pre>
              </div>
              <div css={compPanel(C.green, C.greenSubtle)}>
                <div css={label(C.green)} style={{ marginBottom: "0.5rem" }}>
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
        <div css={actionsRow}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {hasEdited && (
              <button css={ghostBtn} onClick={reset}>
                <RotateCcw size={12} /> Reset
              </button>
            )}
            <button css={ghostBtn} onClick={() => onComplete("skipped")}>
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

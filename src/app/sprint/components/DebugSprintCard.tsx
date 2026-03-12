/** @jsxImportSource @emotion/react */
"use client";

import { css, keyframes } from "@emotion/react";
import { useState } from "react";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import type { Question } from "@/types/question";
import type { SprintOutcome } from "../types";

const fadeIn = keyframes`from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); }`;

const card = css`
  background: ${C.card};
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: ${RADIUS.xxl};
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease;
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

const questionBody = css`
  padding: 1.5rem 1.5rem 0.75rem;
`;

const questionTitle = css`
  font-size: 1.125rem;
  font-weight: 800;
  color: #f0f0f8;
  line-height: 1.45;
  margin: 0.875rem 0 0.5rem;
`;

const instructionRow = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 1rem;
`;

const codeLabel = css`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 0.5rem;
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

const fixedCodeBlock = css`
  ${codeBlock};
  border-color: rgba(106, 247, 192, 0.2);
  animation: ${fadeIn} 0.3s ease;
`;

const bugNote = css`
  background: rgba(247, 106, 106, 0.06);
  border: 1px solid rgba(247, 106, 106, 0.15);
  border-radius: ${RADIUS.md};
  padding: 0.75rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.6;
  margin-bottom: 0.75rem;
`;

const divider = css`
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
`;

const revealSection = css`
  padding: 1rem 1.5rem;
  animation: ${fadeIn} 0.25s ease;
`;

const actionsRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const revealBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5625rem 1.125rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  background: rgba(247, 106, 106, 0.1);
  border: 1px solid rgba(247, 106, 106, 0.25);
  color: #f76a6a;
  transition: all 0.15s;
  &:hover {
    background: rgba(247, 106, 106, 0.18);
  }
`;

const hideBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5625rem 1.125rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.15s;
  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const selfMarkRow = css`
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
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

const skipBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5625rem 1rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.8125rem;
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

interface Props {
  q: Question;
  onComplete: (outcome: SprintOutcome) => void;
}

export default function DebugSprintCard({ q, onComplete }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [finalOutcome, setFinalOutcome] = useState<
    "correct" | "attempted" | null
  >(null);

  const brokenCode = q.brokenCode || q.code || "";
  const fixedCode = q.fixedCode || "";
  const bugDesc = q.bugDescription || q.explanation || "";

  function mark(o: "correct" | "attempted") {
    setFinalOutcome(o);
  }

  return (
    <div css={card}>
      <div css={questionBody}>
        <div css={typeTag}>🐛 Debug</div>
        <p css={questionTitle}>{q.title || "Find and fix the bug"}</p>
        <div css={instructionRow}>
          <span>
            Spot the bug in this code. Think of how you&apos;d fix it.
          </span>
        </div>

        <div css={codeLabel}>🔴 Buggy Code</div>
        {brokenCode ? (
          <pre css={codeBlock}>{brokenCode}</pre>
        ) : (
          <pre css={codeBlock}>{q.question}</pre>
        )}

        {revealed && (
          <>
            {bugDesc && (
              <div css={bugNote}>
                <strong style={{ color: "#f76a6a" }}>Bug: </strong>
                {bugDesc}
              </div>
            )}
            {fixedCode && (
              <>
                <div css={codeLabel} style={{ color: "#6af7c0" }}>
                  ✅ Fixed Code
                </div>
                <pre css={fixedCodeBlock}>{fixedCode}</pre>
              </>
            )}
          </>
        )}
      </div>

      <div css={divider} />

      {finalOutcome ? (
        <>
          <div css={resultBanner(finalOutcome)}>
            {finalOutcome === "correct" ? (
              <>
                <CheckCircle size={15} /> You got it!
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
      ) : revealed ? (
        <>
          <div css={revealSection}>
            <div
              style={{
                fontSize: "0.8125rem",
                color: "rgba(255,255,255,0.45)",
                marginBottom: "0.75rem",
              }}
            >
              Did you spot the bug before revealing?
            </div>
            <div css={selfMarkRow}>
              <button css={gotItBtn} onClick={() => mark("correct")}>
                <CheckCircle size={13} /> I got it
              </button>
              <button css={missedItBtn} onClick={() => mark("attempted")}>
                <XCircle size={13} /> I missed it
              </button>
            </div>
          </div>
        </>
      ) : (
        <div css={actionsRow}>
          <button css={revealBtn} onClick={() => setRevealed(true)}>
            <Eye size={13} /> Reveal Fix
          </button>
          <button css={skipBtn} onClick={() => onComplete("skipped")}>
            Skip
          </button>
        </div>
      )}
    </div>
  );
}

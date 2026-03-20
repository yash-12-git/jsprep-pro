/** @jsxImportSource @emotion/react */
"use client";

import { css, keyframes } from "@emotion/react";
import { useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import type { Question } from "@/types/question";
import type { SprintOutcome } from "../types";

const fadeIn = keyframes`from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); }`;

const card = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease;
`;

const typeTag = css`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.green};
  background: ${C.greenSubtle};
  border: 1px solid ${C.greenBorder};
  padding: 3px 10px;
  border-radius: 20px;
`;

const questionBody = css`
  padding: 1.375rem 1.375rem 0.75rem;
`;

const questionTitle = css`
  font-size: 1.0625rem;
  font-weight: 600;
  color: ${C.text};
  line-height: 1.45;
  margin: 0.875rem 0 0.5rem;
  letter-spacing: -0.01em;
`;

const prompt = css`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${C.muted};
  margin-bottom: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
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

const inputSection = css`
  padding: 1rem 1.375rem;
  border-top: 1px solid ${C.border};
`;

const inputLabel = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.green};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.5rem;
`;

const input = css`
  width: 100%;
  box-sizing: border-box;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.md};
  padding: 0.75rem;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.875rem;
  color: ${C.text};
  outline: none;
  resize: none;
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease;
  &::placeholder {
    color: ${C.placeholder};
  }
  &:focus {
    border-color: ${C.green};
    box-shadow: 0 0 0 2px ${C.greenSubtle};
  }
`;

const checkBtn = (active: boolean) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.625rem;
  padding: 0.5rem 1rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 600;
  background: ${active ? C.greenSubtle : C.bgSubtle};
  border: 1px solid ${active ? C.greenBorder : C.border};
  color: ${active ? C.green : C.muted};
  cursor: ${active ? "pointer" : "not-allowed"};
  transition: opacity 0.12s ease;
  ${active && "&:hover { opacity: 0.8; }"}
`;

const resultBox = (correct: boolean) => css`
  padding: 1rem 1.375rem;
  border-top: 1px solid ${C.border};
  background: ${correct ? C.greenSubtle : C.redSubtle};
  animation: ${fadeIn} 0.25s ease;
`;

const resultBadge = (correct: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${correct ? C.green : C.red};
  margin-bottom: 0.5rem;
`;

const expectedOutput = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.md};
  padding: 0.625rem 0.875rem;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8125rem;
  color: ${C.codeText};
`;

const actionsRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.375rem;
  border-top: 1px solid ${C.border};
  gap: 0.75rem;
`;

const revealBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  border: 1px solid ${C.border};
  color: ${C.muted};
  transition: all 0.12s ease;
  &:hover {
    color: ${C.text};
    border-color: ${C.borderStrong};
    background: ${C.bgHover};
  }
`;

const skipBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.875rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.8125rem;
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

interface Props {
  q: Question;
  onComplete: (outcome: SprintOutcome) => void;
}

export default function OutputSprintCard({ q, onComplete }: Props) {
  const [userAnswer, setUserAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(false);

  const expectedOut = q.expectedOutput || q.answer || "";

  function checkAnswer() {
    if (!userAnswer.trim()) return;
    const ua = userAnswer.trim().toLowerCase().replace(/\s+/g, "\n").trim();
    const ex = expectedOut.toLowerCase().trim();
    const isCorrect =
      ua === ex || ua.split("\n").join(",") === ex.split("\n").join(",");
    setCorrect(isCorrect);
    setChecked(true);
  }

  function reveal() {
    setRevealed(true);
    setChecked(true);
    setCorrect(false);
  }

  const isDone = checked || revealed;

  return (
    <div css={card}>
      <div css={questionBody}>
        <div css={typeTag}>💻 Output</div>
        <p css={questionTitle}>{q.title || "What is the output?"}</p>
        <div css={prompt}>What does this print?</div>
        <pre css={codeBlock}>{q.code || q.question}</pre>
      </div>

      {!isDone ? (
        <>
          <div css={inputSection}>
            <div css={inputLabel}>Your prediction</div>
            <textarea
              css={input}
              rows={4}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type the expected output..."
              autoFocus
            />
            <button
              css={checkBtn(!!userAnswer.trim())}
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
            >
              Check Answer
            </button>
          </div>
          <div css={actionsRow}>
            <button css={revealBtn} onClick={reveal}>
              <Eye size={13} /> Reveal Answer
            </button>
            <button css={skipBtn} onClick={() => onComplete("skipped")}>
              Skip
            </button>
          </div>
        </>
      ) : (
        <>
          <div css={resultBox(correct && !revealed)}>
            <div css={resultBadge(correct && !revealed)}>
              {correct && !revealed ? (
                <>
                  <CheckCircle size={16} /> Correct!
                </>
              ) : revealed ? (
                <>
                  <Eye size={16} /> Answer Revealed
                </>
              ) : (
                <>
                  <XCircle size={16} /> Not quite
                </>
              )}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: C.muted,
                marginBottom: "0.375rem",
              }}
            >
              Expected output:
            </div>
            <pre css={expectedOutput}>{expectedOut}</pre>
            {q.explanation && (
              <div
                style={{
                  marginTop: "0.75rem",
                  fontSize: "0.8125rem",
                  color: C.muted,
                  lineHeight: 1.6,
                }}
              >
                {q.explanation}
              </div>
            )}
          </div>
          <div css={actionsRow}>
            <div />
            <button
              css={nextBtn}
              onClick={() =>
                onComplete(
                  revealed ? "attempted" : correct ? "correct" : "attempted",
                )
              }
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

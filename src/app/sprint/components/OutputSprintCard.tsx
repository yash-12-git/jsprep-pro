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
  color: #6af7c0;
  background: rgba(106, 247, 192, 0.1);
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

const prompt = css`
  font-size: 0.8125rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
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

const inputSection = css`
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const inputLabel = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: #6af7c0;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.5rem;
`;

const input = css`
  width: 100%;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${RADIUS.md};
  padding: 0.75rem;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.875rem;
  color: #c8d8e8;
  outline: none;
  resize: none;
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  &:focus {
    border-color: rgba(106, 247, 192, 0.3);
  }
`;

const checkBtn = (active: boolean) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.625rem;
  padding: 0.5625rem 1.125rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 700;
  background: ${active ? `${C.accent3}22` : "rgba(255,255,255,0.04)"};
  border: 1px solid ${active ? `${C.accent3}40` : "rgba(255,255,255,0.07)"};
  color: ${active ? C.accent3 : "rgba(255,255,255,0.25)"};
  cursor: ${active ? "pointer" : "not-allowed"};
  transition: all 0.15s;
  ${active && `&:hover { background: ${C.accent3}33; }`}
`;

const resultBox = (correct: boolean) => css`
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: ${correct ? "rgba(106,247,192,0.04)" : "rgba(247,106,106,0.04)"};
  animation: ${fadeIn} 0.25s ease;
`;

const resultBadge = (correct: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 800;
  color: ${correct ? C.accent3 : C.danger};
  margin-bottom: 0.5rem;
`;

const expectedOutput = css`
  background: rgba(0, 0, 0, 0.3);
  border-radius: ${RADIUS.md};
  padding: 0.625rem 0.875rem;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8125rem;
  color: #c8d8e8;
`;

const actionsRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  gap: 0.75rem;
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.55);
  transition: all 0.15s;
  &:hover {
    color: rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 255, 255, 0.18);
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
                color: "rgba(255,255,255,0.4)",
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
                  color: "rgba(255,255,255,0.5)",
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

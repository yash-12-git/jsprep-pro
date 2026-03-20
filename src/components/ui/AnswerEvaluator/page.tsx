/** @jsxImportSource @emotion/react */
"use client";
import { useState } from "react";
import { Loader2, Target, X, ChevronDown, ChevronUp } from "lucide-react";
import * as S from "./styles";
import { C } from "@/styles/tokens";

interface EvalResult {
  score: number;
  grade: string;
  verdict: string;
  strengths: string[];
  missing: string[];
  betterAnswer: string;
}
interface Props {
  question: string;
  idealAnswer: string;
  onClose: () => void;
}

export default function AnswerEvaluator({
  question,
  idealAnswer,
  onClose,
}: Props) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [showBetter, setShowBetter] = useState(false);

  async function evaluate() {
    if (!answer.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "evaluate",
          messages: [{ role: "user", content: answer }],
          context: {
            question,
            idealAnswer: idealAnswer.replace(/<[^>]*>/g, ""),
          },
        }),
      });
      const data = await res.json();
      setResult(JSON.parse(data.text.replace(/```json|```/g, "").trim()));
    } catch {
      alert("Evaluation failed — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div css={S.wrapper}>
      {/* Header */}
      <div css={S.header}>
        <div css={S.headerLeft}>
          <div css={S.headerIcon}>
            <Target size={12} color={C.amber} />
          </div>
          <span css={S.headerTitle}>Answer Evaluator</span>
          <span css={S.headerSub}>— Type your answer, get scored</span>
        </div>
        <button css={S.closeBtn} onClick={onClose}>
          <X size={14} />
        </button>
      </div>

      <div css={S.body}>
        {!result ? (
          <>
            <p css={S.prompt}>
              Answer this question as you would in a real interview:
            </p>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here... (explain the concept in your own words, include examples if you know them)"
              rows={5}
              css={{
                width: "100%",
                boxSizing: "border-box" as const,
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: "0.625rem",
                padding: "0.75rem 1rem",
                fontSize: "0.8125rem",
                color: C.text,
                lineHeight: 1.65,
                fontFamily: "inherit",
                outline: "none",
                resize: "vertical" as const,
                transition: "border-color 0.12s ease, box-shadow 0.12s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = C.accent;
                e.target.style.boxShadow = `0 0 0 2px ${C.accentSubtle}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = C.border;
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              css={S.evalBtn}
              onClick={evaluate}
              disabled={!answer.trim() || loading}
            >
              {loading ? (
                <>
                  <Loader2
                    size={13}
                    css={{ animation: "spin 1s linear infinite" }}
                  />{" "}
                  Evaluating…
                </>
              ) : (
                <>
                  <Target size={13} /> Evaluate My Answer
                </>
              )}
            </button>
          </>
        ) : (
          <div css={S.resultArea}>
            {/* Score card */}
            <div css={S.scoreCard}>
              <div css={S.scoreLeft}>
                <div css={S.scoreNum(result.score)}>
                  {result.score}
                  <span css={S.scoreDenom}>/10</span>
                </div>
                <div css={S.gradeText(result.grade)}>{result.grade}</div>
              </div>
              <div css={S.scoreRight}>
                <p css={S.verdict}>{result.verdict}</p>
                <div css={S.barTrack}>
                  <div css={S.barFill(result.score)} />
                </div>
              </div>
            </div>

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div css={S.listSection(C.green)}>
                <p css={S.listTitle(C.green)}>✓ What you got right</p>
                {result.strengths.map((s, i) => (
                  <div key={i} css={S.listItem}>
                    <span style={{ color: C.green, flexShrink: 0 }}>•</span>
                    {s}
                  </div>
                ))}
              </div>
            )}

            {/* Missing */}
            {result.missing.length > 0 && (
              <div css={S.listSection(C.red)}>
                <p css={S.listTitle(C.red)}>✗ What you missed</p>
                {result.missing.map((m, i) => (
                  <div key={i} css={S.listItem}>
                    <span style={{ color: C.red, flexShrink: 0 }}>•</span>
                    {m}
                  </div>
                ))}
              </div>
            )}

            {/* Better answer */}
            <button
              css={S.toggleBtn}
              onClick={() => setShowBetter(!showBetter)}
            >
              {showBetter ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {showBetter ? "Hide" : "See"} ideal answer
            </button>
            {showBetter && <p css={S.betterAnswerBox}>{result.betterAnswer}</p>}

            <button
              css={S.tryAgainBtn}
              onClick={() => {
                setResult(null);
                setAnswer("");
              }}
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

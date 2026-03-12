/** @jsxImportSource @emotion/react */
"use client";

import { css, keyframes } from "@emotion/react";
import { useState, useRef, useEffect } from "react";
import {
  Trophy,
  Share2,
  Download,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import type { SprintSummary } from "../types";

const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
const pop = keyframes`0%{transform:scale(0.8)}60%{transform:scale(1.08)}100%{transform:scale(1)}`;
const glow = keyframes`0%,100%{opacity:0.5}50%{opacity:1}`;
const countUp = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

// ─── Layout ───────────────────────────────────────────────────────────────────

const page = css`
  min-height: 100vh;
  padding: 2rem 1.25rem 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const inner = css`
  width: 100%;
  max-width: 600px;
`;

const titleRow = css`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeUp} 0.5s ease;
`;

const trophyWrap = css`
  font-size: 3rem;
  margin-bottom: 0.75rem;
  display: inline-block;
  animation: ${pop} 0.6s ease 0.2s both;
`;

const resultTitle = css`
  font-size: 1.75rem;
  font-weight: 900;
  color: white;
  letter-spacing: -0.02em;
  margin-bottom: 0.375rem;
`;

const resultSub = css`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.45);
`;

// ─── Score card ───────────────────────────────────────────────────────────────

const scoreCard = css`
  background: linear-gradient(
    135deg,
    rgba(124, 106, 247, 0.12) 0%,
    rgba(106, 247, 192, 0.06) 100%
  );
  border: 1px solid rgba(124, 106, 247, 0.25);
  border-radius: ${RADIUS.xxl};
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.25rem;
  animation: ${fadeUp} 0.5s ease 0.1s both;
`;

const bigScore = css`
  font-size: 4.5rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, #c4b5fd, #6af7c0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${pop} 0.6s ease 0.3s both;
`;

const scoreMax = css`
  font-size: 1.25rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 0.25rem;
`;

const statsGrid = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
`;

const stat = css`
  text-align: center;
`;
const statNum = (color: string) => css`
  font-size: 1.375rem;
  font-weight: 900;
  color: ${color};
  letter-spacing: -0.02em;
`;
const statLbl = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 0.25rem;
`;

// ─── Insights ─────────────────────────────────────────────────────────────────

const insightRow = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
  animation: ${fadeUp} 0.5s ease 0.2s both;
`;

const insightCard = (color: string, bg: string) => css`
  background: ${bg};
  border: 1px solid ${color}30;
  border-radius: ${RADIUS.xl};
  padding: 1rem;
`;

const insightTitle = (color: string) => css`
  font-size: 0.6875rem;
  font-weight: 800;
  color: ${color};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.625rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const insightItem = css`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
  padding: 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

// ─── Question breakdown ───────────────────────────────────────────────────────

const breakdownCard = css`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: ${RADIUS.xl};
  overflow: hidden;
  margin-bottom: 1.25rem;
  animation: ${fadeUp} 0.5s ease 0.3s both;
`;

const breakdownHeader = css`
  padding: 0.875rem 1.125rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.8125rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const breakdownRow = (outcome: string) => css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.125rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  &:last-child {
    border-bottom: none;
  }
  background: ${outcome === "correct"
    ? "rgba(106,247,192,0.02)"
    : outcome === "skipped"
      ? "rgba(0,0,0,0.1)"
      : "transparent"};
`;

const outcomeIcon = (outcome: string) =>
  ({
    correct: (
      <CheckCircle size={14} style={{ color: C.accent3, flexShrink: 0 }} />
    ),
    attempted: (
      <XCircle size={14} style={{ color: C.accent2, flexShrink: 0 }} />
    ),
    skipped: (
      <span
        style={{
          width: 14,
          height: 14,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.25)",
          fontSize: "0.625rem",
        }}
      >
        —
      </span>
    ),
  })[outcome] ?? null;

const questionTitle = css`
  flex: 1;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const questionPoints = (pts: number) => css`
  font-size: 0.75rem;
  font-weight: 800;
  color: ${pts >= 10
    ? C.accent3
    : pts > 0
      ? C.accent2
      : "rgba(255,255,255,0.2)"};
  flex-shrink: 0;
`;

const typeChip = (type: string) => css`
  font-size: 0.55rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 6px;
  border-radius: 8px;
  flex-shrink: 0;
  ${type === "theory"
    ? "background: rgba(196,181,253,0.12); color: #c4b5fd;"
    : type === "output"
      ? "background: rgba(106,247,192,0.12); color: #6af7c0;"
      : "background: rgba(247,106,106,0.12); color: #f76a6a;"}
`;

// ─── Share ────────────────────────────────────────────────────────────────────

const shareSection = css`
  animation: ${fadeUp} 0.5s ease 0.4s both;
`;

const shareTitle = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.75rem;
`;

const shareRow = css`
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
`;

const shareBtn = (bg: string, color: string, border: string) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5625rem 1.125rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  background: ${bg};
  border: 1px solid ${border};
  color: ${color};
  transition: all 0.15s;
  &:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }
`;

const retryBtn = css`
  width: 100%;
  padding: 0.875rem;
  border-radius: ${RADIUS.xl};
  font-size: 0.9375rem;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.15s;
  margin-top: 1rem;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  summary: SprintSummary;
  onRetry: () => void;
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

function getGrade(accuracy: number): { emoji: string; label: string } {
  if (accuracy >= 90) return { emoji: "🏆", label: "Excellent!" };
  if (accuracy >= 75) return { emoji: "🎯", label: "Strong!" };
  if (accuracy >= 60) return { emoji: "📈", label: "Solid" };
  if (accuracy >= 40) return { emoji: "💪", label: "Keep practicing" };
  return { emoji: "🔄", label: "More reps needed" };
}

export default function SprintResults({ summary, onRetry }: Props) {
  const {
    score,
    maxScore,
    accuracy,
    timeUsedSecs,
    results,
    strengths,
    weakAreas,
  } = summary;
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const grade = getGrade(accuracy);

  const shareText = `I scored ${score}/${maxScore} in the JSPrep JavaScript Interview Sprint (${accuracy}% accuracy). Can you beat me? 👉 jsprep.pro/sprint`;

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  function shareTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener");
  }

  function downloadCard() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#0a0a10";
    ctx.fillRect(0, 0, 1200, 630);

    // Gradient overlay
    const grad = ctx.createRadialGradient(200, 200, 0, 200, 200, 500);
    grad.addColorStop(0, "rgba(124,106,247,0.15)");
    grad.addColorStop(1, "rgba(10,10,16,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);

    // Badge
    ctx.fillStyle = "rgba(124,106,247,0.15)";
    ctx.beginPath();
    ctx.roundRect(80, 80, 280, 36, 18);
    ctx.fill();
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "700 13px system-ui";
    ctx.fillText("⚡ JAVASCRIPT INTERVIEW SPRINT", 100, 103);

    // Big score
    ctx.font = "900 140px system-ui";
    const grad2 = ctx.createLinearGradient(80, 100, 80, 300);
    grad2.addColorStop(0, "#c4b5fd");
    grad2.addColorStop(1, "#6af7c0");
    ctx.fillStyle = grad2;
    ctx.fillText(`${score}`, 80, 280);

    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "700 48px system-ui";
    ctx.fillText(
      `/${maxScore} pts`,
      80 + ctx.measureText(`${score}`).width - 20,
      260,
    );

    // Stats
    const stats = [
      { label: "Accuracy", value: `${accuracy}%` },
      { label: "Questions", value: `${results.length}` },
      { label: "Time", value: formatTime(timeUsedSecs) },
    ];
    stats.forEach((s, i) => {
      const x = 80 + i * 220;
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath();
      ctx.roundRect(x, 340, 200, 80, 12);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "800 28px system-ui";
      ctx.fillText(s.value, x + 20, 380);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "600 13px system-ui";
      ctx.fillText(s.label.toUpperCase(), x + 20, 402);
    });

    // CTA
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "600 20px system-ui";
    ctx.fillText("Can you beat me?", 80, 490);
    ctx.fillStyle = "#7c6af7";
    ctx.font = "700 20px system-ui";
    ctx.fillText("jsprep.pro/sprint", 80, 515);

    // Grade emoji
    ctx.font = "80px system-ui";
    ctx.fillText(grade.emoji, 1020, 200);

    // Download
    const link = document.createElement("a");
    link.download = `jsprep-sprint-${score}pts.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  const displayResults = showAll ? results : results.slice(0, 8);

  return (
    <div css={page}>
      <div css={inner}>
        {/* Title */}
        <div css={titleRow}>
          <div css={trophyWrap}>{grade.emoji}</div>
          <h1 css={resultTitle}>{grade.label}</h1>
          <p css={resultSub}>Sprint complete. Here&apos;s how you did.</p>
        </div>

        {/* Score card */}
        <div css={scoreCard}>
          <div css={bigScore}>{score}</div>
          <div css={scoreMax}>out of {maxScore} points</div>
          <div css={statsGrid}>
            <div css={stat}>
              <div
                css={statNum(
                  accuracy >= 70
                    ? C.accent3
                    : accuracy >= 50
                      ? C.accent2
                      : C.danger,
                )}
              >
                {accuracy}%
              </div>
              <div css={statLbl}>Accuracy</div>
            </div>
            <div css={stat}>
              <div css={statNum(C.accent)}>{results.length}</div>
              <div css={statLbl}>Questions</div>
            </div>
            <div css={stat}>
              <div css={statNum("rgba(255,255,255,0.7)")}>
                {formatTime(timeUsedSecs)}
              </div>
              <div css={statLbl}>Time used</div>
            </div>
          </div>
        </div>

        {/* Insights */}
        {(strengths.length > 0 || weakAreas.length > 0) && (
          <div css={insightRow}>
            {strengths.length > 0 && (
              <div css={insightCard(C.accent3, `${C.accent3}08`)}>
                <div css={insightTitle(C.accent3)}>
                  <TrendingUp size={11} /> Strengths
                </div>
                {strengths.map((s, i) => (
                  <div key={i} css={insightItem}>
                    <CheckCircle
                      size={10}
                      style={{ color: C.accent3, flexShrink: 0 }}
                    />
                    {s}
                  </div>
                ))}
              </div>
            )}
            {weakAreas.length > 0 && (
              <div css={insightCard(C.accent2, `${C.accent2}06`)}>
                <div css={insightTitle(C.accent2)}>
                  <AlertTriangle size={11} /> Review these
                </div>
                {weakAreas.map((w, i) => (
                  <div key={i} css={insightItem}>
                    <AlertTriangle
                      size={10}
                      style={{ color: C.accent2, flexShrink: 0 }}
                    />
                    {w}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Breakdown */}
        <div css={breakdownCard}>
          <div css={breakdownHeader}>
            <Target size={13} /> Question Breakdown
          </div>
          {displayResults.map((r, i) => (
            <div key={r.questionId} css={breakdownRow(r.outcome)}>
              <span
                style={{
                  fontSize: "0.6875rem",
                  color: "rgba(255,255,255,0.25)",
                  width: 20,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              {outcomeIcon(r.outcome)}
              <span css={typeChip(r.type)}>{r.type}</span>
              <span css={questionTitle}>{r.category}</span>
              <span css={questionPoints(r.points)}>+{r.points}</span>
            </div>
          ))}
          {results.length > 8 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              style={{
                width: "100%",
                padding: "0.625rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {showAll
                ? "Show less ↑"
                : `+ ${results.length - 8} more questions`}
            </button>
          )}
        </div>

        {/* Share */}
        <div css={shareSection}>
          <div css={shareTitle}>Share your result</div>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: RADIUS.lg,
              padding: "0.875rem",
              marginBottom: "0.875rem",
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.5,
              fontStyle: "italic",
            }}
          >
            &ldquo;{shareText}&rdquo;
          </div>
          <div css={shareRow}>
            <button
              css={shareBtn(
                "rgba(255,255,255,0.06)",
                "rgba(255,255,255,0.7)",
                "rgba(255,255,255,0.1)",
              )}
              onClick={copyShare}
            >
              {copied ? (
                <>
                  <Check size={13} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={13} /> Copy text
                </>
              )}
            </button>
            <button
              css={shareBtn(
                "rgba(29,161,242,0.12)",
                "#60a5fa",
                "rgba(29,161,242,0.25)",
              )}
              onClick={shareTwitter}
            >
              <Share2 size={13} /> Share on X
            </button>
            <button
              css={shareBtn(
                "rgba(124,106,247,0.12)",
                "#c4b5fd",
                "rgba(124,106,247,0.25)",
              )}
              onClick={downloadCard}
            >
              <Download size={13} /> Download card
            </button>
          </div>
        </div>

        {/* Retry */}
        <button css={retryBtn} onClick={onRetry}>
          <RotateCcw size={15} /> Try Another Sprint
        </button>
      </div>
    </div>
  );
}

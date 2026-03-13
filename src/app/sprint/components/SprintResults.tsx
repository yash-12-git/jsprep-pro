/** @jsxImportSource @emotion/react */
"use client";

import { css, keyframes } from "@emotion/react";
import { useState, useEffect } from "react";
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Minus,
  Target,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import type { SprintSummary } from "../types";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const pop = keyframes`0%{transform:scale(0.7);opacity:0}70%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}`;
const countUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

// ─── Grade system ─────────────────────────────────────────────────────────────

interface GradeInfo {
  grade: string;
  label: string;
  sub: string;
  color: string;
  glow: string;
  bg: string;
  border: string;
  shareMsg: string;
}

function getGrade(accuracy: number): GradeInfo {
  if (accuracy >= 90)
    return {
      grade: "S",
      label: "Elite Performance",
      sub: "You're interview-ready.",
      color: "#fbbf24",
      glow: "rgba(251,191,36,0.35)",
      bg: "rgba(251,191,36,0.08)",
      border: "rgba(251,191,36,0.3)",
      shareMsg: "S-tier JavaScript interview performance",
    };
  if (accuracy >= 75)
    return {
      grade: "A",
      label: "Strong Result",
      sub: "Well above average.",
      color: "#a78bfa",
      glow: "rgba(167,139,250,0.3)",
      bg: "rgba(167,139,250,0.08)",
      border: "rgba(167,139,250,0.3)",
      shareMsg: "Strong JavaScript interview score",
    };
  if (accuracy >= 60)
    return {
      grade: "B",
      label: "Solid Effort",
      sub: "On the right track.",
      color: "#60a5fa",
      glow: "rgba(96,165,250,0.25)",
      bg: "rgba(96,165,250,0.07)",
      border: "rgba(96,165,250,0.25)",
      shareMsg: "Solid JavaScript sprint result",
    };
  if (accuracy >= 40)
    return {
      grade: "C",
      label: "Getting There",
      sub: "Keep the reps up.",
      color: "#34d399",
      glow: "rgba(52,211,153,0.2)",
      bg: "rgba(52,211,153,0.06)",
      border: "rgba(52,211,153,0.2)",
      shareMsg: "JavaScript interview practice in progress",
    };
  return {
    grade: "D",
    label: "Early Days",
    sub: "Every rep counts.",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.2)",
    bg: "rgba(251,146,60,0.06)",
    border: "rgba(251,146,60,0.2)",
    shareMsg: "Starting my JavaScript interview prep",
  };
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60),
    s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function getCategoryStats(results: SprintSummary["results"]) {
  const map = new Map<string, { correct: number; total: number }>();
  for (const r of results) {
    const e = map.get(r.category) ?? { correct: 0, total: 0 };
    e.total++;
    if (r.outcome === "correct") e.correct++;
    map.set(r.category, e);
  }
  return [...map.entries()]
    .map(([cat, v]) => ({
      cat,
      pct: Math.round((v.correct / v.total) * 100),
      ...v,
    }))
    .sort((a, b) => b.pct - a.pct);
}

// ─── Canvas image builder ─────────────────────────────────────────────────────

function rx(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function buildCard(summary: SprintSummary, g: GradeInfo): string {
  const {
    score,
    maxScore,
    accuracy,
    timeUsedSecs,
    results,
    strengths,
    weakAreas,
  } = summary;
  const W = 1200,
    H = 675;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d")!;

  // bg
  ctx.fillStyle = "#08080f";
  ctx.fillRect(0, 0, W, H);
  const grd = ctx.createRadialGradient(200, 200, 0, 200, 200, 600);
  grd.addColorStop(0, g.glow);
  grd.addColorStop(1, "transparent");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);
  // dot grid
  ctx.fillStyle = "rgba(255,255,255,0.035)";
  for (let x = 60; x < W; x += 60)
    for (let y = 60; y < H; y += 60) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

  // left panel ──────────────────────────
  // badge
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  rx(ctx, 72, 66, 200, 32, 16);
  ctx.fill();
  ctx.font = "700 12px system-ui";
  ctx.fillStyle = g.color;
  ctx.fillText("⚡  JSPREP PRO", 90, 88);

  // grade circle
  ctx.save();
  ctx.shadowColor = g.glow;
  ctx.shadowBlur = 45;
  ctx.fillStyle = g.bg;
  rx(ctx, 72, 120, 104, 104, 52);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = g.border;
  ctx.lineWidth = 2;
  rx(ctx, 72, 120, 104, 104, 52);
  ctx.stroke();
  ctx.font = "900 50px system-ui";
  ctx.fillStyle = g.color;
  ctx.textAlign = "center";
  ctx.fillText(g.grade, 124, 183);
  ctx.textAlign = "left";

  // big score
  const scoreGrd = ctx.createLinearGradient(72, 260, 72, 390);
  scoreGrd.addColorStop(0, "#ffffff");
  scoreGrd.addColorStop(1, g.color);
  ctx.font = "900 100px system-ui";
  ctx.fillStyle = scoreGrd;
  ctx.fillText(`${score}`, 72, 375);
  const sw = ctx.measureText(`${score}`).width;
  ctx.font = "700 34px system-ui";
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillText(`/${maxScore} pts`, 72 + sw + 8, 363);
  ctx.font = "700 18px system-ui";
  ctx.fillStyle = g.color;
  ctx.fillText(g.label, 72, 415);

  // stats
  const stats = [
    { label: "Accuracy", val: `${accuracy}%` },
    {
      label: "Correct",
      val: `${results.filter((r) => r.outcome === "correct").length}/${results.length}`,
    },
    { label: "Time", val: formatTime(timeUsedSecs) },
    { label: "Questions", val: `${results.length}` },
  ];
  stats.forEach((s, i) => {
    const x = 72 + i * 158;
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    rx(ctx, x, 450, 144, 72, 12);
    ctx.fill();
    ctx.font = "900 22px system-ui";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(s.val, x + 14, 485);
    ctx.font = "600 11px system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillText(s.label.toUpperCase(), x + 14, 503);
  });

  // right panel ──────────────────────────
  const RX = 770;
  ctx.font = "700 11px system-ui";
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillText("CATEGORY PERFORMANCE", RX, 98);

  const cats = getCategoryStats(results).slice(0, 5);
  cats.forEach((c, i) => {
    const y = 120 + i * 68;
    ctx.font = "600 14px system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(c.cat, RX, y);
    const col = c.pct >= 80 ? "#6af7c0" : c.pct >= 50 ? "#f7c76a" : "#f76a6a";
    ctx.font = "800 14px system-ui";
    ctx.fillStyle = col;
    ctx.textAlign = "right";
    ctx.fillText(`${c.pct}%`, RX + 370, y);
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    rx(ctx, RX, y + 10, 370, 6, 3);
    ctx.fill();
    ctx.fillStyle = col;
    rx(ctx, RX, y + 10, Math.max(6, (370 * c.pct) / 100), 6, 3);
    ctx.fill();
  });

  const insY = 120 + cats.length * 68 + 18;
  if (strengths.length > 0) {
    ctx.font = "700 11px system-ui";
    ctx.fillStyle = "#6af7c0";
    ctx.fillText("✓ STRENGTHS", RX, insY);
    strengths.slice(0, 2).forEach((s, i) => {
      ctx.font = "500 13px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(`• ${s}`, RX, insY + 18 + i * 20);
    });
  }
  if (weakAreas.length > 0) {
    ctx.font = "700 11px system-ui";
    ctx.fillStyle = "#f7c76a";
    ctx.fillText("↻ FOCUS ON", RX + 200, insY);
    weakAreas.slice(0, 2).forEach((w, i) => {
      ctx.font = "500 13px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(`• ${w}`, RX + 200, insY + 18 + i * 20);
    });
  }

  // footer strip
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(0, 612, W, 63);
  ctx.font = "700 15px system-ui";
  ctx.fillStyle = g.color;
  ctx.fillText("jsprep.pro/sprint", 72, 651);
  ctx.font = "500 14px system-ui";
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.textAlign = "right";
  ctx.fillText(
    "JavaScript Interview Sprint  •  Can you beat my score?",
    W - 72,
    651,
  );
  ctx.textAlign = "left";

  return cv.toDataURL("image/png");
}

// ─── Accuracy arc ─────────────────────────────────────────────────────────────

function AccuracyArc({ pct, color }: { pct: number; color: string }) {
  const r = 44,
    circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <svg
        width="68"
        height="68"
        viewBox="0 0 100 100"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="9"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition:
              "stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1) 0.5s",
          }}
        />
      </svg>
      <div
        style={{ fontSize: "0.8125rem", fontWeight: 800, color, marginTop: -4 }}
      >
        {pct}%
      </div>
      <div
        style={{
          fontSize: "0.55rem",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        accuracy
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props {
  summary: SprintSummary;
  onRetry: () => void;
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const g = getGrade(accuracy);
  const catStats = getCategoryStats(results);
  const correct = results.filter((r) => r.outcome === "correct").length;
  const display = showAll ? results : results.slice(0, 7);

  const siteUrl = "https://jsprep.pro/sprint";
  const shareText = `I scored ${score}/${maxScore} on the JSPrep JavaScript Interview Sprint 🏁\n${accuracy}% accuracy • ${correct}/${results.length} correct\n\n${g.shareMsg}. Can you beat my score?\n👉 ${siteUrl}`;
  const twitterText = `I scored ${score}/${maxScore} in the JSPrep JS Interview Sprint (${accuracy}% accuracy).\n\nGrade: ${g.grade} — ${g.label}. Can you beat me? 👇`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(siteUrl)}`;

  async function copyText() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* noop */
    }
  }
  function downloadCard() {
    if (!mounted) return;
    const a = document.createElement("a");
    a.download = `jsprep-sprint-${g.grade}-${score}pts.png`;
    a.href = buildCard(summary, g);
    a.click();
  }

  const S = {
    page: css`
      min-height: 100vh;
      padding: 2rem 1rem 5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    `,
    wrap: css`
      width: 100%;
      max-width: 580px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    `,

    // Hero
    hero: css`
      position: relative;
      overflow: hidden;
      background: ${g.bg};
      border: 1px solid ${g.border};
      border-radius: 1.5rem;
      padding: 1.75rem 1.75rem 1.5rem;
      animation: ${fadeUp} 0.5s ease both;
      box-shadow: 0 0 70px ${g.glow};
    `,
    heroBg: css`
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(
        ellipse 55% 45% at 85% 15%,
        ${g.glow} 0%,
        transparent 70%
      );
    `,
    gradeRow: css`
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 1.375rem;
    `,
    gradeBadge: css`
      width: 76px;
      height: 76px;
      border-radius: 50%;
      flex-shrink: 0;
      border: 2px solid ${g.border};
      background: ${g.bg};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.375rem;
      font-weight: 900;
      color: ${g.color};
      letter-spacing: -0.04em;
      box-shadow: 0 0 32px ${g.glow};
      animation: ${pop} 0.55s ease 0.1s both;
    `,
    h1: css`
      font-size: 1.4375rem;
      font-weight: 900;
      color: white;
      letter-spacing: -0.02em;
      margin-bottom: 0.2rem;
      animation: ${fadeUp} 0.4s ease 0.15s both;
    `,
    sub: css`
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.4);
      animation: ${fadeUp} 0.4s ease 0.2s both;
    `,
    scoreRow: css`
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 1.375rem;
    `,
    bigScore: css`
      font-size: 3.25rem;
      font-weight: 900;
      letter-spacing: -0.04em;
      line-height: 1;
      background: linear-gradient(135deg, ${g.color}, #ffffff 80%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: ${countUp} 0.5s ease 0.25s both;
    `,
    maxScore: css`
      font-size: 1.125rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.28);
      margin-bottom: 0.3rem;
    `,
    ptsLbl: css`
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.3);
      font-weight: 600;
      margin-top: 0.25rem;
    `,
    statsGrid: css`
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      padding-top: 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.07);
      animation: ${fadeIn} 0.5s ease 0.35s both;
    `,
    statBox: css`
      .val {
        font-size: 1.1875rem;
        font-weight: 900;
        color: white;
        letter-spacing: -0.02em;
      }
      .lbl {
        font-size: 0.6rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.28);
        margin-top: 0.2rem;
      }
      text-align: center;
    `,

    // Category
    panel: css`
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 1.25rem;
      padding: 1.25rem;
      animation: ${fadeUp} 0.5s ease 0.25s both;
    `,
    panelHead: css`
      font-size: 0.675rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(255, 255, 255, 0.32);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    `,
    catName: css`
      font-size: 0.8125rem;
      color: rgba(255, 255, 255, 0.65);
      font-weight: 600;
    `,
    catPct: css`
      font-size: 0.75rem;
      font-weight: 800;
      color: white;
    `,
    barTrack: css`
      height: 4px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 2px;
      margin-top: 0.375rem;
      margin-bottom: 0.625rem;
      overflow: hidden;
    `,

    // Insight grid
    insightGrid: css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      animation: ${fadeUp} 0.5s ease 0.3s both;
      @media (max-width: 400px) {
        grid-template-columns: 1fr;
      }
    `,
    insightBox: (col: string, bg: string, border: string) => css`
      background: ${bg};
      border: 1px solid ${border};
      border-radius: 1rem;
      padding: 1rem;
    `,
    insightHead: (col: string) => css`
      font-size: 0.6rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${col};
      margin-bottom: 0.625rem;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    `,
    insightChip: css`
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.55);
      padding: 0.2rem 0;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      &:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        margin-bottom: 0.25rem;
        padding-bottom: 0.25rem;
      }
    `,

    // Breakdown
    bkCard: css`
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 1.25rem;
      overflow: hidden;
      animation: ${fadeUp} 0.5s ease 0.35s both;
    `,
    bkRow: (o: string) => css`
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.5625rem 1.125rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      &:last-child {
        border: none;
      }
      ${o === "correct" ? "background:rgba(106,247,192,0.02);" : ""}
    `,
    typeChip: (t: string) => css`
      font-size: 0.5rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 6px;
      border-radius: 6px;
      flex-shrink: 0;
      ${t === "theory"
        ? "background:rgba(196,181,253,0.15);color:#c4b5fd;"
        : t === "output"
          ? "background:rgba(106,247,192,0.15);color:#6af7c0;"
          : "background:rgba(247,106,106,0.15);color:#f76a6a;"}
    `,
    bkTitle: css`
      flex: 1;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.55);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    bkPts: (p: number) => css`
      font-size: 0.7rem;
      font-weight: 800;
      flex-shrink: 0;
      color: ${p >= 10
        ? "#6af7c0"
        : p > 0
          ? "#f7c76a"
          : "rgba(255,255,255,0.2)"};
    `,

    // Share
    shareCard: css`
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 1.25rem;
      padding: 1.25rem;
      animation: ${fadeUp} 0.5s ease 0.4s both;
    `,
    sharePreview: css`
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 0.875rem;
      padding: 0.875rem 1rem;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.4);
      line-height: 1.65;
      font-style: italic;
      margin-bottom: 1rem;
      white-space: pre-line;
    `,
    shareBtns: css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.625rem;
      @media (max-width: 380px) {
        grid-template-columns: 1fr;
      }
    `,
    sBtn: (bg: string, col: string, border: string) => css`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4375rem;
      padding: 0.6875rem 0.875rem;
      border-radius: 0.875rem;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      background: ${bg};
      border: 1px solid ${border};
      color: ${col};
      transition: all 0.15s;
      white-space: nowrap;
      &:hover {
        filter: brightness(1.15);
        transform: translateY(-1px);
      }
      &:active {
        transform: translateY(0);
      }
    `,
    copyFull: css`
      grid-column: 1/-1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4375rem;
      padding: 0.6875rem;
      border-radius: 0.875rem;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.09);
      color: rgba(255, 255, 255, 0.55);
      transition: all 0.15s;
      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: white;
      }
    `,

    // CTA row
    ctaRow: css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      animation: ${fadeUp} 0.5s ease 0.45s both;
      @media (max-width: 380px) {
        grid-template-columns: 1fr;
      }
    `,
    retryBtn: css`
      padding: 0.875rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 800;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.15s;
      &:hover {
        background: rgba(255, 255, 255, 0.09);
        color: white;
      }
    `,
    practiceBtn: css`
      padding: 0.875rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 800;
      background: linear-gradient(135deg, #7c6af7, #a78bfa);
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      text-decoration: none;
      transition: all 0.15s;
      &:hover {
        filter: brightness(1.1);
        transform: translateY(-1px);
      }
    `,
  };

  return (
    <div css={S.page}>
      <div css={S.wrap}>
        {/* ── Hero card ── */}
        <div css={S.hero}>
          <div css={S.heroBg} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div css={S.gradeRow}>
              <div css={S.gradeBadge}>{g.grade}</div>
              <div>
                <div css={S.h1}>{g.label}</div>
                <div css={S.sub}>{g.sub}</div>
              </div>
            </div>

            <div css={S.scoreRow}>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.375rem",
                  }}
                >
                  <span css={S.bigScore}>{score}</span>
                  <span css={S.maxScore}>/{maxScore}</span>
                </div>
                <div css={S.ptsLbl}>points scored</div>
              </div>
              <AccuracyArc pct={accuracy} color={g.color} />
            </div>

            <div css={S.statsGrid}>
              {[
                { val: `${correct}/${results.length}`, lbl: "Correct" },
                { val: String(results.length), lbl: "Questions" },
                { val: formatTime(timeUsedSecs), lbl: "Time used" },
              ].map((s) => (
                <div key={s.lbl} css={S.statBox}>
                  <div className="val">{s.val}</div>
                  <div className="lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Category bars ── */}
        {catStats.length > 0 && (
          <div css={S.panel}>
            <div css={S.panelHead}>
              <Target size={11} /> Category Breakdown
            </div>
            {catStats.map((c) => {
              const col =
                c.pct >= 80 ? "#6af7c0" : c.pct >= 50 ? "#f7c76a" : "#f76a6a";
              return (
                <div key={c.cat}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span css={S.catName}>{c.cat}</span>
                    <span css={S.catPct} style={{ color: col }}>
                      {c.correct}/{c.total}
                    </span>
                  </div>
                  <div css={S.barTrack}>
                    <div
                      style={{
                        height: "100%",
                        width: `${c.pct}%`,
                        background: col,
                        borderRadius: 2,
                        transition:
                          "width 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.3s",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Insights ── */}
        {(strengths.length > 0 || weakAreas.length > 0) && (
          <div css={S.insightGrid}>
            {strengths.length > 0 && (
              <div
                css={S.insightBox(
                  "#6af7c0",
                  "rgba(106,247,192,0.05)",
                  "rgba(106,247,192,0.15)",
                )}
              >
                <div css={S.insightHead("#6af7c0")}>
                  <TrendingUp size={10} />
                  Strengths
                </div>
                {strengths.map((s, i) => (
                  <div key={i} css={S.insightChip}>
                    <CheckCircle
                      size={10}
                      style={{ color: "#6af7c0", flexShrink: 0 }}
                    />
                    {s}
                  </div>
                ))}
              </div>
            )}
            {weakAreas.length > 0 && (
              <div
                css={S.insightBox(
                  "#f7c76a",
                  "rgba(247,199,106,0.05)",
                  "rgba(247,199,106,0.15)",
                )}
              >
                <div css={S.insightHead("#f7c76a")}>
                  <AlertTriangle size={10} />
                  Focus On
                </div>
                {weakAreas.map((w, i) => (
                  <div key={i} css={S.insightChip}>
                    <AlertTriangle
                      size={10}
                      style={{ color: "#f7c76a", flexShrink: 0 }}
                    />
                    {w}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Question breakdown ── */}
        <div css={S.bkCard}>
          <div
            css={S.panelHead}
            style={{
              padding: "0.875rem 1.125rem",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              margin: 0,
            }}
          >
            <Target size={11} />
            Question Breakdown
          </div>
          {display.map((r, i) => (
            <div key={r.questionId} css={S.bkRow(r.outcome)}>
              <span
                style={{
                  fontSize: "0.6rem",
                  color: "rgba(255,255,255,0.2)",
                  width: 18,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              {r.outcome === "correct" ? (
                <CheckCircle
                  size={13}
                  style={{ color: "#6af7c0", flexShrink: 0 }}
                />
              ) : r.outcome === "attempted" ? (
                <XCircle
                  size={13}
                  style={{ color: "#f7c76a", flexShrink: 0 }}
                />
              ) : (
                <Minus
                  size={13}
                  style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }}
                />
              )}
              <span css={S.typeChip(r.type)}>{r.type}</span>
              <span css={S.bkTitle}>{r.category}</span>
              <span css={S.bkPts(r.points)}>+{r.points}</span>
            </div>
          ))}
          {results.length > 7 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              style={{
                width: "100%",
                padding: "0.625rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {showAll ? "↑ Show less" : `+ ${results.length - 7} more`}
            </button>
          )}
        </div>

        {/* ── Share ── */}
        <div css={S.shareCard}>
          <div css={S.panelHead} style={{ marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.875rem" }}>📣</span> Share your result
          </div>
          <div css={S.sharePreview}>{shareText}</div>

          <div css={S.shareBtns}>
            {/* LinkedIn */}
            <button
              css={S.sBtn(
                "rgba(10,102,194,0.15)",
                "#93c5fd",
                "rgba(10,102,194,0.35)",
              )}
              onClick={() =>
                window.open(
                  linkedInUrl,
                  "_blank",
                  "noopener,width=600,height=600",
                )
              }
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Share on LinkedIn
            </button>

            {/* X */}
            <button
              css={S.sBtn(
                "rgba(255,255,255,0.06)",
                "rgba(255,255,255,0.75)",
                "rgba(255,255,255,0.12)",
              )}
              onClick={() =>
                window.open(
                  twitterUrl,
                  "_blank",
                  "noopener,width=600,height=400",
                )
              }
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
              Share on X
            </button>

            {/* Download */}
            <button
              css={S.sBtn(
                "rgba(124,106,247,0.1)",
                "#c4b5fd",
                "rgba(124,106,247,0.25)",
              )}
              onClick={downloadCard}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Card
            </button>

            {/* Copy */}
            <button css={S.copyFull} onClick={copyText}>
              {copied ? (
                <>
                  <Check size={13} style={{ color: "#6af7c0" }} />
                  <span style={{ color: "#6af7c0" }}>Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy share text
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Bottom actions ── */}
        <div css={S.ctaRow}>
          <button css={S.retryBtn} onClick={onRetry}>
            <RotateCcw size={14} /> New Sprint
          </button>
          <a href="/dashboard" css={S.practiceBtn}>
            Practice Weak Areas <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

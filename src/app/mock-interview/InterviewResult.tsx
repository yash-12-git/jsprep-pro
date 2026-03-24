/** @jsxImportSource @emotion/react */
// components/interview/InterviewResult.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { css, keyframes } from "@emotion/react";
import {
  RotateCcw,
  BookOpen,
  ExternalLink,
  ChevronLeft,
  Copy,
  Check,
  Download,
} from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import type {
  ScoreBreakdown,
  SetupConfig,
} from "@/app/mock-interview/MockInterviewClient";
import type { TopicRef } from "@/app/mock-interview/page";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  scorecard: ScoreBreakdown;
  config: SetupConfig;
  topics: TopicRef[];
  saving: boolean;
  onRetake: () => void;
}

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const countUp = keyframes`from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}`;

// ─── Color helpers ────────────────────────────────────────────────────────────

const scoreHex = (s: number) =>
  s >= 75 ? "#22c55e" : s >= 50 ? "#f59e0b" : "#ef4444";

const verdictMeta = (v: string) =>
  ({
    Ready: {
      bg: C.greenSubtle,
      border: C.greenBorder,
      text: C.green,
      symbol: "✓",
      glow: "rgba(34,197,94,0.3)",
    },
    "Almost Ready": {
      bg: C.amberSubtle,
      border: C.amberBorder,
      text: C.amber,
      symbol: "≈",
      glow: "rgba(245,158,11,0.3)",
    },
    "Not Ready": {
      bg: C.redSubtle,
      border: C.redBorder,
      text: C.red,
      symbol: "✗",
      glow: "rgba(239,68,68,0.3)",
    },
  })[v] ?? {
    bg: C.bgSubtle,
    border: C.border,
    text: C.text,
    symbol: "?",
    glow: "rgba(0,0,0,0)",
  };

// ─── Canvas share card ────────────────────────────────────────────────────────

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

function buildCanvasCard(
  scorecard: ScoreBreakdown,
  config: SetupConfig,
): string {
  const W = 1200,
    H = 675;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d")!;
  const vm = verdictMeta(scorecard.verdict);
  const col = scoreHex(scorecard.overall);

  // Background + glow
  ctx.fillStyle = "#08080f";
  ctx.fillRect(0, 0, W, H);
  const grd = ctx.createRadialGradient(220, 220, 0, 220, 220, 560);
  grd.addColorStop(0, vm.glow);
  grd.addColorStop(1, "transparent");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // Dot grid
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  for (let x = 60; x < W; x += 60)
    for (let y = 60; y < H; y += 60) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

  // Brand pill
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  rx(ctx, 72, 60, 220, 34, 17);
  ctx.fill();
  ctx.font = "700 12px system-ui";
  ctx.fillStyle = col;
  ctx.fillText("⚡  JSPREP MOCK INTERVIEW", 90, 83);

  // Verdict circle
  ctx.save();
  ctx.shadowColor = vm.glow;
  ctx.shadowBlur = 40;
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  rx(ctx, 72, 116, 100, 100, 50);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = vm.text;
  ctx.lineWidth = 2;
  rx(ctx, 72, 116, 100, 100, 50);
  ctx.stroke();
  ctx.font = "900 46px system-ui";
  ctx.fillStyle = vm.text;
  ctx.textAlign = "center";
  ctx.fillText(vm.symbol, 122, 178);
  ctx.textAlign = "left";

  // Big score
  const sg = ctx.createLinearGradient(72, 255, 72, 390);
  sg.addColorStop(0, "#ffffff");
  sg.addColorStop(1, col);
  ctx.font = "900 110px system-ui";
  ctx.fillStyle = sg;
  ctx.fillText(`${scorecard.overall}`, 72, 380);
  const sw = ctx.measureText(`${scorecard.overall}`).width;
  ctx.font = "700 32px system-ui";
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillText("/100", 72 + sw + 8, 368);
  ctx.font = "700 18px system-ui";
  ctx.fillStyle = vm.text;
  ctx.fillText(scorecard.verdict, 72, 418);

  // Sub-scores
  const subs: [string, number][] = [
    ["Concepts", scorecard.concepts],
    ["Prob Solving", scorecard.problemSolving],
    ["Communication", scorecard.communication],
    ["Depth", scorecard.depth],
  ];
  subs.forEach(([label, val], i) => {
    const x = 72 + i * 158;
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    rx(ctx, x, 448, 144, 74, 10);
    ctx.fill();
    ctx.font = "900 24px system-ui";
    ctx.fillStyle = scoreHex(val);
    ctx.fillText(`${val}`, x + 14, 484);
    ctx.font = "600 10px system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.32)";
    ctx.fillText(label.toUpperCase(), x + 14, 502);
  });

  // Right col — config
  const RX = 760;
  ctx.font = "700 11px system-ui";
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillText("INTERVIEW CONFIG", RX, 98);
  ctx.font = "600 15px system-ui";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fillText(
    `${config.company}  ·  ${config.role}  ·  ${config.experience}`,
    RX,
    124,
  );
  ctx.font = "500 13px system-ui";
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillText(`Focus: ${config.focus}`, RX, 146);

  // Strengths
  let rightY = 196;
  if (scorecard.strengths.length) {
    ctx.font = "700 11px system-ui";
    ctx.fillStyle = "#6af7c0";
    ctx.fillText("✓  STRENGTHS", RX, rightY);
    rightY += 20;
    scorecard.strengths.slice(0, 3).forEach((s) => {
      ctx.font = "500 13px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillText(`• ${s}`, RX, rightY);
      rightY += 22;
    });
    rightY += 16;
  }
  // Weaknesses
  if (scorecard.weaknesses.length) {
    ctx.font = "700 11px system-ui";
    ctx.fillStyle = "#f7c76a";
    ctx.fillText("↻  IMPROVE", RX, rightY);
    rightY += 20;
    scorecard.weaknesses.slice(0, 3).forEach((w) => {
      ctx.font = "500 13px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillText(`• ${w}`, RX, rightY);
      rightY += 22;
    });
  }

  // Footer
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(0, 610, W, 65);
  ctx.font = "700 15px system-ui";
  ctx.fillStyle = col;
  ctx.fillText("jsprep.pro/mock-interview", 72, 650);
  ctx.font = "500 14px system-ui";
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.textAlign = "right";
  ctx.fillText(
    "JavaScript Mock Interview  •  Can you beat my score?",
    W - 72,
    650,
  );
  ctx.textAlign = "left";

  return cv.toDataURL("image/png");
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const wrap = css`
  max-width: 40rem;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 5rem;
`;
const backBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8125rem;
  color: ${C.muted};
  font-weight: 500;
  transition: color 0.12s;
  margin-bottom: 1.25rem;
  &:hover {
    color: ${C.text};
  }
`;

const shareCard = css`
  position: relative;
  background: linear-gradient(140deg, #0d1117 0%, #161b27 60%, #0d1117 100%);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: ${RADIUS.lg};
  padding: 2rem 2rem 1.5rem;
  margin-bottom: 1.25rem;
  overflow: hidden;
  animation: ${fadeUp} 0.3s ease;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }
`;
const cardHeader = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
`;
const cardBrand = css`
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
`;
const cardDots = css`
  display: flex;
  gap: 5px;
`;
const cardDot = (c: string) => css`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${c};
`;
const scoreCentre = css`
  text-align: center;
  margin-bottom: 1.75rem;
`;
const scoreNum = (s: number) => css`
  font-size: clamp(4rem, 14vw, 6rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: ${scoreHex(s)};
  animation: ${countUp} 0.4s ease;
  display: inline-block;
`;
const scoreDenom = css`
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
  margin-left: 2px;
`;
const verdictPill = (v: string) => {
  const m = verdictMeta(v);
  return css`
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 4px 14px;
    border-radius: 9999px;
    margin-top: 0.625rem;
    background: ${m.bg};
    border: 1px solid ${m.border};
    font-size: 0.8125rem;
    font-weight: 700;
    color: ${m.text};
  `;
};
const miniGrid = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  @media (max-width: 420px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const miniCell = (s: number) => css`
  padding: 0.75rem 0.5rem;
  border-radius: ${RADIUS.md};
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  text-align: center;
  .n {
    font-size: 1.375rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.02em;
    color: ${scoreHex(s)};
  }
  .l {
    font-size: 0.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: rgba(255, 255, 255, 0.3);
    margin-top: 3px;
  }
`;
const cardFooter = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 1rem;
`;
const cardConfig = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 500;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;
const configDot = css`
  color: rgba(255, 255, 255, 0.15);
`;
const watermark = css`
  font-size: 0.6875rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.04em;
`;

// ── Social share panel ──
const sharePanelWrap = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1.25rem;
  margin-bottom: 0.75rem;
  animation: ${fadeUp} 0.3s ease;
`;
const sharePanelHead = css`
  font-size: 0.675rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.muted};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;
const sharePreview = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.md};
  padding: 0.875rem 1rem;
  font-size: 0.8rem;
  color: ${C.muted};
  line-height: 1.65;
  font-style: italic;
  margin-bottom: 1rem;
  white-space: pre-line;
`;
const shareBtnGrid = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;
const sBtn = (bg: string, col: string, border: string) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4375rem;
  padding: 0.625rem 0.875rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  background: ${bg};
  border: 1px solid ${border};
  color: ${col};
  transition: all 0.12s;
  &:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
  white-space: nowrap;
`;
const copyFull = css`
  grid-column: 1/-1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4375rem;
  padding: 0.625rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  background: ${C.bg};
  border: 1px solid ${C.border};
  color: ${C.muted};
  transition: all 0.12s;
  &:hover {
    border-color: ${C.borderStrong};
    color: ${C.text};
  }
`;

// ── Breakdown ──
const section = css`
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  overflow: hidden;
  margin-bottom: 0.75rem;
  animation: ${fadeUp} 0.3s ease;
`;
const sectHead = (c: string) => css`
  padding: 0.5rem 1rem;
  background: ${C.bgSubtle};
  border-bottom: 1px solid ${C.border};
  font-size: 0.625rem;
  font-weight: 800;
  color: ${c};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;
const sectBody = css`
  padding: 0.875rem 1rem;
`;
const listItem = css`
  display: flex;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: ${C.muted};
  line-height: 1.65;
  margin-bottom: 0.375rem;
  &:last-child {
    margin-bottom: 0;
  }
`;
const listBullet = (c: string) => css`
  flex-shrink: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${c};
  margin-top: 0.45rem;
`;
const assessText = css`
  font-size: 0.9375rem;
  color: ${C.text};
  line-height: 1.8;
`;

// ── Topics ──
const topicGrid = css`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;
const topicLink = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0.875rem;
  border-radius: ${RADIUS.md};
  border: 1px solid ${C.border};
  background: ${C.bg};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${C.text};
  text-decoration: none;
  transition: all 0.12s;
  &:hover {
    border-color: ${C.accent};
    background: ${C.accentSubtle};
    color: ${C.accentText};
  }
`;
const topicTitle = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const topicDot = css`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${C.accent};
  flex-shrink: 0;
`;

// ── Bottom ──
const bottomBar = css`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.75rem;
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;
const btnPri = css`
  flex: 1;
  padding: 0.75rem 1.25rem;
  border-radius: ${RADIUS.md};
  background: ${C.text};
  color: ${C.bg};
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: opacity 0.12s;
  &:hover {
    opacity: 0.88;
  }
`;
const btnSec = css`
  flex: 1;
  padding: 0.75rem 1.25rem;
  border-radius: ${RADIUS.md};
  background: transparent;
  color: ${C.text};
  border: 1px solid ${C.border};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: all 0.12s;
  &:hover {
    border-color: ${C.borderStrong};
    background: ${C.bgHover};
  }
`;
const savingNote = css`
  text-align: center;
  font-size: 0.75rem;
  color: ${C.muted};
  margin-top: 0.75rem;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function InterviewResult({
  scorecard,
  config,
  topics,
  saving,
  onRetake,
}: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const suggestedTopics = useMemo(() => {
    const haystack = [
      ...scorecard.weaknesses,
      ...scorecard.suggestions,
      config.focus,
    ]
      .join(" ")
      .toLowerCase();
    const matched = topics.filter((t) =>
      t.title
        .toLowerCase()
        .split(" ")
        .some((w) => w.length > 3 && haystack.includes(w)),
    );
    return (matched.length >= 2 ? matched : topics).slice(0, 6);
  }, [scorecard, topics, config.focus]);

  const siteUrl = "https://jsprep.pro/mock-interview";
  const shareStr = useMemo(
    () =>
      `🎯 Mock Interview Result — jsprep.pro\n` +
      `${config.company} · ${config.role} · ${config.experience}\n\n` +
      `Score: ${scorecard.overall}/100 — ${scorecard.verdict}\n\n` +
      `Concepts: ${scorecard.concepts}   Problem Solving: ${scorecard.problemSolving}\n` +
      `Communication: ${scorecard.communication}   Depth: ${scorecard.depth}\n\n` +
      (scorecard.strengths.length
        ? `✅ Strengths:\n${scorecard.strengths.map((s) => `  • ${s}`).join("\n")}\n\n`
        : "") +
      (scorecard.weaknesses.length
        ? `❌ To improve:\n${scorecard.weaknesses.map((w) => `  • ${w}`).join("\n")}\n\n`
        : "") +
      `Can you beat my score? 👉 ${siteUrl}`,
    [scorecard, config],
  );

  const twitterText = `I scored ${scorecard.overall}/100 in a @jsprep_pro JS Mock Interview (${scorecard.verdict}).\n\nConcepts: ${scorecard.concepts} · Problem Solving: ${scorecard.problemSolving} · Depth: ${scorecard.depth}\n\nCan you beat me? 👇`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(siteUrl)}`;

  async function copyText() {
    try {
      await navigator.clipboard.writeText(shareStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  }

  function downloadCard() {
    if (!mounted) return;
    const a = document.createElement("a");
    a.download = `jsprep-interview-${scorecard.overall}pts.png`;
    a.href = buildCanvasCard(scorecard, config);
    a.click();
  }

  const vm = verdictMeta(scorecard.verdict);

  return (
    <div css={wrap}>
      <button css={backBtn} onClick={onRetake}>
        <ChevronLeft size={15} />
        New Interview
      </button>

      {/* ─── Dark share card ─────────────────────────────── */}
      <div css={shareCard}>
        <div css={cardHeader}>
          <span css={cardBrand}>Mock Interview</span>
          <div css={cardDots}>
            <span css={cardDot("#ef4444")} />
            <span css={cardDot("#f59e0b")} />
            <span css={cardDot("#22c55e")} />
          </div>
        </div>
        <div css={scoreCentre}>
          <div>
            <span css={scoreNum(scorecard.overall)}>{scorecard.overall}</span>
            <span css={scoreDenom}>/100</span>
          </div>
          <div>
            <span css={verdictPill(scorecard.verdict)}>
              {vm.symbol} {scorecard.verdict}
            </span>
          </div>
        </div>
        <div css={miniGrid}>
          {(
            [
              ["Concepts", scorecard.concepts],
              ["Prob. Solving", scorecard.problemSolving],
              ["Communication", scorecard.communication],
              ["Depth", scorecard.depth],
            ] as [string, number][]
          ).map(([label, val]) => (
            <div key={label} css={miniCell(val)}>
              <div className="n">{val}</div>
              <div className="l">{label}</div>
            </div>
          ))}
        </div>
        <div css={cardFooter}>
          <div css={cardConfig}>
            <span>{config.company}</span>
            <span css={configDot}>·</span>
            <span>{config.role}</span>
            <span css={configDot}>·</span>
            <span>{config.experience}</span>
          </div>
          <span css={watermark}>jsprep.pro</span>
        </div>
      </div>

      {/* ─── Social share panel ──────────────────────────── */}
      <div css={sharePanelWrap}>
        <div css={sharePanelHead}>
          <span style={{ fontSize: ".875rem" }}>📣</span> Share your result
        </div>
        <div css={sharePreview}>{shareStr}</div>
        <div css={shareBtnGrid}>
          {/* LinkedIn */}
          <button
            css={sBtn(
              "rgba(10,102,194,0.08)",
              "#1d6fa8",
              "rgba(10,102,194,0.2)",
            )}
            onClick={() =>
              window.open(
                linkedInUrl,
                "_blank",
                "noopener,width=600,height=600",
              )
            }
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Share on LinkedIn
          </button>

          {/* X / Twitter */}
          <button
            css={sBtn(C.bgSubtle, C.text, C.border)}
            onClick={() =>
              window.open(twitterUrl, "_blank", "noopener,width=600,height=400")
            }
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
            Share on X
          </button>

          {/* Download card */}
          <button
            css={sBtn(C.accentSubtle, C.accentText, C.border)}
            onClick={downloadCard}
          >
            <Download size={13} />
            Download Card
          </button>

          {/* Copy — full width */}
          <button css={copyFull} onClick={copyText}>
            {copied ? (
              <>
                <Check size={13} style={{ color: C.green }} />
                <span style={{ color: C.green }}>Copied to clipboard!</span>
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

      {/* ─── Assessment ──────────────────────────────────── */}
      {scorecard.rawFeedback && (
        <div css={section}>
          <div css={sectHead(C.text)}>Assessment</div>
          <div css={sectBody}>
            <p css={assessText}>{scorecard.rawFeedback}</p>
          </div>
        </div>
      )}

      {/* ─── Strengths ───────────────────────────────────── */}
      {scorecard.strengths.length > 0 && (
        <div css={section}>
          <div css={sectHead(C.green)}>✓ Strengths</div>
          <div css={sectBody}>
            <div css={topicGrid}>
              {scorecard.strengths.map((s, i) => (
                <div key={i} css={listItem}>
                  <span css={listBullet(C.green)} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Weaknesses ──────────────────────────────────── */}
      {scorecard.weaknesses.length > 0 && (
        <div css={section}>
          <div css={sectHead(C.red)}>✗ Areas to Improve</div>
          <div css={sectBody}>
            <div css={topicGrid}>
              {scorecard.weaknesses.map((w, i) => (
                <div key={i} css={listItem}>
                  <span css={listBullet(C.red)} />
                  {w}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Suggestions ─────────────────────────────────── */}
      {scorecard.suggestions.length > 0 && (
        <div css={section}>
          <div css={sectHead(C.accent)}>→ Next Steps</div>
          <div css={sectBody}>
            <div css={topicGrid}>
              {scorecard.suggestions.map((s, i) => (
                <div key={i} css={listItem}>
                  <span css={listBullet(C.accent)} />
                  <span
                    dangerouslySetInnerHTML={{
                      __html: s.replace(
                        /(https:\/\/jsprep\.pro\/[\w-]+)/g,
                        '<a href="$1" style="color:inherit;text-decoration:underline;text-underline-offset:3px" target="_blank" rel="noopener">$1</a>',
                      ),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Recommended Topics ──────────────────────────── */}
      {suggestedTopics.length > 0 && (
        <div css={section}>
          <div css={sectHead(C.accent)}>📚 Recommended Study Topics</div>
          <div css={sectBody}>
            <div css={topicGrid}>
              {suggestedTopics.map((t) => (
                <a key={t.slug} href={`/${t.slug}`} css={topicLink}>
                  <span css={topicTitle}>
                    <span css={topicDot} />
                    {t.title}
                  </span>
                  <ExternalLink
                    size={12}
                    style={{ opacity: 0.4, flexShrink: 0 }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Actions ─────────────────────────────────────── */}
      <div css={bottomBar}>
        <button css={btnPri} onClick={onRetake}>
          <RotateCcw size={14} />
          Retake Interview
        </button>
        <button css={btnSec} onClick={() => router.push("/dashboard")}>
          <BookOpen size={14} />
          Practice Topics
        </button>
      </div>

      {saving && <p css={savingNote}>Saving to history…</p>}
    </div>
  );
}

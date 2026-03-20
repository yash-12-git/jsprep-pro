/** @jsxImportSource @emotion/react */
"use client";

import { css, keyframes } from "@emotion/react";
import { useEffect, useState, useCallback } from "react";
import { Timer, Zap } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";

const timerPulse = keyframes`0%,100%{opacity:1}50%{opacity:0.5}`;
const scoreFlash = keyframes`0%{transform:scale(1)}30%{transform:scale(1.18)}100%{transform:scale(1)}`;

const hud = css`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid ${C.border};
  padding: 0.625rem 1.375rem;
`;

const hudInner = css`
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const scoreBox = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 70px;
`;

const scoreValue = css`
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1;
  color: ${C.amber};
  letter-spacing: -0.02em;
`;

const progressSection = css`
  flex: 1;
  min-width: 0;
`;

const progressMeta = css`
  display: flex;
  justify-content: space-between;
  font-size: 0.6875rem;
  color: ${C.muted};
  font-weight: 500;
  margin-bottom: 0.3125rem;
`;

const progressTrack = css`
  height: 3px;
  background: ${C.border};
  border-radius: 9999px;
  overflow: hidden;
`;

const progressFill = (pct: number) => css`
  height: 100%;
  width: ${pct}%;
  background: ${C.accent};
  border-radius: 9999px;
  transition: width 0.4s ease;
`;

const timerBox = (urgent: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.625rem;
  border-radius: ${RADIUS.md};
  background: ${urgent ? C.redSubtle : C.bgSubtle};
  border: 1px solid ${urgent ? C.redBorder : C.border};
  ${urgent && `animation: ${timerPulse} 1s ease infinite;`}
  flex-shrink: 0;
`;

const timerText = (urgent: boolean) => css`
  font-size: 0.9375rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${urgent ? C.red : C.text};
  letter-spacing: 0.02em;
`;

const qBadge = css`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${C.muted};
  white-space: nowrap;
`;

interface Props {
  score: number;
  currentIdx: number;
  totalQuestions: number;
  totalSecs: number;
  onTimeUp: () => void;
}

export default function SprintHUD({
  score,
  currentIdx,
  totalQuestions,
  totalSecs,
  onTimeUp,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(totalSecs);
  const pct = (currentIdx / totalQuestions) * 100;
  const urgent = timeLeft <= 120;

  const formatTime = useCallback((secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, onTimeUp]);

  return (
    <div css={hud}>
      <div css={hudInner}>
        {/* Score */}
        <div css={scoreBox}>
          <Zap size={14} color={C.amber} />
          <span
            css={scoreValue}
            key={score}
            style={{
              animation: score > 0 ? `${scoreFlash} 0.35s ease` : "none",
            }}
          >
            {score}
          </span>
        </div>

        {/* Progress */}
        <div css={progressSection}>
          <div css={progressMeta}>
            <span css={qBadge}>
              Q{currentIdx + 1} / {totalQuestions}
            </span>
            <span>{Math.round(pct)}% done</span>
          </div>
          <div css={progressTrack}>
            <div css={progressFill(pct)} />
          </div>
        </div>

        {/* Timer */}
        <div css={timerBox(urgent)}>
          <Timer size={13} color={urgent ? C.red : C.muted} />
          <span css={timerText(urgent)}>{formatTime(timeLeft)}</span>
        </div>
      </div>
    </div>
  );
}

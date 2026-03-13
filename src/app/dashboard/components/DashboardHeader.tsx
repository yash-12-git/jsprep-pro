/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { Flame, Zap } from "lucide-react";
import { C, BP } from "@/styles/tokens";
import type { UserProgress } from "@/lib/userProgress";

interface Props {
  user: { displayName?: string | null };
  progress: UserProgress;
  totalQuestions: number;
  masteredCount: number;
}

const S = {
  wrap: css`
    margin-bottom: 0.25rem;
  `,

  topRow: css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.125rem;
  `,

  left: css`
    flex: 1;
    min-width: 0;
  `,

  greeting: css`
    font-family: "Syne", sans-serif;
    font-size: clamp(1.375rem, 5vw, 1.75rem);
    font-weight: 800;
    color: white;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin-bottom: 0.25rem;
  `,

  subLine: css`
    font-size: 0.8125rem;
    color: rgba(255, 255, 255, 0.38);
    font-weight: 500;
  `,

  pills: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    flex-wrap: wrap;
    justify-content: flex-end;
  `,

  streakPill: css`
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.75rem;
    font-weight: 800;
    color: #fb923c;
    background: rgba(251, 146, 60, 0.1);
    border: 1px solid rgba(251, 146, 60, 0.22);
    padding: 0.3125rem 0.625rem;
    border-radius: 100px;
  `,

  proPill: css`
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.625rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #7c6af7;
    background: rgba(124, 106, 247, 0.12);
    border: 1px solid rgba(124, 106, 247, 0.25);
    padding: 0.3125rem 0.625rem;
    border-radius: 100px;
  `,

  progressBlock: css`
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 14px;
    padding: 1rem 1.125rem;
  `,

  progressTopRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.625rem;
  `,

  progressLabel: css`
    font-size: 0.6875rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.45);
  `,

  progressFraction: css`
    font-size: 0.75rem;
    font-weight: 800;
    color: white;
  `,

  progressPct: css`
    font-size: 0.6875rem;
    font-weight: 700;
    color: #6af7c0;
    margin-left: 0.3rem;
  `,

  track: css`
    height: 6px;
    background: rgba(255, 255, 255, 0.07);
    border-radius: 99px;
    overflow: hidden;
  `,

  fill: (pct: number) => css`
    height: 100%;
    width: ${pct}%;
    background: linear-gradient(90deg, #7c6af7, #6af7c0);
    border-radius: 99px;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  `,

  proNotice: css`
    margin-top: 0.5rem;
    font-size: 0.6875rem;
    color: rgba(124, 106, 247, 0.6);
  `,
};

export default function DashboardHeader({
  user,
  progress,
  totalQuestions,
  masteredCount,
}: Props) {
  const firstName = user.displayName?.split(" ")[0] ?? "there";
  const pct =
    totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0;
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div css={S.wrap}>
      <div css={S.topRow}>
        <div css={S.left}>
          <h1 css={S.greeting}>
            {timeGreeting}, {firstName} 👋
          </h1>
          <p css={S.subLine}>
            {masteredCount === 0
              ? "Ready to start prepping?"
              : pct >= 80
                ? "Almost interview-ready 🔥"
                : pct >= 50
                  ? "Solid progress — keep going"
                  : "Building momentum"}
          </p>
        </div>
        <div css={S.pills}>
          {progress.streakDays > 0 && (
            <div css={S.streakPill}>
              <Flame size={11} />
              {progress.streakDays}d streak
            </div>
          )}
          {progress.isPro && (
            <div css={S.proPill}>
              <Zap size={9} />
              PRO
            </div>
          )}
        </div>
      </div>

      {/* Progress bar — only meaningful for Pro (they can actually track mastery) */}
      <div css={S.progressBlock}>
        <div css={S.progressTopRow}>
          <span css={S.progressLabel}>
            {progress.isPro ? "Questions mastered" : "Questions available"}
          </span>
          <span css={S.progressFraction}>
            {progress.isPro ? masteredCount : totalQuestions}
            <span style={{ color: "rgba(255,255,255,0.25)" }}>
              /{totalQuestions}
            </span>
            {progress.isPro && <span css={S.progressPct}>{pct}%</span>}
          </span>
        </div>
        <div css={S.track}>
          <div css={S.fill(progress.isPro ? pct : 100)} />
        </div>
        {!progress.isPro && (
          <p css={S.proNotice}>Upgrade to Pro to track your mastery progress</p>
        )}
      </div>
    </div>
  );
}

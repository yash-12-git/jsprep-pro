/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import Image from "next/image";
import { Trophy, Zap, Flame, Crown } from "lucide-react";
import { LeaderboardEntry } from "@/lib/userProgress";
import { C, RADIUS } from "@/styles/tokens";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

// ─── Rank medal colours — kept intentional (gold/silver/bronze are universal) ─
const RANK_GOLD = "#b45309"; // amber-700 — dark enough on white
const RANK_SILVER = "#6b7280"; // gray-500
const RANK_BRONZE = "#92400e"; // amber-800

function rankTextColor(rank: number): string {
  if (rank === 1) return RANK_GOLD;
  if (rank === 2) return RANK_SILVER;
  if (rank === 3) return RANK_BRONZE;
  return C.muted;
}

function rankBg(rank: number): string {
  if (rank === 1) return C.amberSubtle;
  if (rank === 2) return C.bgSubtle;
  if (rank === 3) return C.bgSubtle;
  return "transparent";
}

function rankBorder(rank: number): string {
  if (rank === 1) return C.amberBorder;
  if (rank === 2) return C.border;
  if (rank === 3) return C.border;
  return C.border;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const wrapper = css`
  margin-bottom: 2rem;
`;

const header = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.875rem;
`;

const title = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${C.text};
`;

const resetLabel = css`
  font-size: 0.6875rem;
  color: ${C.muted};
`;

const list = css`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const row = (rank: number, isCurrentUser: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  background: ${isCurrentUser ? C.accentSubtle : C.bg};
  border: 1px solid ${isCurrentUser ? C.accent : rankBorder(rank)};
  border-radius: ${RADIUS.lg};
  transition: border-color 0.12s ease;
  &:hover {
    border-color: ${isCurrentUser ? C.accent : C.borderStrong};
  }
`;

const rankBadge = (rank: number) => css`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: ${rank <= 3 ? "0.875rem" : "0.6875rem"};
  font-weight: 700;
  background: ${rankBg(rank)};
  color: ${rankTextColor(rank)};
  border: 1px solid ${rank <= 3 ? rankBorder(rank) : C.border};
`;

const avatar = css`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${C.accentText};
  flex-shrink: 0;
  overflow: hidden;
`;

const nameArea = css`
  flex: 1;
  min-width: 0;
`;

const displayName = css`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${C.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const nameRow = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const proBadge = css`
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${C.accentText};
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  padding: 1px 5px;
  border-radius: ${RADIUS.sm};
`;

const metaLine = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  margin-top: 1px;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const xpBadge = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${C.amber};
  flex-shrink: 0;
`;

const emptyState = css`
  text-align: center;
  padding: 2rem 1rem;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
`;

const emptyTitle = css`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${C.text};
  margin-bottom: 0.375rem;
`;

const emptyDesc = css`
  font-size: 0.8rem;
  color: ${C.muted};
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ctaLink = css`
  display: inline-flex;
  padding: 0.4375rem 1.125rem;
  background: ${C.accent};
  color: #ffffff;
  border-radius: ${RADIUS.md};
  font-weight: 600;
  font-size: 0.8125rem;
  text-decoration: none;
  transition: opacity 0.12s ease;
  &:hover {
    opacity: 0.88;
  }
`;

const skeletonRow = css`
  height: 52px;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  animation: pulse 1.5s ease-in-out infinite;
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const weekNote = css`
  text-align: center;
  font-size: 0.6875rem;
  color: ${C.muted};
  margin-top: 0.625rem;
  line-height: 1.5;
`;

const RANK_EMOJI = ["🥇", "🥈", "🥉"];

function getNextMonday(): string {
  const d = new Date();
  const day = d.getDay();
  const daysUntil = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntil);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface Props {
  entries: LeaderboardEntry[]
}

export default function Leaderboard({  entries }: Props) {
    const { user, progress, loading: authLoading } = useAuth();
  return (
    <div css={wrapper}>
      <div css={header}>
        <div css={title}>
          <Trophy size={15} color={C.amber} />
          Top Learners This Week
        </div>
        <span css={resetLabel}>Resets {getNextMonday()}</span>
      </div>

      { entries.length === 0 ? (
        <div css={emptyState}>
          <div css={emptyTitle}>Nobody on the board yet!</div>
          <div css={emptyDesc}>
            Master questions to earn XP and claim your spot.
          </div>
          <Link href="/dashboard" css={ctaLink}>
            Start earning XP →
          </Link>
        </div>
      ) : (
        <div css={list}>
          {entries.map((entry, i) => {
            const rank = i + 1;
            const isCurrentUser = entry.uid === user?.uid;
            const initials = (entry.displayName ?? "?").charAt(0).toUpperCase();

            return (
              <div key={entry.uid} css={row(rank, isCurrentUser)}>
                <div css={rankBadge(rank)}>
                  {rank <= 3 ? RANK_EMOJI[rank - 1] : rank}
                </div>

                <div css={avatar}>
                  {entry.photoURL ? (
                    <Image
                      src={entry.photoURL}
                      alt={initials}
                      width={28}
                      height={28}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div css={nameArea}>
                  <div css={nameRow}>
                    <span css={displayName}>
                      {isCurrentUser ? "You" : entry.displayName}
                    </span>
                    {entry.isPro && <span css={proBadge}>PRO</span>}
                    {rank === 1 && <Crown size={11} color={C.amber} />}
                  </div>
                  <div css={metaLine}>
                    <Flame size={9} color={C.orange} />
                    {entry.streakDays}d streak
                    <span>·</span>
                    {entry.masteredCount} mastered
                  </div>
                </div>

                <div css={xpBadge}>
                  <Zap size={11} />
                  {entry.weeklyXp}
                  <span
                    style={{
                      fontSize: "0.625rem",
                      color: C.muted,
                      fontWeight: 500,
                    }}
                  >
                    XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div css={weekNote}>
        XP earned: 10 per mastered question · 8 per output/debug solve · 5 per
        quiz correct
      </div>
    </div>
  );
}

/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Trophy, Zap, Flame, Crown } from "lucide-react";
import {
  getWeeklyLeaderboard,
  type LeaderboardEntry,
} from "@/lib/userProgress";

// ─── Module-level cache — shared across all mounts, 1-hour TTL ─────────────
// Without this: every tab switch and re-mount fires 10 Firestore reads.
// With this: reads happen at most once per hour per browser session.
let _leaderboardCache: {
  entries: LeaderboardEntry[];
  fetchedAt: number;
} | null = null;
const LEADERBOARD_TTL_MS = 60 * 60 * 1000;

async function getCachedLeaderboard(topN: number): Promise<LeaderboardEntry[]> {
  if (
    _leaderboardCache &&
    Date.now() - _leaderboardCache.fetchedAt < LEADERBOARD_TTL_MS
  ) {
    return _leaderboardCache.entries;
  }
  const entries = await getWeeklyLeaderboard(topN);
  _leaderboardCache = { entries, fetchedAt: Date.now() };
  return entries;
}
import { C, RADIUS } from "@/styles/tokens";
import Link from "next/link";

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
  font-weight: 800;
  color: white;
`;

const resetLabel = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.3);
`;

const list = css`
  display: flex;
  flex-direction: column;
  gap: 0.5625rem;
`;

const row = (rank: number, isCurrentUser: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.125rem;
  background: ${isCurrentUser ? "rgba(124,106,247,0.1)" : C.card};
  border: 1px solid
    ${isCurrentUser
      ? "rgba(124,106,247,0.3)"
      : rank <= 3
        ? rankBorder(rank)
        : C.border};
  border-radius: 1rem;
  transition: border-color 0.15s;
`;

function rankBorder(rank: number) {
  if (rank === 1) return "rgba(247,199,106,0.35)";
  if (rank === 2) return "rgba(192,192,192,0.25)";
  if (rank === 3) return "rgba(205,127,50,0.25)";
  return C.border;
}

const rankBadge = (rank: number) => css`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: ${rank <= 3 ? "0.875rem" : "0.6875rem"};
  font-weight: 800;
  background: ${rank === 1
    ? "rgba(247,199,106,0.15)"
    : rank === 2
      ? "rgba(192,192,192,0.1)"
      : rank === 3
        ? "rgba(205,127,50,0.1)"
        : "rgba(255,255,255,0.04)"};
  color: ${rank === 1
    ? "#f7c76a"
    : rank === 2
      ? "#c0c0c0"
      : rank === 3
        ? "#cd7f32"
        : "rgba(255,255,255,0.3)"};
`;

const avatar = css`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(124, 106, 247, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #c4b5fd;
  flex-shrink: 0;
  overflow: hidden;
`;

const nameArea = css`
  flex: 1;
  min-width: 0;
`;

const displayName = css`
  font-size: 0.8125rem;
  font-weight: 700;
  color: white;
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
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #7c6af7;
  background: rgba(124, 106, 247, 0.15);
  padding: 1px 5px;
  border-radius: 4px;
`;

const metaLine = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.3);
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
  font-weight: 800;
  color: #f7c76a;
  flex-shrink: 0;
`;

const emptyState = css`
  text-align: center;
  padding: 2rem 1rem;
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
`;

const emptyTitle = css`
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.375rem;
`;

const emptyDesc = css`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 1rem;
`;

const ctaLink = css`
  display: inline-flex;
  padding: 0.5rem 1.25rem;
  background: #7c6af7;
  color: white;
  border-radius: 0.625rem;
  font-weight: 700;
  font-size: 0.8125rem;
  text-decoration: none;
`;

const skeletonRow = css`
  height: 52px;
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
`;

const weekNote = css`
  text-align: center;
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.2);
  margin-top: 0.625rem;
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RANK_EMOJI = ["🥇", "🥈", "🥉"];

function getNextMonday(): string {
  const d = new Date();
  const day = d.getDay();
  const daysUntil = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntil);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  currentUid?: string;
}

export default function Leaderboard({ currentUid }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCachedLeaderboard(10)
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div css={wrapper}>
      <div css={header}>
        <div css={title}>
          <Trophy size={15} color="#f7c76a" />
          Top Learners This Week
        </div>
        <span css={resetLabel}>Resets {getNextMonday()}</span>
      </div>

      {loading ? (
        <div css={list}>
          {[...Array(5)].map((_, i) => (
            <div key={i} css={skeletonRow} />
          ))}
        </div>
      ) : entries.length === 0 ? (
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
            const isCurrentUser = entry.uid === currentUid;
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
                    {rank === 1 && <Crown size={11} color="#f7c76a" />}
                  </div>
                  <div css={metaLine}>
                    <Flame size={9} color="#f97316" />
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
                      color: "rgba(255,255,255,0.35)",
                      fontWeight: 600,
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

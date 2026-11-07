/** @jsxImportSource @emotion/react */
"use client";

/**
 * app/home/components/HomeClient.tsx
 *
 * Client component — renders the greeting and mode progress cards.
 *
 * What it receives from the server (props):
 *   theoryTotal, outputTotal, debugTotal, polyfillTotal — question counts
 *   outputIds, debugIds, polyfillIds — to cross-reference against user's solvedIds
 *
 * What it fetches client-side (hooks):
 *   useAuth()         → user name, streak, isPro
 *   useUserProgress() → masteredIds (theory), solvedIds (output/debug/polyfill)
 *
 * Intentionally NO auth redirect — logged-out visitors see the page with
 * zeroed-out progress bars. This keeps the homepage publicly indexable
 * and lets marketing traffic land without a forced login wall.
 */

import LastSprint from "./LastSprint";
import ReadinessSummary from "./ReadinessSummary";
import { useMemo } from "react";
import { css } from "@emotion/react";
import { BarChart2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useQuestions";
import { C } from "@/styles/tokens";
import ManageSubscription from "@/components/ui/ManageSubscription";
import Link from "next/link";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  theoryTotal: number;
  outputTotal: number;
  debugTotal: number;
  polyfillTotal: number;
  outputIds: string[];
  debugIds: string[];
  polyfillIds: string[];
}

// ─── Motivational copy ────────────────────────────────────────────────────────

function getMotivation(
  masteredCount: number,
  totalQ: number,
  streakDays: number,
): string {
  if (streakDays >= 30)
    return `${streakDays} days straight. That's the discipline companies hire for.`;
  if (streakDays >= 14)
    return `${streakDays}-day streak. You're building something real.`;
  if (streakDays >= 7)
    return `${streakDays} days in a row. Consistency is the unfair advantage.`;
  if (masteredCount === 0)
    return "One question a day beats cramming the night before.";
  const pct = totalQ > 0 ? Math.round((masteredCount / totalQ) * 100) : 0;
  if (pct < 20)
    return `${masteredCount} concepts down. Every one widens the gap from unprepared candidates.`;
  if (pct < 40)
    return "You're past the basics. This is where most people fall off.";
  if (pct < 60)
    return "Over halfway. The hard parts are starting to feel like old friends.";
  if (pct < 80) return "Top tier of prepared candidates. Keep the pressure on.";
  if (pct < 100)
    return "One more push. You're within striking distance of fully ready.";
  return "Everything mastered. Go get that offer.";
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const page = css`
  max-width: 60rem;
  margin: 0 auto;
  padding: var(--space-xl) var(--gutter) 0;
`;

const greetRow = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
`;

const greetLeft = css`
  flex: 1;
  min-width: 0;
`;

const greetName = css`
  font-size: clamp(1.25rem, 4vw, 1.625rem);
  font-weight: 500;
  color: ${C.text};
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

const greetSub = css`
  font-size: 0.875rem;
  color: ${C.muted};
  margin-top: 0.3125rem;
  line-height: 1.55;
`;

const greetPills = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const chip = (color: string, bg: string, border: string) => css`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 9px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${color};
  background: ${bg};
  border: 1px solid ${border};
`;

const modesSection = css`
  margin-block: var(--space-xl) var(--space-lg);
`;

const modesHeader = css`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
`;

const modesTitle = css`
  font-size: var(--text-lg);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: ${C.text};
`;

const analyticsLink = css`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  min-height: 32px;
  font-size: var(--text-sm);
  color: ${C.muted};
  text-decoration: none;
  transition: color var(--dur-short) var(--ease-out);
  &:hover {
    color: ${C.text};
  }
`;

const ledger = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: var(--radius-card);
  overflow: hidden;
`;

const ledgerRow = css`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 5fr) 7rem 5rem;
  gap: var(--space-md);
  align-items: center;
  min-height: 56px;
  padding: var(--space-xs) var(--space-lg);
  border-bottom: 1px solid ${C.border};
  color: inherit;
  text-decoration: none;
  transition: background-color var(--dur-short) var(--ease-out);
  &:last-of-type {
    border-bottom: 0;
  }
  &:hover {
    background: ${C.bgHover};
  }
  @media (max-width: 40rem) {
    grid-template-columns: minmax(0, 1fr) auto;
    padding-block: var(--space-sm);
  }
`;

const ledgerName = css`
  font-size: var(--text-md);
  font-weight: 500;
  color: ${C.text};
`;

const ledgerBar = css`
  height: 4px;
  border-radius: 2px;
  background: ${C.border};
  overflow: hidden;
  @media (max-width: 40rem) {
    grid-column: 1 / -1;
    grid-row: 2;
  }
`;

const ledgerFill = (pct: number) => css`
  width: ${pct}%;
  height: 100%;
  background: ${C.cool};
`;

const ledgerCount = css`
  font-family: var(--font-outlier);
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums slashed-zero;
  color: ${C.cool};
  text-align: right;
`;

const ledgerGo = css`
  font-size: var(--text-sm);
  font-weight: 500;
  color: ${C.text};
  text-align: right;
  @media (max-width: 40rem) {
    display: none;
  }
`;

// ─── Mode definitions ─────────────────────────────────────────────────────────

const MODES = [
  {
    href: "/theory",
    label: "Theory",
  },
  {
    href: "/output-quiz",
    label: "Output",
  },
  {
    href: "/debug-lab",
    label: "Debug",
  },
  {
    href: "/polyfill-lab",
    label: "Polyfill",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeClient({
  theoryTotal,
  outputTotal,
  debugTotal,
  polyfillTotal,
  outputIds,
  debugIds,
  polyfillIds,
}: Props) {
  const { user, progress } = useAuth();
  const { masteredIds, solvedIds } = useUserProgress({
    uid: user?.uid ?? null,
  });

  // Compute per-mode "done" counts by cross-referencing solvedIds against
  // the question ID sets passed from the server.
  const solvedSet = useMemo(() => new Set(solvedIds), [solvedIds]);

  const masteredCount = masteredIds.length;
  const solvedOutputCount = useMemo(
    () => outputIds.filter((id) => solvedSet.has(id)).length,
    [outputIds, solvedSet],
  );
  const solvedDebugCount = useMemo(
    () => debugIds.filter((id) => solvedSet.has(id)).length,
    [debugIds, solvedSet],
  );
  const solvedPolyfillCount = useMemo(
    () => polyfillIds.filter((id) => solvedSet.has(id)).length,
    [polyfillIds, solvedSet],
  );

  const modeCounts = [
    {
      done: masteredCount,
      total: theoryTotal,
      pct:
        theoryTotal > 0 ? Math.round((masteredCount / theoryTotal) * 100) : 0,
    },
    {
      done: solvedOutputCount,
      total: outputTotal,
      pct:
        outputTotal > 0
          ? Math.round((solvedOutputCount / outputTotal) * 100)
          : 0,
    },
    {
      done: solvedDebugCount,
      total: debugTotal,
      pct:
        debugTotal > 0 ? Math.round((solvedDebugCount / debugTotal) * 100) : 0,
    },
    {
      done: solvedPolyfillCount,
      total: polyfillTotal,
      pct:
        polyfillTotal > 0
          ? Math.round((solvedPolyfillCount / polyfillTotal) * 100)
          : 0,
    },
  ];

  const totalModes = theoryTotal + outputTotal + debugTotal + polyfillTotal;
  const totalSolved =
    masteredCount + solvedOutputCount + solvedDebugCount + solvedPolyfillCount;

  // Greeting: fall back gracefully for logged-out users
  const firstName = user?.displayName?.split(" ")[0] ?? null;
  const hour = new Date().getHours();
  const tod = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const streakDays = progress?.streakDays ?? 0;

  return (
    <div css={page}>
      {/* ── Greeting ── */}
      <div css={greetRow}>
        <div css={greetLeft}>
          <h1 css={greetName}>
            {firstName
              ? `Good ${tod}, ${firstName}`
              : "JavaScript Interview Prep"}
          </h1>
          <p css={greetSub}>
            {user
              ? getMotivation(totalSolved, totalModes, streakDays)
              : "Theory, output, debug & polyfill questions, with AI feedback."}
          </p>
        </div>

        {user && (
          <div css={greetPills}>
            {streakDays > 0 && (
              <span css={chip(C.amber, C.amberSubtle, C.amberBorder)}>
                {streakDays}d
              </span>
            )}
            {progress?.isPro && (
              <span css={chip(C.accentText, C.accentSubtle, C.border)}>
                Pro
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Subscription management (renders only for Pro subscribers) ── */}
      <ReadinessSummary />
      <LastSprint />
      <ManageSubscription />

      {/* ── Mode progress cards ── */}
      <div css={modesSection}>
        <div css={modesHeader}>
          <span css={modesTitle}>Practice Modes</span>
          {user && (
            <Link href="/analytics" css={analyticsLink}>
              <BarChart2 size={16} aria-hidden="true" /> Full analysis
            </Link>
          )}
        </div>

        <div css={ledger}>
          {MODES.map(({ href, label }, i) => {
            const { done, total, pct } = modeCounts[i];
            return (
              <Link key={href} href={user ? href : "/auth"} css={ledgerRow}>
                <span css={ledgerName}>{label}</span>
                <div css={ledgerBar}>
                  <div css={ledgerFill(user ? pct : 0)} />
                </div>
                {/* Show live counts for logged-in users; totals-only for guests */}
                <span css={ledgerCount}>
                  {user ? `${done}/${total}` : `${total} qs`}
                </span>
                <span css={ledgerGo}>{user ? "Practice" : "Start"}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

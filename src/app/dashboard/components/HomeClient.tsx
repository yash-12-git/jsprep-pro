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

import { useMemo } from "react";
import { css } from "@emotion/react";
import { ArrowRight, Zap, BarChart2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useQuestions";
import { C, RADIUS } from "@/styles/tokens";
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
  return "Everything mastered. Go get that offer. 🎯";
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const page = css`
  max-width: 46rem;
  margin: 0 auto;
  padding: 2rem 1.25rem 0;
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
  font-weight: 700;
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
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${color};
  background: ${bg};
  border: 1px solid ${border};
`;

const modesSection = css`
  margin-bottom: 1.5rem;
`;

const modesHeader = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.625rem;
`;

const modesTitle = css`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.muted};
`;

const analyticsLink = css`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${C.accentText};
  text-decoration: none;
  transition: color 0.12s;
  &:hover {
    color: ${C.accent};
  }
`;

const modesGrid = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  @media (max-width: 540px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const modeCard = (color: string, bg: string) => css`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.875rem 0.875rem 0.75rem;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  text-decoration: none;
  transition:
    border-color 0.12s,
    background 0.12s;
  &:hover {
    border-color: ${color};
    background: ${bg};
  }
`;

const modeIconRow = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.25rem;
`;
const modeIcon = css`
  font-size: 0.9375rem;
`;

const modeLabel = (color: string) => css`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${color};
`;

const modeCount = css`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${C.text};
  letter-spacing: -0.02em;
  line-height: 1;
`;

const modeFrac = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  font-weight: 400;
`;

const modeBar = css`
  height: 3px;
  background: ${C.border};
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 5px;
`;

const modeBarFill = (pct: number, color: string) => css`
  height: 100%;
  width: ${Math.min(pct, 100)}%;
  background: ${color};
  border-radius: 9999px;
  transition: width 0.5s ease;
`;

const modeGo = (color: string) => css`
  font-size: 0.5625rem;
  font-weight: 700;
  color: ${color};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 4px;
`;

// ─── Mode definitions ─────────────────────────────────────────────────────────

const MODES = [
  {
    href: "/theory",
    label: "Theory",
    icon: "📖",
    color: C.accent,
    bg: C.accentSubtle,
  },
  {
    href: "/output-quiz",
    label: "Output",
    icon: "💻",
    color: C.amber,
    bg: C.amberSubtle,
  },
  {
    href: "/debug-lab",
    label: "Debug",
    icon: "🐛",
    color: C.red,
    bg: C.redSubtle,
  },
  {
    href: "/polyfill-lab",
    label: "Polyfill",
    icon: "🧪",
    color: C.green,
    bg: C.greenSubtle,
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
              ? `Good ${tod}, ${firstName} 👋`
              : "JavaScript Interview Prep"}
          </h1>
          <p css={greetSub}>
            {user
              ? getMotivation(totalSolved, totalModes, streakDays)
              : "195+ questions · theory, output, debug & polyfill · AI evaluated."}
          </p>
        </div>

        {user && (
          <div css={greetPills}>
            {streakDays > 0 && (
              <span css={chip(C.amber, C.amberSubtle, C.amberBorder)}>
                🔥 {streakDays}d
              </span>
            )}
            {progress?.isPro && (
              <span css={chip(C.accentText, C.accentSubtle, C.border)}>
                <Zap size={9} /> PRO
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Mode progress cards ── */}
      <div css={modesSection}>
        <div css={modesHeader}>
          <span css={modesTitle}>Practice Modes</span>
          {user && (
            <Link href="/analytics" css={analyticsLink}>
              <BarChart2 size={11} /> Full analysis
            </Link>
          )}
        </div>

        <div css={modesGrid}>
          {MODES.map(({ href, label, icon, color, bg }, i) => {
            const { done, total, pct } = modeCounts[i];
            return (
              <Link
                key={href}
                href={user ? href : "/auth"}
                css={modeCard(color, bg)}
              >
                <div css={modeIconRow}>
                  <span css={modeIcon}>{icon}</span>
                  <span css={modeLabel(color)}>{label}</span>
                </div>
                <div>
                  {/* Show live counts for logged-in users; totals-only for guests */}
                  {user ? (
                    <>
                      <span css={modeCount}>{done}</span>
                      <span css={modeFrac}>/{total}</span>
                    </>
                  ) : (
                    <>
                      <span css={modeCount}>{total}</span>
                      <span css={modeFrac}> qs</span>
                    </>
                  )}
                </div>
                <div css={modeBar}>
                  <div css={modeBarFill(user ? pct : 0, color)} />
                </div>
                <span css={modeGo(color)}>
                  {user ? "Practice" : "Start"} <ArrowRight size={8} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

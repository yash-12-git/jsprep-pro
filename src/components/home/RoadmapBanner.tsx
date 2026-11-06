/** @jsxImportSource @emotion/react */
// components/home/RoadmapBanner.tsx
// Stage 3 of the homepage. Self-contained: the data and styles live here.

"use client";

import Link from "next/link";
import { css } from "@emotion/react";
import { C } from "@/styles/tokens";
import { headBlock, sh2, ssub, btnO, measured, statN, statL, chipRow, chip, sprintCTASub } from "@/app/page.styles";

// ─── Static data ─────────────────────────────────────────────────────────────

const PHASES = [
  {
    month: 1,
    label: "JS Mastery",
    weeks: "Weeks 1 to 4",
    topics: ["Closures", "Event loop", "Prototypes", "Async/await", "Polyfills"],
  },
  {
    month: 2,
    label: "React Deep Dive",
    weeks: "Weeks 5 to 8",
    topics: ["Fiber", "All hooks", "Performance", "Patterns", "React 18"],
  },
  {
    month: 3,
    label: "Machine Coding",
    weeks: "Weeks 9 to 12",
    topics: ["30+ components", "2 projects", "DSA sprint", "GitHub portfolio"],
  },
  {
    month: 4,
    label: "Interview Mode",
    weeks: "Weeks 13 to 16",
    topics: ["Mock interviews", "System design", "Applications", "Negotiation"],
  },
] as const;

const STATS = [
  { n: "16", l: "Weeks" },
  { n: "112", l: "Daily tasks" },
  { n: "4", l: "Phases" },
  { n: "₹25+", l: "LPA target" },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const SMALL = "60rem";

const layout = css`
  display: grid;
  grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
  gap: var(--space-xl) var(--space-2xl);
  align-items: start;
  @media (max-width: ${SMALL}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const trail = css`
  list-style: none;
  margin: 0;
  padding: 0;
  border-left: 1px solid ${C.rule2};
`;

const phaseLink = css`
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 5fr);
  gap: var(--space-xs) var(--space-lg);
  padding: var(--space-lg);
  border-bottom: 1px solid ${C.border};
  color: inherit;
  text-decoration: none;
  transition: background-color var(--dur-short) var(--ease-out);
  &:hover {
    background: ${C.bgSubtle};
  }
  @media (max-width: ${SMALL}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const phaseName = css`
  margin-top: var(--space-2xs);
  font-size: var(--text-title);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: ${C.text};
`;

const figures = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-xl) var(--space-lg);
`;

const smallFigure = css`
  ${statN};
  font-size: var(--text-3xl);
`;

const actions = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-sm);
  margin-top: var(--space-xl);
`;

const link = css`
  font-size: var(--text-md);
  font-weight: 500;
  color: ${C.text};
  text-decoration: underline;
  text-decoration-color: ${C.rule2};
  text-underline-offset: 0.2em;
  transition: color var(--dur-short) var(--ease-out);
  &:hover {
    color: ${C.accent};
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function RoadmapBanner() {
  return (
    <div role="region" aria-labelledby="roadmap-banner-heading">
      <div css={headBlock}>
        <h2 id="roadmap-banner-heading" css={sh2}>
          3. Frontend Developer Roadmap 2026
        </h2>
        <p css={ssub}>
          Stop wondering what to learn next. 112 daily tasks: JS, React, machine
          coding, DSA, interviews. Progress saved to browser.
        </p>
      </div>

      <div css={layout}>
        <ol css={trail}>
          {PHASES.map((phase) => (
            <li key={phase.month}>
              <Link href={`/roadmap#month-${phase.month}`} css={phaseLink}>
                <div>
                  <span css={measured}>
                    M{phase.month}, {phase.weeks}
                  </span>
                  <div css={phaseName}>{phase.label}</div>
                </div>
                <span css={chipRow}>
                  {phase.topics.map((topic) => (
                    <span key={topic} css={chip}>
                      {topic}
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <div>
          <div css={figures}>
            {STATS.map(({ n, l }) => (
              <div key={l}>
                <div css={smallFigure}>{n}</div>
                <div css={statL}>{l}</div>
              </div>
            ))}
          </div>
          <div css={actions}>
            <Link href="/roadmap" css={btnO}>
              View Roadmap
            </Link>
            <Link href="/roadmap" css={link}>
              Start the roadmap
            </Link>
            <span css={sprintCTASub}>
              Free, works offline, progress synced to browser
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

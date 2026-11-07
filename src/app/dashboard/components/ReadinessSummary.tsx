/** @jsxImportSource @emotion/react */
"use client";

import Link from "next/link";
import { css } from "@emotion/react";
import { useReadiness } from "@/hooks/useReadiness";
import type { QuestionTotals } from "@/lib/readiness";
import { C, RADIUS } from "@/styles/tokens";

interface Props {
  uid: string | null;
  totals: QuestionTotals;
  masteredIds: string[];
  solvedIds: string[];
  progressLoading: boolean;
}

const scoreColor = (s: number) =>
  s >= 80 ? C.green : s >= 60 ? C.accent : s >= 40 ? C.amber : C.red;

/**
 * The signed-in user's readiness score with its four parts, so they can see
 * why it is what it is and what to do next.
 */
export default function ReadinessSummary(props: Props) {
  const { readiness, previous } = useReadiness(props);
  if (!props.uid || !readiness) return null;

  const change = previous ? readiness.score - previous.score : 0;
  const weakest = readiness.parts
    .filter((p) => p.value !== null)
    .sort((a, b) => (a.value as number) - (b.value as number))[0];

  return (
    <section css={card} aria-labelledby="readiness-title">
      <div css={head}>
        <h2 id="readiness-title" css={title}>
          Interview readiness
        </h2>
        <p css={scoreLine}>
          <span css={{ fontSize: "2rem", fontWeight: 500, color: scoreColor(readiness.score) }}>
            {readiness.score}%
          </span>
          <span css={{ color: C.text }}>{readiness.label}</span>
          {change !== 0 && previous && (
            <span css={muted}>
              {change > 0 ? "Up" : "Down"} {Math.abs(change)} since{" "}
              {new Date(previous.createdAt).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
        </p>
      </div>

      <ul css={parts}>
        {readiness.parts.map((p) => (
          <li key={p.key} css={part}>
            <div css={partTop}>
              <span css={{ color: C.text, fontWeight: 500 }}>{p.label}</span>
              <span css={{ color: p.value === null ? C.muted : scoreColor(p.value) }}>
                {p.value === null ? "Not measured" : `${p.value}%`}
              </span>
            </div>
            <div css={track} aria-hidden="true">
              <div css={fill(p.value ?? 0)} style={{ background: p.value === null ? "transparent" : scoreColor(p.value) }} />
            </div>
            <p css={muted}>
              {p.detail}{" "}
              <Link href={p.href} css={link}>
                {p.value === null ? "Start" : "Practise"}
              </Link>
            </p>
          </li>
        ))}
      </ul>

      <p css={[muted, { marginTop: "1rem" }]}>
        Weighted 35% coverage, 25% sprints, 25% mock interviews and 15% real
        interviews. Parts with no data yet are left out.{" "}
        {weakest && (
          <Link href="/study-plan" css={link}>
            Get a study plan for your {weakest.label.toLowerCase()}
          </Link>
        )}
      </p>
    </section>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const card = css`
  margin: 1.25rem 0;
  padding: 1.25rem;
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  background: ${C.card};
`;

const head = css`
  margin-bottom: 1rem;
`;

const title = css`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${C.muted};
  margin: 0 0 0.25rem;
`;

const scoreLine = css`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.25rem 0.75rem;
  margin: 0;
`;

const muted = css`
  font-size: 0.8125rem;
  color: ${C.muted};
  line-height: 1.55;
  margin: 0;
`;

const link = css`
  color: ${C.text};
  text-decoration: underline;
  white-space: nowrap;
`;

const parts = css`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 1.5rem;
  @media (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const part = css`
  min-width: 0;
`;

const partTop = css`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 0.375rem;
`;

const track = css`
  height: 0.375rem;
  border-radius: 9999px;
  background: ${C.surface};
  overflow: hidden;
  margin-bottom: 0.375rem;
`;

const fill = (pct: number) => css`
  height: 100%;
  width: ${pct}%;
  border-radius: 9999px;
`;

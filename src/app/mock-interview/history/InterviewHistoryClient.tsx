/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { css } from "@emotion/react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PageGuard from "@/components/ui/PageGuard";
import {
  getRecentInterviews,
  isUnscored,
  type SavedInterview,
} from "@/lib/interviewHistory";
import { LEVELS } from "@/lib/mockInterviewOptions";
import * as Shared from "@/styles/shared";
import { C, RADIUS } from "@/styles/tokens";

const HISTORY_SIZE = 20;

const scoreColor = (s: number) =>
  s >= 75 ? C.green : s >= 50 ? C.amber : C.red;

const levelLabel = (value: string) =>
  LEVELS.find((l) => l.value === value)?.label ?? value;

const formatDate = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Just now";

export default function InterviewHistoryClient() {
  const { user, progress, loading } = useAuth();
  const router = useRouter();
  const [interviews, setInterviews] = useState<SavedInterview[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth?next=/mock-interview/history");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getRecentInterviews(user.uid, HISTORY_SIZE)
      .then(setInterviews)
      .catch((err) => {
        console.error("[InterviewHistory] could not load", err);
        setLoadError(true);
        setInterviews([]);
      });
  }, [user]);

  return (
    <PageGuard
      loading={loading || !user || !progress || interviews === null}
      ready={!!progress}
    >
      <div css={Shared.pageWrapper}>
        <Link href="/mock-interview" css={backLink}>
          <ChevronLeft size={16} /> Mock interview
        </Link>

        <h1 css={Shared.pageTitleText}>Past interviews</h1>
        <p css={[Shared.pageSubtitleText, { marginBottom: "1.5rem" }]}>
          Your scorecards, newest first. Weak spots from recent interviews feed
          into your study plan.
        </p>

        {loadError && (
          <p css={notice}>We couldn&apos;t load your interviews. Try again in a moment.</p>
        )}

        {!loadError && interviews?.length === 0 && (
          <div css={[Shared.card, { padding: "1.5rem" }]}>
            <p css={{ color: C.text, marginBottom: "1rem" }}>
              No interviews yet. Finish one and its scorecard is saved here.
            </p>
            <Link
              href="/mock-interview"
              css={[Shared.primaryBtn(C.accent), { width: "auto", display: "inline-flex" }]}
            >
              Start a mock interview
            </Link>
          </div>
        )}

        <ul css={list}>
          {interviews?.map((iv) => {
            const card = iv.scorecard;
            const unscored = isUnscored(card);
            const open = openId === iv.id && !unscored;
            return (
              <li key={iv.id} css={Shared.card}>
                <button
                  css={rowBtn}
                  aria-expanded={unscored ? undefined : open}
                  disabled={unscored}
                  onClick={() => setOpenId(open ? null : iv.id)}
                >
                  <span
                    css={{
                      fontSize: "1.5rem",
                      fontWeight: 500,
                      color: unscored ? C.muted : scoreColor(card.overall),
                      minWidth: "3rem",
                    }}
                  >
                    {unscored ? "–" : card.overall}
                  </span>
                  <span css={{ flex: 1, minWidth: 0 }}>
                    <span css={rowTitle}>{iv.config.focus}</span>
                    <span css={rowMeta}>
                      {formatDate(iv.createdAt)}, {iv.config.role},{" "}
                      {levelLabel(iv.config.experience)}
                    </span>
                  </span>
                  {unscored ? (
                    <span css={rowMeta} style={{ flexShrink: 0 }}>
                      Not scored
                    </span>
                  ) : (
                    <>
                      <span css={verdict(card.verdict)}>{card.verdict}</span>
                      <ChevronDown
                        size={16}
                        color={C.muted}
                        css={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none" }}
                      />
                    </>
                  )}
                </button>

                {open && (
                  <div css={detail}>
                    <div css={scoreGrid}>
                      {(
                        [
                          ["Concepts", card.concepts],
                          ["Problem solving", card.problemSolving],
                          ["Communication", card.communication],
                          ["Depth", card.depth],
                        ] as const
                      ).map(([label, value]) => (
                        <div key={label} css={scoreCell}>
                          <div css={{ fontSize: "1.125rem", fontWeight: 500, color: scoreColor(value) }}>
                            {value}
                          </div>
                          <div css={{ fontSize: "0.75rem", color: C.muted }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <Points title="Strengths" items={card.strengths} color={C.green} />
                    <Points title="To work on" items={card.weaknesses} color={C.red} />
                    <Points title="Suggestions" items={card.suggestions} color={C.accent} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {interviews && interviews.length > 0 && (
          <Link href="/study-plan" css={[Shared.ghostBtn, { marginTop: "1.5rem", display: "inline-flex" }]}>
            Update my study plan
          </Link>
        )}
      </div>
    </PageGuard>
  );
}

function Points({ title, items, color }: { title: string; items: string[]; color: string }) {
  if (!items?.length) return null;
  return (
    <div css={{ marginTop: "1rem" }}>
      <p css={{ fontSize: "0.8125rem", fontWeight: 500, color, marginBottom: "0.375rem" }}>
        {title}
      </p>
      <ul css={{ paddingLeft: "1.125rem", margin: 0 }}>
        {items.map((t, i) => (
          <li key={i} css={{ fontSize: "0.875rem", color: C.text, lineHeight: 1.6 }}>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const backLink = css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: ${C.muted};
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  &:hover {
    color: ${C.text};
  }
`;

const notice = css`
  color: ${C.red};
  font-size: 0.875rem;
`;

const list = css`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const rowBtn = css`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  color: inherit;
  &:disabled {
    cursor: default;
  }
  &:focus-visible {
    outline: 2px solid ${C.accent};
    outline-offset: -2px;
    border-radius: ${RADIUS.xl};
  }
`;

const rowTitle = css`
  display: block;
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${C.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const rowMeta = css`
  display: block;
  font-size: 0.75rem;
  color: ${C.muted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const verdict = (v: string) => {
  const [fg, bg, border] =
    v === "Ready"
      ? [C.green, C.greenSubtle, C.greenBorder]
      : v === "Almost Ready"
        ? [C.amber, C.amberSubtle, C.amberBorder]
        : [C.red, C.redSubtle, C.redBorder];
  return css`
    flex-shrink: 0;
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    color: ${fg};
    background: ${bg};
    border: 1px solid ${border};
    white-space: nowrap;
    @media (max-width: 420px) {
      display: none;
    }
  `;
};

const detail = css`
  padding: 0 1rem 1rem;
  border-top: 1px solid ${C.border};
`;

const scoreGrid = css`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const scoreCell = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.625rem;
  text-align: center;
`;

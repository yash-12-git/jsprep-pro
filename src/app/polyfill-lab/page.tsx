/** @jsxImportSource @emotion/react */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { css } from "@emotion/react";
import { FlaskConical, Filter, Code2 } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import * as Shared from "@/styles/shared";
import { useAuth } from "@/hooks/useAuth";
import PolyfillCard from "@/components/ui/QuestionCards/PolyfillCard";
import PaywallBanner from "@/components/ui/PaywallBanner/page";
import { useAllQuestions } from "@/contexts/QuestionsContext";
import { useCategories, useUserProgress } from "@/hooks/useQuestions";
import PageGuard from "@/components/ui/PageGuard";

const FREE_LIMIT = 5;

export default function PolyfillLabPage() {
  const { user, progress, loading: authLoading } = useAuth();
  const router = useRouter();
  const { polyfillQs: questions, loading: qLoading } = useAllQuestions();
  const { categories } = useCategories("polyfill", "javascript");
  const { isSolved, isRevealed, recordSolved, recordRevealed, solvedIds } =
    useUserProgress({ uid: user?.uid ?? null });
  const [activeCategory, setActiveCategory] = useState("All");
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  const filtered =
    activeCategory === "All"
      ? questions
      : questions.filter((q) => q.category === activeCategory);

  const isPro = (user as any)?.isPro ?? false;

  const catCounts = Object.fromEntries(
    categories.map((c) => [
      c,
      questions.filter((q) => q.category === c).length,
    ]),
  );

  const solvedCount = solvedIds.filter((id) =>
    questions.some((q) => q.id === id),
  ).length;
  const pct =
    questions.length > 0
      ? Math.round((solvedCount / questions.length) * 100)
      : 0;

  if (authLoading || !user) return <></>;

  return (
    <PageGuard loading={authLoading || !user || !progress} ready={!!progress}>
      <div css={page}>
        {showPaywall && <PaywallBanner onClose={() => setShowPaywall(false)} />}

        {/* Header */}
        <div css={{ marginBottom: "2rem" }}>
          <div css={eyebrow}>
            <FlaskConical size={14} /> Polyfill Lab
          </div>
          {/* Company strip */}
          <div css={companyStrip}>
            <span
              css={{
                fontSize: "0.75rem",
                color: C.muted,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              🏢 Asked at:
            </span>
            {[
              "Razorpay",
              "Flipkart",
              "Google",
              "Amazon",
              "Atlassian",
              "Microsoft",
              "CRED",
              "Swiggy",
            ].map((c) => (
              <span key={c} css={coBadge}>
                {c}
              </span>
            ))}
          </div>
        </div>
        <div css={Shared.pageHeader}>
          <div css={Shared.pageHeaderTop}>
            {/* C.accent2 → C.amber */}
            <div css={Shared.iconBox(C.amber)}>
              <Code2 size={18} color={C.amber} />
            </div>
            <div>
              <h1 css={Shared.pageTitleText}>Implement JavaScript Polyfills</h1>
              <p css={Shared.pageSubtitleText}>
                Write your own implementations of native JavaScript methods.{" "}
                {questions.length} challenges — Array.map, Function.bind,
                Promise.all, debounce, curry, EventEmitter and more. Asked at
                every top tech company.
              </p>
            </div>
          </div>
          <div css={Shared.pageProgressRow}>
            <div css={Shared.progressBarTrack}>
              {/* flat accent fill — no neon gradient */}
              <div css={Shared.progressBarFill(pct)} />
            </div>
            <span css={Shared.pageProgressCount(C.amber)}>
              {solvedCount}/{questions.length} solved
            </span>
          </div>
        </div>

        {/* Category filter */}
        <div css={filterRow}>
          <Filter size={13} css={{ color: C.muted, flexShrink: 0 }} />
          <button
            css={fBtn(activeCategory === "All")}
            onClick={() => setActiveCategory("All")}
          >
            All ({questions.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              css={fBtn(activeCategory === cat)}
              onClick={() => setActiveCategory(cat)}
            >
              {cat} ({catCounts[cat]})
            </button>
          ))}
        </div>

        {/* Skeletons — visible on white */}
        {qLoading && (
          <div
            css={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                css={{
                  height: "5rem",
                  borderRadius: RADIUS.lg,
                  background: C.bgSubtle,
                  border: `1px solid ${C.border}`,
                }}
              />
            ))}
          </div>
        )}

        {/* Question list */}
        {!qLoading && (
          <div
            css={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {filtered.map((q) => {
              const globalIdx = questions.indexOf(q);
              return (
                <PolyfillCard
                  key={q.id}
                  q={q}
                  index={globalIdx}
                  isSolved={isSolved}
                  isRevealed={isRevealed}
                  recordSolved={recordSolved}
                  recordRevealed={recordRevealed}
                  isLocked={!isPro && globalIdx >= FREE_LIMIT}
                  isPro={!!progress?.isPro}
                  onPaywall={() => setShowPaywall(true)}
                />
              );
            })}
          </div>
        )}

        {/* Pro nudge */}
        {!isPro && (
          <div css={proNudge}>
            <span>
              🔒 First {FREE_LIMIT} challenges free —{" "}
              {questions.length - FREE_LIMIT} more with Pro
            </span>
            <button css={upgradeBtn} onClick={() => setShowPaywall(true)}>
              Unlock All {questions.length} →
            </button>
          </div>
        )}
      </div>
    </PageGuard>
  );
}

const page = css`
  max-width: 56rem;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 4rem;
`;
const eyebrow = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${C.accent};
  margin-bottom: 0.625rem;
`;
const title = css`
  font-size: clamp(1.375rem, 3vw, 1.875rem);
  font-weight: 900;
  color: ${C.text};
  margin-bottom: 0.625rem;
  line-height: 1.2;
`;
const subtitle = css`
  font-size: 0.9375rem;
  color: ${C.muted};
  line-height: 1.7;
  max-width: 42rem;
  margin-bottom: 1rem;
`;
const companyStrip = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;
const coBadge = css`
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: 9999px;
  color: ${C.text};
`;
const filterRow = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 0.75rem;
`;
const fBtn = (active: boolean) => css`
  padding: 0.3125rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid ${active ? C.accent : C.border};
  background: ${active ? C.accent + "14" : "transparent"};
  color: ${active ? C.accent : C.muted};
  font-size: 0.75rem;
  font-weight: ${active ? "700" : "500"};
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  &:hover {
    border-color: ${C.accent};
    color: ${C.accent};
  }
`;
const proNudge = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem 1.25rem;
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: ${C.amber};
  font-weight: 600;
  flex-wrap: wrap;
`;
const upgradeBtn = css`
  padding: 0.5rem 1.125rem;
  background: ${C.accent};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    opacity: 0.9;
  }
`;

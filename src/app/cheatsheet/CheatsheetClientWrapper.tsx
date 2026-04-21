/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { Topic } from "@/types/topic";

import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Printer,
  Target,
  BookOpen,
} from "lucide-react";
import * as Shared from "@/styles/shared";
import { C, RADIUS } from "@/styles/tokens";
import PaywallBanner from "@/components/ui/PaywallBanner/page";
import { useTrack } from "@/contexts/TrackContext";

// ─── Group topics by category ─────────────────────────────────────────────────
type CategoryMap = Record<string, Topic[]>;
function groupByCategory(topics: Topic[]): CategoryMap {
  return topics.reduce<CategoryMap>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});
}

// Uses named C tokens — no raw hex values
const DIFF_COLOR: Record<string, { color: string; bg: string }> = {
  Beginner: { color: C.green, bg: C.greenSubtle },
  Intermediate: { color: C.amber, bg: C.amberSubtle },
  Advanced: { color: C.orange, bg: C.amberSubtle },
  Senior: { color: C.red, bg: C.redSubtle },
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const pageWrap = css`
  max-width: 52rem;
  margin: 0 auto;
  padding: 2rem 1rem 5rem;
`;

const topRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const backBtn = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${C.muted};
  font-size: 0.875rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.12s ease;
  &:hover {
    color: ${C.text};
  }
`;

const printBtn = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4375rem 1rem;
  border-radius: ${RADIUS.lg};
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  color: ${C.accentText};
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: border-color 0.12s ease;
  &:hover {
    border-color: ${C.accent};
  }
  @media print {
    display: none;
  }
`;

const pageHeader = css`
  margin-bottom: 1.75rem;
`;

const pageTitle = css`
  font-size: clamp(1.375rem, 4vw, 1.875rem);
  font-weight: 700;
  color: ${C.text};
  letter-spacing: -0.025em;
  margin-bottom: 0.375rem;
`;

const pageSubtitle = css`
  font-size: 0.875rem;
  color: ${C.muted};
  line-height: 1.6;
`;

// Filter tabs
const filterRow = css`
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  @media print {
    display: none;
  }
`;

const filterChip = (active: boolean) => css`
  padding: 0.3125rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  background: ${active ? C.accentSubtle : "transparent"};
  border: 1px solid ${active ? C.accent : C.border};
  color: ${active ? C.accentText : C.muted};
  transition: all 0.12s ease;
  &:hover {
    border-color: ${C.accent};
    color: ${C.accentText};
    background: ${C.accentSubtle};
  }
`;

// Category section
const catSection = css`
  margin-bottom: 2rem;
  @media print {
    break-inside: avoid;
    margin-bottom: 1.5rem;
  }
`;

const catHeader = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid ${C.border};
`;

const catEmoji = css`
  font-size: 1rem;
  line-height: 1;
`;

const catName = css`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${C.text};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const catCount = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  font-weight: 500;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  padding: 1px 8px;
  border-radius: 9999px;
`;

// Topic card
const topicCard = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  overflow: hidden;
  margin-bottom: 0.5rem;
  transition: border-color 0.12s ease;
  &:hover {
    border-color: ${C.borderStrong};
  }
  @media print {
    break-inside: avoid;
    border: 1px solid ${C.border};
  }
`;

const topicCardHeader = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8125rem 1rem;
  cursor: pointer;
  background: ${C.bg};
  transition: background 0.12s ease;
  &:hover {
    background: ${C.bgHover};
  }
  @media print {
    cursor: default;
  }
`;

const topicKeyword = css`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${C.text};
  flex: 1;
  text-transform: capitalize;
`;

const diffPill = (color: string, bg: string) => css`
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${color};
  background: ${bg};
  border: 1px solid ${color}40;
  padding: 2px 8px;
  border-radius: 10px;
  flex-shrink: 0;
`;

const chevron = (open: boolean) => css`
  color: ${C.muted};
  transition: transform 0.18s ease;
  flex-shrink: 0;
  transform: rotate(${open ? "180deg" : "0deg"});
  @media print {
    display: none;
  }
`;

// Body
const topicBody = css`
  border-top: 1px solid ${C.border};
  padding: 1rem;
  background: ${C.bgSubtle};
  @media print {
    padding-top: 0.75rem;
  }
`;

const sectionLabel = (color: string) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${color};
  margin-bottom: 0.5rem;
`;

const bullet = css`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  font-size: 0.8125rem;
  color: ${C.text};
  line-height: 1.6;
  margin-bottom: 0.375rem;
`;

const bulletDot = (color: string) => css`
  font-size: 0.625rem;
  color: ${color};
  flex-shrink: 0;
  margin-top: 0.25rem;
`;

const divider = css`
  height: 1px;
  background: ${C.border};
  margin: 0.75rem 0;
`;

// Pro gate
const proGate = css`
  text-align: center;
  padding: 5rem 2rem;
`;

const proGateIcon = css`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const proGateTitle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${C.text};
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const proGateText = css`
  font-size: 0.875rem;
  color: ${C.muted};
  max-width: 28rem;
  margin: 0 auto 1.5rem;
  line-height: 1.7;
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function CheatSheetClientPage({
  topics
}: {
  topics: Topic[]
}) {
  const { user, progress, loading } = useAuth();
  const router = useRouter();
  const [showPaywall, setShowPaywall] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [openTopics, setOpenTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);

  if (loading || !user || !progress)
    return (
      <div css={Shared.spinner}>
        <div css={Shared.spinnerDot} />
      </div>
    );

  if (!progress.isPro)
    return (
      <div css={[pageWrap, proGate]}>
        {showPaywall && (
          <PaywallBanner
            reason={`Get instant access to crisp topic-by-topic revision cards covering
          every concept you need to know before your JavaScript interview`}
            onClose={() => setShowPaywall(false)}
          />
        )}
        <div css={proGateIcon}>📄</div>
        <h2 css={proGateTitle}>Cheat Sheet is Pro</h2>
        <p css={proGateText}>
          Get instant access to crisp topic-by-topic revision cards covering
          every concept you need to know before your JavaScript interview.
        </p>
        <button
          css={Shared.primaryBtn(C.accent)}
          style={{
            width: "auto",
            padding: "0.625rem 1.625rem",
            margin: "0 auto",
            display: "inline-flex",
          }}
          onClick={() => setShowPaywall(true)}
        >
          Upgrade to Pro →
        </button>
      </div>
    );

  const allCategories = [...new Set(topics.map((t) => t.category))];
  const filtered =
    activeFilter === "All"
      ? topics
      : topics.filter((t) => t.category === activeFilter);

  const grouped = groupByCategory(filtered);

  function toggleTopic(slug: string) {
    setOpenTopics((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }

  function expandAll() {
    setOpenTopics(new Set(filtered.map((t: Topic) => t.slug)));
  }
  function collapseAll() {
    setOpenTopics(new Set());
  }

  const totalTopics = filtered.length;
  const openCount = [...openTopics].filter((s) =>
    filtered.some((t) => t.slug === s),
  ).length;

  return (
    <div
      style={{
        backgroundColor: C.bg,
      }}
    >
      <div css={pageWrap}>
        <style>{`
          @media print {
            .print-hide { display: none !important; }
            @page { size: A4; margin: 12mm; }
            /* Light theme already — no overrides needed */
          }
        `}</style>

        {/* Top row */}
        <div css={topRow} className="print-hide">
          <button css={backBtn} onClick={() => router.push("/dashboard")}>
            <ChevronLeft size={16} /> Dashboard
          </button>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {/* Expand / collapse toggle */}
            <button
              css={[
                printBtn,
                css`
                  background: transparent;
                  border-color: ${C.border};
                  color: ${C.muted};
                  &:hover {
                    border-color: ${C.borderStrong};
                    color: ${C.text};
                  }
                `,
              ]}
              onClick={openCount === totalTopics ? collapseAll : expandAll}
            >
              {openCount === totalTopics ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
              {openCount === totalTopics ? "Collapse all" : "Expand all"}
            </button>
            <button
              css={printBtn}
              onClick={() => {
                expandAll();
                setTimeout(() => window.print(), 300);
              }}
            >
              <Printer size={14} /> Print / PDF
            </button>
          </div>
        </div>

        {/* Header */}
        <div css={pageHeader}>
          <h1 css={pageTitle}>{`${topics?.[0]?.track} Interview Cheat Sheet`}</h1>
          <p css={pageSubtitle}>
            {totalTopics} topics · crisp bullet points for every concept you
            need to know. Use this the night before your interview.
          </p>
        </div>

        {/* Category filter */}
        <div css={filterRow}>
          {["All", ...allCategories].map((cat) => (
            <button
              key={cat}
              css={filterChip(activeFilter === cat)}
              onClick={() => {
                setActiveFilter(cat);
                setOpenTopics(new Set());
              }}
            >
              {cat === "All" ? "All Topics" : `○ ${cat}`}
            </button>
          ))}
        </div>

        {/* Topic cards grouped by category */}
        {Object.entries(grouped).map(([cat, catTopics]) => (
          <div key={cat} css={catSection}>
            <div css={catHeader}>
              <span css={catEmoji}>{"🌟"}</span>
              <span css={catName}>{cat}</span>
              <span css={catCount}>{catTopics.length} topics</span>
            </div>

            {catTopics.map((topic) => {
              const isOpen = openTopics.has(topic.slug);
              const dm =
                DIFF_COLOR[topic.difficulty] ?? DIFF_COLOR["Intermediate"];

              return (
                <div key={topic.slug} css={topicCard}>
                  {/* Card header */}
                  <div
                    css={topicCardHeader}
                    onClick={() => toggleTopic(topic.slug)}
                  >
                    <span css={topicKeyword}>{topic.keyword}</span>
                    <span css={diffPill(dm.color, dm.bg)}>
                      {topic.difficulty}
                    </span>
                    <div css={chevron(isOpen)}>
                      <ChevronDown size={15} />
                    </div>
                  </div>

                  {/* Card body */}
                  {isOpen && (
                    <div css={topicBody} className="topic-body">
                      {/* Key points */}
                      <div css={sectionLabel(C.green)}>
                        <BookOpen size={11} /> Key points
                      </div>
                      {topic.cheatSheet.map((pt, i) => (
                        <div key={i} css={bullet}>
                          <span css={bulletDot(C.green)}>▸</span>
                          {pt}
                        </div>
                      ))}

                      <div css={divider} />

                      {/* Interview tips */}
                      <div css={sectionLabel(C.amber)}>
                        <Target size={11} /> Interview tips
                      </div>
                      {topic.interviewTips.map((tip, i) => (
                        <div key={i} css={bullet}>
                          <span css={bulletDot(C.amber)}>▸</span>
                          {tip}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Footer */}
        <div
          style={{
            marginTop: "2rem",
            borderTop: `1px solid ${C.border}`,
            paddingTop: "1rem",
            textAlign: "center",
          }}
          className="print-hide"
        >
          <p style={{ fontSize: "0.75rem", color: C.muted }}>
            jsprep.pro · JavaScript Interview Prep · Good luck! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}

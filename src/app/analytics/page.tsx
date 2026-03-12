/** @jsxImportSource @emotion/react */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQuestions, useUserProgress } from "@/hooks/useQuestions";
import PageGuard from "@/components/ui/PageGuard";
import { Flame, Brain, Code2, Bug, Zap } from "lucide-react";
import { format, parseISO } from "date-fns";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import * as S from "./styles";
import * as Shared from "@/styles/shared";
import { C } from "@/styles/tokens";

// ─── Sprint doc shape (mirrors what SprintClient.tsx writes to Firestore) ─────
interface SprintDoc {
  score: number;
  maxScore: number;
  accuracy: number; // 0–100
  timeUsedSecs: number;
  questionCount: number;
  strengths: string[];
  weakAreas: string[];
  completedAt: string; // ISO
}

export default function AnalyticsPage() {
  const { user, progress, loading: authLoading } = useAuth();
  const router = useRouter();

  // ── Question data ────────────────────────────────────────────────────────────
  const { questions: theoryQs } = useQuestions({
    type: "theory",
    track: "javascript",
    enabled: !!user,
  });
  const { questions: outputQs } = useQuestions({
    type: "output",
    track: "javascript",
    enabled: !!user,
  });
  const { questions: debugQs } = useQuestions({
    type: "debug",
    track: "javascript",
    enabled: !!user,
  });
  const { masteredIds, solvedIds } = useUserProgress({
    uid: user?.uid ?? null,
  });

  // ── Sprint history from Firestore subcollection ──────────────────────────────
  const [sprints, setSprints] = useState<SprintDoc[]>([]);
  const [sprintsLoading, setSprintsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setSprintsLoading(true);
    const ref = query(
      collection(db, "users", user.uid, "sprints"),
      orderBy("completedAt", "desc"),
      limit(10),
    );

    getDocs(ref)
      .then((snap) => setSprints(snap.docs.map((d) => d.data() as SprintDoc)))
      .catch(() => setSprints([]))
      .finally(() => setSprintsLoading(false));
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  // ── Derived counts ────────────────────────────────────────────────────────────
  const masteredCount = masteredIds.length;
  const solvedOutputCount = outputQs.filter((q) =>
    solvedIds.includes(q.id),
  ).length;
  const solvedDebugCount = debugQs.filter((q) =>
    solvedIds.includes(q.id),
  ).length;
  const totalQuestions = theoryQs.length + outputQs.length + debugQs.length;
  const totalSolved = masteredCount + solvedOutputCount + solvedDebugCount;
  const overallPct =
    totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;
  const masterPct =
    theoryQs.length > 0
      ? Math.round((masteredCount / theoryQs.length) * 100)
      : 0;
  const outputPct =
    outputQs.length > 0
      ? Math.round((solvedOutputCount / outputQs.length) * 100)
      : 0;
  const debugPct =
    debugQs.length > 0
      ? Math.round((solvedDebugCount / debugQs.length) * 100)
      : 0;

  // ── Category breakdowns ───────────────────────────────────────────────────────
  const catStats = [...new Set(theoryQs.map((q) => q.category))].map((cat) => {
    const qs = theoryQs.filter((q) => q.category === cat);
    const m = qs.filter((q) => masteredIds.includes(q.id)).length;
    return {
      cat,
      total: qs.length,
      solved: m,
      pct: Math.round((m / qs.length) * 100),
    };
  });
  const outputCatStats = [...new Set(outputQs.map((q) => q.category))].map(
    (cat) => {
      const qs = outputQs.filter((q) => q.category === cat);
      const s = qs.filter((q) => solvedIds.includes(q.id)).length;
      return {
        cat,
        total: qs.length,
        solved: s,
        pct: Math.round((s / qs.length) * 100),
      };
    },
  );
  const debugCatStats = [...new Set(debugQs.map((q) => q.category))].map(
    (cat) => {
      const qs = debugQs.filter((q) => q.category === cat);
      const s = qs.filter((q) => solvedIds.includes(q.id)).length;
      return {
        cat,
        total: qs.length,
        solved: s,
        pct: Math.round((s / qs.length) * 100),
      };
    },
  );

  // ── Sprint aggregates ─────────────────────────────────────────────────────────
  const sprintCount = sprints.length;
  const avgAccuracy =
    sprintCount > 0
      ? Math.round(
          sprints.reduce((sum, s) => sum + s.accuracy, 0) / sprintCount,
        )
      : 0;
  const bestScore =
    sprintCount > 0 ? Math.max(...sprints.map((s) => s.score)) : 0;

  const barColor = (pct: number) =>
    pct >= 80 ? C.accent3 : pct >= 50 ? C.accent : C.accent2;

  const statCards = [
    {
      label: "Day Streak",
      value: progress?.streakDays ?? 0,
      icon: Flame,
      color: C.orange,
      bg: `${C.orange}1a`,
    },
    {
      label: "Theory",
      value: `${masteredCount}/${theoryQs.length}`,
      icon: Brain,
      color: C.accent,
      bg: `${C.accent}1a`,
    },
    {
      label: "Output Quiz",
      value: `${solvedOutputCount}/${outputQs.length}`,
      icon: Code2,
      color: C.accent2,
      bg: `${C.accent2}1a`,
    },
    {
      label: "Debug Lab",
      value: `${solvedDebugCount}/${debugQs.length}`,
      icon: Bug,
      color: C.danger,
      bg: `${C.danger}1a`,
    },
  ];

  return (
    <PageGuard
      loading={authLoading || !user || !progress}
      ready={!!progress}
      isPro={progress?.isPro}
      proReason="Analytics is a Pro feature. Upgrade to see your full progress breakdown!"
    >
      <>
        <div css={Shared.pageWrapper}>
          <h1 css={S.title}>Your Analytics</h1>

          {/* ── Stat cards ── */}
          <div css={S.statsGrid}>
            {statCards.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} css={Shared.statCard}>
                <div css={S.statIconBox(bg)}>
                  <Icon size={16} color={color} />
                </div>
                <div css={Shared.statNum(color)}>{value}</div>
                <div css={Shared.statLabel}>{label}</div>
              </div>
            ))}
          </div>

          {/* ── Overall Progress ── */}
          <div css={S.section}>
            <div css={S.overallRow}>
              <div>
                <h2 css={S.sectionTitle}>Overall Progress</h2>
                <p css={S.sectionSub}>
                  Across all 3 modes · {totalSolved}/{totalQuestions} questions
                </p>
              </div>
              <span css={S.overallPct}>{overallPct}%</span>
            </div>
            <div
              css={[
                Shared.progressBarTrack,
                { height: "0.75rem", marginBottom: "1.5rem" },
              ]}
            >
              <div
                css={Shared.progressBarFill(
                  overallPct,
                  `linear-gradient(90deg, ${C.accent}, ${C.accent2}, ${C.accent3})`,
                )}
              />
            </div>
            <div css={S.categoryRow}>
              {[
                {
                  label: "📖 Theory Questions",
                  pct: masterPct,
                  solved: masteredCount,
                  total: theoryQs.length,
                  color: C.accent,
                },
                {
                  label: "💻 Output Quiz",
                  pct: outputPct,
                  solved: solvedOutputCount,
                  total: outputQs.length,
                  color: C.accent2,
                },
                {
                  label: "🐛 Debug Lab",
                  pct: debugPct,
                  solved: solvedDebugCount,
                  total: debugQs.length,
                  color: C.danger,
                },
              ].map(({ label, pct, solved, total, color }) => (
                <div key={label} css={S.categoryItem}>
                  <div css={S.categoryLabelRow}>
                    <span css={S.categoryName}>{label}</span>
                    <span css={S.categoryCount}>
                      {solved}/{total} · {pct}%
                    </span>
                  </div>
                  <div css={S.barTrack}>
                    <div css={S.barFill(pct, color)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Category breakdowns ── */}
          {[
            {
              title: "📖 Theory — Category Breakdown",
              sub: "Which JS concepts you've mastered",
              stats: catStats,
            },
            {
              title: "💻 Output Quiz — Category Breakdown",
              sub: "Where you predict code output correctly",
              stats: outputCatStats,
            },
            {
              title: "🐛 Debug Lab — Category Breakdown",
              sub: "Which bug types you can spot and fix",
              stats: debugCatStats,
            },
          ].map(
            ({ title, sub, stats }) =>
              stats.length > 0 && (
                <div key={title} css={S.section}>
                  <h2 css={S.sectionTitle}>{title}</h2>
                  <p css={S.sectionSub}>{sub}</p>
                  <div css={S.categoryRow}>
                    {stats.map(({ cat, total, solved, pct }) => (
                      <div key={cat} css={S.categoryItem}>
                        <div css={S.categoryLabelRow}>
                          <span css={S.categoryName}>{cat}</span>
                          <span css={S.categoryCount}>
                            {solved}/{total}
                          </span>
                        </div>
                        <div css={S.barTrack}>
                          <div css={S.barFill(pct, barColor(pct))} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
          )}

          {/* ── Sprint History ── */}
          <div css={S.section}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <div>
                <h2 css={S.sectionTitle}>⚡ Interview Sprint History</h2>
                <p css={S.sectionSub} style={{ marginBottom: 0 }}>
                  Your last {Math.min(sprintCount, 10)} sprints
                </p>
              </div>
              {sprintCount > 0 && (
                <a
                  href="/sprint"
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: C.accent,
                    textDecoration: "none",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.5rem",
                    background: `${C.accent}12`,
                    border: `1px solid ${C.accent}30`,
                  }}
                >
                  Run another sprint →
                </a>
              )}
            </div>

            {/* Aggregate stats bar — only when there's data */}
            {sprintCount > 0 && (
              <div css={S.sprintSummaryRow}>
                <div css={S.sprintSummaryItem}>
                  <span css={S.sprintSummaryLabel}>Sprints run</span>
                  <span css={S.sprintSummaryValue}>{sprintCount}</span>
                </div>
                <div css={S.sprintSummaryItem}>
                  <span css={S.sprintSummaryLabel}>Avg accuracy</span>
                  <span
                    css={[
                      S.sprintSummaryValue,
                      { color: barColor(avgAccuracy) },
                    ]}
                  >
                    {avgAccuracy}%
                  </span>
                </div>
                <div css={S.sprintSummaryItem}>
                  <span css={S.sprintSummaryLabel}>Best score</span>
                  <span css={[S.sprintSummaryValue, { color: C.accent2 }]}>
                    {bestScore} pts
                  </span>
                </div>
              </div>
            )}

            {sprintsLoading ? (
              <div css={S.emptyState} style={{ padding: "1.5rem" }}>
                Loading sprint history...
              </div>
            ) : sprints.length > 0 ? (
              <div css={S.categoryRow}>
                {sprints.map((s, i) => (
                  <div key={i} css={S.sprintRow}>
                    <div css={S.sprintRowTop}>
                      {/* Date */}
                      <span css={S.sprintDate}>
                        {format(parseISO(s.completedAt), "MMM d, HH:mm")}
                      </span>

                      {/* Score */}
                      <div css={S.sprintScoreBlock}>
                        <span css={S.sprintScoreNum}>{s.score}</span>
                        <span css={S.sprintScoreMax}>/{s.maxScore} pts</span>
                      </div>

                      {/* Accuracy badge */}
                      <span css={S.sprintAccuracy(s.accuracy)}>
                        {s.accuracy}%
                      </span>

                      {/* Q count */}
                      <span css={S.sprintQCount}>{s.questionCount}Q</span>
                    </div>

                    {/* Strengths + weak areas as chips */}
                    {(s.strengths?.length > 0 || s.weakAreas?.length > 0) && (
                      <div css={S.sprintTagRow}>
                        {s.strengths?.slice(0, 3).map((cat) => (
                          <span key={cat} css={S.sprintTag("strength")}>
                            ✓ {cat}
                          </span>
                        ))}
                        {s.weakAreas?.slice(0, 2).map((cat) => (
                          <span key={cat} css={S.sprintTag("weak")}>
                            ↻ {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div css={S.emptyState}>
                No sprint history yet.{" "}
                <a
                  href="/sprint"
                  css={{ color: C.accent, textDecoration: "underline" }}
                >
                  Start your first sprint
                </a>{" "}
                — it takes 5 minutes and shows exactly where you stand.
              </div>
            )}
          </div>
        </div>
      </>
    </PageGuard>
  );
}

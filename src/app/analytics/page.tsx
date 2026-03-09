/** @jsxImportSource @emotion/react */
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQuestions, useUserProgress } from "@/hooks/useQuestions";
import PaywallBanner from "@/components/ui/PaywallBanner/page";
import { Flame, Brain, Code2, Bug } from "lucide-react";
import { format, parseISO } from "date-fns";
import * as S from "./styles";
import * as Shared from "@/styles/shared";
import { C } from "@/styles/tokens";

export default function AnalyticsPage() {
  const { user, progress, loading: authLoading } = useAuth();
  const router = useRouter();

  // Load all 3 question types from Firestore
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

  const { progressMap, masteredIds, solvedIds } = useUserProgress({
    uid: user?.uid ?? null,
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  if (authLoading || !user || !progress)
    return (
      <div css={Shared.spinner}>
        <div css={Shared.spinnerDot} />
      </div>
    );
  if (!progress.isPro)
    return (
      <>
        <PaywallBanner reason="Analytics is a Pro feature. Upgrade to see your full progress breakdown!" />
      </>
    );

  // Compute counts from Firestore progress map
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

  // Category breakdowns — derive unique cats from loaded questions
  const theoryCats = [...new Set(theoryQs.map((q) => q.category))];
  const outputCats = [...new Set(outputQs.map((q) => q.category))];
  const debugCats = [...new Set(debugQs.map((q) => q.category))];

  const catStats = theoryCats.map((cat) => {
    const qs = theoryQs.filter((q) => q.category === cat);
    const m = qs.filter((q) => masteredIds.includes(q.id)).length;
    return {
      cat,
      total: qs.length,
      solved: m,
      pct: Math.round((m / qs.length) * 100),
    };
  });
  const outputCatStats = outputCats.map((cat) => {
    const qs = outputQs.filter((q) => q.category === cat);
    const s = qs.filter((q) => solvedIds.includes(q.id)).length;
    return {
      cat,
      total: qs.length,
      solved: s,
      pct: Math.round((s / qs.length) * 100),
    };
  });
  const debugCatStats = debugCats.map((cat) => {
    const qs = debugQs.filter((q) => q.category === cat);
    const s = qs.filter((q) => solvedIds.includes(q.id)).length;
    return {
      cat,
      total: qs.length,
      solved: s,
      pct: Math.round((s / qs.length) * 100),
    };
  });

  const quizHistory = (progress.quizScores || []).slice(-10).reverse();
  const avgScore = quizHistory.length
    ? Math.round(
        quizHistory.reduce(
          (s, q) => s + Math.round((q.score / q.total) * 100),
          0,
        ) / quizHistory.length,
      )
    : 0;

  const barColor = (pct: number) =>
    pct >= 80 ? C.accent3 : pct >= 50 ? C.accent : C.accent2;

  const statCards = [
    {
      label: "Day Streak",
      value: progress.streakDays,
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
    <>
      <div css={Shared.pageWrapper}>
        <h1 css={S.title}>Your Analytics</h1>

        <div css={S.statsGrid}>
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} css={S.statCard}>
              <div css={S.statIconBox(bg)}>
                <Icon size={16} color={color} />
              </div>
              <div css={S.statValue(color)}>{value}</div>
              <div css={S.statLabel}>{label}</div>
            </div>
          ))}
        </div>

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

        <div css={S.section}>
          <div
            css={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <h2 css={S.sectionTitle}>🎯 Timed Quiz History</h2>
            {avgScore > 0 && (
              <span
                css={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: C.accent3,
                }}
              >
                Avg: {avgScore}%
              </span>
            )}
          </div>
          {quizHistory.length > 0 ? (
            <div css={S.categoryRow}>
              {quizHistory.map((q, i) => {
                const p = Math.round((q.score / q.total) * 100);
                return (
                  <div key={i} css={S.quizHistoryRow}>
                    <span css={S.quizDate}>
                      {format(parseISO(q.date), "MMM d, HH:mm")}
                    </span>
                    <div css={S.barTrack}>
                      <div css={S.barFill(p, barColor(p))} />
                    </div>
                    <span css={[S.quizPct, { color: barColor(p) }]}>{p}%</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div css={S.emptyState}>
              No quiz history yet.{" "}
              <a
                href="/quiz"
                css={{ color: C.accent, textDecoration: "underline" }}
              >
                Take a timed quiz
              </a>{" "}
              to see scores here.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

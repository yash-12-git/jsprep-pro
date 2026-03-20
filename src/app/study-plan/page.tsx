/** @jsxImportSource @emotion/react */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useQuestions";
import { useAllQuestions } from "@/contexts/QuestionsContext";
import PageGuard from "@/components/ui/PageGuard";
import {
  Loader2,
  ChevronLeft,
  RefreshCw,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from "lucide-react";
import * as S from "./styles";
import * as Shared from "@/styles/shared";
import { C, RADIUS } from "@/styles/tokens";
import type { Question } from "@/types/question";

interface StudyPlan {
  readinessScore: number;
  readinessLabel: string;
  summary: string;
  weakSpots: { category: string; reason: string; tip: string }[];
  dailyPlan: {
    day: number;
    focus: string;
    tasks: string[];
    timeMinutes: number;
  }[];
  quickWins: string[];
  focusQuestions: string[];
}

export default function StudyPlanPage() {
  const { user, progress, loading: authLoading } = useAuth();
  const router = useRouter();
  const { theoryQs: questions } = useAllQuestions();
  const { masteredIds } = useUserProgress({ uid: user?.uid ?? null });

  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  const allCats = [...new Set(questions.map((q) => q.category))];
  const catStats = allCats.map((cat) => {
    const qs = questions.filter((q) => q.category === cat);
    const m = qs.filter((q) => masteredIds.includes(q.id)).length;
    return {
      cat,
      total: qs.length,
      mastered: m,
      pct: qs.length > 0 ? Math.round((m / qs.length) * 100) : 0,
    };
  });
  const weakCategories = catStats.filter((c) => c.pct < 50).map((c) => c.cat);
  const strongCategories = catStats
    .filter((c) => c.pct >= 70)
    .map((c) => c.cat);

  async function generatePlan() {
    setGenerating(true);
    setPlan(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "studyplan",
          messages: [{ role: "user", content: "Generate my study plan." }],
          context: {
            masteredCount: masteredIds.length,
            totalQuestions: questions.length,
            weakCategories,
            strongCategories,
            catStats,
            interviewDate: interviewDate || null,
            streakDays: progress?.streakDays,
          },
        }),
      });
      const data = await res.json();
      setPlan(JSON.parse(data.text.replace(/```json|```/g, "").trim()));
    } catch {
      alert("Failed to generate plan. Try again.");
    } finally {
      setGenerating(false);
    }
  }

  // Readiness score colour — calm semantic tokens
  const readColor = (s: number) =>
    s >= 80 ? C.green : s >= 60 ? C.accent : s >= 40 ? C.amber : C.red;

  const focusQs: Question[] = (plan?.focusQuestions ?? [])
    .map((id) => questions.find((q) => q.id === id))
    .filter((q): q is Question => !!q);

  return (
    <PageGuard
      loading={authLoading || !user || !progress}
      ready={!!progress}
      isPro={progress?.isPro}
      proReason="AI Study Plan is a Pro feature. Upgrade to get a personalized roadmap!"
    >
        <div css={Shared.pageWrapper}>
          {/* Back button */}
          <button
            css={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              color: C.muted,
              fontSize: "0.875rem",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: "1.5rem",
              transition: "color 0.12s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            onClick={() => router.push("/dashboard")}
          >
            <ChevronLeft size={16} /> Back to Questions
          </button>

          {/* Header */}
          <div css={S.header}>
            <h1 css={S.title}>🧠 AI Study Plan</h1>
            <p css={S.subtitle}>
              Personalized based on your mastery, quiz history, and weak areas.
            </p>
          </div>

          {/* Input card */}
          <div css={S.inputCard}>
            <p css={[S.inputLabel, { marginBottom: "0.5rem" }]}>
              When is your interview?{" "}
              <span
                css={{
                  textTransform: "none",
                  letterSpacing: 0,
                  color: C.muted,
                  fontWeight: 400,
                }}
              >
                (optional)
              </span>
            </p>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              css={S.dateInput}
            />

            {/* Stat chips */}
            <div
              css={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "0.625rem",
                margin: "1.25rem 0",
              }}
            >
              {[
                { v: masteredIds.length, l: "Mastered", c: C.accent },
                { v: weakCategories.length, l: "Weak Areas", c: C.red },
                { v: `${progress?.streakDays}d`, l: "Streak", c: C.amber },
              ].map(({ v, l, c }) => (
                <div
                  key={l}
                  css={{
                    background: C.bgSubtle,
                    border: `1px solid ${C.border}`,
                    borderRadius: RADIUS.lg,
                    padding: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    css={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: c,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {v}
                  </div>
                  <div
                    css={{
                      fontSize: "0.625rem",
                      color: C.muted,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>

            <button
              css={Shared.primaryBtn(C.amber)}
              onClick={generatePlan}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2
                    size={15}
                    css={{ animation: "spin 1s linear infinite" }}
                  />{" "}
                  Analyzing…
                </>
              ) : plan ? (
                <>
                  <RefreshCw size={15} /> Regenerate Plan
                </>
              ) : (
                <>
                  <Zap size={15} /> Generate My Study Plan
                </>
              )}
            </button>
          </div>

          {/* Plan sections */}
          {plan && (
            <div
              css={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Readiness score */}
              <div css={[S.section, { textAlign: "center" }]}>
                <div
                  css={{
                    fontSize: "3.25rem",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: readColor(plan.readinessScore),
                    marginBottom: "0.25rem",
                  }}
                >
                  {plan.readinessScore}%
                </div>
                <div
                  css={{
                    fontSize: "1.0625rem",
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: "0.75rem",
                  }}
                >
                  {plan.readinessLabel}
                </div>
                <p
                  css={{
                    fontSize: "0.875rem",
                    color: C.muted,
                    lineHeight: 1.7,
                  }}
                >
                  {plan.summary}
                </p>
              </div>

              {/* Weak spots */}
              {plan.weakSpots.length > 0 && (
                <div css={[S.section, { borderColor: C.redBorder }]}>
                  <div
                    css={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <AlertTriangle size={15} color={C.red} />
                    <h2 css={[S.sectionTitle, { color: C.red, margin: 0 }]}>
                      Weak Spots Detected
                    </h2>
                  </div>
                  {plan.weakSpots.map((ws, i) => (
                    <div
                      key={i}
                      css={{
                        borderLeft: `3px solid ${C.redBorder}`,
                        paddingLeft: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <p
                        css={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: C.text,
                          marginBottom: "0.25rem",
                        }}
                      >
                        {ws.category}
                      </p>
                      <p
                        css={{
                          fontSize: "0.75rem",
                          color: C.muted,
                          marginBottom: "0.25rem",
                          lineHeight: 1.55,
                        }}
                      >
                        {ws.reason}
                      </p>
                      <p
                        css={{
                          fontSize: "0.75rem",
                          color: C.green,
                          lineHeight: 1.55,
                        }}
                      >
                        💡 {ws.tip}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick wins */}
              <div css={[S.section, { borderColor: C.greenBorder }]}>
                <div
                  css={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <Zap size={15} color={C.green} />
                  <h2 css={[S.sectionTitle, { color: C.green, margin: 0 }]}>
                    Quick Wins
                  </h2>
                </div>
                {plan.quickWins.map((win, i) => (
                  <div
                    key={i}
                    css={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      fontSize: "0.875rem",
                      color: C.text,
                      marginBottom: "0.5rem",
                      lineHeight: 1.6,
                    }}
                  >
                    <CheckCircle
                      size={14}
                      color={C.green}
                      style={{ flexShrink: 0, marginTop: 2 }}
                    />
                    {win}
                  </div>
                ))}
              </div>

              {/* Focus questions */}
              {focusQs.length > 0 && (
                <div css={[S.section, { borderColor: C.border }]}>
                  <div
                    css={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <Target size={15} color={C.accent} />
                    <h2 css={[S.sectionTitle, { color: C.accent, margin: 0 }]}>
                      Focus On These Questions
                    </h2>
                  </div>
                  {focusQs.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => router.push("/dashboard")}
                      css={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "0.75rem 0.875rem",
                        background: C.bgSubtle,
                        border: `1px solid ${C.border}`,
                        borderRadius: RADIUS.lg,
                        marginBottom: "0.5rem",
                        cursor: "pointer",
                        transition: "border-color 0.12s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = C.borderStrong)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = C.border)
                      }
                    >
                      <span
                        css={{
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          color: C.accent,
                          marginRight: "0.5rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {q.category}
                      </span>
                      <span css={{ fontSize: "0.8125rem", color: C.text }}>
                        {q.title}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Daily plan */}
              <div css={S.section}>
                <div
                  css={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <Calendar size={15} color={C.amber} />
                  <h2 css={[S.sectionTitle, { color: C.amber, margin: 0 }]}>
                    Daily Study Plan
                  </h2>
                </div>
                {plan.dailyPlan.map((day) => (
                  <div
                    key={day.day}
                    css={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "flex-start",
                      marginBottom: "1rem",
                      paddingBottom: "1rem",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                    // Remove border on last item via emotion workaround: handled in JSX
                  >
                    {/* Day badge */}
                    <div
                      css={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: RADIUS.md,
                        background: C.amberSubtle,
                        border: `1px solid ${C.amberBorder}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        css={{
                          fontSize: "0.5rem",
                          color: C.muted,
                          textTransform: "uppercase",
                        }}
                      >
                        Day
                      </span>
                      <span
                        css={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          color: C.amber,
                          lineHeight: 1,
                        }}
                      >
                        {day.day}
                      </span>
                    </div>

                    <div css={{ flex: 1 }}>
                      <div
                        css={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <p
                          css={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: C.text,
                          }}
                        >
                          {day.focus}
                        </p>
                        <span
                          css={{
                            fontSize: "0.625rem",
                            color: C.muted,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {day.timeMinutes} min
                        </span>
                      </div>
                      {day.tasks.map((task, i) => (
                        <div
                          key={i}
                          css={{
                            fontSize: "0.75rem",
                            color: C.muted,
                            marginBottom: "0.25rem",
                            display: "flex",
                            gap: "0.375rem",
                            lineHeight: 1.55,
                          }}
                        >
                          <span css={{ color: C.amber, flexShrink: 0 }}>·</span>
                          {task}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
    </PageGuard>
  );
}

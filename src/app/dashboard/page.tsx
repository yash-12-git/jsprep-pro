/**
 * app/home/page.tsx
 *
 * Server component — orchestrates the /home page.
 *
 * What lives here (server):
 *   - Cached Firestore reads via cachedQueries (one read per deploy / revalidate)
 *   - Sprint CTA — pure static markup, no reason to ship to client
 *   - Section composition
 *
 * What stays client-side:
 *   - HomeClient   → greeting + mode progress cards (needs useAuth, useUserProgress)
 *   - QuestionOfTheDay (already a server component with client shell)
 *   - LeaderboardWrapper → uses getWeeklyLeaderboardCached internally
 *   - LearnSection → already handles its own cached reads
 *
 * Auth: intentionally NOT checked here — logged-out users can visit /home.
 * Individual sections degrade gracefully when user is null.
 */

import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getQuestions } from "@/lib/cachedQueries";
import HomeClient from "./components/HomeClient";
import LeaderboardWrapper from "./components/LeaderboardWrapper";
import LearnSection from "./components/LearnSection";
import QuestionOfTheDay from "./components/QuestionOfTheDayWrapper";
import { getServerTrack } from "@/lib/getServerTrack";

// ─── Data fetching ────────────────────────────────────────────────────────────
// All four reads are parallelised with Promise.all.
// Each is served from Next.js Data Cache — Firestore is not hit on repeated visits.

async function getQuestionTotals() {
  const track = await getServerTrack();
  const [theory, output, debug, polyfill] = await Promise.all([
    getQuestions({ filters: { track, status: "published", type: "theory"   }, pageSize: 300 }).catch(() => ({ questions: [] })),
    getQuestions({ filters: { track, status: "published", type: "output"   }, pageSize: 300 }).catch(() => ({ questions: [] })),
    getQuestions({ filters: { track, status: "published", type: "debug"    }, pageSize: 300 }).catch(() => ({ questions: [] })),
    getQuestions({ filters: { track, status: "published", type: "polyfill" }, pageSize: 300 }).catch(() => ({ questions: [] })),
  ]);

  return {
    theoryTotal:   theory.questions.length,
    outputTotal:   output.questions.length,
    debugTotal:    debug.questions.length,
    polyfillTotal: polyfill.questions.length,
    // Pass question IDs so client can cross-reference against solvedIds
    outputIds:    output.questions.map(q => q.id),
    debugIds:     debug.questions.map(q => q.id),
    polyfillIds:  polyfill.questions.map(q => q.id),
  };
}

// ─── Sprint CTA — server-rendered static section ─────────────────────────────
// Pure HTML/CSS — no interactivity, no reason to hydrate.

function SprintCTA() {
  return (
    <div style={{
      maxWidth: "46rem",
      margin: "0 auto",
      padding: "0 1.25rem 1.5rem",
    }}>
      <Link
        href="/sprint"
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          gap:            "1rem",
          padding:        "1rem 1.25rem",
          background:     "var(--color-bg, #ffffff)",
          border:         "1px solid var(--color-border, #e9e9e7)",
          borderRadius:   "0.75rem",
          textDecoration: "none",
          transition:     "border-color 0.12s, background 0.12s",
        }}
        // Hover handled via global CSS below — inline styles can't do :hover
        className="sprint-cta-card"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>⚡</span>
          <div>
            <div style={{
              fontSize:   "0.9375rem",
              fontWeight: 600,
              color:      "var(--color-text, #37352f)",
            }}>
              Take an Interview Sprint
            </div>
            <div style={{
              fontSize:  "0.75rem",
              color:     "var(--color-muted, #787774)",
              marginTop: "1px",
            }}>
              Timed · mixed questions · AI scored · one number tells you if you&apos;re ready
            </div>
          </div>
        </div>
        <span style={{
          display:       "inline-flex",
          alignItems:    "center",
          gap:           "0.375rem",
          padding:       "0.4375rem 1rem",
          borderRadius:  "0.5rem",
          background:    "var(--color-accent, #2383e2)",
          color:         "#ffffff",
          fontSize:      "0.8125rem",
          fontWeight:    600,
          flexShrink:    0,
          whiteSpace:    "nowrap",
        }}>
          Start <ArrowRight size={13} />
        </span>
      </Link>

      {/* Scoped hover style — tiny, no runtime cost */}
      <style>{`
        .sprint-cta-card:hover {
          border-color: var(--color-accent, #2383e2) !important;
          background: var(--color-accent-subtle, #e8f1fb) !important;
        }
      `}</style>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const totals = await getQuestionTotals();

  return (
    <>
      {/* Greeting + mode progress cards — needs auth state (client) */}
      <HomeClient {...totals} />

      {/* Question of the Day — server component with 24hr cache */}
      <div style={{ maxWidth: "46rem", margin: "0 auto", padding: "0 1.25rem 1.5rem" }}>
        <Suspense fallback={null}>
          <QuestionOfTheDay />
        </Suspense>
      </div>

      {/* Sprint CTA — static, server-rendered */}
      <SprintCTA />

      {/* Leaderboard mini — uses getWeeklyLeaderboardCached */}
      <div style={{ maxWidth: "46rem", margin: "0 auto", padding: "0 1.25rem 1.5rem" }}>
        <Suspense fallback={null}>
          <LeaderboardWrapper />
        </Suspense>
      </div>

      {/* Learn section — topics + blog teasers */}
      <div style={{ maxWidth: "46rem", margin: "0 auto", padding: "0 1.25rem 5rem" }}>
        <Suspense fallback={null}>
          <LearnSection />
        </Suspense>
      </div>
    </>
  );
}
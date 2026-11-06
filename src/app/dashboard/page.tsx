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

import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo/seo";
import { C } from "@/styles/tokens";
import { Suspense } from "react";
import Link from "next/link";
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
    <div style={{ maxWidth: "60rem", margin: "0 auto", padding: "0 var(--gutter) var(--space-lg)" }}>
      <Link href="/sprint" className="doc-panel doc-panel__head" style={{ border: "1px solid var(--color-rule)", textDecoration: "none", alignItems: "center" }}>
        <span>
          <span className="doc-h3" style={{ display: "block" }}>
            Take an Interview Sprint
          </span>
          <span className="doc-line">
            Timed, mixed questions, AI scored, one number tells you
          </span>
        </span>
        <span className="btn btn--primary btn--small">Start</span>
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const metadata: Metadata = pageMeta({
  title: "Dashboard",
  description: "Your JSPrep Pro practice dashboard.",
  path: "/dashboard",
  noindex: true,
});

export default async function HomePage() {
  const totals = await getQuestionTotals();

  return (
    <>
      {/* Greeting + mode progress cards — needs auth state (client) */}
      <HomeClient {...totals} />

      {/* Question of the Day — server component with 24hr cache */}
      <div style={{ maxWidth: "60rem", margin: "0 auto", padding: "0 var(--gutter) 1.5rem" }}>
        <Suspense fallback={null}>
          <QuestionOfTheDay />
        </Suspense>
      </div>

      {/* Sprint CTA — static, server-rendered */}
      <SprintCTA />

      {/* Leaderboard mini — uses getWeeklyLeaderboardCached */}
      <div style={{ maxWidth: "60rem", margin: "0 auto", padding: "0 var(--gutter) 1.5rem" }}>
        <Suspense fallback={null}>
          <LeaderboardWrapper />
        </Suspense>
      </div>

      {/* Learn section — topics + blog teasers */}
      <div style={{ maxWidth: "60rem", margin: "0 auto", padding: "0 var(--gutter) 5rem" }}>
        <Suspense fallback={null}>
          <LearnSection />
        </Suspense>
      </div>
    </>
  );
}
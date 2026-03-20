/** @jsxImportSource @emotion/react */
"use client";
// components/home/AuthCTAs.tsx
//
// The ONLY client component needed for homepage hero CTAs.
// Reads auth state and renders the correct href + label.
// Everything else on the page is static server-rendered HTML.

import Link from "next/link";
import { ArrowRight, Zap, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { C } from "@/styles/tokens";
import { btnP, btnO, ctas, qotdBtn, lbCta } from "@/app/page.styles";

// ── Hero CTA pair ─────────────────────────────────────────────────────────────
export function HeroCTAs() {
  const { user } = useAuth();
  const ctaHref = user ? "/dashboard" : "/auth";
  const ctaLabel = user ? "Go to Dashboard" : "Start Free — No Card Needed";

  return (
    <div css={ctas}>
      <Link href={ctaHref} css={btnP}>
        {ctaLabel} <ArrowRight size={16} />
      </Link>
      <a href="#sprint" css={btnO}>
        <Zap size={14} /> Try the Sprint
      </a>
    </div>
  );
}

// ── Sprint start button ───────────────────────────────────────────────────────
export function SprintStartBtn({
  css: sprintStartBtn,
  css2: sprintCTASub,
}: {
  css: any;
  css2: any;
}) {
  const { user } = useAuth();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <Link href={user ? "/sprint" : "/auth"} css={sprintStartBtn}>
        <Zap size={16} /> Start Your Sprint <ArrowRight size={14} />
      </Link>
      <span css={sprintCTASub}>Free 5-question warmup — no card needed</span>
    </div>
  );
}

// ── QOTD button ───────────────────────────────────────────────────────────────
export function QOTDBtn() {
  const { user } = useAuth();
  return (
    <Link href={user ? "/dashboard" : "/auth"} css={qotdBtn}>
      <Calendar size={14} /> Try today's question
    </Link>
  );
}

// ── Leaderboard join CTA ──────────────────────────────────────────────────────
export function LeaderboardCTA() {
  const { user } = useAuth();
  return (
    <Link href={user ? "/dashboard" : "/auth"} css={lbCta}>
      Join the leaderboard — earn XP →
    </Link>
  );
}

// ── Free tier button ──────────────────────────────────────────────────────────
export function FreeTierBtn({ pBtnF }: { pBtnF: any }) {
  const { user } = useAuth();
  const ctaLabel = user ? "Go to Dashboard" : "Get Started Free";
  return (
    <Link href={user ? "/dashboard" : "/auth"} css={pBtnF}>
      {ctaLabel}
    </Link>
  );
}

// ── Bottom CTA ────────────────────────────────────────────────────────────────
export function BottomCTA({ btnP: btnPStyle }: { btnP: any }) {
  const { user } = useAuth();
  const ctaLabel = user ? "Go to Dashboard" : "Start Free — No Card Needed";
  return (
    <Link
      href={user ? "/dashboard" : "/auth"}
      css={btnPStyle}
      style={{ display: "inline-flex" }}
    >
      {ctaLabel} <ArrowRight size={16} />
    </Link>
  );
}

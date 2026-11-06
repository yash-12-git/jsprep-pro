/** @jsxImportSource @emotion/react */
"use client";
// components/home/ProCTA.tsx
//
// The ONLY client component needed for pricing.
// Handles the 3-state upgrade CTA:
//   1. Already Pro  → link to dashboard
//   2. Logged in    → fires Razorpay
//   3. Logged out   → link to /auth

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUpgrade } from "@/hooks/useUpgrade";
import { proActiveBtn, proPayBtn, pBtnP, pcNote, pcError } from "@/app/page.styles";

export default function ProCTA() {
  const { user, progress } = useAuth();
  const { handleUpgrade, loading: payLoading, error: payError } = useUpgrade();

  // ── Already Pro ───────────────────────────────────────────────────────────
  if (user && progress?.isPro) {
    return (
      <>
        <Link href="/dashboard" css={proActiveBtn}>
          You&apos;re Pro. Go to Dashboard
        </Link>
        <p css={pcNote}>
          Pro is active on your account
        </p>
      </>
    );
  }

  // ── Logged in, free ───────────────────────────────────────────────────────
  if (user) {
    return (
      <>
        <button css={proPayBtn} onClick={handleUpgrade} disabled={payLoading}>
          {payLoading ? "Opening payment…" : "Upgrade to Pro"}
        </button>
        {payError && (
          <p css={pcError}>
            {payError}
          </p>
        )}
      </>
    );
  }

  // ── Logged out ────────────────────────────────────────────────────────────
  return (
    <>
      <Link href="/auth" css={pBtnP}>
        Start with Pro
      </Link>
      <p css={pcNote}>
        You&apos;ll sign in or create an account during checkout
      </p>
    </>
  );
}

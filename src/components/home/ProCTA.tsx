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
import { CheckCircle, Zap, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUpgrade } from "@/hooks/useUpgrade";
import { proActiveBtn, proPayBtn, pBtnP } from "@/app/page.styles";

export default function ProCTA() {
  const { user, progress } = useAuth();
  const { handleUpgrade, loading: payLoading, error: payError } = useUpgrade();

  if (user && progress?.isPro) {
    return (
      <>
        <Link href="/dashboard" css={proActiveBtn}>
          <CheckCircle size={15} /> You&apos;re Pro — Go to Dashboard
        </Link>
        <p
          style={{
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.3)",
            textAlign: "center",
            marginTop: "0.625rem",
          }}
        >
          <Sparkles
            size={10}
            style={{ verticalAlign: "middle", marginRight: "3px" }}
          />
          Pro is active on your account
        </p>
      </>
    );
  }

  if (user) {
    return (
      <>
        <button css={proPayBtn} onClick={handleUpgrade} disabled={payLoading}>
          {payLoading ? (
            "Opening payment..."
          ) : (
            <>
              <Zap size={16} /> Upgrade to Pro →
            </>
          )}
        </button>
        {payError && (
          <p
            style={{
              color: "#f76a6a",
              fontSize: "0.75rem",
              textAlign: "center",
              marginTop: "0.5rem",
            }}
          >
            {payError}
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <Link href="/auth" css={pBtnP}>
        Start with Pro →
      </Link>
      <p
        style={{
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.3)",
          textAlign: "center",
          marginTop: "0.625rem",
        }}
      >
        You&apos;ll sign in or create an account during checkout
      </p>
    </>
  );
}

/** @jsxImportSource @emotion/react */
"use client";
import { usePricing } from "@/hooks/usePricing";
import { useUpgrade } from "@/hooks/useUpgrade";
import { Zap, X, CheckCircle } from "lucide-react";
import * as S from "./styles";
import { C } from "@/styles/tokens";
import { proFeatures } from "@/data/homepageStaticData";

interface Props {
  onClose?: () => void;
  reason?: string;
}

export default function PaywallBanner({ onClose, reason }: Props) {
  const pricing = usePricing();
  // Checkout lives entirely in useUpgrade — this component only renders it.
  const { handleUpgrade, loading, error } = useUpgrade({ onSuccess: onClose });

  return (
    <div css={S.overlay}>
      <div css={S.modal}>
        {onClose && (
          <button css={S.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        )}

        <div css={S.iconBox}>
          <Zap size={22} color={C.accent} />
        </div>

        <h2 css={S.title}>Unlock Pro Features</h2>
        {reason && <p css={S.reasonText}>{reason}</p>}

        <p css={S.desc}>
          Upgrade to Pro for unlimited question tracking, bookmarks, quiz mode,
          analytics, AI tools and daily streaks.
        </p>

        <ul css={S.featureList}>
          {proFeatures.map((f) => (
            <li key={f} css={S.featureItem}>
              <CheckCircle
                size={14}
                color={C.green}
                style={{ flexShrink: 0 }}
              />
              {f}
            </li>
          ))}
        </ul>

        {error && <p>{error}</p>}

        <button
          css={S.upgradeBtn}
          onClick={handleUpgrade}
          disabled={loading || pricing.isLoading}
        >
          {loading ? (
            "Loading…"
          ) : (
            <>
              <Zap size={16} />
              Upgrade for {pricing.isLoading ? "…" : pricing.label}
            </>
          )}
        </button>

        <p css={S.legal}>Secure payment via Razorpay · Cancel anytime</p>
      </div>
    </div>
  );
}

async function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return;
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(s);
  });
}

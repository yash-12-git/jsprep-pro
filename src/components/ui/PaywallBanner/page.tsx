/** @jsxImportSource @emotion/react */
"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePricing } from "@/hooks/usePricing";
import { activatePro } from "@/lib/userProgress";
import { Zap, X, CheckCircle } from "lucide-react";
import * as S from "./styles";
import { C } from "@/styles/tokens";
import { proFeatures } from "@/data/homepageStaticData";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Props {
  onClose?: () => void;
  reason?: string;
}
export default function PaywallBanner({ onClose, reason }: Props) {
  const { user, refreshProgress } = useAuth();
  const pricing = usePricing();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Load SDK and create a fresh order in parallel
      const [, order] = await Promise.all([
        loadRazorpay(),
        fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid }),
        }).then(async (r) => {
          if (!r.ok) throw new Error(`order ${r.status}`);
          return r.json();
        }),
      ]);

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "JSPrep Pro",
        description: "Monthly Pro Subscription",
        prefill: { email: user.email ?? "", name: user.displayName ?? "" },
        theme: { color: C.accent },
        modal: { ondismiss: () => setLoading(false) },
        handler: async (response: { razorpay_payment_id: string }) => {
          try {
            await activatePro(user.uid, response.razorpay_payment_id);
            await refreshProgress();
            onClose?.();
          } catch {
            setError(
              "Payment received but activation failed — contact support.",
            );
          } finally {
            setLoading(false);
          }
        },
      });

      rzp.on("payment.failed", (res: { error: { description: string } }) => {
        setError(res.error?.description ?? "Payment failed. Please try again.");
        setLoading(false);
      });

      rzp.open();
    } catch {
      setError("Could not start payment. Check your connection and try again.");
      setLoading(false);
    }
  }

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

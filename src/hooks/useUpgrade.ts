"use client";
/**
 * useUpgrade
 *
 * Single source of truth for the Razorpay payment flow.
 * Used by PaywallBanner, the homepage pricing section, and
 * any future "Upgrade" button.
 */

import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { activatePro } from "@/lib/userProgress";

declare global {
  interface Window {
    Razorpay: any;
  }
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

interface UseUpgradeOptions {
  /** Called after payment + Firestore update succeed */
  onSuccess?: () => void;
}

export function useUpgrade({ onSuccess }: UseUpgradeOptions = {}) {
  const { user, refreshProgress } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = useCallback(async () => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await loadRazorpay();

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Number(process.env.NEXT_PUBLIC_PRO_PRICE_PAISE || 19900), // 199 INR = 19900 paise
        currency: "INR",
        name: "JSPrep Pro",
        description: "Monthly Pro Subscription",
        prefill: {
          email: user.email ?? "",
          name: user.displayName ?? "",
        },
        theme: { color: "#ffffff" },
        modal: {
          ondismiss: () => setLoading(false),
        },
        handler: async (response: { razorpay_payment_id: string }) => {
          try {
            await activatePro(user.uid, response.razorpay_payment_id);
            await refreshProgress();
            onSuccess?.();
          } catch {
            setError(
              "Payment received but activation failed — please contact support.",
            );
          } finally {
            setLoading(false);
          }
        },
      });

      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setLoading(false);
      });

      rzp.open();
    } catch {
      setError("Could not load payment. Check your connection and try again.");
      setLoading(false);
    }
  }, [user, refreshProgress, onSuccess]);

  return { handleUpgrade, loading, error };
}

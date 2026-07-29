"use client";
/**
 * useUpgrade
 *
 * Single source of truth for the Razorpay payment flow.
 * Used by PaywallBanner, the homepage pricing section, and
 * any future "Upgrade" button.
 */

import { useState, useCallback } from "react";
import { User } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { C } from "@/styles/tokens";

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

interface SubscriptionResponse {
  subscriptionId: string;
  currency: string;
  amount: number;
  symbol: string;
  display: string;
}

async function createSubscription(user: User): Promise<SubscriptionResponse> {
  const token = await user.getIdToken();
  const res = await fetch("/api/create-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // No body: the server derives uid from the token and the plan from the IP.
    // Anything sent from here would be attacker-controlled.
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Subscription creation failed (${res.status})`);
  }
  return res.json();
}

interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

/**
 * Hands the signed receipt to the server, which is the only thing that can
 * set isPro. Throws if verification fails so the caller can show an error.
 */
async function verifyPayment(
  user: User,
  response: RazorpaySuccess,
): Promise<void> {
  const token = await user.getIdToken();
  const res = await fetch("/api/verify-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(response),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Verification failed (${res.status})`);
  }
}

interface UseUpgradeOptions {
  /** Called after payment + Firestore update succeed */
  onSuccess?: () => void;
}

interface UseUpgradeReturn {
  handleUpgrade: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useUpgrade({
  onSuccess,
}: UseUpgradeOptions = {}): UseUpgradeReturn {
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
      // Fresh subscription every time — a "created" subscription that was
      // never paid is abandoned harmlessly.
      const [sub] = await Promise.all([
        createSubscription(user),
        loadRazorpay(),
      ]);

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        // Recurring subscription — amount and currency come from the Razorpay
        // plan, so they must NOT be passed here.
        subscription_id: sub.subscriptionId,
        name: "JSPrep Pro",
        description: "Monthly Pro Subscription",
        prefill: {
          email: user.email ?? "",
          name: user.displayName ?? "",
        },
        theme: { color: C.accent },
        modal: {
          ondismiss: () => setLoading(false),
        },
        handler: async (response: RazorpaySuccess) => {
          try {
            await verifyPayment(user, response);
            await refreshProgress();
            onSuccess?.();
          } catch (err) {
            console.error("[useUpgrade] verification failed", err);
            // The webhook is the backstop here — if the payment was genuine,
            // payment.captured will activate Pro server-side regardless.
            setError(
              "Payment received but activation is still processing. Refresh in a minute, or contact support if Pro doesn't appear.",
            );
          } finally {
            setLoading(false);
          }
        },
      });

      rzp.on(
        "payment.failed",
        (response: { error: { description: string } }) => {
          setError(
            response.error?.description ?? "Payment failed. Please try again.",
          );
          setLoading(false);
        },
      );

      rzp.open();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const isOrderError =
        message.startsWith("Subscription creation failed") ||
        message.startsWith("Failed to create subscription");
      setError(
        isOrderError
          ? "Could not initiate payment — please try again."
          : "Could not load payment. Check your connection and try again.",
      );
      setLoading(false);
    }
  }, [user, refreshProgress, onSuccess]);

  return { handleUpgrade, loading, error };
}

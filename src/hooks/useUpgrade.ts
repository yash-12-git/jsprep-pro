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

interface OrderResponse {
  orderId: string;
  currency: string;
  amount: number;
  symbol: string;
  display: string;
}

async function createOrder(userId: string): Promise<OrderResponse> {
  const res = await fetch("/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Order creation failed (${res.status})`);
  }
  return res.json();
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
      // Create a fresh order every time — orders are single-use and expire
      const [order] = await Promise.all([
        createOrder(user.uid),
        loadRazorpay(),
      ]);

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: order.orderId, // ← required for international currencies
        amount: order.amount,
        currency: order.currency,
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
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
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
      setError(
        message.startsWith("Order creation failed")
          ? "Could not initiate payment — please try again."
          : "Could not load payment. Check your connection and try again.",
      );
      setLoading(false);
    }
  }, [user, refreshProgress, onSuccess]);

  return { handleUpgrade, loading, error };
}

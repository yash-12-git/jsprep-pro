/** @jsxImportSource @emotion/react */
"use client";

/**
 * ManageSubscription
 *
 * Renders only for users who have a subscription. Shows renewal or expiry
 * date and lets them cancel — cancellation stops future renewals but keeps
 * access until the period they already paid for runs out.
 */

import { useState } from "react";
import { css } from "@emotion/react";
import { useAuth } from "@/hooks/useAuth";
import { C, RADIUS } from "@/styles/tokens";

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ManageSubscription() {
  const { user, progress, refreshProgress } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  if (!user || !progress?.isPro || !progress.razorpaySubscriptionId) return null;

  const cancelled = progress.subscriptionStatus === "cancelled";

  async function cancel() {
    setBusy(true);
    setError(null);
    try {
      const token = await user!.getIdToken();
      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Cancellation failed");
      }
      await refreshProgress();
      setConfirming(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not cancel — try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div css={card}>
      <div css={row}>
        <span css={label}>Pro subscription</span>
        <span css={status(cancelled)}>
          {cancelled ? "Cancelled" : "Active"}
        </span>
      </div>

      <p css={detail}>
        {cancelled
          ? `Pro access ends on ${formatDate(progress.proExpiresAt)}. You won't be charged again.`
          : `Renews on ${formatDate(progress.proExpiresAt)}.`}
      </p>

      {error && <p css={errorText}>{error}</p>}

      {!cancelled &&
        (confirming ? (
          <div css={row}>
            <button css={danger} onClick={cancel} disabled={busy}>
              {busy ? "Cancelling…" : "Yes, cancel"}
            </button>
            <button
              css={ghost}
              onClick={() => setConfirming(false)}
              disabled={busy}
            >
              Keep Pro
            </button>
          </div>
        ) : (
          <button css={ghost} onClick={() => setConfirming(true)}>
            Cancel subscription
          </button>
        ))}
    </div>
  );
}

const card = css`
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const row = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
`;

const label = css`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${C.text};
`;

const status = (cancelled: boolean) => css`
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${cancelled ? C.amber : C.green};
`;

const detail = css`
  font-size: 0.78rem;
  color: ${C.muted};
  margin: 0;
`;

const errorText = css`
  font-size: 0.75rem;
  color: ${C.red};
  margin: 0;
`;

const ghost = css`
  font-size: 0.75rem;
  color: ${C.muted};
  background: none;
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.md};
  padding: 0.35rem 0.7rem;
  cursor: pointer;
  align-self: flex-start;
  &:hover {
    color: ${C.text};
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const danger = css`
  ${ghost};
  color: ${C.red};
  border-color: ${C.red};
`;

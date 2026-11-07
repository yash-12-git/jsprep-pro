/**
 * Browser side of feedback and referral rewards. The server decides every
 * grant; this only calls the routes and remembers an invite code until the
 * visitor signs up.
 */

import { auth } from "@/lib/firebase";
import type { FeedbackAnswers } from "@/lib/feedbackOptions";

const REF_KEY = "jsprep-ref";
const REFERRED_KEY = "jsprep-referred";

async function authedFetch(path: string, init: RequestInit = {}) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Sign in first.");
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...init.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong. Try again in a moment.");
  return data;
}

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function referralLink(code: string) {
  return `${window.location.origin}/?ref=${code}`;
}

/** Keeps a ?ref= code from the URL until the visitor signs up. */
export function rememberInviteCode() {
  const code = new URLSearchParams(window.location.search).get("ref");
  if (code && /^[A-Za-z0-9]{8}$/.test(code)) storage()?.setItem(REF_KEY, code.toUpperCase());
}

/** An invite link was opened on this device and not used yet. */
export function hasPendingInvite() {
  return Boolean(storage()?.getItem(REF_KEY));
}

/** Signed up through an invite; the reward waits on a finished sprint. */
export function isReferralPending() {
  return Boolean(storage()?.getItem(REFERRED_KEY));
}

/** Called right after a new account is created. */
export async function claimInviteCode() {
  const code = storage()?.getItem(REF_KEY);
  if (!code) return;
  try {
    const res = await authedFetch("/api/referral/claim", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    if (res.ok) storage()?.setItem(REFERRED_KEY, "1");
    storage()?.removeItem(REF_KEY);
  } catch (err) {
    console.error("[rewards] could not claim invite", err);
  }
}

/** After a sprint with answers: pays out a pending referral, if there is one. */
export async function completeReferral(): Promise<boolean> {
  if (!storage()?.getItem(REFERRED_KEY)) return false;
  try {
    const res = await authedFetch("/api/referral/complete", { method: "POST" });
    if (res.ok || res.reason === "already_rewarded" || res.reason === "not_referred") {
      storage()?.removeItem(REFERRED_KEY);
    }
    return res.ok === true;
  } catch (err) {
    console.error("[rewards] could not complete referral", err);
    return false;
  }
}

export interface ReferralStatus {
  code: string;
  rewarded: number;
  max: number;
  rewardDays: number;
  feedbackDone: boolean;
  /** When earned Pro ends, counting banked days. */
  promoProUntil: string | null;
  /** Days saved to start after a renewing subscription ends. */
  bankedProDays: number;
  renewing: boolean;
}

/** A fixed end date, or days banked behind a renewing subscription. */
export type Grant = { promoProUntil: string } | { bankedDays: number };

export function getReferralStatus(): Promise<ReferralStatus> {
  return authedFetch("/api/referral");
}

export function sendFeedback(answers: FeedbackAnswers): Promise<Grant> {
  return authedFetch("/api/rewards/feedback", {
    method: "POST",
    body: JSON.stringify(answers),
  });
}

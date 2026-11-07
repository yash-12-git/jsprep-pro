/**
 * Free Pro earned by giving feedback or referring friends. Server only.
 *
 * Rewards live in entitlements/{uid}, a doc only the Admin SDK writes, not on
 * the user doc: the live security rules are edited in the console, and a
 * client-writable reward field would let anyone grant themselves Pro. Payment
 * code keeps owning isPro/proExpiresAt; a reward never touches them.
 */

import { FieldValue, type Firestore, type Transaction } from "firebase-admin/firestore";
import { hasRenewingSubscription, type PromoFields } from "@/lib/promoPro";

export const REWARD_DAYS = { feedback: 7, referral: 14 } as const;
/** Referral rewards one referrer can earn, so new accounts can't farm Pro forever. */
export const MAX_REFERRAL_REWARDS = 10;
/** A referral only counts for an account created this recently. */
export const NEW_ACCOUNT_WINDOW_MS = 24 * 60 * 60 * 1000;
/** Fail fast when Firestore is unreachable or over quota, instead of retrying for minutes. */
export const REWARDS_TIMEOUT_MS = 10_000;

const DAY_MS = 24 * 60 * 60 * 1000;

export interface Entitlements extends PromoFields {
  feedbackRewardedAt?: string;
  referralCode?: string;
  /** uid of whoever referred this account. */
  referredBy?: string;
  referredAt?: string;
  /** Set once this account's referral has paid out to both sides. */
  referralRewardedAt?: string;
  /** Referral rewards this account has earned as the referrer. */
  referralsRewarded?: number;
}

/** How a grant was applied, so the UI can say when it starts. */
export type Grant = { promoProUntil: string } | { bankedDays: number };

export const entitlementsRef = (db: Firestore, uid: string) =>
  db.collection("entitlements").doc(uid);

export function withTimeout<T>(work: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Firestore did not respond in time")), REWARDS_TIMEOUT_MS);
  });
  return Promise.race([work, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Adds Pro days. With a renewing subscription the days are banked and start
 * when it ends; otherwise they start after any Pro already running (a
 * cancelled subscription's last paid days, or earlier earned time).
 * Reads must already be done in `tx`.
 */
export function grantProDays(
  tx: Transaction,
  db: Firestore,
  uid: string,
  days: number,
  current: { entitlements?: Entitlements; user?: FirebaseFirestore.DocumentData },
  extra: Partial<Entitlements> = {},
): Grant {
  const ref = entitlementsRef(db, uid);
  if (hasRenewingSubscription(current.user)) {
    tx.set(ref, { ...extra, bankedProDays: FieldValue.increment(days) }, { merge: true });
    return { bankedDays: (current.entitlements?.bankedProDays ?? 0) + days };
  }
  const paidUntil = current.user?.isPro === true ? current.user.proExpiresAt : null;
  const start = Math.max(
    Date.now(),
    ...[current.entitlements?.promoProUntil, paidUntil].map((d) =>
      d ? new Date(d).getTime() || 0 : 0,
    ),
  );
  const promoProUntil = new Date(start + days * DAY_MS).toISOString();
  tx.set(ref, { ...extra, promoProUntil }, { merge: true });
  return { promoProUntil };
}

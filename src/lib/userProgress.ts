import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  increment,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

export interface UserProgress {
  uid: string;
  isPro: boolean;
  isAdmin?: boolean; // for future admin-only features
  subscriptionId?: string; // Stripe subscription or payment ID
  masteredIds: number[];
  bookmarkedIds: number[];
  streakDays: number;
  lastActiveDate: string;
  totalSessions: number;
  quizScores: { date: string; score: number; total: number }[];
  joinedAt: string;
  proActivatedAt?: string;
  proExpiresAt?: string | null;
  subscriptionStatus?: string;
  lastRenewedAt?: string;
  // Output quiz progress
  solvedOutputIds: number[];
  revealedOutputIds: number[];
  // Debug lab progress
  solvedDebugIds: number[];
  revealedDebugIds: number[];
  // XP system — for leaderboard
  xp: number; // all-time XP
  weeklyXp: number; // resets each Monday
  weeklyXpResetDate: string; // ISO date of last Monday reset
  displayName?: string; // cached for leaderboard display
  photoURL?: string; // cached for leaderboard display
  // Counter field — incremented when mastering, decremented when un-mastering.
  // Replaces the deprecated masteredIds array for leaderboard counts.
  masteredCount?: number;
}

const DEFAULT_PROGRESS: Omit<UserProgress, "uid"> = {
  isPro: false,
  masteredIds: [],
  bookmarkedIds: [],
  streakDays: 0,
  lastActiveDate: "",
  totalSessions: 0,
  quizScores: [],
  joinedAt: new Date().toISOString(),
  solvedOutputIds: [],
  revealedOutputIds: [],
  solvedDebugIds: [],
  revealedDebugIds: [],
  xp: 0,
  weeklyXp: 0,
  weeklyXpResetDate: "",
};

/**
 * getUserProgressAndStreak — single read, handles both in one call.
 * Use this in useAuth instead of calling getUserProgress + updateStreak separately.
 * Saves 1 Firestore read on every page load for logged-in users.
 */
export async function getUserProgressAndStreak(
  uid: string,
): Promise<UserProgress> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  // New user: create doc and return
  if (!snap.exists()) {
    const data = {
      uid,
      ...DEFAULT_PROGRESS,
      lastActiveDate: new Date().toDateString(),
    };
    await setDoc(ref, data);
    return data;
  }

  const data = { ...DEFAULT_PROGRESS, ...(snap.data() as UserProgress), uid };

  // Inline streak update — no second getDoc needed
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86_400_000).toDateString();

  if (data.lastActiveDate !== today) {
    const streakDays =
      data.lastActiveDate === yesterday ? (data.streakDays || 0) + 1 : 1;
    // Fire-and-forget — don't await, let the page render immediately
    updateDoc(ref, { streakDays, lastActiveDate: today }).catch(() => {});
    return { ...data, streakDays, lastActiveDate: today };
  }

  return data;
}


export async function saveQuizScore(uid: string, score: number, total: number) {
  const ref = doc(db, "users", uid);
  const entry = { date: new Date().toISOString(), score, total };
  await updateDoc(ref, {
    quizScores: arrayUnion(entry),
    totalSessions: increment(1),
  });
}

export async function activatePro(uid: string, subscriptionId: string) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    isPro: true,
    subscriptionId,
    proActivatedAt: new Date().toISOString(),
  });
}

// ─── XP System ────────────────────────────────────────────────────────────────

export const XP = {
  MASTER_QUESTION: 10,
  SOLVE_OUTPUT: 8,
  SOLVE_DEBUG: 8,
  QUIZ_CORRECT: 5,
  STREAK_BONUS: 3, // per day of streak, added on login
} as const;

function getMondayISO(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

// ─── awardProgressXP — THE XP BRIDGE ─────────────────────────────────────────
// Called by useQuestions.ts (subcollection hooks) to keep the root user doc
// XP fields in sync. This is the ONLY place weeklyXp should be written.
//
// masteredDelta: +1 when mastering, -1 when un-mastering, 0 for output/debug solves.
// No getDoc needed — always increments. Weekly reset is enforced by leaderboard filter.

export async function awardProgressXP(
  uid: string,
  points: number,
  masteredDelta: -1 | 0 | 1 = 0,
): Promise<void> {
  const ref = doc(db, "users", uid);
  const thisMonday = getMondayISO();
  const updates: Record<string, unknown> = {
    xp: increment(points),
    weeklyXp: increment(points),
    weeklyXpResetDate: thisMonday,
  };
  if (masteredDelta !== 0) {
    updates.masteredCount = increment(masteredDelta);
  }
  await updateDoc(ref, updates).catch(() => {});
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL?: string;
  weeklyXp: number;
  xp: number;
  streakDays: number;
  masteredCount: number;
  isPro: boolean;
}

export async function getWeeklyLeaderboard(
  topN = 10,
): Promise<LeaderboardEntry[]> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("weeklyXp", "desc"), limit(topN));
    const snap = await getDocs(q);

    const thisMonday = getMondayISO();
    
    return (
      snap.docs
        .map((d) => {
          const data = d.data() as UserProgress;
          return {
            uid: data.uid,
            displayName: data.displayName ?? "Anonymous",
            photoURL: data.photoURL,
            weeklyXp: data.weeklyXp ?? 0,
            xp: data.xp ?? 0,
            streakDays: data.streakDays ?? 0,
            masteredCount: data.masteredCount ?? 0, // counter field, not old array
            isPro: data.isPro ?? false,
            weeklyXpResetDate: data.weeklyXpResetDate ?? "",
          };
        })
        // Only show users who have actually earned XP this week (not stale values from previous weeks)
        .filter((e) => e.weeklyXp > 0 && e.weeklyXpResetDate >= thisMonday)
    );
  } catch(error) {
    return [];
  }
}

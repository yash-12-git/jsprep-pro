import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
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
  razorpaySubscriptionId?: string;
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
  solvedOutputIds: number[];
  revealedOutputIds: number[];
  solvedDebugIds: number[];
  revealedDebugIds: number[];
  xp: number;
  weeklyXp: number;
  weeklyXpResetDate: string;
  displayName?: string;
  photoURL?: string;
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

export async function getUserProgress(uid: string): Promise<UserProgress> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const data = { uid, ...DEFAULT_PROGRESS };
    await setDoc(ref, data);
    return data;
  }
  const data = snap.data() as UserProgress;
  return { ...DEFAULT_PROGRESS, ...data, uid };
}

/**
 * getUserProgressAndStreak — single read combining getUserProgress + updateStreak.
 *
 * BEFORE: useAuth called getUserProgress(uid) then updateStreak(uid) — 2 reads per page load.
 * AFTER:  useAuth calls getUserProgressAndStreak(uid) — 1 read per page load.
 *
 * Wire this into useAuth.tsx:
 *   import { getUserProgressAndStreak, UserProgress } from '@/lib/userProgress'
 *   const p = await getUserProgressAndStreak(u.uid)   // replaces the two-call pattern
 */
export async function getUserProgressAndStreak(
  uid: string,
): Promise<UserProgress> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const data = {
      uid,
      ...DEFAULT_PROGRESS,
      lastActiveDate: new Date().toDateString(),
    };
    await setDoc(ref, data);
    return data;
  }

  const data: UserProgress = {
    ...DEFAULT_PROGRESS,
    ...(snap.data() as UserProgress),
    uid,
  };

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86_400_000).toDateString();

  if (data.lastActiveDate !== today) {
    const streakDays =
      data.lastActiveDate === yesterday ? (data.streakDays || 0) + 1 : 1;
    // Fire-and-forget — don't block page render on a write
    updateDoc(ref, { streakDays, lastActiveDate: today }).catch(() => {});
    return { ...data, streakDays, lastActiveDate: today };
  }

  return data;
}

export async function markMastered(
  uid: string,
  questionId: number,
  mastered: boolean,
) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    masteredIds: mastered ? arrayUnion(questionId) : arrayRemove(questionId),
  });
}

export async function toggleBookmark(
  uid: string,
  questionId: number,
  bookmarked: boolean,
) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    bookmarkedIds: bookmarked
      ? arrayUnion(questionId)
      : arrayRemove(questionId),
  });
}

export async function saveQuizScore(uid: string, score: number, total: number) {
  const ref = doc(db, "users", uid);
  const entry = { date: new Date().toISOString(), score, total };
  await updateDoc(ref, {
    quizScores: arrayUnion(entry),
    totalSessions: increment(1),
  });
}

export async function markOutputSolved(uid: string, questionId: number) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { solvedOutputIds: arrayUnion(questionId) });
}

export async function markOutputRevealed(uid: string, questionId: number) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { revealedOutputIds: arrayUnion(questionId) });
}

export async function markDebugSolved(uid: string, questionId: number) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { solvedDebugIds: arrayUnion(questionId) });
}

export async function markDebugRevealed(uid: string, questionId: number) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { revealedDebugIds: arrayUnion(questionId) });
}

/** @deprecated Use getUserProgressAndStreak() — kept for any non-auth callers */
export async function updateStreak(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as UserProgress;
  const today = new Date().toDateString();
  const last = data.lastActiveDate;
  let streakDays = data.streakDays || 0;
  if (last === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  streakDays = last === yesterday ? streakDays + 1 : 1;
  await updateDoc(ref, { streakDays, lastActiveDate: today });
}

export async function activatePro(uid: string, subscriptionId: string) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { isPro: true, razorpaySubscriptionId: subscriptionId });
}

// ─── XP System ────────────────────────────────────────────────────────────────

export const XP = {
  MASTER_QUESTION: 10,
  SOLVE_OUTPUT: 8,
  SOLVE_DEBUG: 8,
  QUIZ_CORRECT: 5,
  STREAK_BONUS: 3,
} as const;

function getMondayISO(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

async function awardXP(
  uid: string,
  points: number,
  displayName?: string,
  photoURL?: string,
) {
  const ref = doc(db, "users", uid);
  const thisMonday = getMondayISO();
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as UserProgress;
  const needsReset = (data.weeklyXpResetDate ?? "") < thisMonday;
  const updates: Record<string, unknown> = {
    xp: increment(points),
    weeklyXpResetDate: thisMonday,
    weeklyXp: needsReset ? points : increment(points),
  };
  if (displayName) updates.displayName = displayName;
  if (photoURL) updates.photoURL = photoURL;
  await updateDoc(ref, updates);
}

export async function markMasteredWithXP(
  uid: string,
  questionId: number,
  mastered: boolean,
  displayName?: string,
  photoURL?: string,
) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    masteredIds: mastered ? arrayUnion(questionId) : arrayRemove(questionId),
  });
  if (mastered) await awardXP(uid, XP.MASTER_QUESTION, displayName, photoURL);
}

export async function markOutputSolvedWithXP(
  uid: string,
  questionId: number,
  displayName?: string,
  photoURL?: string,
) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { solvedOutputIds: arrayUnion(questionId) });
  await awardXP(uid, XP.SOLVE_OUTPUT, displayName, photoURL);
}

export async function markDebugSolvedWithXP(
  uid: string,
  questionId: number,
  displayName?: string,
  photoURL?: string,
) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { solvedDebugIds: arrayUnion(questionId) });
  await awardXP(uid, XP.SOLVE_DEBUG, displayName, photoURL);
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
    return snap.docs
      .map((d) => {
        const data = d.data() as UserProgress;
        return {
          uid: data.uid,
          displayName: data.displayName ?? "Anonymous",
          photoURL: data.photoURL,
          weeklyXp: data.weeklyXp ?? 0,
          xp: data.xp ?? 0,
          streakDays: data.streakDays ?? 0,
          masteredCount: (data.masteredIds ?? []).length,
          isPro: data.isPro ?? false,
        };
      })
      .filter((e) => e.weeklyXp > 0);
  } catch {
    return [];
  }
}

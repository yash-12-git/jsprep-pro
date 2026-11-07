/**
 * Saved sprint results. A sprint finished while signed out is held in the
 * browser, then moved to the account the next time that browser signs in.
 */

import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface SavedSprint {
  score: number;
  maxScore: number;
  accuracy: number;
  timeUsedSecs: number;
  questionCount: number;
  /** Questions answered, not skipped. Missing on sprints saved before Nov 2026. */
  attempted?: number;
  strengths: string[];
  weakAreas: string[];
  completedAt: string;
}

/**
 * A sprint where nothing was answered (time ran out, or every question was
 * skipped). These used to be saved as 0% results. Older ones have no
 * `attempted` field, but an answered sprint always lands at least one
 * category in strengths or weak areas unless it scored points.
 */
export function isEmptySprint(s: SavedSprint) {
  if (typeof s.attempted === "number") return s.attempted === 0;
  return (
    s.score === 0 &&
    s.accuracy === 0 &&
    !s.strengths?.length &&
    !s.weakAreas?.length
  );
}

const PENDING_KEY = "jsprep-pending-sprint";

export function saveSprint(uid: string, sprint: SavedSprint) {
  const id = `${uid}_${new Date(sprint.completedAt).getTime()}`;
  return setDoc(doc(db, "users", uid, "sprints", id), sprint);
}

export function holdSprintForSignIn(sprint: SavedSprint) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(sprint));
  } catch {
    // Browser storage is unavailable, so this result just won't carry over.
  }
}

export async function savePendingSprint(uid: string) {
  try {
    const held = localStorage.getItem(PENDING_KEY);
    if (!held) return;
    await saveSprint(uid, JSON.parse(held) as SavedSprint);
    localStorage.removeItem(PENDING_KEY);
  } catch (err) {
    console.error("[sprintHistory] could not save held sprint", err);
  }
}

/** The latest sprints where something was answered, newest first. */
export async function getRecentSprints(
  uid: string,
  count: number,
): Promise<SavedSprint[]> {
  // Read extra so empty sprints saved by older versions don't crowd out real ones.
  const snap = await getDocs(
    query(
      collection(db, "users", uid, "sprints"),
      orderBy("completedAt", "desc"),
      limit(count * 3),
    ),
  );
  return snap.docs
    .map((d) => d.data() as SavedSprint)
    .filter((s) => !isEmptySprint(s))
    .slice(0, count);
}

export async function getLatestSprint(uid: string): Promise<SavedSprint | null> {
  const [latest] = await getRecentSprints(uid, 1);
  return latest ?? null;
}

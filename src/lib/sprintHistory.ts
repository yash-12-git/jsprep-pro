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
  strengths: string[];
  weakAreas: string[];
  completedAt: string;
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

export async function getRecentSprints(
  uid: string,
  count: number,
): Promise<SavedSprint[]> {
  const snap = await getDocs(
    query(
      collection(db, "users", uid, "sprints"),
      orderBy("completedAt", "desc"),
      limit(count),
    ),
  );
  return snap.docs.map((d) => d.data() as SavedSprint);
}

export async function getLatestSprint(uid: string): Promise<SavedSprint | null> {
  const [latest] = await getRecentSprints(uid, 1);
  return latest ?? null;
}

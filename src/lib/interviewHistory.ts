/**
 * Saved mock interviews. Each finished interview stores its config, the
 * transcript and the AI scorecard under users/{uid}/interviews.
 */

import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SetupConfig } from "@/lib/mockInterviewOptions";
import type {
  Message,
  ScoreBreakdown,
} from "@/app/mock-interview/MockInterviewClient";

export interface SavedInterview {
  id: string;
  config: SetupConfig;
  messages: Message[];
  scorecard: ScoreBreakdown;
  duration: number;
  /** ISO string; empty while the server timestamp is still pending. */
  createdAt: string;
}

/**
 * Until 7 Nov 2026 a scorecard with missing scores was saved with every score
 * as 0. Those aren't results, so they are shown as unscored and left out of
 * the study plan and the dashboard.
 */
export function isUnscored(card: ScoreBreakdown) {
  return [card.overall, card.concepts, card.problemSolving, card.communication, card.depth].every(
    (s) => !s,
  );
}

export function saveInterview(
  uid: string,
  interview: Omit<SavedInterview, "id" | "createdAt">,
) {
  return addDoc(collection(db, "users", uid, "interviews"), {
    ...interview,
    createdAt: serverTimestamp(),
  });
}

export async function getRecentInterviews(
  uid: string,
  count: number,
): Promise<SavedInterview[]> {
  const snap = await getDocs(
    query(
      collection(db, "users", uid, "interviews"),
      orderBy("createdAt", "desc"),
      limit(count),
    ),
  );
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      ...(data as Omit<SavedInterview, "id" | "createdAt">),
      id: d.id,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : "",
    };
  });
}

/**
 * Readiness scores from each generated study plan, kept so the dashboard can
 * show the latest score and how it moved. Stored under users/{uid}/readiness,
 * not on the user doc, because user docs are readable by any signed-in user.
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

export interface ReadinessSnapshot {
  score: number;
  label: string;
  weakSpots: string[];
  createdAt: string;
}

export function saveReadiness(uid: string, snapshot: ReadinessSnapshot) {
  const id = String(new Date(snapshot.createdAt).getTime());
  return setDoc(doc(db, "users", uid, "readiness", id), snapshot);
}

/** Newest first. */
export async function getRecentReadiness(
  uid: string,
  count: number,
): Promise<ReadinessSnapshot[]> {
  const snap = await getDocs(
    query(
      collection(db, "users", uid, "readiness"),
      orderBy("createdAt", "desc"),
      limit(count),
    ),
  );
  return snap.docs.map((d) => d.data() as ReadinessSnapshot);
}

/**
 * Real interviews the user has logged, under users/{uid}/interviewLogs.
 * Private to the owner, like sprints and mock interviews.
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { InterviewLog } from "@/lib/interviewLogOptions";

export type SavedInterviewLog = InterviewLog & { id: string };

const logs = (uid: string) => collection(db, "users", uid, "interviewLogs");

export async function addInterviewLog(uid: string, log: InterviewLog) {
  const ref = await addDoc(logs(uid), log);
  return ref.id;
}

export function updateLogOutcome(uid: string, id: string, outcome: string) {
  return updateDoc(doc(logs(uid), id), { outcome });
}

export function deleteInterviewLog(uid: string, id: string) {
  return deleteDoc(doc(logs(uid), id));
}

/** Newest interview first. */
export async function getInterviewLogs(
  uid: string,
  count: number,
): Promise<SavedInterviewLog[]> {
  const snap = await getDocs(query(logs(uid), orderBy("date", "desc"), limit(count)));
  return snap.docs.map((d) => ({ ...(d.data() as InterviewLog), id: d.id }));
}

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
import { forget, remember } from "@/lib/sessionCache";

export type SavedInterviewLog = InterviewLog & { id: string };

const logs = (uid: string) => collection(db, "users", uid, "interviewLogs");

const cacheKey = (uid: string) => `interviewLogs:${uid}:`;

export async function addInterviewLog(uid: string, log: InterviewLog) {
  const ref = await addDoc(logs(uid), log);
  forget(cacheKey(uid));
  return ref.id;
}

export async function updateLogOutcome(uid: string, id: string, outcome: string) {
  await updateDoc(doc(logs(uid), id), { outcome });
  forget(cacheKey(uid));
}

export async function deleteInterviewLog(uid: string, id: string) {
  await deleteDoc(doc(logs(uid), id));
  forget(cacheKey(uid));
}

/** Newest interview first. */
export function getInterviewLogs(uid: string, count: number): Promise<SavedInterviewLog[]> {
  return remember(`${cacheKey(uid)}${count}`, async () => {
    const snap = await getDocs(query(logs(uid), orderBy("date", "desc"), limit(count)));
    return snap.docs.map((d) => ({ ...(d.data() as InterviewLog), id: d.id }));
  });
}

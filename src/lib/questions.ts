/**
 * questions.lib.ts
 *
 * All Firestore reads/writes for the `questions` collection.
 * Pages never import from firebase directly — always go through here.
 *
 * Collection structure:
 *   questions/{questionId}         — Question document
 *   users/{uid}/progress/{qid}    — Per-user per-question progress
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  serverTimestamp,
  increment,
  writeBatch,
  DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  Question,
  QuestionInput,
  QuestionFilters,
  QuestionProgress,
  QuestionType,
  Track,
} from "@/types/question";

const QUESTIONS_COL = "questions";
const USERS_COL = "users";

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getQuestion(id: string): Promise<Question | null> {
  const snap = await getDoc(doc(db, QUESTIONS_COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Question;
}

/** Fetch a question by its slug field (used by /q/[slug]/page.tsx) */
export async function getQuestionBySlug(
  slug: string,
): Promise<Question | null> {
  const q = query(
    collection(db, QUESTIONS_COL),
    where("slug", "==", slug),
    where("status", "==", "published"),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Question;
}

/** All published slugs — for generateStaticParams on /q/[slug] */
export async function getPublishedQuestionSlugs(): Promise<string[]> {
  const snap = await getDocs(
    query(collection(db, QUESTIONS_COL), where("status", "==", "published")),
  );
  return snap.docs.map((d) => (d.data() as Question).slug).filter(Boolean);
}

/** All distinct published categories — replaces static CATEGORIES array */
export async function getPublishedCategories(): Promise<string[]> {
  const snap = await getDocs(
    query(collection(db, QUESTIONS_COL), where("status", "==", "published")),
  );
  const cats = new Set<string>();
  snap.docs.forEach((d) => {
    const cat = (d.data() as Question).category;
    if (cat) cats.add(cat);
  });
  return Array.from(cats).sort();
}

export interface GetQuestionsOptions {
  filters?: QuestionFilters;
  pageSize?: number;
  after?: QueryDocumentSnapshot<DocumentData>;
  orderByField?: keyof Question;
  orderDir?: "asc" | "desc";
}

export interface GetQuestionsResult {
  questions: Question[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export async function getQuestions(
  opts: GetQuestionsOptions = {},
): Promise<GetQuestionsResult> {
  const {
    filters = {},
    pageSize = 50,
    after: afterDoc,
    orderByField = "order",
    orderDir = "asc",
  } = opts;

  const constraints: QueryConstraint[] = [];

  if (filters.type) constraints.push(where("type", "==", filters.type));
  if (filters.track) constraints.push(where("track", "==", filters.track));
  if (filters.category)
    constraints.push(where("category", "==", filters.category));
  if (filters.difficulty)
    constraints.push(where("difficulty", "==", filters.difficulty));
  if (filters.isPro !== undefined)
    constraints.push(where("isPro", "==", filters.isPro));
  if (filters.topicSlug)
    constraints.push(where("topicSlug", "==", filters.topicSlug));
  if (filters.status) constraints.push(where("status", "==", filters.status));
  else constraints.push(where("status", "==", "published"));

  constraints.push(orderBy(orderByField, orderDir));
  constraints.push(limit(pageSize + 1)); // fetch one extra to detect hasMore

  if (afterDoc) constraints.push(startAfter(afterDoc));

  const q = query(collection(db, QUESTIONS_COL), ...constraints);
  const snap = await getDocs(q);

  const hasMore = snap.docs.length > pageSize;
  const docs = hasMore ? snap.docs.slice(0, pageSize) : snap.docs;

  return {
    questions: docs.map((d) => ({ id: d.id, ...d.data() }) as Question),
    lastDoc: docs.length > 0 ? docs[docs.length - 1] : null,
    hasMore,
  };
}

export async function getQuestionList(
  type?: QuestionType,
  track?: Track,
): Promise<
  Pick<
    Question,
    "id" | "slug" | "title" | "category" | "difficulty" | "isPro" | "order"
  >[]
> {
  const constraints: QueryConstraint[] = [
    where("status", "==", "published"),
    orderBy("order", "asc"),
  ];
  if (type) constraints.push(where("type", "==", type));
  if (track) constraints.push(where("track", "==", track));
  const snap = await getDocs(
    query(collection(db, QUESTIONS_COL), ...constraints),
  );
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      slug: data.slug,
      title: data.title,
      category: data.category,
      difficulty: data.difficulty,
      isPro: data.isPro,
      order: data.order,
    };
  });
}

/** Get all unique categories for a given type/track */
export async function getCategories(
  type?: QuestionType,
  track?: Track,
): Promise<string[]> {
  const list = await getQuestionList(type, track);
  return [...new Set(list.map((q) => q.category))].sort();
}

// ─── Write (admin only) ───────────────────────────────────────────────────────

export async function createQuestion(
  input: QuestionInput,
  adminUid: string,
): Promise<string> {
  const ref = await addDoc(collection(db, QUESTIONS_COL), {
    ...input,
    createdBy: adminUid,
    viewCount: 0,
    solveCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateQuestion(
  id: string,
  updates: Partial<QuestionInput>,
): Promise<void> {
  await updateDoc(doc(db, QUESTIONS_COL, id), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteQuestion(id: string): Promise<void> {
  await deleteDoc(doc(db, QUESTIONS_COL, id));
}

export async function publishQuestion(id: string): Promise<void> {
  await updateDoc(doc(db, QUESTIONS_COL, id), {
    status: "published",
    updatedAt: new Date().toISOString(),
  });
}

export async function archiveQuestion(id: string): Promise<void> {
  await updateDoc(doc(db, QUESTIONS_COL, id), {
    status: "archived",
    updatedAt: new Date().toISOString(),
  });
}

/** Bulk update order field after drag-and-drop reordering */
export async function reorderQuestions(
  updates: { id: string; order: number }[],
): Promise<void> {
  const batch = writeBatch(db);
  updates.forEach(({ id, order }) => {
    batch.update(doc(db, QUESTIONS_COL, id), {
      order,
      updatedAt: new Date().toISOString(),
    });
  });
  await batch.commit();
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function incrementViewCount(questionId: string): Promise<void> {
  await updateDoc(doc(db, QUESTIONS_COL, questionId), {
    viewCount: increment(1),
  });
}

export async function incrementSolveCount(questionId: string): Promise<void> {
  await updateDoc(doc(db, QUESTIONS_COL, questionId), {
    solveCount: increment(1),
  });
}

// ─── User Progress (subcollection) ───────────────────────────────────────────

export async function getQuestionProgress(
  uid: string,
  questionId: string,
): Promise<QuestionProgress | null> {
  const ref = doc(db, USERS_COL, uid, "progress", questionId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as QuestionProgress;
}

// Session cache for getAllProgress — avoids re-reading entire subcollection on tab switches
const _progressCache = new Map<
  string,
  { data: QuestionProgress[]; fetchedAt: number }
>();
const PROGRESS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function getAllProgress(uid: string): Promise<QuestionProgress[]> {
  const cached = _progressCache.get(uid);
  if (cached && Date.now() - cached.fetchedAt < PROGRESS_CACHE_TTL_MS) {
    return cached.data;
  }
  const snap = await getDocs(collection(db, USERS_COL, uid, "progress"));
  const data = snap.docs.map((d) => d.data() as QuestionProgress);
  _progressCache.set(uid, { data, fetchedAt: Date.now() });
  return data;
}

/** Call after any progress write to keep the local cache in sync */
export function invalidateProgressCache(uid: string) {
  _progressCache.delete(uid);
}

export async function upsertProgress(
  uid: string,
  questionId: string,
  update: Partial<QuestionProgress>,
): Promise<void> {
  const ref = doc(db, USERS_COL, uid, "progress", questionId);
  const snap = await getDoc(ref);
  invalidateProgressCache(uid); // bust cache so next getAllProgress() re-reads
  if (snap.exists()) {
    await updateDoc(ref, {
      ...update,
      lastAttemptAt: new Date().toISOString(),
    });
  } else {
    await import("firebase/firestore").then(({ setDoc }) =>
      setDoc(ref, {
        questionId,
        status: "attempted",
        attempts: 1,
        ...update,
        lastAttemptAt: new Date().toISOString(),
      }),
    );
  }
}

export async function markMasteredV2(
  uid: string,
  questionId: string,
  mastered: boolean,
): Promise<void> {
  await upsertProgress(uid, questionId, {
    status: mastered ? "mastered" : "attempted",
    ...(mastered ? { masteredAt: new Date().toISOString() } : {}),
  });
  if (mastered) await incrementSolveCount(questionId);
}

export async function markBookmarked(
  uid: string,
  questionId: string,
  bookmarked: boolean,
): Promise<void> {
  await upsertProgress(uid, questionId, {
    status: bookmarked ? "bookmarked" : "attempted",
  });
}

export async function markSolved(
  uid: string,
  questionId: string,
  score?: number,
): Promise<void> {
  await upsertProgress(uid, questionId, {
    status: "solved",
    solvedAt: new Date().toISOString(),
    ...(score !== undefined ? { score } : {}),
    attempts: 1, // will be incremented by upsert
  });
  await incrementSolveCount(questionId);
}

export async function markRevealed(
  uid: string,
  questionId: string,
): Promise<void> {
  await upsertProgress(uid, questionId, { status: "revealed" });
}

// ─── Seed helper (run once from admin panel) ──────────────────────────────────

/**
 * Import legacy static questions from .ts files into Firestore.
 * Call this once from the admin panel.
 */
export async function seedQuestionsFromArray(
  questions: Omit<
    Question,
    "id" | "viewCount" | "solveCount" | "createdAt" | "updatedAt"
  >[],
  adminUid: string,
): Promise<{ created: number; errors: string[] }> {
  const errors: string[] = [];
  let created = 0;
  const batch = writeBatch(db);
  const colRef = collection(db, QUESTIONS_COL);

  for (const q of questions) {
    try {
      const newRef = doc(colRef);
      batch.set(newRef, {
        ...q,
        createdBy: adminUid,
        viewCount: 0,
        solveCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      created++;
      // Firestore batch max = 500 operations. Flush and restart every 400.
      if (created % 400 === 0) {
        await batch.commit();
      }
    } catch (e: any) {
      errors.push(`${q.slug}: ${e.message}`);
    }
  }

  await batch.commit();
  return { created, errors };
}

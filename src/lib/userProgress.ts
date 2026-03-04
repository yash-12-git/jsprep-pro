import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, increment, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

export interface UserProgress {
  uid: string
  isPro: boolean
  razorpaySubscriptionId?: string
  masteredIds: number[]
  bookmarkedIds: number[]
  streakDays: number
  lastActiveDate: string
  totalSessions: number
  quizScores: { date: string; score: number; total: number }[]
  joinedAt: string
  proActivatedAt?: string
  proExpiresAt?: string | null
  subscriptionStatus?: string
  lastRenewedAt?: string
  solvedOutputIds: number[]      // ids of correctly answered output questions
  revealedOutputIds: number[]    // ids that were revealed (partial credit)
  solvedDebugIds: number[]       // ids of correctly AI-checked debug questions
  revealedDebugIds: number[]     // ids that were revealed
}

const DEFAULT_PROGRESS: Omit<UserProgress, 'uid'> = {
  isPro: false,
  masteredIds: [],
  bookmarkedIds: [],
  streakDays: 0,
  lastActiveDate: '',
  totalSessions: 0,
  quizScores: [],
  joinedAt: new Date().toISOString(),
  solvedOutputIds: [],
  revealedOutputIds: [],
  solvedDebugIds: [],
  revealedDebugIds: [],
}

export async function getUserProgress(uid: string): Promise<UserProgress> {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    const data = { uid, ...DEFAULT_PROGRESS }
    await setDoc(ref, data)
    return data
  }
  // Merge defaults for any missing fields (handles old accounts)
  const data = snap.data() as UserProgress
  return {
    ...DEFAULT_PROGRESS,
    ...data,
    uid,
  }
}

export async function markMastered(uid: string, questionId: number, mastered: boolean) {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, {
    masteredIds: mastered ? arrayUnion(questionId) : arrayRemove(questionId),
  })
}

export async function toggleBookmark(uid: string, questionId: number, bookmarked: boolean) {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, {
    bookmarkedIds: bookmarked ? arrayUnion(questionId) : arrayRemove(questionId),
  })
}

export async function saveQuizScore(uid: string, score: number, total: number) {
  const ref = doc(db, 'users', uid)
  const entry = { date: new Date().toISOString(), score, total }
  await updateDoc(ref, {
    quizScores: arrayUnion(entry),
    totalSessions: increment(1),
  })
}

export async function markOutputSolved(uid: string, questionId: number) {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, {
    solvedOutputIds: arrayUnion(questionId),
  })
}

export async function markOutputRevealed(uid: string, questionId: number) {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, {
    revealedOutputIds: arrayUnion(questionId),
  })
}

export async function markDebugSolved(uid: string, questionId: number) {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, {
    solvedDebugIds: arrayUnion(questionId),
  })
}

export async function markDebugRevealed(uid: string, questionId: number) {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, {
    revealedDebugIds: arrayUnion(questionId),
  })
}

export async function updateStreak(uid: string) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  const data = snap.data() as UserProgress
  const today = new Date().toDateString()
  const last = data.lastActiveDate
  let streakDays = data.streakDays || 0

  if (last === today) return
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  streakDays = last === yesterday ? streakDays + 1 : 1

  await updateDoc(ref, { streakDays, lastActiveDate: today })
}

export async function activatePro(uid: string, subscriptionId: string) {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, { isPro: true, razorpaySubscriptionId: subscriptionId })
}
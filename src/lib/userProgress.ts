import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, increment, serverTimestamp, collection, getDocs
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
}

export async function getUserProgress(uid: string): Promise<UserProgress> {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    const data = { uid, ...DEFAULT_PROGRESS }
    await setDoc(ref, data)
    return data
  }
  return snap.data() as UserProgress
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

'use client'
/**
 * useQuestions — fetches and caches questions from Firestore.
 *
 * Features:
 * - In-memory cache (survives navigation, avoids re-fetches)
 * - Category/difficulty/type filtering
 * - Pagination cursor support for future infinite scroll
 * - Optimistic updates for admin edits
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getQuestions, getCategories, type GetQuestionsOptions } from '@/lib/questions'
import type { Question, QuestionFilters, QuestionType, Track } from '@/types/question'

// ─── Simple in-memory cache ───────────────────────────────────────────────────
const cache = new Map<string, { data: Question[]; timestamp: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

function cacheKey(opts: GetQuestionsOptions): string {
  return JSON.stringify(opts)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseQuestionsOptions {
  type?: QuestionType
  track?: Track
  category?: string
  enabled?: boolean  // set false to skip fetch (e.g. user not loaded yet)
}

export function useQuestions({ type, track, category, enabled = true }: UseQuestionsOptions = {}) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchQuestions = useCallback(async () => {
    if (!enabled) return
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    const opts: GetQuestionsOptions = {
      filters: {
        ...(type     ? { type }     : {}),
        ...(track    ? { track }    : {}),
        ...(category ? { category } : {}),
        status: 'published',
      },
      pageSize: 200, // load all for current filter — paginate later if needed
      orderByField: 'order',
      orderDir: 'asc',
    }

    const key = cacheKey(opts)
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setQuestions(cached.data)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await getQuestions(opts)
      cache.set(key, { data: result.questions, timestamp: Date.now() })
      setQuestions(result.questions)
    } catch (e: any) {
      if (e.name !== 'AbortError') setError(e.message ?? 'Failed to load questions')
    } finally {
      setLoading(false)
    }
  }, [type, track, category, enabled])

  useEffect(() => {
    fetchQuestions()
    return () => abortRef.current?.abort()
  }, [fetchQuestions])

  /** Invalidate cache + refetch (call after admin write) */
  const refresh = useCallback(() => {
    cache.clear()
    fetchQuestions()
  }, [fetchQuestions])

  return { questions, loading, error, refresh }
}

// ─── useCategories hook ───────────────────────────────────────────────────────

const catCache = new Map<string, string[]>()

export function useCategories(type?: QuestionType, track?: Track) {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const key = `${type}:${track}`
    const cached = catCache.get(key)
    if (cached) { setCategories(cached); setLoading(false); return }

    getCategories(type, track)
      .then(cats => { catCache.set(key, cats); setCategories(cats) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [type, track])

  return { categories, loading }
}

// ─── useUserProgress hook ─────────────────────────────────────────────────────

import { getAllProgress, upsertProgress, markMasteredV2, markBookmarked, markSolved, markRevealed } from '@/lib/questions'
import type { QuestionProgress } from '@/types/question'

interface UseUserProgressOptions {
  uid: string | null
}

export function useUserProgress({ uid }: UseUserProgressOptions) {
  const [progressMap, setProgressMap] = useState<Map<string, QuestionProgress>>(new Map())
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!uid) { setLoading(false); return }
    try {
      const all = await getAllProgress(uid)
      setProgressMap(new Map(all.map(p => [p.questionId, p])))
    } catch {}
    finally { setLoading(false) }
  }, [uid])

  useEffect(() => { load() }, [load])

  function getProgress(questionId: string): QuestionProgress | null {
    return progressMap.get(questionId) ?? null
  }

  function isMastered(id: string) { return progressMap.get(id)?.status === 'mastered' }
  function isBookmarked(id: string) { return progressMap.get(id)?.status === 'bookmarked' }
  function isSolved(id: string) { const s = progressMap.get(id)?.status; return s === 'solved' || s === 'mastered' }
  function isRevealed(id: string) { return progressMap.get(id)?.status === 'revealed' }

  async function toggleMastered(questionId: string) {
    if (!uid) return
    const current = isMastered(questionId)
    await markMasteredV2(uid, questionId, !current)
    setProgressMap(prev => {
      const next = new Map(prev)
      next.set(questionId, { ...(prev.get(questionId) ?? { questionId, attempts: 0 }), status: current ? 'attempted' : 'mastered' } as QuestionProgress)
      return next
    })
  }

  async function toggleBookmark(questionId: string) {
    if (!uid) return
    const current = isBookmarked(questionId)
    await markBookmarked(uid, questionId, !current)
    setProgressMap(prev => {
      const next = new Map(prev)
      next.set(questionId, { ...(prev.get(questionId) ?? { questionId, attempts: 0 }), status: current ? 'attempted' : 'bookmarked' } as QuestionProgress)
      return next
    })
  }

  async function recordSolved(questionId: string, score?: number) {
    if (!uid) return
    await markSolved(uid, questionId, score)
    setProgressMap(prev => {
      const next = new Map(prev)
      next.set(questionId, { ...(prev.get(questionId) ?? { questionId, attempts: 0 }), status: 'solved', score } as QuestionProgress)
      return next
    })
  }

  async function recordRevealed(questionId: string) {
    if (!uid) return
    await markRevealed(uid, questionId)
    setProgressMap(prev => {
      const next = new Map(prev)
      next.set(questionId, { ...(prev.get(questionId) ?? { questionId, attempts: 0 }), status: 'revealed' } as QuestionProgress)
      return next
    })
  }

  const masteredIds = [...progressMap.values()].filter(p => p.status === 'mastered').map(p => p.questionId)
  const solvedIds   = [...progressMap.values()].filter(p => p.status === 'solved' || p.status === 'mastered').map(p => p.questionId)
  const bookmarkIds = [...progressMap.values()].filter(p => p.status === 'bookmarked').map(p => p.questionId)

  return {
    progressMap, loading, refresh: load,
    getProgress, isMastered, isBookmarked, isSolved, isRevealed,
    toggleMastered, toggleBookmark, recordSolved, recordRevealed,
    masteredIds, solvedIds, bookmarkIds,
  }
}
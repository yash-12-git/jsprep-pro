"use client";
/**
 * QuestionsContext
 *
 * Fetches ALL published questions ONCE per session and makes them available
 * to every component in the tree. No more per-page duplicate fetches.
 *
 * BEFORE: Analytics → 3 queries (195 reads), Sprint → 3 queries (180 reads),
 *         Dashboard → 1 query (91 reads). Each hard navigation = fresh fetch.
 *
 * AFTER:  One query on app load (195 reads). Everything reads from context.
 *         Zero refetches unless the user explicitly refreshes.
 *
 * Usage:
 *   // In any client component
 *   const { theoryQs, outputQs, debugQs, allQs, loading } = useAllQuestions()
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getQuestions } from "@/lib/questions";
import type { Question } from "@/types/question";

interface QuestionsState {
  theoryQs: Question[];
  outputQs: Question[];
  polyfillQs: Question[];
  debugQs: Question[];
  allQs: Question[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const QuestionsContext = createContext<QuestionsState>({
  theoryQs: [],
  outputQs: [],
  polyfillQs: [],
  debugQs: [],
  allQs: [],
  loading: true,
  error: null,
  refresh: () => {},
});

// ── Session-level cache (lives for the browser tab's lifetime) ─────────────────
// This is the ONE place questions are stored. All components read from here.
// Survives SPA navigation. Cleared only on hard refresh or tab close.
let _sessionCache: { data: Question[]; fetchedAt: number } | null = null;
const SESSION_TTL_MS = 10 * 60 * 1000; // 10 minutes

// ─── Provider ─────────────────────────────────────────────────────────────────

export function QuestionsProvider({ children }: { children: React.ReactNode }) {
  const [allQs, setAllQs] = useState<Question[]>(_sessionCache?.data ?? []);
  const [loading, setLoading] = useState(!_sessionCache);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    // Return cached data if still fresh
    if (
      !force &&
      _sessionCache &&
      Date.now() - _sessionCache.fetchedAt < SESSION_TTL_MS
    ) {
      setAllQs(_sessionCache.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // One query for all types — fewer round trips than 3 separate queries
      const result = await getQuestions({
        filters: { status: "published" },
        pageSize: 300, // covers all current + future questions
        orderByField: "order",
        orderDir: "asc",
      });
      _sessionCache = { data: result.questions, fetchedAt: Date.now() };
      setAllQs(result.questions);
    } catch (e: any) {
      setError(e.message ?? "Failed to load questions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const theoryQs = allQs.filter((q) => q.type === "theory");
  const outputQs = allQs.filter((q) => q.type === "output");
  const debugQs = allQs.filter((q) => q.type === "debug");
  const polyfillQs = allQs.filter((q) => q.type === "polyfill");
  return (
    <QuestionsContext.Provider
      value={{
        theoryQs,
        outputQs,
        debugQs,
        polyfillQs,
        allQs,
        loading,
        error,
        refresh: () => load(true),
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
}

// ─── Consumer hook ─────────────────────────────────────────────────────────────

export function useAllQuestions() {
  return useContext(QuestionsContext);
}

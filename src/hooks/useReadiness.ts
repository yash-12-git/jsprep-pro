"use client";

import { useEffect, useRef, useState } from "react";
import { getRecentSprints } from "@/lib/sprintHistory";
import { getRecentInterviews, isUnscored } from "@/lib/interviewHistory";
import { getInterviewLogs } from "@/lib/interviewLog";
import {
  getRecentReadiness,
  saveReadiness,
  type ReadinessSnapshot,
} from "@/lib/readinessHistory";
import {
  computeReadiness,
  modeProgress,
  type QuestionTotals,
  type Readiness,
} from "@/lib/readiness";

interface History {
  sprintAccuracies: number[];
  mockScores: number[];
  realOutcomes: string[];
  snapshots: ReadinessSnapshot[];
}

interface Options {
  uid: string | null;
  totals: QuestionTotals;
  /** From the caller's useUserProgress, so progress isn't read twice. */
  masteredIds: string[];
  solvedIds: string[];
  progressLoading: boolean;
}

/**
 * The signed-in user's readiness, plus the last different score for a trend.
 * A snapshot is saved whenever the score changes, so the trend shows real
 * movement rather than one entry per visit.
 */
export function useReadiness({ uid, totals, masteredIds, solvedIds, progressLoading }: Options) {
  const [history, setHistory] = useState<History | null>(null);
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [previous, setPrevious] = useState<ReadinessSnapshot | null>(null);
  const savedScore = useRef<number | null>(null);

  useEffect(() => {
    if (!uid) return;
    // Each source is optional; a failed read just leaves that part unmeasured.
    const safe = <T,>(p: Promise<T[]>, what: string) =>
      p.catch((err) => {
        console.error(`[useReadiness] could not load ${what}`, err);
        return [] as T[];
      });
    Promise.all([
      safe(getRecentSprints(uid, 5), "sprints"),
      safe(getRecentInterviews(uid, 6), "interviews"),
      safe(getInterviewLogs(uid, 10), "interview log"),
      safe(getRecentReadiness(uid, 2), "readiness history"),
    ]).then(([sprints, interviews, logs, snapshots]) => {
      savedScore.current = snapshots[0]?.score ?? null;
      setPrevious(snapshots[1] ?? null);
      setHistory({
        sprintAccuracies: sprints.map((s) => s.accuracy),
        mockScores: interviews
          .filter((iv) => !isUnscored(iv.scorecard))
          .map((iv) => iv.scorecard.overall),
        realOutcomes: logs.map((l) => l.outcome),
        snapshots,
      });
    });
  }, [uid]);

  const masteredCount = masteredIds.length;
  const solvedCount = solvedIds.length;

  useEffect(() => {
    // Wait for progress too, or coverage would briefly read as 0 and be saved.
    if (!uid || !history || progressLoading) return;
    const next = computeReadiness({
      modes: modeProgress(totals, masteredIds, solvedIds),
      sprintAccuracies: history.sprintAccuracies,
      mockScores: history.mockScores,
      realOutcomes: history.realOutcomes,
    });
    setReadiness(next);
    if (savedScore.current === next.score) return;

    // The score moved: the last saved one becomes the comparison point.
    if (savedScore.current !== null) {
      setPrevious(history.snapshots[0] ?? null);
    }
    savedScore.current = next.score;
    saveReadiness(uid, {
      score: next.score,
      label: next.label,
      weakSpots: next.parts
        .filter((p) => p.value !== null && p.value < 50)
        .map((p) => p.label),
      createdAt: new Date().toISOString(),
    }).catch((err) => console.error("[useReadiness] could not save snapshot", err));
    // The ID arrays are new on every render; their lengths are what change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, history, progressLoading, totals, masteredCount, solvedCount]);

  return { readiness, previous };
}

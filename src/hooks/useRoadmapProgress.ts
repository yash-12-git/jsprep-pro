"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  GlobalStats,
  MonthStats,
  RoadmapProgress,
  WeekStats,
} from "@/data/roadmap/types";
import { ROADMAP, TOTAL_DAYS, TOTAL_WEEKS } from "@/data/roadmap/roadmapData";

const STORAGE_KEY = "jsprep_roadmap_progress_v1";

// ─── helpers ──────────────────────────────────────────────────────────────────

function loadFromStorage(): RoadmapProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(progress: RoadmapProgress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

function calcStreak(progress: RoadmapProgress): number {
  const DAY_MS = 86_400_000;
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const dateStr = cursor.toDateString();
    const found = Object.values(progress).some((ts) => {
      const d = new Date(ts);
      d.setHours(0, 0, 0, 0);
      return d.toDateString() === dateStr;
    });
    if (found) streak++;
    else if (i > 0) break; // allow missing today only if streak > 0
    cursor.setTime(cursor.getTime() - DAY_MS);
  }
  return streak;
}

function calcWeekStats(week: number, progress: RoadmapProgress): WeekStats {
  const start = (week - 1) * 7 + 1;
  let done = 0;
  for (let d = start; d < start + 7; d++) {
    if (progress[d]) done++;
  }
  const total = 7;
  return {
    week,
    done,
    total,
    pct: Math.round((done / total) * 100),
    isComplete: done === total,
  };
}

function calcMonthStats(
  monthIdx: number,
  progress: RoadmapProgress,
): MonthStats {
  const m = ROADMAP[monthIdx - 1];
  if (!m) return { month: monthIdx, done: 0, total: 0, pct: 0 };
  const startDay = (m.weeks[0].week - 1) * 7 + 1;
  const endDay = m.weeks[m.weeks.length - 1].week * 7;
  const total = endDay - startDay + 1;
  let done = 0;
  for (let d = startDay; d <= endDay; d++) {
    if (progress[d]) done++;
  }
  return {
    month: monthIdx,
    done,
    total,
    pct: Math.round((done / total) * 100),
  };
}

function calcGlobalStats(progress: RoadmapProgress): GlobalStats {
  const totalDone = Object.keys(progress).length;
  let weeksComplete = 0;
  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    const start = (w - 1) * 7 + 1;
    let allDone = true;
    for (let d = start; d < start + 7; d++) {
      if (!progress[d]) {
        allDone = false;
        break;
      }
    }
    if (allDone) weeksComplete++;
  }
  return {
    totalDone,
    totalDays: TOTAL_DAYS,
    pct: Math.round((totalDone / TOTAL_DAYS) * 100),
    weeksComplete,
    streak: calcStreak(progress),
  };
}

// ─── hook ─────────────────────────────────────────────────────────────────────

export function useRoadmapProgress() {
  const [progress, setProgress] = useState<RoadmapProgress>({});
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage once on the client
  useEffect(() => {
    setProgress(loadFromStorage());
    setMounted(true);
  }, []);

  const toggleDay = useCallback((day: number) => {
    setProgress((prev) => {
      const next = { ...prev };
      if (next[day]) {
        delete next[day];
      } else {
        next[day] = Date.now();
      }
      saveToStorage(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setProgress({});
    saveToStorage({});
  }, []);

  const isDayDone = useCallback(
    (day: number) => Boolean(progress[day]),
    [progress],
  );

  const getWeekStats = useCallback(
    (week: number) => calcWeekStats(week, progress),
    [progress],
  );

  const getMonthStats = useCallback(
    (monthIdx: number) => calcMonthStats(monthIdx, progress),
    [progress],
  );

  const globalStats = calcGlobalStats(progress);

  return {
    mounted,
    progress,
    globalStats,
    toggleDay,
    resetAll,
    isDayDone,
    getWeekStats,
    getMonthStats,
  };
}

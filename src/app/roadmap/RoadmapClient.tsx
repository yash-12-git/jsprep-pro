"use client";

import { useState, useCallback } from "react";
import { ROADMAP } from "@/data/roadmap/roadmapData";
import { useRoadmapProgress } from "@/hooks/useRoadmapProgress";
import { StatsGrid } from "@/components/ui/Roadmap/StatsGrid";
import { WeekCard } from "@/components/ui/Roadmap/WeekCard";
import type { RoadmapMonth } from "@/data/roadmap/types";

// ─── Month accent colour maps (→ CSS vars) ────────────────────────────────────
const ACCENT = {
  green: {
    tab: "color-mix(in srgb, var(--color-green) 12%, transparent)",
    text: "var(--color-green)",
    border: "var(--color-green-border)",
    bar: "var(--color-green)",
  },
  blue: {
    tab: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
    text: "var(--color-accent)",
    border: "color-mix(in srgb, var(--color-accent) 30%, transparent)",
    bar: "var(--color-accent)",
  },
  amber: {
    tab: "color-mix(in srgb, var(--color-amber) 12%, transparent)",
    text: "var(--color-amber)",
    border: "var(--color-amber-border)",
    bar: "var(--color-amber)",
  },
  coral: {
    tab: "color-mix(in srgb, #f97316 12%, transparent)",
    text: "#f97316",
    border: "color-mix(in srgb, #f97316 30%, transparent)",
    bar: "#f97316",
  },
} satisfies Record<RoadmapMonth["accent"], Record<string, string>>;

// ─── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState<string | null>(null);

  const show = useCallback((text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 2200);
  }, []);

  return { msg, show };
}

// ─── Component ────────────────────────────────────────────────────────────────
export function RoadmapClient() {
  const { mounted, globalStats, toggleDay, resetAll, isDayDone, getWeekStats, getMonthStats } =
    useRoadmapProgress();

  const [activeMonth, setActiveMonth] = useState(1);
  const { msg: toastMsg, show: showToast } = useToast();

  const currentMonth = ROADMAP[activeMonth - 1];
  const monthStats = getMonthStats(activeMonth);

  function handleToggleDay(day: number) {
    const wasDone = isDayDone(day);
    toggleDay(day);
    if (!wasDone) showToast(`Day ${day} complete! 🎉`);
  }

  function handleReset() {
    if (!window.confirm("Reset all progress? This cannot be undone.")) return;
    resetAll();
    showToast("Progress reset.");
  }

  // Determine which week to open by default (first incomplete week)
  function isDefaultOpen(weekNum: number): boolean {
    if (!mounted) return weekNum === 1;
    const stats = getWeekStats(weekNum);
    if (stats.isComplete) return false;
    // Open the first week that isn't complete
    const allWeeks = ROADMAP.flatMap((m) => m.weeks);
    const firstIncomplete = allWeeks.find((w) => {
      const s = getWeekStats(w.week);
      return !s.isComplete;
    });
    return firstIncomplete?.week === weekNum;
  }

  const accent = ACCENT[currentMonth.accent];

  return (
    <div>
      {/* Stats */}
      <StatsGrid global={globalStats} monthStats={monthStats} mounted={mounted} />

      {/* Month Tabs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        {ROADMAP.map((m) => {
          const isActive = m.month === activeMonth;
          const a = ACCENT[m.accent];
          return (
            <button
              key={m.month}
              onClick={() => setActiveMonth(m.month)}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                border: `1px solid ${isActive ? a.border : "var(--color-border)"}`,
                fontSize: "12px",
                fontFamily: "var(--font-mono, monospace)",
                cursor: "pointer",
                background: isActive ? a.tab : "var(--color-bg-subtle)",
                color: isActive ? a.text : "var(--color-muted)",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              M{m.month}: {m.title}
            </button>
          );
        })}
      </div>

      {/* Month progress row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "1rem",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            color: "var(--color-muted)",
            fontFamily: "var(--font-mono, monospace)",
            whiteSpace: "nowrap",
          }}
        >
          Month {activeMonth} progress
        </span>
        <div
          style={{
            flex: 1,
            height: "3px",
            background: "var(--color-border)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${mounted ? monthStats.pct : 0}%`,
              borderRadius: "2px",
              background: accent.bar,
              transition: "width 0.4s ease",
            }}
          />
        </div>
        <span
          style={{
            fontSize: "11px",
            fontFamily: "var(--font-mono, monospace)",
            color: accent.text,
            minWidth: "36px",
            textAlign: "right",
          }}
        >
          {mounted ? monthStats.pct : 0}%
        </span>
      </div>

      {/* Week cards */}
      {currentMonth.weeks.map((week) => (
        <WeekCard
          key={week.week}
          week={week}
          isDayDone={isDayDone}
          onToggleDay={handleToggleDay}
          defaultOpen={isDefaultOpen(week.week)}
        />
      ))}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1.5rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "var(--color-muted)",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          Progress auto-saved to browser · Works offline
        </span>
        <button
          onClick={handleReset}
          style={{
            fontSize: "12px",
            padding: "6px 14px",
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            background: "transparent",
            color: "var(--color-muted)",
            cursor: "pointer",
            fontFamily: "var(--font-mono, monospace)",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-red)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-red)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-muted)";
          }}
        >
          Reset all progress
        </button>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "var(--color-bg-subtle)",
            border: "1px solid var(--color-green-border)",
            color: "var(--color-green)",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "12px",
            padding: "10px 16px",
            borderRadius: "8px",
            zIndex: 999,
            pointerEvents: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            animation: "fadeInUp 0.25s ease",
          }}
        >
          {toastMsg}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) {
          .roadmap-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
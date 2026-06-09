"use client";

import { useState, useCallback } from "react";
import { ROADMAP } from "@/data/roadmap/roadmapData";
import { useRoadmapProgress } from "@/hooks/useRoadmapProgress";
import { StatsGrid } from "@/components/ui/Roadmap/StatsGrid";
import { WeekCard } from "@/components/ui/Roadmap/WeekCard";
import { CompanyGuide } from "@/components/ui/Roadmap/CompanyGuide";
import type { RoadmapMonth } from "@/data/roadmap/types";

// ─── Month accent colour maps (→ CSS vars) ────────────────────────────────────
const ACCENT = {
  green: {
    tab: "color-mix(in srgb, var(--color-green) 12%, transparent)",
    text: "var(--color-green)",
    border: "var(--color-green-border)",
    bar: "var(--color-green)",
    bannerBg: "#E1F5EE",
    bannerBorder: "#9FE1CB",
    bannerTitle: "#04342C",
    bannerText: "#0F6E56",
    bannerMeta: "#3B9B7A",
  },
  blue: {
    tab: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
    text: "var(--color-accent)",
    border: "color-mix(in srgb, var(--color-accent) 30%, transparent)",
    bar: "var(--color-accent)",
    bannerBg: "#E6F1FB",
    bannerBorder: "#B5D4F4",
    bannerTitle: "#042C53",
    bannerText: "#185FA5",
    bannerMeta: "#378ADD",
  },
  amber: {
    tab: "color-mix(in srgb, var(--color-amber) 12%, transparent)",
    text: "var(--color-amber)",
    border: "var(--color-amber-border)",
    bar: "var(--color-amber)",
    bannerBg: "#FAEEDA",
    bannerBorder: "#FAC775",
    bannerTitle: "#633806",
    bannerText: "#854F0B",
    bannerMeta: "#BA7517",
  },
  coral: {
    tab: "color-mix(in srgb, #f97316 12%, transparent)",
    text: "#f97316",
    border: "color-mix(in srgb, #f97316 30%, transparent)",
    bar: "#f97316",
    bannerBg: "#FAECE7",
    bannerBorder: "#F5C4B3",
    bannerTitle: "#4A1B0C",
    bannerText: "#993C1D",
    bannerMeta: "#D85A30",
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

  // "companies" is a special tab outside the ROADMAP months
  const [activeTab, setActiveTab] = useState<number | "companies">(1);
  const { msg: toastMsg, show: showToast } = useToast();

  const isCompaniesTab = activeTab === "companies";
  const activeMonth = isCompaniesTab ? null : ROADMAP[activeTab - 1];
  const monthStats = isCompaniesTab ? null : getMonthStats(activeTab as number);

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

  function isDefaultOpen(weekNum: number): boolean {
    if (!mounted) return weekNum === 1;
    const stats = getWeekStats(weekNum);
    if (stats.isComplete) return false;
    const allWeeks = ROADMAP.flatMap((m) => m.weeks);
    const firstIncomplete = allWeeks.find((w) => {
      const s = getWeekStats(w.week);
      return !s.isComplete;
    });
    return firstIncomplete?.week === weekNum;
  }

  const accent = activeMonth ? ACCENT[activeMonth.accent] : null;

  return (
    <div>
      {/* Stats */}
      <StatsGrid global={globalStats} monthStats={monthStats ?? undefined} mounted={mounted} />

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        {ROADMAP.map((m) => {
          const isActive = activeTab === m.month;
          const a = ACCENT[m.accent];
          return (
            <button
              key={m.month}
              onClick={() => setActiveTab(m.month)}
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

        {/* Company guide tab */}
        <button
          onClick={() => setActiveTab("companies")}
          style={{
            padding: "7px 14px",
            borderRadius: "8px",
            border: `1px solid ${isCompaniesTab ? "color-mix(in srgb, #f97316 30%, transparent)" : "var(--color-border)"}`,
            fontSize: "12px",
            fontFamily: "var(--font-mono, monospace)",
            cursor: "pointer",
            background: isCompaniesTab
              ? "color-mix(in srgb, #f97316 12%, transparent)"
              : "var(--color-bg-subtle)",
            color: isCompaniesTab ? "#f97316" : "var(--color-muted)",
            transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          🏢 Company guide
        </button>
      </div>

      {/* Company guide panel */}
      {isCompaniesTab && <CompanyGuide />}

      {/* Month phase panel */}
      {!isCompaniesTab && activeMonth && accent && (
        <>
          {/* Phase description banner */}
          {activeMonth.description && (
            <div
              style={{
                borderRadius: "10px",
                padding: "1rem 1.25rem",
                marginBottom: "1rem",
                border: `0.5px solid ${accent.bannerBorder}`,
                background: accent.bannerBg,
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: accent.bannerTitle,
                  marginBottom: "6px",
                }}
              >
                Month {activeMonth.month} — {activeMonth.title}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: accent.bannerText,
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {activeMonth.description}
              </p>
              {activeMonth.timeCommitment && (
                <p
                  style={{
                    fontSize: "11px",
                    color: accent.bannerMeta,
                    marginTop: "8px",
                    marginBottom: 0,
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  ⏱ {activeMonth.timeCommitment}
                </p>
              )}
            </div>
          )}

          {/* Month progress row */}
          {monthStats && (
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
                Month {activeTab} progress
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
          )}

          {/* Week cards */}
          {activeMonth.weeks.map((week) => (
            <WeekCard
              key={week.week}
              week={week}
              isDayDone={isDayDone}
              onToggleDay={handleToggleDay}
              defaultOpen={isDefaultOpen(week.week)}
            />
          ))}
        </>
      )}

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

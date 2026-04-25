"use client";

import { useState } from "react";
import type { RoadmapWeek } from "@/data/roadmap/types";
import { DayRow } from "./DayRow";
import { styles } from "./styles";

interface WeekCardProps {
  week: RoadmapWeek;
  isDayDone: (day: number) => boolean;
  onToggleDay: (day: number) => void;
  /** Start open by default (e.g. first incomplete week) */
  defaultOpen?: boolean;
}

export function WeekCard({ week, isDayDone, onToggleDay, defaultOpen = false }: WeekCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  const doneDays = week.days.filter((d) => isDayDone(d.day)).length;
  const total = week.days.length;
  const pct = Math.round((doneDays / total) * 100);
  const isComplete = doneDays === total;

  return (
    <div
      style={{
        ...styles.weekCard,
        borderColor: isComplete
          ? "var(--color-green-border)"
          : open
          ? "var(--color-border-strong)"
          : "var(--color-border)",
      }}
    >
      {/* Header */}
      <button
        style={styles.weekHeader}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span style={styles.weekNum}>WK {week.week}</span>

        <span style={styles.weekTitleWrap}>
          <span style={styles.weekTitle}>{week.title}</span>
          {isComplete && (
            <span style={styles.completeBadge}>✓ Complete</span>
          )}
        </span>

        <span style={styles.weekProgText}>
          {doneDays}/{total}
        </span>

        <span
          style={{
            ...styles.weekChevron,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
          aria-hidden
        >
          ▶
        </span>
      </button>

      {/* Progress bar */}
      <div style={styles.weekProgBar}>
        <div
          style={{
            ...styles.weekProgFill,
            width: `${pct}%`,
            background: isComplete ? "var(--color-green)" : "var(--color-accent)",
          }}
        />
      </div>

      {/* Days */}
      {open && (
        <div style={styles.daysWrap}>
          {week.days.map((day) => (
            <DayRow
              key={day.day}
              day={day}
              isDone={isDayDone(day.day)}
              onToggle={onToggleDay}
            />
          ))}
        </div>
      )}
    </div>
  );
}
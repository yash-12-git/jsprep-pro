"use client";

import Link from "next/link";
import type { RoadmapDay } from "@/data/roadmap/types";
import { styles } from "./styles";

interface DayRowProps {
  day: RoadmapDay;
  isDone: boolean;
  onToggle: (day: number) => void;
}

export function DayRow({ day, isDone, onToggle }: DayRowProps) {
  return (
    <div
      style={{
        ...styles.dayRow,
        opacity: isDone ? 0.5 : 1,
      }}
    >
      {/* Checkbox */}
      <button
        aria-label={`Mark day ${day.day} as ${isDone ? "incomplete" : "complete"}`}
        onClick={() => onToggle(day.day)}
        style={{
          ...styles.dayCheck,
          background: isDone ? "var(--color-green)" : "transparent",
          borderColor: isDone ? "var(--color-green)" : "var(--color-border-strong)",
        }}
      >
        {isDone && (
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            style={{ display: "block" }}
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={styles.dayLabel}>Day {day.day}</div>
        <ul style={styles.taskList}>
          {day.tasks.map((task, i) => (
            <li key={i} style={styles.taskItem}>
              <span style={styles.taskArrow}>→</span>
              {task.topicSlug ? (
                <Link
                  href={`/${task.topicSlug}`}
                  style={{
                    ...styles.taskText,
                    ...(isDone ? styles.taskDone : {}),
                    ...styles.taskLink,
                  }}
                  title={`Learn: ${task.topicSlug}`}
                >
                  {task.text}
                  <span style={styles.taskLinkIcon} aria-hidden>↗</span>
                </Link>
              ) : (
                <span
                  style={{
                    ...styles.taskText,
                    ...(isDone ? styles.taskDone : {}),
                  }}
                >
                  {task.text}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
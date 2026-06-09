"use client";

import Link from "next/link";
import type { RoadmapDay, TaskType } from "@/data/roadmap/types";
import { styles } from "./styles";

interface DayRowProps {
  day: RoadmapDay;
  isDone: boolean;
  onToggle: (day: number) => void;
}

const TASK_ICONS: Record<TaskType, string> = {
  read: "📖",
  build: "🛠️",
  mock: "🎤",
};

// Detect mock task by explicit type or by text heuristic
function isMockTask(text: string, type?: TaskType): boolean {
  if (type === "mock") return true;
  const lower = text.toLowerCase();
  return lower.startsWith("mock") || lower.startsWith("mock:");
}

const TAG_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  critical: { bg: "#FAECE7", color: "#993C1D", border: "#F5C4B3" },
  "machine coding": { bg: "#FAEEDA", color: "#854F0B", border: "#FAC775" },
  mock: { bg: "#EAF3DE", color: "#3B6D11", border: "#C0DD97" },
  "full mock": { bg: "#EAF3DE", color: "#3B6D11", border: "#C0DD97" },
  React: { bg: "#E6F1FB", color: "#185FA5", border: "#B5D4F4" },
  JS: { bg: "#FAEEDA", color: "#854F0B", border: "#FAC775" },
  DSA: { bg: "#FAECE7", color: "#993C1D", border: "#F5C4B3" },
  hooks: { bg: "#E6F1FB", color: "#185FA5", border: "#B5D4F4" },
  patterns: { bg: "#EEEDFE", color: "#3C3489", border: "#AFA9EC" },
  senior: { bg: "#EEEDFE", color: "#3C3489", border: "#AFA9EC" },
  build: { bg: "#E1F5EE", color: "#0F6E56", border: "#9FE1CB" },
  review: { bg: "var(--color-bg-subtle)", color: "var(--color-muted)", border: "var(--color-border)" },
  polyfills: { bg: "#E1F5EE", color: "#0F6E56", border: "#9FE1CB" },
  timed: { bg: "#FAECE7", color: "#993C1D", border: "#F5C4B3" },
  pressure: { bg: "#FAECE7", color: "#993C1D", border: "#F5C4B3" },
  "system design": { bg: "#EEEDFE", color: "#3C3489", border: "#AFA9EC" },
};

function getTagStyle(tag: string) {
  return TAG_STYLES[tag] ?? {
    bg: "var(--color-bg-subtle)",
    color: "var(--color-muted)",
    border: "var(--color-border)",
  };
}

export function DayRow({ day, isDone, onToggle }: DayRowProps) {
  const hasMockTask = day.tasks.some((t) => isMockTask(t.text, t.type));
  const mockFocus = day.mockFocus;

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
        {/* Day header row: label + tags */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px", flexWrap: "wrap" }}>
          <span style={styles.dayLabel}>Day {day.day}</span>
          {day.tags?.map((tag) => {
            const ts = getTagStyle(tag);
            return (
              <span
                key={tag}
                style={{
                  fontSize: "10px",
                  padding: "1px 6px",
                  borderRadius: "99px",
                  background: ts.bg,
                  color: ts.color,
                  border: `0.5px solid ${ts.border}`,
                  fontFamily: "var(--font-mono, monospace)",
                  whiteSpace: "nowrap",
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>

        {/* Tasks */}
        <ul style={styles.taskList}>
          {day.tasks.map((task, i) => {
            const icon = task.type ? TASK_ICONS[task.type] : "→";
            const isMock = isMockTask(task.text, task.type);
            return (
              <li key={i} style={styles.taskItem}>
                <span
                  style={{
                    ...styles.taskArrow,
                    fontSize: task.type ? "12px" : "11px",
                    marginTop: task.type ? "1px" : "2px",
                  }}
                >
                  {icon}
                </span>
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
                ) : isMock ? (
                  <span
                    style={{
                      ...styles.taskText,
                      ...(isDone ? styles.taskDone : {}),
                      color: isDone ? undefined : "#3B6D11",
                      fontStyle: "italic",
                    }}
                  >
                    {task.text}
                  </span>
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
            );
          })}
        </ul>

        {/* Mock interview CTA */}
        {hasMockTask && !isDone && (
          <Link
            href={`/mock-interview${mockFocus ? `?focus=${encodeURIComponent(mockFocus)}` : ""}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              marginTop: "8px",
              padding: "5px 10px",
              borderRadius: "6px",
              border: "1px solid #C0DD97",
              background: "#EAF3DE",
              color: "#3B6D11",
              fontSize: "11px",
              fontWeight: 500,
              textDecoration: "none",
              fontFamily: "var(--font-mono, monospace)",
              transition: "opacity 0.15s",
            }}
          >
            🎤 Start mock interview →
          </Link>
        )}
      </div>
    </div>
  );
}

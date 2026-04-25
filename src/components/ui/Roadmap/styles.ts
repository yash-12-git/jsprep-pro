import type { CSSProperties } from "react";

/**
 * Inline style objects for the Roadmap components.
 * All colours reference CSS variables defined in globals.css so the
 * roadmap automatically follows the app's light/dark theme.
 */
export const styles = {
  // ─── Stats Grid ─────────────────────────────────────────────────────────────
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
    marginBottom: "1.5rem",
  } as CSSProperties,

  statCard: {
    background: "var(--color-bg-subtle)",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    padding: "14px",
  } as CSSProperties,

  statLabel: {
    fontSize: "10px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.07em",
    color: "var(--color-muted)",
    marginBottom: "8px",
    fontFamily: "var(--font-mono, monospace)",
  } as CSSProperties,

  statValue: {
    fontSize: "26px",
    fontWeight: 600,
    color: "var(--color-text)",
    fontFamily: "var(--font-mono, monospace)",
    lineHeight: 1,
  } as CSSProperties,

  statSuffix: {
    fontSize: "13px",
    fontWeight: 400,
    color: "var(--color-muted)",
  } as CSSProperties,

  miniBar: {
    height: "3px",
    background: "var(--color-border)",
    borderRadius: "2px",
    marginTop: "10px",
    overflow: "hidden",
  } as CSSProperties,

  miniBarFill: {
    height: "100%",
    borderRadius: "2px",
    background: "var(--color-green)",
    transition: "width 0.4s ease",
  } as CSSProperties,

  // ─── Week Card ──────────────────────────────────────────────────────────────
  weekCard: {
    background: "var(--color-bg-subtle)",
    border: "1px solid var(--color-border)",
    borderRadius: "10px",
    marginBottom: "8px",
    overflow: "hidden",
    transition: "border-color 0.2s",
  } as CSSProperties,

  weekHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    cursor: "pointer",
    width: "100%",
    background: "transparent",
    border: "none",
    textAlign: "left" as const,
    transition: "background 0.15s",
  } as CSSProperties,

  weekNum: {
    fontSize: "10px",
    fontFamily: "var(--font-mono, monospace)",
    color: "var(--color-muted)",
    minWidth: "36px",
  } as CSSProperties,

  weekTitleWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap" as const,
  } as CSSProperties,

  weekTitle: {
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--color-text)",
  } as CSSProperties,

  completeBadge: {
    fontSize: "10px",
    padding: "2px 8px",
    borderRadius: "20px",
    background: "var(--color-green-subtle)",
    color: "var(--color-green)",
    border: "1px solid var(--color-green-border)",
    fontFamily: "var(--font-mono, monospace)",
  } as CSSProperties,

  weekProgText: {
    fontSize: "11px",
    fontFamily: "var(--font-mono, monospace)",
    color: "var(--color-muted)",
    minWidth: "32px",
    textAlign: "right" as const,
  } as CSSProperties,

  weekChevron: {
    fontSize: "8px",
    color: "var(--color-muted)",
    transition: "transform 0.2s",
    marginLeft: "4px",
  } as CSSProperties,

  weekProgBar: {
    height: "2px",
    background: "var(--color-border)",
  } as CSSProperties,

  weekProgFill: {
    height: "100%",
    transition: "width 0.3s ease",
  } as CSSProperties,

  daysWrap: {
    padding: "6px 10px 10px",
  } as CSSProperties,

  // ─── Day Row ────────────────────────────────────────────────────────────────
  dayRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "8px 4px",
    borderBottom: "1px solid var(--color-border)",
    transition: "opacity 0.2s",
  } as CSSProperties,

  dayCheck: {
    width: "18px",
    height: "18px",
    borderRadius: "5px",
    border: "1.5px solid var(--color-border-strong)",
    cursor: "pointer",
    flexShrink: 0,
    marginTop: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
    padding: 0,
  } as CSSProperties,

  dayLabel: {
    fontSize: "10px",
    fontFamily: "var(--font-mono, monospace)",
    color: "var(--color-muted)",
    marginBottom: "4px",
  } as CSSProperties,

  taskList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  } as CSSProperties,

  taskItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "4px",
    padding: "1px 0",
  } as CSSProperties,

  taskArrow: {
    color: "var(--color-muted)",
    fontFamily: "var(--font-mono, monospace)",
    fontSize: "11px",
    flexShrink: 0,
    marginTop: "2px",
  } as CSSProperties,

  taskText: {
    fontSize: "13px",
    color: "var(--color-muted)",
    lineHeight: 1.55,
  } as CSSProperties,

  taskDone: {
    textDecoration: "line-through",
    color: "var(--color-placeholder)",
  } as CSSProperties,

  taskLink: {
    color: "var(--color-accent)",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "3px",
    transition: "opacity 0.15s",
  } as CSSProperties,

  taskLinkIcon: {
    fontSize: "10px",
    opacity: 0.6,
    flexShrink: 0,
  } as CSSProperties,
} as const;
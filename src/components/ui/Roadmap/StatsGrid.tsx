"use client";

import type { GlobalStats, MonthStats } from "@/data/roadmap/types";
import { styles } from "./styles";

interface StatsGridProps {
  global: GlobalStats;
  monthStats: MonthStats;
  mounted: boolean;
}

function StatCard({
  label,
  value,
  suffix,
  subtext,
  pct,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  subtext?: string;
  pct: number;
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>
        {value}
        {suffix && <span style={styles.statSuffix}>{suffix}</span>}
        {subtext && <span style={styles.statSuffix}>{subtext}</span>}
      </div>
      <div style={styles.miniBar}>
        <div style={{ ...styles.miniBarFill, width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function StatsGrid({ global: g, monthStats: m, mounted }: StatsGridProps) {
  // Show skeleton zeros until localStorage is hydrated
  const pct = mounted ? g.pct : 0;
  const totalDone = mounted ? g.totalDone : 0;
  const weeksComplete = mounted ? g.weeksComplete : 0;
  const monthPct = mounted ? m.pct : 0;
  const streak = mounted ? g.streak : 0;

  return (
    <div style={styles.statsGrid}>
      <StatCard
        label="Overall progress"
        value={pct}
        suffix="%"
        pct={pct}
      />
      <StatCard
        label="Days completed"
        value={totalDone}
        subtext={`/${g.totalDays}`}
        pct={Math.round((totalDone / g.totalDays) * 100)}
      />
      <StatCard
        label="Weeks finished"
        value={weeksComplete}
        subtext="/16"
        pct={Math.round((weeksComplete / 16) * 100)}
      />
      <StatCard
        label="Current month"
        value={monthPct}
        suffix="%"
        pct={monthPct}
      />
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getRecentReadiness, type ReadinessSnapshot } from "@/lib/readinessHistory";
import {
  getRecentInterviews,
  isUnscored,
  type SavedInterview,
} from "@/lib/interviewHistory";
import { getInterviewLogs, type SavedInterviewLog } from "@/lib/interviewLog";
import { C } from "@/styles/tokens";

const linkStyle = { color: C.text, textDecoration: "underline" } as const;

/**
 * Where the signed-in user stands: the latest readiness score and how it
 * moved since the plan before it, plus the latest mock interview verdict.
 */
export default function ReadinessSummary() {
  const { user } = useAuth();
  const [readiness, setReadiness] = useState<ReadinessSnapshot[] | null>(null);
  const [interview, setInterview] = useState<SavedInterview | null>(null);
  const [realInterview, setRealInterview] = useState<SavedInterviewLog | null>(null);

  useEffect(() => {
    if (!user) return;
    getRecentReadiness(user.uid, 2)
      .then(setReadiness)
      .catch((err) => {
        console.error("[ReadinessSummary] could not load readiness", err);
        setReadiness([]);
      });
    getRecentInterviews(user.uid, 5)
      .then((list) => setInterview(list.find((iv) => !isUnscored(iv.scorecard)) ?? null))
      .catch((err) => console.error("[ReadinessSummary] could not load interviews", err));
    getInterviewLogs(user.uid, 1)
      .then(([latest]) => setRealInterview(latest ?? null))
      .catch((err) => console.error("[ReadinessSummary] could not load interview log", err));
  }, [user]);

  if (!user || readiness === null) return null;

  const [latest, previous] = readiness;
  const change = latest && previous ? latest.score - previous.score : null;

  return (
    <div style={{ margin: "1rem 0", fontSize: "0.875rem", color: C.muted }}>
      {latest ? (
        <p style={{ margin: 0 }}>
          <strong style={{ color: C.text, fontWeight: 500 }}>Readiness:</strong>{" "}
          {latest.score}%, {latest.label}
          {change !== null && change !== 0 &&
            ` (${change > 0 ? "up" : "down"} ${Math.abs(change)} since your last plan)`}
          {latest.weakSpots.length > 0 && `. Weakest: ${latest.weakSpots.slice(0, 3).join(", ")}`}.{" "}
          <Link href="/study-plan" style={linkStyle}>
            Update your plan
          </Link>
        </p>
      ) : (
        <p style={{ margin: 0 }}>
          <strong style={{ color: C.text, fontWeight: 500 }}>Readiness:</strong>{" "}
          not measured yet.{" "}
          <Link href="/study-plan" style={linkStyle}>
            Get your readiness score
          </Link>
        </p>
      )}
      {interview && (
        <p style={{ margin: "0.5rem 0 0" }}>
          <strong style={{ color: C.text, fontWeight: 500 }}>Last mock interview:</strong>{" "}
          {interview.scorecard.overall}/100, {interview.scorecard.verdict}.{" "}
          <Link href="/mock-interview/history" style={linkStyle}>
            See scorecards
          </Link>
        </p>
      )}
      <p style={{ margin: "0.5rem 0 0" }}>
        {realInterview ? (
          <>
            <strong style={{ color: C.text, fontWeight: 500 }}>Last real interview:</strong>{" "}
            {realInterview.roundType}, {realInterview.outcome.toLowerCase()}.{" "}
            <Link href="/interview-log" style={linkStyle}>
              Log another
            </Link>
          </>
        ) : (
          <>
            Had a real interview?{" "}
            <Link href="/interview-log" style={linkStyle}>
              Log it
            </Link>{" "}
            so your plan focuses on what was asked.
          </>
        )}
      </p>
    </div>
  );
}

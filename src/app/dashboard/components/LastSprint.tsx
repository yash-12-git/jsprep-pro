"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getLatestSprint, type SavedSprint } from "@/lib/sprintHistory";
import { C } from "@/styles/tokens";

/** The signed-in user's most recent sprint result. Hidden if there isn't one. */
export default function LastSprint() {
  const { user } = useAuth();
  const [sprint, setSprint] = useState<SavedSprint | null>(null);

  useEffect(() => {
    if (!user) return;
    getLatestSprint(user.uid)
      .then(setSprint)
      .catch((err) => console.error("[LastSprint] could not load", err));
  }, [user]);

  if (!sprint) return null;

  return (
    <p style={{ margin: "1rem 0", fontSize: "0.875rem", color: C.muted }}>
      <strong style={{ color: C.text, fontWeight: 500 }}>Last sprint:</strong>{" "}
      {sprint.score}/{sprint.maxScore} points, {sprint.accuracy}% accuracy
      {sprint.weakAreas.length > 0 && `. Focus on ${sprint.weakAreas.join(", ")}`}.{" "}
      <Link href="/sprint" style={{ color: C.text, textDecoration: "underline" }}>
        Try again
      </Link>
    </p>
  );
}

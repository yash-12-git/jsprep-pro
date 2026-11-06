"use client";
/**
 * SEOHeroCTA — auth-aware CTA button for SEO pages.
 * Replaces the 3 duplicate HeroCTA.tsx files across:
 *   /javascript-interview-questions, /javascript-output-questions, /javascript-tricky-questions
 */

import { useAuth } from "@/hooks/useAuth";

interface Props {
  loggedInHref?: string;
  loggedInLabel?: string;
  loggedOutHref?: string;
  loggedOutLabel?: string;
  style?: React.CSSProperties;
}

export default function SEOHeroCTA({
  loggedInHref = "/dashboard",
  loggedInLabel = "Go to Practice Dashboard",
  loggedOutHref = "/auth",
  loggedOutLabel = "Practice Free",
  style,
}: Props) {
  const { user, loading } = useAuth();
  const resolved = !loading && user;
  const href = resolved ? loggedInHref : loggedOutHref;
  const label = resolved ? loggedInLabel : loggedOutLabel;

  return (
    <a href={href} className="btn btn--primary" style={style}>
      {label}
    </a>
  );
}

"use client";

import { useEffect } from "react";

/**
 * Marks the page as running a test (a sprint or a mock interview) by setting
 * `data-focus` on <html>. CSS then hides what doesn't belong mid-test: the
 * footer, the invite banner and the page's search-engine guide, which all
 * stay in the HTML so search engines and no-JS visitors still get them.
 */
export function useFocusMode(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    root.dataset.focus = "true";
    return () => {
      delete root.dataset.focus;
    };
  }, [active]);
}

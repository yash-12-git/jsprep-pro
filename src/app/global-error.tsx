"use client";

import { useEffect } from "react";

// Replaces the root layout when it fails, so its styles and fonts aren't available.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[root error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <main style={{ maxWidth: "32rem", margin: "20vh auto", padding: "0 1.25rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 500 }}>Something went wrong</h1>
          <p style={{ lineHeight: 1.5 }}>
            JSPrep Pro couldn&apos;t load. It&apos;s usually temporary, so try again in a moment.
          </p>
          <button type="button" onClick={reset} style={{ padding: "0.625rem 1.25rem", cursor: "pointer" }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}

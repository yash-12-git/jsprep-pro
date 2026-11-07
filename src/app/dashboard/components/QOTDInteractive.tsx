"use client";

import dynamic from "next/dynamic";

// ─── Client interactive shell — lazy loaded, never SSR'd ─────────────────────

const QOTDInteractive = dynamic(() => import("./QuestionOfTheDay"), {
  ssr: false,
  loading: () => <QOTDSkeleton />,
});

// ─── Skeleton — pure inline styles, safe to server-render ────────────────────

export function QOTDSkeleton() {
  return (
    <div
      style={{
        background: "var(--color-paper-2)",
        border: "1px solid var(--color-rule)",
        borderRadius: "0.75rem",
        padding: "1.25rem",
      }}
    >
      {[
        ["7rem", "0.75rem"],
        ["85%", "1.25rem"],
        ["65%", "1.25rem"],
      ].map(([w, h], i) => (
        <div
          key={i}
          style={{
            height: h,
            width: w,
            borderRadius: "0.375rem",
            background: "var(--color-bg-active)",
            marginBottom: i < 2 ? "0.625rem" : 0,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}

export default QOTDInteractive;

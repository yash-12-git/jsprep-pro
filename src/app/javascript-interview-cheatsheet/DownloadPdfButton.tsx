"use client";

/**
 * DownloadPDFButton
 *
 * Triggers the browser's native print dialog — in every modern browser
 * (Chrome, Safari, Firefox, Edge) the print dialog has "Save as PDF"
 * as the default destination.
 */

import { useState } from "react";
import { C } from "@/styles/tokens";

const DownloadIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function DownloadPDFButton() {
  const [state, setState] = useState<"idle" | "tip">("idle");

  function handleClick() {
    setState("tip");
    setTimeout(() => {
      window.print();
      setTimeout(() => setState("idle"), 500);
    }, 80);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <button
        onClick={handleClick}
        className="no-print"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.625rem 1.375rem",
          background: C.accent,
          color: "#ffffff",
          border: "none",
          borderRadius: "0.625rem",
          fontWeight: 600,
          fontSize: "0.9375rem",
          cursor: "pointer",
          transition: "opacity 0.12s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <DownloadIcon /> Download PDF
      </button>
      {state === "tip" && (
        <p
          style={{
            fontSize: "0.75rem",
            color: C.muted,
            margin: 0,
            textAlign: "center",
          }}
        >
          In the print dialog → set Destination to{" "}
          <strong style={{ color: C.text }}>Save as PDF</strong>
        </p>
      )}
    </div>
  );
}

"use client";

/**
 * DownloadPDFButton
 *
 * Triggers the browser's native print dialog — in every modern browser
 * (Chrome, Safari, Firefox, Edge) the print dialog has "Save as PDF"
 * as the default destination.
 */

import { useState } from "react";

const DownloadIcon = () => (
  <svg
    aria-hidden="true"
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
    <div>
      <button
        type="button"
        onClick={handleClick}
        className="no-print btn btn--primary"
      >
        <DownloadIcon /> Download PDF
      </button>
      {state === "tip" && (
        <p className="doc-meta">
          <span>
            In the print dialog, set Destination to <strong>Save as PDF</strong>
          </span>
        </p>
      )}
    </div>
  );
}

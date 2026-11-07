"use client";

import { useEffect } from "react";
import Link from "next/link";
import { DocHero } from "@/components/seo/DocParts";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[page error]", error);
  }, [error]);

  return (
    <main className="doc doc--narrow">
      <DocHero
        title="Something went wrong"
        lede="This page couldn't load. It's usually temporary, so try again in a moment."
      />
      <div className="doc-actions">
        <button type="button" className="btn btn--primary" onClick={reset}>
          Try again
        </button>
        <Link className="btn" href="/">
          Home
        </Link>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { DocHero } from "@/components/seo/DocParts";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="doc doc--narrow">
      <DocHero
        title="Page not found"
        lede="This page doesn't exist or has moved. Try one of these instead."
      />
      <div className="doc-actions">
        <Link className="btn btn--primary" href="/javascript-interview-questions">
          Browse questions
        </Link>
        <Link className="btn" href="/topics/javascript">
          Topic guides
        </Link>
        <Link className="btn" href="/">
          Home
        </Link>
      </div>
    </main>
  );
}

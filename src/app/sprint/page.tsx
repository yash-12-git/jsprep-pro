import type { Metadata } from "next";
import { pageMeta, SITE } from "@/lib/seo/seo";
import SprintWrapper from "./SprintWrapper";

export const metadata: Metadata = pageMeta({
  title: "JavaScript Interview Sprint — Are You Truly Interview Ready?",
  description:
    "A timed challenge mixing theory, output prediction, and debugging questions. AI-evaluated answers, gamified scoring, and shareable results. The best way to test if you're JavaScript interview ready.",
  path: `/sprint`,
});

export default function SprintPage() {
  return <SprintWrapper />;
}

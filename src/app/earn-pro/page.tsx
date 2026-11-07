import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo/seo";
import EarnProClient from "./EarnProClient";

export const metadata: Metadata = pageMeta({
  title: "Get Pro Free",
  description: "Give feedback or invite friends to get JSPrep Pro free.",
  path: "/earn-pro",
  noindex: true,
});

export default function EarnProPage() {
  return <EarnProClient />;
}

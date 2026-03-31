import { getQuestions } from "@/lib/cachedQueries";
import { getServerTrack } from "@/lib/getServerTrack";
import PolyfillLabClientPage from "./PolyfillClientWrapper";
import { pageMeta } from "@/lib/seo/seo";
import { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: "JavaScript Polyfill Lab — Master JS Concepts by Building Polyfills | JSPrep Pro",
  description: "Dive into the JavaScript Polyfill Lab on JSPrep Pro. Learn by building polyfills for modern JavaScript features, enhancing your understanding of core concepts and improving your coding skills. Start mastering JavaScript today!",
  path: `/polyfill-lab`,
});

export default async function PolyfillLabPage() {
  const track = await getServerTrack();
  const { questions } = await getQuestions({
    filters: { track, status: "published", type: "polyfill" },
    pageSize: 300,
  });

  const categories = Array.from(
    new Set(questions.map((q) => q.category)),
  ).sort();

  return (
    <PolyfillLabClientPage questions={questions} categories={categories} />
  );
}

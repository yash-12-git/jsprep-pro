import { getPublishedTopics, getQuestions } from "@/lib/cachedQueries";
import { getServerTrack } from "@/lib/getServerTrack";
import { pageMeta } from "@/lib/seo/seo";
import { Metadata } from "next";
import CheatSheetClientPage from "./CheatsheetClientWrapper";

export const metadata: Metadata = pageMeta({
  title: "JavaScript cheatsheet: Quick reference for JS concepts | JSPrep Pro",
  description: "Challenge yourself with the JavaScript cheatsheet on JSPrep Pro. Test your understanding of JavaScript concepts through practical examples and improve your coding skills. Start your JS journey today!",
  path: `/cheatsheet`,
});

export default async function CheatSheetPage() {
  const track = await getServerTrack();
  const topics = await getPublishedTopics({
    track
  });

  return (
    <CheatSheetClientPage topics={topics} />
  );
}

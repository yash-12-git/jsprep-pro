import { getWeeklyLeaderboardCached } from "@/lib/cachedQueries";
import Leaderboard from "./Leaderboard";

export default async function LeaderboardWrapper() {
  const entries = await getWeeklyLeaderboardCached();
console.log(entries, "line6");
  return <Leaderboard entries={entries} />;
}
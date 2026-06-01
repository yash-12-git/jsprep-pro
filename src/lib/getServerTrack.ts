// lib/getServerTrack.ts
import { cookies } from "next/headers";
import type { Track } from "@/contexts/TrackContext";

const AVAILABLE_TRACKS: Track[] = ["javascript", "react", "typescript", "system-design"];

export async function getServerTrack(): Promise<Track> {
  const cookieStore = await cookies();
  const value = cookieStore.get("jsprep_active_track")?.value as
    | Track
    | undefined;
  return value && AVAILABLE_TRACKS.includes(value) ? value : "javascript";
}

// Derives track from a URL slug without needing a cookie (safe for crawlers).
// Topic slugs follow the pattern: {track}-{keyword}-interview-questions
export function trackFromSlug(slug: string): Track {
  if (slug.startsWith("react-")) return "react";
  if (slug.startsWith("typescript-")) return "typescript";
  return "javascript";
}

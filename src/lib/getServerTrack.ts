// lib/getServerTrack.ts
import { cookies } from "next/headers";
import type { Track } from "@/contexts/TrackContext";

const AVAILABLE_TRACKS: Track[] = ["javascript", "react"];

export async function getServerTrack(): Promise<Track> {
  const cookieStore = await cookies();
  const value = cookieStore.get("jsprep_active_track")?.value as
    | Track
    | undefined;
  return value && AVAILABLE_TRACKS.includes(value) ? value : "javascript";
}

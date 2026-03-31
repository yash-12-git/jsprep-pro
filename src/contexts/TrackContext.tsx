"use client";

import { TrackConfig, TRACKS } from "@/lib/tracks";
/**
 * src/contexts/TrackContext.tsx
 *
 * Global track selector — persists to localStorage.
 * Every page, hook, and component reads track from here.
 * Switching track instantly changes the entire platform experience.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";


export type Track = "javascript" | "react" | "typescript" | "system-design";

export const TRACK_MAP = Object.fromEntries(
  TRACKS.map((t) => [t.id, t]),
) as Record<Track, TrackConfig>;

// ─── Context ──────────────────────────────────────────────────────────────────

interface TrackContextValue {
  track: Track;
  config: TrackConfig;
  setTrack: (t: Track) => void;
  allTracks: TrackConfig[];
}

const TrackContext = createContext<TrackContextValue>({
  track: "javascript",
  config: TRACKS[0],
  setTrack: () => {},
  allTracks: TRACKS,
});

const COOKIE_KEY = "jsprep_active_track";

function readCookie(): Track | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)jsprep_active_track=([^;]+)/);
  const val = match?.[1] as Track | undefined;
  return val && TRACK_MAP[val]?.available ? val : null;
}

function writeCookie(t: Track) {
  document.cookie = `${COOKIE_KEY}=${t}; path=/; max-age=31536000; SameSite=Lax`;
}

export function TrackProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrackState] = useState<Track>(
    () => readCookie() ?? "javascript",
  );
  const setTrack = useCallback((t: Track) => {
    if (!TRACK_MAP[t]?.available) return;
    setTrackState(t);
    writeCookie(t);
  }, []);

  const value: TrackContextValue = {
    track,
    config: TRACK_MAP[track],
    setTrack,
    allTracks: TRACKS,
  };

  return (
    <TrackContext.Provider value={value}>{children}</TrackContext.Provider>
  );
}

export function useTrack() {
  return useContext(TrackContext);
}

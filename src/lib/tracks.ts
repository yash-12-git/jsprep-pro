export type Track = "javascript" | "react" | "typescript" | "system-design";

export interface TrackConfig {
  id: Track;
  label: string;
  emoji: string;
  color: string;
  tagline: string;
  badge?: string;
  available: boolean;
  questionsPage: string;
}

export const TRACKS: TrackConfig[] = [
  {
    id: "javascript",
    label: "JavaScript",
    emoji: "🟨",
    color: "#dcd108",
    tagline: "200+ questions · Closures, async, prototypes",
    available: true,
    questionsPage: "/javascript-interview-questions",
  },
  {
    id: "react",
    label: "React",
    emoji: "⚛️",
    color: "#61dafb",
    tagline: "150+ questions · Hooks, state, patterns",
    badge: "NEW",
    available: true,
    questionsPage: "/react-interview-questions",
  },
  {
    id: "typescript",
    label: "TypeScript",
    emoji: "🔷",
    color: "#3178c6",
    tagline: "Coming soon · Types, generics, utility types",
    badge: "SOON",
    available: false,
    questionsPage: "/typescript-interview-questions",
  },
  {
    id: "system-design",
    label: "System Design",
    emoji: "🏗️",
    color: "#f7c76a",
    tagline: "Coming soon · Frontend architecture at scale",
    badge: "SOON",
    available: false,
    questionsPage: "/system-design-interview-questions",
  },
];

export const TRACK_MAP = Object.fromEntries(
  TRACKS.map((t) => [t.id, t]),
) as Record<Track, TrackConfig>;

export const AVAILABLE_TRACKS = TRACKS.filter((t) => t.available);

export type Track = "javascript" | "react" | "typescript" | "system-design";

export interface TrackConfig {
  id: Track;
  label: string;
  emoji: string;
  color: string;
  tagline: string;
  badge?: string;
  available: boolean;
  practiceLinks: Array<{ href: string; label: string; icon: string; badge?: string }>;
  questionsPage: string;
}

export const TRACKS: TrackConfig[] = [
  {
    id: "javascript",
    label: "JavaScript",
    emoji: "🟨",
    color: "#7c6af7",
    tagline: "200+ questions · Closures, async, prototypes",
    available: true,
    questionsPage: "/javascript-interview-questions",
    practiceLinks: [
      { href: "/dashboard", label: "Theory", icon: "BookOpen" },
      { href: "/output-quiz", label: "Output", icon: "Code2" },
      { href: "/debug-lab", label: "Debug", icon: "Bug" },
      { href: "/polyfill-lab", label: "Polyfills", icon: "FlaskConical", badge: "NEW" },
    ],
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
    practiceLinks: [
      { href: "/dashboard", label: "Theory", icon: "BookOpen" },
      { href: "/react-challenges", label: "Challenges", icon: "Code2", badge: "NEW" },
      { href: "/debug-lab", label: "Debug", icon: "Bug" },
    ],
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
    practiceLinks: [],
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
    practiceLinks: [],
  },
];

export const TRACK_MAP = Object.fromEntries(
  TRACKS.map(t => [t.id, t])
) as Record<Track, TrackConfig>;

export const AVAILABLE_TRACKS = TRACKS.filter(t => t.available);
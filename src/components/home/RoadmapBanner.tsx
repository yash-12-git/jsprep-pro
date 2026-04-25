// components/home/RoadmapBanner.tsx
// Drop this into HomePageClient.tsx between two <hr css={hr} /> sections.
// Imports match the existing page.styles.ts pattern — pure inline styles here
// since the component is self-contained and ships without a separate style file.

"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Calendar, Target, Zap } from "lucide-react";
import { C } from "@/styles/tokens";

// ─── Static data ─────────────────────────────────────────────────────────────

const PHASES = [
  {
    month: 1,
    label: "JS Mastery",
    color: C.green,
    bg: "color-mix(in srgb, #22c55e 10%, transparent)",
    border: "color-mix(in srgb, #22c55e 25%, transparent)",
    weeks: "Weeks 1–4",
    topics: ["Closures", "Event loop", "Prototypes", "Async/await", "Polyfills"],
  },
  {
    month: 2,
    label: "React Deep Dive",
    color: C.accent,
    bg: "color-mix(in srgb, var(--color-accent) 10%, transparent)",
    border: "color-mix(in srgb, var(--color-accent) 25%, transparent)",
    weeks: "Weeks 5–8",
    topics: ["Fiber", "All hooks", "Performance", "Patterns", "React 18"],
  },
  {
    month: 3,
    label: "Machine Coding",
    color: C.amber,
    bg: "color-mix(in srgb, #f59e0b 10%, transparent)",
    border: "color-mix(in srgb, #f59e0b 25%, transparent)",
    weeks: "Weeks 9–12",
    topics: ["30+ components", "2 projects", "DSA sprint", "GitHub portfolio"],
  },
  {
    month: 4,
    label: "Interview Mode",
    color: "#f97316",
    bg: "color-mix(in srgb, #f97316 10%, transparent)",
    border: "color-mix(in srgb, #f97316 25%, transparent)",
    weeks: "Weeks 13–16",
    topics: ["Mock interviews", "System design", "Applications", "Negotiation"],
  },
] as const;

const STATS = [
  { n: "16", l: "Weeks", icon: Calendar },
  { n: "112", l: "Daily tasks", icon: CheckCircle },
  { n: "4", l: "Phases", icon: Target },
  { n: "₹25+", l: "LPA target", icon: Zap },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function RoadmapBanner() {
  return (
    <section
      aria-labelledby="roadmap-banner-heading"
      style={{
        margin: "0 0 2rem",
        padding: "2rem",
        borderRadius: "16px",
        border: "1px solid var(--color-border)",
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 4%, var(--color-bg-subtle)), var(--color-bg-subtle))",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative glow blob */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              fontFamily: "var(--font-mono, monospace)",
              color: C.amber,
              background: "color-mix(in srgb, #f59e0b 12%, transparent)",
              border: "1px solid color-mix(in srgb, #f59e0b 30%, transparent)",
              borderRadius: "20px",
              padding: "3px 10px",
              marginBottom: "10px",
            }}
          >
            🗺️ New — 16-Week Roadmap
          </div>

          <h2
            id="roadmap-banner-heading"
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--color-text)",
              letterSpacing: "-0.02em",
              margin: "0 0 6px",
            }}
          >
            Frontend Developer Roadmap 2026
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--color-muted)",
              margin: 0,
              lineHeight: 1.5,
              maxWidth: "420px",
            }}
          >
            Stop wondering what to learn next. 112 daily tasks — JS → React →
            Machine Coding → DSA → Interviews. Progress saved to browser.
          </p>
        </div>

        <Link
          href="/roadmap"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--color-text)",
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            borderRadius: "10px",
            padding: "9px 16px",
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor =
              "var(--color-accent)";
            (e.currentTarget as HTMLAnchorElement).style.color = C.accent;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor =
              "var(--color-border)";
            (e.currentTarget as HTMLAnchorElement).style.color =
              "var(--color-text)";
          }}
        >
          View Roadmap <ArrowRight size={14} />
        </Link>
      </div>

      {/* Quick stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "8px",
          marginBottom: "1.25rem",
        }}
      >
        {STATS.map(({ n, l, icon: Icon }) => (
          <div
            key={l}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Icon size={14} color={C.muted} style={{ flexShrink: 0 }} />
            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--color-text)",
                  lineHeight: 1.1,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {n}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {l}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phase cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "8px",
        }}
      >
        {PHASES.map((phase) => (
          <Link
            key={phase.month}
            href={`/roadmap#month-${phase.month}`}
            style={{
              display: "block",
              padding: "12px",
              borderRadius: "10px",
              background: phase.bg,
              border: `1px solid ${phase.border}`,
              textDecoration: "none",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(-1px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                `0 4px 12px color-mix(in srgb, ${phase.color} 15%, transparent)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "none";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontFamily: "var(--font-mono, monospace)",
                color: phase.color,
                marginBottom: "4px",
                fontWeight: 600,
              }}
            >
              M{phase.month} · {phase.weeks}
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--color-text)",
                marginBottom: "8px",
              }}
            >
              {phase.label}
            </div>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}
            >
              {phase.topics.map((topic) => (
                <li
                  key={topic}
                  style={{
                    fontSize: "11px",
                    color: "var(--color-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: phase.color,
                      flexShrink: 0,
                      opacity: 0.7,
                    }}
                  />
                  {topic}
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>

      {/* Footer CTA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1.25rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--color-border)",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "var(--color-muted)",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          ✓ Free · Works offline · Progress synced to browser
        </span>
        <Link
          href="/roadmap"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "12px",
            fontWeight: 600,
            color: C.accent,
            textDecoration: "none",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          Start the roadmap <ArrowRight size={12} />
        </Link>
      </div>

      {/* Mobile responsive overrides */}
      <style>{`
        @media (max-width: 640px) {
          #roadmap-banner-phases {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          #roadmap-banner-stats {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
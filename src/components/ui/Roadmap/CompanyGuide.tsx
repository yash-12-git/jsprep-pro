"use client";

import Link from "next/link";

interface Company {
  name: string;
  lpa: string;
  rounds: string;
  tags: string[];
  tip: string;
  mockFocus: string;
}

const COMPANIES: Company[] = [
  {
    name: "Razorpay",
    lpa: "28–38 LPA",
    rounds: "4 rounds: JS internals → Machine coding → System design → HM",
    tags: ["JS internals", "Type coercion", "async patterns", "Machine coding", "Payment SD"],
    tip: "They probe JS internals hard, closures, event loop, type coercion. Machine coding round is timed. System design often revolves around payment flows.",
    mockFocus: "Core JavaScript",
  },
  {
    name: "CRED",
    lpa: "30–45 LPA",
    rounds: "5 rounds: Deep JS → React → SD → Assignment → Culture",
    tags: ["Deep JS", "React internals", "Opinions", "Take-home", "Culture fit"],
    tip: "CRED hires for opinions. They'll ask 'what do you think is broken about React'. You need a real answer, not agreement. Have strong technical takes.",
    mockFocus: "React & State Management",
  },
  {
    name: "Groww",
    lpa: "25–35 LPA",
    rounds: "4 rounds: DSA → JS → React → System design",
    tags: ["DSA medium", "React hooks", "State management", "DP sometimes"],
    tip: "Fintech focus. They care about performance on mobile and accessibility. DSA rounds are genuine, solve 100 Leetcode mediums before applying.",
    mockFocus: "React & State Management",
  },
  {
    name: "Zepto",
    lpa: "25–35 LPA",
    rounds: "3 rounds: Machine coding (1h) → React → SD",
    tags: ["Machine coding", "Vanilla JS", "React", "Speed"],
    tip: "Machine coding is the hardest round, they give you 1 hour to build a working UI. Build 10+ components before applying: cart, search, accordion, modal, tabs.",
    mockFocus: "Mixed (all topics)",
  },
  {
    name: "Swiggy",
    lpa: "25–35 LPA",
    rounds: "4 rounds: JS → React → Machine coding → SD",
    tags: ["Event loop", "React perf", "Web vitals", "Mobile perf"],
    tip: "Swiggy cares deeply about performance on slow networks and low-end devices. Have debounce/throttle/virtualization experience ready with metrics.",
    mockFocus: "Performance Optimisation",
  },
  {
    name: "Flipkart",
    lpa: "25–40 LPA",
    rounds: "5 rounds: DSA ×3 → SD → HM",
    tags: ["DSA heavy", "LC medium-hard", "System design", "Scale"],
    tip: "Most DSA-heavy of all. Solve 100+ Leetcode mediums before applying. System design focuses on scale (100M users), frame every answer with scale in mind.",
    mockFocus: "Mixed (all topics)",
  },
  {
    name: "PhonePe",
    lpa: "25–35 LPA",
    rounds: "4 rounds: JS → React → System design → HM",
    tags: ["JS fundamentals", "React", "Offline-first", "Payment SD"],
    tip: "Prep service worker + offline patterns, PhonePe runs in Bharat where connectivity is poor. Payment flow system design is a near-certain ask.",
    mockFocus: "Core JavaScript",
  },
  {
    name: "Atlassian",
    lpa: "35–55 LPA",
    rounds: "5 rounds: DSA ×2 → SD → Values → HM",
    tags: ["DSA medium-hard", "Collaboration SD", "STAR behavioral", "Values"],
    tip: "Highest ceiling but hardest process. Values interviews are serious, read their 5 values and map each to a concrete story. DSA difficulty is LC hard level.",
    mockFocus: "System Design (Frontend)",
  },
];

const TAG_COLORS = [
  { bg: "var(--color-accent-soft)", color: "var(--color-accent)", border: "var(--color-amber-border)" },
  { bg: "var(--color-cool-soft)", color: "var(--color-cool)", border: "var(--color-rule)" },
  { bg: "var(--color-cool-soft)", color: "var(--color-ink)", border: "var(--color-rule)" },
  { bg: "var(--color-ok-soft)", color: "var(--color-ok)", border: "var(--color-green-border)" },
  { bg: "var(--color-bad-soft)", color: "var(--color-bad)", border: "var(--color-red-border)" },
];

export function CompanyGuide() {
  return (
    <div>
      {/* Section intro */}
      <div
        style={{
          background: "var(--color-bg-subtle)",
          border: "1px solid var(--color-border)",
          borderRadius: "10px",
          padding: "1rem 1.25rem",
          marginBottom: "1.25rem",
        }}
      >
        <p style={{ fontSize: "13px", color: "var(--color-text)", fontWeight: 500, marginBottom: "4px" }}>
          Company-specific prep guide
        </p>
        <p style={{ fontSize: "12px", color: "var(--color-muted)", lineHeight: 1.6, margin: 0 }}>
          Our best understanding of each company&apos;s process, and not verified with the companies. Rounds and pay change, so confirm with your recruiter. Click “Start mock” to practice with company context pre-loaded.
        </p>
      </div>

      {/* Company grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "10px",
        }}
      >
        {COMPANIES.map((co) => (
          <div
            key={co.name}
            style={{
              background: "var(--color-bg-subtle)",
              border: "1px solid var(--color-border)",
              borderRadius: "10px",
              padding: "1rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text)" }}>
                {co.name}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "2px 8px",
                  borderRadius: "99px",
                  background: "var(--color-ok-soft)",
                  color: "var(--color-ok)",
                  border: "0.5px solid var(--color-green-border)",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-outlier)",
                }}
              >
                {co.lpa}
              </span>
            </div>

            {/* Rounds */}
            <p style={{ fontSize: "12px", color: "var(--color-muted)", margin: 0, lineHeight: 1.5 }}>
              {co.rounds}
            </p>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {co.tags.map((tag, i) => {
                const c = TAG_COLORS[i % TAG_COLORS.length];
                return (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.75rem",
                      padding: "2px 6px",
                      borderRadius: "99px",
                      background: c.bg,
                      color: c.color,
                      border: `0.5px solid ${c.border}`,
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>

            {/* Tip */}
            <div
              style={{
                fontSize: "12px",
                padding: "8px 10px",
                borderRadius: "7px",
                background: "var(--color-accent-soft)",
                color: "var(--color-accent)",
                lineHeight: 1.55,
                border: "0.5px solid var(--color-amber-border)",
              }}
            >
              {co.tip}
            </div>

            {/* Mock CTA */}
            <Link
              href={`/mock-interview?focus=${encodeURIComponent(co.mockFocus)}&company=${encodeURIComponent(co.name)}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "7px",
                border: "1px solid var(--color-border)",
                background: "transparent",
                color: "var(--color-text)",
                fontSize: "12px",
                fontWeight: 500,
                textDecoration: "none",
                fontFamily: "var(--font-outlier)",
                transition: "background 0.15s",
                alignSelf: "flex-start",
              }}
            >
              Start {co.name} mock
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

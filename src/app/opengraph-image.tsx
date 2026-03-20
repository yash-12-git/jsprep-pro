import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "JSPrep Pro — JavaScript Interview Preparation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ─── Design tokens (mirrors tokens.ts — hardcoded for edge runtime) ───────────
const T = {
  bg: "#ffffff",
  bgSubtle: "#f7f7f5",
  bgActive: "#ebebea",
  border: "#e9e9e7",
  text: "#37352f",
  muted: "#787774",
  accent: "#2383e2",
  accentSubtle: "#e8f1fb",
  green: "#0f7b6c",
  greenSubtle: "#edf6f4",
  amber: "#c9750c",
  codeBg: "#f7f7f5",
  codeText: "#37352f",
} as const;

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: T.bg,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "0",
        position: "relative",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Subtle grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${T.border} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top accent line — clean Notion blue */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: T.accent,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          padding: "64px 80px",
          flex: 1,
        }}
      >
        {/* Logo row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: T.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            JS
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: T.text,
              letterSpacing: "-0.02em",
            }}
          >
            JSPrep<span style={{ color: T.accent }}>Pro</span>
          </span>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: "flex",
            gap: 48,
            flex: 1,
            alignItems: "flex-start",
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div
              style={{
                fontSize: 66,
                fontWeight: 700,
                color: T.text,
                lineHeight: 1.1,
                marginBottom: 14,
                letterSpacing: "-0.03em",
              }}
            >
              Land your next
            </div>
            <div
              style={{
                fontSize: 62,
                fontWeight: 700,
                color: T.accent,
                lineHeight: 1.1,
                marginBottom: 28,
                letterSpacing: "-0.03em",
              }}
            >
              JavaScript role.
            </div>
            <div
              style={{
                fontSize: 20,
                color: T.muted,
                marginBottom: 40,
                lineHeight: 1.55,
              }}
            >
              195+ questions · Theory, Output & Debug · 6 AI tools
            </div>

            {/* Stat pills */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                ["195+", "Questions"],
                ["3", "Modes"],
                ["36", "Topics"],
                ["6", "AI Tools"],
              ].map(([n, l]) => (
                <div
                  key={l}
                  style={{
                    background: T.bgSubtle,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "10px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: T.text,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {n}
                  </span>
                  <span style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — code card */}
          <div
            style={{
              background: T.bgSubtle,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: "20px 24px",
              width: 380,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Traffic-light dots — conventional colours */}
            <div style={{ display: "flex", gap: 7, marginBottom: 18 }}>
              <div
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  background: "#f76a6a",
                }}
              />
              <div
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  background: "#f7c76a",
                }}
              />
              <div
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  background: "#6af7c0",
                }}
              />
            </div>

            {/* Code lines */}
            {[
              ["// What is a closure?", T.muted],
              ["function makeCounter() {", T.text],
              ["  let count = 0", T.green],
              ["  return function() {", T.text],
              ["    return ++count", T.amber],
              ["  }", T.text],
              ["}", T.text],
              ["", ""],
              ["const c = makeCounter()", T.accent],
              ["c() // → 1", T.green],
              ["c() // → 2", T.green],
            ].map(([line, color], i) => (
              <div
                key={i}
                style={{
                  fontSize: 14,
                  color: color || T.text,
                  lineHeight: 1.7,
                  fontFamily: "monospace",
                }}
              >
                {line || "\u00A0"}
              </div>
            ))}

            {/* Score badge */}
            <div
              style={{
                marginTop: 16,
                background: T.greenSubtle,
                border: `1px solid ${T.green}`,
                borderRadius: 8,
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 13, color: T.muted }}>AI Score</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: T.green }}>
                8/10
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    { ...size },
  );
}

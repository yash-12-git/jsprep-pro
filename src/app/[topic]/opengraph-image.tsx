import { ImageResponse } from "next/og";
import { getTopicBySlug } from "@/lib/cachedQueries";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ─── Design tokens (edge-safe — cannot import from @/styles/tokens) ───────────
const T = {
  bg: "#ffffff",
  bgSubtle: "#f7f7f5",
  bgActive: "#ebebea",
  border: "#e9e9e7",
  borderStrong: "#d3d3cf",
  text: "#37352f",
  muted: "#787774",
  accent: "#2383e2",
  accentSubtle: "#e8f1fb",
  accentText: "#1a6fc4",
  green: "#0f7b6c",
  greenSubtle: "#edf6f4",
  greenBorder: "#c4e4df",
  amber: "#c9750c",
  amberSubtle: "#fdf4e4",
  amberBorder: "#f5ddb0",
} as const;

export default async function Image({ params }: { params: { topic: string } }) {
  const topic = await getTopicBySlug(params.topic).catch(() => null);

  const title = topic?.title ?? "JavaScript Interview Questions";
  const desc = topic?.description ?? "Practice questions with AI feedback";
  const qCount = topic?.questionCount ?? null;
  const difficulty = topic?.difficulty ?? null;
  const category = topic?.category ?? "JavaScript";

  // Trim description to fit nicely
  const shortDesc = desc.length > 110 ? desc.slice(0, 110) + "…" : desc;

  // Difficulty badge colours — mirrors DIFF_STYLE tokens
  const diffStyle = (() => {
    const d = (difficulty ?? "").toLowerCase();
    if (d === "advanced" || d === "senior" || d === "hard" || d === "expert")
      return {
        color: "#d44c47",
        bg: "#fdecea",
        border: "#f5c0bd",
        label: difficulty,
      };
    if (d === "intermediate" || d === "medium" || d === "advanced")
      return {
        color: T.amber,
        bg: T.amberSubtle,
        border: T.amberBorder,
        label: difficulty,
      };
    return {
      color: T.green,
      bg: T.greenSubtle,
      border: T.greenBorder,
      label: difficulty ?? "Beginner",
    };
  })();

  return new ImageResponse(
    <div
      style={{
        background: T.bg,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 0,
        position: "relative",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── Dot grid (warm, very subtle on white) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${T.border} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Left accent column ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 6,
          background: T.accent,
        }}
      />

      {/* ── Top rule line ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 6,
          right: 0,
          height: 1,
          background: T.border,
        }}
      />

      {/* ── Bottom rule line ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 6,
          right: 0,
          height: 1,
          background: T.border,
        }}
      />

      {/* ── Content ── */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          padding: "52px 72px 52px 80px",
          flex: 1,
        }}
      >
        {/* Logo row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 52,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: T.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              JS
            </div>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: T.text,
                letterSpacing: "-0.02em",
              }}
            >
              JSPrep<span style={{ color: T.accent }}>Pro</span>
            </span>
          </div>

          {/* Domain pill — top right */}
          <div
            style={{
              background: T.bgSubtle,
              border: `1px solid ${T.border}`,
              borderRadius: 100,
              padding: "5px 16px",
              fontSize: 13,
              color: T.muted,
            }}
          >
            jsprep.pro
          </div>
        </div>

        {/* Badge row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 22,
          }}
        >
          {/* Category chip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: T.accentSubtle,
              border: `1px solid ${T.border}`,
              borderRadius: 100,
              padding: "5px 14px",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.accentText,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {category}
            </span>
          </div>

          {/* Difficulty badge */}
          {difficulty && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: diffStyle.bg,
                border: `1px solid ${diffStyle.border}`,
                borderRadius: 100,
                padding: "5px 14px",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: diffStyle.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {diffStyle.label}
              </span>
            </div>
          )}

          {/* Interview Topic badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: T.bgSubtle,
              border: `1px solid ${T.border}`,
              borderRadius: 100,
              padding: "5px 14px",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: T.muted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Interview Topic
            </span>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            color: T.text,
            lineHeight: 1.1,
            marginBottom: 20,
            maxWidth: 820,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 21,
            color: T.muted,
            lineHeight: 1.6,
            maxWidth: 700,
            marginBottom: "auto",
          }}
        >
          {shortDesc}
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 36,
          }}
        >
          {/* Free to practice chip */}
          <div
            style={{
              background: T.greenSubtle,
              border: `1px solid ${T.greenBorder}`,
              borderRadius: 10,
              padding: "9px 18px",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <span style={{ fontSize: 14, color: T.green, fontWeight: 700 }}>
              ✓ Free to practice
            </span>
          </div>

          {/* Question count chip — shown only when available */}
          {qCount != null && (
            <div
              style={{
                background: T.bgSubtle,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "9px 18px",
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <span style={{ fontSize: 14, color: T.text, fontWeight: 700 }}>
                {qCount}
              </span>
              <span style={{ fontSize: 14, color: T.muted }}>questions</span>
            </div>
          )}

          {/* AI-scored chip */}
          <div
            style={{
              background: T.accentSubtle,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: "9px 18px",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <span
              style={{ fontSize: 14, color: T.accentText, fontWeight: 700 }}
            >
              ⚡ AI scored
            </span>
          </div>
        </div>
      </div>

      {/* ── Right decorative panel ── */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 260,
          background: T.bgSubtle,
          borderLeft: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          padding: "48px 32px",
        }}
      >
        {/* Large JS letter mark */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 20,
            background: T.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: 28,
            boxShadow: `0 4px 24px ${T.accentSubtle}`,
          }}
        >
          JS
        </div>

        {/* Stat boxes */}
        {[
          { value: "195+", label: "Questions" },
          { value: "3", label: "Modes" },
          { value: "6", label: "AI Tools" },
        ].map(({ value, label }) => (
          <div
            key={label}
            style={{
              width: "100%",
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: "10px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: T.text,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {value}
            </span>
            <span
              style={{
                fontSize: 11,
                color: T.muted,
                marginTop: 2,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}

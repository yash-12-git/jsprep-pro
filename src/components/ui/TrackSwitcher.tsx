/** @jsxImportSource @emotion/react */
"use client";

/**
 * src/components/ui/TrackSwitcher.tsx
 *
 * Dropdown component that lets users switch between tracks.
 * Renders in the Navbar. Shows current track with color accent.
 * Unavailable tracks show as "Coming Soon" and are unclickable.
 */

import { useState, useRef, useEffect } from "react";
import { css } from "@emotion/react";
import { ChevronDown, Lock } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import { useTrack } from "@/contexts/TrackContext";
import type { Track } from "@/contexts/TrackContext";
import { usePathname, useRouter } from "next/navigation";
import { TRACK_MAP, TRACKS } from "@/lib/tracks";

export default function TrackSwitcher() {
  const { track, config, setTrack } = useTrack();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const TRACK_NAVIGABLE_PATTERNS = [
    { pattern: /^\/topics\/[^/]+(\/.*)?$/, page: "topics" },
    { pattern: /^\/blog\/[^/]+(\/.*)?$/, page: "blog" },
  ];

  function handleSelect(id: Track) {
    if (!TRACK_MAP[id]?.available) return;
    setTrack(id);

    if (
    pathname === "/react-interview-cheatsheet" ||
    pathname === "/javascript-interview-cheatsheet"
  ) {
    router.push(`/${id}-interview-cheatsheet`);
    return;
  }

  // 👉 Case 3: interview questions (hardcoded)
   if (
    pathname === "/react-interview-questions" ||
    pathname === "/javascript-interview-questions"
  ) {
    router.push(`/${id}-interview-questions`);
    return;
  }

    const navigable = TRACK_NAVIGABLE_PATTERNS.find((p) =>
      p.pattern.test(pathname),
    );
    if (navigable) {
      router.push(`/${navigable.page}/${id}`);
    } else {
      router.refresh();
    }
    setOpen(false);
  }

  return (
    <div css={wrapper} ref={ref}>
      {/* Trigger */}
      <button css={trigger(config.color)} onClick={() => setOpen((o) => !o)}>
        <span css={dot(config.color)} />
        <span css={triggerLabel}>{config.label}</span>
        {config.badge && config.badge !== "SOON" && (
          <span css={badgePill(config.color)}>{config.badge}</span>
        )}
        <ChevronDown size={12} css={chevron(open)} />
      </button>

      {/* Dropdown */}
      {open && (
        <div css={dropdown}>
          <div css={dropdownLabel}>Switch track</div>
          {TRACKS.map((t) => (
            <button
              key={t.id}
              css={trackItem(t.id === track, t.available, t.color)}
              onClick={() => handleSelect(t.id)}
              disabled={!t.available}
            >
              <div css={trackLeft}>
                <span css={trackDot(t.color, t.available)} />
                <div>
                  <div css={trackName(t.available)}>
                    {t.label}
                    {t.badge && (
                      <span css={trackBadge(t.color, t.available)}>
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <div css={trackTagline}>{t.tagline}</div>
                </div>
              </div>
              {!t.available && (
                <Lock size={11} css={{ color: C.muted, flexShrink: 0 }} />
              )}
              {t.id === track && <span css={activeDot} />}
            </button>
          ))}

          <div css={dropdownFooter}>
            More tracks coming — React, TypeScript, System Design
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const wrapper = css`
  position: relative;
  flex-shrink: 0;
`;

const trigger = (color: string) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.625rem;
  border-radius: ${RADIUS.md};
  border: 1px solid ${color}33;
  background: ${color}0d;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${color}18;
    border-color: ${color}55;
  }
`;

const dot = (color: string) => css`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${color};
  flex-shrink: 0;
`;

const triggerLabel = css`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${C.text};
`;

const badgePill = (color: string) => css`
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 1px 5px;
  border-radius: 4px;
  background: ${color}20;
  color: ${color};
  border: 1px solid ${color}33;
`;

const chevron = (open: boolean) => css`
  color: ${C.muted};
  transition: transform 0.2s;
  transform: ${open ? "rotate(180deg)" : "none"};
`;

const dropdown = css`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 280px;
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  z-index: 200;
`;

const dropdownLabel = css`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${C.muted};
  padding: 0.75rem 1rem 0.375rem;
`;

const trackItem = (active: boolean, available: boolean, color: string) => css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: ${active ? color + "0a" : "transparent"};
  cursor: ${available ? "pointer" : "not-allowed"};
  opacity: ${available ? 1 : 0.55};
  text-align: left;
  transition: background 0.1s;
  &:hover:not(:disabled) {
    background: ${color}12;
  }
`;

const trackLeft = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
`;

const trackDot = (color: string, available: boolean) => css`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${available ? color : C.border};
  flex-shrink: 0;
`;

const trackName = (available: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${available ? C.text : C.muted};
`;

const trackBadge = (color: string, available: boolean) => css`
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 1px 5px;
  border-radius: 4px;
  background: ${available ? color + "18" : C.bgSubtle};
  color: ${available ? color : C.muted};
  border: 1px solid ${available ? color + "30" : C.border};
`;

const trackTagline = css`
  font-size: 0.75rem;
  color: ${C.muted};
  margin-top: 2px;
  line-height: 1.4;
`;

const activeDot = css`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${C.green};
  flex-shrink: 0;
`;

const dropdownFooter = css`
  padding: 0.625rem 1rem;
  font-size: 0.6875rem;
  color: ${C.muted};
  border-top: 1px solid ${C.border};
  background: ${C.bgSubtle};
  text-align: center;
`;

/** @jsxImportSource @emotion/react */
"use client";

/**
 * src/components/ui/CodeEditor/CodeEditor.tsx
 *
 * Fixes applied:
 * - lineNumbers: 'off' by default (caller can pass showLineNums=true)
 * - renderLineHighlight: 'none' — removes the black border on active line
 * - renderLineHighlightOnlyWhenFocus: true — no highlight when blurred
 */

import dynamic from "next/dynamic";
import { css } from "@emotion/react";
import { C } from "@/styles/tokens";
import { useTheme } from "@/contexts/ThemeContext";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div css={placeholder}>
        <span css={placeholderText}>Loading editor…</span>
      </div>
    ),
  },
);

interface Props {
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  height?: number | string;
  language?: string;
  showLineNums?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  readOnly = false,
  height = 200,
  language = "javascript",
  showLineNums = true,
}: Props) {
  const { isDark } = useTheme();
  return (
    <div css={wrap}>
      <MonacoEditor
        height={height}
        language={language}
        value={value}
        theme={isDark ? "vs-dark" : "light"}
        onChange={(v) => onChange?.(v ?? "")}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: '"JetBrains Mono","Fira Code",monospace',
          fontLigatures: true,
          lineNumbers: showLineNums ? "on" : "off",
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          // ── No active-line highlight (was causing the black border) ──
          renderLineHighlight: "none",
          renderLineHighlightOnlyWhenFocus: true,
          // ──────────────────────────────────────────────────────────────
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            vertical: "hidden",
            horizontal: "auto",
            alwaysConsumeMouseWheel: false,
          },
          padding: { top: 12, bottom: 12 },
          tabSize: 2,
          wordWrap: "on",
          contextmenu: false,
          quickSuggestions: !readOnly,
          parameterHints: { enabled: !readOnly },
          suggestOnTriggerCharacters: !readOnly,
          glyphMargin: false,
          folding: false,
          links: false,
          selectionHighlight: false,
          occurrencesHighlight: "off",
          // Remove the cursor blinking highlight box
          cursorStyle: readOnly ? "line-thin" : "line",
          cursorBlinking: readOnly ? "solid" : "blink",
        }}
      />
    </div>
  );
}

const wrap = css`
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid ${C.border};

  .monaco-editor,
  .monaco-editor .margin,
  .monaco-editor-background {
    background-color: var(--color-code-bg, #f7f7f5) !important;
  }

  /* Hide the cursor-line background highlight */
  .monaco-editor .view-overlays .current-line {
    border: none !important;
    background: transparent !important;
  }

  /* Hide the gutter line highlight */
  .monaco-editor .margin-view-overlays .current-line-margin {
    border: none !important;
    background: transparent !important;
  }
`;

const placeholder = css`
  height: 180px;
  background: var(--color-code-bg, #f7f7f5);
  border: 1px solid ${C.border};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const placeholderText = css`
  font-size: 12px;
  color: ${C.muted};
  font-family: "JetBrains Mono", monospace;
`;

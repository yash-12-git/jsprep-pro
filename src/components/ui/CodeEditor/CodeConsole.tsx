/** @jsxImportSource @emotion/react */
"use client";

/**
 * src/components/ui/CodeEditor/CodeConsole.tsx
 *
 * Console output panel shown below the editor after running code.
 */

import { css } from "@emotion/react";
import { C } from "@/styles/tokens";
import type { RunResult } from "@/lib/codeRunner";

interface Props {
  result: RunResult | null;
  running?: boolean;
}

export default function CodeConsole({ result, running = false }: Props) {
  if (!result && !running) return null;

  return (
    <div css={wrap}>
      <div css={header}>
        <span css={label}>Output</span>
        {running && <span css={spinner} />}
      </div>

      <div css={body}>
        {running ? (
          <span css={mutedLine}>Running…</span>
        ) : result?.timed_out ? (
          <span css={errorLine}>⏱ Execution timed out (infinite loop?)</span>
        ) : result?.error ? (
          <span css={errorLine}>✗ {result.error}</span>
        ) : result?.output.length === 0 ? (
          <span css={mutedLine}>// no output</span>
        ) : (
          result?.output.map((line, i) => (
            <div key={i} css={outputLine}>
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const wrap = css`
  border: 1px solid ${C.border};
  border-top: none;
  border-radius: 0 0 6px 6px;
  overflow: hidden;
  background: var(--color-code-bg);
`;

const header = css`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  background: ${C.surface};
  border-bottom: 1px solid ${C.border};
`;

const label = css`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${C.muted};
  font-family: "JetBrains Mono", monospace;
`;

const body = css`
  padding: 10px 14px;
  font-family: "JetBrains Mono", monospace;
  font-size: 12.5px;
  line-height: 1.7;
  min-height: 40px;
  max-height: 180px;
  overflow-y: auto;
`;

const outputLine = css`
  color: var(--color-code-text);
  white-space: pre-wrap;
  word-break: break-all;
`;

const errorLine = css`
  color: ${C.danger};
  white-space: pre-wrap;
`;

const mutedLine = css`
  color: ${C.muted};
`;

const spinner = css`
  width: 10px;
  height: 10px;
  border: 1.5px solid ${C.muted};
  border-top-color: ${C.accent};
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
`;

/** @jsxImportSource @emotion/react */
"use client";

import { useState, useRef } from "react";
import { css } from "@emotion/react";
import { Eye, Code2, Type } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import { C, RADIUS } from "@/styles/tokens";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
}

const S = {
  wrapper: css``,

  label: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.375rem;
  `,

  labelText: css`
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: ${C.muted};
  `,

  tabs: css`
    display: flex;
    gap: 0.25rem;
  `,

  tab: (active: boolean) => css`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.625rem;
    border-radius: ${RADIUS.sm};
    font-size: 0.625rem;
    font-weight: 600;
    border: 1px solid ${active ? C.accent : C.border};
    background: ${active ? C.accentSubtle : "transparent"};
    color: ${active ? C.accentText : C.muted};
    cursor: pointer;
    transition: all 0.12s ease;
    &:hover {
      border-color: ${C.accent};
      color: ${C.accentText};
      background: ${C.accentSubtle};
    }
  `,

  textarea: css`
    width: 100%;
    background: ${C.bg};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.lg};
    padding: 0.875rem 1rem;
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 0.8125rem;
    line-height: 1.75;
    color: ${C.text};
    resize: vertical;
    outline: none;
    transition:
      border-color 0.12s ease,
      box-shadow 0.12s ease;
    &:focus {
      border-color: ${C.accent};
      box-shadow: 0 0 0 2px ${C.accentSubtle};
    }
    &::placeholder {
      color: ${C.placeholder};
    }
    tab-size: 2;
  `,

  preview: css`
    background: ${C.bgSubtle};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.lg};
    padding: 0.875rem 1rem;
    min-height: 8rem;
  `,

  hint: css`
    font-size: 0.625rem;
    color: ${C.muted};
    margin-top: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  `,

  hintCode: css`
    background: ${C.bgSubtle};
    border: 1px solid ${C.border};
    padding: 0.0625rem 0.3rem;
    border-radius: 0.25rem;
    font-family: monospace;
    color: ${C.accentText};
  `,
};

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  rows = 10,
  label,
}: Props) {
  const [mode, setMode] = useState<"write" | "preview" | "split">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newVal = value.substring(0, start) + "  " + value.substring(end);
      onChange(newVal);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  }

  return (
    <div css={S.wrapper}>
      <div css={S.label}>
        {label && <span css={S.labelText}>{label}</span>}
        <div css={S.tabs}>
          <button
            type="button"
            css={S.tab(mode === "write")}
            onClick={() => setMode("write")}
          >
            <Code2 size={10} /> Write
          </button>
          <button
            type="button"
            css={S.tab(mode === "preview")}
            onClick={() => setMode("preview")}
          >
            <Eye size={10} /> Preview
          </button>
          <button
            type="button"
            css={S.tab(mode === "split")}
            onClick={() => setMode("split")}
          >
            <Type size={10} /> Split
          </button>
        </div>
      </div>

      {mode === "write" && (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? "Write in Markdown…"}
          rows={rows}
          css={S.textarea}
        />
      )}

      {mode === "preview" && (
        <div css={S.preview}>
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <span css={{ color: C.muted, fontSize: "0.875rem" }}>
              Nothing to preview yet.
            </span>
          )}
        </div>
      )}

      {mode === "split" && (
        <div
          css={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? "Write in Markdown…"}
            rows={rows}
            css={S.textarea}
          />
          <div css={S.preview}>
            {value ? (
              <MarkdownRenderer content={value} compact />
            ) : (
              <span css={{ color: C.muted, fontSize: "0.8125rem" }}>
                Preview will appear here.
              </span>
            )}
          </div>
        </div>
      )}

      <div css={S.hint}>
        <span>
          <code css={S.hintCode}>**bold**</code>{" "}
          <code css={S.hintCode}>*italic*</code>{" "}
          <code css={S.hintCode}>`code`</code>
        </span>
        <span>
          Fenced blocks: <code css={S.hintCode}>```js</code>
        </span>
        <span>
          <code css={S.hintCode}>::: tip</code> for callouts
        </span>
      </div>
    </div>
  );
}

/** @jsxImportSource @emotion/react */
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  getDocs,
  collection,
  query,
  orderBy,
  QueryConstraint,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  deleteQuestion,
  publishQuestion,
  archiveQuestion,
} from "@/lib/questions";
import { css } from "@emotion/react";
import { C, RADIUS } from "@/styles/tokens";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
} from "lucide-react";
import type { Question } from "@/types/question";
import { useTrack } from "@/contexts/TrackContext";

const S = {
  topRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  `,
  heading: css`
    font-size: 1.5rem;
    font-weight: 900;
  `,
  addBtn: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: ${C.accent};
    border: none;
    border-radius: ${RADIUS.xl};
    color: white;
    font-weight: 800;
    font-size: 0.875rem;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  `,
  searchBar: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.xl};
    padding: 0.5rem 0.875rem;
    margin-bottom: 1rem;
    &:focus-within {
      border-color: ${C.accent}55;
    }
  `,
  searchInput: css`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.875rem;
    color: white;
    &::placeholder {
      color: ${C.muted};
    }
  `,
  filterRow: css`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  `,
  filterChip: (active: boolean) => css`
    padding: 0.25rem 0.875rem;
    border-radius: 9999px;
    font-size: 0.6875rem;
    font-weight: 700;
    border: 1px solid ${active ? C.accent + "66" : C.border};
    background: ${active ? C.accent + "18" : "transparent"};
    color: ${active ? C.accent : C.muted};
    cursor: pointer;
    transition: all 0.15s;
  `,
  table: css`
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  `,
  row: css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.xl};
    transition: border-color 0.15s;
    &:hover {
      border-color: rgba(255, 255, 255, 0.12);
    }
  `,
  badge: (color: string) => css`
    font-size: 0.5625rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
    background: ${color}14;
    border: 1px solid ${color}30;
    color: ${color};
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
  `,
  title: css`
    flex: 1;
    font-size: 0.875rem;
    color: white;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  category: css`
    font-size: 0.75rem;
    color: ${C.muted};
    flex-shrink: 0;
  `,
  iconBtn: (color: string) => css`
    color: ${color};
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    border-radius: 0.375rem;
    transition: background 0.15s;
    &:hover {
      background: ${color}18;
    }
  `,
  empty: css`
    text-align: center;
    padding: 4rem 1rem;
    color: ${C.muted};
  `,
  counter: css`
    font-size: 0.8125rem;
    color: ${C.muted};
    margin-bottom: 0.75rem;
  `,
};

const STATUS_COLOR: Record<string, string> = {
  published: C.accent3,
  draft: C.accent2,
  archived: C.muted,
};
const TYPE_COLOR: Record<string, string> = {
  theory: C.accent,
  output: C.accent2,
  debug: C.danger,
  polyfill: C.green,
  coding: C.purple,
  system: C.orange,
  behavioral: C.accent3,
};

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { track } = useTrack();

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(
          collection(db, "questions"),
          where("track", "==", track),
          orderBy("order", "asc"),
        ),
      );
      setQuestions(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Question),
      );
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [track]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteQuestion(id);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  async function handleTogglePublish(q: Question) {
    if (q.status === "published") {
      await archiveQuestion(q.id);
      setQuestions((prev) =>
        prev.map((x) => (x.id === q.id ? { ...x, status: "archived" } : x)),
      );
    } else {
      await publishQuestion(q.id);
      setQuestions((prev) =>
        prev.map((x) => (x.id === q.id ? { ...x, status: "published" } : x)),
      );
    }
  }

  const filtered = questions.filter((q) => {
    const matchSearch =
      !search ||
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || q.type === typeFilter;
    const matchStatus = statusFilter === "all" || q.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const types = ["all", ...Array.from(new Set(questions.map((q) => q.type)))];
  const statuses = ["all", "published", "draft", "archived"];

  return (
    <div>
      <div css={S.topRow}>
        <h1 css={S.heading}>All Questions ({questions.length})</h1>
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <button css={S.iconBtn(C.muted)} onClick={load} title="Refresh">
            <RefreshCw size={15} />
          </button>
          <Link href="/admin/questions/new" css={S.addBtn}>
            <PlusCircle size={15} /> Add Question
          </Link>
        </div>
      </div>

      {/* Search */}
      <div css={S.searchBar}>
        <Search size={14} color={C.muted} />
        <input
          css={S.searchInput}
          placeholder="Search by title or category\u2026"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div css={S.filterRow}>
        {types.map((t) => (
          <button
            key={t}
            css={S.filterChip(typeFilter === t)}
            onClick={() => setTypeFilter(t)}
          >
            {t === "all" ? "All Types" : t}
          </button>
        ))}
      </div>
      <div css={S.filterRow}>
        {statuses.map((s) => (
          <button
            key={s}
            css={S.filterChip(statusFilter === s)}
            onClick={() => setStatusFilter(s)}
          >
            {s === "all" ? "All Status" : s}
          </button>
        ))}
      </div>

      <p css={S.counter}>
        Showing {filtered.length} of {questions.length}
      </p>

      {loading ? (
        <p style={{ color: C.muted }}>Loading questions\u2026</p>
      ) : filtered.length === 0 ? (
        <div css={S.empty}>
          No questions found.{" "}
          <Link href="/admin/questions/new" style={{ color: C.accent }}>
            Add one \u2192
          </Link>
        </div>
      ) : (
        <div css={S.table}>
          {filtered.map((q) => (
            <div key={q.id} css={S.row}>
              <span css={S.badge(STATUS_COLOR[q.status] ?? C.muted)}>
                {q.status}
              </span>
              <span css={S.badge(TYPE_COLOR[q.type] ?? C.muted)}>{q.type}</span>
              <span css={S.title}>{q.title}</span>
              <span css={S.category}>{q.category}</span>
              <button
                css={S.iconBtn(
                  q.status === "published" ? C.accent2 : C.accent3,
                )}
                onClick={() => handleTogglePublish(q)}
                title={q.status === "published" ? "Unpublish" : "Publish"}
              >
                {q.status === "published" ? (
                  <EyeOff size={14} />
                ) : (
                  <Eye size={14} />
                )}
              </button>
              <Link
                href={`/admin/questions/${q.id}`}
                css={S.iconBtn(C.accent)}
                title="Edit"
              >
                <Edit2 size={14} />
              </Link>
              <button
                css={S.iconBtn(C.danger)}
                onClick={() => handleDelete(q.id, q.title)}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

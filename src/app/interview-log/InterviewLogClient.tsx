/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { css } from "@emotion/react";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PageGuard from "@/components/ui/PageGuard";
import { track } from "@/lib/analytics";
import {
  addInterviewLog,
  deleteInterviewLog,
  getInterviewLogs,
  updateLogOutcome,
  type SavedInterviewLog,
} from "@/lib/interviewLog";
import {
  LIMITS,
  LOG_TOPICS,
  OUTCOMES,
  ROUND_TYPES,
  type InterviewLog,
} from "@/lib/interviewLogOptions";
import * as Shared from "@/styles/shared";
import { C, RADIUS } from "@/styles/tokens";

const LOG_PAGE_SIZE = 30;

const today = () => new Date().toISOString().split("T")[0];

const emptyForm = () => ({
  company: "",
  roundType: ROUND_TYPES[0],
  date: today(),
  outcome: OUTCOMES[0],
  topics: [] as string[],
  stuckOn: "",
  shareAnonymously: false,
});

const outcomeColor = (o: string) =>
  o === "Got an offer" || o === "Moved to next round"
    ? C.green
    : o === "Rejected"
      ? C.red
      : C.muted;

export default function InterviewLogClient() {
  const { user, progress, loading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<SavedInterviewLog[] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/auth?next=/interview-log");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getInterviewLogs(user.uid, LOG_PAGE_SIZE)
      .then(setLogs)
      .catch((err) => {
        console.error("[InterviewLog] could not load", err);
        setError("We couldn't load your logged interviews. Try again in a moment.");
        setLogs([]);
      });
  }, [user]);

  function toggleTopic(t: string) {
    setForm((f) => ({
      ...f,
      topics: f.topics.includes(t)
        ? f.topics.filter((x) => x !== t)
        : f.topics.length < LIMITS.topics
          ? [...f.topics, t]
          : f.topics,
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    const log: InterviewLog = {
      ...form,
      company: form.company.trim().slice(0, LIMITS.company),
      stuckOn: form.stuckOn.trim().slice(0, LIMITS.stuckOn),
      createdAt: new Date().toISOString(),
    };
    try {
      const id = await addInterviewLog(user.uid, log);
      setLogs((prev) =>
        [{ ...log, id }, ...(prev ?? [])].sort((a, b) => b.date.localeCompare(a.date)),
      );
      track("interview_logged", {
        round_type: log.roundType,
        outcome: log.outcome,
        topic_count: log.topics.length,
        shared: log.shareAnonymously,
      });
      setForm(emptyForm());
      setSaved(true);
    } catch (err) {
      console.error("[InterviewLog] could not save", err);
      setError("We couldn't save that interview. Try again in a moment.");
    } finally {
      setSaving(false);
    }
  }

  async function changeOutcome(id: string, outcome: string) {
    if (!user) return;
    const before = logs;
    setLogs((prev) => prev?.map((l) => (l.id === id ? { ...l, outcome } : l)) ?? null);
    try {
      await updateLogOutcome(user.uid, id, outcome);
    } catch (err) {
      console.error("[InterviewLog] could not update", err);
      setLogs(before);
      setError("We couldn't update that outcome. Try again in a moment.");
    }
  }

  async function remove(id: string) {
    if (!user || !window.confirm("Delete this interview from your log?")) return;
    try {
      await deleteInterviewLog(user.uid, id);
      setLogs((prev) => prev?.filter((l) => l.id !== id) ?? null);
    } catch (err) {
      console.error("[InterviewLog] could not delete", err);
      setError("We couldn't delete that interview. Try again in a moment.");
    }
  }

  return (
    <PageGuard loading={loading || !user || !progress || logs === null} ready={!!progress}>
      <div css={Shared.pageWrapper}>
        <h1 css={Shared.pageTitleText}>Interview log</h1>
        <p css={[Shared.pageSubtitleText, { marginBottom: "1.5rem" }]}>
          Had a real interview? Log what was asked and where you got stuck. Your
          next study plan will focus on it.
        </p>

        <form css={[Shared.card, formCard]} onSubmit={submit}>
          <div css={row}>
            <label css={field}>
              <span css={labelText}>Round</span>
              <select
                css={input}
                value={form.roundType}
                onChange={(e) => setForm((f) => ({ ...f, roundType: e.target.value }))}
              >
                {ROUND_TYPES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label css={field}>
              <span css={labelText}>Date</span>
              <input
                type="date"
                css={input}
                value={form.date}
                max={today()}
                required
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </label>
          </div>

          <div css={row}>
            <label css={field}>
              <span css={labelText}>Company (optional, only you see it)</span>
              <input
                css={input}
                value={form.company}
                maxLength={LIMITS.company}
                placeholder="Company name"
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              />
            </label>
            <label css={field}>
              <span css={labelText}>Outcome</span>
              <select
                css={input}
                value={form.outcome}
                onChange={(e) => setForm((f) => ({ ...f, outcome: e.target.value }))}
              >
                {OUTCOMES.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          </div>

          <fieldset css={{ border: "none", padding: 0, margin: 0 }}>
            <legend css={labelText}>Topics asked (up to {LIMITS.topics})</legend>
            <div css={chips}>
              {LOG_TOPICS.map((t) => {
                const on = form.topics.includes(t);
                return (
                  <button
                    type="button"
                    key={t}
                    css={chip(on)}
                    aria-pressed={on}
                    onClick={() => toggleTopic(t)}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label css={field}>
            <span css={labelText}>Where did you get stuck?</span>
            <textarea
              css={[Shared.textarea(), { fontFamily: "inherit", fontSize: "1rem" }]}
              rows={4}
              maxLength={LIMITS.stuckOn}
              value={form.stuckOn}
              placeholder="For example: couldn't explain why the microtask ran before setTimeout, or ran out of time on the debounce question."
              onChange={(e) => setForm((f) => ({ ...f, stuckOn: e.target.value }))}
            />
          </label>

          <label css={checkRow}>
            <input
              type="checkbox"
              checked={form.shareAnonymously}
              onChange={(e) => setForm((f) => ({ ...f, shareAnonymously: e.target.checked }))}
            />
            <span>
              Let JSPrep Pro use the round, topics and questions, without your
              name or contact details, to build interview guides for other
              candidates.
            </span>
          </label>

          {error && <p css={{ color: C.red, fontSize: "0.875rem" }}>{error}</p>}
          {saved && (
            <p css={{ color: C.green, fontSize: "0.875rem" }}>
              Saved.{" "}
              <Link href="/study-plan" css={{ color: C.text, textDecoration: "underline" }}>
                Update your study plan
              </Link>{" "}
              to focus on it.
            </p>
          )}

          <button type="submit" css={Shared.primaryBtn(C.accent)} disabled={saving}>
            {saving ? "Saving…" : "Log this interview"}
          </button>
        </form>

        {logs && logs.length > 0 && (
          <>
            <h2 css={sectionHead}>Your interviews</h2>
            <ul css={list}>
              {logs.map((l) => (
                <li key={l.id} css={[Shared.card, { padding: "1rem" }]}>
                  <div css={itemTop}>
                    <div css={{ minWidth: 0, flex: 1 }}>
                      <p css={{ fontWeight: 500, color: C.text, overflowWrap: "anywhere" }}>
                        {l.roundType}
                        {l.company && ` at ${l.company}`}
                      </p>
                      <p css={{ fontSize: "0.75rem", color: C.muted }}>
                        {new Date(`${l.date}T00:00:00`).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <select
                      css={[input, outcomeSelect, { color: outcomeColor(l.outcome) }]}
                      value={l.outcome}
                      aria-label="Outcome"
                      onChange={(e) => changeOutcome(l.id, e.target.value)}
                    >
                      {OUTCOMES.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <button
                      css={iconBtn}
                      aria-label="Delete this interview"
                      onClick={() => remove(l.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  {l.topics.length > 0 && (
                    <p css={{ fontSize: "0.8125rem", color: C.muted, marginTop: "0.5rem" }}>
                      Asked: {l.topics.join(", ")}
                    </p>
                  )}
                  {l.stuckOn && (
                    <p css={{ fontSize: "0.875rem", color: C.text, marginTop: "0.5rem", lineHeight: 1.6, overflowWrap: "anywhere" }}>
                      Stuck on: {l.stuckOn}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </PageGuard>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const formCard = css`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const row = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  @media (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const field = css`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const labelText = css`
  font-size: 0.8125rem;
  color: ${C.muted};
  margin-bottom: 0.375rem;
`;

// 1rem so mobile Safari doesn't zoom in on focus.
const input = css`
  width: 100%;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  color: ${C.text};
  outline: none;
  &:focus-visible {
    border-color: ${C.accent};
    box-shadow: 0 0 0 2px ${C.accentSubtle};
  }
`;

const chips = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const chip = (on: boolean) => css`
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  cursor: pointer;
  border: 1px solid ${on ? C.accent : C.border};
  background: ${on ? C.accentSubtle : "transparent"};
  color: ${on ? C.accentText : C.muted};
  transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease;
  &:focus-visible {
    outline: 2px solid ${C.accent};
    outline-offset: 2px;
  }
`;

const checkRow = css`
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;
  font-size: 0.8125rem;
  color: ${C.muted};
  line-height: 1.55;
  cursor: pointer;
  input {
    margin-top: 0.2rem;
    flex-shrink: 0;
  }
`;

const sectionHead = css`
  font-size: 1rem;
  font-weight: 500;
  color: ${C.text};
  margin: 2rem 0 0.75rem;
`;

const list = css`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const itemTop = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const outcomeSelect = css`
  width: auto;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
`;

const iconBtn = css`
  display: flex;
  padding: 0.375rem;
  border: none;
  background: none;
  color: ${C.muted};
  cursor: pointer;
  border-radius: ${RADIUS.md};
  &:hover {
    color: ${C.red};
  }
  &:focus-visible {
    outline: 2px solid ${C.accent};
  }
`;

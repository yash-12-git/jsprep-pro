/** @jsxImportSource @emotion/react */
// app/mock-interview/MockInterviewClient.tsx
"use client";

import { aiErrorMessage, postAI } from "@/lib/aiClient";
import AIErrorNotice from "@/components/ui/AIErrorNotice";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import PageGuard from "@/components/ui/PageGuard";
import { css, keyframes } from "@emotion/react";
import { ChevronLeft, Send, Clock, AlertCircle } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import InterviewResult from "./InterviewResult";
import type { TopicRef } from "./page";
import {
  COMPANIES,
  FOCUS_AREAS,
  LEVELS,
  ROLES,
  type SetupConfig,
} from "@/lib/mockInterviewOptions";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Message {
  role: "user" | "assistant";
  content: string;
  lockedAt?: number;
}
type Phase = "setup" | "interview" | "result" | "ended";

export type { SetupConfig };

export interface ScoreBreakdown {
  overall: number;
  concepts: number;
  problemSolving: number;
  communication: number;
  depth: number;
  verdict: "Ready" | "Almost Ready" | "Not Ready";
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  rawFeedback: string;
}

interface Props {
  topics: TopicRef[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_TURNS = 10;
const INTERVIEW_SECS = 25 * 60;

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}`;
const dotPulse = keyframes`0%,100%{opacity:0.3}50%{opacity:1}`;
const timerPulse = keyframes`0%,100%{opacity:1}50%{opacity:.7}`;

// ─── Styles ───────────────────────────────────────────────────────────────────

const page = css`
  min-height: 100vh;
  background: ${C.bg};
`;
const backBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8125rem;
  color: ${C.muted};
  font-weight: 500;
  transition: color 0.12s;
  &:hover {
    color: ${C.text};
  }
`;

// Setup
const setupWrap = css`
  max-width: 34rem;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
`;
const setupTitle = css`
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 500;
  color: ${C.text};
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 0.5rem;
`;
const setupSub = css`
  font-size: 0.9375rem;
  color: ${C.muted};
  line-height: 1.6;
  margin-bottom: 2rem;
`;
const fieldLabel = css`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${C.muted};
  margin-bottom: 0.5rem;
`;
const chipGrid = (n: number) => css`
  display: grid;
  grid-template-columns: repeat(${n}, 1fr);
  gap: 0.375rem;
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const chip = (a: boolean) => css`
  padding: 0.5rem 0.75rem;
  border-radius: ${RADIUS.md};
  border: 1px solid ${a ? C.accent : C.border};
  background: ${a ? C.accentSubtle : "transparent"};
  color: ${a ? C.accentText : C.muted};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.12s, border-color 0.12s, color 0.12s, opacity 0.12s, transform 0.12s;
  white-space: nowrap;
  &:hover {
    border-color: ${C.accent};
    color: ${C.accentText};
  }
`;
const startBtn = css`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: ${RADIUS.lg};
  background: ${C.text};
  color: ${C.bg};
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  transition: opacity 0.12s;
  margin-top: 2rem;
  &:hover {
    opacity: 0.88;
  }
  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;
const warnBanner = css`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  border-radius: ${RADIUS.md};
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
  font-size: 0.8125rem;
  color: ${C.amber};
  line-height: 1.5;
  margin-top: 1.5rem;
`;

// Interview
const ivWrap = css`
  max-width: 52rem;
  margin: 0 auto;
  padding: 0 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 3.5rem);
`;
const topBar = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0 0.75rem;
  flex-shrink: 0;
`;
const ivTitle = css`
  font-size: 1rem;
  font-weight: 500;
  color: ${C.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const coTag = css`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: ${RADIUS.sm};
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  color: ${C.muted};
`;
const topRight = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const turnPill = css`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${C.muted};
  font-variant-numeric: tabular-nums;
`;
const timerNorm = css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 4px 10px;
  border-radius: ${RADIUS.md};
  font-size: 0.875rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  border: 1px solid ${C.border};
  background: ${C.bgSubtle};
  color: ${C.muted};
  transition: background-color 0.3s, border-color 0.3s, color 0.3s, opacity 0.3s, transform 0.3s;
`;
const timerWarn = css`
  ${timerNorm};
  background: ${C.redSubtle};
  color: ${C.red};
  border-color: ${C.redBorder};
  animation: ${timerPulse} 1.5s ease-in-out infinite;
`;
const pgTrack = css`
  height: 2px;
  background: ${C.border};
  flex-shrink: 0;
  border-radius: 9999px;
  overflow: hidden;
`;
const pgFill = (p: number) => css`
  height: 100%;
  width: ${p}%;
  background: ${C.accent};
  transition: width 0.4s ease;
`;
const msgs = css`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${C.border};
    border-radius: 9999px;
  }
`;
const msgRow = (u: boolean) => css`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  flex-direction: ${u ? "row-reverse" : "row"};
`;
const ava = (u: boolean) => css`
  width: 1.875rem;
  height: 1.875rem;
  border-radius: ${RADIUS.sm};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  ${u
    ? `background:${C.bgSubtle};border:1px solid ${C.border};color:${C.muted};`
    : `background:${C.accent};color: ${C.accentInk};`}
`;
const bubble = (u: boolean) => css`
  max-width: 75%;
  padding: 0.875rem 1rem;
  border-radius: ${u
    ? `${RADIUS.lg} ${RADIUS.sm} ${RADIUS.lg} ${RADIUS.lg}`
    : `${RADIUS.sm} ${RADIUS.lg} ${RADIUS.lg} ${RADIUS.lg}`};
  font-size: 0.9375rem;
  line-height: 1.75;
  color: ${C.text};
  ${u
    ? `background:${C.bgSubtle};border:1px solid ${C.border};`
    : `background:${C.bg};border:1px solid ${C.borderStrong};`}white-space:pre-wrap;
  word-break: break-word;
`;
const typingWrap = css`
  max-width: 5rem;
  padding: 0.875rem 1rem;
  border-radius: ${RADIUS.sm} ${RADIUS.lg} ${RADIUS.lg} ${RADIUS.lg};
  background: ${C.bg};
  border: 1px solid ${C.borderStrong};
  display: flex;
  align-items: center;
  gap: 5px;
`;
const dot = (d: string) => css`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${C.muted};
  animation: ${dotPulse} 1.2s ease-in-out infinite;
  animation-delay: ${d};
`;
const inputRow = css`
  flex-shrink: 0;
  padding: 0.75rem 0 0;
  border-top: 1px solid ${C.border};
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
`;
const inputBox = (dis: boolean) => css`
  flex: 1;
  background: ${C.bg};
  border: 1px solid ${dis ? C.border : C.borderStrong};
  border-radius: ${RADIUS.lg};
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  color: ${C.text};
  font-family: inherit;
  line-height: 1.6;
  resize: none;
  outline: none;
  min-height: 3rem;
  max-height: 10rem;
  transition: border-color 0.12s;
  &::placeholder {
    color: ${C.placeholder};
  }
  &:focus {
    border-color: ${C.accent};
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
const sendBtn = (a: boolean) => css`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${RADIUS.md};
  flex-shrink: 0;
  border: none;
  cursor: ${a ? "pointer" : "default"};
  background: ${a ? C.accent : C.bgSubtle};
  color: ${a ? C.accentInk : C.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.12s, border-color 0.12s, color 0.12s, opacity 0.12s, transform 0.12s;
  align-self: flex-end;
  &:hover {
    opacity: ${a ? 0.88 : 1};
  }
`;
const lockNote = css`
  font-size: 0.75rem;
  color: ${C.muted};
  text-align: center;
  padding: 0.375rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`;

const evalOverlay = css`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  background: ${C.bg};
`;
const evalSpinner = keyframes`to{transform:rotate(360deg)}`;
const evalDisk = css`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 3px solid ${C.border};
  border-top-color: ${C.accent};
  animation: ${evalSpinner} 0.8s linear infinite;
`;
const evalTitle = css`
  font-size: 1.125rem;
  font-weight: 500;
  color: ${C.text};
  letter-spacing: -0.02em;
`;
const evalSub = css`
  font-size: 0.875rem;
  color: ${C.muted};
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(s: number) {
  const m = Math.floor(s / 60),
    sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/**
 * parseCard — handles three formats Groq/llama may return:
 *   1. Pure JSON object: {...}
 *   2. Fenced: ```json {...} ```
 *   3. Text then JSON on its own line (shouldn't happen with new prompt but belt+braces)
 */
function parseCard(text: string): ScoreBreakdown | null {
  try {
    // 1. Fenced block
    const fenced = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (fenced) return tryParse(fenced[1].trim());

    // 2. Pure JSON — entire trimmed response is an object
    const trimmed = text.trim();
    if (trimmed.startsWith("{")) return tryParse(trimmed);

    // 3. JSON embedded anywhere in the text — find the first { … } span
    const start = text.indexOf('{"type":"scorecard"');
    if (start !== -1) {
      const end = text.lastIndexOf("}");
      if (end > start) return tryParse(text.slice(start, end + 1));
    }

    return null;
  } catch {
    return null;
  }
}

function tryParse(raw: string): ScoreBreakdown | null {
  try {
    const d = JSON.parse(raw);
    if (d.type !== "scorecard") return null;
    // A missing score must not be shown as a real 0.
    const scores = [d.overall, d.concepts, d.problemSolving, d.communication, d.depth];
    if (!scores.every((s) => typeof s === "number")) return null;
    return {
      overall: d.overall,
      concepts: d.concepts,
      problemSolving: d.problemSolving,
      communication: d.communication,
      depth: d.depth,
      verdict: d.verdict ?? "Not Ready",
      strengths: d.strengths ?? [],
      weaknesses: d.weaknesses ?? [],
      suggestions: d.suggestions ?? [],
      rawFeedback: d.summary ?? "",
    };
  } catch {
    return null;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MockInterviewClient({ topics }: Props) {
  const { user, progress, loading } = useAuth();
  const router = useRouter();

  const [cfg, setCfg] = useState<SetupConfig>({
    role: "Frontend Developer",
    experience: "mid",
    company: "General",
    focus: "Mixed (all topics)",
  });
  const [phase, setPhase] = useState<Phase>("setup");

  // Pre-fill from roadmap "Start mock interview" links (?focus=...&company=...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const focus = params.get("focus");
    const company = params.get("company");
    if (!focus && !company) return;
    setCfg((prev) => ({
      ...prev,
      ...(focus && FOCUS_AREAS.includes(focus) ? { focus } : {}),
      ...(company && COMPANIES.includes(company) ? { company } : {}),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [evaluating, setEvaluating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [turns, setTurns] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INTERVIEW_SECS);
  const [timedOut, setTimedOut] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [scorecard, setScorecard] = useState<ScoreBreakdown | null>(null);
  const [saving, setSaving] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth?next=/mock-interview");
  }, [user, loading, router]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const isFinalStep = timedOut || turns >= TOTAL_TURNS;

  // The clock only runs while it's the candidate's turn, so waiting on the AI
  // or an AI failure never uses up their time.
  const clockRunning =
    phase === "interview" && !isTyping && !aiLoading && !aiError && !timedOut;

  useEffect(() => {
    if (!clockRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(t - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [clockRunning]);

  useEffect(() => {
    if (clockRunning && timeLeft === 0) handleTimeUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clockRunning, timeLeft]);

  // Score what was answered, counting any unsent draft as the last answer.
  // With nothing to score, end without inventing a result.
  function handleTimeUp() {
    setTimedOut(true);
    const draft = input.trim();
    const finalMsgs: Message[] = draft
      ? [...messages, { role: "user", content: draft, lockedAt: Date.now() }]
      : messages;
    setMessages(finalMsgs);
    setInput("");
    if (finalMsgs.some((m) => m.role === "user")) requestReply(finalMsgs, true);
    else setPhase("ended");
  }

  function handleTA(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  }

  async function requestOpening() {
    setAiError(null);
    setIsTyping(true);
    try {
      const data = await postAI({
        type: "mock",
        messages: [{ role: "user", content: "Begin the interview." }],
        context: { ...cfg },
      });
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
      setIsTyping(false);
      setMessages([{ role: "assistant", content: data.text }]);
    } catch (err) {
      console.error("[MockInterview] opening failed", err);
      setIsTyping(false);
      setAiError(aiErrorMessage(err));
    }
  }

  function startInterview() {
    setPhase("interview");
    setMessages([]);
    setTurns(0);
    setTimeLeft(INTERVIEW_SECS);
    requestOpening();
  }

  // On failure the conversation stays as it was, ending on the user's locked
  // answer, so retrying sends the same messages again.
  async function requestReply(msgs: Message[], isFinal: boolean) {
    setAiError(null);
    setIsTyping(true);
    setAiLoading(true);
    if (isFinal) setEvaluating(true);
    const apiMsgs = msgs.map((m) => ({ role: m.role, content: m.content }));
    if (isFinal) apiMsgs.push({ role: "user", content: "GENERATE_SCORECARD" });
    try {
      const data = await postAI({
        type: "mock",
        messages: apiMsgs,
        context: { ...cfg, isFinal },
      });
      const delay = 1200 + Math.min(data.text.length * 1.5, 2800);
      await new Promise((r) => setTimeout(r, delay));
      setIsTyping(false);
      const card = parseCard(data.text);
      if (card) {
        setEvaluating(false);
        setScorecard(card);
        await saveHistory(msgs, card);
        setPhase("result");
      } else if (isFinal) {
        throw new Error("Final reply had no scorecard");
      } else {
        setEvaluating(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text },
        ]);
      }
    } catch (err) {
      console.error("[MockInterview] reply failed", err);
      setIsTyping(false);
      setEvaluating(false);
      setAiError(aiErrorMessage(err));
    } finally {
      setAiLoading(false);
    }
  }

  function retryLastRequest() {
    if (messages.length === 0) requestOpening();
    else requestReply(messages, isFinalStep);
  }

  function sendAnswer() {
    if (!input.trim() || aiLoading || isTyping || aiError || timedOut) return;
    const userMsg: Message = {
      role: "user",
      content: input.trim(),
      lockedAt: Date.now(),
    };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
    const newTurns = turns + 1;
    setTurns(newTurns);
    requestReply(newMsgs, newTurns >= TOTAL_TURNS);
  }

  async function saveHistory(msgs: Message[], card: ScoreBreakdown) {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "users", user.uid, "interviews"), {
        config: cfg,
        messages: msgs,
        scorecard: card,
        duration: INTERVIEW_SECS - timeLeft,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("[MockInterview]", e);
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setPhase("setup");
    setMessages([]);
    setTurns(0);
    setTimeLeft(INTERVIEW_SECS);
    setTimedOut(false);
    setScorecard(null);
    setInput("");
    setIsTyping(false);
    setAiLoading(false);
    setEvaluating(false);
    setAiError(null);
  }

  const isWarn = timeLeft <= 5 * 60 && phase === "interview";
  const canSend =
    !!input.trim() && !aiLoading && !isTyping && !aiError && !timedOut;
  const answered = messages.filter((m) => m.role === "user").length;

  return (
    <PageGuard
      loading={loading || !user || !progress}
      ready={!!progress}
      isPro={progress?.isPro}
      proReason="AI Mock Interview is a Pro feature. Upgrade to practice with a real AI interviewer."
    >
      <div css={page}>
        {/* ── SETUP ── */}
        {phase === "setup" && (
          <div css={setupWrap}>
            <button css={backBtn} onClick={() => router.push("/home")}>
              <ChevronLeft size={15} />
              Back
            </button>
            <h1 css={setupTitle}>Mock Interview</h1>
            <p css={setupSub}>
              Configure your session. Questions are tailored to your role and level.
              Company styles are AI approximations, not real interview questions.
            </p>

            <div style={{ marginBottom: "1.5rem" }}>
              <label css={fieldLabel}>Role</label>
              <div css={chipGrid(3)}>
                {ROLES.map((r) => (
                  <button
                    key={r}
                    css={chip(cfg.role === r)}
                    onClick={() => setCfg((c) => ({ ...c, role: r }))}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label css={fieldLabel}>Experience Level</label>
              <div css={chipGrid(4)}>
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    css={chip(cfg.experience === l.value)}
                    onClick={() =>
                      setCfg((c) => ({ ...c, experience: l.value }))
                    }
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label css={fieldLabel}>Target Company</label>
              <div css={chipGrid(5)}>
                {COMPANIES.map((co) => (
                  <button
                    key={co}
                    css={chip(cfg.company === co)}
                    onClick={() => setCfg((c) => ({ ...c, company: co }))}
                  >
                    {co}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label css={fieldLabel}>Focus Area</label>
              <div css={chipGrid(3)}>
                {FOCUS_AREAS.map((f) => (
                  <button
                    key={f}
                    css={chip(cfg.focus === f)}
                    onClick={() => setCfg((c) => ({ ...c, focus: f }))}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div css={warnBanner}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                <strong>Answers lock on submit.</strong> No editing once sent ,
                exactly like a real interview. 25 min limit, {TOTAL_TURNS}{" "}
                exchanges.
              </span>
            </div>

            <button css={startBtn} onClick={startInterview}>
              Begin Interview
            </button>
          </div>
        )}

        {/* ── INTERVIEW ── */}
        {phase === "interview" && (
          <div css={ivWrap}>
            <div css={topBar}>
              <div css={ivTitle}>
                Interview <span css={coTag}>{cfg.company}</span>
              </div>
              <div css={topRight}>
                <span css={turnPill}>
                  {turns}/{TOTAL_TURNS} turns
                </span>
                <div css={isWarn ? timerWarn : timerNorm}>
                  <Clock size={11} />
                  {fmt(timeLeft)}
                </div>
              </div>
            </div>

            <div css={pgTrack}>
              <div css={pgFill((turns / TOTAL_TURNS) * 100)} />
            </div>

            <div css={msgs}>
              {messages.map((m, i) => (
                <div key={i} css={msgRow(m.role === "user")}>
                  <div css={ava(m.role === "user")}>
                    {m.role === "assistant" ? "AI" : "YOU"}
                  </div>
                  <div css={bubble(m.role === "user")}>{m.content}</div>
                </div>
              ))}
              {isTyping && (
                <div css={msgRow(false)}>
                  <div css={ava(false)}>AI</div>
                  <div css={typingWrap}>
                    <span css={dot("0s")} />
                    <span css={dot(".2s")} />
                    <span css={dot(".4s")} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div>
              {aiError && (
                <AIErrorNotice message={aiError} onRetry={retryLastRequest} />
              )}
              {aiError && isFinalStep && (
                <button css={backBtn} onClick={() => setPhase("ended")}>
                  End without a score
                </button>
              )}
              <div css={inputRow}>
                <textarea
                  ref={taRef}
                  value={input}
                  onChange={handleTA}
                  disabled={aiLoading || isTyping || timedOut}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendAnswer();
                    }
                  }}
                  rows={2}
                  placeholder={
                    timedOut
                      ? "Time's up"
                      : isTyping
                        ? "Interviewer is typing…"
                        : "Type your answer… (Enter to send, Shift+Enter for new line)"
                  }
                  css={inputBox(aiLoading || isTyping || timedOut)}
                />
                <button
                  css={sendBtn(canSend)}
                  onClick={sendAnswer}
                  disabled={!canSend}
                >
                  <Send size={14} />
                </button>
              </div>
              <p css={lockNote}>
                <AlertCircle size={9} />
                Answers lock on submit, no editing
              </p>
            </div>
          </div>
        )}

        {/* ── EVALUATING overlay ── */}
        {evaluating && (
          <div css={evalOverlay}>
            <div css={evalDisk} />
            <div css={evalTitle}>Evaluating your performance…</div>
            <div css={evalSub}>Generating your scorecard</div>
          </div>
        )}

        {/* ── RESULT — delegated to InterviewResult ── */}
        {phase === "result" && scorecard && (
          <InterviewResult
            scorecard={scorecard}
            config={cfg}
            topics={topics}
            saving={saving}
            onRetake={reset}
            note={
              timedOut
                ? `Time ran out, so this score is based on ${answered} of ${TOTAL_TURNS} answers.`
                : undefined
            }
          />
        )}

        {/* ── ENDED without a score ── */}
        {phase === "ended" && (
          <div css={setupWrap}>
            <h1 css={setupTitle}>Interview ended</h1>
            <p css={setupSub}>
              {answered === 0
                ? "Time ran out before you answered a question, so there's nothing to score."
                : "We couldn't score your answers, so this interview has no result."}
            </p>
            <button css={startBtn} onClick={reset}>
              Start a new interview
            </button>
          </div>
        )}
      </div>
    </PageGuard>
  );
}

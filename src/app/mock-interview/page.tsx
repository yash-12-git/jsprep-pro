/** @jsxImportSource @emotion/react */
"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import PageGuard from "@/components/ui/PageGuard";
import {
  Send,
  Loader2,
  Mic,
  RotateCcw,
  ChevronLeft,
  CheckCircle,
} from "lucide-react";
import * as S from "./styles";
import * as Shared from "@/styles/shared";
import { C } from "@/styles/tokens";

interface Message {
  role: "user" | "assistant";
  content: string;
}
type Phase = "intro" | "interview" | "done";

export default function MockInterviewPage() {
  const { user, progress, loading } = useAuth();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startInterview() {
    setPhase("interview");
    setAiLoading(true);
    setMessages([]);
    setTurnCount(0);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mock",
          messages: [{ role: "user", content: "Start the interview." }],
          context: {},
        }),
      });
      const data = await res.json();
      setMessages([{ role: "assistant", content: data.text }]);
    } catch {
      setMessages([
        {
          role: "assistant",
          content: "Sorry, failed to start. Please try again.",
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  }

  async function sendAnswer() {
    if (!input.trim() || aiLoading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setAiLoading(true);
    const newTurn = turnCount + 1;
    setTurnCount(newTurn);
    if (newTurn >= 8) {
      setPhase("done");
      setAiLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mock",
          messages: newMessages,
          context: {},
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text },
      ]);
      if (data.text.toLowerCase().includes("overall feedback"))
        setPhase("done");
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error, please try again." },
      ]);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <PageGuard
      loading={loading || !user || !progress}
      ready={!!progress}
      isPro={progress?.isPro}
      proReason="AI Mock Interview is a Pro feature. Upgrade to practice with a real AI interviewer!"
    >
      <>
        <div css={Shared.pageWrapper}>
          {/* Back button */}
          <button
            css={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              color: C.muted,
              fontSize: "0.875rem",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: "1.5rem",
              transition: "color 0.12s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            onClick={() => router.push("/dashboard")}
          >
            <ChevronLeft size={16} /> Back to Questions
          </button>

          {/* ── Intro ── */}
          {phase === "intro" && (
            <div css={S.startCard}>
              <div css={S.header}>
                <div css={S.iconBox}>
                  <Mic size={24} color={C.accent} />
                </div>
                <h1 css={S.title}>AI Mock Interview</h1>
                <p css={S.subtitle}>
                  A senior frontend engineer will interview you with real JS
                  questions, follow-ups, and edge cases — just like the actual
                  thing. 8 exchanges, honest feedback at the end.
                </p>
              </div>
              <div css={{ textAlign: "left", marginBottom: "2rem" }}>
                <p
                  css={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: "1rem",
                  }}
                >
                  What to expect:
                </p>
                <div css={S.topicGrid}>
                  {[
                    "🎯 One question at a time — answer naturally",
                    "🔍 AI probes deeper based on your answer",
                    "⚡ ~8 back-and-forth exchanges total",
                    "📊 Honest feedback at the end",
                    "💡 Answer like you would out loud",
                    "🎤 No right/wrong format required",
                  ].map((tip) => (
                    <div key={tip} css={S.topicItem}>
                      <CheckCircle
                        size={13}
                        color={C.green}
                        style={{ flexShrink: 0 }}
                      />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
              <button
                css={Shared.primaryBtn(C.accent)}
                onClick={startInterview}
                style={{ fontSize: "1rem", padding: "1rem" }}
              >
                Start Interview
              </button>
            </div>
          )}

          {/* ── Interview / Done ── */}
          {(phase === "interview" || phase === "done") && (
            <div>
              <div
                css={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <h2
                  css={{
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    color: C.text,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Mock Interview
                </h2>
                <div
                  css={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    css={{
                      fontSize: "0.75rem",
                      color: C.muted,
                      fontFamily: "monospace",
                    }}
                  >
                    {turnCount}/8 turns
                  </span>
                  <div css={Shared.progressBarTrack} style={{ width: "5rem" }}>
                    <div css={Shared.progressBarFill((turnCount / 8) * 100)} />
                  </div>
                </div>
              </div>

              <div css={S.chatWindow}>
                <div css={S.messagesArea}>
                  {messages.map((msg, i) => (
                    <div key={i} css={S.messageRow(msg.role === "user")}>
                      <div css={S.avatar(msg.role === "user")}>
                        {msg.role === "assistant" ? (
                          <Mic size={13} color={C.accent} />
                        ) : (
                          <span
                            css={{
                              fontSize: "0.625rem",
                              fontWeight: 600,
                              color: C.muted,
                            }}
                          >
                            You
                          </span>
                        )}
                      </div>
                      <div css={S.bubble(msg.role === "user")}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div css={S.messageRow(false)}>
                      <div css={S.avatar(false)}>
                        <Mic size={13} color={C.accent} />
                      </div>
                      <div css={S.bubble(false)}>
                        <Loader2
                          size={14}
                          color={C.accent}
                          css={{ animation: "spin 1s linear infinite" }}
                        />
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {phase === "interview" && (
                  <div css={S.inputArea}>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendAnswer();
                        }
                      }}
                      placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
                      css={S.input}
                    />
                    <button
                      css={S.sendBtn}
                      onClick={sendAnswer}
                      disabled={!input.trim() || aiLoading}
                    >
                      <Send size={14} color={C.accentText} />
                    </button>
                  </div>
                )}
              </div>

              {phase === "done" && (
                <div
                  css={[
                    Shared.card,
                    {
                      padding: "1.5rem",
                      textAlign: "center",
                      marginTop: "1rem",
                      borderColor: C.greenBorder,
                    },
                  ]}
                >
                  <div css={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    🎉
                  </div>
                  <p
                    css={{
                      fontWeight: 700,
                      fontSize: "1.125rem",
                      color: C.text,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Interview Complete!
                  </p>
                  <p
                    css={{
                      color: C.muted,
                      fontSize: "0.875rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    Check the AI feedback above. Ready to go again?
                  </p>
                  <div
                    css={{
                      display: "flex",
                      gap: "0.75rem",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      css={Shared.primaryBtn(C.accent)}
                      style={{ width: "auto", padding: "0.625rem 1.5rem" }}
                      onClick={() => {
                        setPhase("intro");
                        setMessages([]);
                        setTurnCount(0);
                      }}
                    >
                      <RotateCcw size={14} /> Try Again
                    </button>
                    <button
                      css={Shared.ghostBtn}
                      onClick={() => router.push("/study-plan")}
                    >
                      View Study Plan
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </>
    </PageGuard>
  );
}

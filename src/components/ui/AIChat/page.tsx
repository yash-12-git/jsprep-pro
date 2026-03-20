/** @jsxImportSource @emotion/react */
"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, X } from "lucide-react";
import * as S from "./styles";
import { C } from "@/styles/tokens";

interface Message {
  role: "user" | "assistant";
  content: string;
}
interface Props {
  question: string;
  answer: string;
  onClose: () => void;
}

const quickPrompts = [
  "Explain it simpler",
  "Show a React example",
  "What are the edge cases?",
  "How is this tested in interviews?",
];

export default function AIChat({ question, answer, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm your AI tutor for this question. Ask me anything — a simpler explanation, a real-world example, edge cases, or how this relates to React.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "qa",
          messages: newMessages,
          context: { question, answer: answer.replace(/<[^>]*>/g, "") },
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div css={S.wrapper}>
      {/* Header */}
      <div css={S.header}>
        <div css={S.headerLeft}>
          <div css={S.headerIcon}>
            <Sparkles size={12} color={C.accentText} />
          </div>
          <span css={S.headerTitle}>AI Tutor</span>
          <span css={S.headerSub}>— Ask anything about this question</span>
        </div>
        <button css={S.closeBtn} onClick={onClose}>
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div css={S.messages}>
        {messages.map((msg, i) => (
          <div key={i} css={S.messageRow(msg.role === "user")}>
            <div css={S.avatarBubble(msg.role === "user")}>
              {msg.role === "assistant" ? (
                <Bot size={12} color={C.accentText} />
              ) : (
                <User size={12} color={C.muted} />
              )}
            </div>
            <div css={S.messageBubble(msg.role === "user")}>{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div css={S.loadingBubble}>
            <div css={S.avatarBubble(false)}>
              <Bot size={12} color={C.accentText} />
            </div>
            <div css={[S.messageBubble(false), { padding: "0.5rem 0.75rem" }]}>
              <Loader2
                size={12}
                color={C.accentText}
                css={{ animation: "spin 1s linear infinite" }}
              />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div css={S.quickPrompts}>
        {quickPrompts.map((p) => (
          <button key={p} css={S.promptChip} onClick={() => setInput(p)}>
            {p}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div css={S.inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Ask a follow-up question…"
          css={S.input}
        />
        <button
          css={S.sendBtn}
          onClick={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Send size={12} color="#ffffff" />
        </button>
      </div>
    </div>
  );
}

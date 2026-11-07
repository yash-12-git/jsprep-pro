/** @jsxImportSource @emotion/react */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { css } from "@emotion/react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PageGuard from "@/components/ui/PageGuard";
import { track } from "@/lib/analytics";
import {
  getReferralStatus,
  referralLink,
  sendFeedback,
  type Grant,
  type ReferralStatus,
} from "@/lib/rewardsClient";
import {
  FEEDBACK_LIMITS,
  FOUND_VIA,
  PREPARING_FOR,
  type FeedbackAnswers,
} from "@/lib/feedbackOptions";
import * as Shared from "@/styles/shared";
import { C, RADIUS } from "@/styles/tokens";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export default function EarnProClient() {
  const { user, progress, loading, refreshProgress } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<ReferralStatus | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastGrant, setLastGrant] = useState<Grant | null>(null);

  const [answers, setAnswers] = useState<FeedbackAnswers>({
    foundVia: "",
    preparingFor: "",
    recommend: -1,
    mostUseful: "",
    missing: "",
  });
  const [sending, setSending] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth?next=/earn-pro");
  }, [user, loading, router]);

  const loadStatus = useCallback(() => {
    setStatusError(null);
    getReferralStatus()
      .then(setStatus)
      .catch((err: Error) => setStatusError(err.message));
  }, []);

  useEffect(() => {
    if (user) loadStatus();
  }, [user, loadStatus]);

  const link = status ? referralLink(status.code) : "";
  const shareText = `I've been preparing for frontend interviews on JSPrep Pro. Open my link, continue with Google and finish one Interview Sprint, and we both get 2 weeks of Pro free: ${link}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      track("referral_shared", { channel: "copy" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; the link is still visible to select by hand.
    }
  }

  async function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setFeedbackError(null);
    try {
      const grant = await sendFeedback(answers);
      setLastGrant(grant);
      setStatus((s) =>
        s
          ? "bankedDays" in grant
            ? { ...s, feedbackDone: true, bankedProDays: s.bankedProDays + grant.bankedDays }
            : { ...s, feedbackDone: true, promoProUntil: grant.promoProUntil }
          : s,
      );
      track("feedback_submitted", { recommend: answers.recommend });
      refreshProgress().catch(() => {});
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  const missingLength = answers.missing.trim().length;
  const formReady =
    answers.foundVia &&
    answers.preparingFor &&
    answers.recommend >= 0 &&
    missingLength >= FEEDBACK_LIMITS.min;

  const promoActive = status?.promoProUntil && new Date(status.promoProUntil) > new Date();
  const renewing = Boolean(status?.renewing);

  return (
    <PageGuard loading={loading || !user || !progress} ready={!!progress}>
      <div css={Shared.pageWrapper}>
        <h1 css={Shared.pageTitleText}>Get Pro free</h1>
        <p css={[Shared.pageSubtitleText, { marginBottom: "1rem" }]}>
          Help us grow and we&apos;ll give you Pro. Earned days add to any Pro
          you already have.
        </p>
        {renewing ? (
          <p css={notice(C.green)}>
            You&apos;re on Pro, so days you earn are saved and start when your
            subscription ends.
            {status!.bankedProDays > 0 &&
              ` You have ${status!.bankedProDays} days saved` +
                (promoActive ? `, which take Pro to ${formatDate(status!.promoProUntil!)}.` : ".")}
          </p>
        ) : (
          promoActive && (
            <p css={notice(C.green)}>
              You have free Pro until {formatDate(status!.promoProUntil!)}.
            </p>
          )
        )}

        {/* ── Invite ── */}
        <section css={[Shared.card, section]} aria-labelledby="invite-title">
          <h2 id="invite-title" css={sectionTitle}>
            Invite friends: 2 weeks each
          </h2>
          <ol css={steps}>
            <li>Share your link with a friend.</li>
            <li>
              They open it and choose Continue with Google. That creates their
              free account; there&apos;s no separate sign-up form.
            </li>
            <li>
              They finish one Interview Sprint, answering at least one
              question.
            </li>
            <li>You both get 2 weeks of Pro, added automatically.</li>
          </ol>
          <p css={[body, { marginTop: "0.5rem" }]}>
            It counts for new accounts only, up to {status?.max ?? 10} friends.
          </p>

          {!status && !statusError && (
            <p css={[body, { marginTop: "1rem" }]} role="status">
              Loading your invite link…
            </p>
          )}
          {statusError && (
            <div css={errorRow} role="alert">
              <p css={[notice(C.red), { margin: 0 }]}>{statusError}</p>
              <button css={[Shared.ghostBtn, { width: "auto" }]} onClick={loadStatus}>
                <RefreshCw size={14} /> Try again
              </button>
            </div>
          )}

          {status && (
            <>
              <div css={linkRow}>
                <input css={linkInput} value={link} readOnly aria-label="Your invite link" onFocus={(e) => e.target.select()} />
                <button css={[Shared.primaryBtn(C.accent), { width: "auto" }]} onClick={copyLink}>
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div css={shareRow}>
                <a
                  css={Shared.ghostBtn}
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("referral_shared", { channel: "whatsapp" })}
                >
                  WhatsApp
                </a>
                <a
                  css={Shared.ghostBtn}
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("referral_shared", { channel: "linkedin" })}
                >
                  LinkedIn
                </a>
                <a
                  css={Shared.ghostBtn}
                  href={`https://x.com/intent/post?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("referral_shared", { channel: "x" })}
                >
                  X
                </a>
              </div>
              <p css={[body, { marginTop: "0.75rem" }]}>
                {status.rewarded} of {status.max} invite rewards earned.
              </p>
            </>
          )}
        </section>

        {/* ── Feedback ── */}
        <section css={[Shared.card, section]} aria-labelledby="feedback-title">
          <h2 id="feedback-title" css={sectionTitle}>
            Tell us what to improve: 1 week free
          </h2>

          {status?.feedbackDone ? (
            <p css={body} role="status">
              {lastGrant && "bankedDays" in lastGrant
                ? "Thanks for your feedback. Your free week is saved and starts when your subscription ends."
                : "Thanks for your feedback. Your free week is added."}{" "}
              Feedback earns Pro once per account.
            </p>
          ) : (
            <form onSubmit={submitFeedback} css={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p css={body}>Five quick questions. Honest answers help most.</p>

              <label css={field}>
                <span css={label}>How did you find JSPrep Pro?</span>
                <select
                  css={input}
                  value={answers.foundVia}
                  required
                  onChange={(e) => setAnswers((a) => ({ ...a, foundVia: e.target.value }))}
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  {FOUND_VIA.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>

              <label css={field}>
                <span css={label}>What are you preparing for?</span>
                <select
                  css={input}
                  value={answers.preparingFor}
                  required
                  onChange={(e) => setAnswers((a) => ({ ...a, preparingFor: e.target.value }))}
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  {PREPARING_FOR.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>

              <fieldset css={{ border: "none", padding: 0, margin: 0 }}>
                <legend css={label}>How likely are you to recommend JSPrep Pro to a friend?</legend>
                <div css={scale}>
                  {Array.from({ length: 11 }, (_, n) => (
                    <button
                      type="button"
                      key={n}
                      css={scaleBtn(answers.recommend === n)}
                      aria-pressed={answers.recommend === n}
                      onClick={() => setAnswers((a) => ({ ...a, recommend: n }))}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div css={scaleEnds}>
                  <span>Not likely</span>
                  <span>Very likely</span>
                </div>
              </fieldset>

              <label css={field}>
                <span css={label}>What has been most useful? (optional)</span>
                <textarea
                  css={[Shared.textarea(), textareaFix]}
                  rows={3}
                  maxLength={FEEDBACK_LIMITS.max}
                  value={answers.mostUseful}
                  onChange={(e) => setAnswers((a) => ({ ...a, mostUseful: e.target.value }))}
                />
              </label>

              <label css={field}>
                <span css={label}>What&apos;s missing, confusing or frustrating?</span>
                <textarea
                  css={[Shared.textarea(), textareaFix]}
                  rows={4}
                  maxLength={FEEDBACK_LIMITS.max}
                  required
                  value={answers.missing}
                  onChange={(e) => setAnswers((a) => ({ ...a, missing: e.target.value }))}
                />
                <span css={[label, { marginTop: "0.25rem" }]}>
                  {missingLength < FEEDBACK_LIMITS.min
                    ? `${FEEDBACK_LIMITS.min - missingLength} more characters needed`
                    : "Thanks, that's enough to act on."}
                </span>
              </label>

              {feedbackError && <p css={notice(C.red)}>{feedbackError}</p>}
              <button type="submit" css={Shared.primaryBtn(C.accent)} disabled={!formReady || sending}>
                {sending ? "Sending…" : "Send feedback and get a free week"}
              </button>
            </form>
          )}
        </section>
      </div>
    </PageGuard>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const section = css`
  padding: 1.25rem;
  margin-top: 1rem;
`;

const sectionTitle = css`
  font-size: 1rem;
  font-weight: 500;
  color: ${C.text};
  margin: 0 0 0.5rem;
`;

const body = css`
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${C.muted};
  margin: 0;
`;

const notice = (color: string) => css`
  font-size: 0.875rem;
  color: ${color};
  margin: 0 0 0.5rem;
`;

const steps = css`
  margin: 0.25rem 0 0;
  padding-left: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${C.muted};
  li + li {
    margin-top: 0.25rem;
  }
  li::marker {
    color: ${C.accent};
  }
`;

const errorRow = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  margin-top: 1rem;
`;

const linkRow = css`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

// 1rem so mobile Safari doesn't zoom in on focus.
const input = css`
  width: 100%;
  min-width: 0;
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

const linkInput = css`
  ${input};
  flex: 1;
  font-size: 0.9375rem;
`;

const shareRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const field = css`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const label = css`
  font-size: 0.8125rem;
  color: ${C.muted};
  margin-bottom: 0.375rem;
`;

const textareaFix = css`
  font-family: inherit;
  font-size: 1rem;
`;

const scale = css`
  display: grid;
  grid-template-columns: repeat(11, minmax(0, 1fr));
  gap: 0.25rem;
`;

const scaleBtn = (on: boolean) => css`
  padding: 0.5rem 0;
  font-size: 0.875rem;
  border-radius: ${RADIUS.md};
  border: 1px solid ${on ? C.accent : C.border};
  background: ${on ? C.accentSubtle : "transparent"};
  color: ${on ? C.accentText : C.muted};
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid ${C.accent};
    outline-offset: 1px;
  }
`;

const scaleEnds = css`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${C.muted};
  margin-top: 0.25rem;
`;

import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo/seo";
import { LEGAL } from "@/lib/legal";
import { ContactEmail, LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description: "What JSPrep Pro collects, why, who it is shared with, and how to access or delete your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lede={`JSPrep Pro is run by ${LEGAL.operator}, based in ${LEGAL.location}, India. This page explains what data the service uses and what you can do about it.`}
    >
      <h2>What we collect</h2>
      <ul>
        <li><strong>Account details:</strong> your name, email address, profile photo and account ID from Google when you sign in.</li>
        <li><strong>Learning activity:</strong> questions you mastered, solved, revealed or bookmarked, quiz and sprint scores, XP, streaks, study plan inputs, and saved mock interviews including your answers.</li>
        <li><strong>Feedback and invites:</strong> the answers you give in the feedback form, your invite code, who invited you if you signed up through an invite link, and the free Pro you have earned. We use feedback to improve the service and don&apos;t publish it.</li>
        <li><strong>Interviews you log:</strong> the round, date, outcome, topics and notes you enter, and the company name if you add one. The company name is only shown to you and is not sent to the AI. If you tick the sharing box on an entry, we may use its round, topics and notes, without your name or contact details, to build interview guides for other candidates.</li>
        <li><strong>Subscription details:</strong> plan status, dates, and Razorpay payment and subscription IDs. Razorpay handles your card or UPI details, and we don&apos;t receive or store them.</li>
        <li><strong>Answers you submit to AI features:</strong> your written answers, code, and chat or interview messages, so they can be evaluated.</li>
        <li><strong>Usage and device data:</strong> pages visited, clicks, approximate location and device information from analytics tools, and your IP address when requests reach our servers.</li>
        <li><strong>Saved in your browser:</strong> theme, selected track, roadmap progress and Question of the Day status.</li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To provide the service, save your progress and generate AI feedback.</li>
        <li>To process subscriptions and give you the access you paid for.</li>
        <li>To enforce AI usage limits and prevent abuse. Limits for signed-out visitors use a one-way hash of the IP address rather than the address itself.</li>
        <li>To understand how the product is used, and to fix problems.</li>
        <li>To respond to you when you contact us.</li>
      </ul>
      <p>We don&apos;t sell your personal data, and we don&apos;t show third-party ads.</p>

      <h2>Who we share it with</h2>
      <p>These providers process data so the service can run:</p>
      <ul>
        <li><strong>Google Firebase:</strong> sign-in and database.</li>
        <li><strong>Vercel:</strong> website hosting and server logs.</li>
        <li><strong>Razorpay:</strong> payments. Your name and email are passed to checkout.</li>
        <li><strong>Groq:</strong> the AI model provider. It receives the answers and messages you submit to AI features, along with the related question, so please don&apos;t include personal or confidential information in them.</li>
        <li><strong>Google Analytics:</strong> usage analytics.</li>
        <li><strong>Microsoft Clarity:</strong> usage analytics, including session replays and heatmaps showing how pages are used.</li>
      </ul>
      <p>
        These providers may process data outside India, including in the United
        States. We may also disclose information if the law requires it.
      </p>

      <h2>Cookies and browser storage</h2>
      <p>
        We use a cookie for your selected track and browser storage for sign-in
        and preferences. Google Analytics and Microsoft Clarity also set their
        own cookies or similar identifiers. You can block or clear these in your
        browser, though some features may stop working.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep account and learning data while your account is active, and
        delete it when you ask us to, unless we must keep certain records, such
        as payment records, to meet legal or accounting duties. Analytics and
        provider data follow those providers&apos; own retention settings.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask to access, correct or delete your personal data, or withdraw
        consent, by emailing <ContactEmail />. There&apos;s no self-service
        account deletion yet, so we handle these requests by email. We aim to
        reply within 30 days. If you&apos;re subscribed, cancel your plan first
        so that renewals stop.
      </p>

      <h2>Security and children</h2>
      <p>
        We use access controls and encrypted connections, but no online service
        can guarantee complete security. JSPrep Pro is intended for people aged
        18 or over, and isn&apos;t designed for children.
      </p>

      <h2>Changes and contact</h2>
      <p>
        We&apos;ll update this page when our practices change, and revise the
        date above. For privacy questions or complaints, contact{" "}
        {LEGAL.operator} at <ContactEmail />.
      </p>
    </LegalPage>
  );
}

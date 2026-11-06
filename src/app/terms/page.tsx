import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo/seo";
import { LEGAL } from "@/lib/legal";
import { ContactEmail, LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMeta({
  title: "Terms of Service",
  description: "The terms for using JSPrep Pro, including accounts, subscriptions, AI feedback and acceptable use.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lede={`JSPrep Pro is run by ${LEGAL.operator}, based in ${LEGAL.location}, India. By using the service, you agree to these terms.`}
    >
      <h2>Using JSPrep Pro</h2>
      <p>
        JSPrep Pro provides frontend interview practice, explanations and AI
        feedback. You must be at least 18, and are responsible for activity on
        your account, which uses your Google sign-in.
      </p>

      <h2>Free and Pro plans</h2>
      <p>
        Some features are free, and others need a Pro subscription. See{" "}
        <Link className="link" href="/pricing">Pricing</Link> for what each
        plan includes and the current price. Features may change as the product
        develops.
      </p>

      <h2>Payment and renewal</h2>
      <p>
        Pro is a monthly subscription, charged through Razorpay using the
        payment method you authorise, and renews automatically until you cancel.
        If a renewal fails, Pro access may end after a short grace period. The
        amount you are charged is shown at checkout.
      </p>

      <h2>Cancellation and refunds</h2>
      <p>
        You can cancel from your dashboard at any time. You keep Pro until the
        end of the period you paid for, and no further renewal is charged. Our{" "}
        <Link className="link" href="/refunds">Cancellation &amp; Refunds</Link>{" "}
        page explains when refunds apply.
      </p>

      <h2>AI feedback and no guarantee of outcomes</h2>
      <p>
        AI scores, feedback, study plans and mock interviews are generated
        automatically for practice, and can be wrong or incomplete. Check
        anything important yourself. Mock interview company styles are AI
        approximations, not real interview questions. We don&apos;t guarantee
        that you&apos;ll pass an interview or receive a job offer.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Scrape, copy or resell the content, or extract it to build a competing product.</li>
        <li>Share Pro access, or bypass payment, limits or security controls.</li>
        <li>Disrupt the service, or misuse its AI features for anything unrelated to interview practice.</li>
        <li>Use the service during a real interview or assessment where that isn&apos;t allowed.</li>
        <li>Submit anything unlawful, or that you don&apos;t have the right to share.</li>
      </ul>
      <p>
        We may limit, suspend or end access for breaches of these terms. If you
        paid and we end your access without a breach on your part, we&apos;ll
        refund the unused part of your current period.
      </p>

      <h2>Content</h2>
      <p>
        JSPrep Pro and its content belong to us or our licensors, and you may
        use them for your personal interview preparation. You keep ownership of
        what you submit, and allow us to process it to provide the service. See
        our <Link className="link" href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Service availability and liability</h2>
      <p>
        We work to keep the service running and accurate, but provide it “as
        is”, without a guarantee that it will be uninterrupted or free of
        errors. As far as the law allows, we aren&apos;t liable for indirect or
        consequential losses, such as lost job opportunities, and our total
        liability is limited to what you paid us in the 3 months before the
        claim. Nothing here removes rights that you have under applicable
        consumer law.
      </p>

      <h2>Changes, governing law and contact</h2>
      <p>
        We may update these terms, and will revise the date above. Continuing to
        use the service means you accept the changes. These terms are governed
        by the laws of India, and disputes are subject to the courts of{" "}
        {LEGAL.location}. Questions? Email <ContactEmail />.
      </p>
    </LegalPage>
  );
}

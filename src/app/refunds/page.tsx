import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo/seo";
import { LEGAL } from "@/lib/legal";
import { ContactEmail, LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMeta({
  title: "Cancellation & Refunds",
  description: `How to cancel JSPrep Pro, and when refunds apply, including the ${LEGAL.refundWindowDays}-day refund on your first payment.`,
  path: "/refunds",
});

export default function RefundsPage() {
  return (
    <LegalPage
      title="Cancellation & Refunds"
      lede="You can cancel any time, and you won't be charged again after that."
    >
      <h2>Cancelling</h2>
      <p>
        Open your dashboard, go to your subscription, and cancel. You keep Pro
        until the end of the period you&apos;ve paid for, and no further renewal
        is charged. If you have trouble, email <ContactEmail />.
      </p>

      <h2>Refunds</h2>
      <p>We&apos;ll refund you in these cases:</p>
      <ul>
        <li><strong>First payment:</strong> a full refund if you ask within {LEGAL.refundWindowDays} days of your first Pro payment.</li>
        <li><strong>Duplicate charges:</strong> any charge taken by mistake.</li>
        <li><strong>Major service failure:</strong> if a paid feature was unavailable for a significant part of a period you paid for, we&apos;ll refund or credit that period fairly.</li>
      </ul>
      <p>
        Other renewal payments aren&apos;t normally refundable, so please cancel
        before your renewal date. This doesn&apos;t affect any rights you have
        under applicable law.
      </p>

      <h2>How to request one</h2>
      <p>
        Email <ContactEmail /> from your account email, with the payment date or
        Razorpay payment ID. We aim to reply within 3 business days. Approved
        refunds go back to your original payment method through Razorpay, which
        usually takes 5 to 7 business days, depending on your bank.
      </p>

      <h2>Delivery</h2>
      <p>
        JSPrep Pro is a digital service, so nothing is shipped. Pro normally
        activates right after payment. If it doesn&apos;t appear within a few
        minutes, refresh the page or contact us.
      </p>
    </LegalPage>
  );
}

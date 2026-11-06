import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo/seo";
import { LEGAL } from "@/lib/legal";
import { ContactEmail, LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: "Contact JSPrep Pro for support, billing, refunds, privacy requests or feedback.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact"
      lede="For help with your account, billing, refunds, privacy requests or feedback, email us."
      showUpdated={false}
    >
      <h2>Email</h2>
      <p>
        <ContactEmail />. We aim to reply within 3 business days. For payment
        issues, please include your account email and the payment date.
      </p>

      <h2>Who runs JSPrep Pro</h2>
      <p>
        {LEGAL.operator}
        <br />
        {LEGAL.location}, India
      </p>
    </LegalPage>
  );
}

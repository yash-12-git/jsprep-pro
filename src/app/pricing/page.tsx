import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo/seo";
import { getPricingForCountry } from "@/lib/pricing";
import { FREE_F, proFeatures } from "@/data/homepageStaticData";
import { LegalPage } from "@/components/legal/LegalPage";

const PRO = getPricingForCountry("IN");

export const metadata: Metadata = pageMeta({
  title: "Pricing",
  description: `What's included in JSPrep Pro's Free and Pro plans. Pro is ${PRO.label}, and you can cancel any time.`,
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <LegalPage
      title="Pricing"
      lede="Start free with no card. Upgrade if you want every question and the AI tools."
      showUpdated={false}
    >
      <h2>Free: {PRO.isFree}</h2>
      <ul>
        {FREE_F.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <h2>Pro: {PRO.label}</h2>
      <ul>
        {proFeatures.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <p>
        Pro renews monthly until you cancel, and you keep access until the end
        of the period you paid for. The amount you are charged is shown at
        checkout. See{" "}
        <Link className="link" href="/refunds">Cancellation &amp; Refunds</Link>.
        AI features have fair-use daily limits.
      </p>

      <div className="doc-actions">
        <Link className="btn btn--primary" href="/#pricing">
          Get started
        </Link>
      </div>
    </LegalPage>
  );
}

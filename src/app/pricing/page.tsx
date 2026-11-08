import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo/seo";
import { headers } from "next/headers";
import { getBilledPricing } from "@/lib/pricing";
import { FREE_F, proFeatures } from "@/data/homepageStaticData";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMeta({
  title: "Pricing",
  // No price here: search crawlers mostly browse from the US, so a price in the
  // snippet would often differ from what the reader is charged.
  description:
    "What's included in JSPrep Pro's Free and Pro plans. Pro is a monthly plan you can cancel any time.",
  path: "/pricing",
});

// The price this visitor will actually be charged, from their IP country, so
// it matches checkout (see getBilledPricing).
export default async function PricingPage() {
  const h = await headers();
  const PRO = getBilledPricing(
    h.get("x-vercel-ip-country") || h.get("cf-ipcountry"),
  );
  return (
    <LegalPage
      title="Pricing"
      lede="Every question is free, no card needed. Upgrade for AI feedback on every answer, unlimited mock interviews and your full study plan."
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

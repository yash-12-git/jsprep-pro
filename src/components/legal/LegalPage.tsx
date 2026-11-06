// Shared layout for the legal and company pages.

import type { ReactNode } from "react";
import { LEGAL } from "@/lib/legal";
import { DocHero } from "@/components/seo/DocParts";

export function LegalPage({
  title,
  lede,
  showUpdated = true,
  children,
}: {
  title: string;
  lede: ReactNode;
  showUpdated?: boolean;
  children: ReactNode;
}) {
  return (
    <main className="doc doc--narrow">
      <DocHero
        title={title}
        lede={lede}
        meta={showUpdated ? <span>Last updated {LEGAL.lastUpdated}</span> : undefined}
      />
      <div className="legal">{children}</div>
    </main>
  );
}

export function ContactEmail() {
  return (
    <a className="link" href={`mailto:${LEGAL.contactEmail}`}>
      {LEGAL.contactEmail}
    </a>
  );
}

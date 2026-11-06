// components/seo/DocParts.tsx
// The parts content pages share. Server-safe: plain markup and the classes in app/content.css.

import Link from "next/link";
import type { ReactNode } from "react";

export function DocHero({
  title,
  lede,
  actions,
  crumbs,
  meta,
}: {
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  crumbs?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <header className="doc-hero">
      {crumbs && <nav aria-label="Breadcrumb" className="doc-crumbs">{crumbs}</nav>}
      <h1 className="doc-h1">{title}</h1>
      {lede && <p className="doc-lede">{lede}</p>}
      {meta && <div className="doc-meta">{meta}</div>}
      {actions && <div className="doc-actions">{actions}</div>}
    </header>
  );
}

export function DocSection({
  title,
  line,
  id,
  children,
}: {
  title: ReactNode;
  line?: ReactNode;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section className="doc-section" id={id}>
      <div className="doc-head">
        <h2 className="doc-h2">{title}</h2>
        {line && <p className="doc-line">{line}</p>}
      </div>
      {children}
    </section>
  );
}

export function LinkGrid({
  items,
}: {
  items: { href: string; title: ReactNode; note?: ReactNode }[];
}) {
  return (
    <div className="doc-links">
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.title}
          {item.note && <small>{item.note}</small>}
        </Link>
      ))}
    </div>
  );
}

export function FaqRows({ items }: { items: { q: ReactNode; a: ReactNode }[] }) {
  return (
    <ul className="doc-rows">
      {items.map((item, i) => (
        <li key={i} className="doc-row">
          <h3 className="doc-h3">{item.q}</h3>
          <p>{item.a}</p>
        </li>
      ))}
    </ul>
  );
}

export function TipSteps({
  items,
}: {
  items: { title: ReactNode; desc: ReactNode }[];
}) {
  return (
    <ol className="doc-steps">
      {items.map((item, i) => (
        <li key={i}>
          <div>
            <h3 className="doc-h3">{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function RelatedLinks({
  items,
}: {
  items: { href: string; text: ReactNode }[];
}) {
  return (
    <ul className="doc-related">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="link">
            {item.text}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function DocClose({
  title,
  line,
  actions,
}: {
  title: ReactNode;
  line?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <section className="doc-close">
      <h2 className="doc-h2">{title}</h2>
      <div>
        {line && <p>{line}</p>}
        <div className="doc-actions">{actions}</div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { SITE } from "@/lib/seo/seo";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refunds", label: "Cancellation & Refunds" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>© 2026 JSPrep Pro</p>
        <nav aria-label="Footer">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}

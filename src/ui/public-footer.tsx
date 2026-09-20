import Image from "next/image";
import Link from "next/link";
import { legalIdentity } from "@/shared/legal-identity";
import { hostedServices } from "@/shared/hosted-services";

const footerGroups = [
  { title: "Services", links: [
    { href: "/payment-services", label: "Payments" },
    { href: "/card-services", label: "Cards" },
  ] },
  { title: "Support", links: [
    { href: "/help", label: "Help center" },
    { href: "/help#access", label: "Sign-in help" },
  ] },
  { title: "Contact", links: [
    { href: hostedServices.payments.contactHref, label: "Payment support" },
    { href: hostedServices.cards.contactHref, label: "Card inquiries" },
  ] },
] as const;

export function PublicFooter() {
  return <footer className="site-footer public-footer">
    <div className="page-container public-footer-main">
      <div className="public-footer-grid">
        <div className="public-footer-brand">
          <Link href="/" className="brand-link" aria-label="Etail Depot home">
            <Image src="/brand/logo.png" alt="Etail Depot" width={800} height={150} sizes="(max-width: 360px) 133px, (max-width: 760px) 155px, (max-width: 1000px) 166px, 182px" className="brand-logo" />
          </Link>
        </div>
        <div className="public-footer-navigation">
          {footerGroups.map(group => <nav className="public-footer-group" aria-label={`Footer ${group.title.toLowerCase()}`} key={group.title}>
            <h2>{group.title}</h2>
            <ul>{group.links.map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
          </nav>)}
        </div>
      </div>
      <div className="public-footer-bottom">
        <div className="public-footer-company">
          <p>© {new Date().getUTCFullYear()} <span className="public-footer-company-name">{legalIdentity.company}</span> All rights reserved.</p>
        </div>
        <nav className="public-footer-legal" aria-label="Footer legal">
          <Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link>
        </nav>
      </div>
    </div>
  </footer>;
}

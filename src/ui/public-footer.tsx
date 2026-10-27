import { BrandImage } from "./brand-image";
import "./brand-images-etail.css";
import Link from "next/link";
import { serviceNavigation, useCaseNavigation } from "@/shared/site-navigation";
import { legalIdentity } from "@/shared/legal-identity";


const footerGroups = [
  { title: "Services", links: serviceNavigation },
  { title: "Use cases", links: useCaseNavigation },
  { title: "Documentation", links: [
    { href: "/docs#merchant-operations", label: "Merchant operations" },
    { href: "/docs#developer-integration", label: "Developer integration" },
  ] },
  { title: "Guides", links: [
    { href: "/guides/iso-20022", label: "ISO 20022" },
    { href: "/guides/iso-8583", label: "ISO 8583" },
  ] },
] as const;

export function PublicFooter() {
  return <footer className="site-footer public-footer">
    <div className="page-container public-footer-main">
      <div className="public-footer-grid">
        <div className="public-footer-brand">
          <Link href="/" className="brand-link" aria-label="Etail Depot home">
            <BrandImage brand="etail" alt="Etail Depot" width={800} height={150} className="brand-logo" />
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
          <Link href="/help">Help center</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link>
        </nav>
      </div>
    </div>
  </footer>;
}

import { BrandImage } from "./brand-image";
import "./brand-images-etail.css";
import Link from "next/link";
import { publicFooterGroups } from "@/shared/site-navigation";
import { legalIdentity } from "@/shared/legal-identity";


export function PublicFooter() {
  return <footer className="site-footer public-footer">
    <div className="page-container public-footer-main">
      <div className="public-footer-navigation">
        {publicFooterGroups.map(group => <nav className="public-footer-group" aria-label={`Footer ${group.label.toLowerCase()}`} key={group.label}>
          <h2>{group.label}</h2>
          <ul>{group.links.map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
        </nav>)}
      </div>
      <div className="public-footer-bottom">
        <div className="public-footer-identity">
          <Link href="/" className="brand-link" aria-label="Etail Depot home">
            <BrandImage brand="etail" alt="Etail Depot" width={800} height={150} className="brand-logo" />
          </Link>
          <div className="public-footer-company">
            <p>© {new Date().getUTCFullYear()} <span className="public-footer-company-name">{legalIdentity.company}</span> All rights reserved.</p>
          </div>
        </div>
        <nav className="public-footer-legal" aria-label="Footer legal">
          <Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link>
        </nav>
      </div>
    </div>
  </footer>;
}

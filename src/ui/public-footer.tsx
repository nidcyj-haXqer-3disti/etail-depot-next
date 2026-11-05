import { BrandImage } from "./brand-image";
import "./brand-images-etail.css";
import Link from "next/link";
import { PaymentPortalLink } from "./service-entry";
import { FooterNavigation } from "./footer-navigation";
import { legalIdentity } from "@/shared/legal-identity";


export function PublicFooter() {
  return <footer className="site-footer public-footer">
    <div className="page-container public-footer-main">
      <FooterNavigation />
      <div className="public-footer-bottom">
        <div className="public-footer-identity">
          <Link prefetch={false} href="/" className="brand-link" aria-label="Etail Depot home">
            <BrandImage brand="etail" alt="Etail Depot" width={800} height={150} className="brand-logo" />
          </Link>
          <div className="public-footer-company">
            <p>© {new Date().getUTCFullYear()} <span className="public-footer-company-name">{legalIdentity.company}</span> All rights reserved.</p>
          </div>
        </div>
        <div className="public-footer-utilities">
          <PaymentPortalLink intent="sign-in" className="public-footer-sign-in" />
          <nav className="public-footer-legal" aria-label="Footer legal">
            <Link prefetch={false} href="/privacy">Privacy</Link><Link prefetch={false} href="/terms">Terms</Link>
          </nav>
        </div>
      </div>
    </div>
  </footer>;
}

import Image from "next/image";
import Link from "next/link";
import { AccountMenu } from "./account-menu";
import { Icon } from "./icon";
import { ServiceNavigation } from "./service-navigation";
import { PublicNavigation } from "./public-navigation";
import "./services.css";
import "./public-chrome.css";

export function Header({ authenticated = false, activeService }: { authenticated?: boolean; activeService?: "CARDHOLDER" | "MERCHANT" }) {
  return <header className={`site-header ${authenticated ? "account-header" : "public-header"}`}><div className="header-inner"><Link href={authenticated ? "/services" : "/"} className="brand-link" aria-label="Etail Depot home"><Image src="/brand/logo.png" alt="Etail Depot" width={799} height={148} priority className="brand-logo" /></Link>{authenticated ? <ServiceNavigation activeService={activeService} /> : <PublicNavigation />}<div className="header-actions"><span className="sandbox-badge"><span aria-hidden="true" />Sandbox</span>{authenticated ? <AccountMenu /> : <Link className="header-sign-in" href="/login">Sign in <Icon name="arrow" /></Link>}</div></div></header>;
}

function Footer() {
  return <footer className="site-footer public-footer">
    <div className="public-footer-main page-container"><div className="public-chrome-row"><Link href="/" className="footer-brand brand-link"><Image src="/brand/logo.png" alt="Etail Depot" width={799} height={148} className="brand-logo" /></Link><PublicNavigation label="Explore Etail Depot" /><Link className="header-sign-in" href="/login">Sign in <Icon name="arrow" /></Link></div><div className="public-footer-note"><p>For your family or business.</p><p className="footer-copyright">© Etail Depot</p></div></div>
  </footer>;
}

export function Shell({ children, authenticated = false, activeService }: { children: React.ReactNode; authenticated?: boolean; activeService?: "CARDHOLDER" | "MERCHANT" }) {
  return <><Header authenticated={authenticated} activeService={activeService} /><main id="main-content">{children}</main>{!authenticated && <Footer />}</>;
}

export function PageNotice({ title, children, authenticated = false }: { title: string; children: React.ReactNode; authenticated?: boolean }) {
  return <Shell authenticated={authenticated}><div className="page-container notice-page"><span className="large-icon"><Icon name="info" /></span><h1>{title}</h1><div className="muted notice-copy">{children}</div><Link href={authenticated ? "/services" : "/login"} className="button primary">{authenticated ? "Back to your dashboard" : "Go to sign in"}<Icon name="arrow" /></Link></div></Shell>;
}

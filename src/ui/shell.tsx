import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "./logout-button";
import { Icon } from "./icon";
import { ServiceNavigation } from "./service-navigation";
import { PublicNavigation } from "./public-navigation";
import "./services.css";

export function Header({ authenticated = false }: { authenticated?: boolean }) {
  return <header className={`site-header${authenticated ? "" : " public-header"}`}><div className="header-inner"><Link href={authenticated ? "/services" : "/"} className="brand-link" aria-label="Etail Depot home"><Image src="/brand/logo.png" alt="Etail Depot" width={799} height={148} priority className="brand-logo" /></Link>{authenticated ? <ServiceNavigation /> : <PublicNavigation />}<div className="header-actions"><span className="sandbox-badge" title="Demo cards and payments. No real money moves."><span aria-hidden="true" />Sandbox</span>{authenticated ? <LogoutButton /> : <Link className="header-sign-in" href="/login">Sign in <Icon name="arrow" /></Link>}</div></div></header>;
}

export function Footer({ authenticated = false }: { authenticated?: boolean }) {
  return <footer className={`site-footer${authenticated ? "" : " public-footer"}`}>{!authenticated && <div className="public-footer-main page-container"><div><Link href="/" className="footer-brand">Etail Depot</Link><p>Cards for your people. More ways to get paid.</p></div><nav aria-label="Explore Etail Depot"><Link href="/card-services">Cardholder services</Link><Link href="/payment-services">Merchant services</Link><Link href="/help">Help center</Link><Link href="/login">Sign in</Link></nav></div>}<div className="footer-inner"><span>Etail Depot</span><p>Sandbox · Demo cards and payments. No real money moves.</p>{authenticated && <Link href="/help">Help center</Link>}</div></footer>;
}

export function Shell({ children, authenticated = false }: { children: React.ReactNode; authenticated?: boolean }) {
  return <><Header authenticated={authenticated} /><main id="main-content">{children}</main><Footer authenticated={authenticated} /></>;
}

export function PageNotice({ title, children, authenticated = false }: { title: string; children: React.ReactNode; authenticated?: boolean }) {
  return <Shell authenticated={authenticated}><div className="page-container notice-page"><span className="large-icon"><Icon name="info" /></span><h1>{title}</h1><div className="muted notice-copy">{children}</div><Link href={authenticated ? "/services" : "/login"} className="button primary">{authenticated ? "Back to services" : "Go to sign in"}<Icon name="arrow" /></Link></div></Shell>;
}

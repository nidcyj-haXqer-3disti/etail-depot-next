"use client";

import { useLayoutEffect, useRef } from "react";
import { BrandImage } from "../brand/brand-image";
import "../brand/brand-images-etail.css";
import Link from "next/link";
import { PublicNavigation } from "./public-navigation";
import { installPublicHeader } from "./public-header-controller";
import { PaymentPortalLink } from "../ui/merchant-portal-link";
import { SalesContactLink } from "../ui/sales-booking/sales-booking-link";

export function PublicHeader({ bootstrap }: { bootstrap: string }) {
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const closeMenu = () => {
    if (header.current) installPublicHeader(header.current).closeMenu();
  };

  useLayoutEffect(() => {
    const controller = installPublicHeader(header.current!);
    return () => { controller.destroy(); };
  }, []);

  // The controller owns only the mutable menu attributes. Its state survives
  // hydration when a visitor opens the menu before the React bundle arrives.
  return <header className="site-header public-header public-header-contact" ref={header} suppressHydrationWarning>
    <noscript><span className="public-header-no-script" hidden /></noscript>
    <div className="header-inner" suppressHydrationWarning>
      <Link prefetch={false} href="/" className="brand-link" aria-label="Etail Depot home">
        <BrandImage brand="etail" alt="Etail Depot" width={800} height={150} className="brand-logo" />
      </Link>
      <button className="header-menu-toggle" type="button" ref={toggle} aria-label="Menu" aria-expanded="false" aria-controls="public-header-menu" suppressHydrationWarning>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 7h16M4 17h16" suppressHydrationWarning />
        </svg>
      </button>
      <div id="public-header-menu" className="public-header-menu" suppressHydrationWarning>
        <PublicNavigation />
        <div className="header-actions">
          <PaymentPortalLink intent="register" className="header-start-now" />
          <PaymentPortalLink intent="sign-in" className="header-sign-in" showArrow />
          <SalesContactLink className="header-contact header-contact-primary" onOpen={closeMenu} returnFocusRef={toggle}>Contact sales</SalesContactLink>
        </div>
      </div>
    </div>
    <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
  </header>;
}

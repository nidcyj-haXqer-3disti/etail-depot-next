"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Icon } from "./icon";
import { LogoutButton } from "./logout-button";
import "./account-menu.css";

/** Personal account tools have one location, independent of the selected service. */
export function AccountMenu() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const previousPath = useRef(pathname);
  const trigger = useRef<HTMLElement>(null);

  useEffect(() => {
    if (previousPath.current !== pathname && menu.current) menu.current.open = false;
    previousPath.current = pathname;
  }, [pathname]);
  useEffect(() => {
    function dismiss(event: MouseEvent) {
      // A dialog action can remove its target before this listener; retain its original menu ancestry.
      if (menu.current && !event.composedPath().includes(menu.current)) menu.current.open = false;
    }
    // Let the outside target activate before the mobile menu collapses the header.
    document.addEventListener("click", dismiss);
    return () => document.removeEventListener("click", dismiss);
  }, []);

  return <details className="account-menu" ref={menu} onKeyDown={event => {
    if (event.key === "Escape" && menu.current?.open) {
      event.preventDefault(); event.stopPropagation(); menu.current.open = false; trigger.current?.focus();
    }
  }}>
    <summary ref={trigger} aria-label="Profile and help"><Icon name="person"/><span>Profile and help</span><span className="account-menu-chevron" aria-hidden="true">⌄</span></summary>
    <div className="account-menu-panel">
      <nav aria-label="Your account" onClick={event=>{if(event.target instanceof Element&&event.target.closest("a")&&menu.current)menu.current.open=false;}}>
        <Link href="/profile" aria-current={pathname === "/profile" ? "page" : undefined}><Icon name="person"/>Your profile</Link>
        <Link href="/security" aria-current={pathname === "/security" ? "page" : undefined}><Icon name="lock"/>Sign-in &amp; security</Link>
        <Link href="/help" aria-current={pathname === "/help" ? "page" : undefined}><Icon name="info"/>Help center</Link>
      </nav>
      <LogoutButton/>
    </div>
  </details>;
}

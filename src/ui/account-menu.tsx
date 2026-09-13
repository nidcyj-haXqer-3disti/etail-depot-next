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
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !menu.current?.contains(event.target) && menu.current) menu.current.open = false;
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  return <details className="account-menu" ref={menu} onKeyDown={event => {
    if (event.key === "Escape" && menu.current?.open) {
      event.preventDefault(); event.stopPropagation(); menu.current.open = false; trigger.current?.focus();
    }
  }}>
    <summary ref={trigger} aria-label="Profile and help"><Icon name="person"/><span>Profile and help</span><span className="account-menu-chevron" aria-hidden="true">⌄</span></summary>
    <div className="account-menu-panel">
      <nav aria-label="Your account">
        <Link href="/profile" aria-current={pathname === "/profile" ? "page" : undefined}><Icon name="person"/>Your profile</Link>
        <Link href="/security" aria-current={pathname === "/security" ? "page" : undefined}><Icon name="lock"/>Sign-in &amp; security</Link>
        <Link href="/help" aria-current={pathname === "/help" ? "page" : undefined}><Icon name="info"/>Help center</Link>
      </nav>
      <LogoutButton/>
    </div>
  </details>;
}

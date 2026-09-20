"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicNavigation } from "./public-navigation";
import { PaymentPortalLink } from "./service-entry";
import { Icon } from "./icon";

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // A resized viewport starts with the compact menu closed, including rapid breakpoint changes.
    const closeOnResize = () => setOpen(false);
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return <header className="site-header public-header" ref={header} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <div className="header-inner">
      <Link href="/" className="brand-link" aria-label="Etail Depot home" onClick={() => setOpen(false)}>
        <Image src="/brand/logo.png" alt="Etail Depot" width={800} height={150} sizes="(max-width: 959px) 155px, 166px" priority className="brand-logo" />
      </Link>
      <button className="header-menu-toggle" type="button" ref={toggle} aria-expanded={open} aria-controls="public-header-menu" onClick={() => setOpen(!open)}>
        Menu<Icon name={open ? "close" : "menu"} />
      </button>
      <div id="public-header-menu" className={`public-header-menu${open ? " is-open" : ""}`}>
        <PublicNavigation onNavigate={() => setOpen(false)} />
        <div className="header-actions">
          <PaymentPortalLink className="header-sign-in">Open Trolleys</PaymentPortalLink>
        </div>
      </div>
    </div>
  </header>;
}

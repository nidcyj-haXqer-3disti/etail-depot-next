"use client";

import { useEffect, useRef, useState } from "react";
import { BrandImage } from "./brand-image";
import "./brand-images-etail.css";
import Link from "next/link";
import { PublicNavigation } from "./public-navigation";
import { PaymentPortalLink } from "./service-entry";
import { Icon } from "./icon";

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const focusedControl = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 960px)");
    const closeOnBreakpointChange = () => {
      const root = header.current;
      if (!root) return;
      const active = document.activeElement;
      const previous = focusedControl.current;
      // CSS can hide the focused control before the media-query event fires.
      const focused = active instanceof HTMLElement && root.contains(active) ? active
        : active === document.body && previous && root.contains(previous) && !previous.getClientRects().length ? previous : null;
      const menu = root.querySelector<HTMLElement>("#public-header-menu");
      const destination = desktop.matches
        ? focused === toggle.current
          ? root.querySelector<HTMLElement>('.public-navigation [aria-current="page"]') ?? root.querySelector<HTMLElement>(".public-navigation a") ?? root.querySelector<HTMLElement>(".brand-link")
          : null
        : focused && menu?.contains(focused) ? toggle.current : null;
      setOpen(false);
      if (destination?.getClientRects().length) destination.focus({ preventScroll: true });
    };
    desktop.addEventListener("change", closeOnBreakpointChange);
    return () => desktop.removeEventListener("change", closeOnBreakpointChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) {
        focusedControl.current = null;
        setOpen(false);
      }
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

  return <header className="site-header public-header" ref={header} onFocusCapture={event => {
    if (event.target instanceof HTMLElement) focusedControl.current = event.target;
  }} onBlur={event => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    // Retain the last control only for a layout-driven blur so the breakpoint handler can restore focus.
    if (!event.relatedTarget && event.target instanceof HTMLElement && !event.target.getClientRects().length) return;
    focusedControl.current = null;
    setOpen(false);
  }}>
    <div className="header-inner">
      <Link href="/" className="brand-link" aria-label="Etail Depot home" onClick={() => setOpen(false)}>
        <BrandImage brand="etail" alt="Etail Depot" width={800} height={150} className="brand-logo" />
      </Link>
      <button className="header-menu-toggle" type="button" ref={toggle} aria-expanded={open} aria-controls="public-header-menu" onClick={() => setOpen(!open)}>
        Menu<Icon name={open ? "close" : "menu"} />
      </button>
      <div id="public-header-menu" className={`public-header-menu${open ? " is-open" : ""}`}>
        <PublicNavigation onNavigate={() => { focusedControl.current = null; setOpen(false); }} />
        <div className="header-actions">
          <PaymentPortalLink className="header-sign-in">Open Trolleys</PaymentPortalLink>
        </div>
      </div>
    </div>
  </header>;
}

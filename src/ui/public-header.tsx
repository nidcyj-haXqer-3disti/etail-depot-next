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
  const pointerInteraction = useRef(false);
  const closeMenu = () => {
    header.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(item => { item.open = false; });
    setOpen(false);
  };
  useEffect(() => {
    const pointer = () => { pointerInteraction.current = true; };
    const keyboard = () => { pointerInteraction.current = false; };
    document.addEventListener("pointerdown", pointer, true);
    document.addEventListener("keydown", keyboard, true);
    return () => {
      document.removeEventListener("pointerdown", pointer, true);
      document.removeEventListener("keydown", keyboard, true);
    };
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 960px)");
    let wasDesktop = desktop.matches;
    const closeOnBreakpointChange = () => {
      if (desktop.matches === wasDesktop) return;
      wasDesktop = desktop.matches;
      const root = header.current;
      if (!root) return;
      const active = document.activeElement;
      const previous = focusedControl.current;
      // CSS can hide the focused control before the media-query event fires.
      const focused = active instanceof HTMLElement && root.contains(active) ? active
        : active === document.body && previous && root.contains(previous) && !previous.getClientRects().length ? previous : null;
      const menu = root.querySelector<HTMLElement>("#public-header-menu");
      const destination = desktop.matches
        ? focused === toggle.current || focused?.matches(".public-nav-back")
          ? root.querySelector<HTMLElement>(".public-navigation details[open] summary") ?? root.querySelector<HTMLElement>(".public-navigation summary.is-current") ?? root.querySelector<HTMLElement>(".public-navigation > a[aria-current]") ?? root.querySelector<HTMLElement>(".public-navigation summary") ?? root.querySelector<HTMLElement>(".brand-link")
          : null
        : focused && menu?.contains(focused) ? toggle.current : null;
      if (!desktop.matches) root.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(item => { item.open = false; });
      setOpen(false);
      if (destination?.getClientRects().length) destination.focus({ preventScroll: true });
    };
    desktop.addEventListener("change", closeOnBreakpointChange);
    // Resize also covers WebKit when a media-query change notification is coalesced.
    window.addEventListener("resize", closeOnBreakpointChange);
    return () => {
      desktop.removeEventListener("change", closeOnBreakpointChange);
      window.removeEventListener("resize", closeOnBreakpointChange);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = header.current;
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const background = Array.from(document.querySelectorAll<HTMLElement>("main, footer, .skip-link"))
      .filter(item => !root?.contains(item)).map(item => ({ item, inert: item.inert }));
    background.forEach(({ item }) => { item.inert = true; });
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) {
        focusedControl.current = null;
        closeMenu();
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        closeMenu();
        toggle.current?.focus();
      }
    };
    document.addEventListener("click", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      background.forEach(({ item, inert }) => { item.inert = inert; });
      document.removeEventListener("click", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return <header className={`site-header public-header public-header-contact${open ? " is-menu-open" : ""}`} ref={header} onKeyDown={event => {
    if (!open || event.key !== "Tab") return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("a[href], button, summary"))
      .filter(item => item.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  }} onFocusCapture={event => {
    if (event.target instanceof HTMLElement) focusedControl.current = event.target;
  }} onBlur={event => {
    if (event.currentTarget.contains(event.relatedTarget) || pointerInteraction.current) return;
    event.currentTarget.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(item => { item.open = false; });
    // Retain the last control only for a layout-driven blur so the breakpoint handler can restore focus.
    if (!event.relatedTarget && event.target instanceof HTMLElement && !event.target.getClientRects().length) return;
    focusedControl.current = null;
    setOpen(false);
  }}>
    <noscript><span className="public-header-no-script" hidden /></noscript>
    <div className="header-inner" role={open ? "dialog" : undefined} aria-modal={open ? true : undefined} aria-label={open ? "Site menu" : undefined}>
      <Link href="/" className="brand-link" aria-label="Etail Depot home" onClick={closeMenu}>
        <BrandImage brand="etail" alt="Etail Depot" width={800} height={150} className="brand-logo" />
      </Link>
      <button className="header-menu-toggle" type="button" ref={toggle} aria-label="Menu" aria-expanded={open} aria-controls="public-header-menu" onClick={() => {
        if (open) closeMenu(); else setOpen(true);
        // Safari does not focus buttons on pointer activation.
        toggle.current?.focus({ preventScroll: true });
      }}>
        <Icon name={open ? "close" : "menu"} />
      </button>
      <div id="public-header-menu" className={`public-header-menu${open ? " is-open" : ""}`}>
        <PublicNavigation onNavigate={() => { focusedControl.current = null; closeMenu(); }} />
        <div className="header-actions">
          <PaymentPortalLink className="header-sign-in">Merchant access</PaymentPortalLink>
          <Link href="/contact" className="header-contact header-contact-primary" onClick={closeMenu}>Contact sales</Link>
        </div>
      </div>
    </div>
  </header>;
}

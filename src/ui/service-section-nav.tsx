"use client";

import { useEffect, useRef } from "react";
import "./service-section-nav.css";

type SectionLink = { href: string; label: string };

/** Native anchors and disclosure; page navigation does not require JavaScript. */
export function ServiceSectionNav({ title, links, className = "" }: { title: string; links: readonly SectionLink[]; className?: string }) {
  const navigation = useRef<HTMLElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 680px)");
    const restoreFocus = () => {
      const root = navigation.current;
      if (!root) return;
      const active = document.activeElement;
      const previous = lastFocused.current;
      const focused = active instanceof HTMLElement && root.contains(active) ? active
        : active === document.body && previous && !previous.getClientRects().length ? previous : null;
      if (!focused || focused.getClientRects().length) return;
      const scope = narrow.matches ? ".service-section-mobile" : ".service-section-desktop-links";
      const target = [...root.querySelectorAll<HTMLAnchorElement>(`${scope} a`)]
        .find(link => link.getAttribute("href") === focused.getAttribute("href"))
        ?? root.querySelector<HTMLAnchorElement>(`${scope} a`);
      if (narrow.matches) {
        const disclosure = root.querySelector<HTMLDetailsElement>(".service-section-mobile");
        if (disclosure) disclosure.open = true;
      }
      target?.focus({ preventScroll: true });
    };
    narrow.addEventListener("change", restoreFocus);
    return () => narrow.removeEventListener("change", restoreFocus);
  }, []);
  const items = links.map(link => <a key={link.href} href={link.href}>{link.label}</a>);
  return <nav className={`service-section-nav ${className}`.trim()} aria-label="On this page" ref={navigation}
    onFocusCapture={event => { if (event.target instanceof HTMLElement) lastFocused.current = event.target; }}
    onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) lastFocused.current = null; }}>
    <div className="page-container service-section-nav-inner">
      <p className="service-section-desktop-title">{title}</p>
      <div className="service-section-links service-section-desktop-links">{items}</div>
      <details className="service-section-mobile">
        <summary><span>{title}</span><span className="service-section-prompt">On this page<span className="service-section-chevron" aria-hidden="true" /></span></summary>
        <div className="service-section-links">{items}</div>
      </details>
    </div>
  </nav>;
}

"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { publicFooterGroups } from "@/shared/site-navigation";

const compactQuery = "(max-width: 959px)";
const getCompact = () => window.matchMedia(compactQuery).matches;
const getServerCompact = () => false;

export function FooterNavigation() {
  const directory = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<{ group: string; href: string | null } | null>(null);
  const subscribe = useCallback((listener: () => void) => {
    const media = window.matchMedia(compactQuery);
    const change = () => {
      // Capture the destination before the responsive markup is replaced.
      const active = document.activeElement;
      const group = active instanceof HTMLElement && directory.current?.contains(active)
        ? active.closest("nav")?.getAttribute("aria-label") : null;
      pendingFocus.current = group && active instanceof HTMLElement
        ? { group, href: active.closest("a")?.getAttribute("href") ?? null } : null;
      listener();
    };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  const compact = useSyncExternalStore(subscribe, getCompact, getServerCompact);
  useLayoutEffect(() => {
    const previous = pendingFocus.current;
    pendingFocus.current = null;
    const root = directory.current;
    if (!previous || !root) return;
    if (document.activeElement !== document.body && !root.contains(document.activeElement)) return;
    const group = [...root.querySelectorAll("nav")].find(nav => nav.getAttribute("aria-label") === previous.group);
    const destination = previous.href
      ? [...(group?.querySelectorAll<HTMLAnchorElement>("a") ?? [])].find(link => link.getAttribute("href") === previous.href)
      : group?.querySelector<HTMLElement>(compact ? "summary" : "a");
    if (!destination) return;
    const disclosure = destination.closest("details");
    if (disclosure) disclosure.open = true;
    destination.focus({ preventScroll: true });
  }, [compact]);
  return <div ref={directory} className="public-footer-navigation" data-compact={compact}>
    {publicFooterGroups.map(group => {
      const DestinationLink = group.label === "Services" ? "a" : Link;
      const links = <ul>{group.links.map(link =>
        <li key={link.href}><DestinationLink href={link.href}>{link.label}</DestinationLink></li>
      )}</ul>;
      return <nav className="public-footer-group" aria-label={`Footer ${group.label.toLowerCase()}`} key={group.label}>
        {compact ? <details name="footer-directory">
          <summary><h2>{group.label}</h2><span className="public-footer-chevron" aria-hidden="true" /></summary>
          {links}
        </details> : <><h2>{group.label}</h2>{links}</>}
      </nav>;
    })}
  </div>;
}

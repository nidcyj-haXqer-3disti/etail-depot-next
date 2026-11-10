"use client";

import Link from "next/link";
import { BrandImage } from "../brand/brand-image";
import { PlatformMark } from "../brand/platform-marks";
import "../brand/brand-images-platforms.css";
import { useCallback, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { publicFooterGroups } from "@/shared/site/site-navigation";

const guideBrands = {
  "/resources/merchant-account-setup": "trolleys",
  "/resources/shopify-gateway-integration": "shopify",
  "/resources/woocommerce-gateway-integration": "woocommerce",
} as const;

function FooterLinkLabel({ href, label }: { href: string; label: string }) {
  const brand = guideBrands[href as keyof typeof guideBrands];
  if (!brand) return label;
  const lastSpace = label.lastIndexOf(" ");
  // Keep the small raised mark with the final word when a narrow column wraps.
  return <span>{label.slice(0, lastSpace + 1)}<span className="public-footer-guide-ending">{label.slice(lastSpace + 1)}<span className={`public-footer-guide-brand public-footer-guide-brand-${brand}`} aria-hidden="true">
    {brand === "trolleys" ? <BrandImage brand="trolleys-symbol" alt="" width={28} height={21} className="public-footer-guide-mark" /> : <PlatformMark brand={brand} className="public-footer-guide-mark" />}
  </span></span></span>;
}

const compactQuery = "(max-width: 959px)";
const getCompact = () => window.matchMedia(compactQuery).matches;
const getServerCompact = (): boolean | null => null;

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
    {/* CSS chooses the initial layout before hydration; stable keys keep that markup in place. */}
    {publicFooterGroups.flatMap(group => {
      const DestinationLink = group.label === "Services" ? "a" : Link;
      const links = <ul>{group.links.map(link =>
        <li key={link.href}><DestinationLink {...(group.label === "Services" ? {} : { prefetch: false })} href={link.href}><FooterLinkLabel href={link.href} label={link.label} /></DestinationLink></li>
      )}</ul>;
      return (compact === null ? [false, true] : [compact]).map(isCompact =>
        <nav className={`public-footer-group${group.label === "Services" ? " public-footer-services" : ""}`}
          aria-label={`Footer ${group.label.toLowerCase()}`} data-footer-layout={isCompact ? "compact" : "full"}
          key={`${group.label}-${isCompact ? "compact" : "full"}`}>
        {isCompact ? <details name="footer-directory">
          <summary><h2>{group.label}</h2><span className="public-footer-chevron" aria-hidden="true" /></summary>
          {links}
        </details> : <><h2>{group.label}</h2>{links}</>}
      </nav>);
    })}
  </div>;
}

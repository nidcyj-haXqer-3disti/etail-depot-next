"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { serviceNavigation, useCaseNavigation } from "@/shared/site-navigation";

export function PublicNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const navigation = useRef<HTMLElement>(null);
  const closeDisclosures = () => navigation.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(item => { item.open = false; });
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navigation.current?.contains(event.target)) closeDisclosures();
    };
    document.addEventListener("click", closeOutside);
    return () => document.removeEventListener("click", closeOutside);
  }, []);
  const navigate = () => { closeDisclosures(); onNavigate?.(); };
  return <nav className="public-navigation" aria-label="Main navigation" ref={navigation} onKeyDown={event => {
    if (event.key !== "Escape") return;
    const disclosure = navigation.current?.querySelector<HTMLDetailsElement>("details[open]");
    if (disclosure) {
      event.preventDefault(); event.stopPropagation();
      disclosure.open = false;
      disclosure.querySelector("summary")?.focus();
    }
  }}>
    {[{ label: "Services", links: serviceNavigation }, { label: "Use cases", links: useCaseNavigation }].map(group => <details className="public-nav-group" name="public-nav-disclosure" key={group.label}>
      <summary className={group.links.some(link => link.href === pathname) ? "is-current" : undefined}>{group.label}<span className="public-nav-chevron" aria-hidden="true" /></summary>
      <div className="public-nav-panel">
        {group.links.map(link => <Link key={link.href} href={link.href} aria-label={link.label} aria-current={pathname === link.href ? "page" : undefined} onClick={navigate}>
          <span className="public-nav-label">{link.label}</span><span className="public-nav-description">{link.description}</span>
        </Link>)}
      </div>
    </details>)}
    <Link href="/docs" aria-current={pathname === "/docs" ? "page" : pathname.startsWith("/docs/") ? "location" : undefined} onClick={navigate}>Documentation</Link>
    <Link href="/guides" aria-current={pathname === "/guides" ? "page" : pathname.startsWith("/guides/") ? "location" : undefined} onClick={navigate}>Guides</Link>
  </nav>;
}

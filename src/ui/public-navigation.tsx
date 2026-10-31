"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicNavigationGroups, publicNavigationLinks, publicDomainForPath } from "@/shared/site-navigation";

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
    {publicNavigationGroups.map(group => <details className={`public-nav-group public-domain-${group.id}`} name="public-nav-disclosure" key={group.id}>
      <summary className={publicDomainForPath(pathname) === group.id ? "is-current" : undefined}>{group.label}<span className="public-nav-chevron" aria-hidden="true" /></summary>
      <div className="public-nav-panel public-domain-panel">
        {group.sections.map(section => <div className="public-domain-section" key={section.label}>
          {group.sections.length > 1 ? <p>{section.label}</p> : null}
          <ul>{section.links.map(link => <li key={link.href}><Link href={link.href} aria-current={pathname === link.href ? "page" : pathname.startsWith(`${link.href}/`) ? "location" : undefined} onClick={navigate}>{link.label}</Link></li>)}</ul>
        </div>)}
      </div>
    </details>)}
    {publicNavigationLinks.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={navigate}>{link.label}</Link>)}
  </nav>;
}

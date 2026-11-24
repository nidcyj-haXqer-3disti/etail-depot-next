"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicNavigationGroups, publicNavigationLinks, publicDomainForPath } from "@/shared/site/site-navigation";

export function PublicNavigation() {
  const pathname = usePathname();
  const pageLinks = [...publicNavigationGroups.flatMap<{ href: string }>(group => group.sections.flatMap<{ href: string }>(section => section.links)), ...publicNavigationLinks]
    .filter(link => !link.href.includes("#"));
  const currentLink = pageLinks.find(link => link.href === pathname)
    ?? pageLinks.filter(link => pathname.startsWith(`${link.href}/`)).sort((a, b) => b.href.length - a.href.length)[0];
  return <nav className="public-navigation" aria-label="Main navigation">
    <button className="public-nav-back" type="button"><span aria-hidden="true">‹</span>Back</button>
    {publicNavigationGroups.map(group => {
      // Separate service documents should open at their beginning and retain native Back scroll restoration.
      const DestinationLink = group.id === "services" ? "a" : Link;
      return <details className={`public-nav-group public-domain-${group.id}`} name="public-nav-disclosure" key={group.id}>
      <summary className={publicDomainForPath(pathname) === group.id ? "is-current" : undefined}>{group.label}<span className="public-nav-chevron" aria-hidden="true" /></summary>
      <div className="public-nav-panel public-domain-panel">
        {group.sections.map(section => <div className="public-domain-section" key={section.label}>
          {group.sections.length > 1 ? <p>{section.label}</p> : null}
          <ul>{section.links.map(link => <li key={link.href}><DestinationLink {...(group.id === "services" ? {} : { prefetch: false })} href={link.href} aria-current={currentLink?.href === link.href ? pathname === link.href ? "page" : "location" : undefined}>{link.label}</DestinationLink></li>)}</ul>
        </div>)}
      </div>
    </details>; })}
    {publicNavigationLinks.map(link => <Link prefetch={false} key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}
  </nav>;
}

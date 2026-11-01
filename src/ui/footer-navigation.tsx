"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { publicFooterGroups } from "@/shared/site-navigation";

const compactQuery = "(max-width: 959px)";
function subscribe(listener: () => void) {
  const media = window.matchMedia(compactQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
const getCompact = () => window.matchMedia(compactQuery).matches;
const getServerCompact = () => false;

export function FooterNavigation() {
  const compact = useSyncExternalStore(subscribe, getCompact, getServerCompact);
  return <div className="public-footer-navigation" data-compact={compact}>
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

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type ReadingPosition = { key: string; url: string; x: number; y: number };
function savedPosition(state: { publicReadingPosition?: ReadingPosition } | null) {
  const position = state?.publicReadingPosition;
  return typeof position?.key === "string" && typeof position.url === "string" && Number.isFinite(position.x) && Number.isFinite(position.y)
    ? position : null;
}

/** Keep native section links and reading positions in the client route history. */
export function PublicNavigationHistory() {
  const pathname = usePathname();
  const renderedPath = useRef(pathname);
  const returningTo = useRef<ReadingPosition | null>(null);
  const activeEntry = useRef<ReadingPosition | null>(null);
  const positions = useRef(new Map<string, ReadingPosition>());

  useEffect(() => {
    function registerSectionEntry() {
      if (window.history.state === null) {
        window.history.replaceState({ publicSection: true }, "", window.location.href);
      }
    }
    function rememberDeparture(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;
      const previous = savedPosition(window.history.state);
      const position = {
        key: previous?.url === window.location.href ? previous.key : crypto.randomUUID(),
        url: window.location.href, x: window.scrollX, y: window.scrollY,
      };
      positions.current.delete(position.key);
      positions.current.set(position.key, position);
      if (positions.current.size > 100) {
        const oldest = positions.current.keys().next().value;
        if (oldest) positions.current.delete(oldest);
      }
      window.history.replaceState({ ...window.history.state, publicReadingPosition: position }, "", window.location.href);
      activeEntry.current = null;
    }
    function trackReadingPosition() {
      const position = activeEntry.current;
      if (!position || returningTo.current || position.url !== window.location.href) return;
      // Update memory only. Never rewrite browser history on every scroll frame.
      position.x = window.scrollX;
      position.y = window.scrollY;
    }
    function restoreSectionEntry(event: PopStateEvent) {
      registerSectionEntry();
      const saved = savedPosition(event.state);
      const position = saved?.url === window.location.href ? positions.current.get(saved.key) ?? null : null;
      const samePage = position && new URL(position.url).pathname === renderedPath.current;
      // Native section history restores itself; client route replacement needs
      // the latest reading position, not the older serialized departure value.
      returningTo.current = samePage ? null : position;
      activeEntry.current = samePage ? position : null;
    }
    window.addEventListener("popstate", restoreSectionEntry);
    window.addEventListener("hashchange", registerSectionEntry);
    window.addEventListener("scroll", trackReadingPosition, { passive: true });
    document.addEventListener("click", rememberDeparture, true);
    return () => {
      window.removeEventListener("popstate", restoreSectionEntry);
      window.removeEventListener("hashchange", registerSectionEntry);
      window.removeEventListener("scroll", trackReadingPosition);
      document.removeEventListener("click", rememberDeparture, true);
    };
  }, []);

  useEffect(() => {
    renderedPath.current = pathname;
    // The root listener survives route replacement. Restore after the returning
    // page and its native disclosures have mounted, without changing first loads.
    const position = returningTo.current?.url === window.location.href ? returningTo.current : null;
    if (!position) return;
    const frame = requestAnimationFrame(() => {
      if (returningTo.current !== position || position.url !== window.location.href) return;
      window.scrollTo({ left: position.x, top: position.y, behavior: "instant" });
      returningTo.current = null;
      activeEntry.current = position;
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return null;
}

"use client";

import { useEffect } from "react";

/** Enhances native contents links without moving article content into client JavaScript. */
export function ResponsiveContentsFocus({ rootSelector, desktopSelector, mobileSelector, breakpoint }: {
  rootSelector: string;
  desktopSelector: string;
  mobileSelector: string;
  breakpoint: number;
}) {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const query = window.matchMedia(`(max-width: ${breakpoint}px)`);
    let previous: HTMLElement | null = null;
    const inContents = (target: EventTarget | null): target is HTMLElement =>
      target instanceof HTMLElement && root.contains(target) && Boolean(target.closest(`${desktopSelector}, ${mobileSelector}`));
    const remember = (event: Event) => { previous = inContents(event.target) ? event.target : null; };
    const restore = () => {
      const active = document.activeElement;
      const focused = inContents(active) ? active : active === document.body ? previous : null;
      if (!focused?.isConnected || focused.getClientRects().length) return;
      const scope = root.querySelector(query.matches ? mobileSelector : desktopSelector);
      const links = [...(scope?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? [])];
      const target = links.find(link => link.getAttribute("href") === focused.getAttribute("href")) ?? links[0];
      if (scope instanceof HTMLDetailsElement) scope.open = true;
      target?.focus({ preventScroll: true });
    };
    document.addEventListener("focusin", remember);
    document.addEventListener("pointerdown", remember);
    query.addEventListener("change", restore);
    return () => {
      document.removeEventListener("focusin", remember);
      document.removeEventListener("pointerdown", remember);
      query.removeEventListener("change", restore);
    };
  }, [rootSelector, desktopSelector, mobileSelector, breakpoint]);
  return null;
}

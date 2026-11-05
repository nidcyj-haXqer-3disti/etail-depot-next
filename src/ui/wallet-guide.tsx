"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";

/** Native disclosure remains usable before hydration and without JavaScript. */
export function WalletGuide({ children }: { children: ReactNode }) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  const userChoseVisibility = useRef(false);
  const initialVisibilityChecked = useRef(false);

  useLayoutEffect(() => {
    // A visitor can open the native disclosure before React attaches its click handler.
    if (!initialVisibilityChecked.current) {
      const initialOpen = disclosure.current?.getAttribute("data-initial-open");
      if (initialOpen != null) userChoseVisibility.current = disclosure.current?.open !== (initialOpen === "true");
      else if (disclosure.current?.open) userChoseVisibility.current = true;
      initialVisibilityChecked.current = true;
    }
    const desktop = window.matchMedia("(min-width: 851px)");
    const matchViewport = () => {
      if (disclosure.current && !userChoseVisibility.current) disclosure.current.open = desktop.matches;
    };
    matchViewport();
    desktop.addEventListener("change", matchViewport);
    return () => desktop.removeEventListener("change", matchViewport);
  }, []);

  return <details className="wallet-guide-disclosure" ref={disclosure} data-responsive-artwork="wallet" suppressHydrationWarning>
    <summary onClick={() => { userChoseVisibility.current = true; }}>
      <span className="wallet-guide-label-closed">View wallet guide</span>
      <span className="wallet-guide-label-open">Hide wallet guide</span>
      <span className="wallet-guide-disclosure-icon" aria-hidden="true">+</span>
    </summary>
    <div className="wallet-guide-content">{children}</div>
  </details>;
}

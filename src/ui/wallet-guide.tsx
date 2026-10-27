"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/** Native disclosure works without JavaScript; wider screens open it after hydration. */
export function WalletGuide({ children }: { children: ReactNode }) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  const userChoseVisibility = useRef(false);
  const initialVisibilityChecked = useRef(false);

  useEffect(() => {
    // A visitor can open the native disclosure before React attaches its click handler.
    if (!initialVisibilityChecked.current) {
      if (disclosure.current?.open) userChoseVisibility.current = true;
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

  return <details className="wallet-guide-disclosure" ref={disclosure}>
    <summary onClick={() => { userChoseVisibility.current = true; }}>
      <span className="wallet-guide-label-closed">View wallet guide</span>
      <span className="wallet-guide-label-open">Hide wallet guide</span>
      <span className="wallet-guide-disclosure-icon" aria-hidden="true">+</span>
    </summary>
    <div className="wallet-guide-content">{children}</div>
  </details>;
}

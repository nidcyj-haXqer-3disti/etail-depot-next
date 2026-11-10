"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** The full service illustration renders before its decorative motion starts. */
export function HomeArtMotion({ children, className, label }: { children: ReactNode; className: string; label: string }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = root.current!;
    let visible = false;
    const sync = () => { node.dataset.motion = visible && !document.hidden ? "on" : "off"; };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);
  return <figure ref={root} className={className} data-company-art data-motion="off" role="img" aria-label={label}>{children}</figure>;
}

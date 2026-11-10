"use client";

import { useEffect, useRef, type ReactNode } from "react";
import s from "./service-art-motion.module.css";

/** Full artwork is server rendered. Only its decorative details move while visible. */
export function ServiceArtMotion({ children, className, workflow, label }: {
  children: ReactNode; className: string; workflow: string; label: string;
}) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = root.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => { node.dataset.serviceMotion = visible && !document.hidden && !reduced.matches ? "on" : "off"; };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);
  return <figure ref={root} className={`${className} ${s.motion}`} data-service-workflow={workflow} data-service-motion="off" aria-label={label}>{children}</figure>;
}

/** A fixed route remains visible with JavaScript or motion disabled. */
export function ServiceFlowMark({ direction = "down" }: { direction?: "down" | "up" | "right" }) {
  return <span className={s.flow} data-flow-direction={direction} aria-hidden="true">
    <svg viewBox="0 0 16 30" fill="none">
      <path d="M8 4v22m-4-4 4 4 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="5" r="2.5" fill="currentColor" data-motion-part="flow" />
    </svg>
  </span>;
}

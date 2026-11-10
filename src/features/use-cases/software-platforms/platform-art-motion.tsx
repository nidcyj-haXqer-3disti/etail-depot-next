"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Native selection works immediately; automatic selection is only an enhancement. */
export function AccountsMotion({ children, className }: { children: ReactNode; className: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = root.current!;
    const radios = [...node.querySelectorAll<HTMLInputElement>("input[data-example-selector]")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let keyboardReading = node.contains(document.activeElement) && document.activeElement!.matches(":focus-visible");
    let readUntil = radios[0].checked ? 0 : performance.now() + 12000;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const stop = () => { clearTimeout(timer); timer = undefined; };
    const sync = () => {
      stop();
      if (keyboardReading || !visible || document.hidden || reduced.matches) return;
      timer = setTimeout(() => {
        const current = radios.findIndex(radio => radio.checked);
        node.dataset.hasAdvanced = "true";
        radios[(current + 1) % radios.length].checked = true;
        readUntil = 0;
        sync();
      }, Math.max(6000, readUntil - performance.now()));
    };
    const select = () => { readUntil = performance.now() + 12000; sync(); };
    const focus = () => { keyboardReading = keyboardReading || document.activeElement!.matches(":focus-visible"); sync(); };
    const keyboard = () => { keyboardReading = true; stop(); };
    const release = () => { keyboardReading = false; sync(); };
    const blur = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node) || !node.contains(event.relatedTarget)) release();
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      node.dataset.motionVisible = String(visible);
      sync();
    }, { threshold: .25 });
    observer.observe(node);
    node.addEventListener("change", select);
    node.addEventListener("focusin", focus);
    node.addEventListener("keydown", keyboard);
    node.addEventListener("focusout", blur);
    node.addEventListener("pointerdown", release);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    node.dataset.motionReady = "true";
    return () => {
      stop(); observer.disconnect();
      node.removeEventListener("change", select); node.removeEventListener("focusin", focus);
      node.removeEventListener("keydown", keyboard); node.removeEventListener("focusout", blur);
      node.removeEventListener("pointerdown", release);
      document.removeEventListener("visibilitychange", sync); reduced.removeEventListener("change", sync);
    };
  }, []);
  return <div className={className} ref={root} data-account-motion>{children}</div>;
}

/** Keep decorative loops running only while the scene and document are visible. */
export function SceneMotion({ children, className }: { children: ReactNode; className: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const nodes = root.current!.querySelectorAll<HTMLElement>("[data-platform-scene]");
    const visible = new Set<Element>();
    const sync = () => nodes.forEach(node => { node.dataset.motion = visible.has(node) && !document.hidden ? "on" : "off"; });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target); });
      sync();
    }, { threshold: .15 });
    nodes.forEach(node => observer.observe(node));
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);
  return <div ref={root} className={className}>{children}</div>;
}

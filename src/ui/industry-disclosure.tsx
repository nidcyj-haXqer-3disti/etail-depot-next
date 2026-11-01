"use client";

import { useEffect, useRef, type ReactNode } from "react";
import s from "./industry-disclosure.module.css";

/** Native disclosure keeps every industry in HTML and usable without scripting. */
export function IndustryDisclosure({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const details = disclosure.current;
    if (!details) return;
    const article = details.parentElement!;
    const mobile = window.matchMedia("(max-width: 680px)");
    let mobileOpen = false;
    const destination = () => {
      try { const target = document.getElementById(decodeURIComponent(location.hash.slice(1))); return target && article.contains(target) ? target : null; } catch { return null; }
    };
    const resize = () => { details.open = !mobile.matches || mobileOpen || Boolean(destination()) || (document.activeElement !== document.body && details.contains(document.activeElement)); };
    const remember = () => { if (mobile.matches) mobileOpen = details.open; };
    const follow = () => { const target = destination(); if (target) { details.open = true; requestAnimationFrame(() => target.scrollIntoView({ block: "start" })); } };
    resize(); follow();
    details.addEventListener("toggle", remember);
    mobile.addEventListener("change", resize);
    window.addEventListener("hashchange", follow);
    return () => { details.removeEventListener("toggle", remember); mobile.removeEventListener("change", resize); window.removeEventListener("hashchange", follow); };
  }, [id]);
  return <article id={id}><details ref={disclosure} open className={s.card}>
    <summary className={s.heading}><h3>{title}</h3><span aria-hidden="true" className={s.toggle}>+</span></summary>
    <div className={s.body}>{children}</div>
  </details></article>;
}

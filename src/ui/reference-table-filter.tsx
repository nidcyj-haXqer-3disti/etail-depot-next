"use client";

import { useEffect, useRef } from "react";
import styles from "./reference-table-filter.module.css";

/** Filters the already rendered table. No remote search, storage or URL mutation. */
export function ReferenceTableFilter({ targetId, label, noun = "codes", total }: { targetId: string; label: string; noun?: string; total: number }) {
  const controls = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = controls.current;
    const table = document.getElementById(targetId);
    if (!root || !table) return;
    const input = root.querySelector("input")!;
    const clear = root.querySelector("button")!;
    const status = root.querySelector('[role="status"]')!;
    const empty = root.querySelector<HTMLElement>("[data-empty]")!;
    const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase("en-US").trim().replace(/\s+/g, " ");
    const rows = [...table.querySelectorAll<HTMLTableRowElement>("tbody tr")].map(element => ({ element, text: normalize(element.textContent ?? ""), code: normalize(element.querySelector("td:first-child code")?.textContent ?? "") }));
    const groups = [...table.querySelectorAll<HTMLElement>("[data-code-group]")];
    const apply = () => {
      const query = normalize(input.value), words = query.split(" ").filter(Boolean);
      const exact = query && rows.some(row => row.code === query);
      let count = 0;
      for (const row of rows) {
        row.element.hidden = exact ? row.code !== query : !words.every(word => row.text.includes(word));
        if (!row.element.hidden) count++;
      }
      for (const group of groups) group.hidden = ![...group.querySelectorAll<HTMLTableRowElement>("tbody tr")].some(row => !row.hidden);
      clear.disabled = !input.value;
      status.textContent = query ? `${count} of ${rows.length} ${noun}` : `All ${rows.length} ${noun}`;
      empty.hidden = count !== 0;
    };
    const reset = () => { input.value = ""; apply(); };
    const clearAndFocus = () => { reset(); input.focus({ preventScroll: true }); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape" && input.value) { event.preventDefault(); reset(); } };
    // Reveal a filtered destination before the browser follows an alphabet/group link.
    const reveal = (hash: string) => {
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const destination = document.getElementById(id);
      if (!destination || !table.contains(destination)) return;
      if (destination.closest("[hidden]")) reset();
      return destination;
    };
    const jump = (event: Event) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (anchor) reveal(anchor.hash);
    };
    const history = () => { const destination = reveal(location.hash); if (destination) destination.scrollIntoView({ block: "start" }); };
    const scope = table.closest(".sr-copy");
    input.addEventListener("input", apply);
    input.addEventListener("keydown", escape);
    clear.addEventListener("click", clearAndFocus);
    scope?.addEventListener("click", jump);
    window.addEventListener("hashchange", history);
    apply();
    input.disabled = false;
    return () => {
      input.removeEventListener("input", apply); input.removeEventListener("keydown", escape);
      clear.removeEventListener("click", clearAndFocus); scope?.removeEventListener("click", jump);
      window.removeEventListener("hashchange", history);
      for (const row of rows) row.element.hidden = false;
      for (const group of groups) group.hidden = false;
      input.disabled = true;
    };
  }, [targetId, noun]);
  return <div ref={controls} className={styles.controls}>
    <noscript><span className={styles.noScript} hidden /></noscript>
    <label htmlFor={`${targetId}-filter`}>{label}</label>
    <div className={styles.inputRow}><input id={`${targetId}-filter`} type="search" disabled placeholder="Code or meaning" autoComplete="off" autoCapitalize="none" spellCheck={false} aria-controls={targetId} /><button type="button" disabled>Clear</button></div>
    <p role="status" aria-live="polite" aria-atomic="true" className={styles.count}>All {total} {noun}</p>
    <p data-empty hidden className={styles.empty}>No matching entries. Try another code or clear the filter.</p>
  </div>;
}

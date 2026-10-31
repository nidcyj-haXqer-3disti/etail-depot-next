"use client";

import { useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};
const canCopyEmail = () => typeof navigator.clipboard?.writeText === "function";
const serverSnapshot = () => false;

/** Copies only the displayed company address after a visitor requests it. */
export function CopyContactEmail({ email, label }: { email: string; label: string }) {
  const available = useSyncExternalStore(subscribe, canCopyEmail, serverSnapshot);
  const [status, setStatus] = useState<"idle" | "copied" | "unavailable">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("unavailable");
    }
  }
  return <>
    <span className="contact-copy-control">
      {available && <button type="button" onClick={copy} aria-label={status === "copied" ? "Email address copied" : label}>{status === "copied" ? "Copied" : "Copy email"}</button>}
    </span>
    <span role="status" className={status === "unavailable" ? "contact-copy-feedback" : "sr-only"}>
      {status === "copied" ? "Email address copied." : status === "unavailable" ? "Select the email address to copy it." : ""}
    </span>
  </>;
}

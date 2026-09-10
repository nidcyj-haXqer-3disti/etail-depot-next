"use client";

import { useEffect, useId, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import type { Money, WorkspaceProjection } from "@/modules/workspace/contracts";
import { requestFailure } from "@/ui/api-feedback";
import "./consumer.css";

/** Formatting only. Financial balances and decisions always come from the server. */
export function formatMoney(value: Money | string, currency = "USD"): string {
  if (typeof value !== "string") return value.formatted;
  if (!/^-?\d+$/.test(value)) return "—";
  const amount = BigInt(value);
  const absolute = amount < 0n ? -amount : amount;
  const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(absolute / 100n);
  const fraction = (absolute % 100n).toString().padStart(2, "0");
  return `${amount < 0n ? "−" : ""}${currency === "USD" ? "$" : `${currency} `}${whole}.${fraction}`;
}

export { formatDate } from "./format-date";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  busy?: boolean;
}
export function Button({ variant = "primary", busy = false, className = "", disabled, children, ...props }: ButtonProps) {
  return <button type="button" {...props} disabled={disabled || busy} aria-busy={busy || undefined} className={`consumer-button consumer-button-${variant} ${className}`}>{busy && <span className="consumer-spinner" aria-hidden="true" />}{children}</button>;
}

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const tone = ["ACTIVE", "POSTED", "ACCEPTED", "SUBMITTED", "CLOSED"].includes(status) ? "good" : ["FROZEN", "BLOCKED", "NEEDS_RESPONSE", "DECLINED", "REVOKED"].includes(status) ? "attention" : "neutral";
  const text = label ?? status.toLowerCase().replaceAll("_", " ").replace(/^\w/, (first) => first.toUpperCase());
  return <span className={`consumer-status consumer-status-${tone}`}><span aria-hidden="true" />{text}</span>;
}
export const StatusPill = StatusBadge;

export function Feedback({ kind, message }: { kind: "success" | "error" | "info"; message: string }) {
  if (!message) return null;
  return <div className={`consumer-feedback consumer-feedback-${kind}`} role={kind === "error" ? "alert" : "status"}>{message}</div>;
}
export const Notice = Feedback;

export function EmptyState({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return <div className="consumer-empty"><span className="consumer-empty-symbol" aria-hidden="true">◇</span><h3>{title}</h3><p>{description}</p>{children}</div>;
}

export interface WorkspaceDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  serviceName: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}
/** Native modal isolation and Escape, with explicit Tab wrapping and opener restoration. */
export function WorkspaceDialog({ open, onClose, title, serviceName, children, footer, wide = false }: WorkspaceDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const contextId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    heading.current?.focus();
    function wrapTab(event: KeyboardEvent) {
      if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey || !dialog?.open) return;
      const active = document.activeElement;
      // A nested modal temporarily owns keyboard focus until it closes.
      if (active instanceof Element && active.closest("dialog[open]") && active.closest("dialog[open]") !== dialog) return;
      const candidates = Array.from(dialog.querySelectorAll<HTMLElement>("a[href], area[href], button, input, select, textarea, summary, iframe, [contenteditable='true'], [tabindex]"))
        .filter((element) => element.tabIndex >= 0 && !element.matches(":disabled") && !element.closest("[hidden], [inert], [aria-hidden='true']") && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden")
        .sort((a, b) => (a.tabIndex > 0 ? a.tabIndex : Infinity) - (b.tabIndex > 0 ? b.tabIndex : Infinity));
      const focusable = candidates.filter((element) => {
        if (!(element instanceof HTMLInputElement) || element.type !== "radio" || !element.name) return true;
        const group = candidates.filter((candidate): candidate is HTMLInputElement => candidate instanceof HTMLInputElement && candidate.type === "radio" && candidate.name === element.name && candidate.form === element.form);
        return element === (group.find((candidate) => candidate.checked) ?? group[0]);
      });
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) { event.preventDefault(); heading.current?.focus(); return; }
      const index = focusable.findIndex((element) => element === active);
      if (index < 0 || (event.shiftKey && index === 0) || (!event.shiftKey && index === focusable.length - 1)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }
    document.addEventListener("keydown", wrapTab, true);
    return () => { document.removeEventListener("keydown", wrapTab, true); dialog.close(); if (opener?.isConnected) opener.focus(); };
  }, [open]);
  return <dialog ref={ref} className={`consumer-dialog ${wide ? "consumer-dialog-wide" : ""}`} aria-labelledby={titleId} aria-describedby={contextId} onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className="consumer-dialog-header"><div><p id={contextId} className="consumer-eyebrow">{serviceName}</p><h2 ref={heading} tabIndex={-1} id={titleId}>{title}</h2></div><button type="button" className="consumer-close" aria-label={`Close ${title}`} onClick={onClose}>×</button></div>
    <div className="consumer-dialog-body">{children}</div>{footer && <div className="consumer-dialog-footer">{footer}</div>}
  </dialog>;
}

export function capability(workspace: WorkspaceProjection, action: string) {
  return workspace.capabilities.find((item) => item.action === action);
}

export class WorkspaceCommandError extends Error {
  readonly uncertain: boolean;
  constructor(message: string, readonly status: number | null, readonly code: string | null = null) {
    super(message); this.name = "WorkspaceCommandError"; this.uncertain = status === null || status >= 500 || status === 408;
  }
}

export async function workspaceCommand<T>(serviceId: string, path: string, method: "POST" | "PATCH" | "PUT", body: Record<string, unknown>): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/v1/cardholder-services/${encodeURIComponent(serviceId)}${path}`, { method, credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  } catch { throw new WorkspaceCommandError("We couldn’t confirm the result. Check your connection and retry this action; your saved request will be reused.", null); }
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: { code?: unknown } } | null;
    const code = typeof body?.error?.code === "string" && /^[A-Z_]+$/.test(body.error.code) ? body.error.code : null;
    if (response.status === 409) throw new WorkspaceCommandError("This record changed while you were working. Reload its latest saved state before making another change.", response.status, code);
    if (response.status === 422 || response.status === 400) throw new WorkspaceCommandError("We couldn’t save these details. Review the fields and try again.", response.status, code);
    throw new WorkspaceCommandError(requestFailure(response.status, "We couldn’t complete this action. Your saved details are still available. Please try again."), response.status, code);
  }
  try { return await response.json() as T; }
  catch { throw new WorkspaceCommandError("We couldn’t confirm the saved result. Retry this action to retrieve the same request.", null); }
}

/** Merchant-resource commands never acquire financial-service authority. */
export async function merchantCommand<T>(merchantId: string, path: string, method: "POST" | "PATCH" | "PUT", body: Record<string, unknown>): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/v1/merchants/${encodeURIComponent(merchantId)}${path}`, { method, credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  } catch { throw new WorkspaceCommandError("We couldn’t confirm the result. Retry the same request to recover its saved outcome.", null); }
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: { code?: unknown } } | null;
    const code = typeof body?.error?.code === "string" && /^[A-Z_]+$/.test(body.error.code) ? body.error.code : null;
    const message = response.status === 408 || response.status >= 500 ? "We couldn’t confirm the result. Retry the same request to recover its saved outcome." : response.status === 409 ? "This merchant record or your access changed. Reload the latest state before making another change." : response.status === 400 || response.status === 422 ? "Review these details and the merchant requirements, then try again." : requestFailure(response.status, "We couldn’t complete this merchant action. Your saved details remain available. Please retry.");
    throw new WorkspaceCommandError(message, response.status, code);
  }
  try { return await response.json() as T; }
  catch { throw new WorkspaceCommandError("We couldn’t confirm the saved result. Retry the same request to recover it.", null); }
}

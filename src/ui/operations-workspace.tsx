"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { OperatorCase, OperatorQueue } from "@/modules/operations/service";
import type { OperatorResponse } from "@/modules/operations/contracts";
import { Button, Feedback, StatusBadge, formatDate } from "./workspace/primitives";
import { useServerProjection } from "./workspace/use-server-projection";
import { SupportPaymentSummary } from "./workspace/cases";
import "./operations.css";

export function OperationsWorkspace({ queue, selected: initialSelected }: { queue: OperatorQueue; selected: OperatorCase | null }) {
  const [selected, , , isCurrent] = useServerProjection(initialSelected);
  const router = useRouter();
  const [filter, setFilter] = useState("OPEN");
  const [message, setMessage] = useState("");
  const [resolve, setResolve] = useState(false);
  const [attempt, setAttempt] = useState<{ caseId: string; input: OperatorResponse } | null>(null);
  const inFlight = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function reply() {
    if (!selected?.canRespond || selected.status !== "OPEN" || busy || inFlight.current || (attempt && attempt.caseId !== selected.id)) return;
    const hadUncertainAttempt = attempt !== null;
    const input = attempt?.input ?? { commandId: crypto.randomUUID(), expectedVersion: selected.version, message: message.trim(), resolve };
    const caseId = selected.id;
    inFlight.current = true;
    setAttempt({ caseId, input }); setBusy(true); setError("");
    try {
      const response = await fetch(`/api/v1/operations/cases/${caseId}/responses`, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        const code = body?.error?.code;
        // Current authorization denial says nothing about an earlier reply whose response was lost.
        // These explicit receipt-first failures do prove this exact payload did not apply.
        const definitive = ["STALE_VERSION", "INVALID_STATE", "INVALID_REQUEST", "IDEMPOTENCY_CONFLICT"].includes(code);
        if (isCurrent() && (definitive || (!hadUncertainAttempt && [401, 403, 404, 422].includes(response.status)))) setAttempt(null);
        throw new Error(response.status === 409 ? "This case changed. Reload it before replying; your text is still here." : [403, 404].includes(response.status) ? "Your access to this case changed. Reload the queue. Any unconfirmed reply is kept so you can retry it." : "We couldn’t confirm the reply. Retry with the same saved details.");
      }
      if (body?.id !== caseId || body?.serviceId !== selected.serviceId || !Number.isSafeInteger(body?.version) || !Array.isArray(body?.messages)) throw new Error("We couldn’t confirm the reply. Retry with the same saved details.");
      if (!isCurrent()) return;
      setAttempt(null); setMessage(""); setResolve(false); router.refresh();
    } catch (caught) { if (isCurrent()) setError(caught instanceof Error ? caught.message : "Please try again."); }
    finally { inFlight.current = false; setBusy(false); }
  }
  const rows = queue.filter(item => filter === "ALL" || item.status === filter);
  return <div className="ops-page page-container"><header className="page-heading"><h1>Customer care</h1><p>Review questions, reply and keep a clear case history.</p></header><div className="ops-layout"><aside className="ops-queue"><div className="ops-queue-heading"><h2>Assigned cases</h2><label>Status<select value={filter} onChange={event => setFilter(event.target.value)}><option value="OPEN">Open</option><option value="ALL">All cases</option><option value="RESOLVED">Resolved</option><option value="WITHDRAWN">Withdrawn</option></select></label></div>{rows.map(item => <Link className="ops-case-row" key={item.id} href={`/operations?case=${item.id}`} aria-current={selected?.id === item.id ? "page" : undefined}><span><strong>{item.subject}</strong><small>{item.customer} · {item.serviceKind === "CARDHOLDER" ? "Cards & spending" : "Accept payments"}</small><small>{formatDate(item.updatedAt)}</small></span><StatusBadge status={item.status}/></Link>)}{!rows.length && <p className="ops-empty">No cases match this view.</p>}<p className="ops-queue-note">Showing up to 100 recent cases for your assigned services.</p></aside><section className="ops-detail" aria-label="Selected case">{selected ? <><div className="ops-detail-heading"><div><p className="eyebrow">{selected.customer}</p><h2>{selected.subject}</h2><p className="ops-reference">{selected.reference}</p></div><div><StatusBadge status={selected.status}/><Button variant="secondary" disabled={busy} onClick={() => router.refresh()}>Reload case</Button></div></div>{selected.payment&&<SupportPaymentSummary payment={selected.payment} showLink={false}/>} {selected.paymentUnavailable&&<p className="ops-empty">The linked payment context is no longer available. Continue with the case history; do not assume its financial outcome.</p>}<ol className="ops-messages">{selected.messages.map(item => <li key={item.id}><div><strong>{item.author === "SUPPORT" ? "Support" : "Customer"}</strong><time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time></div><p>{item.body}</p></li>)}</ol><Feedback kind="error" message={error}/>{attempt && <Feedback kind="info" message="We haven’t confirmed this reply yet. Its text is kept here so you can retry it."/>}{selected.canRespond ? <form className="ops-reply" onSubmit={event => { event.preventDefault(); void reply(); }}><label>Reply to customer<textarea value={message} onChange={event => setMessage(event.target.value)} maxLength={2000} rows={5} required disabled={busy || !!attempt}/></label><label className="ops-resolve"><input type="checkbox" checked={resolve} onChange={event => setResolve(event.target.checked)} disabled={busy || !!attempt}/>Resolve this case with my reply</label><div><Button type="submit" busy={busy} disabled={!message.trim()}>{attempt ? "Retry saved reply" : "Save reply"}</Button></div></form> : <p className="ops-empty">{selected.status === "OPEN" ? "You can view this case, but you don’t have permission to reply." : "This case is closed. Its history remains available."}</p>}</> : <div className="ops-empty"><h2>Choose a case</h2><p>Open a question from your assigned queue to see its conversation.</p></div>}</section></div></div>;
}

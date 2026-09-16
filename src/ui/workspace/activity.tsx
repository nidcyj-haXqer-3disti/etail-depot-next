"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {useCustomerSearchParams} from "../use-customer-search-params";
import {customerHref} from "@/shared/customer-routes";
import { cardholderTaskHref } from "../cardholder-routing";
import type { WorkspaceActivity, WorkspaceProjection } from "@/modules/workspace/contracts";
import { Button, EmptyState, StatusBadge, WorkspaceDialog, formatDate, formatMoney } from "./primitives";

export interface ActivityWorkspaceProps { workspace: WorkspaceProjection; selectedCardId?: string }

export function ActivityWorkspace({ workspace, selectedCardId }: ActivityWorkspaceProps) {
  const params = useCustomerSearchParams(), pathname = usePathname(), router = useRouter();
  const search = params.get("q") ?? "";
  const status = params.get("status") ?? "ALL";
  const cardId = selectedCardId ?? "ALL";
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const selectedId = params.get("transaction")?.toLowerCase();
  function setQuery(changes: Record<string, string | null>, push = false) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) { if (value) next.set(key, value); else next.delete(key); }
    const url = customerHref(pathname,next);
    // Filters and the selected dialog are URL state; the already-authorized rows stay local.
    if (push) window.history.pushState(null, "", url); else window.history.replaceState(null, "", url);
  }
  function setCardId(id: string) {
    const next = new URLSearchParams(params.toString());
    next.delete("transaction"); next.delete("focus"); next.delete("context");
    if (id === "ALL") next.set("context", workspace.service.id); else next.set("focus", id);
    router.push(customerHref("/cardholder-services/activity",next), { scroll: false });
  }
  function setSelectedId(id: string | null) { setQuery({ transaction: id }, Boolean(id)); }
  const selected = workspace.activity.find((item) => item.id === selectedId && (!selectedCardId || item.cardId === selectedCardId));
  const invalidDates = Boolean(from && to && from > to);
  const rows = useMemo(() => workspace.activity.filter((item) => {
    const day = item.occurredAt.slice(0, 10);
    const matchesSearch = `${item.title} ${item.category} ${item.description}`.toLowerCase().includes(search.trim().toLowerCase());
    return matchesSearch && (status === "ALL" || status === item.status) && (cardId === "ALL" || cardId === item.cardId) && (!from || day >= from) && (!to || day <= to);
  }), [workspace.activity, search, status, cardId, from, to]);
  const hasFilters = Boolean(search || status !== "ALL" || from || to);
  function clearFilters() { setQuery({ q: null, status: null, from: null, to: null }); }

  return <section className="consumer-workspace" aria-label="Card activity">
    <div className="consumer-panel consumer-activity-panel"><div className="consumer-activity-toolbar"><label className="consumer-search"><span className="consumer-sr-only">Search activity</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><input type="search" value={search} onChange={(event) => setQuery({ q: event.target.value })} placeholder="Search activity" /></label><label className="consumer-filter"><span>Status</span><select value={status} onChange={(event) => setQuery({ status: event.target.value === "ALL" ? null : event.target.value })}><option value="ALL">All statuses</option><option value="POSTED">Posted</option><option value="PENDING">Pending</option><option value="DECLINED">Declined</option></select></label><label className="consumer-filter"><span>Card</span><select value={cardId} onChange={(event) => setCardId(event.target.value)}><option value="ALL">All available cards</option>{workspace.cards.map((card) => <option key={card.id} value={card.id}>{card.nickname} · {card.lastFour}</option>)}</select></label></div>
      <div className="consumer-date-toolbar"><div className="consumer-date-fields"><label>From<input type="date" value={from} onChange={(event) => setQuery({ from: event.target.value })} aria-invalid={invalidDates || undefined} aria-describedby={invalidDates ? "activity-date-error" : undefined} /></label><span aria-hidden="true">—</span><label>To<input type="date" value={to} onChange={(event) => setQuery({ to: event.target.value })} aria-invalid={invalidDates || undefined} aria-describedby={invalidDates ? "activity-date-error" : undefined} /></label></div>{hasFilters && <Button variant="quiet" onClick={clearFilters}>Clear filters</Button>}<p className="consumer-result-count" role="status">{rows.length} {rows.length === 1 ? "transaction" : "transactions"}</p></div>
      {invalidDates && <p className="consumer-date-error" id="activity-date-error" role="alert">The end date must be on or after the start date.</p>}
      {rows.length ? <table className="consumer-activity-table"><caption className="consumer-sr-only">Activity for {(workspace.customerService?.displayName ?? "Cards & spending")}. Select a transaction to see details.</caption><thead><tr><th scope="col">Transaction</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col" className="consumer-amount-cell">Amount</th><th scope="col"><span className="consumer-sr-only">Details</span></th></tr></thead><tbody>{rows.map((item) => <tr key={item.id}><td><button className="consumer-transaction-button" onClick={() => setSelectedId(item.id)} aria-label={`View ${item.title}, ${formatMoney(item.amount)}, ${item.status.toLowerCase()}`}><span className={`consumer-transaction-symbol ${item.direction === "CREDIT" ? "is-credit" : ""}`} aria-hidden="true">{item.direction === "CREDIT" ? "↙" : item.category.toLowerCase().includes("dining") ? "◒" : "↗"}</span><span><strong>{item.title}</strong><small>{item.category}</small></span></button></td><td className="consumer-transaction-date">{formatDate(item.occurredAt)}</td><td className="consumer-transaction-status"><StatusBadge status={item.status} /></td><td className={`consumer-amount-cell ${item.direction === "CREDIT" ? "consumer-credit" : ""}`}><span className="consumer-sr-only">{item.direction === "CREDIT" ? "Credit " : "Debit "}</span>{item.direction === "CREDIT" ? "+" : ""}{formatMoney(item.amount)}</td><td className="consumer-row-arrow" aria-hidden="true">↗</td></tr>)}</tbody></table> : <EmptyState title={hasFilters ? "No matching activity" : "Your activity starts here"} description={hasFilters ? "Try another search or clear the filters to see all available activity." : "Your card purchases will appear here."}>{hasFilters && <Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}</EmptyState>}
      <div className="consumer-table-note"><span>All times shown in UTC.</span></div>
    </div>
    {selected && <WorkspaceDialog open onClose={() => setSelectedId(null)} title="Transaction details" serviceName={(workspace.customerService?.displayName ?? "Cards & spending")}><ActivityDetails item={selected} workspace={workspace} /><div className="consumer-action-row consumer-detail-back"><Button variant="secondary" onClick={() => setSelectedId(null)}>Back to activity</Button></div></WorkspaceDialog>}
  </section>;
}

export function ActivityDetails({ item, workspace }: { item: WorkspaceActivity; workspace: WorkspaceProjection }) {
  const card = workspace.cards.find((entry) => entry.id === item.cardId);
  const statusDescription = item.status === "PENDING" ? "This transaction is pending. Its final amount and posting date have not been confirmed." : item.status === "DECLINED" ? "This transaction was declined. It is not a completed purchase." : "This transaction has posted to this card’s activity.";
  return <><div className="consumer-transaction-hero"><span className={`consumer-transaction-symbol ${item.direction === "CREDIT" ? "is-credit" : ""}`} aria-hidden="true">{item.direction === "CREDIT" ? "↙" : "↗"}</span><h3>{item.title}</h3><p className="consumer-transaction-amount">{item.direction === "CREDIT" ? "+" : ""}{formatMoney(item.amount)}</p><StatusBadge status={item.status} /></div><p className="consumer-detail-description">{item.description}</p><dl className="consumer-detail-list"><div><dt>Card account</dt><dd>{(workspace.customerService?.displayName ?? "Cards & spending")}</dd></div><div><dt>Date</dt><dd>{formatDate(item.occurredAt)}</dd></div><div><dt>Category</dt><dd>{item.category}</dd></div><div><dt>Type</dt><dd>{item.direction === "CREDIT" ? "Credit" : "Debit"}</dd></div>{card && <div><dt>Card</dt><dd>{card.nickname} · {card.lastFour}</dd></div>}{card && <div><dt>Cardholder</dt><dd>{card.holderName}</dd></div>}</dl><div className="consumer-state-explanation"><strong>{item.status === "PENDING" ? "Waiting to post" : item.status === "DECLINED" ? "Purchase not completed" : "Posted transaction"}</strong><p>{statusDescription}</p></div><div className="consumer-action-row"><Link className="consumer-button consumer-button-secondary" href={cardholderTaskHref("help", {cardId: item.cardId, contextId: workspace.service.id}, {new:"1",topic:"TRANSACTION",transaction:item.id})}>Get help with this transaction</Link></div></>;
}

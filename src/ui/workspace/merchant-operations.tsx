"use client";

import {useServerProjection} from "./use-server-projection";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { ChannelPresentation, MerchantWorkspaceProjection } from "@/modules/acquiring/contracts";
import type { ChannelActivation, MerchantCheckoutProjection, MerchantOperationsProjection, MerchantTestPayment, MerchantTestPayout, TestGateway, TestMerchantEnrollment } from "@/modules/acquiring/operations-contracts";
import { Button, EmptyState, Feedback, StatusBadge, WorkspaceCommandError, WorkspaceDialog, formatDate, formatMoney, merchantCommand } from "./primitives";
import "./merchant-operations.css";

type Notice = { kind: "success" | "error" | "info"; message: string };
type Attempt = { path: string; method: "POST" | "PUT"; body: Record<string, unknown>; kind: "gateway" | "enrollment" | "activation" | "refund" | "payout" };
type Choice = { kind: "gateway" | "enrollment"; enabled: boolean } | { kind: "activation"; channelId: string; active: boolean; expectedChannelVersion: number } | { kind: "payment"; payment: MerchantTestPayment } | { kind: "refund"; payment: MerchantTestPayment } | { kind: "payout" };
function minorAmount(value: string): string | null {
  if (!/^\d{1,10}(?:\.\d{1,2})?$/.test(value.trim())) return null;
  const [whole, fraction = ""] = value.trim().split(".");
  const amount = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
  return amount > 0n && amount <= 999999999999n ? amount.toString() : null;
}
function failure(error: unknown): string {
  const messages: Record<string, string> = {
    INSUFFICIENT_LEDGER_FUNDS: "There aren’t enough available test funds for this amount. Reload the latest balance before trying again.",
    CHANNEL_ALREADY_USED: "This one-time channel has already received a successful sandbox payment. Its receipt is available in Payments.",
    CHANNEL_NOT_READY: "This channel can’t accept a sandbox payment right now. Check payment setup, its status and expiry.",
    TEST_GATEWAY_NOT_READY: "Payment setup is not ready. Your primary merchant can review payment setup.",
    PAYMENT_NOT_REFUNDABLE: "This payment cannot be refunded. Reload its latest saved status.",
  };
  return error instanceof WorkspaceCommandError && error.code && messages[error.code] ? messages[error.code] : error instanceof Error ? error.message : "We couldn’t confirm the result. Retry the same request to recover it.";
}
const activationLabels: Record<ChannelActivation["state"], string> = { ACTIVE: "Ready", DISABLED: "Off", EXPIRED: "Expired", USED: "Already paid", NOT_READY: "Setup needed" };

export function MerchantOperations({ workspace: initialWorkspace, initial, section = "payments", showAdministration = true }: { workspace: MerchantWorkspaceProjection; initial: MerchantOperationsProjection; section?: "setup" | "payments"; showAdministration?:boolean }) {
  const [workspace, setWorkspace, workspaceChanged, isWorkspaceCurrent] = useServerProjection(initialWorkspace);
  const [operations, setOperations, operationsChanged, isOperationsCurrent] = useServerProjection(initial);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState(false);
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const params = useSearchParams();
  const activity = params.get("activity") === "refunds" ? "refunds" : params.get("activity") === "transfers" ? "transfers" : "payments";
  const search = (params.get("q") ?? "").slice(0, 160);
  const requestedStatus = params.get("status") ?? "ALL";
  const status = ["APPROVED", "DECLINED", "REFUNDED"].includes(requestedStatus) ? requestedStatus : "ALL";
  const from = params.get("from") ?? "", to = params.get("to") ?? "";
  const paymentSelections = params.getAll("payment");
  const paymentId = section === "payments" && paymentSelections.length ? paymentSelections.length === 1 && paymentSelections[0] ? paymentSelections[0].toLowerCase() : "invalid-selection" : null;
  const [busy, setBusy] = useState(false);
  const [stale, setStale] = useState(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const isCurrent=()=>isWorkspaceCurrent()&&isOperationsCurrent();
  if(workspaceChanged||operationsChanged) {
    const readablePayment=choice&&(choice.kind==="payment"||choice.kind==="refund")?initial.payments.find(payment=>payment.id===choice.payment.id):undefined;
    const hasChannel=(id:string)=>initialWorkspace.channels.some(channel=>channel.id===id);
    const deniedChoice=choice?.kind==="payment"||choice?.kind==="refund"?!readablePayment:choice?.kind==="activation"?!hasChannel(choice.channelId):choice?.kind==="payout"?!initial.canPayout:choice?.kind==="gateway"||choice?.kind==="enrollment"?!initial.canConfigureGateway:false;
    if(deniedChoice){setChoice(null);setOpen(false);setReview(false);setReason("");setAmount("");}
    else if(readablePayment&&choice&&(choice.kind==="payment"||choice.kind==="refund")){
      setChoice({kind:choice.kind==="refund"&&!readablePayment.canRefund&&!attempt?"payment":choice.kind,payment:readablePayment});
    }else if(choice?.kind==="activation"&&!attempt){setChoice(null);setOpen(false);}
    setBusy(false);setStale(false);setNotice(null);
  }
  const merchant = workspace.merchant;
  const attemptVisible=!!attempt&&(attempt.kind==="refund"||attempt.kind==="payout"?operations.canReadPayments:attempt.kind==="activation"?workspace.channels.some(channel=>channel.id===attempt.path.split("/")[2]):operations.canConfigureGateway);
  const locked = busy || !!attempt || stale;
  const selectedPayment = paymentId ? operations.payments.find(payment => payment.id === paymentId) : undefined;
  const displayChoice: Choice | null = open && choice && (choice.kind !== "refund" || choice.payment.id === paymentId) ? choice : selectedPayment && !attempt ? { kind: "payment", payment: selectedPayment } : null;
  const dialogOpen = displayChoice !== null;
  const validDate = (value: string) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
  const dateError = !validDate(from) || !validDate(to) ? "Enter valid dates to filter these records." : from && to && from > to ? "The end date must be on or after the start date." : "";
  const activityRows = activity === "transfers" ? operations.payouts.map(transfer => ({ id: transfer.id, description: "Transfer to sandbox destination", at: transfer.createdAt, reference: transfer.testReference, amount: transfer.amount, status: transfer.status, payment: null as MerchantTestPayment | null, searchReference: transfer.testReference }))
    : operations.payments.filter(payment => activity !== "refunds" || payment.refund !== null).map(payment => ({ id: payment.id, description: payment.description, at: activity === "refunds" ? payment.refund!.createdAt : payment.createdAt, reference: activity === "refunds" ? payment.refund!.testReference : payment.testReference, amount: activity === "refunds" ? payment.refund!.amount : payment.amount, status: payment.status, payment, searchReference: `${payment.testReference} ${payment.refund?.testReference ?? ""}` }));
  const rows = activityRows.filter(row => !dateError && (activity !== "payments" || status === "ALL" || row.status === status) && (!from || row.at.slice(0, 10) >= from) && (!to || row.at.slice(0, 10) <= to) && `${row.description} ${row.searchReference}`.toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => b.at.localeCompare(a.at) || a.id.localeCompare(b.id));
  function updateQuery(changes: Record<string, string | null>, push = false) {
    const query = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) { if (value) query.set(key, value); else query.delete(key); }
    const href = `${window.location.pathname}?${query.toString()}`;
    if (push) window.history.pushState(null, "", href); else window.history.replaceState(null, "", href);
  }
  function clearFilters() { updateQuery({ q: null, status: null, from: null, to: null, payment: null }); }
  function selectActivity(next: string) { updateQuery({ activity: next === "payments" ? null : next, status: null, payment: null }, true); }
  function backToPayments() { if (!busy) { setOpen(false); updateQuery({ payment: null }); } }
  const nameFor = (channelId: string) => workspace.channels.find(channel => channel.id === channelId)?.description ?? "Payment channel";
  const amountFor = (channelId: string) => workspace.channels.find(channel => channel.id === channelId)?.amount;
  function choose(next: Choice) {
    if (locked) return;
    setReview(false); setReason(""); setAmount(""); setNotice(null);
    if (next.kind === "payment") { setChoice(null); setOpen(false); updateQuery({ payment: next.payment.id }, true); }
    else { setChoice(next); setOpen(true); }
  }
  function close() { backToPayments(); }
  async function reload(showNotice = true) {
    try {
      const [response, channelResponse] = await Promise.all([fetch(`/api/v1/merchants/${encodeURIComponent(merchant.id)}/operations`, { cache: "no-store", credentials: "same-origin" }), fetch(`/api/v1/merchants/${encodeURIComponent(merchant.id)}`, { cache: "no-store", credentials: "same-origin" })]);
      if(!isCurrent())return;
      if (!response.ok || !channelResponse.ok) throw new WorkspaceCommandError("This payment view is unavailable with your current access. Return to your merchant services or retry.", !response.ok ? response.status : channelResponse.status);
      const next = await response.json() as MerchantOperationsProjection;
      const nextWorkspace = await channelResponse.json() as MerchantWorkspaceProjection;
      if(!isCurrent())return;
      setOperations(next); setWorkspace(nextWorkspace); setStale(false);
      if (choice?.kind === "activation") { setChoice(null); setOpen(false); }
      if (choice?.kind === "payment" || choice?.kind === "refund") {
        setChoice(null); setOpen(false); setReview(false);
      }
      if (showNotice) setNotice({ kind: "info", message: "Payments and available balance refreshed." });
    } catch (error) {
      if(!isCurrent())return;
      if (error instanceof WorkspaceCommandError && [401, 403, 404].includes(error.status ?? 0)) {
        setOperations(current => ({ ...current, channels: [], payments: [], payouts: [], availableFunds: null, canReadPayments: false, canConfigureGateway: false, canEnroll: false, canPayout: false }));
        setChoice(null); setOpen(false);
      }
      setStale(true); setNotice({ kind: "error", message: failure(error) });
    }
  }
  async function send(command: Attempt) {
    const retrying=attempt!==null;
    setBusy(true); setAttempt(command); setNotice(null);
    try {
      const result = await merchantCommand<TestGateway | TestMerchantEnrollment | ChannelActivation | MerchantTestPayment | MerchantTestPayout>(merchant.id, command.path, command.method, command.body);
      if(!isCurrent())return;
      setAttempt(null); setStale(false); setOpen(false);
      if (command.kind === "refund") updateQuery({ payment: null });
      setOperations(current => command.kind === "gateway" ? { ...current, gateway: result as TestGateway }
        : command.kind === "enrollment" ? { ...current, enrollment: result as TestMerchantEnrollment }
          : command.kind === "activation" ? { ...current, channels: current.channels.map(channel => channel.channelId === (result as ChannelActivation).channelId ? result as ChannelActivation : channel) }
            : command.kind === "refund" ? { ...current, payments: current.payments.map(payment => payment.id === (result as MerchantTestPayment).id ? result as MerchantTestPayment : payment) }
              : { ...current, payouts: [result as MerchantTestPayout, ...current.payouts.filter(payout => payout.id !== (result as MerchantTestPayout).id)] });
      const message = command.kind === "refund" ? `Full sandbox refund saved. Reference ${(result as MerchantTestPayment).refund!.testReference}.` : command.kind === "payout" ? `Sandbox transfer completed. Reference ${(result as MerchantTestPayout).testReference}. No money was sent to a bank.` : "Payment setup saved. Your current settings are shown below.";
      setNotice({ kind: "success", message });
      // A failed refresh does not turn a confirmed write into an unknown command.
      await reload(false);
    } catch (error) {
      if(!isCurrent())return;
      if (error instanceof WorkspaceCommandError && !error.uncertain) { if(!retrying)setAttempt(null); setStale([401, 403, 404, 409].includes(error.status ?? 0)); }
      setNotice({ kind: "error", message: failure(error) });
    } finally { if(isCurrent())setBusy(false); }
  }
  function confirm() {
    if (!choice || locked) return;
    const commandId = crypto.randomUUID();
    if (choice.kind === "gateway") void send({ kind: choice.kind, path: "/gateway", method: "PUT", body: { commandId, expectedVersion: operations.gateway.version, enabled: choice.enabled } });
    if (choice.kind === "enrollment") void send({ kind: choice.kind, path: "/test-enrollment", method: "PUT", body: { commandId, expectedVersion: operations.enrollment.version, enabled: choice.enabled } });
    if (choice.kind === "activation") void send({ kind: choice.kind, path: `/channels/${choice.channelId}/activation`, method: "PUT", body: { commandId, expectedVersion: operations.channels.find(channel => channel.channelId === choice.channelId)!.version, expectedChannelVersion: choice.expectedChannelVersion, active: choice.active } });
    if (choice.kind === "refund") void send({ kind: choice.kind, path: `/payments/${choice.payment.id}/refund`, method: "POST", body: { commandId, expectedVersion: choice.payment.version, reason: reason.trim() } });
    if (choice.kind === "payout" && minorAmount(amount)) void send({ kind: choice.kind, path: "/payouts", method: "POST", body: { commandId, amountMinor: minorAmount(amount), currency: "USD" } });
  }
  function reviewDetails() {
    if (choice?.kind === "refund" && (!reason.trim() || /[\u0000-\u001f\u007f-\u009f]/.test(reason))) { setNotice({ kind: "error", message: "Enter a plain-text reason for this full refund." }); return; }
    if (choice?.kind === "payout" && !minorAmount(amount)) { setNotice({ kind: "error", message: "Enter a positive USD amount with up to two decimal places." }); return; }
    setNotice(null); setReview(true);
  }
  const feedback = <>{notice && <Feedback {...notice} />}{attempt && attemptVisible && !busy && <Button variant="secondary" onClick={() => void send(attempt)}>Retry same request</Button>}{attempt && attemptVisible && !open && <Button variant="quiet" onClick={() => { if (choice?.kind === "refund") updateQuery({ payment: choice.payment.id }); setOpen(true); }}>Resume payment request</Button>}{stale && !attempt && <Button variant="secondary" busy={busy} onClick={() => { setBusy(true); void reload().finally(() => {if(isCurrent())setBusy(false);}); }}>Reload payment status</Button>}</>;
  const context = <dl className="mop-summary"><div><dt>Merchant</dt><dd>{merchant.displayName}</dd></div><div><dt>Primary merchant</dt><dd>{merchant.master.displayName}</dd></div></dl>;
  const receipt = (payment: MerchantTestPayment) => <dl className="mop-summary"><div><dt>Payment</dt><dd>{payment.description}</dd></div><div><dt>Amount</dt><dd>{formatMoney(payment.amount)}</dd></div><div><dt>Status</dt><dd><StatusBadge status={payment.status} /></dd></div><div><dt>Reference</dt><dd className="mop-reference">{payment.testReference}</dd></div><div><dt>Recorded</dt><dd>{formatDate(payment.createdAt)}</dd></div><div><dt>Fees</dt><dd>Not applied in this sandbox</dd></div>{payment.refund && <><div><dt>Full refund</dt><dd>{formatMoney(payment.refund.amount)}</dd></div><div><dt>Refund reason</dt><dd>{payment.refund.reason}</dd></div><div><dt>Refund reference</dt><dd className="mop-reference">{payment.refund.testReference}</dd></div></>}</dl>;
  const title = displayChoice?.kind === "gateway" ? displayChoice.enabled ? "Turn on sandbox payments?" : "Turn off sandbox payments?" : displayChoice?.kind === "enrollment" ? displayChoice.enabled ? "Connect this merchant?" : "Disconnect this merchant?" : displayChoice?.kind === "activation" ? displayChoice.active ? "Turn on this channel?" : "Turn off this channel?" : displayChoice?.kind === "refund" ? review ? "Review full refund" : "Refund this payment" : displayChoice?.kind === "payout" ? review ? "Review transfer out" : "Transfer out" : "Payment details";

  return <section className="mop-workspace" aria-label={section === "setup" ? "Payment setup" : "Payments"}>
    <div className="mop-heading"><div><h2>{section === "setup" ? "Payment setup" : "Payments"}</h2><p>{section === "setup" ? "Turn on payments, connect this merchant and choose a channel." : `Follow payments received through ${merchant.displayName}.`}</p></div></div>

    {!dialogOpen && feedback}
    {section === "setup" ? <>
      <div className="mop-setup-grid"><article className="mop-panel"><p className="consumer-eyebrow">STEP 1</p><h3>Sandbox payments</h3><p>{merchant.master.displayName}</p><StatusBadge status={operations.gateway.mode} label={operations.gateway.mode === "TEST_READY" ? "Ready" : operations.gateway.mode === "DISABLED" ? "Off" : "Not set up"} /><p>Payment processing for this primary merchant and its submerchants.</p>{showAdministration && operations.canConfigureGateway ? <Button disabled={locked} variant={operations.gateway.mode === "TEST_READY" ? "secondary" : "primary"} onClick={() => choose({ kind: "gateway", enabled: operations.gateway.mode !== "TEST_READY" })}>{operations.gateway.mode === "TEST_READY" ? "Turn off payments" : "Turn on payments"}</Button> : <p className="mop-muted">Your primary merchant controls this setting.</p>}</article>
        <article className="mop-panel"><p className="consumer-eyebrow">STEP 2</p><h3>{merchant.displayName}</h3><StatusBadge status={operations.enrollment.status} label={operations.enrollment.status === "ENROLLED" ? "Connected" : operations.enrollment.status === "DISABLED" ? "Disconnected" : "Not connected"} /><p>Allow this merchant to use sandbox payment processing.</p>{showAdministration && operations.canEnroll ? <Button disabled={locked || operations.gateway.mode !== "TEST_READY" && operations.enrollment.status !== "ENROLLED"} variant={operations.enrollment.status === "ENROLLED" ? "secondary" : "primary"} onClick={() => choose({ kind: "enrollment", enabled: operations.enrollment.status !== "ENROLLED" })}>{operations.enrollment.status === "ENROLLED" ? "Disconnect merchant" : "Connect merchant"}</Button> : <p className="mop-muted">Your primary merchant controls this connection.</p>}{operations.gateway.mode !== "TEST_READY" && <p className="mop-muted">Complete step 1 before connecting.</p>}</article></div>
      <div className="mop-panel"><h3>Collect a payment</h3><p>Turn on a saved channel to collect a sandbox payment.</p>{operations.channels.length ? <ul className="mop-channel-list">{operations.channels.map(channel => <li key={channel.channelId}><div><strong>{nameFor(channel.channelId)}</strong>{amountFor(channel.channelId) && <span>{formatMoney(amountFor(channel.channelId)!)}</span>}<StatusBadge status={channel.state} label={activationLabels[channel.state]} /></div><div className="mop-actions">{channel.canActivate && workspace.channels.some(item => item.id === channel.channelId) && <Button disabled={locked} onClick={() => choose({ kind: "activation", channelId: channel.channelId, active: true, expectedChannelVersion: workspace.channels.find(item => item.id === channel.channelId)!.version })}>Turn on channel</Button>}{channel.canDisable && workspace.channels.some(item => item.id === channel.channelId) && <Button variant="secondary" disabled={locked} onClick={() => choose({ kind: "activation", channelId: channel.channelId, active: false, expectedChannelVersion: workspace.channels.find(item => item.id === channel.channelId)!.version })}>Turn off channel</Button>}{channel.previewHref && <Link className="consumer-button consumer-button-secondary" href={channel.previewHref}>Preview payment</Link>}</div></li>)}</ul> : <EmptyState title="Create a channel to get started" description="Save an amount and choose how you want to get paid.">{workspace.canCreateChannel&&<Link className="consumer-button consumer-button-primary" href={`/merchants/${merchant.id}?tab=channels&new=1`}>Create payment channel</Link>}</EmptyState>}</div>
    </> : <>
      <div className="mop-balance" id="available-balance"><div><p>Available balance</p><strong>{operations.availableFunds ? formatMoney(operations.availableFunds) : "Unavailable"}</strong><span>{showAdministration && operations.canPayout ? "Available to transfer" : "Current balance"}</span></div>{showAdministration && operations.canPayout && <Button disabled={locked} onClick={() => choose({ kind: "payout" })}>Transfer out</Button>}</div>
      {operations.canReadPayments ? <div className="mop-panel mop-activity-panel">
        <nav className="mop-activity-nav" aria-label="Payment activity views">{([['payments', 'Payments'], ['refunds', 'Refunds'], ['transfers', 'Transfers']] as const).map(([value, label]) => <button type="button" key={value} aria-label={label} aria-current={activity === value ? "page" : undefined} disabled={locked} onClick={() => selectActivity(value)}>{label}<span>{value === "payments" ? operations.payments.length : value === "refunds" ? operations.payments.filter(payment => payment.refund).length : operations.payouts.length}</span></button>)}</nav>
        <div className="mop-filters"><label className="mop-search">{activity === "refunds" ? "Search refunds" : activity === "transfers" ? "Search transfers" : "Search payments"}<input type="search" value={search} maxLength={160} disabled={locked} onChange={event => updateQuery({ q: event.target.value || null, payment: null })} placeholder="Description or reference" /></label>{activity === "payments" && <label>Payment status<select value={status} disabled={locked} onChange={event => updateQuery({ status: event.target.value === "ALL" ? null : event.target.value, payment: null })}><option value="ALL">All statuses</option><option value="APPROVED">Approved</option><option value="DECLINED">Declined</option><option value="REFUNDED">Refunded</option></select></label>}<label>From date (UTC)<input type="date" value={validDate(from) ? from : ""} disabled={locked} onChange={event => updateQuery({ from: event.target.value || null, payment: null })} /></label><label>To date (UTC)<input type="date" value={validDate(to) ? to : ""} disabled={locked} onChange={event => updateQuery({ to: event.target.value || null, payment: null })} /></label><Button variant="quiet" disabled={locked} onClick={() => { setBusy(true); void reload().finally(() => {if(isCurrent())setBusy(false);}); }}>Refresh payments</Button></div>
        <div className="mop-result-bar"><p aria-live="polite">{rows.length} of {activityRows.length} {activity} · {activity === "refunds" ? "refund date" : activity === "transfers" ? "transfer date" : "payment date"} · UTC</p>{(search || status !== "ALL" || from || to) && <Button variant="quiet" disabled={locked} onClick={clearFilters}>Clear filters</Button>}</div>
        {dateError && <Feedback kind="error" message={dateError} />}
        {paymentId && !selectedPayment && <EmptyState title="This payment is unavailable" description="It may belong to another merchant or your access may have changed. No other payment has been opened."><Button variant="secondary" disabled={busy} onClick={backToPayments}>Back to payments</Button></EmptyState>}
        {rows.length ? <table className="mop-table"><caption className="consumer-sr-only">{activity === "transfers" ? "Transfers out" : activity === "refunds" ? "Refunds" : "Payments"} for {merchant.displayName}</caption><thead><tr><th scope="col">{activity === "transfers" ? "Transfer" : "Payment"}</th><th scope="col">Date (UTC)</th><th scope="col">Reference</th><th scope="col">Status</th><th scope="col" className="mop-number">Amount</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td data-label={activity === "transfers" ? "Transfer" : "Payment"}>{row.payment ? <button className="mop-payment-row" disabled={locked} onClick={() => choose({ kind: "payment", payment: row.payment! })} aria-label={`View ${row.payment.status.toLowerCase()} payment ${row.payment.description} ${row.payment.testReference}`}>{row.description}<span aria-hidden="true">↗</span></button> : <span>{row.description}</span>}</td><td data-label="Date (UTC)"><time dateTime={row.at}>{formatDate(row.at)}</time></td><td data-label="Reference" className="mop-reference">{row.reference}</td><td data-label="Status"><StatusBadge status={row.status} /></td><td data-label="Amount" className="mop-number">{formatMoney(row.amount)}</td></tr>)}</tbody></table> : !dateError && <EmptyState title={search || status !== "ALL" || from || to ? "No matching records" : activity === "payments" ? "Your first payment starts here" : activity === "refunds" ? "No refunds yet" : "No transfers yet"} description={search || status !== "ALL" || from || to ? "Try a different reference, date range or status." : activity === "payments" ? "Turn on a channel in Payment setup, then try its payment preview." : activity === "refunds" ? "Saved refunds appear here with their original payment." : "Completed sandbox transfers appear here."} />}
      </div> : <EmptyState title="Payments aren’t available with this access" description="Ask your primary merchant for payment access." />}

    </>}
    <WorkspaceDialog open={dialogOpen} onClose={close} title={title} serviceName={merchant.displayName}>
      {feedback}{context}
      {displayChoice?.kind === "gateway" && <p>{displayChoice.enabled ? "Turn on sandbox payments for this primary merchant. Then connect a merchant and turn on its channels." : "Pause new payments for this primary merchant and its submerchants. Payment history and refunds remain available."}</p>}
      {displayChoice?.kind === "enrollment" && <p>{displayChoice.enabled ? "Connect this merchant to sandbox payments. Turn on a channel after connecting." : "Stop new sandbox payments for this merchant. Other merchants stay connected."}</p>}
      {displayChoice?.kind === "activation" && <><dl className="mop-summary"><div><dt>Channel</dt><dd>{nameFor(displayChoice.channelId)}</dd></div><div><dt>Amount</dt><dd>{amountFor(displayChoice.channelId) ? formatMoney(amountFor(displayChoice.channelId)!) : "Unavailable"}</dd></div></dl><p>{displayChoice.active ? "Make this channel available for sandbox payments. No link or message is sent to a customer." : "Stop new sandbox payments through this channel. Its history remains available."}</p></>}
      {displayChoice?.kind === "payment" && <>{receipt(displayChoice.payment)}<div className="mop-actions"><Button variant="quiet" onClick={close}>Back to payments</Button>{showAdministration && displayChoice.payment.canRefund && <Button disabled={locked} variant="secondary" onClick={() => { setChoice({ kind: "refund", payment: displayChoice.payment }); setOpen(true); setReview(false); setReason(""); }}>Refund payment</Button>}</div></>}
      {displayChoice?.kind === "refund" && <>{receipt(displayChoice.payment)}{review ? <><dl className="mop-summary"><div><dt>Refund reason</dt><dd>{reason}</dd></div></dl><p>The full {formatMoney(displayChoice.payment.amount)} returns from this merchant’s available sandbox funds. The original receipt stays saved.</p></> : <label className="mop-field">Reason for refund<textarea required maxLength={300} rows={3} value={reason} disabled={locked} onChange={event => setReason(event.target.value)} /></label>}</>}
      {displayChoice?.kind === "payout" && <>{review ? <dl className="mop-summary"><div><dt>Transfer amount</dt><dd>{formatMoney(minorAmount(amount) ?? "0")}</dd></div><div><dt>Destination</dt><dd>Sandbox destination · no bank account connected</dd></div></dl> : <><p>Available sandbox funds: <strong>{operations.availableFunds ? formatMoney(operations.availableFunds) : "Unavailable"}</strong></p><label className="mop-field">Transfer amount (USD)<input value={amount} maxLength={13} inputMode="decimal" autoComplete="off" disabled={locked} onChange={event => setAmount(event.target.value)} placeholder="0.00" /></label></>}<p>This transfer uses your available sandbox funds. No money leaves the sandbox.</p></>}
      {displayChoice && displayChoice.kind !== "payment" && <div className="mop-actions"><Button variant="quiet" disabled={locked} onClick={() => review ? setReview(false) : close()}>{review ? "Back to details" : "Cancel"}</Button>{(displayChoice.kind === "refund" || displayChoice.kind === "payout") && !review ? <Button disabled={locked} onClick={reviewDetails}>{displayChoice.kind === "refund" ? "Review refund" : "Review transfer"}</Button> : <Button busy={busy} disabled={locked} onClick={confirm}>{displayChoice.kind === "refund" ? "Confirm full refund" : displayChoice.kind === "payout" ? "Confirm sandbox transfer" : "Confirm setting"}</Button>}</div>}
    </WorkspaceDialog>
  </section>;
}

export function MerchantCheckout({ initial }: { initial: MerchantCheckoutProjection }) {
  const { workspace, channel } = initial;
  const [presentation, setPresentation] = useState<ChannelPresentation>(channel.presentations[0] ?? "WEB");
  const [current, setCurrent, changed, isCurrent] = useServerProjection(initial);
  const activation=current.activation;
  const [review, setReview] = useState<"APPROVED" | "DECLINED" | null>(null);
  const [attempt, setAttempt] = useState<{ commandId: string; expectedChannelVersion: number; outcome: "APPROVED" | "DECLINED" } | null>(null);
  const [result, setResult] = useState<MerchantTestPayment | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busy, setBusy] = useState(false);
  const [stale, setStale] = useState(false);
  if(changed){setReview(null);setResult(null);setNotice(null);setBusy(false);setStale(false);if(!channel.presentations.includes(presentation))setPresentation(channel.presentations[0]??"WEB");}
  const locked = busy || !!attempt || stale;
  async function pay(input: NonNullable<typeof attempt>) {
    const retrying=attempt!==null;
    setBusy(true); setAttempt(input); setNotice(null);
    try {
      const saved = await merchantCommand<MerchantTestPayment>(workspace.merchant.id, `/channels/${channel.id}/test-payments`, "POST", input);
      if(!isCurrent())return;
      setResult(saved); setAttempt(null); setReview(null); setStale(false);
      if (saved.status !== "DECLINED" && channel.usage === "ONE_TIME") setCurrent(current => ({ ...current, activation: {...current.activation,state: "USED", canSimulate: false, previewHref: null} }));
      setNotice({ kind: "success", message: saved.status === "DECLINED" ? "Sandbox payment declined. No funds moved; you can try again." : saved.status === "REFUNDED" ? "Recovered this payment’s latest saved result: fully refunded." : "Sandbox payment approved. Your receipt is saved below." });
    } catch (error) {
      if(!isCurrent())return;
      if (error instanceof WorkspaceCommandError && !error.uncertain) { if(!retrying)setAttempt(null); setStale([401, 403, 404, 409].includes(error.status ?? 0)); }
      setNotice({ kind: "error", message: failure(error) });
    } finally { if(isCurrent())setBusy(false); }
  }
  return <div className="mop-checkout"><Link className="mop-back" href={`/merchants/${workspace.merchant.id}?tab=payments`}>← Back to merchant payments</Link><div className="mop-panel"><span className="mop-test-badge">Payment preview</span><p className="consumer-eyebrow">{workspace.merchant.displayName}</p><h1>{channel.description}</h1><p>Collected for {workspace.merchant.master.displayName}</p><strong className="mop-checkout-amount">{formatMoney(channel.amount)}</strong><p>{channel.usage === "ONE_TIME" ? "One successful payment" : "Reusable payment channel"} · Expires {formatDate(channel.expiresAt)}</p><div className="mop-notice">Sandbox preview. Use practice funds; no real card or bank details are needed.</div>{notice && <Feedback {...notice} />}{attempt && !busy && <Button onClick={() => void pay(attempt)}>Retry same payment</Button>}{stale && !attempt && <Button variant="secondary" onClick={() => window.location.reload()}>Reload payment preview</Button>}
      <PresentationPreview initial={initial} selected={presentation} onSelect={setPresentation} />
      {result && <section className="mop-test-receipt" aria-label="Sandbox payment result"><h2>{result.status === "DECLINED" ? "Payment attempt" : "Receipt"}</h2><dl className="mop-summary"><div><dt>Status</dt><dd><StatusBadge status={result.status} /></dd></div><div><dt>Amount</dt><dd>{formatMoney(result.amount)}</dd></div><div><dt>Reference</dt><dd className="mop-reference">{result.testReference}</dd></div><div><dt>Recorded</dt><dd>{formatDate(result.createdAt)}</dd></div><div><dt>Fees</dt><dd>Not applied</dd></div></dl></section>}
      {activation.canSimulate ? <><h2>Try this payment</h2><p>Choose an outcome below. This sandbox uses the saved channel amount.</p><div className="mop-actions"><Button disabled={locked} onClick={() => { setReview("APPROVED"); setNotice(null); }}>Try approved payment</Button><Button variant="secondary" disabled={locked} onClick={() => { setReview("DECLINED"); setNotice(null); }}>Try declined payment</Button></div></> : <EmptyState title={activation.state === "USED" ? "This channel has already been paid" : "This channel is not ready for payments"} description={activation.state === "USED" ? "A one-time channel accepts one successful sandbox payment, including when that payment is later refunded." : "Return to Payment setup to review this merchant and channel."} />}
    </div><WorkspaceDialog open={!!review} onClose={() => { if (!busy) setReview(null); }} title="Review sandbox payment" serviceName={workspace.merchant.displayName}><dl className="mop-summary"><div><dt>Primary merchant</dt><dd>{workspace.merchant.master.displayName}</dd></div><div><dt>Payment</dt><dd>{channel.description}</dd></div><div><dt>Amount</dt><dd>{formatMoney(channel.amount)}</dd></div><div><dt>Sandbox outcome</dt><dd>{review === "APPROVED" ? "Approved" : "Declined"}</dd></div></dl><p>{review === "APPROVED" ? "An approved payment adds this amount to the merchant’s sandbox balance." : "A declined payment is recorded without moving funds."}</p>{notice && <Feedback {...notice} />}{attempt && !busy ? <Button onClick={() => void pay(attempt)}>Retry same payment</Button> : <div className="mop-actions"><Button variant="quiet" disabled={locked} onClick={() => setReview(null)}>Back</Button><Button busy={busy} disabled={locked} onClick={() => review && void pay({ commandId: crypto.randomUUID(), expectedChannelVersion: channel.version, outcome: review })}>Confirm sandbox payment</Button></div>}</WorkspaceDialog></div>;
}

const formatLabels: Record<ChannelPresentation, string> = { SMS: "SMS / text", EMAIL: "Email", INVOICE: "Invoice", BILL: "Bill", SOCIAL: "Social media", QR: "QR code", WEB: "Website link" };
function PresentationPreview({ initial, selected, onSelect }: { initial: MerchantCheckoutProjection; selected: ChannelPresentation; onSelect: (value: ChannelPresentation) => void }) {
  const { channel, workspace, previewUrl, qrDataUrl } = initial;
  const merchant = workspace.merchant;
  const link = <a href={previewUrl} className="mop-preview-link">Open payment preview</a>;
  return <section className="mop-presentation" aria-label="Channel presentation preview"><label className="mop-field">Preview format<select value={selected} onChange={event => onSelect(event.target.value as ChannelPresentation)}>{channel.presentations.map(format => <option key={format} value={format}>{formatLabels[format]}</option>)}</select></label><p className="mop-preview-caption">Preview only · Not published or sent · The same amount in every format.</p>
    {selected === "SMS" && <div className="mop-message-preview"><p className="consumer-eyebrow">TEXT MESSAGE PREVIEW</p><div className="mop-message-bubble"><p>{merchant.displayName} requests {formatMoney(channel.amount)} for {channel.description}.</p>{link}<p className="mop-muted">Sandbox payment · Sign-in required</p></div><p className="mop-preview-caption">No phone number selected. Nothing is sent.</p></div>}
    {selected === "EMAIL" && <div className="mop-email-preview"><dl className="mop-summary"><div><dt>To</dt><dd>Recipient not selected</dd></div><div><dt>Subject</dt><dd>Payment request · {channel.description}</dd></div></dl><p>Please review this payment request from {merchant.displayName}.</p><p><strong>{formatMoney(channel.amount)}</strong> for {channel.description}</p><p>Primary merchant: {merchant.master.displayName}</p>{link}<p className="mop-preview-caption">Email preview only. No email is sent.</p></div>}
    {(selected === "INVOICE" || selected === "BILL") && <div className="mop-document-preview"><div className="mop-document-heading"><h3>{selected === "INVOICE" ? "Invoice preview" : "Bill preview"}</h3><span>Not issued</span></div><p><strong>{merchant.master.displayName}</strong><br />Merchant: {merchant.displayName}</p><dl className="mop-summary"><div><dt>Item or purpose</dt><dd>{channel.description}</dd></div><div><dt>Requested amount</dt><dd>{formatMoney(channel.amount)}</dd></div><div><dt>Channel expires</dt><dd>{formatDate(channel.expiresAt)}</dd></div></dl><p>Open the sandbox payment:</p>{link}<p className="mop-preview-caption">This is a request preview, not a receipt or tax document. A sandbox receipt follows an approved payment.</p></div>}
    {selected === "SOCIAL" && <div className="mop-social-preview"><p className="consumer-eyebrow">SOCIAL POST PREVIEW</p><h3>{merchant.displayName}</h3><p>{channel.description}</p><strong>{formatMoney(channel.amount)}</strong><p>View this sandbox payment:</p>{link}<p className="mop-preview-caption">No social media account is connected. Nothing is posted.</p></div>}
    {selected === "QR" && <div className="mop-qr-preview"><h3>Scan to open this payment preview</h3>{qrDataUrl ? <Image src={qrDataUrl} width={256} height={256} unoptimized alt="QR code for this sandbox payment preview" /> : <p>The QR image is unavailable. Use the exact preview link below.</p>}{link}<p className="mop-preview-caption">Sign in to view this sandbox payment. Scanning the code does not make a payment.</p></div>}
    {selected === "WEB" && <div className="mop-web-preview"><p className="consumer-eyebrow">WEBSITE PAYMENT PREVIEW</p><h3>{channel.description}</h3><p>Payment to {merchant.displayName}.</p><strong>{formatMoney(channel.amount)}</strong><p>Open your payment preview:</p>{link}<p className="mop-preview-caption">Try the outcomes below. This checkout is available only in the sandbox.</p></div>}
  </section>;
}

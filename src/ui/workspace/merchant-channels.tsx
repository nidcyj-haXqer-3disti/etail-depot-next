"use client";

import {paymentChannelSchema} from "@/shared/merchant-response";
import {useServerProjection} from "./use-server-projection";

import { useId, useState } from "react";
import Link from "next/link";
import {merchantActivityHref,merchantActivityReturn,merchantRecordHref,parseMerchantActivityFilters} from "@/shared/merchant-activity";
import {useMerchantNavigationLock} from "./merchant-navigation-state";
import "./merchant-channels.css";
import type { MerchantOperationsProjection } from "@/modules/acquiring/operations-contracts";
import { MerchantOperations } from "./merchant-operations";
import {MerchantChannelPublication,type PublicationAttempt} from "./merchant-channel-publication";
import {useRouter,useSearchParams} from "next/navigation";
import type { ChannelPresentation, MerchantWorkspaceProjection, PaymentChannel } from "@/modules/acquiring/contracts";
import { Button, EmptyState, Feedback, StatusBadge, WorkspaceCommandError, WorkspaceDialog, formatMoney, merchantCommand } from "./primitives";

type Form = { description: string; amount: string; usage: PaymentChannel["usage"]; expires: string; presentations: ChannelPresentation[]; visibility: PaymentChannel["visibility"] };
type Mode = "closed" | "view" | "edit" | "review" | "cancel";
type Attempt = { path: string; method: "POST" | "PATCH"; body: Record<string, unknown> };
export const presentationLabels: Record<ChannelPresentation, string> = { SMS: "SMS / text", EMAIL: "Email", INVOICE: "Invoice", BILL: "Bill", SOCIAL: "Social media", QR: "QR code", WEB: "Website link" };
function minorAmount(value: string): string | null {
  if (!/^\d{1,10}(?:\.\d{1,2})?$/.test(value.trim())) return null;
  const [whole, fraction = ""] = value.trim().split(".");
  const minor = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
  return minor > 0n && minor <= 999999999999n ? minor.toString() : null;
}
function formFor(channel?: PaymentChannel): Form {
  return channel ? { description: channel.description, amount: `${BigInt(channel.amount.minor) / 100n}.${(BigInt(channel.amount.minor) % 100n).toString().padStart(2, "0")}`, usage: channel.usage, expires: channel.expiresAt.slice(0, 16), presentations: channel.presentations, visibility: "ASSIGNED" } : { description: "", amount: "", usage: "ONE_TIME", expires: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16), presentations: ["WEB"], visibility: "ASSIGNED" };
}
function expiry(iso: string) { return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(iso)) + " UTC"; }

export function MerchantChannels({ initial, operations: initialOperations,showSetup=true }: { initial: MerchantWorkspaceProjection; operations?: MerchantOperationsProjection;showSetup?:boolean }) {
  const params=useSearchParams(),router=useRouter();
  const [workspace, setWorkspace, projectionChanged, isCurrent] = useServerProjection(initial);
  const requestedChannel = params.getAll("channel");
  const initialChannel = requestedChannel.length === 1 ? initial.channels.find(channel => channel.id === requestedChannel[0]) ?? null : null;
  const [selected, setSelected] = useState<PaymentChannel | null>(initialChannel);
  const [operations, setOperations] = useState(initialOperations);
  const [operationsBusy, setOperationsBusy] = useState(false);
  const [operationsError, setOperationsError] = useState(false);
  const [mode, setMode] = useState<Mode>(initialChannel?"view":initial.canCreateChannel&&params.get("tab")!=="help"&&params.getAll("new").length===1&&params.get("new")==="1"?"edit":"closed");
  const newForm = ():Form => ({ ...formFor(), presentations: workspace.allowedPresentations.includes("WEB") ? ["WEB"] : workspace.allowedPresentations.slice(0, 1) });
  const [form, setForm] = useState<Form>(() => newForm());
  const search = params.getAll("channelSearch").length === 1 ? (params.get("channelSearch") ?? "").slice(0, 160) : "";
  const requestedStatus = params.getAll("channelStatus").length === 1 ? params.get("channelStatus") : null;
  const status = ["ACTIVE", "DISABLED", "USED", "EXPIRED", "NOT_READY", "CANCELED"].includes(requestedStatus ?? "") ? requestedStatus! : "ALL";
  const [operationsPending, setOperationsPending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [publicationAttempt,setPublicationAttempt]=useState<PublicationAttempt|null>(null);
  const [stale, setStale] = useState(false);
  const [notice, setNotice] = useState<{ kind: "success" | "error" | "info"; message: string } | null>(null);
  if (projectionChanged) {
    const current=selected?initial.channels.find(channel=>channel.id===selected.id):undefined;
    if(selected){setSelected(current??null);if(!current){setMode("closed");setForm(formFor());}else if(!attempt){setMode("view");setForm(formFor(current));}}
    if(attempt?.path==="/channels"&&!initial.canCreateChannel){setMode("closed");setForm(formFor());}
    setOperations(initialOperations);setOperationsBusy(false);setOperationsError(false);
    setBusy(false);setStale(false);setNotice(null);
  }
  const expiryId = useId(), formId = useId();
  const dashboardReturn=params.getAll("returnTo").length===1?merchantActivityReturn(params.get("returnTo")):null;
  const attemptVisible=!!attempt&&(attempt.path==="/channels"?workspace.canCreateChannel:workspace.channels.some(channel=>channel.id===attempt.path.split("/")[2]));
  const publicationVisible=!!publicationAttempt&&workspace.channels.some(channel=>channel.id===publicationAttempt.channelId);
  const recoveryUnavailable=!!attempt&&!attemptVisible||!!publicationAttempt&&!publicationVisible;
  const pending = busy || !!attempt || !!publicationAttempt || operationsPending;
  const locked = pending || stale;
  useMerchantNavigationLock(pending);
  const selectionKey = `${params.getAll("channel").join(",")}|${params.getAll("new").join(",")}`;
  const [lastSelection, setLastSelection] = useState(selectionKey);
  if (lastSelection !== selectionKey && !pending) {
    setLastSelection(selectionKey);
    const target = requestedChannel.length === 1 ? workspace.channels.find(channel => channel.id === requestedChannel[0]) ?? null : null;
      setSelected(target); setForm(target ? formFor(target) : newForm()); setNotice(null);
      setMode(target ? "view" : workspace.canCreateChannel && params.get("tab")!=="help" && params.getAll("new").length === 1 && params.get("new") === "1" ? "edit" : "closed");
  }
  function channelState(channel: PaymentChannel) {
    if (channel.status === "CANCELED") return { status: "CANCELED", label: "Closed", next: "History remains available" };
    if (channel.status === "EXPIRED") return { status: "EXPIRED", label: "Expired", next: "Payments have stopped" };
    const state = operations?.channels.find(row => row.channelId === channel.id)?.state;
    const labels = { ACTIVE: ["Ready to collect", "Open to manage your customer link"], DISABLED: ["Off", "Turn on when you’re ready"], USED: ["Already paid", "Open to view the payment receipt"], EXPIRED: ["Expired", "Payments have stopped"], NOT_READY: ["Setup needed", "Review payment setup and access"] } as const;
    return state ? { status: state, label: labels[state][0], next: labels[state][1] } : { status: "DRAFT", label: "Saved", next: "Open to check payment availability" };
  }
  const merchant = workspace.merchant;
  const recoveryHref=dashboardReturn??merchantActivityHref(parseMerchantActivityFilters({section:"merchants",view:workspace.ownerAccess?`merchant:${merchant.merchant.serviceId}`:`unit:${merchant.id}`}));
  const rows = workspace.channels.filter(channel => (status === "ALL" || channelState(channel).status === status) && channel.description.toLowerCase().includes(search.trim().toLowerCase()));
  const title = mode === "edit" ? selected ? "Edit payment request" : "New payment request" : mode === "review" ? "Review payment request" : mode === "cancel" ? "Close this payment request?" : "Payment request details";

  function updateQuery(changes: Record<string, string | null>, push = false) {
    const query = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) { if (value) query.set(key, value); else query.delete(key); }
    const href = `${window.location.pathname}?${query}`;
    if (push) window.history.pushState(null, "", href); else window.history.replaceState(null, "", href);
  }
  function start() { if (locked) return; updateQuery({ channel: null, new: "1" }, true); setSelected(null); setForm(newForm()); setMode("edit"); setNotice(null); }
  function open(channel: PaymentChannel) { if (locked) return; updateQuery({ channel: channel.id, new: null }, true); setSelected(channel); setForm(formFor(channel)); setMode("view"); setNotice(null); void loadOperations(); }
  function close() { if (!pending) { updateQuery({ channel: null, new: null }); setMode("closed"); void loadOperations(); } }
  function review() {
    const date = new Date(`${form.expires}:00.000Z`);
    if (!form.description.trim() || /[\u0000-\u001f\u007f-\u009f]/.test(form.description)) { setNotice({ kind: "error", message: "Describe what the payment is for using plain text." }); return; }
    if (!minorAmount(form.amount)) { setNotice({ kind: "error", message: "Enter a positive USD amount with no more than two decimal places, up to 9,999,999,999.99." }); return; }
    if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now() || date.getTime() > Date.now() + 366 * 86400000) { setNotice({ kind: "error", message: "Choose an expiry date within the next 366 days. Times use UTC." }); return; }
    if (!form.presentations.length) { setNotice({ kind: "error", message: "Choose at least one sharing method." }); return; }
    setNotice(null); setMode("review");
  }
  async function loadOperations() {
    setOperationsBusy(true); setOperationsError(false);
    try {
      const response = await fetch(`/api/v1/merchants/${encodeURIComponent(merchant.id)}/operations`, { credentials: "same-origin", cache: "no-store" });
      if (!response.ok) throw new Error("Payment controls could not load.");
      const next = await response.json() as MerchantOperationsProjection;
      if (isCurrent()) setOperations(next);
    } catch {
      if (isCurrent()) { setOperations(undefined); setOperationsError(true); }
    } finally { if (isCurrent()) setOperationsBusy(false); }
  }
  async function refresh() {
    setBusy(true);
    try {
      const response = await fetch(`/api/v1/merchants/${encodeURIComponent(merchant.id)}`, { credentials: "same-origin", cache: "no-store" });
      if(!isCurrent())return;
      if (!response.ok) throw new WorkspaceCommandError("You cannot view this payment terminal with your current access. Return to payments or reload this page.", response.status);
      const next = await response.json() as MerchantWorkspaceProjection;
      if(!isCurrent())return;
      setWorkspace(next); setStale(false); void loadOperations();
      if (selected) {
        const current = next.channels.find(channel => channel.id === selected.id);
        setSelected(current ?? null);
        if (!current) setMode("closed");
        else if (!current.canEdit) setMode("view");
        else if (mode === "review") setMode("edit");
      }
      setNotice({ kind: "info", message: "Payment requests refreshed. Review any unsaved changes before saving." });
    } catch (error) {
      if(!isCurrent())return;
      if (error instanceof WorkspaceCommandError && [401, 403, 404].includes(error.status ?? 0)) { setWorkspace(current => ({ ...current, channels: [], canCreateChannel: false })); setOperations(undefined); setSelected(null); setMode("closed"); }
      setNotice({ kind: "error", message: error instanceof Error ? error.message : "We couldn’t reload payment requests. Please retry." });
    } finally { if(isCurrent())setBusy(false); }
  }
  async function send(command: Attempt) {
    const retrying=attempt!==null;
    setBusy(true); setAttempt(command); setNotice(null);
    try {
      const parsed=paymentChannelSchema.safeParse(await merchantCommand<unknown>(merchant.id,command.path,command.method,command.body));
      if(!parsed.success||parsed.data.merchantUnitId!==merchant.id||parsed.data.serviceId!==merchant.merchant.serviceId||(command.path!=="/channels"&&parsed.data.id!==command.path.split("/")[2]))throw new WorkspaceCommandError("We couldn’t confirm this payment request. Check this request again.",null);
      const next=parsed.data;
      if(!isCurrent())return;
      setWorkspace(current => { const channels = [next, ...current.channels.filter(channel => channel.id !== next.id)]; return { ...current, channels }; });
      updateQuery({ channel: next.id, new: null }); setSelected(next); setForm(formFor(next)); setAttempt(null); setStale(false); setMode("view");
      void loadOperations();
      setNotice(next.status === "CANCELED" ? { kind: "success", message: `Payment request closed in ${merchant.displayName}. Its saved history remains available.` } : null);
    } catch (error) {
      if(!isCurrent())return;
      if (error instanceof WorkspaceCommandError && !error.uncertain) { if(!retrying)setAttempt(null); setStale([401, 403, 404, 409].includes(error.status ?? 0)); }
      setNotice({ kind: "error", message: error instanceof Error ? error.message : "We couldn’t confirm the result. Check this request again." });
    } finally { if(isCurrent())setBusy(false); }
  }
  function save() {
    const amountMinor = minorAmount(form.amount); if (!amountMinor) return;
    void send({ path: selected ? `/channels/${selected.id}` : "/channels", method: selected ? "PATCH" : "POST", body: { commandId: crypto.randomUUID(), ...(selected ? { expectedVersion: selected.version } : {}), description: form.description.trim(), amountMinor, currency: "USD", usage: form.usage, expiresAt: new Date(`${form.expires}:00.000Z`).toISOString(), presentations: form.presentations, visibility: "ASSIGNED" } });
  }
  const feedback = <>{pending && <p className="mn-notice" role="status">Keep this request open until its result is confirmed. If the connection is interrupted, check the same request again here.</p>}{recoveryUnavailable&&<div className="mn-notice" role="status"><p>Your current access no longer includes this request’s details. Its result is still unconfirmed. Retrying uses the same saved request and checks your current access.</p><p>Leaving does not cancel or confirm the request. Check your saved payment history when your access is restored.</p><Button variant="quiet" disabled={busy} onClick={()=>router.push(recoveryHref)}>Leave for now</Button></div>}{publicationAttempt&&mode==="closed"&&publicationVisible&&<Button variant="secondary" onClick={()=>{const channel=workspace.channels.find(row=>row.id===publicationAttempt.channelId)!;setSelected(channel);setMode("view");}}>Resume link request</Button>}{publicationAttempt&&!publicationVisible&&<MerchantChannelPublication merchantId={merchant.id} channel={null} attempt={publicationAttempt} onAttempt={next=>{setPublicationAttempt(next);if(!next)void refresh();}} onBusyChange={setBusy} />}{notice && <Feedback {...notice} />}{attempt && !busy && <Button variant="secondary" onClick={() => void send(attempt)}>Check request again</Button>}{(stale||recoveryUnavailable) && <Button variant="secondary" busy={busy} onClick={() => void refresh()}>Reload requests</Button>}{attempt && attemptVisible && mode === "closed" && <Button variant="quiet" onClick={() => setMode(attempt.path.endsWith("/close") ? "cancel" : "review")}>Continue payment request</Button>}</>;
  const details = (channel: PaymentChannel) => <dl className="mn-review"><div><dt>Payment terminal</dt><dd>{merchant.displayName}</dd></div><div><dt>Business</dt><dd>{merchant.merchant.displayName}</dd></div><div><dt>Payment request</dt><dd>{channel.description}</dd></div><div><dt>Amount</dt><dd>{formatMoney(channel.amount)}</dd></div><div><dt>Use</dt><dd>{channel.usage === "ONE_TIME" ? "One-time" : "Reusable"}</dd></div><div><dt>Ways to share</dt><dd>{channel.presentations.map(value => presentationLabels[value]).join(", ")}</dd></div><div><dt>Visibility</dt><dd>{"People assigned to this terminal and the account owner"}</dd></div><div><dt>Expires</dt><dd>{expiry(channel.expiresAt)}</dd></div><div><dt>Status</dt><dd><StatusBadge status={channelState(channel).status} label={channelState(channel).label} /></dd></div></dl>;

  return <section className="mch-workspace" aria-labelledby="merchant-channels-title"><div className="mn-heading"><div><h2 id="merchant-channels-title">Payment channels</h2><p>Choose an amount, then share a link for your customer to pay.</p></div>{workspace.canCreateChannel && <Button disabled={locked} onClick={start}>New payment request</Button>}</div><p className="mch-intro">Save your request, allow payments, then create a payment link to share. Each completed payment gets a receipt.</p>{mode === "closed" && feedback}{showSetup && mode === "closed" && operations && <MerchantOperations workspace={workspace} initial={operations} section="onboarding" showAdministration={workspace.ownerAccess} onPendingChange={setOperationsPending} onOperationsChange={setOperations} />}<div className="mn-panel"><div className="mn-filters"><label>Find a payment request<input type="search" value={search} maxLength={160} disabled={locked} onChange={event => updateQuery({ channelSearch: event.target.value || null })} placeholder="What is this payment for?" /></label><label>Request status<select value={status} disabled={locked} onChange={event => updateQuery({ channelStatus: event.target.value === "ALL" ? null : event.target.value })}><option value="ALL">All statuses</option><option value="ACTIVE">Ready to collect</option><option value="DISABLED">Off</option><option value="USED">Already paid</option><option value="NOT_READY">Setup needed</option><option value="EXPIRED">Expired</option><option value="CANCELED">Closed</option></select></label><Button variant="quiet" disabled={locked} onClick={() => void refresh()}>Reload requests</Button></div><p className="mch-result-count" aria-live="polite">{rows.length} of {workspace.channels.length} payment requests shown</p>{requestedChannel.length > 0 && !selected && <EmptyState title="This payment request is unavailable" description="It may belong to another payment terminal or no longer be available with your access. No other request has been opened."><Button variant="quiet" disabled={locked} onClick={() => updateQuery({ channel: null })}>Back to payment requests</Button></EmptyState>}{rows.length ? <ul className="mn-list mch-channel-list">{rows.map(channel => <li key={channel.id}><button type="button" className="mn-channel-row" disabled={locked} onClick={() => open(channel)} aria-label={`View payment request ${channel.description}`}><span><strong>{channel.description}</strong><small>{channel.presentations.map(value => presentationLabels[value]).join(" · ")}</small><small>{"This terminal"} · {channel.usage === "ONE_TIME" ? "One-time" : "Reusable"}</small></span><span className="mch-row-amount"><strong>{formatMoney(channel.amount)}</strong><StatusBadge status={channelState(channel).status} label={channelState(channel).label} /><small>{channelState(channel).next}</small></span></button></li>)}</ul> : <EmptyState title={search || status !== "ALL" ? "No matching payment requests" : "Create your first payment request"} description={search || status !== "ALL" ? "Try another name or status." : workspace.canCreateChannel ? "Choose an amount and describe what your customer is paying for." : "No payment requests are available to you. Ask your account owner to review your access."} />}{workspace.channelsHasMore && <p className="mn-muted">This list shows your most recent payment requests. Search and filters apply to this list; earlier requests remain saved.</p>}</div>
    <WorkspaceDialog open={mode !== "closed"} onClose={close} title={title} serviceName={merchant.displayName} wide footer={mode === "edit" ? <div className="mn-actions mn-channel-actions"><Button variant="quiet" disabled={locked} onClick={close}>Discard changes</Button><Button type="submit" form={formId} disabled={locked}>Review request</Button></div> : mode === "review" ? <div className="mn-actions mn-channel-actions"><Button variant="quiet" disabled={locked} onClick={() => { setMode("edit"); setNotice(null); }}>Back to details</Button><Button busy={busy} disabled={locked} onClick={save}>Save payment request</Button></div> : undefined}>{mode!=="closed"&&feedback}{mode === "edit" ? <form id={formId} className="mn-form mn-channel-form" onSubmit={event => { event.preventDefault(); review(); }}><label>What is this payment for?<input required maxLength={160} value={form.description} disabled={locked} onChange={event => setForm({ ...form, description: event.target.value })} placeholder="For example, Garden market orders" /></label><div className="mn-form-grid"><label>Amount (USD)<input required inputMode="decimal" autoComplete="off" maxLength={13} value={form.amount} disabled={locked} onChange={event => setForm({ ...form, amount: event.target.value })} placeholder="0.00" /></label></div><fieldset disabled={locked}><legend>How will you share the payment request?</legend><div className="mn-checks">{Object.entries(presentationLabels).filter(([value])=>workspace.allowedPresentations.includes(value as ChannelPresentation)).map(([value, label]) => <label key={value}><input type="checkbox" checked={form.presentations.includes(value as ChannelPresentation)} onChange={event => setForm({ ...form, presentations: event.target.checked ? [...form.presentations, value as ChannelPresentation] : form.presentations.filter(item => item !== value) })} />{label}</label>)}</div></fieldset><p className="mn-muted">Choose a sharing method. Each method uses the same payment link and amount. After saving, create the link and copy it to share. Messages are not sent automatically.</p><details className="mop-settings"><summary>More options · use and expiry</summary><p className="mn-muted">By default, the request accepts one payment and expires in 7 days. The account owner and people assigned to this terminal can see it.</p><label>Request use<select value={form.usage} disabled={locked} onChange={event => setForm({ ...form, usage: event.target.value as Form["usage"] })}><option value="ONE_TIME">One-time</option><option value="REUSABLE">Reusable</option></select></label><div><label>Expires at (UTC)<input type="datetime-local" required aria-describedby={expiryId} value={form.expires} disabled={locked} onChange={event => setForm({ ...form, expires: event.target.value })} /></label><small id={expiryId}>Choose a future date within 366 days. Payments stop at this time.</small></div></details></form> : mode === "review" ? <><dl className="mn-review"><div><dt>Payment terminal</dt><dd>{merchant.displayName}</dd></div><div><dt>Business</dt><dd>{merchant.merchant.displayName}</dd></div><div><dt>Payment request</dt><dd>{form.description}</dd></div><div><dt>Amount</dt><dd>{formatMoney(minorAmount(form.amount) ?? "0")}</dd></div><div><dt>Use</dt><dd>{form.usage === "ONE_TIME" ? "One-time" : "Reusable"}</dd></div><div><dt>Ways to share</dt><dd>{form.presentations.map(value => presentationLabels[value]).join(", ")}</dd></div><div><dt>Visibility</dt><dd>{"People assigned to this terminal and the account owner"}</dd></div><div><dt>Expires</dt><dd>{form.expires.replace("T", " ")} UTC</dd></div></dl><div className="mn-notice">Save these details, allow payments, then create a payment link to share. Nothing is sent automatically.</div></> : selected ? <><div className="mch-channel-hero"><div><p className="consumer-eyebrow">PAYMENT REQUEST</p><h3>{selected.description}</h3><p>{selected.usage === "ONE_TIME" ? "One successful payment" : "Reusable for multiple payments"} · {merchant.displayName}</p></div><div><strong>{formatMoney(selected.amount)}</strong><StatusBadge status={channelState(selected).status} label={channelState(selected).label} /></div></div>{mode === "view" && selected.status === "DRAFT" && <>{operationsBusy && !operations ? <p role="status">Loading payment settings for this request…</p> : operations && operations.channels.some(channel => channel.channelId === selected.id) ? <MerchantOperations key={selected.id} workspace={workspace} initial={operations} section="channel" channelId={selected.id} showAdministration={workspace.ownerAccess} onPendingChange={setOperationsPending} onOperationsChange={setOperations} blocked={busy || !!attempt || !!publicationAttempt || stale} /> : <div className="mn-notice"><p>{operationsError ? "Your request is saved, but its payment settings could not load." : "Reload payment settings to continue with this request."}</p><Button variant="secondary" onClick={() => void loadOperations()}>Reload payment settings</Button></div>}</>}{mode === "view" && <MerchantChannelPublication merchantId={merchant.id} channel={selected} attempt={publicationAttempt} onAttempt={setPublicationAttempt} onAccessDenied={()=>setStale(true)} blocked={busy || !!attempt || operationsPending || stale} activationState={operations?.channels.find(row => row.channelId === selected.id)?.state} />}{mode === "view" && operations?.canReadPayments && <section className="mch-receipts" aria-label="Payments for this request"><h3>Payments for this request</h3>{operations.payments.filter(payment => payment.channelId === selected.id).length ? <ul>{operations.payments.filter(payment => payment.channelId === selected.id).slice(0, 5).map(payment => <li key={payment.id}><div><strong>{formatMoney(payment.amount)}</strong><StatusBadge status={payment.status} /><small>{payment.testReference}</small></div>{pending ? <Button disabled variant="quiet">View payment receipt</Button> : <Link href={merchantRecordHref(merchant.id,{tab:"payments",payment:payment.id},dashboardReturn)}>View payment receipt</Link>}</li>)}</ul> : <p>No one has paid this request yet.</p>}<p className="mn-muted">The five most recent records are shown here. Full payment history remains in Payments.</p></section>}<details className="mop-settings" open={mode === "cancel"}><summary>Request details</summary>{details(selected)}</details>{mode === "cancel" ? <><p className="mn-muted">Close this payment request in {merchant.displayName}. Its records remain saved and it cannot be reopened.</p><div className="mn-actions"><Button variant="quiet" disabled={locked} onClick={() => setMode("view")}>Keep request open</Button><Button variant="danger" busy={busy} disabled={locked} onClick={() => void send({ path: `/channels/${selected.id}/close`, method: "POST", body: { commandId: crypto.randomUUID(), expectedVersion: selected.version } })}>Confirm close</Button></div></> : <><div className="mn-actions"><Button variant="quiet" disabled={pending} onClick={close}>Close details</Button>{selected.canCancel && <Button variant="secondary" disabled={locked} onClick={() => setMode("cancel")}>Close request</Button>}{selected.canEdit && <Button variant="secondary" disabled={locked} onClick={() => { setForm(formFor(selected)); setMode("edit"); setNotice(null); }}>Edit request</Button>}</div></>}</> : null}</WorkspaceDialog>
  </section>;
}

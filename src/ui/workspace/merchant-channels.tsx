"use client";

import {useServerProjection} from "./use-server-projection";

import { useId, useState } from "react";
import type { MerchantOperationsProjection } from "@/modules/acquiring/operations-contracts";
import { MerchantOperations } from "./merchant-operations";
import {MerchantChannelPublication,type PublicationAttempt} from "./merchant-channel-publication";
import {useSearchParams} from "next/navigation";
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
  return channel ? { description: channel.description, amount: `${BigInt(channel.amount.minor) / 100n}.${(BigInt(channel.amount.minor) % 100n).toString().padStart(2, "0")}`, usage: channel.usage, expires: channel.expiresAt.slice(0, 16), presentations: channel.presentations, visibility: channel.visibility } : { description: "", amount: "", usage: "ONE_TIME", expires: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16), presentations: ["WEB"], visibility: "CREATOR_PRIVATE" };
}
function expiry(iso: string) { return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(iso)) + " UTC"; }

export function MerchantChannels({ initial, operations: initialOperations }: { initial: MerchantWorkspaceProjection; operations?: MerchantOperationsProjection }) {
  const params=useSearchParams();
  const [workspace, setWorkspace, projectionChanged, isCurrent] = useServerProjection(initial);
  const requestedChannel = params.getAll("channel");
  const initialChannel = requestedChannel.length === 1 ? initial.channels.find(channel => channel.id === requestedChannel[0]) ?? null : null;
  const [selected, setSelected] = useState<PaymentChannel | null>(initialChannel);
  const [operations, setOperations] = useState(initialOperations);
  const [operationsBusy, setOperationsBusy] = useState(false);
  const [operationsError, setOperationsError] = useState(false);
  const [mode, setMode] = useState<Mode>(initial.canCreateChannel&&params.get("new")==="1"?"edit":initialChannel?"view":"closed");
  const [form, setForm] = useState<Form>(() => formFor());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
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
  const attemptVisible=!!attempt&&(attempt.path==="/channels"?workspace.canCreateChannel:workspace.channels.some(channel=>channel.id===attempt.path.split("/")[2]));
  const locked = busy || !!attempt || !!publicationAttempt || stale;
  const merchant = workspace.merchant;
  const rows = workspace.channels.filter(channel => (status === "ALL" || channel.status === status) && channel.description.toLowerCase().includes(search.trim().toLowerCase()));
  const title = mode === "edit" ? selected ? "Edit payment channel" : "New payment channel" : mode === "review" ? "Review payment channel" : mode === "cancel" ? "Close this payment channel?" : "Payment channel details";
  const canShare = selected?.canShare ?? workspace.canShareChannel;

  function start() { if (locked) return; setSelected(null); setForm(formFor()); setMode("edit"); setNotice(null); }
  function open(channel: PaymentChannel) { if (locked) return; setSelected(channel); setForm(formFor(channel)); setMode("view"); setNotice(null); void loadOperations(); }
  function close() { if (!busy) { setMode("closed"); void loadOperations(); } }
  function review() {
    const date = new Date(`${form.expires}:00.000Z`);
    if (!form.description.trim() || /[\u0000-\u001f\u007f-\u009f]/.test(form.description)) { setNotice({ kind: "error", message: "Enter a channel name without special control characters." }); return; }
    if (!minorAmount(form.amount)) { setNotice({ kind: "error", message: "Enter a positive USD amount with no more than two decimal places, up to 9,999,999,999.99." }); return; }
    if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now() || date.getTime() > Date.now() + 366 * 86400000) { setNotice({ kind: "error", message: "Choose a future expiry within 366 days, using UTC." }); return; }
    if (!form.presentations.length) { setNotice({ kind: "error", message: "Choose at least one way to pay." }); return; }
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
      if (!response.ok) throw new WorkspaceCommandError("This merchant view is unavailable with your current access. Return to Merchant overview or retry.", response.status);
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
      setNotice({ kind: "info", message: "Channels refreshed. Review any unsaved changes before saving." });
    } catch (error) {
      if(!isCurrent())return;
      if (error instanceof WorkspaceCommandError && [401, 403, 404].includes(error.status ?? 0)) { setWorkspace(current => ({ ...current, channels: [], canCreateChannel: false })); setSelected(null); setMode("closed"); }
      setNotice({ kind: "error", message: error instanceof Error ? error.message : "We couldn’t reload channels. Please retry." });
    } finally { if(isCurrent())setBusy(false); }
  }
  async function send(command: Attempt) {
    const retrying=attempt!==null;
    setBusy(true); setAttempt(command); setNotice(null);
    try {
      const next = await merchantCommand<PaymentChannel>(merchant.id, command.path, command.method, command.body);
      if(!isCurrent())return;
      setWorkspace(current => { const channels = [next, ...current.channels.filter(channel => channel.id !== next.id)]; return { ...current, channels }; });
      setSelected(next); setForm(formFor(next)); setAttempt(null); setStale(false); setMode("view");
      void loadOperations();
      setNotice(next.status === "CANCELED" ? { kind: "success", message: `Channel closed in ${merchant.displayName}. Its saved history remains available.` } : null);
    } catch (error) {
      if(!isCurrent())return;
      if (error instanceof WorkspaceCommandError && !error.uncertain) { if(!retrying)setAttempt(null); setStale([401, 403, 404, 409].includes(error.status ?? 0)); }
      setNotice({ kind: "error", message: error instanceof Error ? error.message : "We couldn’t confirm the result. Retry the same request." });
    } finally { if(isCurrent())setBusy(false); }
  }
  function save() {
    const amountMinor = minorAmount(form.amount); if (!amountMinor) return;
    void send({ path: selected ? `/channels/${selected.id}` : "/channels", method: selected ? "PATCH" : "POST", body: { commandId: crypto.randomUUID(), ...(selected ? { expectedVersion: selected.version } : {}), description: form.description.trim(), amountMinor, currency: "USD", usage: form.usage, expiresAt: new Date(`${form.expires}:00.000Z`).toISOString(), presentations: form.presentations, visibility: form.visibility } });
  }
  const feedback = <>{publicationAttempt&&mode==="closed"&&workspace.channels.some(channel=>channel.id===publicationAttempt.channelId)&&<Button variant="secondary" onClick={()=>{const channel=workspace.channels.find(row=>row.id===publicationAttempt.channelId)!;setSelected(channel);setMode("view");}}>Resume link request</Button>}{notice && <Feedback {...notice} />}{attempt && attemptVisible && !busy && <Button variant="secondary" onClick={() => void send(attempt)}>Retry same request</Button>}{stale && <Button variant="secondary" busy={busy} onClick={() => void refresh()}>Reload channels</Button>}{attempt && attemptVisible && mode === "closed" && <Button variant="quiet" onClick={() => setMode(attempt.path.endsWith("/close") ? "cancel" : "review")}>Resume channel request</Button>}</>;
  const details = (channel: PaymentChannel) => <dl className="mn-review"><div><dt>Merchant</dt><dd>{merchant.displayName}</dd></div><div><dt>Primary merchant</dt><dd>{merchant.master.displayName}</dd></div><div><dt>Channel</dt><dd>{channel.description}</dd></div><div><dt>Amount</dt><dd>{formatMoney(channel.amount)}</dd></div><div><dt>Use</dt><dd>{channel.usage === "ONE_TIME" ? "One-time" : "Reusable"}</dd></div><div><dt>Ways to pay</dt><dd>{channel.presentations.map(value => presentationLabels[value]).join(", ")}</dd></div><div><dt>Visibility</dt><dd>{channel.visibility === "CREATOR_PRIVATE" ? "Creator and primary merchant" : "People with channel access"}</dd></div><div><dt>Expires</dt><dd>{expiry(channel.expiresAt)}</dd></div><div><dt>Status</dt><dd><StatusBadge status={channel.status} label={channel.status === "CANCELED" ? "Closed" : channel.status === "DRAFT" ? "Saved" : undefined} /></dd></div></dl>;

  return <section aria-labelledby="merchant-channels-title"><div className="mn-heading"><div><h2 id="merchant-channels-title">Payment channels</h2><p>Create links, QR codes or payment requests with one saved amount.</p></div>{workspace.canCreateChannel && <Button disabled={locked} onClick={start}>New payment channel</Button>}</div><p className="mn-muted">Create a channel, open its checkout and follow every payment from its receipt.</p>{mode === "closed" && feedback}{mode === "closed" && operations && <MerchantOperations workspace={workspace} initial={operations} section="onboarding" showAdministration={workspace.primaryAccess} />}<div className="mn-panel"><div className="mn-filters"><label>Search payment channels<input type="search" value={search} maxLength={160} onChange={event => setSearch(event.target.value)} placeholder="Channel name or purpose" /></label><label>Channel status<select value={status} onChange={event => setStatus(event.target.value)}><option value="ALL">All statuses</option><option value="DRAFT">Saved</option><option value="EXPIRED">Expired</option><option value="CANCELED">Closed</option></select></label><Button variant="quiet" disabled={locked} onClick={() => void refresh()}>Reload channels</Button></div>{rows.length ? <ul className="mn-list">{rows.map(channel => <li key={channel.id}><button type="button" className="mn-channel-row" disabled={locked} onClick={() => open(channel)} aria-label={`View payment channel ${channel.description}`}><span><strong>{channel.description}</strong><small>{channel.presentations.map(value => presentationLabels[value]).join(" · ")}</small><small>{channel.visibility === "CREATOR_PRIVATE" ? "Creator and primary merchant" : "Shared with your team"} · {channel.usage === "ONE_TIME" ? "One-time" : "Reusable"}</small></span><span>{formatMoney(channel.amount)}<StatusBadge status={channel.status} label={channel.status === "CANCELED" ? "Closed" : channel.status === "DRAFT" ? "Saved" : undefined} /></span></button></li>)}</ul> : <EmptyState title={search || status !== "ALL" ? "No matching payment channels" : "Your channels start here"} description={search || status !== "ALL" ? "Try another name or status." : workspace.canCreateChannel ? "Choose how to get paid, enter the details and review." : "No channels are available to you. Ask your primary merchant to review your access."} />}{workspace.channelsHasMore && <p className="mn-muted">This is a limited set of the channels available to you. Search covers only the loaded records; other records remain saved.</p>}</div>
    <WorkspaceDialog open={mode !== "closed"} onClose={close} title={title} serviceName={merchant.displayName} wide footer={mode === "edit" ? <div className="mn-actions mn-channel-actions"><Button variant="quiet" disabled={locked} onClick={close}>Discard changes</Button><Button type="submit" form={formId} disabled={locked}>Review channel</Button></div> : mode === "review" ? <div className="mn-actions mn-channel-actions"><Button variant="quiet" disabled={locked} onClick={() => { setMode("edit"); setNotice(null); }}>Back to details</Button><Button busy={busy} disabled={locked} onClick={save}>Save payment channel</Button></div> : undefined}>{feedback}{mode === "edit" ? <form id={formId} className="mn-form mn-channel-form" onSubmit={event => { event.preventDefault(); review(); }}><label>Channel name or purpose<input required maxLength={160} value={form.description} disabled={locked} onChange={event => setForm({ ...form, description: event.target.value })} placeholder="For example, Garden market orders" /></label><div className="mn-form-grid"><label>Amount (USD)<input required inputMode="decimal" autoComplete="off" maxLength={13} value={form.amount} disabled={locked} onChange={event => setForm({ ...form, amount: event.target.value })} placeholder="0.00" /></label></div><fieldset disabled={locked}><legend>How will you present this channel?</legend><div className="mn-checks">{Object.entries(presentationLabels).filter(([value])=>workspace.allowedPresentations.includes(value as ChannelPresentation)).map(([value, label]) => <label key={value}><input type="checkbox" checked={form.presentations.includes(value as ChannelPresentation)} onChange={event => setForm({ ...form, presentations: event.target.checked ? [...form.presentations, value as ChannelPresentation] : form.presentations.filter(item => item !== value) })} />{label}</label>)}</div></fieldset><p className="mn-muted">Choose one or more formats. They share the same amount; a receipt follows a successful payment.</p><details className="mop-settings"><summary>More options · use, expiry and access</summary><p className="mn-muted">By default, one payment is allowed for 7 days. Only you and the primary merchant can see this channel.</p><label>Request use<select value={form.usage} disabled={locked} onChange={event => setForm({ ...form, usage: event.target.value as Form["usage"] })}><option value="ONE_TIME">One-time</option><option value="REUSABLE">Reusable</option></select></label><div><label>Expires at (UTC)<input type="datetime-local" required aria-describedby={expiryId} value={form.expires} disabled={locked} onChange={event => setForm({ ...form, expires: event.target.value })} /></label><small id={expiryId}>Choose a future date within 366 days. Payments stop at this time.</small></div><label>Channel visibility<select value={form.visibility} disabled={locked || !canShare} onChange={event => setForm({ ...form, visibility: event.target.value as Form["visibility"] })}><option value="CREATOR_PRIVATE">Me and the primary merchant</option><option value="ASSIGNED">People with channel access</option></select></label>{!canShare && <p className="mn-muted">Your access does not allow sharing this channel with other team members.</p>}</details></form> : mode === "review" ? <><dl className="mn-review"><div><dt>Merchant</dt><dd>{merchant.displayName}</dd></div><div><dt>Primary merchant</dt><dd>{merchant.master.displayName}</dd></div><div><dt>Channel</dt><dd>{form.description}</dd></div><div><dt>Amount</dt><dd>{formatMoney(minorAmount(form.amount) ?? "0")}</dd></div><div><dt>Use</dt><dd>{form.usage === "ONE_TIME" ? "One-time" : "Reusable"}</dd></div><div><dt>Ways to pay</dt><dd>{form.presentations.map(value => presentationLabels[value]).join(", ")}</dd></div><div><dt>Visibility</dt><dd>{form.visibility === "CREATOR_PRIVATE" ? "Me and the primary merchant" : "People with channel access"}</dd></div><div><dt>Expires</dt><dd>{form.expires.replace("T", " ")} UTC</dd></div></dl><div className="mn-notice">Save this amount and these formats. Next, turn on the channel and open its sandbox checkout. No messages are sent.</div></> : selected ? <><MerchantChannelPublication merchantId={merchant.id} channel={selected} attempt={publicationAttempt} onAttempt={setPublicationAttempt}/>{mode === "view" && selected.status === "DRAFT" && <>{operationsBusy ? <p role="status">Loading this channel’s payment controls…</p> : operations && operations.channels.some(channel => channel.channelId === selected.id) ? <MerchantOperations key={selected.id} workspace={workspace} initial={operations} section="channel" channelId={selected.id} showAdministration={workspace.primaryAccess} /> : <div className="mn-notice"><p>{operationsError ? "Your channel is saved, but payment controls could not load." : "Reload payment controls to continue with this channel."}</p><Button variant="secondary" onClick={() => void loadOperations()}>Reload payment controls</Button></div>}</>}<details className="mop-settings" open={mode === "cancel"}><summary>Channel details</summary>{details(selected)}</details>{mode === "cancel" ? <><p className="mn-muted">Close this channel in {merchant.displayName}. Its records remain saved and it cannot be reopened.</p><div className="mn-actions"><Button variant="quiet" disabled={locked} onClick={() => setMode("view")}>Keep channel</Button><Button variant="danger" busy={busy} disabled={locked} onClick={() => void send({ path: `/channels/${selected.id}/close`, method: "POST", body: { commandId: crypto.randomUUID(), expectedVersion: selected.version } })}>Confirm close</Button></div></> : <><p className="mn-muted">Sandbox channel. No real payments or external messages.</p><div className="mn-actions"><Button variant="quiet" disabled={busy} onClick={close}>Close details</Button>{selected.canCancel && <Button variant="secondary" disabled={locked} onClick={() => setMode("cancel")}>Close channel</Button>}{selected.canEdit && <Button variant="secondary" disabled={locked} onClick={() => { setForm(formFor(selected)); setMode("edit"); setNotice(null); }}>Edit channel</Button>}</div></>}</> : null}</WorkspaceDialog>
  </section>;
}

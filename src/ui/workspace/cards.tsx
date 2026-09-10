"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CardPurchaseResult, CardRequestProjection, WorkspaceCard, WorkspaceProjection } from "@/modules/workspace/contracts";
import { Button, EmptyState, Feedback, StatusBadge, WorkspaceCommandError, WorkspaceDialog, capability, formatMoney, workspaceCommand } from "./primitives";
import { cardholderTaskHref } from "../cardholder-routing";
import { CardPreview } from "./card-art";
import "./cards.css";

export interface CardsWorkspaceProps { workspace: WorkspaceProjection; routeBase?: string; initialControl?: boolean; onClose?: () => void }

export function CardsWorkspace({ workspace, routeBase, initialControl = false, onClose }: CardsWorkspaceProps) {
  const serviceName = workspace.customerService?.displayName ?? "Cardholder services";
  const cardRoute = routeBase ?? "/cardholder-services";
  const router = useRouter();
  const params = useSearchParams();
  const [, startNavigation] = useTransition();
  const [cardUpdates, setCardUpdates] = useState<Record<string, WorkspaceCard>>({});
  const [purchaseAttempts, setPurchaseAttempts] = useState<Record<string, PurchaseAttempt | undefined>>({});
  const [requestUpdates, setRequestUpdates] = useState<Record<string, CardRequestProjection>>({});
  const requestId = params.get("request")?.toLowerCase();
  const showIntro = !requestId && params.get("new") === "1";
  const selectedId = requestId || showIntro ? null : params.get("card")?.toLowerCase();
  const [confirmControl, setConfirmControl] = useState(initialControl);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const commandIds = useRef(new Map<string, string>());
  const cards = workspace.cards.map((card) => cardUpdates[card.id] && cardUpdates[card.id].version >= card.version ? cardUpdates[card.id] : card);
  const requestMap = new Map(workspace.cardRequests.map((item) => [item.id, item]));
  for (const update of Object.values(requestUpdates)) {
    if (workspace.cardholderRole==="PRIMARY" && (!requestMap.has(update.id) || requestMap.get(update.id)!.version <= update.version)) requestMap.set(update.id, update);
  }
  const requests = Array.from(requestMap.values());
  const selected = cards.find((card) => card.id === selectedId);
  const request = requests.find((item) => item.id === requestId);
  const requestCapability = capability(workspace, "cards.request");

  useEffect(() => {
    const resetTransientControl = () => { setConfirmControl(false); setError(""); setNotice(""); onClose?.(); };
    window.addEventListener("popstate", resetTransientControl);
    return () => window.removeEventListener("popstate", resetTransientControl);
  }, [onClose]);

  function navigateDialog(kind: "card" | "request" | "new" | null, value = "", push = false) {
    const query = new URLSearchParams(params.toString());
    // A route has one active card surface. Other page query state survives opening and closing it.
    for (const key of ["card", "request", "new", "manage", "transaction"]) query.delete(key);
    if (kind) query.set(kind, kind === "new" ? "1" : value);
    const suffix = query.toString();
    const url = `${cardRoute}${suffix ? `?${suffix}` : ""}`;
    startNavigation(() => { if (push) router.push(url, { scroll: false }); else router.replace(url, { scroll: false }); });
  }
  function closeCard() {
    if (busy) return;
    onClose?.();
    setConfirmControl(false); setError(""); setNotice(""); navigateDialog(null);
  }

  async function command<T>(path: string, method: "POST" | "PATCH", input: Record<string, unknown> = {}) {
    const key = JSON.stringify([path, method, input]);
    const commandId = commandIds.current.get(key) ?? crypto.randomUUID();
    commandIds.current.set(key, commandId);
    const result = await workspaceCommand<T>(workspace.service.id, path, method, { ...input, commandId });
    commandIds.current.delete(key);
    return result;
  }
  function updateRequest(next: CardRequestProjection) { setRequestUpdates((current) => ({ ...current, [next.id]: next })); if (next.status === "ISSUED") router.refresh(); }
  function openRequest(next: CardRequestProjection) {
    setError(""); setNotice(""); setConfirmControl(false);
    navigateDialog("request", next.id);
  }
  function closeRequest() {
    if (busy) return;
    setError(""); navigateDialog(null);
    router.refresh();
  }
  async function startRequest() {
    setBusy("start"); setError(""); setNotice("");
    try {
      const next = await command<CardRequestProjection>("/card-requests", "POST");
      updateRequest(next); openRequest(next);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "We couldn’t start your card request."); }
    finally { setBusy(""); }
  }
  async function controlCard() {
    if (!selected) return;
    setBusy("control"); setError("");
    const action = selected.status === "FROZEN" ? "unfreeze" : "freeze";
    try {
      const next = await command<WorkspaceCard>(`/cards/${encodeURIComponent(selected.id)}/control`, "POST", { expectedVersion: selected.version, action });
      setCardUpdates((current) => ({ ...current, [next.id]: next }));
      setConfirmControl(false);
      setNotice(`${next.nickname} in ${serviceName} is now ${next.status === "FROZEN" ? "frozen" : "active"}.`);
      router.refresh();
    } catch (failure) { setError(failure instanceof Error ? failure.message : "We couldn’t update this card."); setConfirmControl(false); router.refresh(); }
    finally { setBusy(""); }
  }

  return <section className="consumer-workspace">
    {selectedId && !selected && <Feedback kind="error" message="This card is no longer available. Return to your cards and refresh." />}
    {selected && <WorkspaceDialog open onClose={closeCard} title={confirmControl ? `${selected.status === "FROZEN" ? "Unfreeze" : "Freeze"} this card?` : selected.nickname} serviceName={serviceName} wide>
      <Feedback kind="error" message={error} /><Feedback kind="success" message={notice} />
      {confirmControl ? <><div className="consumer-review-highlight"><strong>{selected.nickname} · •••• {selected.lastFour}</strong><span>{selected.holderName}</span><span>{serviceName}</span></div><p>{selected.status === "FROZEN" ? "This card will be ready to use again." : "New purchases will be blocked. You can still review past activity."}</p>{!(selected.status === "FROZEN" ? selected.canUnfreeze : selected.canFreeze) && <p className="consumer-muted">You no longer have permission to change this card. Close this view and refresh your cards.</p>}<div className="consumer-action-row"><Button variant="secondary" disabled={Boolean(busy)} onClick={() => setConfirmControl(false)}>Back to card</Button><Button busy={busy === "control"} disabled={selected.status === "FROZEN" ? !selected.canUnfreeze : !selected.canFreeze} onClick={() => void controlCard()}>{selected.status === "FROZEN" ? "Unfreeze card" : "Freeze card"}</Button></div></> : <>
        <div className="consumer-card-detail-grid"><div><CardPreview card={selected} /></div><div className="consumer-card-summary"><StatusBadge status={selected.status}/><p>{selected.holderName} · Ending {selected.lastFour}</p><p>{selected.relationship === "PRIMARY" ? "Primary card" : "Secondary card"}</p><dl><dt>Available to spend</dt><dd>{formatMoney(selected.available)}</dd></dl></div></div>
        <h3>Card controls</h3><div className="consumer-control-list"><div><span><strong>{selected.status === "FROZEN" ? "Unfreeze card" : "Freeze card"}</strong><small>{selected.status === "FROZEN" ? "Let this card make purchases again." : "Temporarily stop new purchases."}</small></span><Button variant="secondary" disabled={selected.status === "FROZEN" ? !selected.canUnfreeze : !selected.canFreeze} onClick={() => setConfirmControl(true)}>{selected.status === "FROZEN" ? "Unfreeze" : "Freeze"}</Button></div></div>
        {!(selected.canFreeze || selected.canUnfreeze) && <p className="consumer-muted">Your access allows you to view this card. Ask the primary cardholder about changes.</p>}
        <Link className="consumer-text-link" href={cardholderTaskHref("activity", {cardId:selected.id})}>View this card’s activity <span aria-hidden="true">↗</span></Link>
        <details className="consumer-card-more"><summary>Card details and other services</summary><dl className="consumer-detail-list"><div><dt>Cardholder service</dt><dd>{serviceName}</dd></div><div><dt>Card format</dt><dd>{selected.format === "VIRTUAL" ? "Virtual" : "Physical"}</dd></div><div><dt>Starting balance</dt><dd>{formatMoney(selected.limit)}</dd></div></dl><p className="consumer-muted">Adding funds and requesting a replacement are not available yet.</p></details>
        <CardPurchaseForm key={selected.id} card={selected} pending={purchaseAttempts[selected.id]} onPending={(attempt) => setPurchaseAttempts(current => ({ ...current, [selected.id]: attempt }))} command={command} onBusy={(value) => setBusy(value ? "purchase" : "")} onRefresh={() => router.refresh()} onSuccess={(result) => { setCardUpdates(current => ({ ...current, [result.card.id]: result.card })); router.refresh(); }} />
        <div className="consumer-action-row" aria-label="Related cardholder services">{capability(workspace,"activity.read")?.allowed && <Link className="consumer-button consumer-button-secondary" href={cardholderTaskHref("reports", {cardId:selected.id})}>Statements & reports</Link>}<Link className="consumer-button consumer-button-secondary" href={cardholderTaskHref("settings", {cardId:selected.id})}>Notification preferences</Link><Link className="consumer-button consumer-button-secondary" href={cardholderTaskHref("help", {cardId:selected.id})}>Help with this card</Link></div>
      </>}
    </WorkspaceDialog>}
    {showIntro && !request && <WorkspaceDialog open onClose={closeCard} title="Add a card" serviceName={serviceName}><Feedback kind="error" message={error} /><h3>A card, with you in control</h3><p>Choose a cardholder, name the card and review before you create it.</p><div className="consumer-review-highlight"><strong>Your progress will be saved</strong><span>You can leave at any step and finish from Saved requests.</span></div>{requestCapability?.allowed && <div className="consumer-action-row consumer-detail-back"><Button busy={busy === "start"} disabled={Boolean(busy)} onClick={() => void startRequest()}>Start card request</Button></div>}{!requestCapability?.allowed && <p className="consumer-muted">Card requests aren’t available with your current access.</p>}</WorkspaceDialog>}
    {request && <WorkspaceDialog open onClose={closeRequest} title="Add card" serviceName={serviceName} wide><CardRequestForm key={request.id} request={request} workspace={workspace} canEdit={requestCapability?.allowed === true} command={command} routeBase={cardRoute} onUpdate={updateRequest} onClose={closeRequest} /></WorkspaceDialog>}
  </section>;
}

interface CardRequestFormProps {
  request: CardRequestProjection;
  workspace: WorkspaceProjection;
  canEdit: boolean;
  routeBase: string;
  command: <T>(path: string, method: "POST" | "PATCH", input?: Record<string, unknown>) => Promise<T>;
  onUpdate: (request: CardRequestProjection) => void;
  onClose: () => void;
}
function limitInput(minor: string) {
  const padded = minor.padStart(3, "0");
  return `${padded.slice(0, -2)}.${padded.slice(-2)}`;
}
function limitWire(input: string) {
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(input)) return null;
  const [whole, fraction = ""] = input.split(".");
  return `${whole}${fraction.padEnd(2, "0")}`.replace(/^0+(?=\d)/, "");
}
function CardRequestForm({ request, workspace, canEdit, command, onUpdate, onClose, routeBase }: CardRequestFormProps) {
  const params = useSearchParams();
  const issuedQuery = new URLSearchParams(params.toString());
  for (const key of ["card", "request", "new", "manage", "transaction"]) issuedQuery.delete(key);
  if (request.issuedCardId) issuedQuery.set("card", request.issuedCardId);
  const serviceName = workspace.customerService?.displayName ?? "Cardholder services";
  const [step, setStep] = useState(!canEdit || request.status === "BLOCKED" || request.status === "CANCELED" || request.status === "ISSUED" ? 2 : 0);
  const [holderId, setHolderId] = useState(request.holderId);
  const [nickname, setNickname] = useState(request.nickname || "New card");
  const [format, setFormat] = useState(request.format);
  const [limit, setLimit] = useState(limitInput(request.requestedLimitMinor));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const retry = useRef<(() => Promise<void>) | null>(null);
  const frozen = !canEdit || request.status === "CANCELED" || request.status === "ISSUED";
  const holder = workspace.cardholderOptions.find((person) => person.id === holderId);
  const path = `/card-requests/${encodeURIComponent(request.id)}`;
  async function save(nextStep: number, closeAfter = false) {
    retry.current = () => save(nextStep, closeAfter);
    const minor = limitWire(limit.trim());
    if (!holder) { setError("Choose an available cardholder before continuing."); return; }
    if (!nickname.trim()) { setError("Enter a name for this card."); return; }
    if (minor === null) { setError("Enter a starting balance in dollars, using no more than two decimal places."); return; }
    setBusy(true); setError(""); setMessage(""); setUncertain(false);
    try {
      const next = await command<CardRequestProjection>(path, "PATCH", { expectedVersion: request.version, holderId, nickname: nickname.trim(), format, requestedLimitMinor: minor });
      onUpdate(next); setStep(nextStep); setMessage("Your card request has been saved.");
      if (closeAfter) onClose();
    } catch (failure) { setUncertain(failure instanceof WorkspaceCommandError && failure.uncertain); setError(failure instanceof Error ? failure.message : "We couldn’t save your request."); }
    finally { setBusy(false); }
  }
  async function finish(action: "submit" | "cancel") {
    retry.current = () => finish(action);
    setBusy(true); setError(""); setMessage(""); setUncertain(false);
    try {
      const next = await command<CardRequestProjection>(`${path}/${action}`, "POST", { expectedVersion: request.version });
      onUpdate(next); setSubmitted(action === "submit");
      setMessage(action === "cancel" ? `The card request for ${serviceName} is canceled.` : next.status === "ISSUED" ? "Your card is ready to use." : "Your request is saved. Review the requirements below.");
    } catch (failure) { setUncertain(failure instanceof WorkspaceCommandError && failure.uncertain); setError(failure instanceof Error ? failure.message : "We couldn’t update your request."); }
    finally { setBusy(false); }
  }
  return <div className="consumer-card-form" aria-busy={busy}>
    <ol className="consumer-stepper" aria-label="Card request progress">{["Cardholder", "Card details", "Review"].map((label, index) => <li key={label} className={step === index ? "is-current" : step > index ? "is-complete" : ""} aria-current={step === index ? "step" : undefined}><span>{index + 1}</span>{label}</li>)}</ol>
    <Feedback kind="error" message={error} /><Feedback kind="info" message={message} />{uncertain && <Button variant="secondary" busy={busy} onClick={() => void retry.current?.()}>Retry the same request</Button>}
    {step === 0 && <><h3>Who is this card for?</h3><p className="consumer-muted">Choose yourself or a cardholder who has accepted your invitation.</p><div className="consumer-holder-options">{workspace.cardholderOptions.map((person) => <label key={person.id} className={`consumer-holder-option ${holderId === person.id ? "is-selected" : ""}`}><input type="radio" name="cardholder" value={person.id} checked={holderId === person.id} disabled={frozen || busy || uncertain} onChange={() => setHolderId(person.id)} /><span className="consumer-avatar" aria-hidden="true">{person.displayName.slice(0, 1)}</span><span><strong>{person.displayName}</strong><small>{person.id === workspace.member.id ? "You" : "Invited cardholder"}</small></span></label>)}</div>{!workspace.cardholderOptions.length && <EmptyState title="No cardholders available" description="Invite a cardholder and allow them to use a card before completing these details." />}</>}
    {step === 1 && <><h3>Make this card yours</h3><div className="consumer-form-fields"><label>Card name<input name="nickname" value={nickname} maxLength={60} disabled={frozen || busy || uncertain} onChange={(event) => setNickname(event.target.value)} autoComplete="off" placeholder="For example, Everyday purchases" /></label><fieldset disabled={frozen || busy || uncertain}><legend>Card format</legend><div className="consumer-format-options">{(["VIRTUAL", "PHYSICAL"] as const).map((value) => <label key={value}><input type="radio" name="format" checked={format === value} onChange={() => setFormat(value)} /><span><strong>{value === "VIRTUAL" ? "Virtual card" : "Physical card"}</strong><small>{value === "VIRTUAL" ? "Digital format" : "Preview only · No delivery"}</small></span></label>)}</div></fieldset><div className="consumer-funds-field"><label htmlFor="card-starting-balance">Starting balance (USD)</label><div className="consumer-money-input"><span aria-hidden="true">$</span><input id="card-starting-balance" name="requested-limit" value={limit} inputMode="decimal" disabled={frozen || busy || uncertain} onChange={(event) => setLimit(event.target.value)} aria-describedby="limit-explanation" /></div><small id="limit-explanation">Choose the amount available for purchases when this card is created.</small></div></div></>}
    {step === 2 && <><div className="consumer-section-heading"><h3>{request.status === "ISSUED" ? "Your card is ready" : request.status === "CANCELED" ? "Request canceled" : submitted ? "Your request needs attention" : "Review your card request"}</h3><StatusBadge status={request.status} label={request.status === "BLOCKED" ? "Needs attention" : undefined} /></div><dl className="consumer-detail-list consumer-review-list"><div><dt>Cardholder service</dt><dd>{serviceName}</dd></div><div><dt>Cardholder</dt><dd>{holder?.displayName ?? request.holderName ?? "Not selected"}</dd></div><div><dt>Card name</dt><dd>{request.nickname}</dd></div><div><dt>Format</dt><dd>{request.format === "VIRTUAL" ? "Virtual" : "Physical"}</dd></div><div><dt>Starting balance</dt><dd>{formatMoney(request.requestedLimitMinor, request.currency)}</dd></div></dl>
      {request.status !== "CANCELED" && request.status !== "ISSUED" && <div className="consumer-prerequisites"><h4>Before you create this card</h4>{request.prerequisites.length ? <ul>{request.prerequisites.map((item) => <li key={item.code}><strong>{item.title}</strong><p>{item.detail}</p></li>)}</ul> : <p>Creating this card adds the starting balance shown above. No real money is used.</p>}</div>}
      {request.status === "ISSUED" && request.issuedCardId && <Link className="consumer-text-link" href={`${routeBase}?${issuedQuery}`}>Open card →</Link>}
    </>}
    <div className="consumer-wizard-footer"><div>{step > 0 && !frozen && <Button variant="quiet" disabled={busy || uncertain} onClick={() => { setStep(step - 1); setError(""); setMessage(""); }}>Back</Button>}</div><div className="consumer-action-row"><Button variant="secondary" disabled={busy || uncertain} onClick={() => { if (frozen || step === 2) onClose(); else void save(step, true); }}>{frozen || step === 2 ? "Close" : "Save for later"}</Button>{step < 2 ? <Button busy={busy} disabled={frozen || uncertain || !workspace.cardholderOptions.length} onClick={() => void save(step + 1)}>{step === 0 ? "Continue" : "Save & review"}</Button> : !frozen && <Button busy={busy} disabled={uncertain || !request.canSubmit} onClick={() => void finish("submit")}>Create card</Button>}</div></div>
    {step === 2 && !frozen && <button className="consumer-cancel-request" type="button" disabled={busy || uncertain} onClick={() => void finish("cancel")}>Cancel this request</button>}
    {request.status === "CANCELED" && <p className="consumer-form-footnote">This request remains in your history. No card was created.</p>}
  </div>;
}

interface PurchaseAttempt { expectedVersion: number; amountMinor: string; description: string }
function CardPurchaseForm({ card, pending, onPending, command, onBusy, onRefresh, onSuccess }: {
  card: WorkspaceCard; pending?: PurchaseAttempt;
  onPending: (attempt: PurchaseAttempt | undefined) => void;
  command: CardRequestFormProps["command"]; onBusy: (busy: boolean) => void; onRefresh: () => void;
  onSuccess: (result: CardPurchaseResult) => void;
}) {
  const [amount, setAmount] = useState(pending ? limitInput(pending.amountMinor) : "");
  const [description, setDescription] = useState(pending?.description ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function purchase() {
    const minor = limitWire(amount.trim());
    if (!pending && (!minor || minor === "0" || !description.trim())) { setError("Enter a purchase description and an amount greater than zero, with at most two decimal places."); return; }
    const attempt = pending ?? { expectedVersion: card.version, amountMinor: minor!, description: description.trim() };
    onPending(attempt); setBusy(true); onBusy(true); setError(""); setMessage("");
    try {
      const result = await command<CardPurchaseResult>(`/cards/${encodeURIComponent(card.id)}/purchase`, "POST", { ...attempt });
      onSuccess(result); onPending(undefined); setAmount(""); setDescription("");
      setMessage(`${result.activity.amount.formatted} purchase recorded on ${card.nickname}. Available to spend: ${result.card.available.formatted}.`);
    } catch (failure) {
      if (!(failure instanceof WorkspaceCommandError && failure.uncertain)) onPending(undefined);
      const code = failure instanceof WorkspaceCommandError ? failure.code : null;
      setError(code === "INSUFFICIENT_PRACTICE_FUNDS" ? "This purchase exceeds the card’s available balance. Enter a smaller amount." : code === "CARD_FROZEN" ? "This card is frozen. Unfreeze it before trying a purchase." : failure instanceof Error ? failure.message : "We couldn’t confirm this purchase. Retry the same purchase.");
    } finally { setBusy(false); onBusy(false); }
  }
  return <section className="consumer-panel consumer-purchase" aria-label="Card purchase">
    <h3>Try a purchase</h3><p className="consumer-muted">Enter a purchase to see it in your activity.</p>
    <Feedback kind="error" message={error} /><Feedback kind="success" message={message} />{error && !pending && <Button variant="secondary" disabled={busy} onClick={() => { onRefresh(); setError(""); }}>Refresh card</Button>}
    <>
      {!card.canPurchase && !pending && <p>{card.status === "FROZEN" ? "Unfreeze this card before trying a purchase." : card.available.minor === "0" ? "This card has no balance remaining." : "Only the person named on this card can make a purchase."}</p>}
      {pending && !busy && <p role="status">We haven’t confirmed this purchase yet. Retry it before entering another purchase.</p>}
      <form onSubmit={(event) => { event.preventDefault(); void purchase(); }}>
        <div className="consumer-form-fields"><label>Purchase description<input value={description} maxLength={120} autoComplete="off" disabled={busy || Boolean(pending) || !card.canPurchase} onChange={event => setDescription(event.target.value)} placeholder="For example, Groceries" /></label>
          <label>Purchase amount (USD)<input value={amount} inputMode="decimal" autoComplete="off" disabled={busy || Boolean(pending) || !card.canPurchase} onChange={event => setAmount(event.target.value)} placeholder="0.00" /></label></div>
        <div className="consumer-action-row"><Button type="submit" busy={busy} disabled={!pending && !card.canPurchase}>{pending ? "Retry same purchase" : "Make purchase"}</Button></div>
      </form>
    </>
  </section>;
}

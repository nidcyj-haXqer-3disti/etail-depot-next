"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CardPurchaseResult, CardRequestProjection, WorkspaceCard, WorkspaceProjection } from "@/modules/workspace/contracts";
import type { CardRequestHistory, CardControlHistory } from "@/modules/workspace/dashboard-contracts";
import { Button, EmptyState, Feedback, StatusBadge, WorkspaceCommandError, WorkspaceDialog, capability, formatDate, formatMoney, workspaceCommand } from "./primitives";
import { cardholderTaskHref } from "../cardholder-routing";
import { CardPreview } from "./card-art";
import "./cards.css";

export interface CardsWorkspaceProps { workspace: WorkspaceProjection; requestHistory?: CardRequestHistory; cardHistory?: CardControlHistory; routeBase?: string; initialControlAction?: "freeze"|"unfreeze"; onClose?: () => void }

export function CardsWorkspace({ workspace, requestHistory, cardHistory, routeBase, initialControlAction, onClose }: CardsWorkspaceProps) {
  const serviceName = workspace.customerService?.displayName ?? "Cardholder services";
  const cardRoute = routeBase ?? "/cardholder-services";
  const router = useRouter();
  const params = useSearchParams();
  const [, startNavigation] = useTransition();
  const [cardUpdates, setCardUpdates] = useState<Record<string, WorkspaceCard>>({});
  const [purchaseAttempts, setPurchaseAttempts] = useState<Record<string, PurchaseAttempt | undefined>>({});
  const [requestUpdates, setRequestUpdates] = useState<Record<string, CardRequestProjection>>({});
  const requestId = params.get("request")?.toLowerCase();
  const showNew = !requestId && params.get("new") === "1";
  const selectedId = requestId || showNew ? null : params.get("card")?.toLowerCase();
  const [confirmControl, setConfirmControl] = useState<"freeze"|"unfreeze"|null>(initialControlAction??null);
  const [controlAttempt,setControlAttempt]=useState<{action:"freeze"|"unfreeze";expectedVersion:number}|null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const requestBusy = useCallback((value: boolean) => setBusy(value ? "request" : ""), []);
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
    const resetTransientControl = () => { setConfirmControl(null); setError(""); setNotice(""); onClose?.(); };
    window.addEventListener("popstate", resetTransientControl);
    return () => window.removeEventListener("popstate", resetTransientControl);
  }, [onClose]);

  function navigateDialog(kind: "card" | "request" | "new" | null, value = "", push = false) {
    const query = new URLSearchParams(params.toString());
    // A route has one active card surface. Other page query state survives opening and closing it.
    for (const key of ["card", "request", "new", "manage", "transaction", "holder", "review"]) query.delete(key);
    if (kind) query.set(kind, kind === "new" ? "1" : value);
    const suffix = query.toString();
    const url = `${cardRoute}${suffix ? `?${suffix}` : ""}`;
    startNavigation(() => { if (push) router.push(url, { scroll: false }); else router.replace(url, { scroll: false }); });
  }
  function closeCard() {
    if (busy||controlAttempt) return;
    onClose?.();
    setConfirmControl(null); setError(""); setNotice(""); navigateDialog(null);
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
  function closeRequest() {
    if (busy) return;
    setError(""); navigateDialog(null);
    router.refresh();
  }
  async function controlCard() {
    if (!selected||!confirmControl||busy) return;
    const attempt=controlAttempt??{action:confirmControl,expectedVersion:selected.version};
    setControlAttempt(attempt);setBusy("control");setError("");
    try {
      const next=await command<WorkspaceCard>(`/cards/${encodeURIComponent(selected.id)}/control`,"POST",attempt);
      setCardUpdates(current=>({...current,[next.id]:next}));setControlAttempt(null);setConfirmControl(null);
      setNotice(next.status==="FROZEN"?(attempt.action==="unfreeze"?"Your freeze was removed. This card remains frozen. ":"Freeze saved. ")+next.freeze.description:"Card active. New purchases are available within the cardholder’s permissions and funds.");
      router.refresh();
    } catch(failure){
      const unknown=failure instanceof WorkspaceCommandError&&failure.uncertain;
      setError(failure instanceof WorkspaceCommandError&&failure.code==="PRIMARY_FREEZE_ACTIVE"?"Only the primary cardholder can remove this freeze.":failure instanceof Error?failure.message:"We couldn’t update this card.");
      if(!unknown){setControlAttempt(null);setConfirmControl(null);router.refresh();}
    } finally{setBusy("");}
  }

  return <section className="consumer-workspace">
    {selectedId && !selected && <Feedback kind="error" message="This card is no longer available. Return to your cards and refresh." />}
    {selected && <WorkspaceDialog open onClose={closeCard} title={confirmControl ? `${confirmControl === "unfreeze" ? selected.freeze.unfreezeLabel : selected.freeze.freezeLabel}?` : selected.nickname} serviceName={serviceName} wide>
      <Feedback kind="error" message={error} /><Feedback kind="success" message={notice} />
      {confirmControl ? <><div className="consumer-review-highlight"><strong>{selected.nickname} · •••• {selected.lastFour}</strong><span>{selected.holderName}</span><span>{serviceName}</span></div><p>{confirmControl==="unfreeze"?selected.freeze.unfreezeDescription:"Your freeze will stop new purchases. Past activity and available funds stay visible."}</p><p className="consumer-muted">{selected.freeze.description}</p>{!(confirmControl==="unfreeze"?selected.canUnfreeze:selected.canFreeze)&&!controlAttempt&&<p className="consumer-muted">This change is no longer available. Return to the card to review its current restrictions.</p>}{controlAttempt&&!busy&&<p role="status">We haven’t confirmed this change. Retry the same change before taking another action.</p>}<div className="consumer-action-row"><Button variant="secondary" disabled={Boolean(busy)||Boolean(controlAttempt)} onClick={()=>setConfirmControl(null)}>Back to card</Button><Button busy={busy==="control"} disabled={!controlAttempt&&!(confirmControl==="unfreeze"?selected.canUnfreeze:selected.canFreeze)} onClick={()=>void controlCard()}>{controlAttempt?"Retry same change":confirmControl==="unfreeze"?selected.freeze.unfreezeLabel:selected.freeze.freezeLabel}</Button></div></> : <>
        <div className="consumer-card-detail-grid"><div><CardPreview card={selected} /></div><div className="consumer-card-summary"><StatusBadge status={selected.status}/><p>{selected.holderName} · Ending {selected.lastFour}</p><p>{selected.relationship === "PRIMARY" ? "Primary card" : "Secondary card"}</p><dl><dt>Available to spend</dt><dd>{formatMoney(selected.available)}</dd></dl></div></div>
        <h3>Card controls</h3><p className="consumer-restriction-status" role="status">{selected.freeze.description}</p><div className="consumer-control-list">{selected.canFreeze&&<div><span><strong>{selected.freeze.freezeLabel}</strong><small>Stop new purchases without removing card access or past activity.</small></span><Button variant="secondary" onClick={()=>setConfirmControl("freeze")}>{selected.status==="ACTIVE"?"Freeze":selected.freeze.freezeLabel}</Button></div>}{selected.canUnfreeze&&<div><span><strong>{selected.freeze.unfreezeLabel}</strong><small>{selected.freeze.unfreezeDescription}</small></span><Button variant="secondary" onClick={()=>setConfirmControl("unfreeze")}>{selected.freeze.unfreezeLabel==="Unfreeze card"?"Unfreeze":selected.freeze.unfreezeLabel}</Button></div>}</div>
        {!(selected.canFreeze||selected.canUnfreeze)&&<p className="consumer-muted">Your access allows you to view this card. Ask the primary cardholder about changes.</p>}
        {cardHistory&&<details className="consumer-request-history"><summary>Card control history</summary>{cardHistory.events.length?<ol>{cardHistory.events.map(event=><li key={event.id}><span><strong>{event.label}</strong><small> · {event.actorName}</small></span><time dateTime={event.occurredAt}>{formatDate(event.occurredAt)}</time></li>)}</ol>:<p>No freeze changes are recorded for this card.</p>}<p>Recorded actions are shown here. The current restrictions above determine whether the card can be used.</p>{cardHistory.hasEarlierEvents&&<p>Showing the latest 100 recorded actions.</p>}</details>}
        <Link className="consumer-text-link" href={cardholderTaskHref("activity", {cardId:selected.id})}>View this card’s activity <span aria-hidden="true">↗</span></Link>
        <details className="consumer-card-more"><summary>Card details and other services</summary><dl className="consumer-detail-list"><div><dt>Cardholder service</dt><dd>{serviceName}</dd></div><div><dt>Card format</dt><dd>{selected.format === "VIRTUAL" ? "Virtual" : "Physical"}</dd></div><div><dt>Starting balance</dt><dd>{formatMoney(selected.limit)}</dd></div></dl><p className="consumer-muted">Adding funds and requesting a replacement are not available yet.</p></details>
        <CardPurchaseForm key={selected.id} card={selected} pending={purchaseAttempts[selected.id]} onPending={(attempt) => setPurchaseAttempts(current => ({ ...current, [selected.id]: attempt }))} command={command} onBusy={(value) => setBusy(value ? "purchase" : "")} onRefresh={() => router.refresh()} onSuccess={(result) => { setCardUpdates(current => ({ ...current, [result.card.id]: result.card })); router.refresh(); }} />
        <div className="consumer-action-row" aria-label="Related cardholder services">{capability(workspace,"activity.read")?.allowed && <Link className="consumer-button consumer-button-secondary" href={cardholderTaskHref("reports", {cardId:selected.id})}>Statements & reports</Link>}<Link className="consumer-button consumer-button-secondary" href={cardholderTaskHref("settings", {cardId:selected.id})}>Notification preferences</Link><Link className="consumer-button consumer-button-secondary" href={cardholderTaskHref("help", {cardId:selected.id})}>Help with this card</Link></div>
      </>}
    </WorkspaceDialog>}
    {(showNew || request) && <WorkspaceDialog open onClose={closeRequest} title={request?.status==="ISSUED"||request?.status==="CANCELED"?"Card request":"Add card"} serviceName={serviceName} wide><CardRequestForm key={request?.id ?? "new"} request={request ?? null} history={requestHistory} workspace={workspace} canEdit={requestCapability?.allowed === true} command={command} routeBase={cardRoute} onUpdate={updateRequest} onBusy={requestBusy} onClose={closeRequest} /></WorkspaceDialog>}
  </section>;
}

interface CardRequestFormProps {
  request: CardRequestProjection | null;
  history?:CardRequestHistory;
  workspace: WorkspaceProjection;
  canEdit: boolean;
  routeBase: string;
  command: <T>(path: string, method: "POST" | "PATCH", input?: Record<string, unknown>) => Promise<T>;
  onUpdate: (request: CardRequestProjection) => void;
  onBusy: (busy: boolean) => void;
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
type CardFormAttempt =
  | { kind: "save"; fields: {holderId: string; nickname: string; format: "VIRTUAL" | "PHYSICAL"; requestedLimitMinor: string}; request: CardRequestProjection | null; closeAfter: boolean }
  | { kind: "submit" | "cancel"; request: CardRequestProjection };

function CardRequestForm({ request: initialRequest, history, workspace, canEdit, command, onUpdate, onBusy, onClose, routeBase }: CardRequestFormProps) {
  const params = useSearchParams(), router = useRouter();
  const [isNavigating, startNavigation] = useTransition();
  const [request, setRequest] = useState(initialRequest);
  const [step, setStep] = useState(params.get("review") === "1" || initialRequest?.status === "BLOCKED" || initialRequest?.status === "CANCELED" || initialRequest?.status === "ISSUED" ? 1 : 0);
  const preferredHolder = params.getAll("holder").length === 1 ? workspace.cardholderOptions.find(person => person.id === params.get("holder")?.toLowerCase()) : undefined;
  const defaultHolder = params.has("holder") ? undefined : workspace.cardholderOptions.find(person => person.id === workspace.member.id) ?? (workspace.cardholderOptions.length === 1 ? workspace.cardholderOptions[0] : undefined);
  const [holderId, setHolderId] = useState(initialRequest?.holderId ?? preferredHolder?.id ?? defaultHolder?.id ?? "");
  const [nickname, setNickname] = useState(initialRequest?.nickname || "");
  const [format, setFormat] = useState<"VIRTUAL" | "PHYSICAL">(initialRequest?.format ?? "VIRTUAL");
  const [limit, setLimit] = useState(initialRequest ? limitInput(initialRequest.requestedLimitMinor) : "");
  const [busy, setBusy] = useState(false), [error, setError] = useState(!initialRequest && params.has("holder") && !preferredHolder ? "That cardholder isn’t available. Choose a person below to continue." : ""), [uncertain, setUncertain] = useState(false);
  const [confirmCancel,setConfirmCancel]=useState(false);
  const pending = useRef<CardFormAttempt | null>(null), inFlight = useRef(false);
  const frozen = !canEdit || request?.status === "CANCELED" || request?.status === "ISSUED";
  const working = busy || isNavigating;
  const disabled = frozen || working || uncertain;
  const holder = workspace.cardholderOptions.find(person => person.id === holderId);
  useEffect(() => { onBusy(working || uncertain); }, [onBusy, working, uncertain]);
  function update(next: CardRequestProjection) { setRequest(next); onUpdate(next); }
  function navigate(next: CardRequestProjection, closeAfter = false) {
    const query = new URLSearchParams(params.toString());
    for (const key of ["card", "request", "new", "manage", "transaction", "holder", "review"]) query.delete(key);
    if (next.status === "ISSUED" && next.issuedCardId) {
      for (const key of ["view", "page", "activityCard"]) query.delete(key);
      query.set("focus", next.issuedCardId);
    } else if (!closeAfter) { query.set("request", next.id); query.set("review", "1"); }
    // The saved request URL can replace this form. Hold all actions until the
    // transition settles so a rapid Create click cannot lose its retry state.
    startNavigation(() => {
      router.replace(`${routeBase}${query.size ? `?${query}` : ""}`, {scroll: false});
      router.refresh();
    });
  }
  async function execute(attempt: CardFormAttempt) {
    if (inFlight.current || isNavigating) return;
    inFlight.current = true; pending.current = attempt;
    setBusy(true); onBusy(true); setError(""); setUncertain(false);
    let unknown = false;
    try {
      if (attempt.kind === "save") {
        // Keep the confirmed draft and immutable field snapshot through a lost
        // start/save response. The command wrapper retains each command identity.
        if (!attempt.request) { attempt.request = await command<CardRequestProjection>("/card-requests", "POST"); update(attempt.request); }
        const next = await command<CardRequestProjection>(`/card-requests/${encodeURIComponent(attempt.request.id)}`, "PATCH", {expectedVersion: attempt.request.version, ...attempt.fields});
        update(next); pending.current = null; setStep(1); navigate(next, attempt.closeAfter);
      } else {
        const action = attempt.kind === "submit" ? "submit" : "cancel";
        const next = await command<CardRequestProjection>(`/card-requests/${encodeURIComponent(attempt.request.id)}/${action}`, "POST", {expectedVersion: attempt.request.version});
        update(next); pending.current = null; setStep(1);setConfirmCancel(false);router.refresh();
        if (next.status === "ISSUED") navigate(next);
      }
    } catch (failure) {
      unknown = failure instanceof WorkspaceCommandError && failure.uncertain;
      setUncertain(unknown);
      if (!unknown) pending.current = null;
      setError(failure instanceof Error ? failure.message : "We couldn’t confirm your card request. Please try again.");
    } finally { inFlight.current = false; setBusy(false); }
  }
  function save(closeAfter = false) {
    if (working || uncertain) return;
    const minor = limitWire(limit.trim());
    if (!holder) { setError("Choose an available cardholder before continuing."); return; }
    if (!nickname.trim()) { setError("Enter a name for this card."); return; }
    if (minor === null || (!closeAfter && minor === "0")) { setError("Enter a starting balance greater than zero, using no more than two decimal places."); return; }
    void execute({kind: "save", fields: {holderId, nickname: nickname.trim(), format, requestedLimitMinor: minor}, request, closeAfter});
  }
  return <div className="consumer-card-form" aria-busy={working}>
    <div className="consumer-card-form-content">
    <ol className="consumer-stepper consumer-card-stepper" aria-label="Card request progress">{["Card details", "Review & create"].map((label, index) => <li key={label} className={step === index ? "is-current" : step > index ? "is-complete" : ""} aria-current={step === index ? "step" : undefined}><span>{index + 1}</span>{label}</li>)}</ol>
    <Feedback kind="error" message={error}/>{uncertain && <div className="consumer-card-retry"><p>Keep this form open while we confirm your request. Your details are held safely for this retry.</p><Button variant="secondary" busy={working} onClick={() => pending.current && void execute(pending.current)}>Retry the same request</Button></div>}
    {step === 0 && <><h3>Who is this card for?</h3>{workspace.cardholderOptions.length === 1 && holder ? <div className="consumer-cardholder-selected"><span className="consumer-avatar" aria-hidden="true">{holder?.displayName.slice(0, 1)}</span><span><strong>{holder?.displayName}</strong><small>{holder?.id === workspace.member.id ? "You · Primary cardholder" : "Invited cardholder"}</small></span></div> : <div className="consumer-holder-options">{workspace.cardholderOptions.map(person => <label key={person.id} className={`consumer-holder-option ${holderId === person.id ? "is-selected" : ""}`}><input type="radio" name="cardholder" checked={holderId === person.id} disabled={disabled} onChange={() => setHolderId(person.id)}/><span><strong>{person.displayName}</strong><small>{person.id === workspace.member.id ? "You" : "Invited cardholder"}</small></span></label>)}</div>}
      {!workspace.cardholderOptions.length && <EmptyState title="No cardholders available" description="Invite a cardholder and allow them to use a card before completing these details."/>}
      <div className="consumer-form-fields consumer-card-details-fields"><label>Card name<input name="nickname" value={nickname} maxLength={60} disabled={disabled} onChange={event => setNickname(event.target.value)} autoComplete="off" placeholder="For example, Everyday purchases"/></label>
        <div className="consumer-funds-field"><label htmlFor="card-starting-balance">Starting balance (USD)</label><div className="consumer-money-input"><span aria-hidden="true">$</span><input id="card-starting-balance" name="requested-limit" value={limit} inputMode="decimal" disabled={disabled} onChange={event => setLimit(event.target.value)} aria-describedby="limit-explanation" placeholder="0.00"/></div><small id="limit-explanation">Practice money for trying purchases. No bank account or real funds are needed.</small></div>
        <details className="consumer-format-details"><summary>{format === "VIRTUAL" ? "Virtual card" : "Physical card preview"} <span>Change format</span></summary><fieldset disabled={disabled}><legend>Card format</legend><div className="consumer-format-options">{(["VIRTUAL", "PHYSICAL"] as const).map(value => <label key={value}><input type="radio" name="format" checked={format === value} onChange={() => setFormat(value)}/><span><strong>{value === "VIRTUAL" ? "Virtual card" : "Physical card"}</strong><small>{value === "VIRTUAL" ? "Ready to try online" : "Preview only · No delivery"}</small></span></label>)}</div></fieldset></details>
      </div></>}
    {step === 1 && request && <><div className="consumer-section-heading"><h3>{request.status === "ISSUED" ? "Your card is ready" : request.status === "CANCELED" ? "Request canceled" : request.status === "BLOCKED" ? "Your card needs attention" : "Review your card"}</h3>{["BLOCKED", "CANCELED", "ISSUED"].includes(request.status) && <StatusBadge status={request.status} label={request.status === "BLOCKED" ? "Needs attention" : undefined}/>}</div>
      <dl className="consumer-detail-list consumer-review-list"><div><dt>Cardholder</dt><dd>{holder?.displayName ?? request.holderName}</dd></div><div><dt>Card name</dt><dd>{request.nickname}</dd></div><div><dt>Format</dt><dd>{request.format === "VIRTUAL" ? "Virtual" : "Physical · Preview only"}</dd></div><div><dt>Starting balance</dt><dd>{formatMoney(request.requestedLimitMinor, request.currency)}</dd></div></dl>
      {request.status !== "CANCELED" && request.status !== "ISSUED" && <div className="consumer-prerequisites">{request.prerequisites.length ? <><h4>Before you create this card</h4><ul>{request.prerequisites.map(item => <li key={item.code}><strong>{item.title}</strong><p>{item.detail}</p></li>)}</ul></> : <p>Your card will be ready to try with the practice balance above. No real money is used.</p>}</div>}
      {request.status === "ISSUED" && request.issuedCardId && <Button onClick={() => navigate(request)}>View your card</Button>}
    </>}

    {!frozen && request && (confirmCancel?<section className="consumer-cancel-review" aria-label="Cancel card request"><h3>Cancel {request.nickname}?</h3><p>No card will be created for {request.holderName}. This request will remain in your history.</p><div className="consumer-action-row"><Button variant="secondary" disabled={working||uncertain} onClick={()=>setConfirmCancel(false)}>Keep request</Button><Button variant="danger" disabled={working||uncertain} onClick={()=>void execute({kind:"cancel",request})}>Confirm cancellation</Button></div></section>:<button className="consumer-cancel-request" type="button" disabled={working || uncertain} onClick={() => setConfirmCancel(true)}>Cancel this request</button>)}
    {request?.status === "CANCELED" && <p className="consumer-form-footnote">This request remains in your history. No card was created.</p>}
    {request&&history&&<details className="consumer-request-history"><summary>Request history</summary><p>Started {formatDate(history.createdAt)}. Current status: {request.status==="BLOCKED"?"Needs attention":request.status==="ISSUED"?"Card created":request.status==="CANCELED"?"Canceled":"Draft"}.</p>{history.events.length?<ol>{history.events.map(event=><li key={event.id}><strong>{event.label}</strong><time dateTime={event.occurredAt}>{formatDate(event.occurredAt)}</time></li>)}</ol>:<p>No earlier actions are recorded for this request.</p>}<p>Creation checks can leave a request needing attention. The current status above confirms whether a card was created.</p>{history.hasEarlierEvents&&<p>Showing the latest 100 recorded actions.</p>}</details>}
    </div>
    <div className="consumer-form-footer">{step === 1 && !frozen && <Button variant="quiet" disabled={working || uncertain} onClick={() => setStep(0)}>Edit details</Button>}<div>{frozen || !request && !nickname && !limit ? <Button variant="secondary" disabled={working || uncertain} onClick={onClose}>Close</Button> : <Button variant="secondary" disabled={working || uncertain} onClick={() => step === 0 ? save(true) : request && navigate(request, true)}>Save for later</Button>}{!frozen && (step === 0 ? <Button busy={working} disabled={uncertain || !workspace.cardholderOptions.length} onClick={() => save()}>Review card</Button> : request && <Button busy={working} disabled={uncertain || confirmCancel || !request.canSubmit} onClick={() => void execute({kind: "submit", request})}>Create card</Button>)}</div></div>
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

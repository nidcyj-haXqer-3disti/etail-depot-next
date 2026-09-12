"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CardRequestProjection, WorkspaceCard, WorkspaceProjection } from "@/modules/workspace/contracts";
import type { CardRequestHistory, CardControlHistory } from "@/modules/workspace/dashboard-contracts";
import { Button, Feedback, StatusBadge, WorkspaceCommandError, WorkspaceDialog, capability, formatDate, formatMoney, workspaceCommand } from "./primitives";
import { useServerProjection } from "./use-server-projection";
import { cardholderTaskHref } from "../cardholder-routing";
import { CardPreview } from "./card-art";
import "./cards.css";
import {CardLimitControl,type SpendingLimitRecovery} from "./card-limit-control";

async function readCardholderContext(serviceId:string):Promise<WorkspaceProjection>{
  let response:Response;
  try{response=await fetch(`/api/v1/cardholder-services/${encodeURIComponent(serviceId)}/workspace`,{credentials:"same-origin",cache:"no-store",signal:AbortSignal.timeout(30_000)});}
  catch{throw new WorkspaceCommandError("We couldn’t check your current access. Your original request is still held for retry.",null);}
  if(!response.ok)throw new WorkspaceCommandError("Your current cardholder access could not be confirmed. Reload access or retry your original request.",response.status);
  try{const next=await response.json() as WorkspaceProjection;if(next?.service?.id!==serviceId||![next.cards,next.cardRequests,next.capabilities,next.cardholderOptions].every(Array.isArray))throw new Error();return next;}
  catch{throw new WorkspaceCommandError("We couldn’t verify the refreshed view. Your original request is still held for retry.",null);}
}
function deniedContext(error:unknown){return error instanceof WorkspaceCommandError&&[401,403,404].includes(error.status??0);}
const unconfirmedExitCopy="We haven’t confirmed this change yet. Leaving does not cancel it or tell us whether it was saved.";

export interface CardsWorkspaceProps { workspace: WorkspaceProjection; requestHistory?: CardRequestHistory; cardHistory?: CardControlHistory; routeBase?: string; initialControlAction?: "freeze"|"unfreeze"; onClose?: () => void }

export function CardsWorkspace({ workspace, requestHistory, cardHistory, routeBase, initialControlAction, onClose }: CardsWorkspaceProps) {
  const serviceName = workspace.customerService?.displayName ?? "Cards & spending";
  const cardRoute = routeBase ?? "/cardholder-services";
  const router = useRouter();
  const params = useSearchParams();
  const [, startNavigation] = useTransition();
  const [cardUpdates, setCardUpdates] = useState<Record<string, WorkspaceCard>>({});
  const [requestUpdates, setRequestUpdates] = useState<Record<string, CardRequestProjection>>({});
  const requestId = params.get("request")?.toLowerCase();
  const showNew = !requestId && params.get("new") === "1";
  const selectedId = requestId || showNew ? null : params.get("card")?.toLowerCase();
  const [confirmControl, setConfirmControl] = useState<"freeze"|"unfreeze"|null>(initialControlAction??null);
  const [controlAttempt,setControlAttempt]=useState<{action:"freeze"|"unfreeze";expectedVersion:number}|null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [limitRecovery,setLimitRecovery]=useState<SpendingLimitRecovery|null>(null);
  const [recipientRecovery,setRecipientRecovery]=useState<{retry:()=>Promise<WorkspaceCard>}|null>(null);
  const [cardUnavailable,setCardUnavailable]=useState(false),[requestUnavailable,setRequestUnavailable]=useState(false);
  const requestBusy = useCallback((value: boolean) => setBusy(value ? "request" : ""), []);
  const commandIds = useRef(new Map<string, string>());
  const cards = workspace.cards.map((card) => cardUpdates[card.id] && cardUpdates[card.id].version >= card.version ? cardUpdates[card.id] : card);
  const requestMap = new Map(workspace.cardRequests.map((item) => [item.id, item]));
  for (const update of Object.values(requestUpdates)) {
    if (workspace.cardholderRole==="OWNER" && (!requestMap.has(update.id) || requestMap.get(update.id)!.version <= update.version)) requestMap.set(update.id, update);
  }
  const requests = Array.from(requestMap.values());
  const selected = cards.find((card) => card.id === selectedId);
  const request = requests.find((item) => item.id === requestId);
  const ownCard = selected?.holderId === workspace.member.id;
  const cardNavigationBlocked = Boolean(busy || controlAttempt || limitRecovery || recipientRecovery);
  const requestCapability = capability(workspace, "cards.request");

  useEffect(() => {
    const resetTransientControl = () => { setConfirmControl(null); setError(""); setNotice(""); onClose?.(); };
    window.addEventListener("popstate", resetTransientControl);
    return () => window.removeEventListener("popstate", resetTransientControl);
  }, [onClose]);

  function navigateDialog(kind: "card" | "request" | "new" | null, value = "", push = false) {
    const query = new URLSearchParams(params.toString());
    // A route has one active card surface. Other page query state survives opening and closing it.
    for (const key of ["card", "request", "new", "manage", "transaction", "holder", "review", "cardTask"]) query.delete(key);
    if (kind) query.set(kind, kind === "new" ? "1" : value);
    const suffix = query.toString();
    const url = `${cardRoute}${suffix ? `?${suffix}` : ""}`;
    startNavigation(() => { if (push) router.push(url, { scroll: false }); else router.replace(url, { scroll: false }); });
  }
  function closeCard() {
    // Keep a pending control command until its saved result is confirmed.
    if (cardNavigationBlocked) return;
    onClose?.();
    setConfirmControl(null); setError(""); setNotice(""); navigateDialog(null);
  }
  function relatedService(task: "reports" | "settings" | "help", label: string) {
    return cardNavigationBlocked ? <Button variant="secondary" disabled>{label}</Button> : <Link className="consumer-button consumer-button-secondary" href={cardholderTaskHref(task, {cardId:selected?.id})}>{label}</Link>;
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
    const retrying=!!controlAttempt;
    const attempt=controlAttempt??{action:confirmControl,expectedVersion:selected.version};
    setControlAttempt(attempt);setBusy("control");setError("");
    try {
      const next=await command<WorkspaceCard>(`/cards/${encodeURIComponent(selected.id)}/control`,"POST",attempt);
      setCardUpdates(current=>({...current,[next.id]:next}));setCardUnavailable(false);setControlAttempt(null);setConfirmControl(null);
      setNotice(next.status==="FROZEN"?(attempt.action==="unfreeze"?"Your freeze was removed. This card remains frozen. ":"Freeze saved. ")+next.freeze.description:"Card unfrozen. The person named on the card can spend within its limit and the available card balance.");
      router.refresh();
    } catch(failure){
      const unknown=failure instanceof WorkspaceCommandError&&failure.uncertain;
      setError(failure instanceof WorkspaceCommandError&&failure.code==="PRIMARY_FREEZE_ACTIVE"?"Only the account owner can remove this freeze.":failure instanceof Error?failure.message:"We couldn’t update this card.");
      if(!unknown&&!retrying){setControlAttempt(null);setConfirmControl(null);router.refresh();}
    } finally{setBusy("");}
  }

  async function reloadCardAccess(){
    if(busy||!selected)return;setBusy("reload");setError("");
    try{
      const current=await readCardholderContext(workspace.service.id),card=current.cards.find(item=>item.id===selected.id);
      const action=controlAttempt?`cards.${controlAttempt.action}`:"cards.purchase";
      const unavailable=!card||!capability(current,action)?.allowed||(controlAttempt?card.holderId!==current.member.id&&!capability(current,"cards.manageMembers")?.allowed:["ACCESS_RESTRICTED","SETUP_REQUIRED"].includes(card.purchaseAvailability.code));
      setCardUnavailable(unavailable);
      if(!unavailable&&card)setCardUpdates(previous=>({...previous,[card.id]:card}));
      setNotice(unavailable?"":"Current card access checked. Retry the original request to confirm its result.");
    }catch(failure){if(deniedContext(failure))setCardUnavailable(true);setError(failure instanceof Error?failure.message:"We couldn’t reload card access.");}
    finally{setBusy("");}
  }
  const leaveUnconfirmed=()=>router.push("/cardholder-services");
  const cardRecovery=controlAttempt&&<div className="consumer-action-row"><Button variant="secondary" busy={busy==="reload"} disabled={!!busy} onClick={()=>void reloadCardAccess()}>Check card access</Button>{cardUnavailable&&<Button variant="quiet" disabled={!!busy} onClick={leaveUnconfirmed}>Leave unconfirmed request</Button>}</div>;

  return <section className="consumer-workspace">
    {selectedId && !selected && <Feedback kind="error" message="This card is no longer available. Return to your cards and refresh." />}
    {selected && <WorkspaceDialog open onClose={closeCard} title={cardUnavailable?"Card access unavailable":confirmControl ? `${confirmControl === "unfreeze" ? selected.freeze.unfreezeLabel : selected.freeze.freezeLabel}?` : selected.nickname} serviceName={cardUnavailable?"Cards & spending":serviceName} wide>
      <Feedback kind="error" message={error} />{!cardUnavailable&&<Feedback kind="success" message={notice} />}{cardRecovery}
      {cardUnavailable?<>{recipientRecovery&&<div className="consumer-action-row"><Button busy={!!busy} onClick={async()=>{if(busy)return;setBusy("recipient");try{const card=await recipientRecovery.retry();setCardUpdates(current=>({...current,[card.id]:card}));setRecipientRecovery(null);setCardUnavailable(false);setError("");router.refresh();}catch(e){setError(e instanceof Error?e.message:"We couldn’t confirm this cardholder removal.");}finally{setBusy("");}}}>Retry saved card removal</Button><Button variant="quiet" disabled={!!busy} onClick={leaveUnconfirmed}>Leave unconfirmed request</Button></div>}{limitRecovery&&<Button busy={!!busy} onClick={async()=>{if(busy)return;setBusy("limit");try{await limitRecovery.retry();setLimitRecovery(null);setCardUnavailable(false);setError("");router.refresh();}catch(e){setError(e instanceof Error?e.message:"We couldn’t confirm this limit.");}finally{setBusy("");}}}>Retry saved card limit</Button>}<p>Current access no longer allows this card action. {unconfirmedExitCopy}</p>{controlAttempt?<Button busy={busy==="control"} disabled={!!busy} onClick={()=>void controlCard()}>Retry same change</Button>:null}</>:confirmControl ? <><div className="consumer-review-highlight"><strong>{selected.nickname} · •••• {selected.lastFour}</strong><span>{selected.holderName}</span><span>{serviceName}</span></div><p>{confirmControl==="unfreeze"?selected.freeze.unfreezeDescription:"Your freeze will stop new purchases. Past activity and available funds stay visible."}</p><p className="consumer-muted">{selected.freeze.description}</p>{!(confirmControl==="unfreeze"?selected.canUnfreeze:selected.canFreeze)&&!controlAttempt&&<p className="consumer-muted">This change is no longer available. Return to the card to review its current restrictions.</p>}{controlAttempt&&!busy&&<p role="status">We haven’t confirmed this change. Retry the same change before taking another action.</p>}<div className="consumer-action-row"><Button variant="secondary" disabled={Boolean(busy)||Boolean(controlAttempt)} onClick={()=>setConfirmControl(null)}>Back to card</Button><Button busy={busy==="control"} disabled={!controlAttempt&&!(confirmControl==="unfreeze"?selected.canUnfreeze:selected.canFreeze)} onClick={()=>void controlCard()}>{controlAttempt?"Retry same change":confirmControl==="unfreeze"?selected.freeze.unfreezeLabel:selected.freeze.freezeLabel}</Button></div></> : <>
        <div className="consumer-card-detail-grid"><div><CardPreview card={selected} /></div><div className="consumer-card-summary"><StatusBadge status={selected.status}/><p>{selected.holderName} · Ending {selected.lastFour}</p><p>{ownCard ? "Your card" : "Managed by you"}</p><dl><dt>{ownCard ? "Available to spend" : "Available within the card limit"}</dt><dd>{formatMoney(selected.available)}</dd></dl></div></div>
        {(!ownCard || !selected.canPurchase) && <div className="consumer-card-availability" role="status"><strong>{selected.purchaseAvailability.title}</strong><p>{selected.purchaseAvailability.description}</p></div>}
        {selected.canInvite&&<Link className="consumer-button consumer-button-primary" href={`/cards/${selected.id}/invite`}>Invite cardholder</Link>}
        {selected.canRevokeAssignment&&<CardRecipientRemoval command={command} disabled={cardNavigationBlocked} card={selected} onSaved={card=>{setCardUpdates(current=>({...current,[card.id]:card}));router.refresh();}} onBusy={value=>setBusy(value?"recipient":"")} onAccessDenied={recovery=>{setRecipientRecovery(recovery);setCardUnavailable(true);setBusy("");}}/>}
        <section className="consumer-card-controls-panel">
        {capability(workspace,"cardholder.limits.manage")?.allowed&&<CardLimitControl key={`${selected.id}:${selected.spending.version}`} serviceId={workspace.service.id} name={selected.nickname} spending={selected.spending} onBusy={value=>setBusy(value?"limit":"")} onSaved={spending=>setCardUpdates(current=>({...current,[selected.id]:{...selected,spending,available:spending.available}}))} onAccessDenied={recovery=>{setLimitRecovery(recovery);setCardUnavailable(true);setBusy("");}}/>}
        <h3>Card settings</h3><p className="consumer-restriction-status" role="status">{selected.status === "FROZEN" ? selected.freeze.description : "Manage new purchases while keeping past activity and balances visible."}</p><div className="consumer-control-list">{selected.canFreeze&&<div><span><strong>{selected.freeze.freezeLabel}</strong><small>Stop new purchases without removing card access or past activity.</small></span><Button variant="secondary" disabled={cardNavigationBlocked} onClick={()=>setConfirmControl("freeze")}>{selected.status==="ACTIVE"?"Freeze":selected.freeze.freezeLabel}</Button></div>}{selected.canUnfreeze&&<div><span><strong>{selected.freeze.unfreezeLabel}</strong><small>{selected.freeze.unfreezeDescription}</small></span><Button variant="secondary" disabled={cardNavigationBlocked} onClick={()=>setConfirmControl("unfreeze")}>{selected.freeze.unfreezeLabel==="Unfreeze card"?"Unfreeze":selected.freeze.unfreezeLabel}</Button></div>}</div>
        {!(selected.canFreeze||selected.canUnfreeze)&&<p className="consumer-muted">Your access allows you to view this card. Ask the account owner about changes.</p>}
        {cardHistory&&<details className="consumer-request-history"><summary>Card control history</summary>{cardHistory.events.length?<ol>{cardHistory.events.map(event=><li key={event.id}><span><strong>{event.label}</strong><small> · {event.actorName}</small></span><time dateTime={event.occurredAt}>{formatDate(event.occurredAt)}</time></li>)}</ol>:<p>No freeze changes are recorded for this card.</p>}<p>Recorded actions are shown here. The current restrictions above determine whether the card can be used.</p>{cardHistory.hasEarlierEvents&&<p>Showing the latest 100 recorded actions.</p>}</details>}
        <Link className="consumer-text-link" href={cardholderTaskHref("activity", {cardId:selected.id})}>View this card’s activity <span aria-hidden="true">↗</span></Link>
        <details className="consumer-card-more"><summary>Card details and other services</summary><dl className="consumer-detail-list"><div><dt>Card account</dt><dd>{serviceName}</dd></div><div><dt>Card network</dt><dd>Visa · Sandbox</dd></div><div><dt>Card format</dt><dd>{selected.format === "VIRTUAL" ? "Virtual" : "Physical · Delivery unavailable"}</dd></div><div><dt>Total spending limit</dt><dd>{selected.spending.allowance.formatted}</dd></div><div><dt>Used</dt><dd>{selected.spending.used.formatted}</dd></div></dl><p className="consumer-muted">This limit applies only to this card until the account owner changes it. Purchases also need available card balance. Refunds return money but do not reset the amount used.</p></details>
        </section>
        <div className="consumer-action-row" aria-label="Related Cards & spending">{capability(workspace,"activity.read")?.allowed && relatedService("reports","Statements & reports")}{relatedService("settings","Notification preferences")}{relatedService("help","Help with this card")}</div>
      </>}
    </WorkspaceDialog>}
    {(showNew || request) && <WorkspaceDialog open onClose={closeRequest} title={requestUnavailable?"Card request access unavailable":request?.status==="ISSUED"||request?.status==="CANCELED"?"Card request":"Add card"} serviceName={requestUnavailable?"Cards & spending":serviceName} wide><CardRequestForm key={request?.id ?? "new"} request={request ?? null} history={requestHistory} workspace={workspace} canEdit={requestCapability?.allowed === true} command={command} routeBase={cardRoute} onUpdate={updateRequest} onBusy={requestBusy} onClose={closeRequest} onUnavailable={setRequestUnavailable} onLeave={leaveUnconfirmed} /></WorkspaceDialog>}
  </section>;
}

function CardRecipientRemoval({card,disabled,command,onSaved,onBusy,onAccessDenied}:{card:WorkspaceCard;disabled:boolean;command:<T>(path:string,method:"POST"|"PATCH",input?:Record<string,unknown>)=>Promise<T>;onSaved:(card:WorkspaceCard)=>void;onBusy:(busy:boolean)=>void;onAccessDenied:(recovery:{retry:()=>Promise<WorkspaceCard>}|null)=>void}){
  const [review,setReview]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
  const pending=useRef<{expectedVersion:number}|null>(null);
  const [uncertain,setUncertain]=useState(false);
  async function remove(){
    if(busy)return;
    const retrying=uncertain,input=pending.current??{expectedVersion:card.version};pending.current=input;
    setBusy(true);onBusy(true);setError("");
    try{
      const result=await command<WorkspaceCard>(`/cards/${card.id}/recipient/revoke`,"POST",input);
      pending.current=null;setUncertain(false);setReview(false);onSaved(result);onBusy(false);
    }catch(failure){
      const unknown=retrying||(failure instanceof WorkspaceCommandError&&failure.uncertain);
      setError(failure instanceof Error?failure.message:"We couldn’t remove card access.");setUncertain(unknown);
      if(!unknown){pending.current=null;onBusy(false);}
      if(deniedContext(failure))onAccessDenied(unknown?{retry:()=>command<WorkspaceCard>(`/cards/${card.id}/recipient/revoke`,"POST",input)}:null);
    }finally{setBusy(false);}
  }
  return <section className="consumer-card-recipient"><Feedback kind="error" message={error}/>{review?<><h3>Remove {card.holderName} from this card?</h3><p>They will lose access to this card and can no longer use it. Their other cards stay the same. You keep this card’s history. To give access again, create a new card.</p>{uncertain&&<p role="status">This change is not confirmed. Retry the same request to find its result.</p>}<div className="consumer-action-row"><Button variant="secondary" disabled={busy||uncertain} onClick={()=>{setReview(false);setError("");}}>Keep cardholder</Button><Button variant="danger" busy={busy} onClick={()=>void remove()}>{uncertain?"Retry same removal":"Remove cardholder"}</Button>{uncertain&&<Link href="/cardholder-services">Leave unconfirmed request</Link>}</div></>:<Button variant="quiet" disabled={disabled} onClick={()=>setReview(true)}>Remove cardholder</Button>}</section>;
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
  onUnavailable:(unavailable:boolean)=>void;onLeave:()=>void;
}
type CardFormAttempt =
  | { kind: "save"; fields: {holderId: string | null; nickname: string; format: "VIRTUAL" | "PHYSICAL";allowanceMinor:string}; request: CardRequestProjection | null; closeAfter: boolean }
  | { kind: "submit" | "cancel"; request: CardRequestProjection };

function CardRequestForm({ request: initialRequest, history, workspace:initialWorkspace, canEdit:initialCanEdit, command, onUpdate, onBusy, onClose, onUnavailable, onLeave, routeBase }: CardRequestFormProps) {
  const allowanceFieldId=useId();
  const params = useSearchParams(), router = useRouter();
  const [workspace,setWorkspace]=useServerProjection(initialWorkspace);
  const canEdit=initialCanEdit&&capability(workspace,"cards.request")?.allowed===true;
  const [unavailable,setUnavailable]=useState(false);
  useEffect(()=>{onUnavailable(unavailable);return()=>onUnavailable(false);},[onUnavailable,unavailable]);
  const [isNavigating, startNavigation] = useTransition();
  const [request, setRequest] = useState(initialRequest);
  const [step, setStep] = useState(params.get("review") === "1" || initialRequest?.status === "BLOCKED" || initialRequest?.status === "CANCELED" || initialRequest?.status === "ISSUED" ? 1 : 0);
  const [holderId, setHolderId] = useState<string|null>(initialRequest?.holderId ?? null);
  const [allowance,setAllowance]=useState(initialRequest ? (BigInt(initialRequest.allowance.minor)/100n).toString()+"."+(BigInt(initialRequest.allowance.minor)%100n).toString().padStart(2,"0") : "");
  const [nickname, setNickname] = useState(initialRequest?.nickname || "");
  const [format, setFormat] = useState<"VIRTUAL" | "PHYSICAL">(initialRequest?.format ?? "VIRTUAL");
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [uncertain, setUncertain] = useState(false);
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
    for (const key of ["card", "request", "new", "manage", "transaction", "holder", "review", "cardTask"]) query.delete(key);
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
    const retrying=uncertain;
    inFlight.current = true; pending.current = attempt;
    setBusy(true); onBusy(true); setError(""); setUncertain(false);
    let unknown = false;
    try {
      if (attempt.kind === "save") {
        // Keep the confirmed draft and immutable field snapshot through a lost
        // start/save response. The command wrapper retains each command identity.
        if (!attempt.request) { attempt.request = await command<CardRequestProjection>("/card-requests", "POST"); update(attempt.request); }
        const next = await command<CardRequestProjection>(`/card-requests/${encodeURIComponent(attempt.request.id)}`, "PATCH", {expectedVersion: attempt.request.version, ...attempt.fields});
        setUnavailable(false); update(next); pending.current = null; setStep(1); navigate(next, attempt.closeAfter);
      } else {
        const action = attempt.kind === "submit" ? "submit" : "cancel";
        const next = await command<CardRequestProjection>(`/card-requests/${encodeURIComponent(attempt.request.id)}/${action}`, "POST", {expectedVersion: attempt.request.version});
        setUnavailable(false); update(next); pending.current = null; setStep(1);setConfirmCancel(false);router.refresh();
        if (next.status === "ISSUED") navigate(next);
      }
    } catch (failure) {
      unknown = retrying||(failure instanceof WorkspaceCommandError && failure.uncertain);
      setUncertain(unknown);
      if (!unknown) pending.current = null;
      setError(failure instanceof Error ? failure.message : "We couldn’t confirm your card request. Please try again.");
    } finally { inFlight.current = false; setBusy(false); }
  }
  function save(closeAfter = false) {
    if (working || uncertain) return;
    if (!nickname.trim()) { setError("Enter a name for this card."); return; }
    if(!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(allowance.trim())){setError("Enter a total card spending limit in USD, with up to two decimal places.");return;}
    const [whole,fraction=""]=allowance.trim().split("."),allowanceMinor=(BigInt(whole!)*100n+BigInt(fraction.padEnd(2,"0"))).toString();
    void execute({kind: "save", fields: {holderId, nickname: nickname.trim(), format,allowanceMinor}, request, closeAfter});
  }
  async function reloadRequestAccess(){
    if(working)return;setBusy(true);setError("");
    try{
      const current=await readCardholderContext(initialWorkspace.service.id),attempt=pending.current;
      const target=attempt?.request??request;
      const saved=target?current.cardRequests.find(item=>item.id===target.id):null;
      const inaccessible=!capability(current,"cards.request")?.allowed||!!target&&!saved||(attempt?.kind==="submit"&&(!capability(current,"cards.create")?.allowed||(attempt.request.holderId!==null&&!current.cardholderOptions.some(person=>person.id===attempt.request.holderId))));
      setUnavailable(inaccessible);setWorkspace(current);if(saved)setRequest(saved);
    }catch(failure){if(deniedContext(failure))setUnavailable(true);setError(failure instanceof Error?failure.message:"We couldn’t reload request access.");}
    finally{setBusy(false);}
  }
  const recovery=uncertain&&<div className="consumer-card-retry"><p>{unavailable?unconfirmedExitCopy:"Keep this form open while we confirm your request. Your details are held safely for this retry."}</p><div className="consumer-action-row"><Button variant="secondary" busy={working} onClick={()=>pending.current&&void execute(pending.current)}>Retry the same request</Button><Button variant="secondary" disabled={working} onClick={()=>void reloadRequestAccess()}>Check request access</Button>{unavailable&&<Button variant="quiet" disabled={working} onClick={onLeave}>Leave unconfirmed request</Button>}</div></div>;
  if(unavailable)return <div className="consumer-card-form" aria-busy={working}><h3>Card request unavailable</h3><Feedback kind="error" message={error}/><p>Current access no longer allows this request.</p>{recovery}</div>;
  return <div className="consumer-card-form" aria-busy={working}>
    <div className="consumer-card-form-content">
    <ol className="consumer-stepper consumer-card-stepper" aria-label="Card request progress">{["Card details", "Review & create"].map((label, index) => <li key={label} className={step === index ? "is-current" : step > index ? "is-complete" : ""} aria-current={step === index ? "step" : undefined}><span>{index + 1}</span>{label}</li>)}</ol>
    <Feedback kind="error" message={error}/>{recovery}
    {step === 0 && <><h3>Create a card</h3><p>Set up the card now. Then invite its cardholder by sharing a link.</p><fieldset disabled={disabled} className="consumer-holder-options"><legend>Who will use this card?</legend><label className={`consumer-holder-option ${holderId===null?"is-selected":""}`}><input type="radio" name="cardholder" checked={holderId===null} onChange={()=>setHolderId(null)}/><span><strong>Someone else</strong><small>Invite them after creating the card</small></span></label>{workspace.cardholderOptions.some(person=>person.id===workspace.member.id)&&<label className={`consumer-holder-option ${holderId===workspace.member.id?"is-selected":""}`}><input type="radio" name="cardholder" checked={holderId===workspace.member.id} onChange={()=>setHolderId(workspace.member.id)}/><span><strong>Me</strong><small>{workspace.member.displayName}</small></span></label>}</fieldset>
      <div className="consumer-form-fields consumer-card-details-fields"><label>Card name<input name="nickname" value={nickname} maxLength={60} disabled={disabled} onChange={event => setNickname(event.target.value)} autoComplete="off" placeholder="For example, Everyday purchases"/></label>
        <div className="consumer-card-allowance-field"><label htmlFor={allowanceFieldId}>Total spending limit (USD)<input id={allowanceFieldId} aria-describedby={`${allowanceFieldId}-help`} inputMode="decimal" name="allowance" value={allowance} disabled={disabled} onChange={event=>setAllowance(event.target.value)} placeholder="0.00"/></label><small id={`${allowanceFieldId}-help`}>The most this card can spend in total. It stays in place until you change it. Setting a limit does not add money.</small></div><details className="consumer-format-details"><summary>{format === "VIRTUAL" ? "Virtual card" : "Physical card · Delivery unavailable"} <span>Change format</span></summary><fieldset disabled={disabled}><legend>Card format</legend><div className="consumer-format-options">{(["VIRTUAL", "PHYSICAL"] as const).map(value => <label key={value}><input type="radio" name="format" checked={format === value} onChange={() => setFormat(value)}/><span><strong>{value === "VIRTUAL" ? "Virtual card" : "Physical card"}</strong><small>{value === "VIRTUAL" ? "Digital card" : "Delivery is not available"}</small></span></label>)}</div></fieldset></details>
      </div></>}
    {step === 1 && request && <><div className="consumer-section-heading"><h3>{request.status === "ISSUED" ? "Card created" : request.status === "CANCELED" ? "Request canceled" : request.status === "BLOCKED" ? "Your card needs attention" : "Review your card"}</h3>{["BLOCKED", "CANCELED", "ISSUED"].includes(request.status) && <StatusBadge status={request.status} label={request.status === "BLOCKED" ? "Needs attention" : undefined}/>}</div>
      <dl className="consumer-detail-list consumer-review-list"><div><dt>Cardholder</dt><dd>{request.holderId===null?"Invite after creating the card":holder?.displayName ?? request.holderName}</dd></div><div><dt>Card name</dt><dd>{request.nickname}</dd></div><div><dt>Total spending limit</dt><dd>{request.allowance.formatted}</dd></div><div><dt>Format</dt><dd>{request.format === "VIRTUAL" ? "Virtual" : "Physical · Delivery unavailable"}</dd></div></dl>
      {request.status !== "CANCELED" && request.status !== "ISSUED" && <div className="consumer-prerequisites">{request.prerequisites.length ? <><h4>Before you create this card</h4><ul>{request.prerequisites.map(item => <li key={item.code}><strong>{item.title}</strong><p>{item.detail}</p></li>)}</ul></> : <p>Purchases use the card balance, up to this card’s total spending limit. The limit does not reset automatically. Creating a card does not add money.</p>}</div>}
      {request.status === "ISSUED" && request.issuedCardId && <Button onClick={() => navigate(request)}>View your card</Button>}
    </>}

    {!frozen && request && (confirmCancel?<section className="consumer-cancel-review" aria-label="Cancel card request"><h3>Cancel {request.nickname}?</h3><p>No card will be created. This request will remain in your history.</p><div className="consumer-action-row"><Button variant="secondary" disabled={working||uncertain} onClick={()=>setConfirmCancel(false)}>Keep request</Button><Button variant="danger" disabled={working||uncertain} onClick={()=>void execute({kind:"cancel",request})}>Confirm cancellation</Button></div></section>:<button className="consumer-cancel-request" type="button" disabled={working || uncertain} onClick={() => setConfirmCancel(true)}>Cancel this request</button>)}
    {request?.status === "CANCELED" && <p className="consumer-form-footnote">This request remains in your history. No card was created.</p>}
    {request&&history&&<details className="consumer-request-history"><summary>Request history</summary><p>Started {formatDate(history.createdAt)}. Current status: {request.status==="BLOCKED"?"Needs attention":request.status==="ISSUED"?"Card created":request.status==="CANCELED"?"Canceled":"Draft"}.</p>{history.events.length?<ol>{history.events.map(event=><li key={event.id}><strong>{event.label}</strong><time dateTime={event.occurredAt}>{formatDate(event.occurredAt)}</time></li>)}</ol>:<p>No earlier actions are recorded for this request.</p>}<p>Creation checks can leave a request needing attention. The current status above confirms whether a card was created.</p>{history.hasEarlierEvents&&<p>Showing the latest 100 recorded actions.</p>}</details>}
    </div>
    <div className="consumer-form-footer">{step === 1 && !frozen && <Button variant="quiet" disabled={working || uncertain} onClick={() => setStep(0)}>Edit details</Button>}<div>{frozen || !request && !nickname ? <Button variant="secondary" disabled={working || uncertain} onClick={onClose}>Close</Button> : <Button variant="secondary" disabled={working || uncertain} onClick={() => step === 0 ? save(true) : request && navigate(request, true)}>Save for later</Button>}{!frozen && (step === 0 ? <Button busy={working} disabled={uncertain} onClick={() => save()}>Review card</Button> : request && <Button busy={working} disabled={uncertain || confirmCancel || !request.canSubmit} onClick={() => void execute({kind: "submit", request})}>Create card</Button>)}</div></div>
  </div>;
}

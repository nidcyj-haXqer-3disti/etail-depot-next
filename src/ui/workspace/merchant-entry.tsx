"use client";

import {useServerProjection} from "./use-server-projection";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MerchantBusinessDetailsProjection, MerchantSetupProjection, MerchantStatus, UpdateMerchantSetupInput } from "@/modules/acquiring/contracts";
import { Button, Feedback, StatusBadge, WorkspaceCommandError, WorkspaceDialog, formatDate, merchantCommand } from "./primitives";
import { WorkspaceIcon } from "./navigation";
import { useMerchantNavigationLock } from "./merchant-navigation-state";
import { requestFailure } from "../api-feedback";
import "./merchant-entry.css";

export interface MerchantBusinessDetailsProps { initial: MerchantBusinessDetailsProjection }
const merchantLabels: Record<MerchantStatus, string> = { NOT_STARTED: "Not started", DRAFT: "Draft", PENDING_LOCAL_REVIEW: "Saved for review", APPROVED: "Approved", RESTRICTED: "Restricted", DECLINED: "Declined", CLOSED: "Closed" };
const legalLabels = { INDIVIDUAL: "Individual", SOLE_PROPRIETOR: "Sole proprietor", BUSINESS: "Business" };

export function MerchantBusinessDetails({ initial }: MerchantBusinessDetailsProps) {
  const router = useRouter();
  const [entry, setEntry, entryChanged, isEntryCurrent] = useServerProjection(initial);
  const [showSetup, setShowSetup] = useState(false);
  const [startPending,setStartPending]=useState(false),[startUnavailable,setStartUnavailable]=useState(false),[leavingStart,setLeavingStart]=useState(false);
  const [setupUnavailable,setSetupUnavailable]=useState(false);
  const [setupBusy, setSetupBusy] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const commandIds = useRef(new Map<string, string>());
  if(entryChanged){setSetupBusy(false);setBusy("");setError("");}
  useMerchantNavigationLock(!!busy||(startPending&&!leavingStart));
  const merchant = entry;
  const merchantId = entry.merchantId;

  async function command<T>(path: string, method: "POST" | "PATCH", input: Record<string, unknown> = {}) {
    const key = JSON.stringify([path, method, input]);
    if (!commandIds.current.has(key)) commandIds.current.set(key, crypto.randomUUID());
    const response = await merchantCommand<T>(merchantId, path, method, { ...input, commandId: commandIds.current.get(key) });
    if(!isEntryCurrent())throw new WorkspaceCommandError("This view changed while the request was completing. Retry the same request to confirm its saved result.",408);
    commandIds.current.delete(key);
    return response;
  }
  async function refreshEntry() {
    const response = await fetch(`/api/v1/merchants/${encodeURIComponent(merchantId)}/business-details`, { credentials: "same-origin", cache: "no-store" });
    if (!response.ok) throw new WorkspaceCommandError(requestFailure(response.status, "We couldn’t reload your business details. Your saved details are still available. Please retry."),response.status);
    const next = await response.json() as MerchantBusinessDetailsProjection; if(!isEntryCurrent())throw new WorkspaceCommandError("Your access to business details has changed. Reload to check again.",408);setEntry(next); return next;
  }
  function updatedSetup(next: MerchantSetupProjection) {
    setEntry(current => ({ ...current, setup: next, merchantStatus: next.status }));
  }
  function returnToPayments() {
    setShowSetup(false); setError("");
    router.push(`/merchants/${merchantId}?tab=verification`);
  }
  function closeSetup() { if(!setupBusy)returnToPayments(); }
  async function startSetup() {
    const retrying=startPending;setStartPending(true);setLeavingStart(false);setBusy("start"); setError("");
    try {
      const result = await command<MerchantSetupProjection>("/business-details/application", "POST");
      if(!isEntryCurrent())return;setStartPending(false);setStartUnavailable(false);updatedSetup(result); setShowSetup(true);
    } catch (failure) { if(!isEntryCurrent())return;if(failure instanceof WorkspaceCommandError&&!failure.uncertain&&!retrying)setStartPending(false);setError(failure instanceof Error ? failure.message : "We couldn’t start your business details. Please retry."); }
    finally { if(isEntryCurrent())setBusy(""); }
  }

  async function reloadStart(){
    setBusy("reload");setError("");setLeavingStart(false);
    try{await refreshEntry();if(!isEntryCurrent())return;setStartUnavailable(false);}
    catch(failure){if(!isEntryCurrent())return;if(failure instanceof WorkspaceCommandError&&[401,403,404].includes(failure.status??0))setStartUnavailable(true);setError(failure instanceof Error?failure.message:"We couldn’t check your current access. Please retry.");}
    finally{if(isEntryCurrent())setBusy("");}
  }
  if(startUnavailable)return <section className="merchant-entry-workspace"><h1>Business details unavailable</h1><Feedback kind="error" message={error}/><p>Your current access no longer allows these business details. The unconfirmed request is retained here. Leaving does not cancel it or confirm whether it was saved.</p><div className="merchant-entry-form-actions"><Button disabled={!!busy} busy={busy==="start"} onClick={()=>void startSetup()}>Check setup request again</Button><Button variant="secondary" disabled={!!busy} busy={busy==="reload"} onClick={()=>void reloadStart()}>Reload business details</Button><Button variant="quiet" disabled={!!busy} onClick={()=>{setLeavingStart(true);router.push("/merchant-services");}}>Leave for now</Button></div></section>;

  return <section className="consumer-workspace merchant-entry-workspace" aria-labelledby="merchant-entry-title">
    <header className="merchant-entry-hero"><div><p className="consumer-eyebrow">BUSINESS DETAILS</p><h1 id="merchant-entry-title">{setupUnavailable?"Accept payments":merchant.name}</h1><p>Add your business details, then continue to payment setup.</p></div></header>
    {!showSetup&&<Feedback kind="error" message={error}/>}
    {startPending&&<Button variant="secondary" disabled={!!busy} busy={busy==="reload"} onClick={()=>void reloadStart()}>Reload business details</Button>}
    {setupUnavailable ? <p>Business details are not available with your current access.</p> : <>
      <section className="merchant-setup-status" aria-label="Business details"><div className="merchant-setup-status-main"><div className="merchant-setup-status-top"><h3>Business details</h3><StatusBadge status={merchant.merchantStatus} label={merchantLabels[merchant.merchantStatus]} /></div><p>{merchant.setup ? merchant.setup.status === "PENDING_LOCAL_REVIEW" ? "Your details are saved for review. Return to payment setup for the next step." : "Your details are saved. Continue where you left off." : "Start with your business name and a short description of what you sell."}</p>{merchant.setup && <p>Account owner: <strong>{merchant.setup.responsiblePersonName}</strong></p>}<div className="merchant-setup-status-actions">{startPending?<Button busy={busy==="start"} disabled={!!busy} onClick={()=>void startSetup()}>Check setup request again</Button>:merchant.setup ? <Button variant={merchant.setup.canEdit?"primary":"secondary"} onClick={() => { setError(""); setShowSetup(true); }}>{merchant.setup.canEdit ? "Continue business details" : "View business details"}</Button> : (merchant.canStartSetup||startPending) ? <Button busy={busy === "start"} disabled={!!busy} onClick={() => void startSetup()}>{startPending?"Check setup request again":"Add business details"}</Button> : null}</div>{!merchant.canManageSetup && merchant.setup?.status === "DRAFT" && <p>Your current access lets you view this draft. Your account owner can update it.</p>}</div><div className="merchant-setup-next"><p>Payment settings show what needs to be ready before customers can pay.</p><a className="consumer-button consumer-button-secondary" href={`/merchants/${merchantId}?tab=verification`}>Return to payment setup</a></div></section>
    </>}

    {merchant?.setup && <WorkspaceDialog open={showSetup} onClose={closeSetup} title="Business details" serviceName={setupUnavailable?"Accept payments":merchant.name} wide><MerchantSetupForm key={merchant.setup.id} initial={merchant.setup} serviceName={merchant.name} command={command} onUpdate={updatedSetup} onClose={returnToPayments} onLeave={()=>router.push("/merchant-services")} onUnavailableChange={setSetupUnavailable} onBusyChange={setSetupBusy} refresh={async () => (await refreshEntry()).setup ?? null} /></WorkspaceDialog>}
  </section>;
}

interface MerchantSetupFormProps {
  initial: MerchantSetupProjection; serviceName: string;
  command: <T>(path: string, method: "POST" | "PATCH", input?: Record<string, unknown>) => Promise<T>;
  onUpdate: (next: MerchantSetupProjection) => void; onClose: () => void; refresh: () => Promise<MerchantSetupProjection | null>;
  onBusyChange: (busy: boolean) => void; onUnavailableChange:(unavailable:boolean)=>void; onLeave:()=>void;
}
function MerchantSetupForm({ initial, serviceName, command, onUpdate, onClose, refresh, onBusyChange, onUnavailableChange, onLeave }: MerchantSetupFormProps) {
  const [setup, setSetup, projectionChanged, isCurrent] = useServerProjection(initial);
  const [review, setReview] = useState(!initial.canEdit || initial.status === "PENDING_LOCAL_REVIEW");
  const [entityType, setEntityType] = useState(initial.legalEntityType);
  const [legalName, setLegalName] = useState(initial.legalName);
  const [sellingName, setSellingName] = useState(initial.sellingName);
  const [description, setDescription] = useState(initial.activityDescription);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [stale, setStale] = useState(false);
  const [accessUnavailable,setAccessUnavailable]=useState(false),[leavingUnconfirmed,setLeavingUnconfirmed]=useState(false);
  const [pending, setPending] = useState<{ kind: "SAVE"; fields: Omit<UpdateMerchantSetupInput, "commandId">; review: boolean; closeAfter: boolean } | { kind: "SUBMIT"; version: number } | null>(null);
  if(projectionChanged){
    if(!initial.canEdit)setReview(true);
    if(!pending||!initial.canEdit){setEntityType(initial.legalEntityType);setLegalName(initial.legalName);setSellingName(initial.sellingName);setDescription(initial.activityDescription);}
    setBusy("");setStale(false);setError("");
  }
  const locked = !!busy || stale || !!pending;
  useMerchantNavigationLock(!!busy||(!!pending&&!leavingUnconfirmed));
  useEffect(()=>{onBusyChange(!!busy||(!!pending&&!leavingUnconfirmed));return()=>onBusyChange(false);},[busy,pending,leavingUnconfirmed,onBusyChange]);
  useEffect(()=>{onUnavailableChange(accessUnavailable);return()=>onUnavailableChange(false);},[accessUnavailable,onUnavailableChange]);
  const path = `/business-details/application/${encodeURIComponent(setup.id)}`;

  async function save(nextReview: boolean, closeAfter = false) {
    const retrying=pending!==null;
    setBusy("save");setLeavingUnconfirmed(false); setError(""); setNotice("");
    const fields: Omit<UpdateMerchantSetupInput, "commandId"> = pending?.kind === "SAVE" ? pending.fields : { expectedVersion: setup.version, legalEntityType: entityType, legalName: legalName.trim(), sellingName: sellingName.trim(), activityDescription: description.trim(), country: "US", fictionalDetailsConfirmed: true };
    const nextStep = pending?.kind === "SAVE" ? pending.review : nextReview;
    const shouldClose = pending?.kind === "SAVE" ? pending.closeAfter : closeAfter;
    setPending({ kind: "SAVE", fields, review: nextStep, closeAfter: shouldClose });
    try {
      const next = await command<MerchantSetupProjection>(path, "PATCH", fields);
      if(!isCurrent())return;
      setPending(null);setAccessUnavailable(false); setSetup(next); onUpdate(next); setLegalName(next.legalName); setSellingName(next.sellingName); setDescription(next.activityDescription); setReview(nextStep); setNotice("Your business details are saved.");
      if (shouldClose) { onClose(); }
    } catch (failure) { if(!isCurrent())return;setError(failure instanceof Error ? failure.message : "We couldn’t save the draft. Your entered details are still here."); if (failure instanceof WorkspaceCommandError && !failure.uncertain&&!retrying) setPending(null); setStale(failure instanceof WorkspaceCommandError && failure.status === 409); }
    finally { if(isCurrent()){setBusy("");} }
  }
  async function submit() {
    const retrying=pending!==null;
    setBusy("submit");setLeavingUnconfirmed(false); setError(""); setNotice("");
    const version = pending?.kind === "SUBMIT" ? pending.version : setup.version;
    setPending({ kind: "SUBMIT", version });
    try {
      const next = await command<MerchantSetupProjection>(`${path}/submit`, "POST", { expectedVersion: version });
      if(!isCurrent())return;
      setPending(null);setAccessUnavailable(false); setSetup(next); onUpdate(next); setNotice(`Business details for ${serviceName} are saved for review.`);
    } catch (failure) { if(!isCurrent())return;setError(failure instanceof Error ? failure.message : "We couldn’t confirm submission. Retry to confirm the same request."); if (failure instanceof WorkspaceCommandError && !failure.uncertain&&!retrying) setPending(null); setStale(failure instanceof WorkspaceCommandError && failure.status === 409); }
    finally { if(isCurrent()){setBusy("");} }
  }
  async function reload() {
    setBusy("reload");setLeavingUnconfirmed(false); setError("");
    try {
      const next = await refresh();
      if (!next) throw new WorkspaceCommandError("These business details are no longer available with your current access.",404);
      if(!isCurrent())return;
      setSetup(next); onUpdate(next);setAccessUnavailable(false); setStale(false); setReview(!next.canEdit || next.status !== "DRAFT");
      setNotice(next.canEdit ? "Your saved details are up to date. Your unsaved fields are still here; review them before saving." : "Your saved details are up to date. These details can no longer be edited with your access.");
    } catch (failure) { if(!isCurrent())return;if(failure instanceof WorkspaceCommandError&&[401,403,404].includes(failure.status??0))setAccessUnavailable(true);setError(failure instanceof Error ? failure.message : "We couldn’t reload setup. Please retry."); }
    finally { if(isCurrent()){setBusy("");} }
  }

  const feedback=<><Feedback kind="error" message={error}/>{!accessUnavailable&&<Feedback kind="info" message={notice}/>}<div className="merchant-entry-form-actions">{pending&&!busy&&<Button variant="secondary" onClick={()=>{if(pending.kind==="SAVE")void save(pending.review,pending.closeAfter);else void submit();}}>Retry same {pending.kind==="SAVE"?"save":"submission"}</Button>}{(stale||pending||accessUnavailable)&&<Button variant="secondary" busy={busy==="reload"} disabled={!!busy} onClick={()=>void reload()}>Reload business details</Button>}</div></>;
  if(accessUnavailable)return <div className="merchant-entry-unavailable" aria-busy={!!busy}><h3>Business details unavailable</h3>{feedback}<p>Your current access no longer allows these business details.{pending&&" The unconfirmed request is retained here. Leaving does not cancel it or confirm whether it was saved."}</p><Button variant="quiet" disabled={!!busy} onClick={()=>{setLeavingUnconfirmed(true);onLeave();}}>{pending?"Leave for now":"Return to payment overview"}</Button></div>;

  return <div aria-busy={!!busy}><ol className="consumer-stepper" aria-label="Business details progress"><li className={!review ? "is-current" : "is-complete"} aria-current={!review ? "step" : undefined}><span>1</span>Details</li><li className={review && setup.status === "DRAFT" ? "is-current" : setup.status === "PENDING_LOCAL_REVIEW" ? "is-complete" : ""} aria-current={review && setup.status === "DRAFT" ? "step" : undefined}><span>2</span>Review</li><li className={setup.status === "PENDING_LOCAL_REVIEW" ? "is-current" : ""} aria-current={setup.status === "PENDING_LOCAL_REVIEW" ? "step" : undefined}><span>3</span>Saved for review</li></ol>
    {feedback}
    {!review && setup.canEdit ? <><h3>Tell us about your business</h3><p className="merchant-entry-dialog-lead">Account owner: {setup.responsiblePersonName}.</p><form className="merchant-entry-form" onSubmit={event => { event.preventDefault(); void save(true); }}><div className="merchant-entry-form-grid"><label>Applicant type<select value={entityType ?? ""} disabled={locked} onChange={event => setEntityType((event.target.value || null) as MerchantSetupProjection["legalEntityType"])}><option value="">Choose an applicant type</option>{Object.entries(legalLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Country<input value="United States" readOnly /></label></div><label><span id="merchant-legal-name-label">Legal name</span><input aria-labelledby="merchant-legal-name-label" aria-describedby="merchant-legal-name-hint" value={legalName} maxLength={100} autoComplete="off" disabled={locked} onChange={event => setLegalName(event.target.value)} placeholder="Name of the person or business applying" /><small id="merchant-legal-name-hint">Name of the person or business applying.</small></label><label>Selling name<input value={sellingName} maxLength={80} autoComplete="off" disabled={locked} onChange={event => setSellingName(event.target.value)} placeholder="For example, Garden shop" /></label><label><span id="merchant-activity-label">What will you sell?</span><textarea aria-labelledby="merchant-activity-label" aria-describedby="merchant-activity-hint" value={description} maxLength={500} disabled={locked} onChange={event => setDescription(event.target.value)} placeholder="Describe your products or services." /><small id="merchant-activity-hint">Up to 500 characters. Do not enter bank details, identification documents or payment credentials.</small></label><div className="merchant-entry-form-actions"><Button variant="secondary" busy={busy === "save"} disabled={locked} onClick={() => void save(false, true)}>Save for later</Button><Button type="submit" busy={busy === "save"} disabled={locked}>Save & review</Button></div></form></> : <>
      <h3>{setup.status === "PENDING_LOCAL_REVIEW" ? "Saved for review" : "Review your business details"}</h3><dl className="merchant-entry-review"><div><dt>Merchant</dt><dd>{serviceName}</dd></div><div><dt>Applicant</dt><dd>{setup.responsiblePersonName}</dd></div><div><dt>Applicant type</dt><dd>{setup.legalEntityType ? legalLabels[setup.legalEntityType] : "Not selected"}</dd></div><div><dt>Legal name</dt><dd>{setup.legalName || "Not entered"}</dd></div><div><dt>Selling name</dt><dd>{setup.sellingName || "Not entered"}</dd></div><div><dt>Business activity</dt><dd>{setup.activityDescription || "Not entered"}</dd></div><div><dt>Country</dt><dd>United States</dd></div><div><dt>Status</dt><dd>{merchantLabels[setup.status]}</dd></div></dl>
      <div className="merchant-entry-review-note">{setup.status === "PENDING_LOCAL_REVIEW" ? "Your business details are saved for review. Return to payment setup for the next step." : "Submit these business details for review."}</div>
      <details className="merchant-entry-timeline"><summary>{setup.status==="PENDING_LOCAL_REVIEW"?"Business details checklist":"Before you submit"}</summary><ul className="merchant-setup-checklist">{setup.requirements.map(item => <li key={item.code}><WorkspaceIcon name={item.status === "COMPLETE" ? "check" : "shield"} /><span><strong>{item.label}</strong> · {item.status === "COMPLETE" ? "Complete" : item.status === "REQUIRED" ? "Required" : "Not available"}<br />{item.detail}</span></li>)}</ul></details>
      <div className="merchant-entry-form-actions">{setup.canEdit && <Button variant="quiet" disabled={locked} onClick={() => { setReview(false); setError(""); }}>Back to details</Button>}<Button variant="secondary" disabled={locked} onClick={onClose}>Return to payment setup</Button>{setup.status === "DRAFT" && setup.canEdit && <Button busy={busy === "submit"} disabled={locked || !setup.canSubmit} onClick={() => void submit()}>Submit for review</Button>}</div>
    </>}
    {!!setup.timeline.length && <details className="merchant-entry-timeline"><summary>Business details history</summary>{setup.timelineHasMore && <p>Showing the most recent 100 saved history entries.</p>}<ul>{setup.timeline.map(item => <li key={item.id}><strong>{item.label}</strong><span>{formatDate(item.at)}</span></li>)}</ul></details>}
  </div>;
}

"use client";

import {useServerProjection} from "./use-server-projection";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MerchantBusinessDetailsProjection, MerchantSetupProjection, MerchantStatus, UpdateMerchantSetupInput } from "@/modules/acquiring/contracts";
import { Button, Feedback, StatusBadge, WorkspaceCommandError, WorkspaceDialog, formatDate, merchantCommand } from "./primitives";
import { WorkspaceIcon } from "./navigation";
import { requestFailure } from "../api-feedback";
import "./merchant-entry.css";

export interface MerchantBusinessDetailsProps { initial: MerchantBusinessDetailsProjection }
const merchantLabels: Record<MerchantStatus, string> = { NOT_STARTED: "Not started", DRAFT: "Draft", PENDING_LOCAL_REVIEW: "Saved for review", APPROVED: "Approved in sandbox", RESTRICTED: "Restricted", DECLINED: "Declined", CLOSED: "Closed" };
const legalLabels = { INDIVIDUAL: "Individual", SOLE_PROPRIETOR: "Sole proprietor", BUSINESS: "Business" };
const requirementCopy:Record<string,{label:string;detail:string}>={
 ENTITY_TYPE:{label:"Business type",detail:"Choose an individual, sole proprietor or business."},
 SELLING_NAME:{label:"Selling name",detail:"Use a sample shop or trading name."},
 LEGAL_NAME:{label:"Legal name",detail:"Use a sample name for the person or business applying."},
 ACTIVITY:{label:"What you sell",detail:"Describe your sample products or services."},
 FICTIONAL_CONFIRMATION:{label:"Sample information",detail:"Confirm that you have used sample details without real identity, bank or card information."},
 MERCHANT_REVIEW:{label:"Business verification",detail:"This sandbox saves your submission. Verification for real payments is not available."},
 RESPONSIBLE_APPLICANT:{label:"Applicant access",detail:"The applicant needs current permission to submit these business details."},
};

export function MerchantBusinessDetails({ initial }: MerchantBusinessDetailsProps) {
  const router = useRouter();
  const [entry, setEntry, entryChanged, isEntryCurrent] = useServerProjection(initial);
  const [showSetup, setShowSetup] = useState(true);
  const [setupBusy, setSetupBusy] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const commandIds = useRef(new Map<string, string>());
  if(entryChanged){setSetupBusy(false);setBusy("");setError("");}
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
    if (!response.ok) throw new Error(requestFailure(response.status, "We couldn’t reload Merchant setup. Your saved details are still available. Please retry."));
    const next = await response.json() as MerchantBusinessDetailsProjection; if(!isEntryCurrent())throw new WorkspaceCommandError("The merchant view changed. Reload current access.",408);setEntry(next); return next;
  }
  function updatedSetup(next: MerchantSetupProjection) {
    setEntry(current => ({ ...current, setup: next, merchantStatus: next.status }));
  }
  function closeSetup() {
    if (setupBusy) return;
    setShowSetup(false); setError("");
    router.push(`/merchants/${merchantId}?tab=verification`);
  }
  async function startSetup() {
    setBusy("start"); setError("");
    try {
      const result = await command<MerchantSetupProjection>("/business-details/application", "POST");
      if(!isEntryCurrent())return;updatedSetup(result); setShowSetup(true);
    } catch (failure) { if(!isEntryCurrent())return;setError(failure instanceof Error ? failure.message : "We couldn’t start merchant setup. Please retry."); }
    finally { if(isEntryCurrent())setBusy(""); }
  }

  return <section className="consumer-workspace merchant-entry-workspace" aria-labelledby="merchant-entry-title">
    <header className="merchant-entry-hero"><div><p className="consumer-eyebrow">PRIMARY MERCHANT</p><h1 id="merchant-entry-title">{merchant.name}</h1><p>Business details</p></div></header>
    {!showSetup&&<Feedback kind="error" message={error}/>}
    {!merchant ? <p>Business details are not available with your current access.</p> : <>
      <section className="merchant-setup-status" aria-label="Business details"><div className="merchant-setup-status-main"><div className="merchant-setup-status-top"><h3>Business details</h3><StatusBadge status={merchant.merchantStatus} label={merchantLabels[merchant.merchantStatus]} /></div><p>{merchant.setup ? merchant.setup.status === "PENDING_LOCAL_REVIEW" ? "Business details saved for sandbox review. Real payments remain unavailable." : "Review your business details whenever you are ready. You can continue with sandbox payment setup." : "Add sample business details, then continue to payment setup."}</p>{merchant.setup && <p>Applicant: <strong>{merchant.setup.responsiblePersonName}</strong></p>}<div className="merchant-setup-status-actions">{merchant.setup ? <Button variant="secondary" onClick={() => { setError(""); setShowSetup(true); }}>{merchant.setup.canEdit ? "Continue merchant setup" : "View merchant setup"}</Button> : merchant.canStartSetup ? <Button busy={busy === "start"} disabled={!!busy} onClick={() => void startSetup()}>Start merchant setup</Button> : null}</div>{!merchant.canManageSetup && merchant.setup?.status === "DRAFT" && <p>Your current access lets you view this draft. Your primary merchant can update it.</p>}</div></section>
    </>}

    {merchant?.setup && <WorkspaceDialog open={showSetup} onClose={closeSetup} title="Merchant setup" serviceName={merchant.name} wide><MerchantSetupForm key={merchant.setup.id} initial={merchant.setup} serviceName={merchant.name} command={command} onUpdate={updatedSetup} onClose={closeSetup} onBusyChange={setSetupBusy} refresh={async () => (await refreshEntry()).setup ?? null} /></WorkspaceDialog>}
  </section>;
}

interface MerchantSetupFormProps {
  initial: MerchantSetupProjection; serviceName: string;
  command: <T>(path: string, method: "POST" | "PATCH", input?: Record<string, unknown>) => Promise<T>;
  onUpdate: (next: MerchantSetupProjection) => void; onClose: () => void; refresh: () => Promise<MerchantSetupProjection | null>;
  onBusyChange: (busy: boolean) => void;
}
function MerchantSetupForm({ initial, serviceName, command, onUpdate, onClose, refresh, onBusyChange }: MerchantSetupFormProps) {
  const [setup, setSetup, projectionChanged, isCurrent] = useServerProjection(initial);
  const [review, setReview] = useState(!initial.canEdit || initial.status === "PENDING_LOCAL_REVIEW");
  const [entityType, setEntityType] = useState(initial.legalEntityType);
  const [legalName, setLegalName] = useState(initial.legalName);
  const [sellingName, setSellingName] = useState(initial.sellingName);
  const [description, setDescription] = useState(initial.activityDescription);
  const [fictional, setFictional] = useState(initial.fictionalDetailsConfirmed);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [stale, setStale] = useState(false);
  const [pending, setPending] = useState<{ kind: "SAVE"; fields: Omit<UpdateMerchantSetupInput, "commandId">; review: boolean; closeAfter: boolean } | { kind: "SUBMIT"; version: number } | null>(null);
  if(projectionChanged){
    if(!initial.canEdit)setReview(true);
    if(!pending||!initial.canEdit){setEntityType(initial.legalEntityType);setLegalName(initial.legalName);setSellingName(initial.sellingName);setDescription(initial.activityDescription);setFictional(initial.fictionalDetailsConfirmed);}
    setBusy("");setStale(false);setError("");
  }
  const locked = !!busy || stale || !!pending;
  const path = `/business-details/application/${encodeURIComponent(setup.id)}`;

  async function save(nextReview: boolean, closeAfter = false) {
    const retrying=pending!==null;
    setBusy("save"); onBusyChange(true); setError(""); setNotice("");
    const fields: Omit<UpdateMerchantSetupInput, "commandId"> = pending?.kind === "SAVE" ? pending.fields : { expectedVersion: setup.version, legalEntityType: entityType, legalName: legalName.trim(), sellingName: sellingName.trim(), activityDescription: description.trim(), country: "US", fictionalDetailsConfirmed: fictional };
    const nextStep = pending?.kind === "SAVE" ? pending.review : nextReview;
    const shouldClose = pending?.kind === "SAVE" ? pending.closeAfter : closeAfter;
    setPending({ kind: "SAVE", fields, review: nextStep, closeAfter: shouldClose });
    try {
      const next = await command<MerchantSetupProjection>(path, "PATCH", fields);
      if(!isCurrent())return;
      setPending(null); setSetup(next); onUpdate(next); setLegalName(next.legalName); setSellingName(next.sellingName); setDescription(next.activityDescription); setReview(nextStep); setNotice("Your merchant setup draft is saved.");
      if (shouldClose) { onBusyChange(false); onClose(); }
    } catch (failure) { if(!isCurrent())return;setError(failure instanceof Error ? failure.message : "We couldn’t save the draft. Your entered details are still here."); if (failure instanceof WorkspaceCommandError && !failure.uncertain&&!retrying) setPending(null); setStale(failure instanceof WorkspaceCommandError && failure.status === 409); }
    finally { if(isCurrent()){setBusy(""); onBusyChange(false);} }
  }
  async function submit() {
    const retrying=pending!==null;
    setBusy("submit"); onBusyChange(true); setError(""); setNotice("");
    const version = pending?.kind === "SUBMIT" ? pending.version : setup.version;
    setPending({ kind: "SUBMIT", version });
    try {
      const next = await command<MerchantSetupProjection>(`${path}/submit`, "POST", { expectedVersion: version });
      if(!isCurrent())return;
      setPending(null); setSetup(next); onUpdate(next); setNotice(`Sample details for ${serviceName} are saved for sandbox review.`);
    } catch (failure) { if(!isCurrent())return;setError(failure instanceof Error ? failure.message : "We couldn’t confirm submission. Retry to confirm the same request."); if (failure instanceof WorkspaceCommandError && !failure.uncertain&&!retrying) setPending(null); setStale(failure instanceof WorkspaceCommandError && failure.status === 409); }
    finally { if(isCurrent()){setBusy(""); onBusyChange(false);} }
  }
  async function reload() {
    setBusy("reload"); onBusyChange(true); setError("");
    try {
      const next = await refresh();
      if (!next) throw new Error("This merchant setup is no longer available. Close this view and check your Merchant access.");
      if(!isCurrent())return;
      setSetup(next); onUpdate(next); setStale(false); setReview(!next.canEdit || next.status !== "DRAFT");
      setNotice(next.canEdit ? "Your saved details are up to date. Your unsaved fields are still here; review them before saving." : "Your saved details are up to date. These details can no longer be edited with your access.");
    } catch (failure) { if(!isCurrent())return;setError(failure instanceof Error ? failure.message : "We couldn’t reload setup. Please retry."); }
    finally { if(isCurrent()){setBusy(""); onBusyChange(false);} }
  }

  return <div aria-busy={!!busy}><ol className="consumer-stepper" aria-label="Merchant setup progress"><li className={!review ? "is-current" : "is-complete"} aria-current={!review ? "step" : undefined}><span>1</span>Details</li><li className={review && setup.status === "DRAFT" ? "is-current" : setup.status === "PENDING_LOCAL_REVIEW" ? "is-complete" : ""} aria-current={review && setup.status === "DRAFT" ? "step" : undefined}><span>2</span>Review</li><li className={setup.status === "PENDING_LOCAL_REVIEW" ? "is-current" : ""} aria-current={setup.status === "PENDING_LOCAL_REVIEW" ? "step" : undefined}><span>3</span>Submitted</li></ol>
    <Feedback kind="error" message={error} /><Feedback kind="info" message={notice} />{pending && (setup.canEdit||setup.status==="PENDING_LOCAL_REVIEW") && !busy && <div className="merchant-entry-form-actions"><Button variant="secondary" onClick={() => { if (pending.kind === "SAVE") void save(pending.review, pending.closeAfter); else void submit(); }}>Retry same {pending.kind === "SAVE" ? "save" : "submission"}</Button></div>}{(stale || (pending && !busy)) && <Button variant="secondary" busy={busy === "reload"} disabled={!!busy} onClick={() => void reload()}>Reload merchant setup</Button>}
    {!review && setup.canEdit ? <><h3>Tell us about your business</h3><p className="merchant-entry-dialog-lead">Use sample details in this sandbox. Applicant: {setup.responsiblePersonName}.</p><form className="merchant-entry-form" onSubmit={event => { event.preventDefault(); void save(true); }}><div className="merchant-entry-form-grid"><label>Applicant type<select value={entityType ?? ""} disabled={locked} onChange={event => setEntityType((event.target.value || null) as MerchantSetupProjection["legalEntityType"])}><option value="">Choose an applicant type</option>{Object.entries(legalLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Country<input value="United States (sandbox)" readOnly /></label></div><label><span id="merchant-legal-name-label">Legal name</span><input aria-labelledby="merchant-legal-name-label" aria-describedby="merchant-legal-name-hint" value={legalName} maxLength={100} autoComplete="off" disabled={locked} onChange={event => setLegalName(event.target.value)} placeholder="Name of the person or business applying" /><small id="merchant-legal-name-hint">Use a sample individual or business name.</small></label><label>Selling name<input value={sellingName} maxLength={80} autoComplete="off" disabled={locked} onChange={event => setSellingName(event.target.value)} placeholder="For example, Sample garden shop" /></label><label><span id="merchant-activity-label">What will you sell?</span><textarea aria-labelledby="merchant-activity-label" aria-describedby="merchant-activity-hint" value={description} maxLength={500} disabled={locked} onChange={event => setDescription(event.target.value)} placeholder="Describe your sample products or services." /><small id="merchant-activity-hint">Up to 500 characters. Do not enter real bank details, identification documents or payment credentials.</small></label><label className="merchant-entry-check"><input type="checkbox" checked={fictional} disabled={locked} onChange={event => setFictional(event.target.checked)} /><span>I’m using sample information in this sandbox.</span></label><div className="merchant-entry-form-actions"><Button variant="secondary" busy={busy === "save"} disabled={locked} onClick={() => void save(false, true)}>Save for later</Button><Button type="submit" busy={busy === "save"} disabled={locked}>Save & review</Button></div></form></> : <>
      <h3>{setup.status === "PENDING_LOCAL_REVIEW" ? "Saved for review" : "Review your merchant setup"}</h3><dl className="merchant-entry-review"><div><dt>Merchant</dt><dd>{serviceName}</dd></div><div><dt>Applicant</dt><dd>{setup.responsiblePersonName}</dd></div><div><dt>Applicant type</dt><dd>{setup.legalEntityType ? legalLabels[setup.legalEntityType] : "Not selected"}</dd></div><div><dt>Legal name</dt><dd>{setup.legalName || "Not entered"}</dd></div><div><dt>Selling name</dt><dd>{setup.sellingName || "Not entered"}</dd></div><div><dt>Business activity</dt><dd>{setup.activityDescription || "Not entered"}</dd></div><div><dt>Country</dt><dd>United States · Sandbox</dd></div><div><dt>Status</dt><dd>{merchantLabels[setup.status]}</dd></div></dl>
      <div className="merchant-entry-review-note">{setup.status === "PENDING_LOCAL_REVIEW" ? "Your submission is saved for sandbox review. Live business verification is not connected." : "Submit these sample business details for sandbox review. This does not enable live payments."}</div>
      <details className="merchant-entry-timeline"><summary>Before you submit</summary><ul className="merchant-setup-checklist">{setup.requirements.map(item => <li key={item.code}><WorkspaceIcon name={item.status === "COMPLETE" ? "check" : "shield"} /><span><strong>{requirementCopy[item.code]?.label??item.label}</strong> · {item.status === "COMPLETE" ? "Complete" : item.status === "REQUIRED" ? "Required" : "Not available"}<br />{requirementCopy[item.code]?.detail??item.detail}</span></li>)}</ul></details>
      <div className="merchant-entry-form-actions">{setup.canEdit && <Button variant="quiet" disabled={locked} onClick={() => { setReview(false); setError(""); }}>Back to details</Button>}<Button variant="secondary" disabled={!!busy} onClick={onClose}>Close</Button>{setup.status === "DRAFT" && setup.canEdit && <Button busy={busy === "submit"} disabled={locked || !setup.canSubmit} onClick={() => void submit()}>Submit for review</Button>}</div>
    </>}
    {!!setup.timeline.length && <details className="merchant-entry-timeline"><summary>Business details history</summary>{setup.timelineHasMore && <p>Showing the most recent 100 saved history entries.</p>}<ul>{setup.timeline.map(item => <li key={item.id}><strong>{item.label.replace("Submitted for local review; no merchant decision made","Submitted for sandbox review")}</strong><span>{formatDate(item.at)}</span></li>)}</ul></details>}
  </div>;
}

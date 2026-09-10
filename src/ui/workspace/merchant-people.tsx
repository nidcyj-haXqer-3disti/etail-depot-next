"use client";

import {useServerProjection} from "./use-server-projection";
import { useState } from "react";
import type { MerchantAccessOverview, MerchantAccessPerson, MerchantInvitationProjection, MerchantPermission } from "@/modules/access/merchant-contracts";
import { Button, EmptyState, Feedback, StatusBadge, WorkspaceCommandError, WorkspaceDialog, formatDate, merchantCommand } from "./primitives";

export const merchantPermissionLabels: Record<MerchantPermission, string> = { "merchant.read": "View this merchant", "merchant.people.read": "View people and access", "merchant.people.invite": "Invite people", "merchant.people.revoke": "Remove merchant access", "channels.read": "View payment channels", "channels.create": "Create channels", "channels.update": "Edit channels", "channels.close": "Close channels", "channels.share": "Share channels", "payments.read": "View payments", "payments.simulate": "Try a sandbox payment" };
type Attempt = { path: string; body: Record<string, unknown> };
type RevokeTarget = { kind: "person"; record: MerchantAccessPerson } | { kind: "invitation"; record: MerchantInvitationProjection };

export function MerchantPeople({ initial }: { initial: MerchantAccessOverview }) {
  const [access, setAccess, projectionChanged, isCurrent] = useServerProjection(initial);
  const [open, setOpen] = useState(false), [review, setReview] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [permissions, setPermissions] = useState<MerchantPermission[]>([]);
  const [delegable, setDelegable] = useState<MerchantPermission[]>([]);
  const [inviteDays, setInviteDays] = useState(3), [accessDays, setAccessDays] = useState(7);
  const [revoke, setRevoke] = useState<RevokeTarget | null>(null);
  const [busy, setBusy] = useState(false), [stale, setStale] = useState(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [notice, setNotice] = useState<{ kind: "success" | "error" | "info"; message: string } | null>(null);
  if(projectionChanged){
    if(revoke){const current=revoke.kind==="person"?initial.people.find(person=>person.id===revoke.record.id):initial.invitations.find(invitation=>invitation.id===revoke.record.id);if(!current){setRevoke(null);}else setRevoke(revoke.kind==="person"?{kind:"person",record:current as MerchantAccessPerson}:{kind:"invitation",record:current as MerchantInvitationProjection});}
    if(!initial.canInvite){setOpen(false);setRecipientId("");setPermissions([]);setDelegable([]);}
    else if(!attempt){setReview(false);setPermissions(current=>current.filter(action=>initial.permissionOptions.some(option=>option.action===action&&option.canDelegate)));setDelegable(current=>current.filter(action=>initial.permissionOptions.some(option=>option.action===action&&option.canDelegate)));}
    setBusy(false);setStale(false);setNotice(null);
  }
  const attemptVisible=!!attempt&&(attempt.path==="/invitations"?access.canInvite:[...access.people,...access.invitations].some(record=>record.id===attempt.path.split("/")[2]));
  const locked = busy || !!attempt || stale;
  const recipient = access.recipients.find(person => person.id === recipientId);
  const choices = access.permissionOptions.filter(option => option.canDelegate);
  const controllerPeople = new Map<string, { personId: string; displayName: string; roles: string[] }>();
  for (const controller of access.controllers) {
    const person = controllerPeople.get(controller.personId) ?? { personId: controller.personId, displayName: controller.displayName, roles: [] };
    const role = "Primary user";
    if (!person.roles.includes(role)) person.roles.push(role);
    controllerPeople.set(controller.personId, person);
  }
  async function reload() {
    const response = await fetch(`/api/v1/merchants/${encodeURIComponent(access.merchantUnitId)}/access`, { credentials: "same-origin", cache: "no-store" });
    if(!isCurrent())return;
    if (!response.ok) throw new WorkspaceCommandError("Merchant people are no longer available with your current access. Return to Merchant overview or retry.", response.status);
    const next = await response.json() as MerchantAccessOverview; if(!isCurrent())return; setAccess(next); return next;
  }
  async function refresh() {
    setBusy(true);
    try { await reload(); if(!isCurrent())return; setStale(false); setRevoke(null); setReview(false); setNotice({ kind: "info", message: "Access refreshed. Review your invitation before saving it." }); }
    catch (error) { if(!isCurrent())return; if (error instanceof WorkspaceCommandError && [401, 403, 404].includes(error.status ?? 0)) { setAccess(current => ({ ...current, people: [], controllers: [], invitations: [], recipients: [], permissionOptions: [], canInvite: false })); setOpen(false); setRevoke(null); } setNotice({ kind: "error", message: error instanceof Error ? error.message : "We couldn’t reload access." }); }
    finally { if(isCurrent())setBusy(false); }
  }
  function start() { if (locked) return; setRecipientId(""); setPermissions(choices.filter(option => ["merchant.read", "channels.read"].includes(option.action)).map(option => option.action)); setDelegable([]); setInviteDays(3); setAccessDays(7); setReview(false); setOpen(true); setNotice(null); }
  async function send(command: Attempt) {
    const retrying=attempt!==null;
    setBusy(true); setAttempt(command); setNotice(null);
    try {
      await merchantCommand(access.merchantUnitId, command.path, "POST", command.body);
      if(!isCurrent())return;
      setAttempt(null); setStale(false); setOpen(false); setRevoke(null);
      setNotice({ kind: "success", message: command.path.endsWith("/revoke") ? `Merchant access revoked for ${access.merchantName}. Cardholder access has not changed.` : `Invitation saved for ${recipient?.displayName ?? "this person"}. They can accept it in Invitations. No message was sent outside the sandbox.` });
      try { await reload(); } catch { if(!isCurrent())return; setNotice({ kind: "info", message: "Your action was saved. Reload people to see the latest access." }); }
    } catch (error) { if(!isCurrent())return; if (error instanceof WorkspaceCommandError && !error.uncertain) { if(!retrying)setAttempt(null); setStale([401, 403, 404, 409].includes(error.status ?? 0)); } setNotice({ kind: "error", message: error instanceof Error ? error.message : "We couldn’t confirm this action. Retry the same request." }); }
    finally { if(isCurrent())setBusy(false); }
  }
  function prepareReview() {
    if (!recipient || !permissions.length) { setNotice({ kind: "error", message: "Choose a person and what they can do." }); return; }
    setReview(true); setNotice(null);
  }
  const feedback = <>{notice && <Feedback {...notice} />}{attempt && attemptVisible && !busy && <Button variant="secondary" onClick={() => void send(attempt)}>Retry same access request</Button>}{stale && <Button variant="secondary" busy={busy} onClick={() => void refresh()}>Reload merchant access</Button>}</>;
  return <section aria-labelledby="merchant-people-title"><div className="mn-heading"><div><h2 id="merchant-people-title">People & access</h2><p>Choose who can help and what they can do.</p></div>{access.canInvite && <Button disabled={locked} onClick={start}>Invite person</Button>}</div><div className="mn-notice">Invited people must accept before using their access. Cardholder access stays separate.</div>{!open && !revoke && feedback}<div className="mn-panel"><h3>Primary merchant</h3><p>This person manages payments and access.</p><ul className="mn-list">{[...controllerPeople.values()].map(controller => <li key={controller.personId}><div className="mn-row"><strong>{controller.displayName}</strong><span className="mn-muted">{controller.roles.join(" · ")}</span></div></li>)}</ul></div><div className="mn-panel"><div className="mn-row"><h3>People with access</h3><Button variant="quiet" disabled={locked} onClick={() => void refresh()}>Reload people</Button></div>{access.people.length ? <ul className="mn-list">{access.people.map(person => <li key={person.id}><div className="mn-row"><div><strong>{person.displayName}{person.isCurrentPerson ? " (you)" : ""}</strong><ul className="mn-permission-list" aria-label={`Access for ${person.displayName}`}>{person.permissions.map(action=><li key={action}>{merchantPermissionLabels[action]}</li>)}</ul><p>Expires {formatDate(person.expiresAt)}</p></div><StatusBadge status={person.state} />{person.canRevoke && <Button variant="secondary" disabled={locked} onClick={() => { setRevoke({ kind: "person", record: person }); setNotice(null); }}>Revoke access</Button>}</div></li>)}</ul> : <EmptyState title="No people invited yet" description={access.canInvite?"Invite someone to help with this merchant and choose what they can do.":"Your primary merchant can review who has access to this merchant."} />}</div><details className="mn-panel mn-invitations"><summary>Merchant invitations ({access.invitations.length})</summary>{access.invitations.length ? <ul className="mn-list">{access.invitations.map(invitation => <li key={invitation.id}><div className="mn-row"><div><strong>{invitation.recipientName}</strong><p>Invitation expires {formatDate(invitation.expiresAt)} · Access expires {formatDate(invitation.accessExpiresAt)}</p></div><StatusBadge status={invitation.status} />{invitation.canRevoke && <Button variant="secondary" disabled={locked} onClick={() => { setRevoke({ kind: "invitation", record: invitation }); setNotice(null); }}>Revoke invitation</Button>}</div></li>)}</ul> : <p>No pending invitations.</p>}</details>
    <WorkspaceDialog open={open} onClose={() => { if (!busy) setOpen(false); }} title={review ? "Review merchant invitation" : "Invite a person"} serviceName={access.merchantName} wide>{feedback}{review ? <><dl className="mn-review"><div><dt>Merchant</dt><dd>{access.merchantName}</dd></div><div><dt>Primary merchant</dt><dd>{access.masterName}</dd></div><div><dt>Recipient</dt><dd>{recipient?.displayName}</dd></div><div><dt>Permissions</dt><dd>{permissions.map(action => merchantPermissionLabels[action]).join(", ")}</dd></div><div><dt>May share access</dt><dd>{delegable.length ? delegable.map(action => merchantPermissionLabels[action]).join(", ") : "Cannot invite others with this access"}</dd></div><div><dt>Invitation expires</dt><dd>In {inviteDays} days</dd></div><div><dt>Access expires</dt><dd>In {accessDays} days from today</dd></div></dl><div className="mn-notice">Access to {access.merchantName} only. Cardholder access stays separate. The primary merchant remains responsible for payments, refunds and chargebacks. No message is sent outside the sandbox.</div><div className="mn-actions"><Button variant="quiet" disabled={locked} onClick={() => setReview(false)}>Back to permissions</Button><Button busy={busy} disabled={locked} onClick={() => void send({ path: "/invitations", body: { commandId: crypto.randomUUID(), recipientId, permissions, delegablePermissions: delegable, expiresInDays: inviteDays, accessExpiresInDays: accessDays } })}>Save invitation</Button></div></> : <form className="mn-form" onSubmit={event => { event.preventDefault(); prepareReview(); }}><label>Person<select required disabled={locked} value={recipientId} onChange={event => setRecipientId(event.target.value)}><option value="">Choose a person</option>{access.recipients.map(person => <option key={person.id} value={person.id}>{person.displayName}</option>)}</select></label><p className="mn-muted">Choose a sample person to invite.</p><fieldset disabled={locked}><legend>What can this person do?</legend><div className="mn-checks">{choices.map(option => <label key={option.action}><input type="checkbox" checked={permissions.includes(option.action)} onChange={event => { setPermissions(event.target.checked ? [...permissions, option.action] : permissions.filter(action => action !== option.action)); if (!event.target.checked) setDelegable(delegable.filter(action => action !== option.action)); }} />{merchantPermissionLabels[option.action]}</label>)}</div></fieldset><fieldset disabled={locked}><legend>Which access can they share?</legend>{permissions.length ? <div className="mn-checks">{permissions.map(action => <label key={action}><input type="checkbox" checked={delegable.includes(action)} onChange={event => setDelegable(event.target.checked ? [...delegable, action] : delegable.filter(value => value !== action))} />{merchantPermissionLabels[action]}</label>)}</div> : <p className="mn-muted">Choose their access first. Sharing is off unless you select it here.</p>}</fieldset><div className="mn-form-grid"><label>Invitation available for<select disabled={locked} value={inviteDays} onChange={event => setInviteDays(Number(event.target.value))}><option value={1}>1 day</option><option value={3}>3 days</option><option value={7}>7 days</option></select></label><label>Merchant access lasts<select disabled={locked} value={accessDays} onChange={event => setAccessDays(Number(event.target.value))}><option value={1}>1 day</option><option value={7}>7 days</option><option value={30}>30 days</option></select></label></div><p className="mn-muted">This merchant only. Cardholder access stays separate.</p><div className="mn-actions"><Button variant="quiet" disabled={locked} onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={locked || !choices.length}>Review invitation</Button></div></form>}</WorkspaceDialog>
    <WorkspaceDialog open={revoke !== null} onClose={() => { if (!busy) setRevoke(null); }} title={revoke?.kind === "invitation" ? "Revoke merchant invitation?" : "Remove merchant access?"} serviceName={access.merchantName}>{feedback}{revoke && <><p className="mn-muted">Revoke {revoke.kind === "person" ? revoke.record.displayName : revoke.record.recipientName}’s {revoke.kind === "person" ? "merchant access" : "pending invitation"} for {access.merchantName}. Anyone whose access comes through this person will also lose that access. Payment history stays saved. Cardholder access is unchanged.</p><div className="mn-actions"><Button variant="quiet" disabled={locked} onClick={() => setRevoke(null)}>Keep access</Button><Button variant="danger" busy={busy} disabled={locked} onClick={() => void send({ path: revoke.kind === "person" ? `/people/${revoke.record.id}/revoke` : `/invitations/${revoke.record.id}/revoke`, body: { commandId: crypto.randomUUID(), expectedVersion: revoke.record.version } })}>Confirm revoke</Button></div></>}</WorkspaceDialog>
  </section>;
}

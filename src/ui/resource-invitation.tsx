"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { anyInvitationProjectionSchema } from "@/shared/access-response";
import { resourceInvitationProjectionSchema, type ResourceInvitationProjection } from "@/shared/resource-invitation-response";
import { invitationIdFromNextPath } from "@/shared/auth-continuation";
import { normalizeVerifiedEmail } from "@/shared/verified-email";
import { PUBLIC_APP_URL } from "@/shared/public-origin";
import { Button, Feedback, StatusBadge, WorkspaceDialog, formatMoney } from "./workspace/primitives";
import { requestFailure } from "./api-feedback";
import "./resource-invitation.css";

type Attempt = { commandId: string; expectedVersion: number; decision: "accept" | "decline" };
const retryMessage = "We couldn’t confirm your response. Check the same request again.";
export function ResourceInvitation({ initial }: { initial: ResourceInvitationProjection }) {
  const [invitation, setInvitation] = useState<ResourceInvitationProjection | null>(initial);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const inFlight = useRef(false);
  const path = `/api/v1/invitations/${initial.id}`, next = `/invitations/${initial.id}`;

  async function current() {
    const response = await fetch(path, { credentials: "same-origin", cache: "no-store", signal: AbortSignal.timeout(30_000) });
    if (!response.ok) {
      if ([401,403,404].includes(response.status)) setInvitation(null);
      throw new Error(requestFailure(response.status, "We couldn’t refresh this invitation. Please try again."));
    }
    const parsed = resourceInvitationProjectionSchema.safeParse(await response.json());
    if (!parsed.success || parsed.data.id !== initial.id || parsed.data.targetKind !== initial.targetKind) throw new Error(retryMessage);
    setInvitation(parsed.data);
    return parsed.data;
  }
  async function respond(saved: Attempt) {
    if (inFlight.current) return;
    const retrying = !!attempt;
    inFlight.current = true; setBusy(true); setAttempt(saved); setError("");
    try {
      const decision=saved.decision==="accept"?"accept":"decline";
      const response = await fetch(`${path}/${decision}`, { method: "POST", credentials: "same-origin", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ commandId: saved.commandId, expectedVersion: saved.expectedVersion }), signal: AbortSignal.timeout(30_000) });
      if (!response.ok) {
        if ([401,403,404].includes(response.status)) setInvitation(null);
        if (response.status >= 400 && response.status < 500 && !retrying) setAttempt(null);
        throw new Error(requestFailure(response.status, "This invitation has changed. Refresh it before responding."));
      }
      const parsed = anyInvitationProjectionSchema.safeParse(await response.json());
      if (!parsed.success || parsed.data.id !== initial.id || parsed.data.targetKind !== initial.targetKind || parsed.data.status !== (saved.decision === "accept" ? "ACCEPTED" : "DECLINED") || parsed.data.version <= saved.expectedVersion) throw new Error(retryMessage);
      await current();
      setAttempt(null);
    } catch (failure) {
      setError(failure instanceof Error && failure.constructor === Error ? failure.message : retryMessage);
    } finally { inFlight.current = false; setBusy(false); }
  }
  async function refresh() {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError("");
    try { await current(); } catch (failure) { setError(failure instanceof Error && failure.constructor === Error ? failure.message : "We couldn’t refresh this invitation. Please try again."); }
    finally { inFlight.current = false; setBusy(false); }
  }
  const locked = busy || !!attempt;
  return <section className="ws-panel resource-invitation-details" aria-labelledby="resource-invitation-heading">
    <h1 id="resource-invitation-heading">{invitation ? invitation.targetKind === "CARD" ? "Your card invitation" : "Your payment terminal invitation" : "Invitation unavailable"}</h1>
    <Feedback kind="error" message={error}/>
    {invitation ? <><p><strong>{invitation.inviterName}</strong> invited you to use <strong>{invitation.targetName}</strong>.</p><StatusBadge status={invitation.status}/>
      {invitation.targetKind === "CARD" ? <><p>You can use this card and see its purchases. The account owner adds money and controls its spending limit.</p><p><strong>Total spending limit: {formatMoney(invitation.allowance.amount, invitation.allowance.currency)}</strong></p></> : <p>You can create payment requests, see this terminal’s payments and respond to disputes. The account owner manages the payment balance, refunds and access.</p>}
      <p>Accept by {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(invitation.expiresAt))}.</p>
      {invitation.canRespond && <div className="consumer-action-row"><Button disabled={locked} onClick={()=>void respond({ commandId: crypto.randomUUID(), expectedVersion: invitation.version, decision: "accept" })}>Accept invitation</Button><Button variant="secondary" disabled={locked} onClick={()=>void respond({ commandId: crypto.randomUUID(), expectedVersion: invitation.version, decision: "decline" })}>Decline invitation</Button></div>}
      {invitation.hasAccess && !attempt && <Link className="consumer-button consumer-button-primary" href={invitation.href}>{invitation.targetKind === "CARD" ? "Open your card" : "Open your payment terminal"}</Link>}
      {!invitation.canRespond && !invitation.hasAccess && <p>This invitation is no longer available to accept. Ask the sender for a new invitation if you still need access.</p>}
    </> : <><p>Sign in with the email address this invitation was sent to, or ask its sender to check it.</p><Link className="consumer-button consumer-button-secondary" href={`/login?next=${encodeURIComponent(next)}`}>Sign in again</Link></>}
    {attempt && <div className="consumer-card-retry"><p>Your response may have been saved. Retry the same request to check; leaving does not cancel it.</p><Button variant="secondary" busy={busy} onClick={()=>void respond(attempt)}>Check your response again</Button></div>}
    <div className="consumer-action-row"><Button variant="quiet" busy={busy} onClick={()=>void refresh()}>Refresh invitation</Button><Link href="/services">Your dashboard</Link></div>
  </section>;
}

export interface ShareResourceInvitationProps {
  invitationId: string; recipientEmail: string; status: string;
  resourceName?: string; resourceKind?: "card" | "terminal";
}
/** Shares only a locator. Matching verified contact and explicit acceptance remain server requirements. */
export function ShareResourceInvitation({ invitationId, recipientEmail, status, resourceName, resourceKind }: ShareResourceInvitationProps) {
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false), [open, setOpen] = useState(false), [nativeShare, setNativeShare] = useState(false);
  const [origin, setOrigin] = useState<string>(PUBLIC_APP_URL);
  useEffect(() => {
    let active = true;
    const current = window.location;
    queueMicrotask(() => { if (active) {
      setNativeShare(typeof navigator.share === "function");
      if (["localhost", "127.0.0.1", "[::1]"].includes(current.hostname)) setOrigin(current.origin);
    } });
    return () => { active = false; };
  }, []);
  if (!invitationIdFromNextPath(`/invitations/${invitationId}`) || !normalizeVerifiedEmail(recipientEmail)) return null;
  const href = new URL(`/invitations/${invitationId}`, origin).href;
  const title = resourceKind === "card" ? "Your Etail Depot card invitation" : resourceKind === "terminal" ? "Your Etail Depot payment terminal invitation" : "Your Etail Depot invitation";
  const text = `You’re invited${resourceName ? ` to use ${resourceName}` : " to Etail Depot"}. Sign in with ${recipientEmail} to review your invitation: ${href}`;
  async function copy() {
    try { await navigator.clipboard.writeText(href); setNotice("Invitation link copied. No message has been sent."); }
    catch { setNotice("Select the invitation link below and copy it."); }
  }
  async function share() {
    if (busy) return;
    if (!navigator.share) { setNotice("More sharing options are unavailable here. Choose an app or copy the link."); return; }
    setBusy(true);
    try { await navigator.share({ title, text, url: href }); setNotice("Sharing closed. Check your chosen app to confirm whether you sent the invitation."); }
    catch (failure) { setNotice(failure instanceof DOMException && failure.name === "AbortError" ? "Sharing canceled. You can still copy the link." : "Sharing is unavailable here. Copy the invitation link instead."); }
    finally { setBusy(false); }
  }
  return <section className="resource-invitation-ready" aria-label="Share invitation">
    <div><h3>Invitation ready</h3><p>For <strong>{recipientEmail}</strong></p><StatusBadge status={status}/></div>
    {status === "PENDING" ? <Button variant="secondary" onClick={()=>{setNativeShare(typeof navigator.share==="function");setOpen(true);}}><InvitationShareIcon kind="share"/>Share invitation</Button> : <p>This invitation is no longer waiting for a response.</p>}
    {open&&status==="PENDING"&&<WorkspaceDialog open onClose={()=>{if(!busy)setOpen(false);}} title="Share invitation" serviceName={resourceName??"Etail Depot"}>
      <div className="resource-share-sheet">
        <p className="resource-share-recipient">Only <strong>{recipientEmail}</strong> can accept. They’ll need to sign in with this email address.</p>
        <div className="resource-share-options" aria-label="Sharing options">
          <a href={`mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`}><span className="resource-share-icon is-email"><InvitationShareIcon kind="email"/></span>Email</a>
          <a href={`sms:?body=${encodeURIComponent(text)}`}><span className="resource-share-icon is-message"><InvitationShareIcon kind="message"/></span>Text message</a>
          <a href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer"><span className="resource-share-icon is-social"><InvitationShareIcon kind="message"/></span>WhatsApp<span className="resource-share-sr-only"> (opens a new window)</span></a>
          <Button variant="quiet" onClick={()=>void copy()}><span className="resource-share-icon is-copy"><InvitationShareIcon kind="copy"/></span>Copy link</Button>
          {nativeShare&&<Button variant="quiet" busy={busy} onClick={()=>void share()}><span className="resource-share-icon is-more"><InvitationShareIcon kind="share"/></span>More apps</Button>}
        </div>
        <p className="resource-share-note">Choose the person in your messaging app, review your message, then send.</p>
        <label className="field">Invitation link<input type="url" readOnly value={href} onFocus={event=>event.currentTarget.select()}/></label>
        <Feedback kind="info" message={notice}/>
      </div>
    </WorkspaceDialog>}
  </section>;
}

function InvitationShareIcon({kind}:{kind:"email"|"message"|"copy"|"share"}){
 return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind==="email"?<><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></>:kind==="message"?<path d="M20 11a8 8 0 0 1-8 8H5l-3 3V11a9 9 0 0 1 18 0Z"/>:kind==="copy"?<><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/></>:<><path d="M12 15V2m-4 4 4-4 4 4M7 9H4v12h16V9h-3"/></>}</svg>;
}

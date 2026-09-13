"use client";

import Link from "next/link";
import {useRef,useState} from "react";
import {useRouter} from "next/navigation";
import type {CardInvitationProjection} from "@/modules/access/contracts";
import {cardInvitationProjectionSchema} from "@/shared/access-response";
import {normalizeVerifiedEmail} from "@/shared/verified-email";
import {ShareResourceInvitation} from "./resource-invitation";
import {Button,Feedback,StatusBadge,WorkspaceCommandError,WorkspaceDialog,formatDate} from "./workspace/primitives";
import {useServerProjection} from "./workspace/use-server-projection";

export type CardInvitationOverview={cardId:string;serviceId:string;cardName:string;canInvite:boolean;invitations:CardInvitationProjection[]};
type Attempt={kind:"CREATE";commandId:string;recipientEmail:string;expiresInDays:1|3|7}|{kind:"CANCEL";commandId:string;id:string;expectedVersion:number};
export function CardInvitationManager({initial,embedded=false,initiallyOpen=false,disabled=false,onBusy}:{initial:CardInvitationOverview;embedded?:boolean;initiallyOpen?:boolean;disabled?:boolean;onBusy?:(value:boolean)=>void}){
 const router=useRouter(),[data,setData]=useServerProjection(initial),[email,setEmail]=useState(""),[days,setDays]=useState<1|3|7>(7),[attempt,setAttempt]=useState<Attempt|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(""),[unavailable,setUnavailable]=useState(false),[open,setOpen]=useState(initiallyOpen);
 const inFlight=useRef(false),pending=data.invitations.find(row=>row.status==="PENDING"),locked=busy||!!attempt;
 async function save(command:Attempt){
  if(inFlight.current)return;
  const retrying=!!attempt;inFlight.current=true;setBusy(true);onBusy?.(true);setAttempt(command);setError("");
  try{
   const path=command.kind==="CREATE"?`/api/v1/cardholder-services/${data.serviceId}/cards/${data.cardId}/invitations`:`/api/v1/cardholder-services/${data.serviceId}/invitations/${command.id}/revoke`;
   const body=command.kind==="CREATE"?{commandId:command.commandId,recipientEmail:command.recipientEmail,expiresInDays:command.expiresInDays}:{commandId:command.commandId,expectedVersion:command.expectedVersion};
   const response=await fetch(path,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
   if(!response.ok)throw new WorkspaceCommandError(response.status===409?"This card or invitation changed. Refresh to see the latest details.":"We couldn’t save this invitation. Check the email address and try again.",response.status);
   const result=cardInvitationProjectionSchema.safeParse(await response.json());
   if(!result.success||result.data.cardId!==data.cardId||result.data.serviceId!==data.serviceId||(command.kind==="CREATE"?result.data.recipientEmail!==normalizeVerifiedEmail(command.recipientEmail):result.data.id!==command.id))throw new WorkspaceCommandError("We couldn’t confirm the result. Check this same request again.",null);
   setData({...data,invitations:[result.data,...data.invitations.filter(row=>row.id!==result.data.id)]});setAttempt(null);setUnavailable(false);onBusy?.(false);router.refresh();
  }catch(failure){
   setError(failure instanceof WorkspaceCommandError?failure.message:"We couldn’t confirm the result. Check this same request again.");
   if(failure instanceof WorkspaceCommandError){if(!failure.uncertain&&!retrying){setAttempt(null);onBusy?.(false);}if([401,403,404].includes(failure.status??0))setUnavailable(true);}
  }finally{inFlight.current=false;setBusy(false);}
 }
 const close=()=>{if(!locked)setOpen(false);};
 const content=<>
  <Feedback kind="error" message={error}/>
  {attempt&&<div className="consumer-card-retry"><p>Your invitation request may have been saved. Check the same request to confirm.</p><Button variant="secondary" busy={busy} onClick={()=>void save(attempt)}>Check invitation request again</Button></div>}
  {unavailable?<><p>Sign in again or return to your dashboard. Leaving does not cancel an invitation request that may have been saved.</p><Link href="/services">Your dashboard</Link></>:<>
   <p>Invite someone to use <strong>{data.cardName}</strong>. They’ll see this card and its purchases. You control its spending limit.</p>
   {data.canInvite&&!pending?<form onSubmit={event=>{event.preventDefault();const value=normalizeVerifiedEmail(email);if(value)void save({kind:"CREATE",commandId:crypto.randomUUID(),recipientEmail:value,expiresInDays:days});}}>
    <label className="field">Their email address<input type="email" required maxLength={254} autoComplete="email" value={email} disabled={locked} onChange={event=>setEmail(event.target.value)}/></label>
    <p>They’ll sign in or create a login with this email address. Then choose how to share the invitation.</p>
    <label className="field consumer-workspace">Accept within<select value={days} disabled={locked} onChange={event=>setDays(Number(event.target.value) as 1|3|7)}><option value={1}>1 day</option><option value={3}>3 days</option><option value={7}>7 days</option></select></label>
    <Button type="submit" disabled={locked||!normalizeVerifiedEmail(email)}>Create invitation</Button>
   </form>:!data.canInvite?<p>This card already has a cardholder. Create a new card to invite someone else.</p>:null}
   {pending&&<><ShareResourceInvitation invitationId={pending.id} recipientEmail={pending.recipientEmail!} status={pending.status} resourceName={data.cardName} resourceKind="card"/><Button variant="quiet" disabled={locked} onClick={()=>void save({kind:"CANCEL",commandId:crypto.randomUUID(),id:pending.id,expectedVersion:pending.version})}>Cancel invitation</Button></>}
   {data.invitations.some(row=>row.status!=="PENDING")&&<details className="consumer-request-history"><summary>Invitation history</summary>{data.invitations.filter(row=>row.status!=="PENDING").map(row=><p key={row.id}>{row.recipientName} · {formatDate(row.createdAt)} <StatusBadge status={row.status}/></p>)}</details>}
  </>}
 </>;
 if(!embedded)return <section className="ws-panel"><Link href={`/cardholder-services?view=cards&focus=${data.cardId}`}>← Back to {data.cardName}</Link><h1>{unavailable?"Card access is unavailable":"Invite cardholder"}</h1>{content}</section>;
 return <div className="consumer-card-invitation">
  {pending&&<p className="consumer-card-invitation-status"><strong>{pending.recipientEmail}</strong><StatusBadge status={pending.status}/><span>Accept by {formatDate(pending.expiresAt)}</span></p>}
  {(data.canInvite||pending)&&<Button variant="secondary" disabled={disabled} onClick={()=>setOpen(true)}>{pending?"View invitation":"Invite cardholder"}</Button>}
  {!data.canInvite&&!pending&&data.invitations.length>0&&<details className="consumer-request-history"><summary>Invitation history</summary>{data.invitations.map(row=><p key={row.id}>{row.recipientName} · {formatDate(row.createdAt)} <StatusBadge status={row.status}/></p>)}</details>}
  {open&&<WorkspaceDialog open onClose={close} title={unavailable?"Card access is unavailable":"Invite cardholder"} serviceName={unavailable?"Cards & spending":data.cardName}>{content}</WorkspaceDialog>}
 </div>;
}

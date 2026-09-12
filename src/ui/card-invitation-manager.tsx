"use client";
import Link from "next/link";
import {useRef,useState} from "react";
import {useRouter} from "next/navigation";
import type {CardInvitationProjection} from "@/modules/access/contracts";
import {cardInvitationProjectionSchema} from "@/shared/access-response";
import {normalizeVerifiedEmail} from "@/shared/verified-email";
import {ShareResourceInvitation} from "./resource-invitation";
import {Button,Feedback,StatusBadge,WorkspaceCommandError,formatDate} from "./workspace/primitives";
import {useServerProjection} from "./workspace/use-server-projection";
type Overview={cardId:string;serviceId:string;cardName:string;canInvite:boolean;invitations:CardInvitationProjection[]};
type Attempt={kind:"CREATE";commandId:string;recipientEmail:string;expiresInDays:1|3|7}|{kind:"CANCEL";commandId:string;id:string;expectedVersion:number};
export function CardInvitationManager({initial}:{initial:Overview}){
 const router=useRouter(),[data,setData]=useServerProjection(initial),[email,setEmail]=useState(""),[days,setDays]=useState<1|3|7>(7),[attempt,setAttempt]=useState<Attempt|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(""),[unavailable,setUnavailable]=useState(false);const inFlight=useRef(false);
 const pending=data.invitations.find(row=>row.status==="PENDING"),locked=busy||!!attempt;
 async function save(command:Attempt){
  if(inFlight.current)return;const retrying=!!attempt;inFlight.current=true;setBusy(true);setAttempt(command);setError("");
  try{
   const path=command.kind==="CREATE"?`/api/v1/cardholder-services/${data.serviceId}/cards/${data.cardId}/invitations`:`/api/v1/cardholder-services/${data.serviceId}/invitations/${command.id}/revoke`;
   const body=command.kind==="CREATE"?{commandId:command.commandId,recipientEmail:command.recipientEmail,expiresInDays:command.expiresInDays}:{commandId:command.commandId,expectedVersion:command.expectedVersion};
   const response=await fetch(path,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
   if(!response.ok)throw new WorkspaceCommandError(response.status===409?"This card or invitation changed. Refresh to see the latest details.":"We couldn’t save this invitation. Check the email address and try again.",response.status);
   const result=cardInvitationProjectionSchema.safeParse(await response.json());if(!result.success||result.data.cardId!==data.cardId||result.data.serviceId!==data.serviceId||(command.kind==="CREATE"?result.data.recipientEmail!==normalizeVerifiedEmail(command.recipientEmail):result.data.id!==command.id))throw new WorkspaceCommandError("We couldn’t confirm the result. Check this same request again.",null);
   setData({...data,invitations:[result.data,...data.invitations.filter(row=>row.id!==result.data.id)]});setAttempt(null);setUnavailable(false);router.refresh();
  }catch(failure){setError(failure instanceof WorkspaceCommandError?failure.message:"We couldn’t confirm the result. Check this same request again.");if(failure instanceof WorkspaceCommandError){if(!failure.uncertain&&!retrying)setAttempt(null);if([401,403,404].includes(failure.status??0))setUnavailable(true);}}
  finally{inFlight.current=false;setBusy(false);}
 }
 if(unavailable)return <section className="ws-panel"><h1>Card access is unavailable</h1><p>Sign in again or return to your dashboard. Leaving does not cancel an invitation request that may have been saved.</p><Feedback kind="error" message={error}/>{attempt&&<Button variant="secondary" busy={busy} onClick={()=>void save(attempt)}>Check invitation request again</Button>}<Link href="/services">Your dashboard</Link></section>;
 return <section className="ws-panel"><Link href={`/cardholder-services?view=cards&card=${data.cardId}`}>← Back to {data.cardName}</Link><h1>Invite a cardholder</h1><p>Give someone access to <strong>{data.cardName}</strong>. They’ll see this card and its purchases. You keep control of its limit and the card balance.</p><Feedback kind="error" message={error}/>{attempt&&<Button variant="secondary" busy={busy} onClick={()=>void save(attempt)}>Check invitation request again</Button>}
 {data.canInvite&&!pending?<form onSubmit={event=>{event.preventDefault();const value=normalizeVerifiedEmail(email);if(value)void save({kind:"CREATE",commandId:crypto.randomUUID(),recipientEmail:value,expiresInDays:days});}}><label className="field">Their email address<input type="email" required maxLength={254} autoComplete="email" value={email} disabled={locked} onChange={event=>setEmail(event.target.value)}/></label><p>They can use an existing login or create one with this email address.</p><label className="field consumer-workspace">Accept within<select value={days} disabled={locked} onChange={event=>setDays(Number(event.target.value) as 1|3|7)}><option value={1}>1 day</option><option value={3}>3 days</option><option value={7}>7 days</option></select></label><Button type="submit" disabled={locked||!normalizeVerifiedEmail(email)}>Create invitation</Button></form>:!data.canInvite?<p>This card already has a cardholder. Create a new card to invite someone else.</p>:null}
 {pending&&<><ShareResourceInvitation invitationId={pending.id} recipientEmail={pending.recipientEmail!} status={pending.status}/><Button variant="quiet" disabled={locked} onClick={()=>void save({kind:"CANCEL",commandId:crypto.randomUUID(),id:pending.id,expectedVersion:pending.version})}>Cancel invitation</Button></>}
 {data.invitations.some(row=>row.status!=="PENDING")&&<details><summary>Invitation history</summary>{data.invitations.filter(row=>row.status!=="PENDING").map(row=><p key={row.id}>{row.recipientName} · {formatDate(row.createdAt)} <StatusBadge status={row.status}/></p>)}</details>}
 </section>;
}

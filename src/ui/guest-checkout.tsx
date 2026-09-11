"use client";

import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {useRouter} from "next/navigation";
import type {GuestOrderProjection,PublicGuestRequest} from "@/modules/acquiring/guest-contracts";
import {Button,Feedback,WorkspaceCommandError,formatMoney} from "./workspace/primitives";
import {useServerProjection} from "./workspace/use-server-projection";
import "./guest-checkout.css";

type Pending={kind:"prepare";commandId:string;expectedVersion:number;outcome:"APPROVED"|"DECLINED"}|{kind:"confirm";attemptId:string};
type GuestCommand={kind:"session"}|{kind:"order";publicationId:string;body:{commandId:string}}|{kind:"prepare";orderId:string;body:{commandId:string;expectedVersion:number;outcome:"APPROVED"|"DECLINED"}}|{kind:"confirm";orderId:string;attemptId:string};
function when(value:string){return new Intl.DateTimeFormat("en-US",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value));}
async function guestRequest<T>(command:GuestCommand):Promise<T>{
 let response:Response;
 const options={method:"POST",credentials:"same-origin" as const,headers:{"Content-Type":"application/json"}};
 try{
  if(command.kind==="session")response=await fetch("/api/v1/guest/session",{...options,body:JSON.stringify({})});
  else if(command.kind==="order")response=await fetch(`/api/v1/guest/publications/${encodeURIComponent(command.publicationId)}/orders`,{...options,body:JSON.stringify(command.body)});
  else if(command.kind==="prepare")response=await fetch(`/api/v1/guest/orders/${encodeURIComponent(command.orderId)}/attempts`,{...options,body:JSON.stringify(command.body)});
  else response=await fetch(`/api/v1/guest/orders/${encodeURIComponent(command.orderId)}/attempts/${encodeURIComponent(command.attemptId)}/confirm`,{...options,body:JSON.stringify({})});
 }catch{throw new WorkspaceCommandError("We couldn’t confirm the result. Retry the same request to check its saved outcome.",null);}
 if(!response.ok){const data=await response.json().catch(()=>null) as {error?:{code?:string}}|null;throw new WorkspaceCommandError(response.status===408||response.status>=500?"We couldn’t confirm the result. Retry the same request to check its saved outcome.":[401,403,404].includes(response.status)?"This order or link is not available in this browser. Check the original payment link.":response.status===429?"Please wait a moment before retrying the same request.":"This payment request has changed. Reload its saved details before continuing.",response.status,data?.error?.code??null);}
 try{return await response.json() as T;}catch{throw new WorkspaceCommandError("We couldn’t read the saved result. Retry the same request.",null);}
}
async function readOrder(id:string):Promise<GuestOrderProjection>{
 const response=await fetch(`/api/v1/guest/orders/${encodeURIComponent(id)}`,{credentials:"same-origin",cache:"no-store"});
 if(!response.ok)throw new WorkspaceCommandError("This order isn’t available in this browser. Use the original payment link, or retry if your connection changed.",response.status);
 return await response.json() as GuestOrderProjection;
}
function MerchantSummary({name,primary}:{name:string;primary:string}){return <div className="gc-merchant"><span className="gc-avatar" aria-hidden="true">{name.slice(0,1)}</span><div><strong>{name}</strong>{primary!==name&&<p>For {primary}</p>}</div></div>;}
export function GuestOffer({initial}:{initial:PublicGuestRequest}){
 const router=useRouter();const [request]=useServerProjection(initial);const [pending,setPending]=useState<string|null>(null);const [busy,setBusy]=useState(false);const flight=useRef(false);const [error,setError]=useState<string|null>(null);
 const offer=request.publication;
 async function start(commandId:string){
  if(flight.current)return;flight.current=true;setBusy(true);setPending(commandId);setError(null);
  try{
   // Establish the order-only cookie before any order can be committed.
   await guestRequest<{ready:true}>({kind:"session"});
   const order=await guestRequest<GuestOrderProjection>({kind:"order",publicationId:offer.id,body:{commandId}});
   router.push(`/checkout/orders/${order.id}`);
  }catch(failure){setError(failure instanceof Error?failure.message:"We couldn’t start the order. Retry the same request.");}
  finally{flight.current=false;setBusy(false);}
 }
 return <div className="gc-page"><section className="gc-card" aria-labelledby="guest-offer-title"><MerchantSummary name={offer.merchantName} primary={offer.primaryMerchantName}/><p className="gc-eyebrow">Payment request</p><h1 id="guest-offer-title">{offer.description}</h1><p className="gc-amount">{formatMoney(offer.amount)}</p><p className="gc-currency">{offer.amount.currency}</p><div className="gc-disclosure"><strong>Practice checkout</strong><p>No real money moves. You won’t enter bank or card details.</p></div>{error&&<Feedback kind="error" message={error}/>}<div className="gc-actions">{pending?<Button busy={busy} onClick={()=>void start(pending)}>Retry same order</Button>:request.canStart?<Button busy={busy} onClick={()=>void start(crypto.randomUUID())}>Continue to order</Button>:<Feedback kind="info" message="This payment link is no longer accepting orders. Ask the merchant for a current link."/>}</div><p className="gc-note">{request.canStart?`Link expires ${when(offer.expiresAt)}.`:""} The order and receipt stay private to this browser.</p></section></div>;
}
export function GuestOrder({initial}:{initial:GuestOrderProjection}){
 const [order,setOrder,changed,isCurrent]=useServerProjection(initial);const [outcome,setOutcome]=useState<"APPROVED"|"DECLINED">("APPROVED");const [pending,setPending]=useState<Pending|null>(null);const [busy,setBusy]=useState(false);const flight=useRef(false);const [unavailable,setUnavailable]=useState(false);const [notice,setNotice]=useState<{kind:"error"|"info";message:string}|null>(null);
 const headingRef=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{headingRef.current?.focus();},[order.status]);
 if(changed){setNotice(null);setBusy(false);setUnavailable(false);}
 function resolved(next:GuestOrderProjection,attempt:Pending){return attempt.kind==="prepare"?next.attempt?.id===attempt.commandId:next.attempt?.id===attempt.attemptId&&next.receipt!==null&&["APPROVED","DECLINED","REFUNDED"].includes(next.status);}
 async function refresh(){
  if(flight.current)return;flight.current=true;setBusy(true);setNotice(null);
  try{const next=await readOrder(order.id);if(!isCurrent())return;setOrder(next);setUnavailable(false);if(pending&&resolved(next,pending))setPending(null);setNotice({kind:"info",message:"Your saved order is up to date."});}
  catch(error){if(!isCurrent())return;if(error instanceof WorkspaceCommandError&&[401,403,404].includes(error.status??0))setUnavailable(true);setNotice({kind:"error",message:error instanceof Error?error.message:"We couldn’t reload the order. Please retry."});}
  finally{flight.current=false;if(isCurrent())setBusy(false);}
 }
 async function send(attempt:Pending){
  if(flight.current)return;const retrying=pending!==null;flight.current=true;setBusy(true);setPending(attempt);setNotice(null);
  try{
   if(pending){const latest=await readOrder(order.id);if(!isCurrent())return;setOrder(latest);if(resolved(latest,attempt)){setPending(null);setUnavailable(false);return;}}
   const next=attempt.kind==="prepare"?await guestRequest<GuestOrderProjection>({kind:"prepare",orderId:order.id,body:{commandId:attempt.commandId,expectedVersion:attempt.expectedVersion,outcome:attempt.outcome}}):await guestRequest<GuestOrderProjection>({kind:"confirm",orderId:order.id,attemptId:attempt.attemptId});
   if(!isCurrent())return;setOrder(next);setPending(null);setUnavailable(false);
  }catch(error){if(!isCurrent())return;if(error instanceof WorkspaceCommandError){if(!retrying&&!error.uncertain)setPending(null);if([401,403,404].includes(error.status??0))setUnavailable(true);}setNotice({kind:"error",message:error instanceof Error?error.message:"We couldn’t confirm the result. Reload the saved order or retry the same request."});}
  finally{flight.current=false;if(isCurrent())setBusy(false);}
 }
 const locked=busy||!!pending;const review=order.status==="REVIEW";const receipt=order.receipt;
 const heading=unavailable?"This order isn’t available":order.status==="APPROVED"?"Practice payment complete":order.status==="REFUNDED"?"Practice payment refunded":order.status==="DECLINED"?"Practice payment declined":review?"Review practice payment":"Your order";
 return <div className="gc-page"><section className="gc-card" aria-labelledby="guest-order-title"><p className="gc-eyebrow">Sandbox checkout</p><h1 ref={headingRef} id="guest-order-title" tabIndex={-1}>{heading}</h1>{notice&&<Feedback {...notice}/>}<div aria-live="polite">{unavailable?<p>Open the original link in the browser where you started this order. No merchant sign-in is required.</p>:<><MerchantSummary name={order.merchantName} primary={order.primaryMerchantName}/><h2 className="gc-description">{order.description}</h2><p className="gc-amount">{formatMoney(order.amount)}</p><p className="gc-currency">{order.amount.currency}</p>{review&&<p>You chose a practice result of <strong>{order.attempt?.outcome==="DECLINED"?"declined":"approved"}</strong>. Confirm to record this attempt.</p>}{receipt&&!review&&<section className="gc-receipt" aria-labelledby="guest-receipt-title"><h2 id="guest-receipt-title">{receipt.status==="DECLINED"?"Attempt details":"Your receipt"}</h2><dl><div><dt>Reference</dt><dd>{receipt.reference}</dd></div><div><dt>{receipt.status==="DECLINED"?"Attempted":"Paid"}</dt><dd>{when(receipt.createdAt)}</dd></div><div><dt>Amount</dt><dd>{formatMoney(receipt.amount)}</dd></div>{receipt.refund&&<><div><dt>Refund amount</dt><dd>{formatMoney(receipt.refund.amount)}</dd></div><div><dt>Refund completed</dt><dd>{when(receipt.refund.createdAt)}</dd></div><div><dt>Refund reference</dt><dd>{receipt.refund.reference}</dd></div></>}</dl></section>}{order.status==="UNAVAILABLE"&&<Feedback kind="info" message="This order is no longer accepting a payment. Ask the merchant for a current link."/>}{order.canPrepare&&!review&&<fieldset disabled={locked} className="gc-outcomes"><legend>Choose a practice result</legend><label><input type="radio" name="practice-outcome" value="APPROVED" checked={outcome==="APPROVED"} onChange={()=>setOutcome("APPROVED")}/>Approved payment</label><label><input type="radio" name="practice-outcome" value="DECLINED" checked={outcome==="DECLINED"} onChange={()=>setOutcome("DECLINED")}/>Declined payment</label></fieldset>}<div className="gc-disclosure"><strong>No real money moves.</strong><p>This records a practice payment only. No card or bank details are needed.</p></div></>}</div><div className="gc-actions">{pending?<><p className="gc-note">A request is awaiting confirmation. Check the saved order or retry it before starting another attempt.</p><Button busy={busy} onClick={()=>void send(pending)}>Retry same request</Button></>:!unavailable&&order.canConfirm&&order.attempt?<Button busy={busy} onClick={()=>void send({kind:"confirm",attemptId:order.attempt!.id})}>Confirm practice payment</Button>:!unavailable&&order.canPrepare?<Button busy={busy} onClick={()=>void send({kind:"prepare",commandId:crypto.randomUUID(),expectedVersion:order.version,outcome})}>Review practice payment</Button>:null}<Button variant="secondary" disabled={busy} onClick={()=>void refresh()}>Reload saved order</Button></div>{!unavailable&&<p className="gc-note">{receipt?`You can revisit this receipt in this browser until ${when(order.receiptAccessExpiresAt)}.`:`Complete the order by ${when(order.expiresAt)}.`}</p>}<Link className="gc-back" href={order.freshRequestHref}>Back to payment request</Link></section></div>;
}

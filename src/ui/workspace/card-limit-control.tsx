"use client";
import Link from "next/link";
import {useEffect,useId,useRef,useState} from "react";
import {useRouter} from "next/navigation";
import type {CardSpending} from "@/modules/workspace/funding-contracts";
import {cardSpendingSchema} from "@/shared/funding-response";
import {pendingCardLimits,usePendingCardLimit,type PendingCardLimitAttempt} from "../pending-card-limit";
import {Button,Feedback,WorkspaceCommandError,formatMoney,workspaceCommand} from "./primitives";
import "../cardholder-funds.css";
function minorAmount(raw:string){if(!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(raw.trim()))return null;const [whole,fraction=""]=raw.trim().split(".");return (BigInt(whole!)*100n+BigInt(fraction.padEnd(2,"0"))).toString();}
function message(error:unknown){return error instanceof Error&&error.name!=="ZodError"?error.message:"We couldn’t confirm this limit. Retry the saved request.";}
export type SpendingLimitRecovery={retry:()=>Promise<void>};
export function CardLimitControl({personId,serviceId,name,spending,onAccessDenied,onSaved,onBusy,compact=false}:{personId:string;compact?:boolean;serviceId:string;name:string;spending:CardSpending;onAccessDenied:(recovery:SpendingLimitRecovery)=>void;onSaved:(spending:CardSpending)=>void;onBusy:(value:boolean)=>void}){
 const fieldId=useId(),fieldRef=useRef<HTMLInputElement>(null);
 const router=useRouter(),[editing,setEditing]=useState(false),[amount,setAmount]=useState(""),[review,setReview]=useState<string|null>(null),[error,setError]=useState("");
 useEffect(()=>{if(editing)fieldRef.current?.focus();},[editing]);
 const scope={personId,serviceId,cardId:spending.cardId},retained=usePendingCardLimit(scope),attempt=retained?.attempt??null,busy=retained?.inFlight??false;
 const mounted=useRef(true);useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
 const reviewedAmount=attempt?.allowanceMinor??review;
 const previousAttempt=useRef(attempt?.commandId);
 useEffect(()=>{
  const completed=Boolean(previousAttempt.current&&!attempt);previousAttempt.current=attempt?.commandId;
  if(completed){onBusy(false);router.refresh();}
 },[attempt,onBusy,router]);
 async function save(savedAttempt?:PendingCardLimitAttempt){
  const held=pendingCardLimits.get(scope);
  const input=savedAttempt??held?.attempt??(review===null?null:{...scope,commandId:crypto.randomUUID(),expectedVersion:spending.version,allowanceMinor:review});
  if(!input||input.personId!==personId||input.serviceId!==serviceId||input.cardId!==spending.cardId)return;
  const retrying=held?.uncertain??Boolean(savedAttempt);
  if(!pendingCardLimits.begin(input)){if(savedAttempt)throw new Error("This request is still being checked. Please wait, then retry.");return;}
  if(mounted.current){onBusy(true);setError("");}
  try{
   const saved=cardSpendingSchema.parse(await workspaceCommand<unknown>(input.serviceId,`/cards/${input.cardId}/spending-limit`,"PUT",{commandId:input.commandId,expectedVersion:input.expectedVersion,allowanceMinor:input.allowanceMinor}));
   if(saved.cardId!==input.cardId||saved.version<input.expectedVersion+1||(saved.version===input.expectedVersion+1&&saved.allowance.minor!==input.allowanceMinor))throw new Error("We couldn’t verify this limit. Retry the saved request.");
   pendingCardLimits.finish(input);
   // A recovery callback belongs to the still-mounted parent recovery surface.
   // An ordinary result arriving after route navigation only updates retention.
   if(savedAttempt||mounted.current)onSaved(saved);
   if(mounted.current){setEditing(false);setReview(null);onBusy(false);router.refresh();}
  }catch(failure){
   const denied=failure instanceof WorkspaceCommandError&&[401,403,404].includes(failure.status??0);
   const definite=!retrying&&failure instanceof WorkspaceCommandError&&!failure.uncertain&&!denied;
   if(definite)pendingCardLimits.finish(input);else pendingCardLimits.retainUnknown(input);
   if(savedAttempt)throw failure;
   if(!mounted.current)return;
   if(denied)onAccessDenied({retry:()=>save(input)});
   else {setError(message(failure));if(definite){setReview(null);onBusy(false);router.refresh();}}
  }
 }
 return <article className="funds-person" aria-label="Card spending limit">
  <div className="funds-limit-heading"><div><h3>Total spending limit</h3><strong className="funds-limit-value">{spending.allowance.formatted}</strong></div>{!editing&&!attempt&&<Button variant="quiet" aria-label={`Change spending limit for ${name}`} onClick={()=>{setEditing(true);setAmount((BigInt(spending.allowance.minor)/100n).toString()+"."+(BigInt(spending.allowance.minor)%100n).toString().padStart(2,"0"));}}>Change</Button>}</div>
  {spending.reviewRequired&&<p role="status">Please review this card’s limit. The previous limit was split across the cards you manage; the total amount available to spend was not increased.</p>}
  {!editing&&!attempt&&<p className="funds-limit-help">Includes past spending. Changing the limit does not add money or reset the amount used.</p>}
  {!compact&&<dl className="funds-limit-summary"><div><dt>Spent toward limit</dt><dd>{spending.used.formatted}</dd></div><div><dt>Limit remaining</dt><dd>{spending.remaining.formatted}</dd></div><div><dt>Available to spend</dt><dd>{spending.available.formatted}</dd></div></dl>}
  {(editing||attempt)&&<form className="funds-limit-form" onSubmit={event=>{event.preventDefault();if(reviewedAmount!==null){void save();return;}const value=minorAmount(amount);if(value===null){setError("Enter a valid USD amount.");return;}setError("");setReview(value);}}>
   {reviewedAmount===null?<div className="funds-limit-field"><label htmlFor={fieldId}>Total limit (USD)</label><input ref={fieldRef} id={fieldId} aria-describedby={`${fieldId}-help`} inputMode="decimal" value={amount} disabled={busy||!!attempt} onChange={e=>setAmount(e.target.value)}/><p id={`${fieldId}-help`}>Includes what this card has already spent. This amount does not renew monthly.</p></div>:<div className="funds-limit-review"><p>Set the total limit to <strong>{formatMoney(reviewedAmount)}</strong>?</p><p>It does not add money or reset past spending, including refunded purchases.</p></div>}
   <div className="consumer-action-row"><Button type="submit" busy={busy}>{reviewedAmount===null?"Review":attempt?"Retry saved spending limit":"Save limit"}</Button>{!attempt&&<Button variant="quiet" onClick={()=>{setEditing(false);setReview(null);setError("");onBusy(false);}}>Cancel</Button>}</div><Feedback kind="error" message={error}/>{attempt&&!busy&&<div className="consumer-card-retry"><p>This change has not been confirmed. You can return to this card to check the same request while this tab stays open. Reloading or signing out ends this tab’s saved retry; it does not cancel the change.</p><Link data-card-recovery-exit="true" href="/cardholder-services/cards">Leave unconfirmed request</Link></div>}
  </form>}
 </article>;
}

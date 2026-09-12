"use client";
import {useRef,useState} from "react";
import {useRouter} from "next/navigation";
import type {CardSpending} from "@/modules/workspace/funding-contracts";
import {cardSpendingSchema} from "@/shared/funding-response";
import {Button,Feedback,WorkspaceCommandError,formatMoney,workspaceCommand} from "./primitives";
import "../cardholder-funds.css";
function minorAmount(raw:string){if(!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(raw.trim()))return null;const [whole,fraction=""]=raw.trim().split(".");return (BigInt(whole!)*100n+BigInt(fraction.padEnd(2,"0"))).toString();}
function message(error:unknown){return error instanceof Error&&error.name!=="ZodError"?error.message:"We couldn’t confirm this limit. Retry the saved request.";}
type SpendingLimitAttempt=Readonly<{serviceId:string;cardId:string;commandId:string;expectedVersion:number;allowanceMinor:string}>;
export type SpendingLimitRecovery={retry:()=>Promise<void>};
export function CardLimitControl({serviceId,name,spending,onAccessDenied,onSaved,onBusy}:{serviceId:string;name:string;spending:CardSpending;onAccessDenied:(recovery:SpendingLimitRecovery)=>void;onSaved:(spending:CardSpending)=>void;onBusy:(value:boolean)=>void}){
 const router=useRouter(),[editing,setEditing]=useState(false),[amount,setAmount]=useState(""),[review,setReview]=useState<string|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState("");const [attempt,setAttempt]=useState<SpendingLimitAttempt|null>(null);const flight=useRef(false);
 async function save(savedAttempt?:SpendingLimitAttempt){
  const input=savedAttempt??attempt??(review===null?null:{serviceId,cardId:spending.cardId,commandId:crypto.randomUUID(),expectedVersion:spending.version,allowanceMinor:review});
  if(!input||(!savedAttempt&&busy))return;
  if(flight.current){if(savedAttempt)throw new Error("This request is still being checked. Please wait, then retry.");return;}
  flight.current=true;
  if(!savedAttempt){setAttempt(input);setBusy(true);onBusy(true);setError("");}
  try{
   const saved=cardSpendingSchema.parse(await workspaceCommand<unknown>(input.serviceId,`/cards/${input.cardId}/spending-limit`,"PUT",{commandId:input.commandId,expectedVersion:input.expectedVersion,allowanceMinor:input.allowanceMinor}));
   if(saved.cardId!==input.cardId||saved.version<input.expectedVersion+1||(saved.version===input.expectedVersion+1&&saved.allowance.minor!==input.allowanceMinor))throw new Error("We couldn’t verify this limit. Retry the saved request.");
   onSaved(saved);if(!savedAttempt){setEditing(false);setAttempt(null);onBusy(false);router.refresh();}
  }catch(e){
   if(savedAttempt)throw e;
   if(e instanceof WorkspaceCommandError&&[401,403,404].includes(e.status??0))onAccessDenied({retry:()=>save(input)});else {setError(message(e));if(!attempt&&e instanceof WorkspaceCommandError&&!e.uncertain){setAttempt(null);setReview(null);onBusy(false);router.refresh();}}
  }finally{flight.current=false;if(!savedAttempt)setBusy(false);}
 }
 return <article className="funds-person" aria-label="Card allowance"><div><h3>Total allowance</h3>{spending.reviewRequired&&<p role="status">Review this card’s limit. Your previous shared allowance was divided between cards without adding spending power.</p>}<p>Used <strong>{spending.used.formatted}</strong></p><p>Left on this allowance <strong>{spending.remaining.formatted}</strong></p><p>Available to spend <strong>{spending.available.formatted}</strong></p></div><div><span>Total allowance</span><strong className="funds-limit-value">{spending.allowance.formatted}</strong>{!editing&&<Button variant="quiet" onClick={()=>{setEditing(true);setAmount((BigInt(spending.allowance.minor)/100n).toString()+"."+(BigInt(spending.allowance.minor)%100n).toString().padStart(2,"0"));}}>Change allowance for {name}</Button>}</div>{editing&&<form className="funds-limit-form" onSubmit={event=>{event.preventDefault();if(review!==null){void save();return;}const value=minorAmount(amount);if(value===null){setError("Enter a valid USD amount.");return;}setError("");setReview(value);}}>{review===null?<label>New total allowance for {name}<input inputMode="decimal" value={amount} disabled={busy||!!attempt} onChange={e=>setAmount(e.target.value)}/></label>:<p>Set {name}’s total allowance to <strong>{formatMoney(review)}</strong>? This does not add money or reset previous spending.</p>}<div className="consumer-action-row"><Button type="submit" busy={busy}>{review===null?"Review allowance":attempt?"Retry saved allowance":"Save allowance"}</Button>{!attempt&&<Button variant="quiet" onClick={()=>{setEditing(false);setReview(null);setError("");onBusy(false);}}>Cancel</Button>}</div><Feedback kind="error" message={error}/></form>}</article>;
}

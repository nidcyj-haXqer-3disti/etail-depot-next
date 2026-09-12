"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import type {MerchantUnitSummary} from "@/modules/acquiring/contracts";
import {Button,Feedback,WorkspaceDialog,WorkspaceCommandError,merchantCommand} from "./primitives";
import {WorkspaceIcon} from "./navigation";
import {useMerchantNavigationLock} from "./merchant-navigation-state";
import "./merchant-entry.css";
import {requestFailure} from "../api-feedback";
type Props={kind:"PRIMARY"}|{kind:"SUB";primaryId:string;primaryName:string};
type Result={merchantId:string;nextHref:string;status:"DRAFT"};
async function createPrimary(body:Record<string,unknown>):Promise<Result> {
 let response:Response;
 try {response=await fetch("/api/v1/merchants",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(30_000)});}catch{throw new WorkspaceCommandError("We couldn’t confirm the result. Retry the same request to recover it.",null);}
 if(!response.ok)throw new WorkspaceCommandError(requestFailure(response.status,"We couldn’t create this merchant. Review your access and try again."),response.status);
 try{return await response.json() as Result;}catch{throw new WorkspaceCommandError("We couldn’t confirm the saved result. Retry the same request to recover it.",null);}
}
/** One explicit creation form with the same command/retry owner for both merchant scopes. */
export function MerchantCreate(props:Props) {
 const router=useRouter(),isPrimary=props.kind==="PRIMARY",label=isPrimary?"primary merchant":"submerchant";
 const [open,setOpen]=useState(false),[name,setName]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState(""),[attempt,setAttempt]=useState<{commandId:string;displayName:string}|null>(null),[savedHref,setSavedHref]=useState<string|null>(null);
 const [accessDenied,setAccessDenied]=useState(false),[leavingUnconfirmed,setLeavingUnconfirmed]=useState(false);
 const unavailable=!!attempt&&accessDenied,locked=busy||!!attempt||!!savedHref;
 useMerchantNavigationLock(busy||(!!attempt&&!leavingUnconfirmed));
 async function save(){
  if(busy||savedHref)return;const retrying=!!attempt;const body=attempt??{commandId:crypto.randomUUID(),displayName:name.trim()};setAttempt(body);setBusy(true);setLeavingUnconfirmed(false);setError("");
  try {
   const href=isPrimary?(await createPrimary(body)).nextHref:(await merchantCommand<MerchantUnitSummary>(props.primaryId,"/submerchants","POST",body)).href;
   setAttempt(null);setAccessDenied(false);setSavedHref(href);router.push(href);router.refresh();
  }catch(failure){if(retrying&&failure instanceof WorkspaceCommandError&&[401,403,404].includes(failure.status??0))setAccessDenied(true);if(failure instanceof WorkspaceCommandError&&!failure.uncertain&&!retrying)setAttempt(null);setError(failure instanceof Error?failure.message:"We couldn’t confirm this request. Retry to recover the saved result.");}
  finally{setBusy(false);}
 }
 return <><Button variant="secondary" onClick={()=>{if(!attempt&&!savedHref){setName("");setError("");setAccessDenied(false);setLeavingUnconfirmed(false);}setOpen(true);}}>{attempt?`Resume ${label} request`:isPrimary?"Create merchant":"Add submerchant"}</Button>
  <WorkspaceDialog open={open} onClose={()=>{if(!busy)setOpen(false);}} title={unavailable?"Merchant request unavailable":isPrimary?"Name your merchant":"Name your submerchant"} serviceName={isPrimary||unavailable?"Merchant services":props.primaryName}>
   {unavailable?<><Feedback kind="error" message={error}/><p>Your current access no longer allows this merchant request. Its result is still unconfirmed. Retrying uses the same saved request and checks your current access.</p><p>Leaving does not cancel or confirm the request. Review your saved merchant history when access is available again.</p><div className="mn-actions"><Button busy={busy} onClick={()=>void save()}>Retry same merchant request</Button><Button variant="quiet" disabled={busy} onClick={()=>{setOpen(false);setLeavingUnconfirmed(true);router.push("/services");}}>Leave unconfirmed request</Button></div></>:<>
    <Feedback kind="error" message={error}/>
    {savedHref?<><Feedback kind="success" message={`Your ${label} is saved.`}/><a className="consumer-button consumer-button-primary" href={savedHref}>Open saved merchant</a></>:<>
     {attempt&&!busy&&<Feedback kind="info" message="We couldn’t confirm the result. Retry this request to avoid creating a duplicate."/>}
     <form className="mn-form" onSubmit={event=>{event.preventDefault();if(!locked&&name.trim())void save();}}>
      <div className="merchant-create-context"><WorkspaceIcon name="merchant"/><div><h3>{isPrimary?"Start with your business name":"Give this collection point a name"}</h3><p>{isPrimary?"Manage your payments, channels and people together.":`This submerchant belongs to ${props.primaryName}. Its invited people will only see the records they can access here.`}</p></div></div>
      <label>{isPrimary?"Primary merchant name":"Submerchant name"}<input value={attempt?.displayName??name} onChange={event=>setName(event.target.value)} maxLength={80} required autoComplete="off" disabled={locked} placeholder={isPrimary?"For example, Garden shop":"For example, Weekend market"}/></label>
      <p className="mn-notice">{isPrimary?"You’ll be responsible for this merchant’s collections, refunds and deposits.":`${props.primaryName} remains responsible for this submerchant’s collections, refunds and deposits. No one is invited automatically.`} Cards are set up separately.</p>
      <p>Next: set up payments and create your first payment channel.</p>
      <div className="mn-actions"><Button variant="quiet" disabled={busy} onClick={()=>setOpen(false)}>{attempt?"Close":"Cancel"}</Button>{attempt?<Button type="button" busy={busy} disabled={busy} onClick={()=>void save()}>Retry same merchant request</Button>:<Button type="submit" busy={busy} disabled={locked||!name.trim()}>{isPrimary?"Create merchant":"Add submerchant"}</Button>}</div>
     </form>
    </>}
   </>}
  </WorkspaceDialog>
 </>;
}

"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import type {MerchantUnitSummary} from "@/modules/acquiring/contracts";
import {Button,Feedback,WorkspaceDialog,WorkspaceCommandError,merchantCommand} from "./primitives";
import {requestFailure} from "../api-feedback";
type Props={kind:"PRIMARY"}|{kind:"SUB";primaryId:string;primaryName:string};
type Result={merchantId:string;nextHref:string;status:"DRAFT"};
async function createPrimary(body:Record<string,unknown>):Promise<Result> {
 let response:Response;
 try {response=await fetch("/api/v1/merchants",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});}catch{throw new WorkspaceCommandError("We couldn’t confirm the result. Retry the same request to recover it.",null);}
 if(!response.ok)throw new WorkspaceCommandError(requestFailure(response.status,"We couldn’t create this merchant. Review your access and try again."),response.status);
 try{return await response.json() as Result;}catch{throw new WorkspaceCommandError("We couldn’t confirm the saved result. Retry the same request to recover it.",null);}
}
/** Shared name/review/retry flow for primary merchants and owned submerchants. */
export function MerchantCreate(props:Props) {
 const router=useRouter(),isPrimary=props.kind==="PRIMARY",label=isPrimary?"primary merchant":"submerchant";
 const [open,setOpen]=useState(false),[name,setName]=useState(""),[review,setReview]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[attempt,setAttempt]=useState<{commandId:string;displayName:string}|null>(null),[savedHref,setSavedHref]=useState<string|null>(null);
 const locked=busy||!!attempt||!!savedHref;
 async function save(){
  if(busy||savedHref)return;const body=attempt??{commandId:crypto.randomUUID(),displayName:name.trim()};setAttempt(body);setBusy(true);setError("");
  try {
   const href=isPrimary?(await createPrimary(body)).nextHref:(await merchantCommand<MerchantUnitSummary>(props.primaryId,"/submerchants","POST",body)).href;
   setAttempt(null);setSavedHref(href);router.push(href);router.refresh();
  }catch(failure){if(failure instanceof WorkspaceCommandError&&!failure.uncertain)setAttempt(null);setError(failure instanceof Error?failure.message:"We couldn’t confirm this request. Retry to recover the saved result.");}
  finally{setBusy(false);}
 }
 return <><Button variant="secondary" onClick={()=>{if(!attempt&&!savedHref){setName("");setReview(false);setError("");}setOpen(true);}}>{attempt?`Resume ${label} request`:isPrimary?"Create a primary merchant":"Add submerchant"}</Button><WorkspaceDialog open={open} onClose={()=>{if(!busy)setOpen(false);}} title={review?`Review ${label}`:`Name your ${label}`} serviceName={isPrimary?"Merchant services":props.primaryName}><Feedback kind="error" message={error}/>{savedHref?<><Feedback kind="success" message={`Your ${label} is saved.`}/><a className="consumer-button consumer-button-primary" href={savedHref}>Open saved merchant</a></>:<>{attempt&&!busy&&<Feedback kind="info" message="We couldn’t confirm the result. Retry this request to avoid creating a duplicate."/>}{review?<><dl className="mn-review"><div><dt>{isPrimary?"Primary merchant":"Submerchant"}</dt><dd>{attempt?.displayName??name}</dd></div>{!isPrimary&&<div><dt>Responsible primary merchant</dt><dd>{props.primaryName}</dd></div>}</dl><p className="mn-notice">{isPrimary?"You will manage its payments, channels and people. Next, enable sandbox payments and create your first payment channel.":`You will manage this submerchant under ${props.primaryName}. The primary merchant remains responsible for its collections, refunds and transfers.`} Use sample details in this sandbox. This does not give anyone access to cards.</p><div className="mn-actions"><Button variant="quiet" disabled={locked} onClick={()=>setReview(false)}>Back to name</Button><Button busy={busy} disabled={busy} onClick={()=>void save()}>{attempt?"Retry same merchant request":isPrimary?"Create primary merchant":"Create submerchant"}</Button></div></>:<form className="mn-form" onSubmit={event=>{event.preventDefault();if(name.trim())setReview(true);}}><label>{isPrimary?"Primary merchant name":"Submerchant name"}<input value={name} onChange={event=>setName(event.target.value)} maxLength={80} required autoComplete="off" disabled={locked} placeholder={isPrimary?"For example, Sample garden shop":"For example, Weekend market"}/></label><p>Name your business, shop or collection point using sample details.</p><div className="mn-actions"><Button variant="quiet" disabled={busy} onClick={()=>setOpen(false)}>Cancel</Button><Button type="submit" disabled={locked||!name.trim()}>Review merchant</Button></div></form>}</>}</WorkspaceDialog></>;
}

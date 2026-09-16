"use client";
import {useState} from "react";
import Link from "next/link";
import {customerHref} from "@/shared/customer-routes";
import {useCustomerSearchParams} from "../use-customer-search-params";
import {useRouter} from "next/navigation";
import {merchantRecordHref} from "@/shared/merchant-activity";
import {merchantUnitSummarySchema} from "@/shared/merchant-response";
import {primaryMerchantResultSchema} from "@/shared/merchant-response";
import type {MerchantUnitSummary} from "@/modules/acquiring/contracts";
import {Button,Feedback,WorkspaceDialog,WorkspaceCommandError,merchantCommand} from "./primitives";
import {WorkspaceIcon} from "./navigation";
import {useMerchantNavigationLock} from "./merchant-navigation-state";
import "./merchant-entry.css";
import {requestFailure} from "../api-feedback";
type Props={kind:"MERCHANT"}|{kind:"TERMINAL";merchantServiceId:string;merchantName:string};
type Result={merchantId:string;nextHref:string;status:"DRAFT"};
function savedDestination(value:string){const url=new URL(value,"https://etail.invalid");if(!value.startsWith("/")||value.startsWith("//")||url.origin!=="https://etail.invalid"||url.hash)throw new Error("Invalid merchant destination");return customerHref(url.pathname,url.searchParams);}
async function createPrimary(body:Record<string,unknown>):Promise<Result> {
 let response:Response;
 try {response=await fetch("/api/v1/merchants",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(30_000)});}catch{throw new WorkspaceCommandError("We couldn’t confirm the result. Retry the same request to recover it.",null);}
 if(!response.ok)throw new WorkspaceCommandError(requestFailure(response.status,"We couldn’t add this business. Check your access and try again."),response.status);
 try{const result=primaryMerchantResultSchema.parse(await response.json());if(savedDestination(result.nextHref)!==merchantRecordHref(result.merchantId,{tab:"payments"},null))throw new Error("Invalid merchant destination");return {...result,nextHref:savedDestination(result.nextHref)};}catch{throw new WorkspaceCommandError("We couldn’t confirm the saved result. Retry the same request to recover it.",null);}
}
/** One explicit creation form with the same command/retry owner for both merchant scopes. */
export function MerchantCreate(props:Props) {
 const params=useCustomerSearchParams(),router=useRouter(),isPrimary=props.kind==="MERCHANT",label=isPrimary?"business":"payment terminal";
 const requestedOpen=props.kind==="TERMINAL"&&params.get("new")==="1"&&params.get("view")===`merchant:${props.merchantServiceId}`;
 const [open,setOpen]=useState(requestedOpen),[name,setName]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState(""),[attempt,setAttempt]=useState<{commandId:string;displayName:string;intendedUse?:"SELF"|"OTHER"}|null>(null),[savedHref,setSavedHref]=useState<string|null>(null);
 const [intendedUse,setIntendedUse]=useState<"SELF"|"OTHER">("OTHER");
 const [accessDenied,setAccessDenied]=useState(false),[leavingUnconfirmed,setLeavingUnconfirmed]=useState(false);
 const [previousRequestedOpen,setPreviousRequestedOpen]=useState(requestedOpen);if(previousRequestedOpen!==requestedOpen){setPreviousRequestedOpen(requestedOpen);if(!attempt&&!savedHref)setOpen(requestedOpen);}
 const createQuery=new URLSearchParams(params.toString());createQuery.set("section","merchants");if(props.kind==="TERMINAL")createQuery.set("view",`merchant:${props.merchantServiceId}`);createQuery.set("new","1");
 const close=()=>{if(busy)return;setOpen(false);if(requestedOpen&&!attempt&&!savedHref){createQuery.delete("new");router.replace(customerHref("/merchant-services",createQuery));}};
 const unavailable=!!attempt&&accessDenied,locked=busy||!!attempt||!!savedHref;
 useMerchantNavigationLock(busy||(!!attempt&&!leavingUnconfirmed));
 async function save(){
  if(busy||savedHref)return;const retrying=!!attempt;const body=attempt??{commandId:crypto.randomUUID(),displayName:name.trim(),...(!isPrimary?{intendedUse}:{})};setAttempt(body);setBusy(true);setLeavingUnconfirmed(false);setError("");
  try {
   let href:string;
   if(isPrimary)href=(await createPrimary(body)).nextHref;
   else{const result=merchantUnitSummarySchema.safeParse(await merchantCommand<MerchantUnitSummary>(props.merchantServiceId,"/terminals","POST",body));if(!result.success||result.data.merchant.serviceId!==props.merchantServiceId||result.data.displayName!==body.displayName||result.data.intendedUse!==(body.intendedUse??"SELF")||savedDestination(result.data.href)!==merchantRecordHref(result.data.id,{},null))throw new WorkspaceCommandError("We couldn’t confirm this terminal. Check this request again.",null);href=merchantRecordHref(result.data.id,result.data.intendedUse==="OTHER"?{tab:"people",invite:"1"}:{tab:"channels"},null);}
   setAttempt(null);setAccessDenied(false);setSavedHref(href);router.push(href);router.refresh();
  }catch(failure){if(retrying&&failure instanceof WorkspaceCommandError&&[401,403,404].includes(failure.status??0))setAccessDenied(true);if(failure instanceof WorkspaceCommandError&&!failure.uncertain&&!retrying)setAttempt(null);setError(failure instanceof Error?failure.message:"We couldn’t confirm this request. Retry to recover the saved result.");}
  finally{setBusy(false);}
 }
 return <>{props.kind==="TERMINAL"&&!attempt&&!savedHref?<Link className="consumer-button consumer-button-secondary" href={customerHref("/merchant-services",createQuery)}>Create terminal</Link>:<Button variant="secondary" onClick={()=>{if(!attempt&&!savedHref){setName("");setIntendedUse("OTHER");setError("");setAccessDenied(false);setLeavingUnconfirmed(false);}setOpen(true);}}>{attempt?`Resume ${label} request`:isPrimary?"Add your business":"Create terminal"}</Button>}
  <WorkspaceDialog open={open} onClose={close} title={unavailable?"We couldn’t confirm this request":isPrimary?"Name your business":"Create terminal"} serviceName={isPrimary||unavailable?"Accept payments":props.merchantName}>
   {unavailable?<><Feedback kind="error" message={error}/><p>Your access has changed, so we cannot show whether this request was saved. Check the same request again when you have access.</p><p>Leaving this page does not cancel the request. Check your saved business details when your access is restored.</p><div className="mn-actions"><Button busy={busy} onClick={()=>void save()}>Check request again</Button><Button variant="quiet" disabled={busy} onClick={()=>{setOpen(false);setLeavingUnconfirmed(true);router.push("/services");}}>Leave for now</Button></div></>:<>
    <Feedback kind="error" message={error}/>
    {savedHref?<><Feedback kind="success" message={`Your ${label} is saved.`}/><a className="consumer-button consumer-button-primary" href={savedHref}>Open saved details</a></>:<>
     {attempt&&!busy&&<Feedback kind="info" message="We couldn’t confirm the result. Retry this request to avoid creating a duplicate."/>}
     <form className="mn-form" onSubmit={event=>{event.preventDefault();if(!locked&&name.trim())void save();}}>
      <div className="merchant-create-context"><WorkspaceIcon name="merchant"/><div><h3>{isPrimary?"Start with your business name":"Collect payments for a person or location"}</h3><p>{isPrimary?"Receive payments for your business and let trusted people collect for you.":"People you invite can collect payments and see only this terminal’s records."}</p></div></div>
      {!isPrimary&&<fieldset className="merchant-use-choice" disabled={locked}><legend>Who will use this terminal?</legend><div>{([['OTHER','For someone else','Create the terminal, then invite its recipient.'],['SELF','For your use','Collect payments yourself.']] as const).map(([value,title,detail])=><label key={value}><input type="radio" name="terminal-use" value={value} checked={(attempt?.intendedUse??intendedUse)===value} onChange={()=>setIntendedUse(value)}/><span><strong>{title}</strong><small>{detail}</small></span></label>)}</div></fieldset>}
      <label>{isPrimary?"Business name":"Payment terminal name"}<input value={attempt?.displayName??name} onChange={event=>setName(event.target.value)} maxLength={80} required autoComplete="off" disabled={locked} placeholder={isPrimary?"For example, Garden shop":"For example, Weekend market"}/></label>
      <p className="mn-notice merchant-create-notice">{isPrimary?"You control the payment balance, refunds and who can collect payments.":`All payments belong to ${props.merchantName}. You control the balance, refunds and access.`} </p>
      <p>{!isPrimary&&intendedUse==="OTHER"?"Next: invite the person who will use this terminal.":"Next: enable payments and create your first payment request."}</p>
      <div className="mn-actions"><Button variant="quiet" disabled={busy} onClick={close}>{attempt?"Close":"Cancel"}</Button>{attempt?<Button type="button" busy={busy} disabled={busy} onClick={()=>void save()}>Check request again</Button>:<Button type="submit" busy={busy} disabled={locked||!name.trim()}>{isPrimary?"Add your business":"Create terminal"}</Button>}</div>
     </form>
    </>}
   </>}
  </WorkspaceDialog>
 </>;
}

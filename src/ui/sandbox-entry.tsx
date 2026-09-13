"use client";
import {useRef,useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import type {SandboxOverview} from "@/modules/sandbox/contracts";
import {Icon} from "./icon";
import {Button,Feedback} from "./workspace/primitives";
import {invitationIdFromNextPath} from "@/shared/auth-continuation";
import {sandboxOverviewSchema} from "@/shared/sandbox-response";
import "./sandbox.css";

type Service="cardholder"|"merchant";
export function SandboxEntry({initial,service,invitationHref,profileOnly=false}:{initial:SandboxOverview;service?:Service;invitationHref?:string;profileOnly?:boolean}) {
 const router=useRouter(),flight=useRef(false);
 const [state,setState]=useState(initial),[selected,setSelected]=useState<Service>(service??"cardholder");
 const [name,setName]=useState(initial.displayName==="New member"?"":initial.displayName),[busy,setBusy]=useState(false),[error,setError]=useState(""),[signInRequired,setSignInRequired]=useState(false);
 const [acknowledged,setAcknowledged]=useState(false);
 const invitationPath=invitationIdFromNextPath(invitationHref)?invitationHref:null;
 const [attempt,setAttempt]=useState<{commandId:string;displayName:string;acknowledged:true;destination:Service|"profile"}|null>(null);
 async function start(){
  if(flight.current||!name.trim()||invitationPath&&!acknowledged)return;
  if(/[\u0000-\u001f\u007f-\u009f]/.test(name)){setError("Please retype your display name.");return;}
  flight.current=true;setBusy(true);setError("");
  const pending=attempt??{commandId:crypto.randomUUID(),displayName:name.trim(),acknowledged:true as const,destination:profileOnly?"profile" as const:selected};setAttempt(pending);
  try{
   const {destination,...body}=pending;
   const response=await fetch("/api/v1/sandbox",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
   if(!response.ok){if(response.status===401)setSignInRequired(true);if(response.status===422){setAttempt(null);throw new Error("Check your display name and try again.");}throw new Error(response.status===401?"Sign in again to continue.":"We couldn’t confirm setup. Retry to safely finish the same request.");}
   const result=sandboxOverviewSchema.safeParse(await response.json());
   if(!result.success||!result.data.joined)throw new Error("We couldn’t confirm setup. Retry to safely finish the same request.");
   setState(result.data);setAttempt(null);
   router.push(invitationPath??(destination==="profile"?"/profile":destination==="cardholder"?"/cardholder-services":"/merchant-services"));router.refresh();
  }catch(e){setError(e instanceof Error&&e.constructor===Error?e.message:"We couldn’t confirm setup. Retry to safely finish the same request.");}finally{flight.current=false;setBusy(false);}
 }
 if(state.joined&&!initial.joined)return <section className="sandbox-member" role="status"><h2>Your details are saved.</h2><p>{invitationPath?"Next: review your invitation.":profileOnly?"Your personal details are ready.":selected==="cardholder"?"Next: set up your cards.":"Next: set up your payments."}</p><Link className="consumer-button" href={invitationPath??(profileOnly?"/profile":selected==="cardholder"?"/cardholder-services":"/merchant-services")}>Continue</Link></section>;
 if(state.joined)return null;
 return <section className="sandbox-entry" aria-labelledby="sandbox-start-title">
  <div className="sandbox-introduction"><h2 id="sandbox-start-title">{invitationPath?"A few details before your invitation.":profileOnly?"Your display name":service?"A few details before you start.":"Choose where to start."}</h2><p>{invitationPath?"Enter the name your account owner will see. Then review the invitation and choose whether to accept.":profileOnly?"Choose the name people see when you share cards or payment terminals.":"Enter the name other people will see. Start with cards or accepting payments. You can set up the other option later."}</p></div>
  <form onSubmit={e=>{e.preventDefault();void start();}}>
   {!profileOnly&&!service&&!invitationPath&&<fieldset className="sandbox-service-options" disabled={busy||!!attempt}><legend>What would you like to do?</legend>{([{id:"cardholder",label:"Cards & spending",description:"Cards for you and your people",icon:"person"},{id:"merchant",label:"Accept payments",description:"Payments for your business",icon:"shop"}] as const).map(option=><label key={option.id} className={selected===option.id?"is-selected":""}><input aria-label={option.label} type="radio" name="starting-service" value={option.id} checked={selected===option.id} onChange={()=>setSelected(option.id)}/><Icon name={option.icon}/><span><strong>{option.label}</strong><small>{option.description}</small></span></label>)}</fieldset>}
   <label>Your name<input required maxLength={80} autoComplete="nickname" value={name} disabled={busy||!!attempt} onChange={e=>setName(e.target.value)} placeholder="The name your people will see"/></label>
   {invitationPath&&<label className="sandbox-acknowledgement"><input type="checkbox" required checked={acknowledged} disabled={busy||!!attempt} onChange={event=>setAcknowledged(event.target.checked)}/>I understand this is a sandbox and no real money will move.</label>}
   <Feedback kind="error" message={error}/>{signInRequired&&<Link className="consumer-button" href={invitationPath?`/login?next=${encodeURIComponent(invitationPath)}`:"/login"}>Sign in to continue</Link>}<Button type="submit" busy={busy} disabled={signInRequired||!name.trim()||!!invitationPath&&!acknowledged}>{busy?"Continuing…":attempt?"Retry setup":profileOnly?"Save your details":"Continue"}</Button><p className="sandbox-start-note">{invitationPath?"This saves your profile. It does not create an account for cards or payments.":profileOnly?"Your display name is shared across your services.":selected==="cardholder"?"Next: set up your cards.":"Next: set up your payments."}</p>
  </form>
 </section>;
}

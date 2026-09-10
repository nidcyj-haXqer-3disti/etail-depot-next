"use client";
import {useRef,useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import type {SandboxOverview} from "@/modules/sandbox/contracts";
import {Icon} from "./icon";
import {Button,Feedback} from "./workspace/primitives";
import "./sandbox.css";

type Service="cardholder"|"merchant";
export function SandboxEntry({initial,service,showMemberCode=false}:{initial:SandboxOverview;service?:Service;showMemberCode?:boolean}) {
 const router=useRouter(),flight=useRef(false);
 const [state,setState]=useState(initial),[selected,setSelected]=useState<Service>(service??"cardholder");
 const [name,setName]=useState(initial.displayName==="New member"?"":initial.displayName),[ack,setAck]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[copied,setCopied]=useState(false),[signInRequired,setSignInRequired]=useState(false);
 const [attempt,setAttempt]=useState<{commandId:string;displayName:string;acknowledged:true;destination:Service}|null>(null);
 async function start(){
  if(flight.current||!ack||!name.trim())return;
  if(/[\u0000-\u001f\u007f-\u009f]/.test(name)){setError("Please retype your display name.");return;}
  flight.current=true;setBusy(true);setError("");
  const pending=attempt??{commandId:crypto.randomUUID(),displayName:name.trim(),acknowledged:true as const,destination:selected};setAttempt(pending);
  try{
   const {destination,...body}=pending;
   const response=await fetch("/api/v1/sandbox",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
   if(!response.ok){if(response.status===401)setSignInRequired(true);if(response.status===422){setAttempt(null);throw new Error("Check your display name and try again.");}throw new Error(response.status===401?"Sign in again to continue.":"We couldn’t confirm setup. Retry to safely finish the same request.");}
   setState(await response.json());setAttempt(null);
   router.push(destination==="cardholder"?"/cardholder-services":"/merchant-services");router.refresh();
  }catch(e){setError(e instanceof Error?e.message:"Please retry.");}finally{flight.current=false;setBusy(false);}
 }
 if(state.joined&&!initial.joined)return <section className="sandbox-member" role="status"><h2>You’re ready to begin.</h2><p>Your practice space is ready.</p><Link className="consumer-button" href={selected==="cardholder"?"/cardholder-services":"/merchant-services"}>{selected==="cardholder"?"Continue to cards":"Continue to payments"}</Link></section>;
 if(state.joined)return showMemberCode&&state.memberCode?<aside id="member-code" className="sandbox-member" aria-label="Your sandbox member code"><div><p className="consumer-eyebrow">CONNECT WITH YOUR PEOPLE</p><h2>Your member code</h2><p>Someone inviting you to a card or merchant can find you with this code. You choose whether to accept.</p></div><div className="sandbox-code-copy"><code>{state.memberCode}</code><Button variant="secondary" onClick={async()=>{try{await navigator.clipboard.writeText(state.memberCode!);setCopied(true);}catch{setError("Select your member code to copy it.");}}}>{copied?"Copied":"Copy code"}</Button></div><Feedback kind="error" message={error}/></aside>:null;
 return <section className="sandbox-entry" aria-labelledby="sandbox-start-title">
  <div className="sandbox-introduction"><p className="consumer-eyebrow">WELCOME TO ETAIL DEPOT</p><h2 id="sandbox-start-title">Let’s get you started.</h2><p>{selected==="cardholder"?"Create a card for yourself, then bring your family or team along. You stay in control of every card you manage.":"Create a payment channel, try your first payment and see it arrive. Bring other people in when you’re ready."}</p><ol className="sandbox-journey" aria-label="What happens next">{(selected==="cardholder"?["Choose who the card is for","Name it and set a practice balance","Create your card and try a purchase"]:["Name your merchant and enable payments","Create your first payment channel","Try a payment and view the receipt"]).map((item,i)=><li key={item}><span aria-hidden="true">{i+1}</span>{item}</li>)}</ol><p className="sandbox-mode-note"><Icon name="info"/>This is your private practice space. Cards and money are simulated.</p></div>
  <form onSubmit={e=>{e.preventDefault();void start();}}>
   {!service&&<fieldset className="sandbox-service-options" disabled={busy||!!attempt}><legend>Where would you like to start?</legend>{([{id:"cardholder",label:"Cardholder services",description:"Create cards for you and your people",icon:"person"},{id:"merchant",label:"Merchant services",description:"Receive payments and share collection access",icon:"shop"}] as const).map(option=><label key={option.id} className={selected===option.id?"is-selected":""}><input aria-label={option.label} type="radio" name="starting-service" value={option.id} checked={selected===option.id} onChange={()=>setSelected(option.id)}/><Icon name={option.icon}/><span><strong>{option.label}</strong><small>{option.description}</small></span></label>)}</fieldset>}
   <label>Your display name<input required maxLength={80} autoComplete="nickname" value={name} disabled={busy||!!attempt} onChange={e=>setName(e.target.value)} placeholder="The name your people will see"/></label>
   <label className="sandbox-consent"><input type="checkbox" required checked={ack} disabled={busy||!!attempt} onChange={e=>setAck(e.target.checked)}/><span>I understand this is a sandbox. Cards, balances, payments and verification are simulated. No real money moves.</span></label>
   <Feedback kind="error" message={error}/>{signInRequired&&<Link className="consumer-button" href="/login">Sign in to continue</Link>}<Button type="submit" busy={busy} disabled={signInRequired||!ack||!name.trim()}>{busy?"Continuing…":attempt?"Retry sandbox setup":selected==="cardholder"?"Continue to cards":"Continue to payments"}</Button><p className="sandbox-start-note">You can use both services. Start with the one you need today.</p>
  </form>
 </section>;
}

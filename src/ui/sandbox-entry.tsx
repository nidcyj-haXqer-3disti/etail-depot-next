"use client";
import {useRef,useState} from "react";
import {useRouter} from "next/navigation";
import type {SandboxOverview} from "@/modules/sandbox/contracts";
import {Button,Feedback} from "./workspace/primitives";
import "./sandbox.css";

export function SandboxEntry({initial}:{initial:SandboxOverview}) {
 const router=useRouter(),flight=useRef(false);
 const [state,setState]=useState(initial),[name,setName]=useState(initial.displayName==="New member"?"":initial.displayName),[ack,setAck]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[copied,setCopied]=useState(false);
 const [attempt,setAttempt]=useState<{commandId:string;displayName:string;acknowledged:true}|null>(null);
 async function start(){
  if(flight.current)return;flight.current=true;setBusy(true);setError("");
  const body=attempt??{commandId:crypto.randomUUID(),displayName:name.trim(),acknowledged:true as const};setAttempt(body);
  try{const response=await fetch("/api/v1/sandbox",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
   if(!response.ok){if(response.status===401)throw new Error("Sign in again to start your sandbox.");throw new Error("We couldn’t confirm setup. Retry to safely finish the same request.");}
   setState(await response.json());setAttempt(null);router.refresh();
  }catch(e){setError(e instanceof Error?e.message:"Please retry.");}finally{flight.current=false;setBusy(false);}
 }
 if(state.joined)return state.memberCode?<aside className="sandbox-member" aria-label="Your sandbox member code"><div><strong>Your member code</strong><p>Share this code with someone who wants to invite you to their cards or merchant.</p></div><code>{state.memberCode}</code><Button variant="quiet" onClick={async()=>{try{await navigator.clipboard.writeText(state.memberCode!);setCopied(true);}catch{setError("Select your member code to copy it.");}}}>{copied?"Copied":"Copy code"}</Button><Feedback kind="error" message={error}/></aside>:null;
 return <section className="sandbox-entry" aria-labelledby="sandbox-start-title"><div><p className="consumer-eyebrow">YOUR SANDBOX</p><h2 id="sandbox-start-title">Try the whole journey.</h2><p>Create cards, set up merchants, invite people and try payments using simulated money.</p></div><form onSubmit={e=>{e.preventDefault();void start();}}><label>Your display name<input required maxLength={80} autoComplete="nickname" value={name} disabled={busy||!!attempt} onChange={e=>setName(e.target.value)}/></label><label className="sandbox-consent"><input type="checkbox" required checked={ack} disabled={busy||!!attempt} onChange={e=>setAck(e.target.checked)}/><span>I understand this is a sandbox. Cards, balances, payments and verification are simulated. No real money moves.</span></label><Feedback kind="error" message={error}/><Button type="submit" busy={busy} disabled={!ack||!name.trim()}>{attempt?"Retry sandbox setup":"Start sandbox"}</Button></form></section>;
}

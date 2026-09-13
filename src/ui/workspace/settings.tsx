"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { WorkspaceProjection, NotificationPreferences } from "@/modules/workspace/contracts";
import { WorkspaceIcon } from "./navigation";
import { Feedback, workspaceCommand } from "./primitives";

export function SettingsWorkspace({workspace:w}:{workspace:WorkspaceProjection}) {
 const [preferences,setPreferences]=useState(w.preferences);
 const [pending,setPending]=useState(false);
 const [feedback,setFeedback]=useState<{kind:"success"|"error";message:string}|null>(null);
 const retry=useRef<{key:string;id:string}|null>(null);
 const canSave=w.capabilities.some(item=>item.action==="notifications.manage"&&item.allowed);
 async function save(e:React.SubmitEvent<HTMLFormElement>) {
  e.preventDefault();if(pending)return;setPending(true);setFeedback(null);
  try {
   const input={expectedVersion:preferences.version,serviceActivity:preferences.serviceActivity,cardControls:preferences.cardControls,caseUpdates:preferences.caseUpdates};
   const key=JSON.stringify(input);
   if(retry.current?.key!==key)retry.current={key,id:crypto.randomUUID()};
   const saved=await workspaceCommand<NotificationPreferences>(w.service.id,"/preferences/notifications","PUT",{commandId:retry.current.id,...input});
   retry.current=null;
   setPreferences(saved);setFeedback({kind:"success",message:`Notification preferences saved for ${(w.customerService?.displayName ?? "Cards & spending")}.`});
  }catch(e){setFeedback({kind:"error",message:e instanceof Error?e.message:"Your preferences could not be saved. Please try again."});}
  finally{setPending(false);}
 }
 async function reloadSaved(){
  setPending(true);
  try{const response=await fetch(`/api/v1/cardholder-services/${w.service.id}/workspace`,{credentials:"same-origin",cache:"no-store"});if(!response.ok)throw new Error("Saved preferences could not be reloaded. Your edits are still on screen.");const latest=await response.json() as WorkspaceProjection;setPreferences(latest.preferences);retry.current=null;setFeedback({kind:"success",message:"Saved notification preferences reloaded."});}
  catch(e){setFeedback({kind:"error",message:e instanceof Error?e.message:"Saved preferences could not be reloaded."});}
  finally{setPending(false);}
 }
 const options=[{key:"serviceActivity",title:"Card activity",text:"Updates about card activity and important changes."},{key:"cardControls",title:"Card controls",text:"Updates when cards are frozen or unfrozen."},{key:"caseUpdates",title:"Case updates",text:"Updates when support replies to your questions."}] as const;
 return <div className="ws-settings"><div className="ws-welcome"><div><h2>{w.cardholderRole==="OWNER"?"Manage your account":"Your card preferences"}</h2><p>{w.cardholderRole==="OWNER"?"Review your card account and choose the updates you want.":"Choose updates for the cards you can access."}</p></div></div><div className="ws-settings-grid"><section className="ws-panel"><div className="ws-panel-heading"><h3>Account information</h3><WorkspaceIcon name="shield"/></div><dl className="ws-definition-list"><div><dt>Card account</dt><dd>{(w.customerService?.displayName ?? "Cards & spending")}</dd></div><div><dt>Signed in as</dt><dd>{w.member.displayName}</dd></div><div><dt>Your role</dt><dd>{w.cardholderRole==="OWNER"?"Account owner":w.cardholderRole==="CARDHOLDER"?"Cardholder":"No card access"}</dd></div></dl><div className="consumer-action-row"><Link href="/profile">Your profile</Link><Link href="/security">Sign-in & security</Link></div></section><section className="ws-panel"><div className="ws-panel-heading"><div><p className="ws-kicker">STAY IN THE LOOP</p><h3>Notification preferences</h3></div><WorkspaceIcon name="bell"/></div><form onSubmit={e=>void save(e)}>{feedback&&<Feedback kind={feedback.kind} message={feedback.message}/>}<div className="ws-preference-list">{options.map(option=><label key={option.key} className="ws-preference"><span><strong>{option.title}</strong><small>{option.text}</small></span><input type="checkbox" checked={preferences[option.key]} onChange={e=>{setPreferences({...preferences,[option.key]:e.target.checked});setFeedback(null);}} disabled={pending||!canSave}/></label>)}</div><p className="ws-settings-note">You can save your choices. Notification delivery is not available yet.</p>{canSave?<button type="submit" className="ws-button ws-button-dark" disabled={pending}>{pending?"Saving preferences…":"Save preferences"}<WorkspaceIcon name="check"/></button>:<p className="ws-settings-note">Ask your account owner to review your access.</p>}{feedback?.kind==="error"&&<button type="button" className="ws-inline-button" disabled={pending} onClick={()=>void reloadSaved()}>Reload saved preferences and discard these edits</button>}</form></section></div></div>;
}

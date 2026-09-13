"use client";

import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import type {WorkspaceProjection} from "@/modules/workspace/contracts";
import {parseNotificationOverview,parseNotificationSave} from "@/shared/notification-response";
import {pendingNotificationPreferences,usePendingNotificationPreferences} from "../pending-notification-preferences";
import {WorkspaceIcon} from "./navigation";
import {Button,Feedback,WorkspaceCommandError,workspaceCommand} from "./primitives";
import "./settings.css";

const preferenceOptions=[
  {key:"serviceActivity",title:"Card activity",text:"Purchases and important changes to your card activity."},
  {key:"cardControls",title:"Card controls",text:"Changes when a card is frozen or unfrozen."},
  {key:"caseUpdates",title:"Case updates",text:"Replies to your support questions."},
] as const;
function errorMessage(error:unknown){return error instanceof Error&&error.name!=="ZodError"?error.message:"We couldn’t verify these preferences. Retry the same save.";}

export function SettingsWorkspace({workspace:w,returnMoneyHref}:{workspace:WorkspaceProjection;returnMoneyHref?:string}){
  const router=useRouter();
  const [preferences,setPreferences]=useState(w.preferences);
  const [sourcePreferences,setSourcePreferences]=useState(w.preferences);
  const scope={serviceId:w.service.id,personId:w.member.id};
  const retained=usePendingNotificationPreferences(scope),attempt=retained?.attempt??null;
  if(sourcePreferences!==w.preferences){setSourcePreferences(w.preferences);if(!attempt)setPreferences(w.preferences);}
  const [reloading,setReloading]=useState(false);
  const busy=retained?.inFlight?"save":reloading?"reload":null;
  const [canManage,setCanManage]=useState(w.capabilities.some(item=>item.action==="notifications.manage"&&item.allowed));
  const [stale,setStale]=useState(false),[unavailable,setUnavailable]=useState(false);
  const [feedback,setFeedback]=useState<{kind:"success"|"error"|"info";message:string}|null>(null);
  const mounted=useRef(true),inFlight=useRef(false);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  const previousAttempt=useRef(attempt?.commandId);
  useEffect(()=>{const completed=Boolean(previousAttempt.current&&!attempt);previousAttempt.current=attempt?.commandId;if(completed)router.refresh();},[attempt,router]);
  const owner=w.cardholderRole==="OWNER";
  const locked=!!busy||!!attempt||stale||!canManage;

  async function save(){
    if(inFlight.current||(!attempt&&(!canManage||stale||unavailable)))return;
    const held=pendingNotificationPreferences.get(scope),retrying=held?.uncertain??false;
    const input=held?.attempt??Object.freeze({...scope,commandId:crypto.randomUUID(),expectedPersonId:scope.personId,expectedVersion:preferences.version,serviceActivity:preferences.serviceActivity,cardControls:preferences.cardControls,caseUpdates:preferences.caseUpdates});
    if(!pendingNotificationPreferences.begin(input))return;
    inFlight.current=true;setFeedback(null);
    try{
      const body={commandId:input.commandId,expectedPersonId:input.expectedPersonId,expectedVersion:input.expectedVersion,serviceActivity:input.serviceActivity,cardControls:input.cardControls,caseUpdates:input.caseUpdates};
      const saved=parseNotificationSave(await workspaceCommand<unknown>(scope.serviceId,"/preferences/notifications","PUT",body),scope,input);
      pendingNotificationPreferences.finish(input);
      if(!mounted.current)return;
      setPreferences(saved);setStale(false);setUnavailable(false);setCanManage(true);
      setFeedback({kind:"success",message:saved.version>input.expectedVersion+1?"Your save was confirmed. More recent saved preferences are shown below.":"Your notification preferences are saved."});
    }catch(error){
      const denied=error instanceof WorkspaceCommandError&&[401,403,404].includes(error.status??0);
      const definite=!retrying&&error instanceof WorkspaceCommandError&&!error.uncertain&&!denied;
      if(definite)pendingNotificationPreferences.finish(input);else pendingNotificationPreferences.retainUnknown(input);
      if(!mounted.current)return;
      if(definite&&error.status===409)setStale(true);
      if(denied)setUnavailable(true);
      setFeedback({kind:"error",message:errorMessage(error)});
    }finally{inFlight.current=false;}
  }
  async function reload(){
    if(inFlight.current||retained?.inFlight)return;
    inFlight.current=true;setReloading(true);setFeedback(null);
    try{
      const response=await fetch(`/api/v1/cardholder-services/${scope.serviceId}/preferences/notifications`,{credentials:"same-origin",cache:"no-store"});
      if(!response.ok)throw new WorkspaceCommandError("We couldn’t reload this account’s preferences. Please retry.",response.status);
      const next=parseNotificationOverview(await response.json(),scope);
      if(!mounted.current)return;
      setCanManage(next.canManage);setUnavailable(false);setStale(false);
      // Reading current choices cannot acknowledge a previously unconfirmed write.
      if(!attempt)setPreferences(next.preferences);
      setFeedback({kind:"info",message:attempt?"Your account access was checked. Retry the saved request to confirm that change; its original choices are still retained.":next.canManage?"Saved preferences reloaded. You can make a new change.":"Your saved preferences are shown. Your current access does not allow changes."});
    }catch(error){
      if(!mounted.current)return;
      if(error instanceof WorkspaceCommandError&&[401,403,404].includes(error.status??0))setUnavailable(true);
      setFeedback({kind:"error",message:error instanceof Error&&error.name!=="ZodError"?error.message:"We couldn’t verify this account’s saved preferences. Please retry."});
    }finally{inFlight.current=false;if(mounted.current)setReloading(false);}
  }
  const recovery=<>{feedback&&<Feedback kind={feedback.kind} message={feedback.message}/>}<div className="ch-settings-actions">{attempt&&<Button disabled={!!busy} busy={busy==="save"} onClick={()=>void save()}>Retry saved preferences</Button>}<Button variant="secondary" disabled={!!busy} busy={busy==="reload"} onClick={()=>void reload()}>{attempt?"Check account access":"Reload saved preferences"}</Button></div>{attempt&&<p className="ch-settings-note">This save has not been confirmed. Its original choices are retained here. You can return to this account to retry while this tab stays open. Reloading or signing out ends the saved retry; it does not cancel the request.</p>}</>;
  if(unavailable)return <section className="ch-settings-unavailable" aria-labelledby="preferences-unavailable-title"><WorkspaceIcon name="shield"/><h2 id="preferences-unavailable-title">Preferences unavailable</h2><p>Your current access does not show these account details. Check access again or retry an unconfirmed save.</p>{recovery}</section>;

  return <div className="ch-settings">
    <div className="ch-settings-intro"><h2>{owner?"Card account settings":"Your card preferences"}</h2><p>{owner?"Account information and the updates you choose to receive.":"Choose updates for the cards you use in this account."}</p></div>
    <div className="ch-settings-layout">
      <section className="ch-settings-panel" aria-labelledby="card-account-details-title"><div className="ch-settings-section-heading"><span><WorkspaceIcon name="shield"/></span><div><h3 id="card-account-details-title">{owner?"Account details":"Your card access"}</h3><p>{owner?"This account is separate from your personal profile.":"Your access is limited to cards assigned to you."}</p></div></div>
        <dl className="ch-settings-details"><div><dt>Account name</dt><dd>{w.service.displayName}</dd></div><div><dt>Account owner</dt><dd>{w.customerService?.primaryName??"Account owner"}</dd></div>{owner?<><div><dt>Account status</dt><dd>{w.service.status.toLowerCase().replace(/^./,first=>first.toUpperCase())}</dd></div><div><dt>Funding</dt><dd>Prepaid card balance</dd></div><div><dt>Spending limits</dt><dd>A total allowance for each card</dd></div></>:<div><dt>Your access</dt><dd>Your assigned cards and their activity</dd></div>}</dl>
        <p className="ch-settings-note">{owner?"Freeze a card, change its spending limit or invite its cardholder from the card’s detail page.":"Open a card to see its available spending and freeze controls."}</p>
      </section>
      <section className="ch-settings-panel ch-settings-preferences" aria-labelledby="card-notification-preferences-title"><div className="ch-settings-section-heading"><span><WorkspaceIcon name="bell"/></span><div><h3 id="card-notification-preferences-title">Notification preferences</h3><p>These choices apply to you in this account.</p></div></div>
        <p className="ch-settings-delivery"><WorkspaceIcon name="help"/><span>You can save your choices. Notification delivery is not available yet.</span></p>
        <form onSubmit={event=>{event.preventDefault();void save();}}>{feedback&&<Feedback kind={feedback.kind} message={feedback.message}/>}
          <div className="ch-settings-options">{preferenceOptions.map(option=><label key={option.key}><span><strong>{option.title}</strong><small>{option.text}</small></span><input type="checkbox" checked={attempt?.[option.key]??preferences[option.key]} disabled={locked} onChange={event=>{setPreferences({...preferences,[option.key]:event.target.checked});setFeedback(null);}}/></label>)}</div>
          {attempt?<><p className="ch-settings-note">This save has not been confirmed. Retry its original choices before making another change. You can return to this account to retry while this tab stays open. Reloading or signing out ends the saved retry; it does not cancel the change.</p><div className="ch-settings-actions"><Button type="submit" disabled={!!busy} busy={busy==="save"}>Retry saved preferences</Button><Button variant="secondary" disabled={!!busy} busy={busy==="reload"} onClick={()=>void reload()}>Check account access</Button></div></>:<div className="ch-settings-actions">{canManage&&<Button type="submit" disabled={!!busy||stale} busy={busy==="save"}>Save preferences</Button>}{(stale||feedback?.kind==="error"||!canManage)&&<Button variant="secondary" disabled={!!busy} busy={busy==="reload"} onClick={()=>void reload()}>Reload saved preferences</Button>}</div>}
          {!canManage&&<p className="ch-settings-note">Your current access lets you view saved preferences. Ask your account owner to review access before making changes.</p>}
        </form>
      </section>
      {owner&&returnMoneyHref&&<section className="ch-settings-panel ch-settings-money" aria-labelledby="card-return-money-title"><div className="ch-settings-section-heading"><span><WorkspaceIcon name="reports"/></span><div><h3 id="card-return-money-title">Return unused money</h3><p>Review a return from the available balance. Money already spent on cards cannot be returned.</p></div></div><Link className="consumer-button consumer-button-secondary" href={returnMoneyHref}>Return unused money<WorkspaceIcon name="arrow"/></Link></section>}
    </div>
  </div>;
}

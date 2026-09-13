"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { WorkspaceProjection } from "@/modules/workspace/contracts";
import type { CardholderServiceProfile } from "@/modules/workspace/dashboard-contracts";
import { cardholderTaskHref } from "../cardholder-routing";
import { WorkspaceDialog, EmptyState } from "./primitives";
import { WorkspaceIcon, type WorkspaceIconName } from "./navigation";
import "./task-search.css";

export function TaskSearch({workspace:w,primaryService,selectedCardId}:{workspace?:Pick<WorkspaceProjection,"service"|"cardholderRole"|"capabilities">;primaryService?:CardholderServiceProfile|null;selectedCardId?:string}) {
  const [open,setOpen]=useState(false);const [query,setQuery]=useState("");
  useEffect(()=>{function shortcut(e:KeyboardEvent){if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"&&!document.querySelector("dialog[open]")){e.preventDefault();setQuery("");setOpen(true);}}document.addEventListener("keydown",shortcut);return()=>document.removeEventListener("keydown",shortcut);},[]);
  const can=(action:string)=>w?.capabilities.some(item=>item.action===action&&item.allowed)===true;
  const selection={cardId:selectedCardId,contextId:w?.service.id??primaryService?.id};
  const accountSelection=primaryService?{contextId:primaryService.id}:selection;
  const manage=primaryService?.canInvite?primaryService.id:w?.cardholderRole==="OWNER"&&can("people.read")?w.service.id:null;
  const tasks:{label:string;detail:string;path:string;icon:WorkspaceIconName;allowed:boolean;keywords:string}[]=[
    {label:"Cards",detail:primaryService?.canAddCard?"Add a card, assign its cardholder or manage its spending limit":"View your cards, purchases and card controls",path:"/cardholder-services?view=cards",icon:"cards",allowed:true,keywords:"freeze unfreeze pause resume"},
    {label:"Find a transaction",detail:"Search your activity and view purchase details",path:cardholderTaskHref("activity",selection),icon:"activity",allowed:true,keywords:"search purchases payments pending posted"},
    {label:"Statements & reports",detail:"Review card activity and download a report",path:cardholderTaskHref("reports",selection),icon:"reports",allowed:!!w&&can("activity.read"),keywords:"download csv accounting reconciliation"},
    {label:"Cardholders",detail:"Manage people who use your cards and review invitations",path:primaryService?"/cardholder-services?view=cardholders":`/cardholder-services?manage=${manage??""}`,icon:"people",allowed:!!manage,keywords:"invite remove revoke roles manager viewer permissions"},
    {label:"Sign-in & security",detail:"Review active sessions and sign out other browsers",path:"/security",icon:"shield",allowed:true,keywords:"sessions devices login logout"},
    {label:primaryService?"Account settings":"Preferences",detail:"Account information and notification preferences",path:cardholderTaskHref("settings",accountSelection),icon:"settings",allowed:!!w||!!primaryService,keywords:"alerts email preferences"},
    {label:"Get help",detail:"Ask a question and read support replies",path:cardholderTaskHref("help",selection),icon:"help",allowed:!!w,keywords:"question support fraud problem cases contact"},
    {label:"Account balance",detail:"View money activity, add money or withdraw",path:`/cardholder-services/funds?service=${primaryService?.id??""}`,icon:"reports",allowed:!!primaryService,keywords:"top up topup funding bank"},
    {label:"Card history",detail:"Continue saved card setup and review created cards",path:"/cardholder-services?view=requests",icon:"cards",allowed:primaryService?.canAddCard===true,keywords:"draft request application canceled"},
  ];
  const results=tasks.filter(task=>task.allowed&&`${task.label} ${task.detail} ${task.keywords}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <><button type="button" className="ws-task-trigger" aria-label="Find a task" aria-keyshortcuts="Control+k Meta+k" onClick={()=>{setQuery("");setOpen(true);}}><WorkspaceIcon name="search"/><span>Find a task</span><kbd>⌘ K</kbd></button>
    <WorkspaceDialog open={open} onClose={()=>setOpen(false)} title="What would you like to do?" serviceName="Cards & spending"><label className="task-search-field"><WorkspaceIcon name="search"/><span className="consumer-sr-only">Search tasks</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={event=>{
        // Search inputs consume Escape to clear text before a native dialog can cancel.
        if(event.key==="Escape"&&!event.nativeEvent.isComposing){event.preventDefault();setOpen(false);}
      }} placeholder="Try cards, purchases or invitations" maxLength={100}/></label><p className="task-search-count" role="status">{results.length} available {results.length===1?"task":"tasks"}</p>
      <div className="task-search-results">{results.map(task=><Link key={task.label} href={task.path} onClick={()=>setOpen(false)}><span className="task-search-icon"><WorkspaceIcon name={task.icon}/></span><span><strong>{task.label}</strong><small>{task.detail}</small></span><WorkspaceIcon name="arrow"/></Link>)}</div>{!results.length&&<EmptyState title="No matching tasks" description="Try a shorter search, or clear it to browse the actions available to you."/>}
    </WorkspaceDialog></>;
}

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
  const selection={cardId:selectedCardId,contextId:w?.service.id};
  const manage=primaryService?.canInvite?primaryService.id:w?.cardholderRole==="PRIMARY"&&can("people.read")?w.service.id:null;
  const tasks:{label:string;detail:string;path:string;icon:WorkspaceIconName;allowed:boolean;keywords:string}[]=[
    {label:"Manage cards",detail:"Review cards and their current controls",path:"/cardholder-services?view=cards",icon:"cards",allowed:true,keywords:"freeze unfreeze pause resume"},
    {label:"Add a card",detail:"Create a card or continue a saved request",path:"/cardholder-services?new=1",icon:"plus",allowed:primaryService?.canAddCard===true,keywords:"apply application new holder"},
    {label:"Find a transaction",detail:"Search your activity and view purchase details",path:cardholderTaskHref("activity",selection),icon:"activity",allowed:true,keywords:"search purchases payments pending posted"},
    {label:"Statements & reports",detail:"Review card activity and download a report",path:cardholderTaskHref("reports",selection),icon:"reports",allowed:!!w&&can("activity.read"),keywords:"download csv accounting reconciliation"},
    {label:"Cardholders",detail:"Review access and pending invitations",path:primaryService?"/cardholder-services?view=cardholders":`/cardholder-services?manage=${manage??""}`,icon:"people",allowed:!!manage,keywords:"invite remove revoke roles manager viewer permissions"},
    {label:"Sign-in & security",detail:"Review active sessions and sign out other browsers",path:"/security",icon:"shield",allowed:true,keywords:"sessions devices login logout"},
    {label:"Compare memberships",detail:"Explore Select, Premier and an annual cost estimate",path:cardholderTaskHref("membership",selection),icon:"overview",allowed:!!w,keywords:"plans pricing fees cashback bonus benefits rewards calculator"},
    {label:"Notification settings",detail:"Choose which card updates you want",path:cardholderTaskHref("settings",selection),icon:"bell",allowed:!!w,keywords:"alerts email preferences"},
    {label:"Get help",detail:"Ask a question and read support replies",path:cardholderTaskHref("help",selection),icon:"help",allowed:!!w,keywords:"question support fraud problem cases contact"},
    {label:"Shared access",detail:"Review access offered to you",path:"/shared-access",icon:"bell",allowed:true,keywords:"accept decline invitation"},
    {label:"Merchant services",detail:"Manage payments and your merchants",path:"/merchant-services",icon:"merchant",allowed:true,keywords:"collections payments channels gateway"},
  ];
  const results=tasks.filter(task=>task.allowed&&`${task.label} ${task.detail} ${task.keywords}`.toLowerCase().includes(query.trim().toLowerCase()));
  function taskPath(path:string){
    if(!selectedCardId||!path.startsWith("/cardholder-services?"))return path;
    const [pathname,search]=path.split("?");
    const query=new URLSearchParams(search);query.set("focus",selectedCardId);
    return `${pathname}?${query}`;
  }
  return <><button type="button" className="ws-task-trigger" aria-label="Find a task" aria-keyshortcuts="Control+k Meta+k" onClick={()=>{setQuery("");setOpen(true);}}><WorkspaceIcon name="search"/><span>Find a task</span><kbd>⌘ K</kbd></button>
    <WorkspaceDialog open={open} onClose={()=>setOpen(false)} title="What would you like to do?" serviceName="Cardholder services"><label className="task-search-field"><WorkspaceIcon name="search"/><span className="consumer-sr-only">Search tasks</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={event=>{
        // Search inputs consume Escape to clear text before a native dialog can cancel.
        if(event.key==="Escape"&&!event.nativeEvent.isComposing){event.preventDefault();setOpen(false);}
      }} placeholder="Try cards, statements or access" maxLength={100}/></label><p className="task-search-count" role="status">{results.length} available {results.length===1?"task":"tasks"}</p>
      <div className="task-search-results">{results.map(task=><Link key={task.label} href={taskPath(task.path)} onClick={()=>setOpen(false)}><span className="task-search-icon"><WorkspaceIcon name={task.icon}/></span><span><strong>{task.label}</strong><small>{task.detail}</small></span><WorkspaceIcon name="arrow"/></Link>)}</div>{!results.length&&<EmptyState title="No matching tasks" description="Try a shorter search, or clear it to browse the actions available to you."/>}
    </WorkspaceDialog></>;
}

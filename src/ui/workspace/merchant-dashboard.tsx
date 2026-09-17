"use client";
import Link from "next/link";
import {type ComponentProps,type ReactNode} from "react";
import {MoneyAccountHome} from "../money-account";
import type {MerchantDashboardProjection} from "@/modules/acquiring/dashboard-contracts";
import {merchantActivityHref,merchantRecordHref,type MerchantActivityQuery} from "@/shared/merchant-activity";
import {Button,EmptyState,StatusBadge} from "./primitives";
import {MerchantCreate} from "./merchant-create";
import {WorkspaceIcon} from "./navigation";
import "./merchant-dashboard.css";

function PreservedFilters({query,except}:{query:MerchantActivityQuery;except:(keyof MerchantActivityQuery)[]}){
 return Object.entries(query).filter(([key])=>key!=="page"&&!except.includes(key as keyof MerchantActivityQuery)).map(([key,value])=><input key={key} type="hidden" name={key} value={value}/>);
}

export type MerchantMoneyHome=ComponentProps<typeof MoneyAccountHome>;

export function MerchantDashboard({initial:dashboard,moneyHomes=[],statement}:{initial:MerchantDashboardProjection;moneyHomes?:MerchantMoneyHome[];statement?:ReactNode}){
 const query=dashboard.activity.query,view=dashboard.views.find(item=>item.id===query.view);
 const selected=dashboard.units.filter(terminal=>view?.unitIds.includes(terminal.id));
 const href=(changes:Partial<MerchantActivityQuery>)=>merchantActivityHref(query,changes);
 const recordHref=(terminalId:string,tab:string)=>merchantRecordHref(terminalId,{tab},href({}));
 const owners=dashboard.merchants.filter(merchant=>merchant.ownerAccess);
 const selectedOwners=owners.filter(owner=>selected.some(terminal=>terminal.merchantServiceId===owner.serviceId));
 const section=query.section==="funds"||query.section==="activity"?"overview":query.section==="channels"?"merchants":query.section;
 const title=section==="overview"?"Overview":section==="settings"?"Account settings":"Terminals";
 const terminalUse=query.terminalUse;
 const singleCreator=section==="merchants"&&selectedOwners.length===1?selectedOwners[0]:null;
 const visibleTerminals=selected.filter(terminal=>terminalUse==="all"||(terminalUse==="others")===terminal.forOthers);
 return <section className="md-dashboard" aria-labelledby="merchant-overview-title">
  <header className="md-header"><div><h1 id="merchant-overview-title">{title}</h1>{view&&query.view!=="all"&&<p>{view.name}{!owners.length&&section==="overview"?" · Your assigned terminals":""}</p>}</div>{singleCreator&&<div className="md-header-actions"><MerchantCreate key={singleCreator.serviceId} kind="TERMINAL" merchantServiceId={singleCreator.serviceId} merchantName={singleCreator.name} prominent/></div>}</header>
  {!dashboard.units.length?<section className="md-start"><h2>Start receiving payments</h2><p>Add your business, then create terminals for yourself or others.</p>{dashboard.canCreateMerchant&&<MerchantCreate kind="MERCHANT"/>}<Link href="/shared-access?service=merchant">Review an invitation to collect payments</Link></section>:!view?<EmptyState title="This view is unavailable" description="Choose a payment terminal you can access."><Link href="/merchant-services?section=merchants">Your terminals</Link></EmptyState>:<>
   {dashboard.units.length>1&&<form key={href({})} className="md-scope-form md-terminal-filter" action="/merchant-services" method="get" aria-label="Choose payment terminals"><PreservedFilters query={query} except={["view"]}/><label>Show<select name="view" defaultValue={query.view}><option value="all">All payment terminals</option>{dashboard.merchants.map(merchant=><optgroup key={merchant.serviceId} label={merchant.name}><option value={`merchant:${merchant.serviceId}`}>{merchant.name} · all payment terminals</option>{dashboard.units.filter(terminal=>terminal.merchantServiceId===merchant.serviceId).map(terminal=><option key={terminal.id} value={`unit:${terminal.id}`}>{terminal.name}</option>)}</optgroup>)}</select></label><Button type="submit" variant="secondary">Show</Button></form>}
   {section==="overview"?<>
    {moneyHomes.map(home=><MoneyAccountHome key={home.account.id} {...home} returnTo={href({})}/>)}
    {statement??<EmptyState title="Your statement could not load" description="Reload this overview to check the latest payment records."/>}
    {!owners.length&&dashboard.canCreateMerchant&&<details className="md-disclosure md-optional-enrollment"><summary>Optional: add your own business</summary><p>Add a separate business to receive payments and manage its balance. Your shared terminal access stays the same.</p><MerchantCreate kind="MERCHANT"/></details>}
   </>:section==="settings"?<section className="md-directory" aria-label="Merchant account settings"><div className="md-section-heading"><div><h2>Choose a business</h2><p>Business settings apply to all its terminals. Individual controls are on each terminal’s page.</p></div></div>{selectedOwners.length?selectedOwners.map(owner=><section className="md-panel" key={owner.serviceId}><h3>{owner.name}</h3><Link href={`/merchant-services/${owner.serviceId}/settings?${new URLSearchParams({returnTo:href({section:"settings"})})}`}>Business details<span className="consumer-sr-only"> for {owner.name}</span></Link></section>):<EmptyState title="Account settings are managed by the owner" description="Open one of your terminals to manage its payment requests and customer questions."/>}</section>:<section className="md-directory" aria-label="Terminals">
    {!singleCreator&&selectedOwners.map(merchant=><div className="md-section-heading" key={merchant.serviceId}>{(selectedOwners.length>1||merchant.name!==view.name)&&<h3>{merchant.name}</h3>}<MerchantCreate kind="TERMINAL" merchantServiceId={merchant.serviceId} merchantName={merchant.name}/></div>)}
    {owners.length>0&&<nav className="md-use-filter" aria-label="Terminal use"><Link href={href({terminalUse:"all",page:1})} aria-current={terminalUse==="all"?"page":undefined}>All terminals</Link><Link href={href({terminalUse:"self",page:1})} aria-current={terminalUse==="self"?"page":undefined}>For your use</Link><Link href={href({terminalUse:"others",page:1})} aria-current={terminalUse==="others"?"page":undefined}>For others</Link></nav>}
    <div className="md-terminal-list">{visibleTerminals.map(terminal=><article className="md-terminal-item" key={terminal.id}><Link className="md-terminal-row" href={recordHref(terminal.id,"channels")} aria-labelledby={`terminal-name-${terminal.id}`}><span className="md-terminal-icon" aria-hidden="true"><WorkspaceIcon name="merchant"/></span><div className="md-terminal-identity"><h3 id={`terminal-name-${terminal.id}`}>{terminal.name}</h3><p>{[terminal.merchantName!==view.name?terminal.merchantName:null,terminal.ownerAccess?terminalUse==="all"?terminal.forOthers?"For others":"For your use":null:"Shared with you"].filter(Boolean).join(" · ")}</p>{terminal.collectionAvailability.code!=="READY"&&<span className="md-terminal-attention">{terminal.collectionAvailability.title}</span>}</div><div className="md-terminal-meta"><StatusBadge status={terminal.status}/>{terminal.totals.channelCount!==null&&<span>{terminal.totals.channelCount} {terminal.totals.channelCount===1?"payment link":"payment links"}</span>}</div><span className="md-terminal-arrow" aria-hidden="true">›</span></Link></article>)}</div>
    {!visibleTerminals.length&&<EmptyState title={terminalUse==="others"?"No terminals for others yet":"No terminals in this view"} description={terminalUse==="others"?"Create a terminal for someone else, then invite them to use it.":"Choose another filter to find your terminals."}/>}
   </section>}
  </>}
 </section>;
}

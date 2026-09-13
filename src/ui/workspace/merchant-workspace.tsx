import type {DisputeProjection} from "@/modules/disputes/contracts";
import {MerchantDisputes} from "./merchant-disputes";
import Link from "next/link";
import type {MerchantWorkspaceProjection} from "@/modules/acquiring/contracts";
import type {MerchantOperationsProjection} from "@/modules/acquiring/operations-contracts";
import type {MerchantAccessOverview} from "@/modules/access/merchant-contracts";
import {SupportCases,type MerchantSupportContext} from "./cases";
import {MerchantShell,type MerchantTab} from "./merchant-shell";
import {MerchantStatusControl} from "./merchant-status";
import {MerchantChannels} from "./merchant-channels";
import {MerchantPeople} from "./merchant-people";
import {MerchantOperations} from "./merchant-operations";
import {EmptyState,StatusBadge} from "./primitives";
import {formatDate} from "./format-date";
import "./merchant-network.css";

export function MerchantWorkspace({workspace,tab,access,operations,support,disputes,overviewHref}:{workspace:MerchantWorkspaceProjection;tab:MerchantTab;access?:MerchantAccessOverview;operations?:MerchantOperationsProjection;support?:MerchantSupportContext;disputes?:DisputeProjection[];overviewHref?:string}) {
 const {merchant}=workspace;
 const directoryHref=overviewHref??`/merchant-services?section=merchants&view=${workspace.ownerAccess?`merchant:${merchant.merchant.serviceId}`:`unit:${merchant.id}`}`;
 const sectionHref=(section:MerchantTab)=>`/merchants/${merchant.id}?${new URLSearchParams({tab:section,returnTo:directoryHref})}#terminal-${section}`;
 const ready=operations?.gateway.mode==="TEST_READY"&&operations.enrollment.status==="ENROLLED";
 const retry=(section:MerchantTab,title:string)=><EmptyState title={title} description="Reload to check your current access. Your saved records have not changed."><a href={sectionHref(section)}>Reload this section</a></EmptyState>;
 return <MerchantShell merchantId={merchant.id} showSettings={workspace.ownerAccess} overviewHref={directoryHref} activeSection="merchants">
  <Link className="mn-account-back" href={directoryHref}>← Back to terminals</Link>
  <header className="mn-heading" role="region" aria-label="Selected payment terminal"><div><p className="consumer-eyebrow">PAYMENT TERMINAL · {merchant.merchant.displayName}</p><h1>{merchant.displayName}</h1><p>{workspace.ownerAccess?merchant.intendedUse==="OTHER"?"Created for someone else. Manage their access and payment channels here.":"Your payment channels, people and activity, together.":"Use this terminal to receive payments and help its customers."}</p></div><StatusBadge status={merchant.status}/></header>
  <div className="mn-resource-links" role="group" aria-label="Terminal sections"><a href="#terminal-channels">Payment channels</a>{workspace.canReadPeople&&<a href="#terminal-people">People & sharing</a>}<a href="#terminal-payments">Activity</a><a href="#terminal-service">Customer support</a>{workspace.ownerAccess&&<a href="#terminal-verification">Terminal controls</a>}</div>
  {merchant.status!=="ACTIVE"&&<div className="mn-notice">New payments are stopped for this terminal. Its saved history is still available with your access.</div>}
  <div id="terminal-channels" className="mn-resource-section"><MerchantChannels key={merchant.id} initial={workspace} operations={operations} showSetup={false}/></div>
  {workspace.canReadPeople&&<section id="terminal-people" className="mn-resource-section" aria-label="People and sharing">{access?<MerchantPeople key={merchant.id} initial={access}/>:retry("people","People and sharing could not load")}</section>}
  <section id="terminal-payments" className="mn-resource-section" aria-label="Terminal activity">{operations?<MerchantOperations key={merchant.id} workspace={workspace} initial={operations} showAdministration={workspace.ownerAccess} section="payments"/>:retry("payments","Payment activity could not load")}</section>
  <section id="terminal-service" className="mn-resource-section" aria-label="Customer support"><h2>Customer support</h2><details className="mn-resource-disclosure" open={tab==="disputes"}><summary>Disputes</summary><div id="terminal-disputes">{disputes?<MerchantDisputes disputes={disputes}/>:retry("disputes","Disputes could not load")}</div></details><details className="mn-resource-disclosure" open={tab==="help"}><summary>Contact support</summary><div id="terminal-help">{support?<SupportCases key={`${merchant.id}:${tab==="help"?"support":"standby"}`} context={support}/>:retry("help","Support could not load")}</div></details></section>
  {workspace.ownerAccess&&<section id="terminal-verification" className="mn-resource-section" aria-label="Terminal controls"><details className="mn-resource-disclosure" open={tab==="verification"||!ready}><summary>Terminal controls</summary>{operations?<MerchantOperations key={`${merchant.id}:setup`} workspace={workspace} initial={operations} showAdministration section="setup"/>:retry("verification","Payment setup could not load")}<MerchantStatusControl key={merchant.id} initial={workspace}/><details className="mn-panel"><summary>Terminal history</summary><ul className="mn-list">{workspace.timeline.map(item=><li key={item.id}><strong>{item.label}</strong><span> · {formatDate(item.at)}</span></li>)}</ul></details></details></section>}
  {!workspace.ownerAccess&&<p className="mn-servicing-note">{merchant.merchant.displayName} manages funds, refunds and account settings.</p>}
 </MerchantShell>;
}

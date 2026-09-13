import type {DisputeProjection} from "@/modules/disputes/contracts";
import {MerchantDisputes} from "./merchant-disputes";
import Link from "next/link";
import type { MerchantWorkspaceProjection } from "@/modules/acquiring/contracts";
import type { MerchantOperationsProjection } from "@/modules/acquiring/operations-contracts";
import type { MerchantAccessOverview } from "@/modules/access/merchant-contracts";
import { SupportCases, type MerchantSupportContext } from "./cases";
import { MerchantShell, type MerchantTab } from "./merchant-shell";
import {MerchantStatusControl} from "./merchant-status";
import { MerchantChannels } from "./merchant-channels";
import { MerchantPeople } from "./merchant-people";
import { MerchantOperations } from "./merchant-operations";
import { EmptyState, StatusBadge } from "./primitives";
import { formatDate } from "./format-date";
import "./merchant-network.css";

export function MerchantWorkspace({workspace,tab,access,operations,support,disputes,overviewHref}:{workspace:MerchantWorkspaceProjection;tab:MerchantTab;access?:MerchantAccessOverview;operations?:MerchantOperationsProjection;support?:MerchantSupportContext;disputes?:DisputeProjection[];overviewHref?:string}) {
 const {merchant}=workspace;
 const directoryHref=overviewHref??`/merchant-services?section=merchants&view=${workspace.ownerAccess?`merchant:${merchant.merchant.serviceId}`:`unit:${merchant.id}`}`;
 const sectionHref=(section:MerchantTab)=>`/merchants/${merchant.id}?${new URLSearchParams({tab:section,returnTo:directoryHref})}`;
 const businessDetailsHref=workspace.setupHref?`${workspace.setupHref}?${new URLSearchParams({returnTo:directoryHref})}`:null;
 const delegatedView=!workspace.ownerAccess;
 const pageTitle={channels:"Channels",payments:"Payments",people:workspace.ownerAccess?"Team & terminals":"Your terminals",verification:"Terminal settings",disputes:"Disputes",help:"Contact support"}[tab];
 const relatedActions=(tab==="people"?[{tab:"channels",label:"View channels"},{tab:"payments",label:"View payments"}]:tab==="channels"?[{tab:"payments",label:"View payments"},...(workspace.canReadPeople?[{tab:"people",label:"Manage team access"}]:[])]:tab==="payments"?[{tab:"channels",label:"View channels"},{tab:"disputes",label:"View disputes"},{tab:"help",label:"Contact support"}]:tab==="disputes"?[{tab:"payments",label:"View payments"},{tab:"help",label:"Contact support"}]:tab==="help"?[{tab:"payments",label:"View payments"},{tab:"disputes",label:"View disputes"}]:[{tab:"channels",label:"View channels"},...(workspace.canReadPeople?[{tab:"people",label:"Manage team access"}]:[])]) as {tab:MerchantTab;label:string}[];

 const content=<>
  <Link className="mn-account-back" href={directoryHref}>← Back to merchant services</Link>
  <header className="mn-heading"><div><p className="consumer-eyebrow">ACCEPT PAYMENTS</p><h1>{pageTitle}</h1></div></header>
  <section className="mn-terminal-context" aria-label="Selected payment terminal"><div><p>{merchant.merchant.displayName}</p><h2>{merchant.displayName}</h2><p>{delegatedView?"You can use this terminal’s channels and manage its payments and customer questions.":"This terminal’s channels and invited people collect payments for your business."}</p><StatusBadge status={merchant.status}/></div><div className="mn-terminal-actions" role="group" aria-label="Related terminal tasks">{relatedActions.map(action=><Link key={action.tab} href={sectionHref(action.tab)}>{action.label}</Link>)}</div></section>

  {merchant.status!=="ACTIVE"&&<div className="mn-notice">New payments are stopped for this terminal. You can still review the history available to you.</div>}
  {tab==="disputes"?disputes?<MerchantDisputes disputes={disputes}/>:<EmptyState title="Disputes unavailable" description="Reload to check the latest access."/>:tab==="help"?support?<SupportCases context={support}/>:<EmptyState title="Support is unavailable" description="Reload this page to check your current access. Your saved questions have not changed."><Link href={sectionHref("help")}>Reload support</Link></EmptyState>:tab==="channels"?<><MerchantChannels key={merchant.id} initial={workspace} operations={operations}/></>:tab==="people"?access?<MerchantPeople key={merchant.id} initial={access}/>:<EmptyState title="We couldn’t load people" description="Your permissions may have changed. Reload this page or ask your account owner to review your access."/>:operations?<MerchantOperations key={`${merchant.id}:${tab}`} workspace={workspace} initial={operations} showAdministration={workspace.ownerAccess} section={tab==="verification"?"setup":"payments"}/>:<div className="mn-panel"><EmptyState title="Payment tools are unavailable" description="Check this terminal’s payment settings, then reload. Your saved records have not changed."/><Link href={sectionHref(tab)}>Reload payment tools</Link></div>}
  {delegatedView&&(tab==="verification"||tab==="payments")&&<div className="mn-servicing-note"><p>Payment settings, refunds and the payment balance are managed by <strong>{merchant.merchant.displayName}</strong>.</p></div>}
  {tab==="verification"&&<MerchantStatusControl key={merchant.id} initial={workspace}/>}
  {tab==="verification"&&<details className="mn-panel"><summary>Payment terminal details & history</summary><p>{merchant.merchant.displayName} is responsible for sales, fees, refunds and chargebacks. </p><dl className="mn-review"><div><dt>Payment terminal status</dt><dd><StatusBadge status={merchant.status}/></dd></div></dl>{businessDetailsHref&&<Link href={businessDetailsHref}>Review business details</Link>}<ul className="mn-list">{workspace.timeline.map(item=><li key={item.id}><strong>{item.label}</strong><span> · {formatDate(item.at)}</span></li>)}</ul></details>}
 </>;
 return <MerchantShell merchantId={merchant.id} showMoney={workspace.ownerAccess} showSettings={workspace.ownerAccess} overviewHref={directoryHref} activeSection={tab==="channels"?"channels":tab==="payments"||tab==="disputes"||tab==="help"?"activity":tab==="verification"?"settings":"merchants"}>{content}</MerchantShell>;
}

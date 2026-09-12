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

export function MerchantWorkspace({workspace,tab,access,operations,support,overviewHref}:{workspace:MerchantWorkspaceProjection;tab:MerchantTab;access?:MerchantAccessOverview;operations?:MerchantOperationsProjection;support?:MerchantSupportContext;overviewHref?:string}) {
 const {merchant}=workspace;
 const directoryHref=overviewHref??`/merchant-services?view=${workspace.primaryAccess?`network:${merchant.master.id}`:`unit:${merchant.id}`}`;
 const sectionHref=(section:MerchantTab)=>`/merchants/${merchant.id}?${new URLSearchParams({tab:section,returnTo:directoryHref})}`;
 const delegatedView=!workspace.primaryAccess;

 const content=<>
  <header className="mn-heading mn-workspace-heading"><div><p className="consumer-eyebrow">{workspace.primaryAccess?"YOU MANAGE THIS MERCHANT":"SHARED WITH YOU"}</p><h1>{merchant.displayName}</h1><p>{merchant.kind==="MASTER"?"Primary merchant":<>Submerchant of <strong>{merchant.master.displayName}</strong></>}{delegatedView?" · Only your shared records and tools are shown.":" · Collections and people, in one place."}</p><div className="mn-context"><StatusBadge status={merchant.status}/></div></div><div className="mn-workspace-heading-actions"><Link className="mn-back-link" href={directoryHref}>← Merchant overview</Link>{workspace.canCreateChannel&&tab!=="channels"&&tab!=="verification"&&<Link className="consumer-button consumer-button-primary" href={`${sectionHref("channels")}&new=1`}>Create payment channel</Link>}</div></header>


  {merchant.status!=="ACTIVE"&&<div className="mn-notice">New payments are stopped for this merchant. You can still review the history available to you.</div>}
  {tab==="help"?support?<SupportCases context={support}/>:<EmptyState title="Support is unavailable" description="Reload this page to check your current access. Your saved questions have not changed."><Link href={sectionHref("help")}>Reload support</Link></EmptyState>:tab==="channels"?<><MerchantChannels key={merchant.id} initial={workspace} operations={operations}/></>:tab==="people"?access?<MerchantPeople key={merchant.id} initial={access}/>:<EmptyState title="People access is unavailable" description="Your permissions may have changed. Reload this page or ask your primary merchant to review your access."/>:operations?<MerchantOperations key={`${merchant.id}:${tab}`} workspace={workspace} initial={operations} showAdministration={workspace.primaryAccess} section={tab==="verification"?"setup":"payments"}/>:<div className="mn-panel"><EmptyState title="Payment tools are unavailable" description="Review this merchant’s connection and reload. Your saved records remain available."/><Link href={sectionHref(tab)}>Reload payment tools</Link></div>}
  {delegatedView&&(tab==="verification"||tab==="payments")&&<div className="mn-servicing-note"><p>Payment setup, refunds and deposits are managed by <strong>{merchant.master.displayName}</strong>.</p></div>}
  {tab==="verification"&&<MerchantStatusControl key={merchant.id} initial={workspace}/>}
  {tab==="verification"&&<details className="mn-panel"><summary>Merchant details & history</summary><p>{merchant.master.displayName} is responsible for sales, fees, refunds and chargebacks. </p><dl className="mn-review"><div><dt>Merchant status</dt><dd><StatusBadge status={merchant.status}/></dd></div></dl>{workspace.setupHref&&<Link href={workspace.setupHref}>Review business details</Link>}<ul className="mn-list">{workspace.timeline.map(item=><li key={item.id}><strong>{item.label}</strong><span> · {formatDate(item.at)}</span></li>)}</ul></details>}
 </>;
 return <MerchantShell merchantId={merchant.id} name={merchant.displayName} kind={merchant.kind} tab={tab} showPeople={workspace.canReadPeople} overviewHref={directoryHref}>{content}</MerchantShell>;
}

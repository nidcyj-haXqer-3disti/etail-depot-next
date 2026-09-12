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
 const directoryHref=overviewHref??`/merchant-services?view=${workspace.ownerAccess?`merchant:${merchant.merchant.serviceId}`:`unit:${merchant.id}`}`;
 const sectionHref=(section:MerchantTab)=>`/merchants/${merchant.id}?${new URLSearchParams({tab:section,returnTo:directoryHref})}`;
 const delegatedView=!workspace.ownerAccess;

 const content=<>
  <header className="mn-heading mn-workspace-heading"><div><p className="consumer-eyebrow">PAYMENT TERMINAL</p><h1>{merchant.displayName}</h1><p>{merchant.merchant.displayName} · {delegatedView?"Your payment requests, received payments and customer disputes.":"You manage payments and access here."}</p><div className="mn-context"><StatusBadge status={merchant.status}/></div></div><div className="mn-workspace-heading-actions"><Link className="mn-back-link" href={directoryHref}>← All payment terminals</Link>{workspace.canCreateChannel&&tab!=="channels"&&tab!=="verification"&&<Link className="consumer-button consumer-button-primary" href={`${sectionHref("channels")}&new=1`}>Collect a payment</Link>}</div></header>


  {merchant.status!=="ACTIVE"&&<div className="mn-notice">New payments are stopped for this terminal. You can still review the history available to you.</div>}
  {tab==="disputes"?disputes?<MerchantDisputes disputes={disputes}/>:<EmptyState title="Disputes unavailable" description="Reload to check the latest access."/>:tab==="help"?support?<SupportCases context={support}/>:<EmptyState title="Support is unavailable" description="Reload this page to check your current access. Your saved questions have not changed."><Link href={sectionHref("help")}>Reload support</Link></EmptyState>:tab==="channels"?<><MerchantChannels key={merchant.id} initial={workspace} operations={operations}/></>:tab==="people"?access?<MerchantPeople key={merchant.id} initial={access}/>:<EmptyState title="We couldn’t load people" description="Your permissions may have changed. Reload this page or ask your account owner to review your access."/>:operations?<MerchantOperations key={`${merchant.id}:${tab}`} workspace={workspace} initial={operations} showAdministration={workspace.ownerAccess} section={tab==="verification"?"setup":"payments"}/>:<div className="mn-panel"><EmptyState title="Payment tools are unavailable" description="Check this terminal’s payment settings, then reload. Your saved records have not changed."/><Link href={sectionHref(tab)}>Reload payment tools</Link></div>}
  {delegatedView&&(tab==="verification"||tab==="payments")&&<div className="mn-servicing-note"><p>Payment settings, refunds and the payment balance are managed by <strong>{merchant.merchant.displayName}</strong>.</p></div>}
  {tab==="verification"&&<MerchantStatusControl key={merchant.id} initial={workspace}/>}
  {tab==="verification"&&<details className="mn-panel"><summary>Payment terminal details & history</summary><p>{merchant.merchant.displayName} is responsible for sales, fees, refunds and chargebacks. </p><dl className="mn-review"><div><dt>Payment terminal status</dt><dd><StatusBadge status={merchant.status}/></dd></div></dl>{workspace.setupHref&&<Link href={workspace.setupHref}>Review business details</Link>}<ul className="mn-list">{workspace.timeline.map(item=><li key={item.id}><strong>{item.label}</strong><span> · {formatDate(item.at)}</span></li>)}</ul></details>}
 </>;
 return <MerchantShell merchantId={merchant.id} name={merchant.displayName} tab={tab} showPeople={workspace.canReadPeople} showSettings={workspace.ownerAccess} overviewHref={directoryHref}>{content}</MerchantShell>;
}

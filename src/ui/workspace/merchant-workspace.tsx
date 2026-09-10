import Link from "next/link";
import type { MerchantWorkspaceProjection } from "@/modules/acquiring/contracts";
import type { MerchantOperationsProjection } from "@/modules/acquiring/operations-contracts";
import type { MerchantAccessOverview } from "@/modules/access/merchant-contracts";
import { MerchantShell, type MerchantTab } from "./merchant-shell";
import {MerchantStatusControl} from "./merchant-status";
import { MerchantChannels } from "./merchant-channels";
import { MerchantPeople } from "./merchant-people";
import { MerchantOperations } from "./merchant-operations";
import { EmptyState, StatusBadge } from "./primitives";
import { formatDate } from "./format-date";
import "./merchant-network.css";

export function MerchantWorkspace({workspace,tab,access,operations}:{workspace:MerchantWorkspaceProjection;tab:MerchantTab;access?:MerchantAccessOverview;operations?:MerchantOperationsProjection}) {
 const {merchant}=workspace;
 const directoryHref=`/merchant-services?view=${workspace.primaryAccess?`network:${merchant.master.id}`:`unit:${merchant.id}`}`;
 const sectionHref=(section:MerchantTab)=>`/merchants/${merchant.id}?tab=${section}`;
 const delegatedView=!workspace.primaryAccess;
 const Heading="h1";

 const content=<>
  <header className="mn-heading"><div><p className="consumer-eyebrow">{merchant.kind==="MASTER"?"PRIMARY MERCHANT":"SUBMERCHANT"}</p><Heading>{merchant.displayName}</Heading><p>{merchant.kind==="MASTER"?"Collections for this merchant.":<>Primary merchant: <strong>{merchant.master.displayName}</strong>.</>}</p><div className="mn-context"><StatusBadge status={merchant.status} label={undefined}/></div></div><Link className="consumer-button consumer-button-secondary" href={directoryHref}>Merchant overview</Link></header>

  {workspace.setupHref&&tab==="verification"&&<div className="mn-actions"><Link className="consumer-button consumer-button-secondary" href={workspace.setupHref}>Review business details</Link></div>}

  {merchant.status!=="ACTIVE"&&<div className="mn-notice">New payments are stopped for this merchant. You can still review the history available to you.</div>}
  {tab==="channels"?<><MerchantChannels key={merchant.id} initial={workspace}/></>:tab==="people"?access?<MerchantPeople key={merchant.id} initial={access}/>:<EmptyState title="People access is unavailable" description="Your permissions may have changed. Reload this page or ask your primary merchant to review your access."/>:operations?<MerchantOperations key={`${merchant.id}:${tab}`} workspace={workspace} initial={operations} showAdministration={workspace.primaryAccess} section={tab==="verification"?"setup":"payments"}/>:<div className="mn-panel"><EmptyState title="Payment tools are unavailable" description="Review this merchant’s connection and reload. Your saved records remain available."/><Link href={sectionHref(tab)}>Reload payment tools</Link></div>}
  {delegatedView&&(tab==="verification"||tab==="payments")&&<div className="mn-servicing-note"><p>Payment setup, refunds and transfers are managed by <strong>{merchant.master.displayName}</strong>.</p></div>}
  {tab==="verification"&&<MerchantStatusControl key={merchant.id} initial={workspace}/>}
  {tab==="verification"&&<details className="mn-panel"><summary>Merchant details & history</summary><p>{merchant.master.displayName} is responsible for sales, fees, refunds and chargebacks. </p><dl className="mn-review"><div><dt>Merchant status</dt><dd><StatusBadge status={merchant.status}/></dd></div><div><dt>Real payments</dt><dd>Not available in this sandbox</dd></div></dl>{workspace.setupHref&&<Link href={workspace.setupHref}>Review business details</Link>}<ul className="mn-list">{workspace.timeline.map(item=><li key={item.id}><strong>{item.label}</strong><span> · {formatDate(item.at)}</span></li>)}</ul></details>}
 </>;
 return <MerchantShell merchantId={merchant.id} name={merchant.displayName} kind={merchant.kind} sponsor={merchant.master.displayName} tab={tab} showPeople={workspace.canReadPeople} primaryAccess={workspace.primaryAccess}>{content}</MerchantShell>;
}

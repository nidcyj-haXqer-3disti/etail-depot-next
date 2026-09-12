import Link from "next/link";
import { Footer, Header } from "../shell";
import { WorkspaceIcon } from "./navigation";
import {MerchantNavigationBoundary} from "./merchant-navigation-state";
import {merchantActivityHref,type MerchantActivityQuery} from "@/shared/merchant-activity";
import "./merchant-network.css";
import "../services.css";

export type MerchantTab = "channels" | "payments" | "people" | "verification" | "help";
export function MerchantShell({ merchantId, name, kind, tab = "channels", showPeople = true, dashboardQuery, overviewHref, children }: {
 merchantId?: string; name?: string; kind?: "MASTER" | "SUB";
 tab?: MerchantTab; showPeople?: boolean; dashboardQuery?:MerchantActivityQuery; overviewHref?:string; children: React.ReactNode;
}) {
 const hierarchy=kind==="MASTER"?"Primary merchant":kind==="SUB"?"Submerchant":"Merchant";
 const overview=overviewHref??"/merchant-services";
 const unitHref=(next:MerchantTab)=>`/merchants/${merchantId}?${new URLSearchParams({tab:next,...(overviewHref?{returnTo:overviewHref}:{})})}`;
 const dashboardHref=(section:MerchantActivityQuery["section"])=>dashboardQuery?merchantActivityHref(dashboardQuery,{section,page:1}):`/merchant-services${section==="activity"?"":`?section=${section}`}`;
 return <MerchantNavigationBoundary><div className="mn-app"><Header authenticated/><div className="mn-frame"><aside className={`mn-sidebar${merchantId?" mn-sidebar-with-merchant":""}`}>
  <p className="consumer-eyebrow">MERCHANT SERVICES</p>
  {merchantId&&<Link href={overview} className="mn-directory-link"><span className="mn-shop-symbol"><WorkspaceIcon name="merchant"/></span><span><strong>{name}</strong><small>{hierarchy}</small></span><WorkspaceIcon name="chevron"/></Link>}
  <nav aria-label={merchantId?"Merchant navigation":"Merchant workspace views"}>
   <Link href={merchantId?overview:dashboardHref("activity")} aria-current={!merchantId&&(!dashboardQuery||dashboardQuery.section==="activity")?"page":undefined}><WorkspaceIcon name="overview"/>Overview</Link>
   {merchantId?([
    {id:"payments",label:"Payments",icon:"activity"},
    {id:"channels",label:"Collect payments",icon:"merchant"},
    {id:"people",label:"People",icon:"people"},
    {id:"verification",label:"Account services",icon:"shield"},
    {id:"help",label:"Help",icon:"help"},
   ] as const).filter(item=>item.id!=="people"||showPeople).map(item=><Link key={item.id} href={unitHref(item.id)} aria-current={tab===item.id?"page":undefined}><WorkspaceIcon name={item.icon}/>{item.label}</Link>):<>
    <Link href={dashboardHref("funds")} aria-current={dashboardQuery?.section==="funds"?"page":undefined}><WorkspaceIcon name="reports"/>Funds & deposits</Link>
    <Link href={dashboardHref("merchants")} aria-current={dashboardQuery?.section==="merchants"?"page":undefined}><WorkspaceIcon name="people"/>Merchants & people</Link>
   </>}
  </nav>
 </aside><main id="main-content" className="mn-main">{children}</main></div><Footer authenticated/></div></MerchantNavigationBoundary>;
}

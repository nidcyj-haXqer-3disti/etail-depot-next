import Link from "next/link";
import { Footer, Header } from "../shell";
import { WorkspaceIcon } from "./navigation";
import {MerchantNavigationBoundary,MerchantNavigation} from "./merchant-navigation-state";
import {merchantActivityHref,type MerchantActivityQuery} from "@/shared/merchant-activity";
import "./merchant-network.css";
import "../services.css";

export type MerchantTab = "channels" | "payments" | "people" | "verification" | "disputes" | "help";
export function MerchantShell({ merchantId, name, tab = "channels", showPeople = true, showMoney = false, showSettings = false, dashboardQuery, overviewHref, children }: {
 merchantId?: string; name?: string;
 tab?: MerchantTab; showPeople?: boolean; showMoney?:boolean; showSettings?:boolean; dashboardQuery?:MerchantActivityQuery; overviewHref?:string; children: React.ReactNode;
}) {
 const overview=overviewHref??"/merchant-services";
 const unitHref=(next:MerchantTab)=>`/merchants/${merchantId}?${new URLSearchParams({tab:next,...(overviewHref?{returnTo:overviewHref}:{})})}`;
 const dashboardHref=(section:MerchantActivityQuery["section"])=>dashboardQuery?merchantActivityHref(dashboardQuery,{section,page:1}):`/merchant-services${section==="activity"?"":`?section=${section}`}`;
 return <MerchantNavigationBoundary><div className="mn-app"><Header authenticated/><div className="mn-frame"><aside className={`mn-sidebar${merchantId?" mn-sidebar-with-merchant":""}`}>
  <p className="consumer-eyebrow">MERCHANT SERVICES</p>
  {merchantId&&<Link href={overview} className="mn-directory-link"><span className="mn-shop-symbol"><WorkspaceIcon name="merchant"/></span><span><strong>{name}</strong><small>Terminal</small></span><WorkspaceIcon name="chevron"/></Link>}
  <MerchantNavigation label={merchantId?"Merchant navigation":"Merchant workspace views"} activeKey={merchantId?`${merchantId}:${tab}`:dashboardQuery?.section??"activity"}>
   <Link href={merchantId?overview:dashboardHref("activity")} aria-current={!merchantId&&(!dashboardQuery||dashboardQuery.section==="activity")?"page":undefined}><WorkspaceIcon name="overview"/>Overview</Link>
   {merchantId?([
    {id:"payments",label:"Payments",icon:"activity"},
    {id:"channels",label:"Collect payments",icon:"merchant"},
    {id:"people",label:"People",icon:"people"},
    {id:"disputes",label:"Disputes",icon:"help"},
    {id:"verification",label:"Settings",icon:"shield"},
    {id:"help",label:"Help",icon:"help"},
   ] as const).filter(item=>(item.id!=="people"||showPeople)&&(item.id!=="verification"||showSettings)).map(item=><Link key={item.id} href={unitHref(item.id)} aria-current={tab===item.id?"page":undefined}><WorkspaceIcon name={item.icon}/>{item.label}</Link>):<>
    {showMoney&&<Link href={dashboardHref("funds")} aria-current={dashboardQuery?.section==="funds"?"page":undefined}><WorkspaceIcon name="reports"/>Merchant money</Link>}
    <Link href={dashboardHref("merchants")} aria-current={dashboardQuery?.section==="merchants"?"page":undefined}><WorkspaceIcon name="people"/>Terminals & people</Link>
   </>}
  </MerchantNavigation>
 </aside><main id="main-content" className="mn-main">{children}</main></div><Footer authenticated/></div></MerchantNavigationBoundary>;
}

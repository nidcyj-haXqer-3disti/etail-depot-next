import Link from "next/link";
import { Header } from "../shell";
import { WorkspaceIcon } from "./navigation";
import {MerchantNavigationBoundary,MerchantNavigation} from "./merchant-navigation-state";
import {merchantActivityHref,merchantActivityReturn,parseMerchantActivityFilters,type MerchantActivityQuery} from "@/shared/merchant-activity";
import "./merchant-network.css";
import "../services.css";

export type MerchantTab = "channels" | "payments" | "people" | "verification" | "disputes" | "help";

/** Account navigation stays stable when a terminal or its records are opened. */
export function MerchantShell({merchantId,showSettings=false,dashboardQuery,overviewHref,activeSection,children}:{merchantId?:string;showMoney?:boolean;showSettings?:boolean;dashboardQuery?:MerchantActivityQuery;overviewHref?:string;activeSection?:MerchantActivityQuery["section"];children:React.ReactNode}) {
 const back=merchantActivityReturn(overviewHref??null);
 const query=dashboardQuery??parseMerchantActivityFilters(back?new URL(back,"https://etail.invalid").searchParams:{});
 const requestedSection=activeSection??(merchantId?"merchants":query.section);
 const section=requestedSection==="funds"||requestedSection==="activity"?"overview":requestedSection==="channels"?"merchants":requestedSection;
 const href=(next:MerchantActivityQuery["section"])=>merchantActivityHref(query,{section:next});
 return <MerchantNavigationBoundary><div className="mn-app"><Header authenticated activeService="MERCHANT"/><div className="mn-frame"><aside className="mn-sidebar">
  <p className="consumer-eyebrow">ACCEPT PAYMENTS</p>
  <MerchantNavigation label="Merchant account navigation" activeKey={section}>
   {([
    {id:"overview",label:"Overview",icon:"overview"},
    {id:"merchants",label:"Terminals",icon:"merchant"},
    {id:"settings",label:"Account settings",icon:"settings"},
   ] as const).filter(item=>item.id!=="settings"||showSettings).map(item=><Link key={item.id} href={href(item.id)} aria-current={section===item.id?"page":undefined}><WorkspaceIcon name={item.icon}/>{item.label}</Link>)}
  </MerchantNavigation>
 </aside><main id="main-content" className="mn-main">{children}</main></div></div></MerchantNavigationBoundary>;
}

import Link from "next/link";
import { Footer, Header } from "../shell";
import { WorkspaceIcon } from "./navigation";
import {MerchantNavigationBoundary,MerchantNavigation} from "./merchant-navigation-state";
import {merchantActivityHref,merchantActivityReturn,merchantRecordHref,parseMerchantActivityFilters,type MerchantActivityQuery} from "@/shared/merchant-activity";
import "./merchant-network.css";
import "../services.css";

export type MerchantTab = "channels" | "payments" | "people" | "verification" | "disputes" | "help";

export function MerchantTerminalNavigation({merchantId,tab,showPeople,showSettings,returnTo}:{merchantId:string;tab:MerchantTab;showPeople:boolean;showSettings:boolean;returnTo:string}) {
 return <div className="mn-terminal-navigation"><MerchantNavigation label="Payment terminal navigation" activeKey={`${merchantId}:${tab}`}>
  {([
   {id:"channels",label:"Payment channels"},
   {id:"payments",label:"Payments"},
   {id:"people",label:"Team access"},
   {id:"disputes",label:"Disputes"},
   {id:"verification",label:"Terminal settings"},
   {id:"help",label:"Help"},
  ] as const).filter(item=>(item.id!=="people"||showPeople)&&(item.id!=="verification"||showSettings)).map(item=><Link key={item.id} href={merchantRecordHref(merchantId,{tab:item.id},returnTo)} aria-current={tab===item.id?"page":undefined}>{item.label}</Link>)}
 </MerchantNavigation></div>;
}

/** Account navigation stays stable when a terminal or its records are opened. */
export function MerchantShell({merchantId,showMoney=false,showSettings=false,dashboardQuery,overviewHref,children}:{merchantId?:string;showMoney?:boolean;showSettings?:boolean;dashboardQuery?:MerchantActivityQuery;overviewHref?:string;children:React.ReactNode}) {
 const back=merchantActivityReturn(overviewHref??null);
 const query=dashboardQuery??parseMerchantActivityFilters(back?new URL(back,"https://etail.invalid").searchParams:{});
 const section=merchantId?"merchants":query.section;
 const href=(next:MerchantActivityQuery["section"])=>merchantActivityHref(query,{section:next});
 return <MerchantNavigationBoundary><div className="mn-app"><Header authenticated activeService="MERCHANT"/><div className="mn-frame"><aside className="mn-sidebar">
  <p className="consumer-eyebrow">ACCEPT PAYMENTS</p>
  <MerchantNavigation label="Merchant account navigation" activeKey={section}>
   {([
    {id:"overview",label:"Account home",icon:"overview"},
    {id:"activity",label:"Payments",icon:"activity"},
    {id:"merchants",label:"Terminals",icon:"merchant"},
    {id:"funds",label:"Account balance",icon:"reports"},
    {id:"settings",label:"Account settings",icon:"settings"},
   ] as const).filter(item=>(item.id!=="funds"||showMoney)&&(item.id!=="settings"||showSettings)).map(item=><Link key={item.id} href={href(item.id)} aria-current={section===item.id?"page":undefined}><WorkspaceIcon name={item.icon}/>{item.label}</Link>)}
  </MerchantNavigation>
 </aside><main id="main-content" className="mn-main">{children}</main></div><Footer authenticated/></div></MerchantNavigationBoundary>;
}

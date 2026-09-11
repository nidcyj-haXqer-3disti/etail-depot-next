import {getSandboxOverview} from "@/modules/sandbox/service";
import {SandboxEntry} from "@/ui/sandbox-entry";
import { redirect } from "next/navigation";
import { getRequestSession } from "@/platform/http/context";
import { getMerchantDashboard } from "@/modules/acquiring/dashboard-service";
import { MerchantDashboard } from "@/ui/workspace/merchant-dashboard";
import { MerchantShell } from "@/ui/workspace/merchant-shell";
import { PageNotice } from "@/ui/shell";
import Link from "next/link";
import {SecurityError} from "@/platform/security/origin";
import type {MerchantActivityQueryInput} from "@/modules/acquiring/activity-contracts";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Merchant services"};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const session=await getRequestSession().catch(()=>undefined);
 if(session===undefined)return <PageNotice title="We couldn’t load your session"><p>Please try signing in again.</p></PageNotice>;
 if(!session)redirect("/login");
 const sandbox=await getSandboxOverview(session.personId);
 if(!sandbox.joined)return <MerchantShell><div className="page-heading"><p className="eyebrow">MERCHANT SERVICES</p><h1>More ways to get paid</h1><p>Start with your business. Bring your people in when you’re ready.</p></div><SandboxEntry initial={sandbox} service="merchant"/></MerchantShell>;
 const query:MerchantActivityQueryInput=await searchParams;
 let dashboard;
 try {dashboard=await getMerchantDashboard(session.personId,query);}catch(error){
  if(error instanceof SecurityError&&error.code==="INVALID_ACTIVITY_FILTER")return <MerchantShell><h1>Check your activity filters</h1><p>Use valid dates, with the end date on or after the start date, and one value for each filter.</p><Link href="/merchant-services">Clear filters and return to merchants</Link></MerchantShell>;
  dashboard=null;
 }
 if(!dashboard)return <PageNotice title="Merchant services couldn’t load" authenticated><p>Please retry. Your selected merchant and saved records have not changed.</p></PageNotice>;
 return <MerchantShell><MerchantDashboard initial={dashboard}/></MerchantShell>;
}

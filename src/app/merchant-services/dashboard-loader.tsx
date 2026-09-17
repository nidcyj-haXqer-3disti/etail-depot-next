import {resolveCustomerPage,customerLoginHref} from "../customer-route";
import {getSandboxOverview} from "@/modules/sandbox/service";
import {SandboxEntry} from "@/ui/sandbox-entry";
import { redirect,unstable_rethrow } from "next/navigation";
import { getRequestSession } from "@/platform/http/context";
import { getMerchantDashboard } from "@/modules/acquiring/dashboard-service";
import {getMoneyAccountOverview} from "@/modules/money/service";
import {getMerchantMoneyWorkspace} from "@/modules/acquiring/money-workspace";
import {getMerchantStatement} from "@/modules/acquiring/statement-service";
import {MerchantStatement} from "@/ui/workspace/merchant-statement";
import { MerchantDashboard, type MerchantMoneyHome } from "@/ui/workspace/merchant-dashboard";
import { MerchantShell } from "@/ui/workspace/merchant-shell";
import { PageNotice } from "@/ui/shell";
import Link from "next/link";
import {SecurityError} from "@/platform/security/origin";
import type {MerchantActivityQueryInput} from "@/modules/acquiring/activity-contracts";
export async function renderMerchantDashboard(searchParams:Promise<Record<string,string|string[]|undefined>>,pathname="/merchant-services"){
 const route=await resolveCustomerPage(pathname,searchParams);
 if(!route)return <PageNotice title="This payment view is unavailable"><p>Choose a payment view from your dashboard.</p><Link href="/merchant-services">Payment overview</Link></PageNotice>;
 const session=await getRequestSession().catch(()=>undefined);
 if(session===undefined)return <PageNotice title="We couldn’t load your session"><p>Please try signing in again.</p></PageNotice>;
 if(!session)redirect(customerLoginHref(route.href));
 const sandbox=await getSandboxOverview(session.personId);
 if(!sandbox.joined)return <MerchantShell><div className="page-heading"><p className="eyebrow">ACCEPT PAYMENTS</p><h1>More ways to get paid</h1><p>Start with your business. Bring your people in when you’re ready.</p></div><SandboxEntry initial={sandbox} service="merchant"/></MerchantShell>;
 const query:MerchantActivityQueryInput=route.query;
 let dashboard;
 try {dashboard=await getMerchantDashboard(session.personId,query);}catch(error){
  if(error instanceof SecurityError&&error.code==="INVALID_ACTIVITY_FILTER")return <MerchantShell><h1>Check your activity filters</h1><p>Use valid dates, with the end date on or after the start date, and one value for each filter.</p><Link href="/merchant-services">Clear filters and return to payments</Link></MerchantShell>;
  dashboard=null;
 }
 if(!dashboard)return <PageNotice title="We couldn’t load your payments" authenticated><p>Please reload this page. Your payments and saved records have not changed.</p></PageNotice>;
 const moneyHomes:MerchantMoneyHome[]=[];
 if(["overview","funds","activity"].includes(dashboard.activity.query.section)){
  const view=dashboard.views.find(view=>view.id===dashboard.activity.query.view);
  const units=dashboard.units.filter(unit=>view?.unitIds.includes(unit.id));
  const accounts=dashboard.moneyAccounts.filter(account=>account.merchantServiceIds.some(serviceId=>units.some(unit=>unit.ownerAccess&&unit.merchantServiceId===serviceId)));
  try{
   // Reuse current discovery and bound parallel reads; do not reload every
   // business's full dashboard for each individual money account.
   for(let offset=0;offset<accounts.length;offset+=4){
    const homes=await Promise.all(accounts.slice(offset,offset+4).map(async account=>{
     const overview=await getMoneyAccountOverview(session.personId,account.id);
     return getMerchantMoneyWorkspace(session.personId,overview,dashboard);
    }));
    moneyHomes.push(...homes);
   }
  }catch(error){
   unstable_rethrow(error);
   return <PageNotice title="This money account is unavailable" authenticated><p>Your current account access could not be confirmed. Return to merchant services to choose an available account.</p><Link href="/merchant-services">Back to merchant services</Link></PageNotice>;
  }
 }

 const statement=["overview","funds","activity"].includes(dashboard.activity.query.section)?await getMerchantStatement(session.personId,query).catch(error=>{unstable_rethrow(error);return null;}):null;
 return <MerchantShell dashboardQuery={dashboard.activity.query} showMoney={dashboard.moneyAccounts.length>0} showSettings={dashboard.merchants.some(merchant=>merchant.ownerAccess)}><MerchantDashboard initial={dashboard} moneyHomes={moneyHomes} statement={statement?<MerchantStatement statement={statement} scopeChoices={dashboard.units.length>1?dashboard.views.map(view=>({value:view.id,label:view.name})):[]}/>:undefined}/></MerchantShell>;
}

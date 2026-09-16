import Link from "next/link";
import {redirect,unstable_rethrow} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getMerchantBusinessDetails} from "@/modules/acquiring/service";
import {MerchantAccountSettings} from "@/ui/workspace/merchant-account-settings";
import {getMerchantPaymentSettings} from "@/modules/acquiring/operations-service";
import {MerchantShell} from "@/ui/workspace/merchant-shell";
import {PageNotice} from "@/ui/shell";
import {merchantActivityReturn,parseMerchantActivityFilters,merchantActivityHref} from "@/shared/merchant-activity";
import {resolveCustomerPage,customerLoginHref} from "../../../customer-route";
export const dynamic="force-dynamic";export const metadata={title:"Merchant account settings"};
export default async function Page({params,searchParams}:{params:Promise<{serviceId:string}>;searchParams:Promise<{returnTo?:string|string[]}>}){
 const {serviceId}=await params,route=await resolveCustomerPage(`/merchant-services/${serviceId}/settings`,searchParams);
 if(!route||route.query.returnTo!==undefined&&!merchantActivityReturn(route.query.returnTo))return <PageNotice title="Account settings are unavailable"><p>Choose an account from your payment dashboard.</p><Link href="/merchant-services/settings">Account settings</Link></PageNotice>;
 const session=await getRequestSession().catch(()=>undefined);
 if(session===undefined)return <PageNotice title="We couldn’t load your session"><p>Please retry.</p></PageNotice>;
 if(!session)redirect(customerLoginHref(route.href));
 const query=route.query;
 const result=await Promise.all([getMerchantBusinessDetails(session.personId,serviceId,"SERVICE"),getMerchantPaymentSettings(session.personId,serviceId)]).catch(error=>{unstable_rethrow(error);return null;});
 if(!result)return <PageNotice title="Account settings are unavailable" authenticated><p>Your current access does not show these business details.</p><Link href="/merchant-services">Back to merchant services</Link></PageNotice>;
 const [data,paymentSettings]=result;
 const returnTo=merchantActivityReturn(typeof query.returnTo==="string"?query.returnTo:null)??merchantActivityHref(parseMerchantActivityFilters({view:`merchant:${serviceId}`,section:"settings"}));
 return <MerchantShell showSettings activeSection="settings" overviewHref={returnTo}><div className="mas-route"><Link className="service-back" href={returnTo}>Back to account settings</Link><MerchantAccountSettings initial={paymentSettings} businessDetails={data} returnHref={returnTo}/></div></MerchantShell>;
}

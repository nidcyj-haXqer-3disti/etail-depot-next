import Link from "next/link";
import {redirect,unstable_rethrow} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getMerchantBusinessDetails} from "@/modules/acquiring/service";
import {MerchantBusinessDetails} from "@/ui/workspace/merchant-entry";
import {MerchantShell} from "@/ui/workspace/merchant-shell";
import {PageNotice} from "@/ui/shell";
import {merchantActivityReturn,parseMerchantActivityFilters,merchantActivityHref} from "@/shared/merchant-activity";
export const dynamic="force-dynamic";export const metadata={title:"Merchant account settings"};
export default async function Page({params,searchParams}:{params:Promise<{serviceId:string}>;searchParams:Promise<{returnTo?:string|string[]}>}){
 const session=await getRequestSession().catch(()=>undefined);
 if(session===undefined)return <PageNotice title="We couldn’t load your session"><p>Please retry.</p></PageNotice>;
 if(!session)redirect("/login");
 const {serviceId}=await params,query=await searchParams;
 const data=await getMerchantBusinessDetails(session.personId,serviceId,"SERVICE").catch(error=>{unstable_rethrow(error);return null;});
 if(!data)return <PageNotice title="Account settings are unavailable" authenticated><p>Your current access does not show these business details.</p><Link href="/merchant-services">Back to merchant services</Link></PageNotice>;
 const returnTo=merchantActivityReturn(typeof query.returnTo==="string"?query.returnTo:null)??merchantActivityHref(parseMerchantActivityFilters({view:`merchant:${serviceId}`,section:"settings"}));
 return <MerchantShell showSettings activeSection="settings" overviewHref={returnTo}><Link href={returnTo}>Back to account settings</Link><MerchantBusinessDetails initial={data} accountContext returnHref={returnTo}/></MerchantShell>;
}

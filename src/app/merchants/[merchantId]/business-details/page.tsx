import Link from "next/link";
import {redirect,unstable_rethrow} from "next/navigation";
import {z} from "zod";
import {getRequestSession} from "@/platform/http/context";
import {getMerchantBusinessDetails} from "@/modules/acquiring/service";
import {MerchantBusinessDetails} from "@/ui/workspace/merchant-entry";
import {MerchantShell} from "@/ui/workspace/merchant-shell";
import {PageNotice} from "@/ui/shell";
import {merchantActivityReturn,merchantRecordHref} from "@/shared/merchant-activity";
export const dynamic="force-dynamic";
export const metadata={title:"Business details"};
export default async function Page({params,searchParams}:{params:Promise<{merchantId:string}>;searchParams:Promise<{returnTo?:string|string[]}>}) {
 const session=await getRequestSession().catch(()=>undefined);
 if(session===undefined)return <PageNotice title="We couldn’t load your session"><p>Please retry.</p></PageNotice>;
 if(!session)redirect("/login");
 const data=await (async()=>{try {
  const {merchantId}=await params;if(!z.uuid().safeParse(merchantId).success)throw new Error("Invalid merchant");
  return await getMerchantBusinessDetails(session.personId,merchantId);
 }catch(error){unstable_rethrow(error);return null;} })();
 if(!data)return <PageNotice title="Business details are unavailable" authenticated><p>Check your business access or reload this page.</p><Link href="/merchant-services">Return to payment overview</Link></PageNotice>;
 const {merchantId}=data;
 const query=await searchParams;
 const returnTo=merchantActivityReturn(typeof query.returnTo==="string"?query.returnTo:null);
 const returnHref=merchantRecordHref(merchantId,{tab:"verification"},returnTo);
 return <MerchantShell merchantId={merchantId} showMoney={data.ownerAccess} showSettings={data.ownerAccess} overviewHref={returnTo??undefined}><Link href={returnHref}>Back to terminal settings</Link><MerchantBusinessDetails initial={data} returnHref={returnHref}/></MerchantShell>;
}

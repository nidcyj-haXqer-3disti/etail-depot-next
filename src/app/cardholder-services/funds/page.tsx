import Link from "next/link";
import {redirect,unstable_rethrow} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getCardholderDashboard} from "@/modules/workspace/dashboard-service";
import {getCardholderFunds,getCardholderFundingIntent} from "@/modules/workspace/service";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
import {CardholderFundsWorkspace} from "@/ui/cardholder-funds";
import {Shell,PageNotice} from "@/ui/shell";
export const dynamic="force-dynamic";
export const metadata={title:"Add money · Cardholder services"};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const session=await getRequestSession();if(!session)redirect("/login");
 const result=await(async()=>{try{const query=await searchParams;const dashboard=await getCardholderDashboard(session.personId);const service=typeof query.service==="string"?requireAcquiringRouteId(query.service):query.service===undefined?dashboard.primaryService?.id:null;if(!service)throw new Error("No primary group");const page=query.page===undefined?0:typeof query.page==="string"&&/^(0|[1-9][0-9]{0,4})$/.test(query.page)?Number(query.page):NaN;const funds=await getCardholderFunds(session.personId,service,page);const intent=query.review===undefined?null:typeof query.review==="string"?await getCardholderFundingIntent(session.personId,service,requireAcquiringRouteId(query.review)):null;if(query.review!==undefined&&!intent)throw new Error("Unavailable review");return {funds,intent,service};}catch(e){unstable_rethrow(e);return null;}})();
 if(!result)return <PageNotice authenticated title="We couldn’t open these funding details"><p>Only the primary cardholder can add money and manage the group’s limits.</p><Link href="/cardholder-services">Back to your cards</Link></PageNotice>;
 return <Shell authenticated><CardholderFundsWorkspace key={result.intent?.id??result.service} funds={result.funds} intent={result.intent}/></Shell>;

}

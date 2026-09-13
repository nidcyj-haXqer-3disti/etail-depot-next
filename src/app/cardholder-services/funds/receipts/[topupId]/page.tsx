import Link from "next/link";
import {redirect,unstable_rethrow} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getCardholderTopup,getCardholderFunds} from "@/modules/workspace/service";
import {requireAcquiringRouteId as id} from "@/modules/acquiring/routes";
import {Shell,PageNotice} from "@/ui/shell";
import {CardholderFundingReceipt} from "@/ui/cardholder-funds";
export const dynamic="force-dynamic";
export default async function Page({params,searchParams}:{params:Promise<{topupId:string}>;searchParams:Promise<{service?:string}>}){
 const session=await getRequestSession();if(!session)redirect("/login");
 const result=await(async()=>{try{
  const p=await params,q=await searchParams;
  const receipt=await getCardholderTopup(session.personId,id(q.service??""),id(p.topupId));
  const funds=await getCardholderFunds(session.personId,receipt.serviceId);
  return {receipt,funds:{serviceId:funds.serviceId,serviceName:funds.serviceName,moneyAccountId:funds.moneyAccountId}};
 }catch(e){unstable_rethrow(e);return null;}})();
 if(!result)return <PageNotice authenticated title="This receipt is unavailable"><Link href="/cardholder-services/funds">Back to account balance</Link></PageNotice>;
 return <Shell authenticated><CardholderFundingReceipt funds={result.funds} receipt={result.receipt}/></Shell>;
}

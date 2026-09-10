import {apiRoute,json,readJson} from "@/platform/http/context";
import {simulateMerchantPayment} from "@/modules/acquiring/operations-service";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
import {simulateMerchantPaymentSchema} from "@/modules/acquiring/operations-contracts";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{merchantId:string;channelId:string}>}) {
  return apiRoute(request,async session=>{
    const {merchantId,channelId}=await context.params;
    return json(await simulateMerchantPayment(session!.personId,requireAcquiringRouteId(merchantId),requireAcquiringRouteId(channelId),await readJson(request,simulateMerchantPaymentSchema)));
  },{authenticated:true});
}

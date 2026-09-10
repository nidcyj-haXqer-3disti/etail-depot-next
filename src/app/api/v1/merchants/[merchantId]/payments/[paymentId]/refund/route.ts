import {apiRoute,json,readJson} from "@/platform/http/context";
import {refundMerchantPayment} from "@/modules/acquiring/operations-service";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
import {refundMerchantPaymentSchema} from "@/modules/acquiring/operations-contracts";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{merchantId:string;paymentId:string}>}) {
  return apiRoute(request,async session=>{
    const {merchantId,paymentId}=await context.params;
    return json(await refundMerchantPayment(session!.personId,requireAcquiringRouteId(merchantId),requireAcquiringRouteId(paymentId),await readJson(request,refundMerchantPaymentSchema)));
  },{authenticated:true});
}

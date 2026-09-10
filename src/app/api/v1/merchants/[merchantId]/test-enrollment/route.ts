import {apiRoute,json,readJson} from "@/platform/http/context";
import {enrollTestMerchant} from "@/modules/acquiring/operations-service";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
import {enrollTestMerchantSchema} from "@/modules/acquiring/operations-contracts";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function PUT(request:Request,context:{params:Promise<{merchantId:string}>}) {
  return apiRoute(request,async session=>{
    const {merchantId}=await context.params;
    return json(await enrollTestMerchant(session!.personId,requireAcquiringRouteId(merchantId),await readJson(request,enrollTestMerchantSchema)));
  },{authenticated:true});
}

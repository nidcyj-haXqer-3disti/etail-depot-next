import {apiRoute,json,readJson} from "@/platform/http/context";
import {pauseMerchant} from "@/modules/acquiring/service";
import {pauseMerchantSchema} from "@/modules/acquiring/contracts";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{merchantId:string}>}) {
  return apiRoute(request,async session=>{
    const {merchantId}=await context.params;
    return json(await pauseMerchant(session!.personId,requireAcquiringRouteId(merchantId),await readJson(request,pauseMerchantSchema)));
  },{authenticated:true});
}

import {apiRoute,json} from "@/platform/http/context";
import {getMerchantNetwork} from "@/modules/acquiring/operations-service";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{merchantId:string}>}) {
  return apiRoute(request,async session=>{
    const {merchantId}=await context.params;
    return json(await getMerchantNetwork(session!.personId,requireAcquiringRouteId(merchantId)));
  },{authenticated:true});
}

import {apiRoute,json} from "@/platform/http/context";
import {getMerchantWorkspace} from "@/modules/acquiring/service";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{merchantId:string}>}) {
  return apiRoute(request,async session=>{
    const {merchantId}=await context.params;
    return json(await getMerchantWorkspace(session!.personId,requireAcquiringRouteId(merchantId)));
  },{authenticated:true});
}

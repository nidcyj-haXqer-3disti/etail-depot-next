import {apiRoute,json,readJson} from "@/platform/http/context";
import {createMerchantPayout} from "@/modules/acquiring/operations-service";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
import {merchantPayoutSchema} from "@/modules/acquiring/operations-contracts";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{merchantId:string}>}) {
  return apiRoute(request,async session=>{
    const {merchantId}=await context.params;
    return json(await createMerchantPayout(session!.personId,requireAcquiringRouteId(merchantId),await readJson(request,merchantPayoutSchema)));
  },{authenticated:true});
}

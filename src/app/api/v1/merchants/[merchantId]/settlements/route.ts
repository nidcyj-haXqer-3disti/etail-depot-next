import {apiRoute,json,readJson} from "@/platform/http/context";
import {createMerchantSettlement} from "@/modules/acquiring/operations-service";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
import {merchantSettlementSchema} from "@/modules/acquiring/operations-contracts";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{merchantId:string}>}) {
  return apiRoute(request,async session=>{
    const {merchantId}=await context.params;
    return json(await createMerchantSettlement(session!.personId,requireAcquiringRouteId(merchantId),await readJson(request,merchantSettlementSchema)));
  },{authenticated:true});
}

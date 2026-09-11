import {apiRoute,json} from "@/platform/http/context";
import {getCardholderTopup} from "@/modules/workspace/service";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{serviceId:string;topupId:string}>}){
 return apiRoute(request,async session=>{const {serviceId,topupId}=await context.params;return json(await getCardholderTopup(session!.personId,requireAcquiringRouteId(serviceId),requireAcquiringRouteId(topupId)));},{authenticated:true});
}

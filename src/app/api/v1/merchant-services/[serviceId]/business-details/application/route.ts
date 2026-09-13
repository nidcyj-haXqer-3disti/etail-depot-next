import {apiRoute,json,readJson} from "@/platform/http/context";
import {startMerchantAccountSetup} from "@/modules/acquiring/service";
import {startMerchantSetupSchema} from "@/modules/acquiring/contracts";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{serviceId:string}>}){
 return apiRoute(request,async session=>{const {serviceId}=await context.params;return json(await startMerchantAccountSetup(session!.personId,requireAcquiringRouteId(serviceId),await readJson(request,startMerchantSetupSchema)));},{authenticated:true});
}

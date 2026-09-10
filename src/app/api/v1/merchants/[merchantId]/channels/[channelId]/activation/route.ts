import {apiRoute,json,readJson} from "@/platform/http/context";
import {setChannelActivation} from "@/modules/acquiring/operations-service";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
import {channelActivationSchema} from "@/modules/acquiring/operations-contracts";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function PUT(request:Request,context:{params:Promise<{merchantId:string;channelId:string}>}) {
  return apiRoute(request,async session=>{
    const {merchantId,channelId}=await context.params;
    return json(await setChannelActivation(session!.personId,requireAcquiringRouteId(merchantId),requireAcquiringRouteId(channelId),await readJson(request,channelActivationSchema)));
  },{authenticated:true});
}

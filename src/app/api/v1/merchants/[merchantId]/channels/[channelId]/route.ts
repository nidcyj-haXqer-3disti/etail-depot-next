import {apiRoute,json,readJson} from "@/platform/http/context";
import {updateChannel} from "@/modules/acquiring/service";
import {updateChannelSchema} from "@/modules/acquiring/contracts";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function PATCH(request:Request,context:{params:Promise<{merchantId:string;channelId:string}>}) {
  return apiRoute(request,async session=>{
    const {merchantId,channelId}=await context.params;
    return json(await updateChannel(session!.personId,requireAcquiringRouteId(merchantId),requireAcquiringRouteId(channelId),await readJson(request,updateChannelSchema)));
  },{authenticated:true});
}

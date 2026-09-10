import {apiRoute,json,readJson} from "@/platform/http/context";
import {cancelChannel} from "@/modules/acquiring/service";
import {cancelChannelSchema} from "@/modules/acquiring/contracts";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{merchantId:string;channelId:string}>}) {
  return apiRoute(request,async session=>{
    const {merchantId,channelId}=await context.params;
    return json(await cancelChannel(session!.personId,requireAcquiringRouteId(merchantId),requireAcquiringRouteId(channelId),await readJson(request,cancelChannelSchema)));
  },{authenticated:true});
}

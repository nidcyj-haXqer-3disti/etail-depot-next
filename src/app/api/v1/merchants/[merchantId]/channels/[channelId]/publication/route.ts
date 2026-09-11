import {apiRoute,json,readJson} from "@/platform/http/context";
import {getGuestPublicationManagement,publishGuestChannel} from "@/modules/acquiring/guest-service";
import {publishGuestChannelSchema} from "@/modules/acquiring/guest-contracts";
import {requireNoGuestQuery,guestResponseHeaders} from "@/modules/acquiring/guest-routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
type Context={params:Promise<{merchantId:string;channelId:string}>};
export async function GET(request:Request,context:Context){return apiRoute(request,async session=>{requireNoGuestQuery(request);const {merchantId,channelId}=await context.params;return json(await getGuestPublicationManagement(session!.personId,merchantId,channelId),200,guestResponseHeaders);},{authenticated:true});}
export async function POST(request:Request,context:Context){return apiRoute(request,async session=>{requireNoGuestQuery(request);const {merchantId,channelId}=await context.params;return json(await publishGuestChannel(session!.personId,merchantId,channelId,await readJson(request,publishGuestChannelSchema)),200,guestResponseHeaders);},{authenticated:true});}

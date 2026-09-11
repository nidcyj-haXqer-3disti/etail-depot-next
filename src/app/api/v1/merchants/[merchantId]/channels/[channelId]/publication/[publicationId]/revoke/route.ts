import {apiRoute,json,readJson} from "@/platform/http/context";
import {revokeGuestPublication} from "@/modules/acquiring/guest-service";
import {revokeGuestPublicationSchema} from "@/modules/acquiring/guest-contracts";
import {requireNoGuestQuery,guestResponseHeaders} from "@/modules/acquiring/guest-routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{merchantId:string;channelId:string;publicationId:string}>}){return apiRoute(request,async session=>{requireNoGuestQuery(request);const {merchantId,channelId,publicationId}=await context.params;return json(await revokeGuestPublication(session!.personId,merchantId,channelId,publicationId,await readJson(request,revokeGuestPublicationSchema)),200,guestResponseHeaders);},{authenticated:true});}

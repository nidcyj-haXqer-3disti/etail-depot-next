import {apiRoute,json} from "@/platform/http/context";
import {getPublicGuestRequest} from "@/modules/acquiring/guest-service";
import {requireNoGuestQuery,guestResponseHeaders} from "@/modules/acquiring/guest-routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{publicationId:string}>}){return apiRoute(request,async()=>{requireNoGuestQuery(request);return json(await getPublicGuestRequest((await context.params).publicationId),200,guestResponseHeaders);});}

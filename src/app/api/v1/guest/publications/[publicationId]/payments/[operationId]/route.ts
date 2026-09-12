import {apiRoute,json} from "@/platform/http/context";
import {getNetworkCheckout} from "@/modules/acquiring/network-service";
import {requireNoGuestQuery,guestResponseHeaders} from "@/modules/acquiring/guest-routes";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{publicationId:string;operationId:string}>}){return apiRoute(request,async()=>{requireNoGuestQuery(request);const p=await context.params;return json(await getNetworkCheckout(request.headers.get("cookie"),p.publicationId,p.operationId),200,guestResponseHeaders);});}

import {apiRoute,json} from "@/platform/http/context";
import {getGuestOrder} from "@/modules/acquiring/guest-service";
import {requireNoGuestQuery,guestResponseHeaders} from "@/modules/acquiring/guest-routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{orderId:string}>}){return apiRoute(request,async()=>{requireNoGuestQuery(request);return json(await getGuestOrder(request.headers.get("cookie"),(await context.params).orderId),200,guestResponseHeaders);});}

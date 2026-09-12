import {apiRoute,json,readJson} from "@/platform/http/context";
import {startNetworkCheckout} from "@/modules/acquiring/network-service";
import {startNetworkCheckoutSchema} from "@/modules/acquiring/network-contracts";
import {requireNoGuestQuery,guestResponseHeaders} from "@/modules/acquiring/guest-routes";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{publicationId:string}>}){return apiRoute(request,async()=>{requireNoGuestQuery(request);return json(await startNetworkCheckout(request.headers.get("cookie"),(await context.params).publicationId,await readJson(request,startNetworkCheckoutSchema)),200,guestResponseHeaders);});}

import {apiRoute,json,readJson} from "@/platform/http/context";
import {prepareGuestAttempt} from "@/modules/acquiring/guest-service";
import {prepareGuestAttemptSchema} from "@/modules/acquiring/guest-contracts";
import {requireNoGuestQuery,guestResponseHeaders} from "@/modules/acquiring/guest-routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{orderId:string}>}){return apiRoute(request,async()=>{requireNoGuestQuery(request);return json(await prepareGuestAttempt(request.headers.get("cookie"),(await context.params).orderId,await readJson(request,prepareGuestAttemptSchema)),200,guestResponseHeaders);});}

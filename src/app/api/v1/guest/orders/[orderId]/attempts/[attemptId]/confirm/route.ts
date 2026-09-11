import {apiRoute,json,readJson} from "@/platform/http/context";
import {confirmGuestAttempt} from "@/modules/acquiring/guest-service";
import {emptyGuestSchema} from "@/modules/acquiring/guest-contracts";
import {requireNoGuestQuery,guestResponseHeaders} from "@/modules/acquiring/guest-routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{orderId:string;attemptId:string}>}){return apiRoute(request,async()=>{requireNoGuestQuery(request);await readJson(request,emptyGuestSchema);const {orderId,attemptId}=await context.params;return json(await confirmGuestAttempt(request.headers.get("cookie"),orderId,attemptId),200,guestResponseHeaders);});}

import {apiRoute,json,readJson} from "@/platform/http/context";
import {SecurityError} from "@/platform/security/origin";
import {processNetworkCheckout} from "@/modules/acquiring/network-service";
import {processNetworkCheckoutSchema} from "@/modules/acquiring/network-contracts";
import {requireNoGuestQuery,guestResponseHeaders} from "@/modules/acquiring/guest-routes";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{publicationId:string;operationId:string}>}){return apiRoute(request,async()=>{requireNoGuestQuery(request);const p=await context.params,input=await readJson(request,processNetworkCheckoutSchema);if(input.commandId.toLowerCase()!==p.operationId.toLowerCase())throw new SecurityError("IDEMPOTENCY_CONFLICT",409);return json(await processNetworkCheckout(request.headers.get("cookie"),p.publicationId,p.operationId),200,guestResponseHeaders);});}

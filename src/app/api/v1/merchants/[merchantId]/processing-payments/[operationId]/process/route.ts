import {apiRoute,json,readJson} from "@/platform/http/context";
import {SecurityError} from "@/platform/security/origin";
import {processMerchantNetworkCheckout} from "@/modules/acquiring/network-service";
import {processNetworkCheckoutSchema} from "@/modules/acquiring/network-contracts";
import {requireNoGuestQuery} from "@/modules/acquiring/guest-routes";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{merchantId:string;operationId:string}>}){return apiRoute(request,async session=>{requireNoGuestQuery(request);const p=await context.params,input=await readJson(request,processNetworkCheckoutSchema);if(input.commandId.toLowerCase()!==p.operationId.toLowerCase())throw new SecurityError("IDEMPOTENCY_CONFLICT",409);return json(await processMerchantNetworkCheckout(session!.personId,p.merchantId,p.operationId));},{authenticated:true});}

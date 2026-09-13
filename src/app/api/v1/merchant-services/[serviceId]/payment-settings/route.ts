import {apiRoute,json,readJson} from "@/platform/http/context";
import {SecurityError} from "@/platform/security/origin";
import {configureMerchantAccountGateway,getMerchantPaymentSettings} from "@/modules/acquiring/operations-service";
import {configureTestGatewaySchema} from "@/modules/acquiring/operations-contracts";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{serviceId:string}>}){return apiRoute(request,async session=>{if(new URL(request.url).searchParams.size)throw new SecurityError("INVALID_REQUEST",422);const {serviceId}=await context.params;return json(await getMerchantPaymentSettings(session!.personId,requireAcquiringRouteId(serviceId)));},{authenticated:true});}
export async function PUT(request:Request,context:{params:Promise<{serviceId:string}>}){return apiRoute(request,async session=>{if(new URL(request.url).searchParams.size)throw new SecurityError("INVALID_REQUEST",422);const {serviceId}=await context.params;return json(await configureMerchantAccountGateway(session!.personId,requireAcquiringRouteId(serviceId),await readJson(request,configureTestGatewaySchema)));},{authenticated:true});}

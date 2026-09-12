import {apiRoute,json} from "@/platform/http/context";
import {SecurityError} from "@/platform/security/origin";
import {cardholderFundsQuerySchema} from "@/modules/workspace/api-contracts";
import {getCardholderFunds} from "@/modules/workspace/service";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{serviceId:string}>}){
 return apiRoute(request,async session=>{const {serviceId}=await context.params;const params=new URL(request.url).searchParams;if([...params.keys()].some(key=>params.getAll(key).length!==1))throw new SecurityError("INVALID_REQUEST",422);const query=cardholderFundsQuerySchema.safeParse(Object.fromEntries(params));if(!query.success)throw new SecurityError("INVALID_REQUEST",422);const page=Number(query.data.page??"0");return json(await getCardholderFunds(session!.personId,requireAcquiringRouteId(serviceId),page));},{authenticated:true});
}

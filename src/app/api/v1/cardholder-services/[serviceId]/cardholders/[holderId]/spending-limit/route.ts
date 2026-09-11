import {apiRoute,json,readJson} from "@/platform/http/context";
import {getPersonSpending,setCardholderSpendingLimit} from "@/modules/workspace/service";
import {spendingLimitCommandSchema} from "@/modules/workspace/funding-contracts";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{serviceId:string;holderId:string}>}){
 return apiRoute(request,async session=>{const {serviceId,holderId}=await context.params;return json(await getPersonSpending(session!.personId,requireAcquiringRouteId(serviceId),requireAcquiringRouteId(holderId)));},{authenticated:true});
}
export async function PUT(request:Request,context:{params:Promise<{serviceId:string;holderId:string}>}){
 return apiRoute(request,async session=>{const {serviceId,holderId}=await context.params;return json(await setCardholderSpendingLimit(session!.personId,requireAcquiringRouteId(serviceId),requireAcquiringRouteId(holderId),await readJson(request,spendingLimitCommandSchema)));},{authenticated:true});
}

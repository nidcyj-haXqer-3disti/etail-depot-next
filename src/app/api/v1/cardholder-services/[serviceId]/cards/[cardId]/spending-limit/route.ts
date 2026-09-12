import {apiRoute,json,readJson} from "@/platform/http/context";
import {getCardSpending,setCardSpendingLimit} from "@/modules/workspace/service";
import {spendingLimitCommandSchema} from "@/modules/workspace/funding-contracts";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{serviceId:string;cardId:string}>}){
 return apiRoute(request,async session=>{const {serviceId,cardId}=await context.params;return json(await getCardSpending(session!.personId,requireAcquiringRouteId(serviceId),requireAcquiringRouteId(cardId)));},{authenticated:true});
}
export async function PUT(request:Request,context:{params:Promise<{serviceId:string;cardId:string}>}){
 return apiRoute(request,async session=>{const {serviceId,cardId}=await context.params;return json(await setCardSpendingLimit(session!.personId,requireAcquiringRouteId(serviceId),requireAcquiringRouteId(cardId),await readJson(request,spendingLimitCommandSchema)));},{authenticated:true});
}

import {apiRoute,json,readJson} from "@/platform/http/context";
import {purchaseCard} from "@/modules/workspace/service";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
import {cardPurchaseCommandSchema} from "@/modules/workspace/contracts";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{serviceId:string;cardId:string}>}) {
  return apiRoute(request,async session=>{
    const {serviceId,cardId}=await context.params;
    return json(await purchaseCard(session!.personId,requireAcquiringRouteId(serviceId),requireAcquiringRouteId(cardId),await readJson(request,cardPurchaseCommandSchema)));
  },{authenticated:true});
}

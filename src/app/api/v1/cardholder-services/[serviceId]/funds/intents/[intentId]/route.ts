import {apiRoute,json,readJson} from "@/platform/http/context";
import {z} from "zod";
import {getCardholderFundingIntent,confirmCardholderFunding} from "@/modules/workspace/service";
import {requireAcquiringRouteId as id} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
type Context={params:Promise<{serviceId:string;intentId:string}>};
export async function GET(request:Request,context:Context){return apiRoute(request,async session=>{const p=await context.params;return json(await getCardholderFundingIntent(session!.personId,id(p.serviceId),id(p.intentId)));},{authenticated:true});}
export async function POST(request:Request,context:Context){return apiRoute(request,async session=>{const p=await context.params;await readJson(request,z.object({}).strict());return json(await confirmCardholderFunding(session!.personId,id(p.serviceId),id(p.intentId)));},{authenticated:true});}

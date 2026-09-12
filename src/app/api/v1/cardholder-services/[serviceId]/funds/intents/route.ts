import {apiRoute,json,readJson} from "@/platform/http/context";
import {prepareCardholderFunding} from "@/modules/workspace/service";
import {topupCommandSchema} from "@/modules/workspace/funding-contracts";
import {requireAcquiringRouteId as id} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{serviceId:string}>}){return apiRoute(request,async session=>{const p=await context.params;return json(await prepareCardholderFunding(session!.personId,id(p.serviceId),await readJson(request,topupCommandSchema)));},{authenticated:true});}

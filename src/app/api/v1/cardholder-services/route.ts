import {apiRoute,json,readJson} from "@/platform/http/context";
import {SecurityError} from "@/platform/security/origin";
import {getCardholderDashboard} from "@/modules/workspace/dashboard-service";
import {cardholderDashboardQuerySchema} from "@/modules/workspace/api-contracts";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request){
 return apiRoute(request,async session=>{
  const params=new URL(request.url).searchParams;
  if([...params.keys()].some(key=>params.getAll(key).length!==1))throw new SecurityError("INVALID_REQUEST",422);
  const query=cardholderDashboardQuerySchema.safeParse(Object.fromEntries(params));
  if(!query.success)throw new SecurityError("INVALID_REQUEST",422);
  return json(await getCardholderDashboard(session!.personId,Number(query.data.page??"0"),{requestPage:Number(query.data.requestPage??"0"),requestStatus:query.data.requestStatus,requestSearch:query.data.requestSearch}));
 },{authenticated:true});
}

import {createCardholderService} from "@/modules/services/service";
import {createCardholderServiceSchema} from "@/modules/services/cardholder-contracts";
export async function POST(request:Request){return apiRoute(request,async session=>json(await createCardholderService(session!.personId,await readJson(request,createCardholderServiceSchema))),{authenticated:true});}

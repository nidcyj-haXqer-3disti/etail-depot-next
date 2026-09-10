import { apiRoute,json,readJson } from "@/platform/http/context";
import { membershipEstimateInputSchema } from "@/modules/membership/contracts";
import { estimateMembership } from "@/modules/membership/estimate";
export const runtime="nodejs";
export async function POST(request:Request) {return apiRoute(request,async()=>json(estimateMembership(await readJson(request,membershipEstimateInputSchema))),{authenticated:true});}

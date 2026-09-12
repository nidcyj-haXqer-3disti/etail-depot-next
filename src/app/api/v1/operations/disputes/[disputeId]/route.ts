import {apiRoute,json,readJson} from "@/platform/http/context";
import {reviewDisputeSchema} from "@/modules/disputes/contracts";
import {resolveMerchantDispute} from "@/modules/disputes/service";
export async function POST(request:Request,{params}:{params:Promise<{disputeId:string}>}){return apiRoute(request,async session=>json(await resolveMerchantDispute(session!.personId,(await params).disputeId,await readJson(request,reviewDisputeSchema))),{authenticated:true});}

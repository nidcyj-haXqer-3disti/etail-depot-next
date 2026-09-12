import {apiRoute,json,readJson} from "@/platform/http/context";
import {respondDisputeSchema} from "@/modules/disputes/contracts";
import {respondToTerminalDispute} from "@/modules/disputes/service";
export async function POST(request:Request,{params}:{params:Promise<{merchantId:string;disputeId:string}>}){return apiRoute(request,async session=>{const ids=await params;return json(await respondToTerminalDispute(session!.personId,ids.merchantId,ids.disputeId,await readJson(request,respondDisputeSchema)));},{authenticated:true});}

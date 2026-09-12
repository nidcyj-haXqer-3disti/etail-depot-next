import {apiRoute,json,readJson} from "@/platform/http/context";
import {openDisputeSchema} from "@/modules/disputes/contracts";
import {getPayerDispute,openPaymentDispute} from "@/modules/disputes/service";
export async function GET(request:Request,{params}:{params:Promise<{paymentId:string}>}){return apiRoute(request,async session=>json(await getPayerDispute(session!.personId,(await params).paymentId)),{authenticated:true});}
export async function POST(request:Request,{params}:{params:Promise<{paymentId:string}>}){return apiRoute(request,async session=>json(await openPaymentDispute(session!.personId,(await params).paymentId,await readJson(request,openDisputeSchema))),{authenticated:true});}

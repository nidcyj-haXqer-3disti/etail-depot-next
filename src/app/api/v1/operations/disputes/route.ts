import {apiRoute,json} from "@/platform/http/context";
import {getOperatorDisputes} from "@/modules/disputes/service";
export async function GET(request:Request){return apiRoute(request,async session=>json(await getOperatorDisputes(session!.personId)),{authenticated:true});}

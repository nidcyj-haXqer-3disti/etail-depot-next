import {apiRoute,json} from "@/platform/http/context";
import {listTerminalDisputes} from "@/modules/disputes/service";
export async function GET(request:Request,{params}:{params:Promise<{merchantId:string}>}){return apiRoute(request,async session=>json(await listTerminalDisputes(session!.personId,(await params).merchantId)),{authenticated:true});}

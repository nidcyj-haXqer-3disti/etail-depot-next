import {z} from "zod";
import {apiRoute,json,readJson} from "@/platform/http/context";
import {SecurityError} from "@/platform/security/origin";
import {createTerminal} from "@/modules/acquiring/service";
import {createTerminalSchema} from "@/modules/acquiring/contracts";
export async function POST(request:Request,{params}:{params:Promise<{merchantId:string}>}) {
 return apiRoute(request,async session=>{
  const id=z.uuid().safeParse((await params).merchantId);if(!id.success)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
  return json(await createTerminal(session!.personId,id.data,await readJson(request,createTerminalSchema)));
 },{authenticated:true});
}

import {apiRoute,json} from "@/platform/http/context";
import {findSandboxRecipient} from "@/modules/sandbox/service";
import {SecurityError} from "@/platform/security/origin";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request){return apiRoute(request,async session=>{
 const query=new URL(request.url).searchParams;if([...query.keys()].some(key=>query.getAll(key).length!==1))throw new SecurityError("RECIPIENT_UNAVAILABLE",404);
 return json(await findSandboxRecipient(session!.personId,Object.fromEntries(query)));
},{authenticated:true});}

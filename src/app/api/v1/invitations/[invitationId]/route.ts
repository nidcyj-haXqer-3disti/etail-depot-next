import {apiRoute,json} from "@/platform/http/context";
import {getResourceInvitation} from "@/modules/access/resource-service";
import {SecurityError} from "@/platform/security/origin";
import {z} from "zod";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{invitationId:string}>}){return apiRoute(request,async session=>{
 const {invitationId}=await context.params;if(!z.uuid().safeParse(invitationId).success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
 return json(await getResourceInvitation(session!.personId,invitationId));
},{authenticated:true});}

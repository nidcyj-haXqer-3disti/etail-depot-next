import {apiRoute,json,readJson} from "@/platform/http/context";
import {createCardInvitation} from "@/modules/access/service";
import {createCardInvitationSchema} from "@/modules/access/contracts";
import {SecurityError} from "@/platform/security/origin";
import {z} from "zod";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{serviceId:string;cardId:string}>}){return apiRoute(request,async session=>{
 const {serviceId,cardId}=await context.params;if(!z.uuid().safeParse(serviceId).success||!z.uuid().safeParse(cardId).success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
 return json(await createCardInvitation(session!.personId,serviceId,cardId,await readJson(request,createCardInvitationSchema)));
},{authenticated:true});}

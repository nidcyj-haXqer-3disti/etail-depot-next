import {apiRoute,json,readJson} from "@/platform/http/context";
import {createGuestOrder} from "@/modules/acquiring/guest-service";
import {createGuestOrderSchema} from "@/modules/acquiring/guest-contracts";
import {requireNoGuestQuery,guestResponseHeaders} from "@/modules/acquiring/guest-routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{publicationId:string}>}){return apiRoute(request,async()=>{requireNoGuestQuery(request);return json(await createGuestOrder(request.headers.get("cookie"),(await context.params).publicationId,await readJson(request,createGuestOrderSchema)),200,guestResponseHeaders);});}

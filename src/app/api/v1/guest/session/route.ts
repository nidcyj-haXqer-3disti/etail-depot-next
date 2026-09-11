import {apiRoute,json,readJson} from "@/platform/http/context";
import {ensureGuestSession} from "@/modules/acquiring/guest-service";
import {emptyGuestSchema} from "@/modules/acquiring/guest-contracts";
import {requireNoGuestQuery,guestResponseHeaders} from "@/modules/acquiring/guest-routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request){return apiRoute(request,async()=>{requireNoGuestQuery(request);await readJson(request,emptyGuestSchema);const result=await ensureGuestSession(request.headers.get("cookie"));const response=json({ready:true},200,guestResponseHeaders);if(result.setCookie)response.headers.set("Set-Cookie",result.setCookie);return response;});}

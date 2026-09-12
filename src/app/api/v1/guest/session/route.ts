import {z} from "zod";
import {apiRoute,json,readJson} from "@/platform/http/context";
import {ensureGuestSession} from "@/modules/acquiring/guest-service";
import {requireNoGuestQuery,guestResponseHeaders} from "@/modules/acquiring/guest-routes";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function POST(request:Request){return apiRoute(request,async()=>{requireNoGuestQuery(request);await readJson(request,z.object({}).strict());const {setCookie}=await ensureGuestSession(request.headers.get("cookie"));return json({ready:true},200,{...guestResponseHeaders,...(setCookie?{"Set-Cookie":setCookie}:{})});});}

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import type { z } from "zod";
import { SessionService, type SessionRecord } from "../../modules/identity";
import { sessionRepository } from "../database/session-repository";
import { getRuntimeConfig } from "../config";
import { assertSameOrigin, SecurityError } from "../security/origin";

export function getSessionService() { return new SessionService(sessionRepository,getRuntimeConfig()); }
export async function getRequestSession():Promise<SessionRecord|null> {
  const cookieHeader=(await headers()).get("cookie");
  return getSessionService().authenticate(cookieHeader);
}
export function json(body:unknown,status=200,headers?:HeadersInit) {
  const safeHeaders=new Headers(headers); safeHeaders.set("Cache-Control","private, no-store, max-age=0");safeHeaders.set("Vary","Cookie, Origin");
  return Response.json(body,{status,headers:safeHeaders});
}
export async function readJson<T>(request:Request,schema:z.ZodType<T>):Promise<T> {
  if(request.headers.get("content-type")?.split(";")[0]?.trim()!=="application/json") throw new SecurityError("JSON_CONTENT_TYPE_REQUIRED",415);
  const reader=request.body?.getReader();
  if(!reader) throw new SecurityError("INVALID_REQUEST",422);
  const chunks:Uint8Array[]=[];let length=0;
  try {
    for(;;) {const {done,value}=await reader.read();if(done) break;length+=value.length;if(length>8192) {await reader.cancel();throw new SecurityError("REQUEST_TOO_LARGE",413);}chunks.push(value);}
    const bytes=Buffer.concat(chunks);const result=schema.safeParse(JSON.parse(bytes.toString("utf8")));
    if(!result.success) throw new SecurityError("INVALID_REQUEST",422);return result.data;
  } catch(error) { if(error instanceof SecurityError) throw error;throw new SecurityError("INVALID_REQUEST",422); }
}
export async function apiRoute(request:Request,handler:(session:SessionRecord|null)=>Promise<Response>,options:{authenticated?:boolean}={}) {
  const requestId=randomUUID();
  try {
    const config=getRuntimeConfig();assertSameOrigin(request,config.publicOrigin);
    const session=options.authenticated?await getSessionService().authenticate(request.headers.get("cookie")):null;
    if(options.authenticated && !session) throw new SecurityError("AUTHENTICATION_REQUIRED",401);
    return await handler(session);
  } catch(error) {
    const known=error instanceof SecurityError;
    // Do not log request bodies, cookies, credentials, URLs or database errors.
    if(!known) console.error(JSON.stringify({requestId,code:"UNEXPECTED_SERVER_ERROR"}));
    return json({error:{code:known?error.code:"SERVICE_UNAVAILABLE",requestId}},known?error.status:503);
  }
}

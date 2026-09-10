import { apiRoute, json } from "@/platform/http/context";
import { listInvitationsForPerson } from "@/modules/access/service";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request) {
 return apiRoute(request,async session=>{
  return json(await listInvitationsForPerson(session!.personId));
 },{authenticated:true});
}

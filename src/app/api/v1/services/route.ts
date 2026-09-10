import { apiRoute, json } from "@/platform/http/context";
import { listServicesForPerson } from "@/modules/services/service";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request) {
  return apiRoute(request,async(session)=>json({services:await listServicesForPerson(session!.personId)}),{authenticated:true});
}

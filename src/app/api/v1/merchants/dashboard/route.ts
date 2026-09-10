import {apiRoute,json} from "@/platform/http/context";
import {getMerchantDashboard} from "@/modules/acquiring/dashboard-service";
export const dynamic="force-dynamic";
export async function GET(request:Request){return apiRoute(request,async session=>json(await getMerchantDashboard(session!.personId)),{authenticated:true});}

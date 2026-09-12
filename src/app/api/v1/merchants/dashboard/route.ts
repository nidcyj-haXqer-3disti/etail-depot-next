import {apiRoute,json} from "@/platform/http/context";
import {getMerchantDashboard} from "@/modules/acquiring/dashboard-service";
import {merchantActivityCsv} from "@/modules/acquiring/activity-service";
import {parseMerchantActivityApiQuery} from "@/modules/acquiring/activity-contracts";
export const dynamic="force-dynamic";
export async function GET(request:Request){return apiRoute(request,async session=>{
 const {filters,exporting}=parseMerchantActivityApiQuery(new URL(request.url).searchParams);
 const dashboard=await getMerchantDashboard(session!.personId,filters,{exportRows:exporting});
 if(!exporting)return json(dashboard);
 return new Response(merchantActivityCsv(dashboard.activity),{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":`attachment; filename="merchant-${dashboard.activity.query.activity}.csv"`,"Cache-Control":"private, no-store, max-age=0","Vary":"Cookie, Origin","X-Content-Type-Options":"nosniff"}});
},{authenticated:true});}

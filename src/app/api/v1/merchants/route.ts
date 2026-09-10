import {apiRoute,json,readJson} from "@/platform/http/context";
import {readMerchantDirectoryQuery} from "@/modules/acquiring/routes";
import {getMerchantDirectory} from "@/modules/acquiring/service";
import {createPrimaryMerchant} from "@/modules/services/create-merchant";
import {createMerchantServiceSchema} from "@/modules/services/merchant-contracts";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request) {
  return apiRoute(request,async session=>{
    readMerchantDirectoryQuery(new URL(request.url).searchParams);
    return json(await getMerchantDirectory(session!.personId));
  },{authenticated:true});
}
export async function POST(request:Request) {
  return apiRoute(request,async session=>{const {merchantId,status,nextHref}=await createPrimaryMerchant(session!.personId,await readJson(request,createMerchantServiceSchema));return json({merchantId,status,nextHref});},{authenticated:true});
}

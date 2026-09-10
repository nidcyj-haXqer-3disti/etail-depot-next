import {z} from "zod";
import {apiRoute,json,readJson} from "@/platform/http/context";
import {SecurityError} from "@/platform/security/origin";
import {createOwnedSubmerchant} from "@/modules/acquiring/service";
import {createSubmerchantSchema} from "@/modules/acquiring/contracts";
export async function POST(request:Request,{params}:{params:Promise<{merchantId:string}>}) {
 return apiRoute(request,async session=>{
  const id=z.uuid().safeParse((await params).merchantId);if(!id.success)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
  return json(await createOwnedSubmerchant(session!.personId,id.data,await readJson(request,createSubmerchantSchema)));
 },{authenticated:true});
}

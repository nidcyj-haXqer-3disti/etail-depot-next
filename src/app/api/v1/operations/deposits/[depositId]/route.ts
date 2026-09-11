import {z} from "zod";
import {apiRoute,json,readJson} from "@/platform/http/context";
import {processMerchantDeposit} from "@/modules/acquiring/operations-service";
export const runtime="nodejs";
export async function POST(request:Request,context:{params:Promise<{depositId:string}>}){return apiRoute(request,async session=>json(await processMerchantDeposit(session!.personId,(await context.params).depositId,await readJson(request,z.object({commandId:z.uuid(),outcome:z.enum(["COMPLETED","FAILED"])}).strict()))),{authenticated:true});}

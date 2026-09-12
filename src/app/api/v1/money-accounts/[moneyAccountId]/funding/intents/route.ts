import {apiRoute,json,readJson} from "@/platform/http/context";
import {prepareMoneyFunding} from "@/modules/money/service";
import {moneyCommandSchema} from "@/modules/money/contracts";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{moneyAccountId:string}>}){return apiRoute(request,async session=>json(await prepareMoneyFunding(session!.personId,(await context.params).moneyAccountId,await readJson(request,moneyCommandSchema))),{authenticated:true});}

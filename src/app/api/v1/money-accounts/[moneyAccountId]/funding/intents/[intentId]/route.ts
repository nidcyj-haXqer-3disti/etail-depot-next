import {z} from "zod";
import {apiRoute,json,readJson} from "@/platform/http/context";
import {getMoneyFundingIntent,confirmMoneyFunding} from "@/modules/money/service";
export const runtime="nodejs";
export const dynamic="force-dynamic";
type Context={params:Promise<{moneyAccountId:string;intentId:string}>};
export async function GET(request:Request,context:Context){return apiRoute(request,async session=>{const p=await context.params;return json(await getMoneyFundingIntent(session!.personId,p.moneyAccountId,p.intentId));},{authenticated:true});}
export async function POST(request:Request,context:Context){return apiRoute(request,async session=>{const p=await context.params;await readJson(request,z.object({}).strict());return json(await confirmMoneyFunding(session!.personId,p.moneyAccountId,p.intentId));},{authenticated:true});}

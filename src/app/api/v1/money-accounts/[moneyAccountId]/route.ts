import {apiRoute,json} from "@/platform/http/context";
import {getMoneyAccountOverview} from "@/modules/money/service";
import {moneyHistoryQuerySchema} from "@/modules/money/api-contracts";
import {SecurityError} from "@/platform/security/origin";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{moneyAccountId:string}>}){return apiRoute(request,async session=>{const params=new URL(request.url).searchParams;if([...params.keys()].some(key=>params.getAll(key).length!==1))throw new SecurityError("INVALID_REQUEST",422);const query=moneyHistoryQuerySchema.safeParse(Object.fromEntries(params));if(!query.success)throw new SecurityError("INVALID_REQUEST",422);return json(await getMoneyAccountOverview(session!.personId,(await context.params).moneyAccountId,Number(query.data.page??"0")));},{authenticated:true});}

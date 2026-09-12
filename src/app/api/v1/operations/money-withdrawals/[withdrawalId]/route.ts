import {apiRoute,json,readJson} from "@/platform/http/context";
import {processMoneyWithdrawal} from "@/modules/money/service";
import {processMoneyWithdrawalSchema} from "@/modules/money/contracts";
export const runtime="nodejs";
export async function POST(request:Request,context:{params:Promise<{withdrawalId:string}>}){return apiRoute(request,async session=>json(await processMoneyWithdrawal(session!.personId,(await context.params).withdrawalId,await readJson(request,processMoneyWithdrawalSchema))),{authenticated:true});}

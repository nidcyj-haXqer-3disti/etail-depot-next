import {apiRoute,json} from "@/platform/http/context";
import {listOwnedMoneyAccounts} from "@/modules/money/service";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request){return apiRoute(request,async session=>json(await listOwnedMoneyAccounts(session!.personId)),{authenticated:true});}

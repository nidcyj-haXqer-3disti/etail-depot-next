import {apiRoute,json,readJson} from "@/platform/http/context";
import {prepareCardCheckout} from "@/modules/acquiring/card-checkout-service";
import {prepareCardCheckoutSchema} from "@/modules/acquiring/card-checkout-contracts";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{publicationId:string}>}){return apiRoute(request,async session=>json(await prepareCardCheckout(session!.personId,(await context.params).publicationId,await readJson(request,prepareCardCheckoutSchema))),{authenticated:true});}

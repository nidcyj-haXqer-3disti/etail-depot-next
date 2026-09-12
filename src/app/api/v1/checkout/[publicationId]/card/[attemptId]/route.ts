import {z} from "zod";
import {apiRoute,json,readJson} from "@/platform/http/context";
import {getCardCheckoutReview,confirmCardCheckout} from "@/modules/acquiring/card-checkout-service";
export const runtime="nodejs";export const dynamic="force-dynamic";
type Context={params:Promise<{publicationId:string;attemptId:string}>};
export async function GET(request:Request,context:Context){return apiRoute(request,async session=>{const p=await context.params;return json(await getCardCheckoutReview(session!.personId,p.publicationId,p.attemptId));},{authenticated:true});}
export async function POST(request:Request,context:Context){return apiRoute(request,async session=>{const p=await context.params;await readJson(request,z.object({}).strict());return json(await confirmCardCheckout(session!.personId,p.publicationId,p.attemptId));},{authenticated:true});}

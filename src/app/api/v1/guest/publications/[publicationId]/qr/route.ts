import QRCode from "qrcode";
import {apiRoute} from "@/platform/http/context";
import {SecurityError} from "@/platform/security/origin";
import {getPublicGuestRequest} from "@/modules/acquiring/guest-service";
import {requireNoGuestQuery,guestResponseHeaders} from "@/modules/acquiring/guest-routes";

export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{publicationId:string}>}){
 return apiRoute(request,async()=>{
  requireNoGuestQuery(request);
  const offer=await getPublicGuestRequest((await context.params).publicationId);
  if(!offer.canStart)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  const png=await QRCode.toBuffer(offer.publication.publicHref,{type:"png",width:320,margin:4,errorCorrectionLevel:"M",color:{dark:"#173d6d",light:"#ffffff"}});
  return new Response(new Uint8Array(png),{headers:{...guestResponseHeaders,"Cache-Control":"private, no-store, max-age=0","Content-Type":"image/png","Content-Disposition":"inline; filename=etail-payment-qr.png","X-Content-Type-Options":"nosniff"}});
 });
}

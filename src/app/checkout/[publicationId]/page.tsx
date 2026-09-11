import {SecurityError} from "@/platform/security/origin";
import {getPublicGuestRequest} from "@/modules/acquiring/guest-service";
import {GuestOffer} from "@/ui/guest-checkout";
import {Shell} from "@/ui/shell";

export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Payment request",robots:{index:false,follow:false},referrer:"no-referrer" as const};
export default async function Page({params}:{params:Promise<{publicationId:string}>}){
 const result=await(async()=>{try{return {request:await getPublicGuestRequest((await params).publicationId),unavailable:false};}catch(error){return {request:null,unavailable:error instanceof SecurityError&&[403,404].includes(error.status)};}})();
 return <Shell>{result.request?<GuestOffer initial={result.request}/>:<div className="page-container notice-page"><h1>{result.unavailable?"This payment link isn’t available":"We couldn’t load this payment request"}</h1><p>{result.unavailable?"Check the link with the merchant. No payment has been submitted.":"Please reload this page to try again. No payment has been submitted."}</p></div>}</Shell>;
}

import {SecurityError} from "@/platform/security/origin";
import {getPublicGuestRequest} from "@/modules/acquiring/guest-service";
import {NetworkCheckout} from "@/ui/network-checkout";
import {z} from "zod";
import {headers} from "next/headers";
import {getNetworkCheckout,networkCapabilities} from "@/modules/acquiring/network-service";
import {Shell} from "@/ui/shell";

export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Payment request",robots:{index:false,follow:false},referrer:"no-referrer" as const};
export default async function Page({params,searchParams}:{params:Promise<{publicationId:string}>;searchParams:Promise<{payment?:string;instrument?:string}>}){
 const result=await(async()=>{try{return {request:await getPublicGuestRequest((await params).publicationId),unavailable:false};}catch(error){return {request:null,unavailable:error instanceof SecurityError&&[403,404].includes(error.status)};}})();
 const query=await searchParams,payment=query.payment;const resume=payment&&z.uuid().safeParse(payment).success&&networkCapabilities().instruments.some(v=>v.id===query.instrument)?{commandId:payment.toLowerCase(),instrumentId:query.instrument as "visa"|"mastercard"|"amex"|"discover"}:null;const saved=payment?await getNetworkCheckout((await headers()).get("cookie"),(await params).publicationId,payment).catch(()=>null):null;
 return <Shell>{result.request?<NetworkCheckout initial={result.request} capabilities={networkCapabilities()} saved={saved} resume={resume}/>:<div className="page-container notice-page"><h1>{result.unavailable?"This payment link isn’t available":"We couldn’t load this payment request"}</h1><p>{result.unavailable?"Check the link with the business.":"Reload to check this payment request."}</p></div>}</Shell>;
}

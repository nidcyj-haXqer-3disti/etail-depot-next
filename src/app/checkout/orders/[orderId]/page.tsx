import {headers} from "next/headers";
import {SecurityError} from "@/platform/security/origin";
import {getGuestOrder} from "@/modules/acquiring/guest-service";
import {GuestOrder} from "@/ui/guest-checkout";
import {Shell} from "@/ui/shell";

export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Your saved receipt",robots:{index:false,follow:false},referrer:"no-referrer" as const};
export default async function Page({params}:{params:Promise<{orderId:string}>}){
 const result=await(async()=>{try{return {order:await getGuestOrder((await headers()).get("cookie"),(await params).orderId),unavailable:false};}catch(error){return {order:null,unavailable:error instanceof SecurityError&&[401,403,404].includes(error.status)};}})();
 return <Shell>{result.order?<GuestOrder key={result.order.id} initial={result.order}/>:<div className="page-container notice-page"><h1>{result.unavailable?"This order isn’t available in this browser":"We couldn’t load your order"}</h1><p>{result.unavailable?"Use the browser where you started the order. Your receipt is private and no merchant sign-in is required.":"Reload this page to check your saved receipt."}</p></div>}</Shell>;
}

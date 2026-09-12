import Link from "next/link";
import {redirect,unstable_rethrow} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getCardCheckoutReview} from "@/modules/acquiring/card-checkout-service";
import {CardCheckout} from "@/ui/card-checkout";
import {Shell,PageNotice} from "@/ui/shell";
export const dynamic="force-dynamic";
export const metadata={title:"Saved payment",robots:{index:false,follow:false},referrer:"no-referrer" as const};
/** Historical saved reviews remain private. Every new customer payment starts at the network checkout. */
export default async function Page({params,searchParams}:{params:Promise<{publicationId:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const {publicationId}=await params,query=await searchParams;
 if(query.review===undefined)redirect(`/checkout/${encodeURIComponent(publicationId)}`);
 const session=await getRequestSession();
 if(!session){const review=typeof query.review==="string"&&/^[0-9a-f-]{36}$/i.test(query.review)?`?review=${query.review}`:"";redirect(`/login?next=${encodeURIComponent(`/checkout/${publicationId}/card${review}`)}`);}
 const result=await(async()=>{try{if(typeof query.review!=="string")return null;return await getCardCheckoutReview(session.personId,publicationId,query.review);}catch(error){unstable_rethrow(error);return null;}})();
 if(!result)return <PageNotice authenticated title="This saved payment is unavailable"><p>Check the original payment link or return to your cards.</p><Link href="/cardholder-services">Your cards</Link></PageNotice>;
 return <Shell authenticated><CardCheckout key={result.id} review={result}/></Shell>;
}

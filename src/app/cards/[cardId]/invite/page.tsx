import {redirect,notFound,unstable_rethrow} from "next/navigation";
import {z} from "zod";
import {getRequestSession} from "@/platform/http/context";
import {getCardInvitations} from "@/modules/access/service";
import {SecurityError} from "@/platform/security/origin";
import {customerLoginHref} from "../../../customer-route";
export const dynamic="force-dynamic";
export const metadata={title:"Invite a cardholder",robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{cardId:string}>}){
 const {cardId}=await params;if(!z.uuid().safeParse(cardId).success)notFound();
 const session=await getRequestSession();if(!session)redirect(customerLoginHref(`/cardholder-services/cards/${cardId.toLowerCase()}/invite`));
 await getCardInvitations(session.personId,cardId).catch(error=>{unstable_rethrow(error);if(error instanceof SecurityError&&[403,404].includes(error.status))notFound();throw error;});
 redirect(`/cardholder-services/cards/${cardId.toLowerCase()}/invite`);
}

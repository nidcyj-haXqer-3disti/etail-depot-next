import {redirect,notFound,unstable_rethrow} from "next/navigation";
import {z} from "zod";
import {getRequestSession} from "@/platform/http/context";
import {getCardInvitations} from "@/modules/access/service";
import {CardInvitationManager} from "@/ui/card-invitation-manager";
import {Shell} from "@/ui/shell";
import {SecurityError} from "@/platform/security/origin";
import "@/ui/workspace/workspace.css";
export const dynamic="force-dynamic";
export const metadata={title:"Invite a cardholder",robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{cardId:string}>}){
 const session=await getRequestSession();if(!session)redirect("/login");const {cardId}=await params;if(!z.uuid().safeParse(cardId).success)notFound();
 const data=await getCardInvitations(session.personId,cardId).catch(error=>{unstable_rethrow(error);if(error instanceof SecurityError&&[403,404].includes(error.status))notFound();throw error;});
 return <Shell authenticated><div className="page-container services-page"><CardInvitationManager key={cardId} initial={data}/></div></Shell>;
}

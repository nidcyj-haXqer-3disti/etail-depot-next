import {redirect} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {listInvitationsForPerson} from "@/modules/access/service";
import {InvitationsInbox} from "@/ui/workspace/invitations-inbox";
import {Shell} from "@/ui/shell";
import "@/ui/workspace/workspace.css";

export const dynamic="force-dynamic";
export const metadata={title:"Shared access"};
export default async function Page(){
 const session=await getRequestSession();if(!session)redirect("/login");
 const invitations=await listInvitationsForPerson(session.personId);
 return <Shell authenticated><section className="page-container services-page"><h1>Shared access</h1><p>Review access someone has offered you before joining their service.</p><InvitationsInbox invitations={invitations}/></section></Shell>;
}

import {redirect} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {listInvitationsForPerson} from "@/modules/access/service";
import {InvitationsInbox} from "@/ui/workspace/invitations-inbox";
import {Shell} from "@/ui/shell";
import "@/ui/workspace/workspace.css";

export const dynamic="force-dynamic";
export const metadata={title:"Invitations"};
export default async function Page(){
 const session=await getRequestSession();if(!session)redirect("/login");
 const invitations=await listInvitationsForPerson(session.personId);
 return <Shell authenticated><section className="page-container services-page"><div className="page-heading"><h1>Invitations</h1><p>Review access to cards and payment terminals shared with you.</p></div><InvitationsInbox invitations={invitations}/></section></Shell>;
}

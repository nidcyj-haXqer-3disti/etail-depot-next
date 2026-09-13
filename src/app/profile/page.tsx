import Link from "next/link";
import {redirect,unstable_rethrow} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getPersonalProfile} from "@/modules/identity/profile-service";
import {PersonalProfileWorkspace} from "@/ui/personal-profile";
import {Shell,PageNotice} from "@/ui/shell";
import "@/ui/services.css";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Your profile"};
export default async function Page(){
 const session=await getRequestSession();if(!session)redirect("/login");
 let profile:Awaited<ReturnType<typeof getPersonalProfile>>;
 try{profile=await getPersonalProfile(session);}
 catch(error){unstable_rethrow(error);return <PageNotice authenticated title="Your profile couldn’t load"><p>Please reload to see your profile.</p></PageNotice>;}
 return <Shell authenticated><section className="page-container services-page personal-profile-page"><Link className="service-back" href="/services">← Your dashboard</Link><div className="page-heading"><p className="consumer-eyebrow">PERSONAL DETAILS</p><h1>Your profile</h1><p>Your personal information, in one place.</p></div><PersonalProfileWorkspace key={profile.personId} initial={profile}/></section></Shell>;
}

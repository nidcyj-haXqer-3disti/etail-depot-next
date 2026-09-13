import Link from "next/link";
import {redirect,unstable_rethrow} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getSandboxOverview} from "@/modules/sandbox/service";
import {SandboxEntry} from "@/ui/sandbox-entry";
import {Shell,PageNotice} from "@/ui/shell";
import "@/ui/services.css";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Your profile"};
export default async function Page(){
 const session=await getRequestSession();if(!session)redirect("/login");
 let profile:Awaited<ReturnType<typeof getSandboxOverview>>;
 try{profile=await getSandboxOverview(session.personId);}
 catch(error){unstable_rethrow(error);return <PageNotice authenticated title="Your profile couldn’t load"><p>Please reload to see your profile.</p></PageNotice>;}
 return <Shell authenticated><section className="page-container services-page profile-page"><Link className="service-back" href="/services">← Your dashboard</Link><div className="page-heading"><p className="consumer-eyebrow">PERSONAL DETAILS</p><h1>Your profile</h1><p>Your personal information across both services.</p></div>{!profile.joined?<SandboxEntry initial={profile} profileOnly/>:<section className="profile-details" aria-label="Your details"><span className="profile-avatar" aria-hidden="true">{profile.displayName.slice(0,1).toUpperCase()}</span><div><dl><dt>Display name</dt><dd>{profile.displayName}</dd></dl><p>The name people see when you share cards or payment terminals.</p></div></section>}<section className="profile-security" aria-labelledby="profile-security-title"><div><h2 id="profile-security-title">Sign-in &amp; security</h2><p>Review your active sign-ins and manage access to your login.</p></div><Link className="consumer-button consumer-button-secondary" href="/security">Manage sign-ins</Link></section></section></Shell>;
}

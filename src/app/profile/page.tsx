import Link from "next/link";
import {redirect,unstable_rethrow} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getSandboxOverview} from "@/modules/sandbox/service";
import {hasOperatorAccess} from "@/modules/operations/service";
import {SandboxEntry} from "@/ui/sandbox-entry";
import {Shell,PageNotice} from "@/ui/shell";
import "@/ui/services.css";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Your profile"};
export default async function Page(){
 const session=await getRequestSession();if(!session)redirect("/login");
 let profile:Awaited<ReturnType<typeof getSandboxOverview>>,operator:boolean;
 try{[profile,operator]=await Promise.all([getSandboxOverview(session.personId),hasOperatorAccess(session.personId).catch(()=>false)]);}
 catch(error){unstable_rethrow(error);return <PageNotice authenticated title="Your profile couldn’t load"><p>Please reload to see your profile.</p></PageNotice>;}
 return <Shell authenticated><section className="page-container services-page"><Link className="service-back" href="/services">← Your dashboard</Link><div className="page-heading"><h1>Your profile</h1><p>The name people see when you share cards or payment tools.</p></div>{!profile.joined?<SandboxEntry initial={profile}/>:<section className="profile-details" aria-label="Your details"><span className="profile-avatar" aria-hidden="true">{profile.displayName.slice(0,1).toUpperCase()}</span><dl><dt>Your name</dt><dd>{profile.displayName}</dd></dl></section>}{operator&&<section className="services-help-tools"><h2>Customer care</h2><Link href="/operations">Open customer care</Link></section>}</section></Shell>;
}

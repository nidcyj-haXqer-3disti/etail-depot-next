import Link from "next/link";
import {redirect,unstable_rethrow} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getSandboxOverview} from "@/modules/sandbox/service";
import {listOwnedMoneyAccounts} from "@/modules/money/service";
import {SandboxEntry} from "@/ui/sandbox-entry";
import {Shell,PageNotice} from "@/ui/shell";
import "@/ui/services.css";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Your profile"};
export default async function Page(){
 const session=await getRequestSession();if(!session)redirect("/login");
 let profile:Awaited<ReturnType<typeof getSandboxOverview>>,accounts:Awaited<ReturnType<typeof listOwnedMoneyAccounts>>;
 try{[profile,accounts]=await Promise.all([getSandboxOverview(session.personId),listOwnedMoneyAccounts(session.personId)]);}
 catch(error){unstable_rethrow(error);return <PageNotice authenticated title="Your profile couldn’t load"><p>Please reload to see your profile.</p></PageNotice>;}
 return <Shell authenticated><section className="page-container services-page"><Link href="/services">← Your services</Link><div className="page-heading"><p className="eyebrow">{profile.displayName}</p><h1>Your profile</h1><p>One login. Your cards and terminals stay personal.</p></div>{profile.joined?<SandboxEntry initial={profile} showMemberCode/>:<SandboxEntry initial={profile}/>}<div className="services-account-tools"><section className="services-help-tools"><h2>Sign-in &amp; help</h2><Link href="/security">Sign-in &amp; security</Link><Link href="/help#access">Help with access</Link></section>{accounts.length>0&&<section className="services-help-tools"><h2>Accounts you own</h2><p>Only you manage these balances. Card and merchant money stay separate.</p>{accounts.map(account=><Link key={account.id} href={`/money-accounts/${account.id}`}>{account.serviceKind==="CARDHOLDER"?"Card money":"Merchant money"} · {account.displayName}</Link>)}</section>}</div></section></Shell>;
}

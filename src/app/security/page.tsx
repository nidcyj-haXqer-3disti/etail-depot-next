import Link from "next/link";
import { redirect, unstable_rethrow } from "next/navigation";
import { getRequestSession } from "@/platform/http/context";
import { SecurityError } from "@/platform/security/origin";
import { getActiveSessions } from "@/modules/identity/security";
import { Shell, PageNotice } from "@/ui/shell";
import { SecurityWorkspace } from "@/ui/workspace/security";
import { TaskSearch } from "@/ui/workspace/task-search";
import "@/ui/workspace/workspace.css";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata = { title: "Sign-in & security" };

export default async function Page() {
  const session = await getRequestSession().catch(() => undefined);
  if (session === undefined) return <PageNotice title="We couldn’t load your session"><p>Please try signing in again.</p></PageNotice>;
  if (!session) redirect("/login");
  const overview = await getActiveSessions(session).catch(error => {
    unstable_rethrow(error);
    if (error instanceof SecurityError && error.status === 401) redirect("/login");
    return null;
  });
  if (!overview) return <PageNotice title="Your sessions couldn’t load" authenticated><p>Please try again. No sessions were signed out.</p><Link href="/security">Reload security</Link></PageNotice>;
  return <Shell authenticated><div className="page-container security-page"><div className="security-page-heading"><div><Link className="service-back" href="/services">← Your services</Link><h1>Sign-in &amp; security</h1></div><TaskSearch/></div><SecurityWorkspace initial={overview}/></div></Shell>;
}

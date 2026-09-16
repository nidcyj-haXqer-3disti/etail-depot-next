"use client";

import { useState } from "react";
import type { SessionOverview } from "@/modules/identity/security-contracts";
import { Button, EmptyState, Feedback, WorkspaceDialog } from "./primitives";
import { WorkspaceIcon } from "./navigation";
import "./security.css";

function timestamp(value: string) { return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(value)) + " UTC"; }
export function SecurityWorkspace({initial}:{initial:SessionOverview}) {
  const [overview,setOverview] = useState(initial);
  const [selected,setSelected] = useState<string[]|null>(null);
  const [busy,setBusy] = useState(false);
  const [feedback,setFeedback] = useState<{kind:"success"|"error";message:string}|null>(null);
  async function refresh() {
    setBusy(true);setFeedback(null);
    try { const res=await fetch("/api/v1/auth/sessions",{cache:"no-store",credentials:"same-origin"}); if(!res.ok) throw new Error(res.status===401?"Your session ended. Sign in again to review your security.":"We couldn’t refresh your sessions. Please try again."); setOverview(await res.json() as SessionOverview); }
    catch(e) { setFeedback({kind:"error",message:e instanceof Error?e.message:"Your sign-ins could not be loaded."}); }
    finally { setBusy(false); }
  }
  async function revoke() {
    if(!selected||busy)return;setBusy(true);setFeedback(null);
    try {
      const res=await fetch("/api/v1/auth/sessions/revoke",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({familyIds:selected})});
      if(!res.ok)throw new Error(res.status===401?"Your session ended. Sign in again to review your security.":"We couldn’t confirm the sign-out. Retry to revoke the same selected sessions.");
      setOverview(await res.json() as SessionOverview);setSelected(null);setFeedback({kind:"success",message:"Selected sessions signed out. This session stays active."});
    }catch(e){setFeedback({kind:"error",message:e instanceof Error?e.message:"Sign-out could not be confirmed."});}finally{setBusy(false);}
  }
  const other=overview.sessions.filter(item=>!item.current);
  return <div className="security-workspace"><div className="ws-welcome"><div><p>Review where you’re signed in and sign out sessions you no longer need.</p></div><Button variant="secondary" busy={busy} onClick={()=>void refresh()}>Refresh sessions</Button></div>
    {feedback&&!selected&&<Feedback {...feedback}/>}
    <section className="security-summary"><WorkspaceIcon name="shield"/><div><h2>Your sign-in</h2><p>Signing out a session ends its access to both services.</p></div><span className="consumer-status consumer-status-good">{overview.sessions.length}{overview.moreAvailable?"+":""} active</span></section>
    <section className="ws-panel"><div className="ws-panel-heading"><div><h2>Active sign-ins</h2></div>{other.length>0&&<Button variant="secondary" disabled={busy} onClick={()=>{setFeedback(null);setSelected(other.map(item=>item.id));}}>{overview.moreAvailable?"Sign out other shown sessions":"Sign out other sessions"}</Button>}</div>
      <p className="ws-settings-note">Times are in UTC. Device names and locations are not collected, so identify sign-ins by their start time.</p>
      <div className="security-session-list">{overview.sessions.map((item,index)=><article className="security-session" key={item.id}><div className="security-device"><WorkspaceIcon name="shield"/></div><div><h3>{item.current?"This session":`Other sign-in ${index}`}</h3><dl><div><dt>Signed in</dt><dd>{timestamp(item.signedInAt)}</dd></div><div><dt>Expires</dt><dd>{timestamp(item.expiresAt)}</dd></div></dl></div>{item.current?<span className="consumer-status consumer-status-good">Current</span>:<Button variant="quiet" disabled={busy} aria-label={`Sign out session from ${timestamp(item.signedInAt)}`} onClick={()=>{setFeedback(null);setSelected([item.id]);}}>Sign out</Button>}</article>)}</div>
      {other.length===0&&<EmptyState title="Only this session is active" description="Other signed-out or expired sessions can no longer access your services."/>}
      {overview.moreAvailable&&<p className="ws-settings-note">Showing the newest 100 sessions. Refresh after signing out to review any remaining sessions.</p>}
    </section><section className="security-note"><WorkspaceIcon name="shield"/><div><h2>Sign-in options</h2><p>To reset your email sign-in password, choose Forgot your password? on the sign-in page. Two-step verification is not available yet.</p></div></section>
    <WorkspaceDialog open={!!selected} title="Sign out selected sessions?" serviceName="Your Etail sign-in" onClose={()=>{if(!busy){setSelected(null);setFeedback(null);}}} footer={<><Button variant="secondary" disabled={busy} onClick={()=>{setSelected(null);setFeedback(null);}}>Keep sessions</Button><Button variant="danger" busy={busy} onClick={()=>void revoke()}>Confirm sign-out</Button></>}>
      <p>This will end {selected?.length} other {selected?.length===1?"session":"sessions"} across your Etail services. Unsaved work in those browsers may be lost. You will remain signed in here.</p>{feedback&&<Feedback {...feedback}/>}
    </WorkspaceDialog>
  </div>;
}

"use client";

import { useRef, useState } from "react";
import {pendingCardLimits,confirmCardLimitSignOut} from "./pending-card-limit";
import {pendingNotificationPreferences,confirmNotificationPreferencesSignOut} from "./pending-notification-preferences";
import {pendingProfiles} from "./pending-profile";
import {Button,WorkspaceDialog} from "./workspace/primitives";

const requestTimeoutMs = 30_000;
const unconfirmedSignOut = "We could not confirm sign-out. Please try Sign out again.";

export function LogoutButton() {
  const [pending, setPending] = useState(false),[confirmLeave,setConfirmLeave]=useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  async function logout(leaveUnconfirmed=false) {
    if (inFlight.current) return;
    if((pendingCardLimits.hasPending()||pendingNotificationPreferences.hasPending()||pendingProfiles.hasPending())&&!leaveUnconfirmed){setConfirmLeave(true);return;}
    confirmCardLimitSignOut(leaveUnconfirmed);
    confirmNotificationPreferencesSignOut(leaveUnconfirmed);
    inFlight.current = true;
    setPending(true);
    setError("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), requestTimeoutMs);
    let navigating = false;
    try {
      const response = await fetch("/api/v1/auth/logout", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}), signal: controller.signal });
      // The canonical route also returns this acknowledgement for an already absent
      // session. Other responses, including 401, do not confirm this browser's logout.
      if (!response.ok) { setError(unconfirmedSignOut); return; }
      const result: unknown = await response.json().catch(() => null);
      if (!result || typeof result !== "object" || !("signedOut" in result) || result.signedOut !== true) { setError(unconfirmedSignOut); return; }
      // Start a new document only after the server confirms revocation and cookie clearing.
      pendingCardLimits.clearAfterSignOut();
      pendingNotificationPreferences.clearAfterSignOut();pendingProfiles.clearAfterSignOut();
      window.location.replace("/login");
      navigating = true;
    } catch {
      setError(controller.signal.aborted ? "Sign-out is taking longer than expected. We could not confirm it. Please try Sign out again." : "We could not confirm sign-out. Check your connection and try again.");
    } finally {
      window.clearTimeout(timeout);
      if (!navigating) { confirmCardLimitSignOut(false);confirmNotificationPreferencesSignOut(false);inFlight.current = false; setPending(false); }
    }
  }
  return <div className="logout-control" onKeyDownCapture={event=>{if(confirmLeave&&event.key==="Escape"){event.preventDefault();event.stopPropagation();if(!pending)setConfirmLeave(false);}}}><button className="text-button" type="button" onClick={()=>void logout()} disabled={pending}>{pending ? "Signing out…" : "Sign out"}</button>{error && !confirmLeave&&<p className="header-error" role="alert">{error}</p>}{confirmLeave&&<WorkspaceDialog open onClose={()=>{if(!pending)setConfirmLeave(false);}} title={pendingCardLimits.hasPending()?"Sign out with an unconfirmed card change?":"Sign out with unconfirmed changes?"} serviceName="Your login"><p>{pendingCardLimits.hasPending()?"A card limit change has not been confirmed. It may already have been saved.":"A profile or notification change has not been confirmed. It may already have been saved."}</p><p>Stay signed in to check it. Signing out ends this tab’s saved retry; it does not cancel or undo the change.</p>{error&&<p className="header-error" role="alert">{error}</p>}<div className="consumer-action-row"><Button variant="secondary" disabled={pending} onClick={()=>setConfirmLeave(false)}>Stay signed in</Button><Button busy={pending} onClick={()=>void logout(true)}>Sign out anyway</Button></div></WorkspaceDialog>}</div>;
}

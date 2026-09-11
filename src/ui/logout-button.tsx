"use client";

import { useRef, useState } from "react";

const requestTimeoutMs = 30_000;
const unconfirmedSignOut = "We could not confirm sign-out. Please try Sign out again.";

export function LogoutButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  async function logout() {
    if (inFlight.current) return;
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
      window.location.replace("/login");
      navigating = true;
    } catch {
      setError(controller.signal.aborted ? "Sign-out is taking longer than expected. We could not confirm it. Please try Sign out again." : "We could not confirm sign-out. Check your connection and try again.");
    } finally {
      window.clearTimeout(timeout);
      if (!navigating) { inFlight.current = false; setPending(false); }
    }
  }
  return <div className="logout-control"><button className="text-button" type="button" onClick={logout} disabled={pending}>{pending ? "Signing out…" : "Sign out"}</button>{error && <p className="header-error" role="alert">{error}</p>}</div>;
}

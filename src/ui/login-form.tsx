"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./icon";
import { requestFailure } from "./api-feedback";

export function LoginForm({ localFixtureIdentity, hostedIdentityReady }: { localFixtureIdentity: boolean; hostedIdentityReady: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  async function submit(path: string, body: Record<string, string>, operation: string) {
    setPending(operation);
    setError("");
    try {
      const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(body) });
      if (!response.ok) { setError(requestFailure(response.status, "We could not sign you in. Check your details and try again.")); return; }
      router.replace("/services");
      router.refresh();
    } catch { setError("We could not connect. Check your connection and try again."); }
    finally { setPending(null); }
  }

  const showEmailSignIn = hostedIdentityReady || !localFixtureIdentity;
  return <div className="login-forms">
    {error && <div className="error-message" role="alert" tabIndex={-1} ref={errorRef}>{error}</div>}
    {showEmailSignIn && <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); void submit("/api/v1/auth/login", { email: String(data.get("email") ?? "").trim(), password: String(data.get("password") ?? "") }, "login"); }}>
      <div className="field"><label htmlFor="email">Email address</label><input type="email" name="email" id="email" autoComplete="email" inputMode="email" required disabled={pending !== null || !hostedIdentityReady} placeholder="you@example.com" /></div>
      <div className="field"><label htmlFor="password">Password</label><input type="password" name="password" id="password" autoComplete="current-password" required disabled={pending !== null || !hostedIdentityReady} /></div>
      {!hostedIdentityReady && <p className="form-note" id="identity-readiness"><Icon name="info" />Email sign-in is not available yet.</p>}
      <button type="submit" className="button primary full-width" disabled={pending !== null || !hostedIdentityReady} aria-describedby={!hostedIdentityReady ? "identity-readiness" : undefined}>{pending === "login" ? "Signing in…" : "Sign in"}<Icon name="arrow" /></button>
    </form>}
    {localFixtureIdentity && <section className="fixture-panel" aria-labelledby="local-session-title">
      <span className="local-label">Sandbox</span><h2 id="local-session-title">Explore the sandbox</h2><p>Choose a role to explore cards and payments with demo data.</p>
      <div className="fixture-actions">
        <button type="button" className="button primary full-width" disabled={pending !== null} onClick={() => void submit("/api/v1/auth/local-fixture", { persona: "owner" }, "owner")}>{pending === "owner" ? "Opening…" : "Continue as primary user"}<Icon name="arrow" /></button>
        <p className="form-note">Manage your cardholders and merchants.</p>
        <button type="button" className="button secondary full-width" disabled={pending !== null} onClick={() => void submit("/api/v1/auth/local-fixture", { persona: "viewer" }, "viewer")}>{pending === "viewer" ? "Opening…" : "Continue as secondary user"}<Icon name="arrow" /></button>
        <p className="form-note">See only your cards and shared merchant tools.</p>
        <button type="button" className="button secondary full-width" disabled={pending !== null} onClick={() => void submit("/api/v1/auth/local-fixture", { persona: "operator" }, "operator")}>{pending === "operator" ? "Opening…" : "Continue as support operator"}<Icon name="arrow" /></button>
        <p className="form-note">Review and answer assigned customer questions.</p>
      </div>
    </section>}
    {!localFixtureIdentity && <p className="form-footnote">Creating a login and recovering access are not available yet.</p>}
  </div>;
}

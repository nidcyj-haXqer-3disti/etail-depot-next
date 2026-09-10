"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Feedback } from "./workspace/primitives";

export function CardholderEnrollment() {
  const router = useRouter();
  const [attempt, setAttempt] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [signInRequired, setSignInRequired] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const mounted = useRef(true);
  const inFlight = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function enroll() {
    if (busy || inFlight.current || signInRequired || unavailable) return;
    inFlight.current = true;
    const commandId = attempt ?? crypto.randomUUID();
    setAttempt(commandId); setBusy(true); setError("");
    try {
      const response = await fetch("/api/v1/cardholder-services", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ commandId }) });
      if (!response.ok) {
        const code = (await response.json().catch(() => null))?.error?.code;
        if (!mounted.current) return;
        if (response.status === 401) { setSignInRequired(true); throw new Error("Your sign-in expired. Sign in again before continuing setup."); }
        if (response.status === 403) { setUnavailable(true); throw new Error(code === "MERCHANT_APPLICANT_REQUIRED" ? "This demo user cannot start a primary cardholder service. Cards already assigned to you are unchanged." : "Cardholder setup is not available for your current access."); }
        if (code === "CARDHOLDER_SERVICE_EXISTS") { router.refresh(); return; }
        throw new Error(response.status === 401 ? "Please sign in again to continue." : "We couldn’t confirm your cardholder setup. Try again to safely check this request.");
      }
      if (mounted.current) { setAttempt(null); router.refresh(); }
    } catch (caught) { if (mounted.current) setError(caught instanceof Error ? caught.message : "Please try again."); }
    finally { inFlight.current = false; if (mounted.current) setBusy(false); }
  }
  return <section className="ch-enrollment"><h2>Start your own card group</h2><p>Become the primary cardholder, add your cards and invite secondary cardholders. Cards assigned to you by someone else stay separate.</p><Feedback kind="error" message={error}/>{signInRequired ? <Link href="/login">Sign in to continue setup</Link> : <Button busy={busy} disabled={unavailable} onClick={enroll}>Set up cardholder services</Button>}</section>;
}

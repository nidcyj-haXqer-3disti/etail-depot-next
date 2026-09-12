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
        if (response.status === 403) { setUnavailable(true); throw new Error("You can’t open a card account right now. Any cards you already use are unchanged."); }
        if (code === "CARDHOLDER_SERVICE_EXISTS") { router.push("/cardholder-services"); router.refresh(); return; }
        throw new Error("We couldn’t confirm your card account setup. Try again to safely check this request.");
      }
      const saved=await response.json();
      if(saved?.kind!=="CARDHOLDER"||typeof saved.serviceId!=="string"||! /^[0-9a-f-]{36}$/.test(saved.serviceId))throw new Error("We couldn’t verify your card account setup. Retry the saved request.");
      if (mounted.current) { setAttempt(null); router.push("/cardholder-services"); router.refresh(); }
    } catch (caught) { if (mounted.current) setError(caught instanceof Error ? caught.message : "Please try again."); }
    finally { inFlight.current = false; if (mounted.current) setBusy(false); }
  }
  return <section className="ch-enrollment"><p className="consumer-eyebrow">YOUR CARDS, YOUR CONTROL</p><h2>Cards for you and your people.</h2><p>Open a card account. Add money for all its cards, invite people and set a total spending limit for each card. You can manage the account without having a card yourself.</p><Feedback kind="error" message={error}/>{signInRequired ? <Link href="/login">Sign in to continue setup</Link> : <Button busy={busy} disabled={unavailable} onClick={enroll}>Open a card account</Button>}<p className="consumer-form-footnote">You choose who gets a card and how much it can spend. Limits stay in place until you change them.</p></section>;
}

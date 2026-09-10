import type { Metadata } from "next";
import { getRuntimeConfig } from "@/platform/config";
import { LoginForm } from "@/ui/login-form";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  let localFixtureIdentity = false;
  let hostedIdentityReady = false;
  try {
    const config = getRuntimeConfig();
    localFixtureIdentity = config.localFixtureIdentity;
    hostedIdentityReady = config.hostedIdentityReady;
  } catch { /* Invalid runtime configuration leaves every sign-in option unavailable. */ }
  return <Shell><div className="login-layout page-container"><section className="login-introduction"><p className="eyebrow">Welcome to Etail Depot</p><h1>A place for<br /><span>your next step.</span></h1><p>Sign in, then choose Cardholder services or Merchant services.</p><div className="login-reassurance"><Icon name="lock" /><div><h2>Access is personal to you.</h2><p>See your cards and the merchant tools you’ve been given access to.</p></div></div></section><section className="login-panel" aria-labelledby="sign-in-title"><p className="overline">Your services</p><h2 id="sign-in-title">Sign in</h2><p className="muted">Continue to your services.</p><LoginForm localFixtureIdentity={localFixtureIdentity} hostedIdentityReady={hostedIdentityReady} /></section></div></Shell>;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestFailure } from "./api-feedback";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function logout() {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/v1/auth/logout", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      if (!response.ok) { setError(requestFailure(response.status, "Sign-out did not finish. Please try again.")); return; }
      router.replace("/login");
      router.refresh();
    } catch { setError("We could not connect to sign you out. Check your connection and try again."); }
    finally { setPending(false); }
  }
  return <div className="logout-control"><button className="text-button" type="button" onClick={logout} disabled={pending}>{pending ? "Signing out…" : "Sign out"}</button>{error && <p className="header-error" role="alert">{error}</p>}</div>;
}

import { createHash } from "node:crypto";

/** Deterministic local identifiers only. This adapter never produces payment credentials. */
export function issueSandboxCard(requestId: string): { id: string; issuerReference: string; lastFour: string } {
  const digest = createHash("sha256").update(`etail:sandbox-card:${requestId}`).digest("hex");
  const id = `${digest.slice(0, 8)}-${digest.slice(8, 12)}-5${digest.slice(13, 16)}-a${digest.slice(17, 20)}-${digest.slice(20, 32)}`;
  return { id, issuerReference: `sandbox-card:${requestId}`, lastFour: (BigInt(`0x${digest}`) % 10000n).toString().padStart(4, "0") };
}

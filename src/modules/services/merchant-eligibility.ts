import type { ScopedTransaction } from "../access/scope";
import { requireSandboxAdult } from "../sandbox/service";

/** Eligibility for simulated products only; never a real verification decision. */
export async function requireMerchantApplicant(tx: ScopedTransaction, personId: string) {
  return requireSandboxAdult(tx, personId);
}

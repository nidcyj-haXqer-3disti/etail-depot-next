import { z } from "zod";

/** Exact address normalization only; do not collapse dots, plus suffixes or aliases. */
export function normalizeVerifiedEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return z.email().max(254).safeParse(normalized).success ? normalized : null;
}

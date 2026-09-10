import { z } from "zod";
import { SecurityError } from "../../platform/security/origin";
import { readReportFilters } from "./contracts";

export function requireReportRouteId(value: string, code = "SERVICE_UNAVAILABLE") {
  if (!z.uuid().safeParse(value).success) throw new SecurityError(code, 404);
  return value;
}
export function reportRouteFilters(request: Request) {
  try { return readReportFilters(new URL(request.url).searchParams); }
  catch { throw new SecurityError("INVALID_REQUEST", 422); }
}

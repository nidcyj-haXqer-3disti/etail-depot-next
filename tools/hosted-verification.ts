import { CORE_PUBLIC_PATHS } from "../src/shared/site/public-page-inventory.ts";
import { canonicalOrigin } from "../src/shared/site/public-release.ts";
import { RETIRED_ARTICLE_PATHS } from "../src/shared/site/retired-article-paths.ts";

export type VerificationMode = "health" | "boundaries";
type Check = { path: string; status: number; headers: Record<string, string> };
export type CheckResult = Check & {
  startedAt: string; finishedAt: string; actualStatus: number | null;
  requestId: string | null; issues: string[];
};
const securityHeaders = {
  "x-content-type-options": "nosniff", "x-frame-options": "DENY", "referrer-policy": "no-referrer",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
};

/** Exhaustive denial/alias checks belong in the local suites, not repeated production traffic. */
export function hostedChecks(mode: VerificationMode): Check[] {
  if (mode === "health") return [...CORE_PUBLIC_PATHS, "/robots.txt", "/sitemap.xml"].map(path => ({ path, status: 200, headers: { ...securityHeaders } }));
  if (mode !== "boundaries") throw new Error("Unknown verification mode.");
  return [
    { path: "/api", status: 410, noStore: true },
    { path: RETIRED_ARTICLE_PATHS[0], status: 410, noStore: true },
    { path: "/tools/reference-release.json", status: 404 },
    { path: "/reference-release.json", status: 404 },
    { path: "/docs/CURRENT_WORK_CONTEXT.md", status: 404, noStore: true },
  ].map(({ path, status, noStore }) => ({ path, status, headers: {
    ...securityHeaders, "x-robots-tag": "noindex, nofollow", ...(noStore ? { "cache-control": "no-store" } : {}),
  } }));
}

export function verificationUserAgent(mode: VerificationMode, runId: string): string {
  if (!/^[a-zA-Z0-9-]{1,80}$/.test(runId)) throw new Error("Invalid verification run ID.");
  if (mode !== "health" && mode !== "boundaries") throw new Error("Unknown verification mode.");
  return `EtailDepot-${mode === "health" ? "Health" : "Boundary"}-Check/1.0 run/${runId}`;
}

export function verificationSummary(results: CheckResult[]) {
  const statusCounts: Record<string, number> = {};
  for (const result of results) {
    const key = result.actualStatus === null ? "network-failure" : String(result.actualStatus);
    statusCounts[key] = (statusCounts[key] ?? 0) + 1;
  }
  return {
    checked: results.length,
    healthyResponses: results.filter(r => r.status === 200 && r.issues.length === 0).length,
    expectedBoundaryResponses: results.filter(r => r.status >= 400 && r.issues.length === 0).length,
    unexpectedFailures: results.filter(r => r.issues.length > 0).length,
    // Keep actual traffic independent of assertions, including a 410 with invalid headers.
    statusCounts,
  };
}

export type VerificationReport = {
  schemaVersion: number; mode: VerificationMode; runId: string; userAgent: string;
  origin: string; startedAt: string; finishedAt: string | null;
  plannedRequests: number; complete: boolean; passed: boolean;
  summary: ReturnType<typeof verificationSummary>; results: CheckResult[];
};

type RunOptions = {
  mode: VerificationMode; runId: string; signal?: AbortSignal;
  fetchImpl?: typeof fetch; onProgress?: (report: VerificationReport) => void;
};

/** GET only, pinned origin, no cookies/credentials, redirects, retries or response-body retention. */
export async function runHostedVerification({ mode, runId, signal, fetchImpl = fetch, onProgress }: RunOptions): Promise<VerificationReport> {
  const plan = hostedChecks(mode);
  const report: VerificationReport = {
    schemaVersion: 1, mode, runId, userAgent: verificationUserAgent(mode, runId), origin: canonicalOrigin,
    startedAt: new Date().toISOString(), finishedAt: null, plannedRequests: plan.length,
    complete: false, passed: false, summary: verificationSummary([]), results: [],
  };
  onProgress?.(report); // A saved initial receipt stays incomplete if the process is killed.
  for (const check of plan) {
    if (signal?.aborted) break;
    const result: CheckResult = { ...check, startedAt: new Date().toISOString(), finishedAt: "", actualStatus: null, requestId: null, issues: [] };
    try {
      const timeout = AbortSignal.timeout(15_000);
      const response = await fetchImpl(new URL(check.path, canonicalOrigin), {
        method: "GET", redirect: "manual", credentials: "omit",
        signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
        headers: { "User-Agent": report.userAgent },
      });
      result.actualStatus = response.status;
      result.requestId = response.headers.get("x-nf-request-id");
      if (response.status !== check.status) result.issues.push(`Expected HTTP ${check.status}; received ${response.status}.`);
      for (const [header, expected] of Object.entries(check.headers)) {
        if (response.headers.get(header)?.toLowerCase() !== expected.toLowerCase()) result.issues.push(`Unexpected ${header} header.`);
      }
      // Drain the response so checking headers does not create client-aborted requests.
      await response.arrayBuffer();
    } catch {
      result.issues.push(signal?.aborted ? "Check interrupted." : "Network, response-body or timeout failure.");
    }
    result.finishedAt = new Date().toISOString();
    report.results.push(result);
    report.summary = verificationSummary(report.results);
    onProgress?.(report);
  }
  report.finishedAt = new Date().toISOString();
  report.complete = report.results.length === plan.length && !signal?.aborted;
  report.passed = report.complete && report.summary.unexpectedFailures === 0;
  onProgress?.(report);
  return report;
}

export function formatVerificationReport(report: VerificationReport): string {
  return [
    `${report.mode.toUpperCase()} checks: ${report.passed ? "PASS" : report.complete ? "FAIL" : "INCOMPLETE"}`,
    `UTC window: ${report.startedAt} to ${report.finishedAt ?? "in progress"}`,
    `User-Agent: ${report.userAgent}`,
    `Requests completed: ${report.summary.checked}/${report.plannedRequests}`,
    `Healthy responses: ${report.summary.healthyResponses}`,
    `Expected boundary responses: ${report.summary.expectedBoundaryResponses}`,
    `Unexpected failures: ${report.summary.unexpectedFailures}`,
    `Actual HTTP results: ${JSON.stringify(report.summary.statusCounts)}`,
    ...(report.mode === "boundaries" ? ["Netlify may count these deliberate 4xx responses in its traffic totals. Correlate this exact User-Agent and UTC window; do not exclude other failures."] : []),
    ...report.results.filter(r => r.issues.length).map(r => `${r.path}: ${r.issues.join(" ")}`),
    "Scope: HTTP status and security headers only. This does not replace content, asset, SEO, desktop/mobile or booking checks.",
  ].join("\n");
}

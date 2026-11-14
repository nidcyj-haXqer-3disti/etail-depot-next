import { describe, expect, it, vi } from "vitest";
import { canonicalOrigin } from "../../src/shared/site/public-release";
import { CORE_PUBLIC_PATHS } from "../../src/shared/site/public-page-inventory";
import { fileDestination, sourceOnlyStaticFile } from "../../tools/file-publication-policy";
import { formatVerificationReport, hostedChecks, runHostedVerification, verificationUserAgent } from "../../tools/hosted-verification";
import type { VerificationMode, VerificationReport } from "../../tools/hosted-verification";

function fixture(mode: VerificationMode) {
  const checks = hostedChecks(mode);
  return vi.fn<typeof fetch>().mockImplementation(async input => {
    const url = new URL(String(input));
    expect(url.origin).toBe(canonicalOrigin);
    const check = checks.find(c => c.path === url.pathname)!;
    return new Response("Response body is discarded", { status: check.status, headers: { ...check.headers, "x-nf-request-id": "request-proof" } });
  });
}

function firstResponse(mode: VerificationMode, status: number, headers = hostedChecks(mode)[0].headers) {
  return fixture(mode).mockResolvedValueOnce(new Response("Unexpected response", { status, headers }));
}

describe("hosted verification separates expected rejections from failures", () => {
  it("defaults health planning to registered core pages and discovery files, without negative probes", () => {
    const checks = hostedChecks("health");
    expect(checks.map(c => c.path)).toEqual([...CORE_PUBLIC_PATHS, "/robots.txt", "/sitemap.xml"]);
    expect(checks.every(c => c.status === 200)).toBe(true);
    expect(new Set(checks.map(c => c.path)).size).toBe(checks.length);
  });

  it("caps live boundary probes at five, preserving both manifest checks", () => {
    const checks = hostedChecks("boundaries");
    expect(checks).toHaveLength(5);
    expect(checks.filter(c => c.status === 410)).toHaveLength(2);
    expect(checks.filter(c => c.status === 404)).toHaveLength(3);
    for (const path of ["/tools/reference-release.json", "/reference-release.json"]) expect(checks).toContainEqual(expect.objectContaining({ path, status: 404 }));
  });

  it("uses distinct, filterable user agents and rejects unsafe labels", () => {
    expect(verificationUserAgent("health", "run-1")).toBe("EtailDepot-Health-Check/1.0 run/run-1");
    expect(verificationUserAgent("boundaries", "run-1")).toBe("EtailDepot-Boundary-Check/1.0 run/run-1");
    expect(() => verificationUserAgent("health", "run\nInjected: header")).toThrow();
    expect(() => hostedChecks("unknown" as VerificationMode)).toThrow();
  });

  it("makes one credential-free GET per check with manual redirects and no retry", async () => {
    const fetchImpl = fixture("health");
    const report = await runHostedVerification({ mode: "health", runId: "unit", fetchImpl });
    expect(report.passed).toBe(true);
    expect(report.summary.healthyResponses).toBe(hostedChecks("health").length);
    expect(report.summary.expectedBoundaryResponses).toBe(0);
    expect(fetchImpl).toHaveBeenCalledTimes(report.plannedRequests);
    for (const [, options] of fetchImpl.mock.calls) {
      expect(options).toMatchObject({ method: "GET", credentials: "omit", redirect: "manual", headers: { "User-Agent": report.userAgent } });
      expect(options?.body).toBeUndefined();
      expect(options?.signal).toBeInstanceOf(AbortSignal);
    }
    expect(report.results[0]).toMatchObject({ requestId: "request-proof", actualStatus: 200, issues: [] });
    expect(Date.parse(report.results[0].finishedAt)).toBeGreaterThanOrEqual(Date.parse(report.results[0].startedAt));
    expect(JSON.stringify(report)).not.toContain("Response body is discarded");
  });

  it("reports deliberate 404/410 responses separately and explains their metric effect", async () => {
    const report = await runHostedVerification({ mode: "boundaries", runId: "unit", fetchImpl: fixture("boundaries") });
    expect(report.passed).toBe(true);
    expect(report.summary).toEqual({ checked: 5, healthyResponses: 0, expectedBoundaryResponses: 5, unexpectedFailures: 0, statusCounts: { "404": 3, "410": 2 } });
    expect(formatVerificationReport(report)).toContain("Netlify may count these deliberate 4xx");
    expect(formatVerificationReport(report)).toContain("Unexpected failures: 0");
  });

  it.each([404, 410, 499, 500, 503, 308])("fails an unexpected health HTTP %s even with the checker user agent", async status => {
    const report = await runHostedVerification({ mode: "health", runId: "unit", fetchImpl: firstResponse("health", status) });
    expect(report.passed).toBe(false);
    expect(report.summary.unexpectedFailures).toBe(1);
    expect(report.summary.expectedBoundaryResponses).toBe(0);
    expect(report.summary.statusCounts[String(status)]).toBe(1);
  });

  it.each([200, 404, 308, 500])("fails when an expected 410 becomes HTTP %s", async status => {
    const report = await runHostedVerification({ mode: "boundaries", runId: "unit", fetchImpl: firstResponse("boundaries", status) });
    expect(report.passed).toBe(false);
    expect(report.summary.expectedBoundaryResponses).toBe(4);
  });

  it("fails exposed private files rather than treating any boundary response as expected", async () => {
    const fetchImpl = fixture("boundaries");
    const original = fetchImpl.getMockImplementation()!;
    fetchImpl.mockImplementation((input, options) => new URL(String(input)).pathname === "/tools/reference-release.json"
      ? Promise.resolve(new Response("exposed source", { status: 200 })) : original(input, options));
    const report = await runHostedVerification({ mode: "boundaries", runId: "unit", fetchImpl });
    expect(report.passed).toBe(false);
    expect(report.results.find(r => r.path === "/tools/reference-release.json")?.issues).toContain("Expected HTTP 404; received 200.");
  });

  it("counts a 410 with broken protections as actual 410 traffic AND a failed check", async () => {
    const report = await runHostedVerification({ mode: "boundaries", runId: "unit", fetchImpl: firstResponse("boundaries", 410, {}) });
    expect(report.passed).toBe(false);
    expect(report.summary.statusCounts["410"]).toBe(2);
    expect(report.summary.expectedBoundaryResponses).toBe(4);
    expect(report.results[0].issues).toContain("Unexpected permissions-policy header.");
    expect(report.results[0].issues).toContain("Unexpected x-robots-tag header.");
    expect(report.results[0].issues).toContain("Unexpected cache-control header.");
  });

  it.each([new TypeError("private transport detail"), new DOMException("timeout", "TimeoutError")])("records transport failures without retaining raw error data", async error => {
    const fetchImpl = fixture("health").mockRejectedValueOnce(error);
    const report = await runHostedVerification({ mode: "health", runId: "unit", fetchImpl });
    expect(report.passed).toBe(false);
    expect(report.summary.statusCounts["network-failure"]).toBe(1);
    expect(report.summary.unexpectedFailures).toBe(1);
    expect(JSON.stringify(report)).not.toContain("private transport detail");
  });

  it("fails interrupted response bodies even after HTTP 200 headers arrive", async () => {
    const response = new Response(new ReadableStream({ start(controller) { controller.error(new Error("read failed")); } }), { headers: hostedChecks("health")[0].headers });
    const report = await runHostedVerification({ mode: "health", runId: "unit", fetchImpl: fixture("health").mockResolvedValueOnce(response) });
    expect(report.summary.statusCounts["200"]).toBe(report.plannedRequests);
    expect(report.summary.unexpectedFailures).toBe(1);
    expect(report.passed).toBe(false);
  });

  it("saves initial and partial progress without calling incomplete runs successful", async () => {
    const controller = new AbortController();
    const snapshots: VerificationReport[] = [];
    const fetchImpl = fixture("boundaries");
    const report = await runHostedVerification({ mode: "boundaries", runId: "unit", fetchImpl, signal: controller.signal,
      onProgress(progress) {
        snapshots.push(structuredClone(progress));
        if (progress.results.length === 1) controller.abort();
      },
    });
    expect(snapshots[0]).toMatchObject({ complete: false, passed: false, results: [] });
    expect(report).toMatchObject({ complete: false, passed: false });
    expect(report.summary.checked).toBe(1);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(formatVerificationReport(report)).toContain("INCOMPLETE");
  });

  it("keeps tooling and receipts outside the public website", () => {
    expect(fileDestination("tools/hosted-verification.ts")).toBe("repository-only");
    expect(fileDestination(".local/hosted-verification/run-health.json")).toBe("local-only");
    expect(sourceOnlyStaticFile(".local/hosted-verification/run-health.json")).toBe(true);
  });
});

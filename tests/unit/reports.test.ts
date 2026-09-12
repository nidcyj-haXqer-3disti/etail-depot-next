import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import type { WorkspaceProjection, WorkspaceActivity } from "../../src/modules/workspace/contracts";
import { formatMoney } from "../../src/modules/workspace/service";
import { readReportFilters, reportFiltersSchema, type ReportFilters } from "../../src/modules/reports/contracts";
import { csvCell, deriveHistoricalReport, historicalReportCsv } from "../../src/modules/reports/derive";

const filters: ReportFilters = { source: "ACTIVITY", status: "ALL", from: "2026-09-01", to: "2026-09-30", query: "" };
function sample(): WorkspaceProjection {
  const serviceId = randomUUID();
  return { service: { id: serviceId, kind: "CARDHOLDER", primaryPersonId:randomUUID(), role: "OWNER", cardholderRole: "OWNER", displayName: "Fictional shop", status: "ACTIVE", version: 1 }, member: { id: randomUUID(), displayName: "Fictional tester" }, services: [], cardholderRole: "OWNER", fictional: true, notice: "Fictional",  cards: [], cardRequests: [], cardholderOptions: [], people: [],
    preferences: { serviceActivity: true, cardControls: true, caseUpdates: true, version: 1, delivery: "SAVED_ONLY" },
    capabilities: ["activity.read"].map(action => ({ action, allowed: true, reason: "Explicit", reasonCode: "GRANTED" })),
    activity: [
      { id: randomUUID(), serviceId, cardId: null, title: "Large exact record", category: "Sample", occurredAt: "2026-09-01T00:00:00.000Z", status: "POSTED", direction: "DEBIT", amount: formatMoney(9007199254740993n), description: "Illustration", fictional: true },
      { id: randomUUID(), serviceId, cardId: null, title: "One cent", category: "Sample", occurredAt: "2026-09-30T23:59:59.000Z", status: "POSTED", direction: "DEBIT", amount: formatMoney(1n), description: "Illustration", fictional: true },
      ...(["PENDING", "DECLINED"] as const).map(status => ({ id: randomUUID(), serviceId, cardId: null, title: status, category: "Sample", occurredAt: "2026-09-15T12:00:00.000Z", status, direction: "DEBIT" as const, amount: formatMoney(999n), description: "Illustration", fictional: true as const })),
    ] };
}

describe("historical report values", () => {
  it("sums exact minor units beyond safe Number precision and separates status, direction and source", () => {
    const workspace = sample();
    workspace.activity.push({ ...workspace.activity[0]!, id: randomUUID(), direction: "CREDIT", amount: formatMoney(50n) });
    const report = deriveHistoricalReport(workspace, filters);
    expect(report.activityTotals.find(item => item.key === "POSTED_DEBIT")?.amount.minor).toBe("9007199254740994");
    expect(report.activityTotals.find(item => item.key === "POSTED_CREDIT")?.amount.minor).toBe("50");
    expect(report.activityTotals.find(item => item.key === "PENDING_DEBIT")?.amount.minor).toBe("999");
    expect(report.activityTotals.find(item => item.key === "DECLINED_DEBIT")?.amount.minor).toBe("999");
    expect(report).not.toHaveProperty("balance"); expect(report).not.toHaveProperty("amountDue");
    expect(report.disclosure).toContain("not a billing statement");
  });
  it("honors inclusive UTC days, case-insensitive text, source and status together", () => {
    const report = deriveHistoricalReport(sample(), { ...filters, source: "ACTIVITY", status: "POSTED", from: "2026-09-30", query: "ONE CENT" });
    expect(report.activity.map(item => item.title)).toEqual(["One cent"]);
    expect(report.activityTotals).toHaveLength(2);
    expect(report.activityTotals[0]!.amount.minor).toBe("1");
  });
  it("uses the latest available historical month rather than suggesting current billing", () => {
    const report = deriveHistoricalReport(sample(), undefined, [], new Date("2030-02-01T00:00:00Z"));
    expect(report.filters.from).toBe("2026-09-01"); expect(report.filters.to).toBe("2026-09-30");
    expect(report.generatedAt).toBe("2030-02-01T00:00:00.000Z");
  });
  it("rejects report reads without current activity permission",()=>{const w=sample();w.capabilities=[];expect(()=>deriveHistoricalReport(w,filters)).toThrow("ACTION_DENIED");});
});

describe("report filter and CSV boundaries", () => {
  it("rejects impossible dates, inverted periods, duplicate and unexpected URL fields", () => {
    expect(reportFiltersSchema.safeParse({ ...filters, from: "2026-02-30" }).success).toBe(false);
    expect(reportFiltersSchema.safeParse({ ...filters, from: "2026-10-01" }).success).toBe(false);
    expect(() => readReportFilters(new URLSearchParams("serviceId=someone-else"))).toThrow();
    expect(() => readReportFilters(new URLSearchParams("source=ACTIVITY&source=BOTH&from=2026-09-01&to=2026-09-30"))).toThrow();
    expect(readReportFilters(new URLSearchParams())).toBeUndefined();
  });
  it.each(["=HYPERLINK(\"https://example.com\")", "+SUM(1,1)", "-1+1", "@SUM(1,1)", " \t=1+1", "\uFEFF=1+1", "\tplain", "\rplain", "\nplain"])("neutralizes spreadsheet formula/control prefix %j", value => {
    expect(csvCell(value).startsWith('"\'')).toBe(true);
  });
  it("quotes commas, quotes and newlines and exports exact decimal values", () => {
    const workspace = sample();
    workspace.activity[0] = { ...workspace.activity[0]!, title: 'Tea, "large"\nrecord' } as WorkspaceActivity;
    const csv = historicalReportCsv(deriveHistoricalReport(workspace, filters));
    expect(csv).toContain('"Tea, ""large""\nrecord"');
    expect(csv).toContain('"90071992547409.93"');
    expect(csv).toContain("Card activity report.");
    expect(csv.endsWith("\r\n")).toBe(true);
  });
  it("an empty CSV carries the disclaimer without inventing a financial row", () => {
    const csv = historicalReportCsv(deriveHistoricalReport(sample(), { ...filters, query: "no matching item" }));
    expect(csv).toContain("NO_MATCHING_RECORDS"); expect(csv).toContain("not a billing statement");
    expect(csv).not.toContain("Large exact record");
  });
});

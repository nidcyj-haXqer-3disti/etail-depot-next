import type { WorkspaceProjection } from "../workspace/contracts";
import { formatMoney } from "../workspace/service";
import { SecurityError } from "../../platform/security/origin";
import { reportFiltersSchema, type HistoricalReportProjection, type ReportFilters, type ReportSource, type ReportTotal, type SavedReportDefinition } from "./contracts";

export const REPORT_DISCLOSURE = "Card activity report. Totals include the matching transactions you can view. Pending and declined amounts are separate from posted purchases. This is not a billing statement.";

export function availableReportSources(allowed: (action: string) => boolean): HistoricalReportProjection["availableSources"] {
  return allowed("activity.read") ? [{value:"ACTIVITY",label:"Card activity"}] : [];
}
export function sourceAllowed(source: ReportSource, allowed: (action: string) => boolean) {return source === "ACTIVITY" && allowed("activity.read");}

function monthPeriod(month: string) {
  const start = new Date(`${month}-01T00:00:00Z`);
  const end = new Date(start); end.setUTCMonth(end.getUTCMonth() + 1); end.setUTCDate(0);
  return { value: month, label: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(start), from: `${month}-01`, to: end.toISOString().slice(0, 10) };
}

/** Exact derived report totals only. Never writes or computes a service balance or amount due. */
export function deriveHistoricalReport(workspace: WorkspaceProjection, requested?: ReportFilters, definitions: SavedReportDefinition[] = [], now = new Date()): HistoricalReportProjection {
  const allowed = (action: string) => workspace.capabilities.some(item => item.action === action && item.allowed);
  const availableSources = availableReportSources(allowed);
  if (!availableSources.length) throw new SecurityError("ACTION_DENIED", 403);
  const months = [...new Set(workspace.activity.map(item => item.occurredAt.slice(0, 7)))].sort().reverse();
  const periods = (months.length ? months : [now.toISOString().slice(0, 7)]).map(monthPeriod);
  const parsed = reportFiltersSchema.safeParse(requested ?? { source: availableSources.at(-1)!.value, status: "ALL", from: periods[0]!.from, to: periods[0]!.to, query: "" });
  if (!parsed.success) throw new SecurityError("INVALID_REQUEST", 422);
  const filters = parsed.data;
  if (!sourceAllowed(filters.source, allowed)) throw new SecurityError("ACTION_DENIED", 403);
  const query = filters.query.toLocaleLowerCase("en-US");
  function matches(item: { occurredAt: string; status: string }, searchText: string) {
    const date = item.occurredAt.slice(0, 10);
    return date >= filters.from && date <= filters.to && (filters.status === "ALL" || item.status === filters.status) && (!query || searchText.toLocaleLowerCase("en-US").includes(query));
  }
  const activity = workspace.activity.filter(item => matches(item, `${item.title} ${item.category} ${item.description} ${item.id}`));
  const activityTotals: ReportTotal[] = [];
  for (const status of ["POSTED", "PENDING", "DECLINED"] as const) {
    if (filters.status !== "ALL" && filters.status !== status) continue;
    for (const direction of ["DEBIT", "CREDIT"] as const) {
      const total = activity.filter(item => item.status === status && item.direction === direction).reduce((sum, item) => sum + BigInt(item.amount.minor), 0n);
      activityTotals.push({ key: `${status}_${direction}`, label: `${status[0]}${status.slice(1).toLowerCase()} ${direction === "DEBIT" ? "debits" : "credits"}`, amount: formatMoney(total), explanation: `Sum of matching ${status.toLowerCase()} ${direction.toLowerCase()} records. ${status === "POSTED" ? "Not a service balance or amount due." : "Not included in posted totals."}` });
    }
  }
  return { kind: "CARD_ACTIVITY_REPORT", serviceId: workspace.service.id, serviceName: workspace.customerService?.displayName??workspace.service.displayName,
    generatedAt: now.toISOString(), fictional: true, disclosure: REPORT_DISCLOSURE, filters, availableSources, periods, activity,
    activityTotals, definitions, rowCount: activity.length, empty: activity.length === 0 };
}

/** All CSV text is quoted. Neutralize spreadsheet formulas even after leading whitespace/BOM. */
export function csvCell(value: string): string {
  const safe = /^[\s\uFEFF]*[=+@-]/u.test(value) || /^[\t\r\n]/u.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
function exactDecimal(minor: string) {
  const amount = BigInt(minor), magnitude = amount < 0n ? -amount : amount;
  return `${amount < 0n ? "-" : ""}${magnitude / 100n}.${(magnitude % 100n).toString().padStart(2, "0")}`;
}
export function historicalReportCsv(report: HistoricalReportProjection): string {
  const columns = ["Disclosure", "Service", "From (UTC)", "To (UTC)", "Source", "Record ID", "Date (UTC)", "Description", "Status", "Direction", "Currency", "Amount", "Reference / category", "Details"];
  const prefix = [report.disclosure, report.serviceName, report.filters.from, report.filters.to];
  const rows = [columns,
    ...report.activity.map(item => [...prefix, "ACTIVITY", item.id, item.occurredAt, item.title, item.status, item.direction, item.amount.currency, exactDecimal(item.amount.minor), item.category, item.description]),
  ];
  // An empty export still carries the nonbilling disclosure without inventing a transaction row.
  if (rows.length === 1) rows.push([...prefix, "NO_MATCHING_RECORDS", ...Array<string>(9).fill("")]);
  return `${rows.map(row => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
}

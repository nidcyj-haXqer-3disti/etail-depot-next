"use client";

import { useRef, useState } from "react";
import type { WorkspaceProjection } from "@/modules/workspace/contracts";
import type { HistoricalReportProjection, ReportFilters, SavedReportDefinition } from "@/modules/reports/contracts";
import { requestFailure } from "@/ui/api-feedback";
import { Button, EmptyState, Feedback, StatusBadge, WorkspaceDialog, formatDate, formatMoney, workspaceCommand } from "./primitives";
import "./reports.css";

export interface ReportsWorkspaceProps { workspace: WorkspaceProjection; report: HistoricalReportProjection }
function queryString(filters: ReportFilters) { return new URLSearchParams({ source: filters.source, status: filters.status, from: filters.from, to: filters.to, query: filters.query }).toString(); }
function filterSummary(filters: ReportFilters) {
  return `${formatDate(filters.from)} – ${formatDate(filters.to)} · Card activity · ${filters.status === "ALL" ? "All statuses" : filters.status.toLowerCase()}${filters.query ? ` · “${filters.query}”` : ""}`;
}

function ReportsWorkspaceState({ workspace, report: initialReport }: ReportsWorkspaceProps) {
  const [report, setReport] = useState(initialReport);
  const [filters, setFilters] = useState(initialReport.filters);
  const [customDates, setCustomDates] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dialog, setDialog] = useState<"save" | "delete" | null>(null);
  const [editing, setEditing] = useState<SavedReportDefinition | null>(null);
  const [name, setName] = useState("");
  const [replaceFilters, setReplaceFilters] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [stale, setStale] = useState(false);
  const commandIds = useRef(new Map<string, string>());
  const statement = useRef<HTMLElement>(null);
  const applied = report.filters;
  const changed = JSON.stringify(filters) !== JSON.stringify(applied);
  const period = customDates ? "custom" : report.periods.find(item => item.from === filters.from && item.to === filters.to)?.value ?? "custom";

  function commandId(payload: unknown) {
    const signature = JSON.stringify(payload);
    if (!commandIds.current.has(signature)) commandIds.current.set(signature, crypto.randomUUID());
    return commandIds.current.get(signature)!;
  }
  async function fetchReport(next: ReportFilters) {
    const response = await fetch(`/api/v1/cardholder-services/${encodeURIComponent(workspace.service.id)}/reports?${queryString(next)}`, { credentials: "same-origin", cache: "no-store" });
    if (!response.ok) throw new Error(requestFailure(response.status, "We couldn’t prepare this report. Review the dates and filters, then try again."));
    return await response.json() as HistoricalReportProjection;
  }
  async function apply(next = filters, focus = true) {
    if (!next.from || !next.to || next.from > next.to || next.query.length > 80) { setError("Choose valid dates, with the end date on or after the start date. Search is limited to 80 characters."); return; }
    setBusy("report"); setError(""); setNotice("");
    try {
      const result = await fetchReport(next); setReport(result); setFilters(result.filters); setCustomDates(false);
      setNotice(`${result.rowCount} ${result.rowCount === 1 ? "record" : "records"} in your activity report.`);
      if (focus) requestAnimationFrame(() => statement.current?.focus());
    } catch (failure) { setError(failure instanceof Error ? failure.message : "We couldn’t load the report. Please retry."); }
    finally { setBusy(""); }
  }
  async function download() {
    setBusy("download"); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/v1/cardholder-services/${encodeURIComponent(workspace.service.id)}/reports/export?${queryString(applied)}`, { credentials: "same-origin", cache: "no-store" });
      if (!response.ok || !response.headers.get("Content-Type")?.startsWith("text/csv")) throw new Error(requestFailure(response.status, "We couldn’t download the report. Please try again."));
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a"); link.href = url; link.download = `etail-card-activity-${applied.from}-${applied.to}.csv`;
      document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice("Your report is ready to download.");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "We couldn’t download the report. Please retry."); }
    finally { setBusy(""); }
  }
  function openSave(definition: SavedReportDefinition | null = null) {
    setEditing(definition); setName(definition?.name ?? ""); setReplaceFilters(false); setDialogError(""); setStale(false); setDialog("save");
  }
  async function save() {
    setBusy("save"); setDialogError("");
    const savedFilters = editing && !replaceFilters ? editing.filters : applied;
    const payload = { name: name.trim(), filters: savedFilters, ...(editing ? { expectedVersion: editing.version } : {}) };
    const signature = editing ? { id: editing.id, ...payload } : payload;
    const requestId = commandId(signature);
    try {
      const saved = editing
        ? await workspaceCommand<SavedReportDefinition>(workspace.service.id, `/reports/definitions/${encodeURIComponent(editing.id)}`, "PATCH", { ...payload, commandId: requestId })
        : await workspaceCommand<SavedReportDefinition>(workspace.service.id, "/reports/definitions", "POST", { ...payload, commandId: requestId });
      commandIds.current.delete(JSON.stringify(signature));
      setReport(current => ({ ...current, definitions: [saved, ...current.definitions.filter(item => item.id !== saved.id)] }));
      setDialog(null); setNotice(`“${saved.name}” is saved for you in ${(workspace.customerService?.displayName ?? "Cards & spending")}. It will include only activity you can view.`);
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : "We couldn’t save this report. Retry with the same details.";
      setDialogError(message); setStale(message.includes("changed while"));
    } finally { setBusy(""); }
  }
  async function remove() {
    if (!editing) return;
    setBusy("delete"); setDialogError("");
    const payload = { expectedVersion: editing.version, commandId: commandId({ id: editing.id, deleteVersion: editing.version }) };
    try {
      const response = await fetch(`/api/v1/cardholder-services/${encodeURIComponent(workspace.service.id)}/reports/definitions/${encodeURIComponent(editing.id)}`, { method: "DELETE", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (response.status === 409) { setStale(true); throw new Error("This saved report changed. Reload it before removing it."); }
      if (!response.ok) throw new Error(requestFailure(response.status, "We couldn’t remove this saved report. Please try again."));
      setReport(current => ({ ...current, definitions: current.definitions.filter(item => item.id !== editing.id) }));
      setDialog(null); setNotice(`“${editing.name}” was removed from your saved reports. Your records are unchanged.`);
    } catch (failure) { setDialogError(failure instanceof Error ? failure.message : "We couldn’t confirm removal. Retry to confirm the same request."); }
    finally { setBusy(""); }
  }
  async function refreshDefinition() {
    setBusy("refresh"); setDialogError("");
    try {
      const latest = await fetchReport(applied); setReport(latest);
      const definition = latest.definitions.find(item => item.id === editing?.id);
      if (!definition) { setDialog(null); setNotice("That saved report has already been removed. Your records are unchanged."); }
      else { setEditing(definition); setStale(false); setDialogError("Report refreshed. Review your unsaved name and filters before saving."); }
    } catch (failure) { setDialogError(failure instanceof Error ? failure.message : "We couldn’t reload the saved report. Please retry."); }
    finally { setBusy(""); }
  }

  return <section className="consumer-workspace reports-workspace" aria-label="Statements & reports">
    <div className="reports-layout">
      <div className="reports-main">
        <form className="consumer-panel reports-filters reports-screen-only" onSubmit={event => { event.preventDefault(); void apply(); }} aria-label="Statement filters">
          <div className="reports-filter-title"><div><h2>Filter records</h2><p>Dates use UTC. Only records you can access are included.</p></div></div>
          <fieldset disabled={!!busy} className="reports-filter-fields"><legend className="reports-visually-hidden">Filter records</legend>
            <label>Period<select value={period} onChange={event => { setCustomDates(event.target.value === "custom"); const next = report.periods.find(item => item.value === event.target.value); if (next) setFilters(current => ({ ...current, from: next.from, to: next.to })); }}><option value="custom">Custom dates</option>{report.periods.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <label>From<input type="date" required value={filters.from} onChange={event => { setCustomDates(true); setFilters(current => ({ ...current, from: event.target.value })); }} /></label>
            <label>To<input type="date" required min={filters.from} value={filters.to} onChange={event => { setCustomDates(true); setFilters(current => ({ ...current, to: event.target.value })); }} /></label>
            <label>Status<select value={filters.status} onChange={event => setFilters(current => ({ ...current, status: event.target.value as ReportFilters["status"] }))}><option value="ALL">All statuses</option><option value="POSTED">Posted</option><option value="PENDING">Pending</option><option value="DECLINED">Declined</option></select></label>
            <label className="reports-search">Find a record<input type="search" maxLength={80} placeholder="Name, reference or description" value={filters.query} onChange={event => setFilters(current => ({ ...current, query: event.target.value }))} /></label>
          </fieldset>
          <div className="reports-filter-bottom"><p>{changed ? "Apply your changed filters to update the report." : "These filters match the report below."}</p><Button type="submit" busy={busy === "report"} disabled={!!busy}>Apply filters</Button></div>
        </form>
        <div className="reports-screen-only"><Feedback kind="error" message={error} /><Feedback kind="success" message={notice} /></div>
        <div className="reports-preview-heading reports-screen-only"><div className="reports-actions"><Button variant="secondary" busy={busy === "download"} disabled={!!busy} onClick={() => void download()}>Download CSV</Button><Button variant="quiet" disabled={!!busy} onClick={() => window.print()}>Print</Button></div></div>
        <article ref={statement} tabIndex={-1} className="reports-statement" aria-labelledby="statement-title" aria-busy={busy === "report"}>
          <header className="reports-statement-header"><div><p className="consumer-eyebrow">Etail Depot</p><h2 id="statement-title">Activity report</h2><p className="reports-statement-service">{report.serviceName}</p></div><div className="reports-period"><strong>{formatDate(applied.from)}</strong><span>through {formatDate(applied.to)}</span><small>Dates in UTC</small></div></header>
          <p className="reports-disclosure">{report.disclosure}</p>
          <div className="reports-applied"><span>{report.availableSources.find(item => item.value === applied.source)?.label} · {applied.status === "ALL" ? "All statuses" : applied.status.toLowerCase()}{applied.query ? ` · Search: “${applied.query}”` : ""}</span><strong>{report.rowCount} {report.rowCount === 1 ? "record" : "records"}</strong></div>
          {report.empty ? <EmptyState title="No records match this period" description="Try another date range or clear the search. Reports include only activity you can view."><Button className="reports-screen-only" variant="secondary" disabled={!!busy} onClick={() => void apply({ ...applied, status: "ALL", query: "" })}>Clear search & status</Button></EmptyState> : <>
            {<section className="reports-record-section" aria-labelledby="activity-report-heading"><h3 id="activity-report-heading">Card activity</h3><p>Debits and credits are shown separately. Pending and declined amounts do not count as posted activity.</p>
              <dl className="reports-totals">{report.activityTotals.map(item => <div key={item.key}><dt>{item.label}</dt><dd>{formatMoney(item.amount)}</dd></div>)}</dl>
              {report.activity.length ? <div className="reports-table-scroll" tabIndex={0} role="region" aria-label="Itemized card activity"><table><caption>Matching activity for {report.serviceName}, {formatDate(applied.from)} through {formatDate(applied.to)}</caption><thead><tr><th scope="col">Date</th><th scope="col">Record</th><th scope="col">Status</th><th scope="col">Direction</th><th scope="col" className="reports-number">Amount</th></tr></thead><tbody>{report.activity.map(item => <tr key={item.id}><td>{formatDate(item.occurredAt)}</td><th scope="row"><strong>{item.title}</strong><small>{item.category}</small><details><summary>Record details</summary><p>{item.description}</p></details></th><td><StatusBadge status={item.status} /></td><td>{item.direction === "DEBIT" ? "Debit" : "Credit"}</td><td className="reports-number">{formatMoney(item.amount)}</td></tr>)}</tbody></table></div> : <p className="reports-section-empty">No card activity matches these filters.</p>}
            </section>}

          </>}
          <footer className="reports-statement-footer"><span>Prepared {formatDate(report.generatedAt)} · USD</span><span>Activity report · Not a billing statement</span></footer>
        </article>
      </div>
      <aside className="reports-saved consumer-panel reports-screen-only" aria-labelledby="saved-reports-title"><h2 id="saved-reports-title">Saved reports</h2><p>Save filters to use again. Reports include only activity you can view.</p><Button variant="secondary" disabled={!!busy} onClick={() => openSave()}>Save current filters</Button><p className="reports-private">Private to you in {(workspace.customerService?.displayName ?? "Cards & spending")}.</p>
        {report.definitions.length ? <ul className="reports-definition-list">{report.definitions.map(item => <li key={item.id}><h3>{item.name}</h3><p>{filterSummary(item.filters)}</p>{!item.canRun && <p className="reports-definition-unavailable">{item.unavailableReason}</p>}<div className="reports-definition-actions">{item.canRun && <Button variant="quiet" disabled={!!busy} onClick={() => void apply(item.filters)}>Run<span className="reports-visually-hidden"> {item.name}</span></Button>}<Button variant="quiet" disabled={!!busy} onClick={() => openSave(item)}>Edit<span className="reports-visually-hidden"> {item.name}</span></Button><Button variant="quiet" disabled={!!busy} onClick={() => { setEditing(item); setDialogError(""); setStale(false); setDialog("delete"); }}>Remove<span className="reports-visually-hidden"> {item.name}</span></Button></div></li>)}</ul> : <div className="reports-saved-empty"><p>No saved reports yet.</p></div>}
      </aside>
    </div>
    <WorkspaceDialog open={dialog !== null} onClose={() => { if (!busy) setDialog(null); }} title={dialog === "delete" ? "Remove saved report?" : editing ? "Edit saved report" : "Save report filters"} serviceName={(workspace.customerService?.displayName ?? "Cards & spending")} footer={dialog === "delete" ? <><Button variant="quiet" disabled={!!busy} onClick={() => setDialog(null)}>Keep report</Button><Button variant="danger" busy={busy === "delete"} disabled={!!busy || stale} onClick={() => void remove()}>Remove report</Button></> : undefined}>
      <Feedback kind="error" message={dialogError} />{stale && <Button variant="secondary" busy={busy === "refresh"} disabled={!!busy} onClick={() => void refreshDefinition()}>Reload saved report</Button>}
      {dialog === "delete" ? <p className="reports-dialog-copy">Remove “{editing?.name}” from your personal saved reports in {(workspace.customerService?.displayName ?? "Cards & spending")}? This removes its name and filters. Your records stay unchanged.</p> : <form className="reports-definition-form" onSubmit={event => { event.preventDefault(); void save(); }}>
        <label>Report name<input value={name} required maxLength={60} autoComplete="off" disabled={!!busy} onChange={event => setName(event.target.value)} placeholder="For example, September posted activity" /></label>
        {editing && <label className="reports-replace-choice"><input type="checkbox" checked={replaceFilters} disabled={!!busy} onChange={event => setReplaceFilters(event.target.checked)} /><span>Replace saved filters with the current preview filters</span></label>}
        {editing && !editing.canRun && !replaceFilters && <Feedback kind="info" message="This saved report includes records you can no longer access. Replace its filters with the current preview filters to save changes." />}
        <div className="reports-saving-summary"><strong>Filters to save</strong><p>{filterSummary(editing && !replaceFilters ? editing.filters : applied)}</p></div><p className="consumer-muted">Only the name and filters are saved. Each report includes only the records you can access.</p>
        <div className="reports-actions"><Button variant="quiet" disabled={!!busy} onClick={() => setDialog(null)}>Cancel</Button><Button type="submit" busy={busy === "save"} disabled={!!busy || stale || !name.trim() || !!(editing && !editing.canRun && !replaceFilters)}>Save report</Button></div>
      </form>}
    </WorkspaceDialog>
  </section>;
}

export function ReportsWorkspace(props:ReportsWorkspaceProps){return <ReportsWorkspaceState key={JSON.stringify([props.workspace.service.id,props.workspace.cardholderRole,props.report])} {...props}/>;}

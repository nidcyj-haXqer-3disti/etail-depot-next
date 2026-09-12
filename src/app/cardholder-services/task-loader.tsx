import Link from "next/link";
import { z } from "zod";
import { redirect, unstable_rethrow } from "next/navigation";
import { getRequestSession } from "@/platform/http/context";
import { SecurityError } from "@/platform/security/origin";
import { getCardholderDashboardFocus, getPrimaryCardholderService } from "@/modules/workspace/dashboard-service";
import { getWorkspace } from "@/modules/workspace/service";
import { getHistoricalReport } from "@/modules/reports/service";
import { estimateMembership, sampleMembershipInput } from "@/modules/membership/estimate";
import { PageNotice } from "@/ui/shell";
import { WorkspaceShell } from "@/ui/workspace/shell";
import { ActivityWorkspace } from "@/ui/workspace/activity";
import { ReportsWorkspace } from "@/ui/workspace/reports";
import { SettingsWorkspace } from "@/ui/workspace/settings";
import { HelpWorkspace } from "@/ui/workspace/help";
import { MembershipWorkspace } from "@/ui/workspace/membership";
import { EmptyState } from "@/ui/workspace/primitives";
import type { CardholderTask } from "@/ui/cardholder-routing";
export type CardholderTaskQuery = Record<string, string | string[] | undefined>;
function exactId(value: string | string[] | undefined) {
  if (typeof value !== "string") throw new SecurityError("NOT_FOUND", 404);
  const parsed = z.uuid().safeParse(value);
  if (!parsed.success) throw new SecurityError("NOT_FOUND", 404);
  return parsed.data.toLowerCase();
}
export async function renderCardholderTask(task: CardholderTask, searchParams: Promise<CardholderTaskQuery>) {
  const session = await getRequestSession().catch(() => undefined);
  if (session === undefined) return <PageNotice title="We couldn’t load your session"><p>Please try signing in again.</p></PageNotice>;
  if (!session) redirect("/login");
  const query = await searchParams;
  if (query.focus === undefined && query.context === undefined) return <PageNotice title="Choose a card to continue" authenticated><p>Open a card, then choose the service you need.</p><Link href="/cardholder-services?view=cards">Choose a card</Link></PageNotice>;
  try {
    const focusId = query.focus !== undefined ? exactId(query.focus) : undefined;
    const contextId = query.context !== undefined ? exactId(query.context) : undefined;
    const focused = focusId ? await getCardholderDashboardFocus(session.personId, focusId) : null;
    if (contextId && focused && contextId !== focused.card.serviceId) throw new SecurityError("NOT_FOUND", 404);
    const serviceId = focused?.card.serviceId ?? contextId!;
    const workspace = await getWorkspace(session.personId, serviceId);
    if (workspace.cardholderRole === "NONE" || (focusId && !workspace.cards.some(card => card.id === focusId))) throw new SecurityError("NOT_FOUND", 404);
    // A transaction deep link cannot swap the selected card or reveal an unavailable record.
    if (query.transaction !== undefined) {
      const transactionId = exactId(query.transaction);
      if (!workspace.activity.some(item => item.id === transactionId && (!focusId || item.cardId === focusId))) throw new SecurityError("NOT_FOUND", 404);
    }
    const scopeKey = JSON.stringify([serviceId, workspace.cardholderRole, workspace.capabilities, workspace.cards.map(card => card.id), focusId]);
    let content;
    if (task === "activity") content = <ActivityWorkspace key={scopeKey} workspace={workspace} selectedCardId={focusId}/>;
    else if (task === "reports") content = workspace.capabilities.some(item => item.action === "activity.read" && item.allowed) ? <><p className="consumer-muted">{workspace.cardholderRole === "OWNER" ? "Reports include the cards you manage in this group." : "Reports include only your own card activity."}</p><ReportsWorkspace key={scopeKey} workspace={workspace} report={await getHistoricalReport(session.personId, serviceId)}/></> : <EmptyState title="Report access is restricted" description="Your permissions do not include these reports."/>;
    else if (task === "settings") content = <SettingsWorkspace key={scopeKey} workspace={workspace}/>;
    else if (task === "membership") content = <MembershipWorkspace initial={estimateMembership(sampleMembershipInput)}/>;
    else content = <HelpWorkspace key={scopeKey} workspace={workspace} selectedCardId={focusId}/>;
    const primaryService = await getPrimaryCardholderService(session.personId);
    return <WorkspaceShell workspace={workspace} section={task} selectedCardId={focusId} primaryService={primaryService}>{content}</WorkspaceShell>;
  } catch (error) {
    unstable_rethrow(error);
    const unavailable = error instanceof SecurityError && [403, 404, 422].includes(error.status);
    return <PageNotice title={unavailable ? "This cardholder view is unavailable" : "We couldn’t load this cardholder service"} authenticated><p>{unavailable ? "Your access or the selected item may have changed. No other card has been selected." : "Your saved records have not changed. Please try again."}</p><Link href="/cardholder-services?view=cards">Return to your cards</Link></PageNotice>;
  }
}

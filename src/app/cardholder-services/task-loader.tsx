import Link from "next/link";
import { z } from "zod";
import { redirect, unstable_rethrow } from "next/navigation";
import { getRequestSession } from "@/platform/http/context";
import { SecurityError } from "@/platform/security/origin";
import { getCardholderDashboard, getCardholderDashboardFocus, getPrimaryCardholderService } from "@/modules/workspace/dashboard-service";
import { getWorkspace, getCardholderFunds } from "@/modules/workspace/service";
import {getMoneyAccountOverview} from "@/modules/money/service";
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
import { resolveCustomerPage, customerLoginHref } from "../customer-route";
import { moneyAccountHref } from "@/ui/money-account-routing";
import { transactionBelongsToCard } from "@/shared/cardholder-selection";
export type CardholderTaskQuery = Record<string, string | string[] | undefined>;
function exactId(value: string | string[] | undefined) {
  if (typeof value !== "string") throw new SecurityError("NOT_FOUND", 404);
  const parsed = z.uuid().safeParse(value);
  if (!parsed.success) throw new SecurityError("NOT_FOUND", 404);
  return parsed.data.toLowerCase();
}
export async function renderCardholderTask(task: CardholderTask, searchParams: Promise<CardholderTaskQuery>, pathname = `/cardholder-services/${task}`) {
  const route = await resolveCustomerPage(pathname, searchParams);
  if (!route) return <PageNotice title="This card view is unavailable"><p>Open your cards to continue.</p><Link href="/cardholder-services/cards">Your cards</Link></PageNotice>;
  const session = await getRequestSession().catch(() => undefined);
  if (session === undefined) return <PageNotice title="We couldn’t load your session"><p>Please try signing in again.</p></PageNotice>;
  if (!session) redirect(customerLoginHref(route.href));
  const query = route.query;
  try {
    const primaryService = await getPrimaryCardholderService(session.personId);
    const focusId = query.focus !== undefined ? exactId(query.focus) : undefined;
    let contextId = query.context !== undefined ? exactId(query.context) : undefined;
    if (!focusId && !contextId) {
      // A direct task link may use the person's own account or their sole
      // invited account. Never choose the first of several unrelated accounts.
      if (primaryService) contextId = primaryService.id;
      else {
        const dashboard = await getCardholderDashboard(session.personId);
        if (dashboard.profiles.length === 1) contextId = dashboard.profiles[0]!.id;
      }
      if (!contextId) return <PageNotice title="Choose a card to continue" authenticated><p>Open the card you want to view, then choose its activity or preferences.</p><Link href="/cardholder-services?view=cards">Choose a card</Link></PageNotice>;
    }
    const focused = focusId ? await getCardholderDashboardFocus(session.personId, focusId) : null;
    if (contextId && focused && contextId !== focused.card.serviceId) throw new SecurityError("NOT_FOUND", 404);
    const serviceId = focused?.card.serviceId ?? contextId!;
    const workspace = await getWorkspace(session.personId, serviceId);
    if (workspace.cardholderRole === "NONE" || (focusId && !workspace.cards.some(card => card.id === focusId))) throw new SecurityError("NOT_FOUND", 404);
    // A transaction deep link cannot swap the selected card or reveal an unavailable record.
    if (query.transaction !== undefined) {
      const transactionId = exactId(query.transaction);
      if (focusId ? !transactionBelongsToCard(workspace.activity,transactionId,focusId) : !workspace.activity.some(item => item.id === transactionId)) throw new SecurityError("NOT_FOUND", 404);
    }
    // Funding always belongs to the signed-in account owner, even while an
    // invited card is selected. Preferences for that invited account never
    // acquire an owner's balance-return action.
    const moneyAccount=primaryService?await (async()=>{
      try{const funds=await getCardholderFunds(session.personId,primaryService.id);return await getMoneyAccountOverview(session.personId,funds.moneyAccountId);}
      catch(error){if(error instanceof SecurityError&&[403,404].includes(error.status))return null;throw error;}
    })():null;
    const addMoneyHref=moneyAccount?.canAddMoney?moneyAccountHref(moneyAccount.id,null,{task:"add"}):undefined;
    const returnMoneyHref=workspace.cardholderRole==="OWNER"&&moneyAccount?.canWithdraw&&moneyAccount.services.some(service=>service.kind==="CARDHOLDER"&&service.id===workspace.service.id)?moneyAccountHref(moneyAccount.id,null,{task:"withdraw"}):undefined;
    const scopeKey = JSON.stringify([workspace.member.id, serviceId, workspace.cardholderRole, workspace.capabilities, workspace.cards.map(card => card.id), focusId]);
    let content;
    if (task === "activity") content = <ActivityWorkspace key={scopeKey} workspace={workspace} selectedCardId={focusId}/>;
    else if (task === "reports") content = workspace.capabilities.some(item => item.action === "activity.read" && item.allowed) ? <><p className="consumer-muted">{workspace.cardholderRole === "OWNER" ? "Reports include the cards you manage in this account." : "Reports include only your own card activity."}</p><ReportsWorkspace key={scopeKey} workspace={workspace} report={await getHistoricalReport(session.personId, serviceId)}/></> : <EmptyState title="Report access is restricted" description="You can’t view these reports with your current account access."/>;
    else if (task === "settings") content = <SettingsWorkspace key={scopeKey} workspace={workspace} returnMoneyHref={returnMoneyHref}/>;
    else if (task === "membership") content = <MembershipWorkspace initial={estimateMembership(sampleMembershipInput)}/>;
    else content = <HelpWorkspace key={scopeKey} workspace={workspace} selectedCardId={focusId}/>;
    return <WorkspaceShell workspace={workspace} section={task} selectedCardId={focusId} primaryService={primaryService} addMoneyHref={addMoneyHref}>{content}</WorkspaceShell>;
  } catch (error) {
    unstable_rethrow(error);
    const unavailable = error instanceof SecurityError && [403, 404, 422].includes(error.status);
    return <PageNotice title={unavailable ? "This card view is unavailable" : "We couldn’t load this card account"} authenticated><p>{unavailable ? "Your access or the selected item may have changed. No other card has been selected." : "Your saved records have not changed. Please try again."}</p><Link href="/cardholder-services?view=cards">Return to your cards</Link></PageNotice>;
  }
}

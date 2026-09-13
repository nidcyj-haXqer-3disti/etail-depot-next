"use client";
import Link from "next/link";
import type { CardholderServiceProfile } from "@/modules/workspace/dashboard-contracts";
import type { WorkspaceProjection } from "@/modules/workspace/contracts";
import { TaskSearch } from "./task-search";
import { Shell } from "../shell";
import { CardholderNavigation, type CardholderView } from "../cardholder-navigation";
import { cardholderHomeHref, cardholderTaskHref, type CardholderTask } from "../cardholder-routing";
import "../cardholder-dashboard.css";
import "./workspace.css";
const labels: Record<CardholderTask, string> = { activity: "Activity", reports: "Statements & reports", settings: "Account settings", help: "Help & support", membership: "Membership" };
export function WorkspaceShell({ workspace, section, selectedCardId, primaryService, children }: { workspace: WorkspaceProjection; section: CardholderTask; selectedCardId?: string; primaryService: CardholderServiceProfile | null; children: React.ReactNode }) {
  const card = workspace.cards.find(item => item.id === selectedCardId);
  const selection = { cardId: card?.id, contextId: workspace.service.id };
  function hrefFor(view: CardholderView) { return view === "activity" ? cardholderTaskHref("activity", selection) : cardholderHomeHref(undefined, view === "overview" ? {} : { view }); }
  const ownServiceId=primaryService?.id??(workspace.cardholderRole==="OWNER"?workspace.service.id:null);
  const accountSelection=ownServiceId?{contextId:ownServiceId}:selection;
  const title=section==="settings"&&workspace.cardholderRole!=="OWNER"?"Preferences":labels[section];
  return <Shell authenticated><div className="ch-dashboard"><CardholderNavigation active={section} primary={Boolean(ownServiceId)} hrefFor={hrefFor} fundsHref={ownServiceId?`/cardholder-services/funds?service=${ownServiceId}`:undefined} settingsHref={cardholderTaskHref("settings",accountSelection)}/><div className="ch-content">
    <header className="ch-heading"><div><p className="consumer-eyebrow"><Link href={cardholderHomeHref()}>Cards & spending</Link> / {title}</p><h1>{title}</h1><p>{card ? `${card.holderName} · ${card.nickname} · Ending ${card.lastFour}` : workspace.cardholderRole === "OWNER" ? "Your card account" : `Cards in your name · Account owner: ${workspace.customerService?.primaryName ?? "your account owner"}`}</p></div><TaskSearch workspace={workspace} primaryService={primaryService} selectedCardId={card?.id}/></header>
    {(section==="activity"||section==="reports")&&<nav className="ch-task-links" aria-label="Activity views"><Link aria-current={section==="activity"?"page":undefined} href={cardholderTaskHref("activity",selection)}>Transactions</Link>{workspace.capabilities.some(item=>item.action==="activity.read"&&item.allowed)&&<Link aria-current={section==="reports"?"page":undefined} href={cardholderTaskHref("reports",selection)}>Statements & reports</Link>}</nav>}
    {children}
  </div></div></Shell>;
}

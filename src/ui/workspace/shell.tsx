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
const labels: Record<CardholderTask, string> = { activity: "Activity", reports: "Statements & reports", settings: "Notification preferences", help: "Help & support", membership: "Membership" };
export function WorkspaceShell({ workspace, section, selectedCardId, primaryService, children }: { workspace: WorkspaceProjection; section: CardholderTask; selectedCardId?: string; primaryService: CardholderServiceProfile | null; children: React.ReactNode }) {
  const card = workspace.cards.find(item => item.id === selectedCardId);
  const selection = { cardId: card?.id, contextId: workspace.service.id };
  function hrefFor(view: CardholderView) { return view === "activity" ? cardholderTaskHref("activity", selection) : cardholderHomeHref(card?.id, view === "overview" ? {} : { view }); }
  return <Shell authenticated><div className="ch-dashboard"><CardholderNavigation active={section} primary={Boolean(primaryService) || workspace.cardholderRole === "OWNER"} hrefFor={hrefFor}/><div className="ch-content">
    <header className="ch-heading"><div><p className="consumer-eyebrow"><Link href={cardholderHomeHref(card?.id)}>Cards & spending</Link> / {labels[section]}</p><h1>Cards & spending</h1><p>{card ? `${card.holderId === workspace.member.id ? "Your card" : "Card you manage"} · ${card.nickname} · Ending ${card.lastFour} · ${card.holderName}` : "Your card account"}</p></div><TaskSearch workspace={workspace} primaryService={primaryService} selectedCardId={card?.id}/></header>
    <nav className="ch-task-links" aria-label="Card options"><Link href={cardholderHomeHref(card?.id)}>Back to cards</Link>{workspace.capabilities.some(item => item.action === "activity.read" && item.allowed) && <Link aria-current={section === "reports" ? "page" : undefined} href={cardholderTaskHref("reports",selection)}>Statements & reports</Link>}<Link aria-current={section === "settings" ? "page" : undefined} href={cardholderTaskHref("settings",selection)}>Notification preferences</Link><Link aria-current={section === "help" ? "page" : undefined} href={cardholderTaskHref("help",selection)}>Help & support</Link>{card && workspace.cardholderRole === "OWNER" && workspace.capabilities.some(item => item.action === "people.read" && item.allowed) && <Link href={cardholderHomeHref(card.id,{manage:workspace.service.id})}>Manage people</Link>}</nav>
    {children}
  </div></div></Shell>;
}

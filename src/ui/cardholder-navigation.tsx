"use client";
import Link from "next/link";
import { WorkspaceIcon } from "./workspace/navigation";
export const cardholderViews = ["overview", "cards", "activity", "cardholders", "requests"] as const;
export type CardholderView = typeof cardholderViews[number];
export const cardholderViewLabels: Record<CardholderView, string> = { overview: "Account home", cards: "Cards", activity: "Activity", cardholders: "Cardholders", requests: "Card history" };
/** Actions live on their account or card; this navigation contains destinations only. */
export function CardholderNavigation({ active, primary, hrefFor, settingsHref }: { active: string; primary: boolean; hrefFor: (view: CardholderView) => string; settingsHref?:string; addCardHref?:string }) {
  const accountHref=settingsHref??hrefFor("activity").replace(/^\/cardholder-services\/activity(?=\?|$)/,"/cardholder-services/settings");
  const selected=["cardholders","requests"].includes(active)?"cards":active==="reports"?"activity":active==="funds"?"overview":["help","membership"].includes(active)?"settings":active;
  const destinations=[
    {key:"overview",label:"Account home",href:hrefFor("overview"),icon:"overview"},
    {key:"cards",label:"Cards",href:hrefFor("cards"),icon:"cards"},
    {key:"activity",label:"Activity",href:hrefFor("activity"),icon:"activity"},
    {key:"settings",label:primary?"Account settings":"Preferences",href:accountHref,icon:"settings"},
  ] as const;
  return <aside className="ch-sidebar"><p className="consumer-eyebrow">Cards & spending</p><nav aria-label="Cards and spending navigation">{destinations.map(item=><Link key={item.key} href={item.href} aria-current={selected===item.key?"page":undefined}><WorkspaceIcon name={item.icon}/>{item.label}</Link>)}</nav></aside>;
}

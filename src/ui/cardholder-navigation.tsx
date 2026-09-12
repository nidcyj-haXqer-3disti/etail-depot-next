"use client";
import Link from "next/link";
import type {MouseEvent} from "react";
import { WorkspaceIcon } from "./workspace/navigation";
export const cardholderViews = ["overview", "cards", "activity", "cardholders", "requests"] as const;
export type CardholderView = typeof cardholderViews[number];
export const cardholderViewLabels: Record<CardholderView, string> = { overview: "Home", cards: "Cards", activity: "Activity", cardholders: "People", requests: "Requests" };
const icons = { overview: "overview", cards: "cards", activity: "activity", cardholders: "people", requests: "reports" } as const;
export function CardholderNavigation({ active, primary, hrefFor, fundsHref="/cardholder-services/funds", settingsHref, addCardHref }: { active: string; primary: boolean; hrefFor: (view: CardholderView) => string; fundsHref?:string; settingsHref?:string; addCardHref?:string }) {
  function closeMore(event:MouseEvent<HTMLAnchorElement>){event.currentTarget.closest("details")?.removeAttribute("open");}
  const accountHref=settingsHref??hrefFor("activity").replace(/^\/cardholder-services\/activity(?=\?|$)/,"/cardholder-services/settings");
  const moreActive = ["requests","funds","settings","reports","help","membership"].includes(active);
  return <aside className="ch-sidebar"><p className="consumer-eyebrow">CARDHOLDER SERVICES</p><nav aria-label="Cardholder navigation">{cardholderViews.filter(item => item!=="requests"&&(primary||item!=="cardholders")).map(item => <Link key={item} href={hrefFor(item)} aria-current={active === item ? "page" : undefined}><WorkspaceIcon name={icons[item]}/>{cardholderViewLabels[item]}</Link>)}<details className="ch-more" key={active}><summary aria-current={moreActive?"page":undefined}>More<WorkspaceIcon name="arrow"/></summary><div className="ch-more-links">{primary&&<><Link onClick={closeMore} href={fundsHref} aria-current={active==="funds"?"page":undefined}><WorkspaceIcon name="reports"/>Add money</Link>{addCardHref&&<Link onClick={closeMore} href={addCardHref} scroll={false}><WorkspaceIcon name="plus"/>Add card</Link>}<Link onClick={closeMore} href={hrefFor("requests")} aria-current={active==="requests"?"page":undefined}><WorkspaceIcon name="reports"/>Requests</Link></>}<Link onClick={closeMore} href={accountHref} aria-current={active==="settings"?"page":undefined}><WorkspaceIcon name="shield"/>Account services</Link></div></details></nav></aside>;
}

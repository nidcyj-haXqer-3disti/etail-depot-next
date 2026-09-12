import Link from "next/link";
import { WorkspaceIcon } from "./workspace/navigation";
export const cardholderViews = ["overview", "cards", "activity", "cardholders", "requests"] as const;
export type CardholderView = typeof cardholderViews[number];
export const cardholderViewLabels: Record<CardholderView, string> = { overview: "Home", cards: "Cards", activity: "Activity", cardholders: "Cardholders", requests: "Requests" };
const icons = { overview: "overview", cards: "cards", activity: "activity", cardholders: "people", requests: "reports" } as const;
export function CardholderNavigation({ active, primary, hrefFor }: { active: string; primary: boolean; hrefFor: (view: CardholderView) => string }) {
  return <aside className="ch-sidebar"><p className="consumer-eyebrow">CARDHOLDER SERVICES</p><nav aria-label="Cardholder navigation">{cardholderViews.filter(item => primary || !["cardholders", "requests"].includes(item)).map(item => <Link key={item} href={hrefFor(item)} aria-current={active === item ? "page" : undefined}><WorkspaceIcon name={icons[item]}/>{cardholderViewLabels[item]}</Link>)}{primary&&<Link href="/cardholder-services/funds" aria-current={active==="funds"?"page":undefined}><WorkspaceIcon name="reports"/>Add money</Link>}<Link href="/cardholder-services/settings" aria-current={active==="settings"?"page":undefined}><WorkspaceIcon name="shield"/>Account services</Link></nav></aside>;
}

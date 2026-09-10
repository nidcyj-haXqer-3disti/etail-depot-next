import Link from "next/link";
import { WorkspaceIcon } from "./workspace/navigation";
export const cardholderViews = ["overview", "cards", "activity", "cardholders", "requests"] as const;
export type CardholderView = typeof cardholderViews[number];
export const cardholderViewLabels: Record<CardholderView, string> = { overview: "Overview", cards: "Cards", activity: "Activity", cardholders: "Cardholders", requests: "Saved requests" };
const icons = { overview: "overview", cards: "cards", activity: "activity", cardholders: "people", requests: "reports" } as const;
export function CardholderNavigation({ active, primary, hrefFor }: { active: string; primary: boolean; hrefFor: (view: CardholderView) => string }) {
  return <aside className="ch-sidebar"><p className="consumer-eyebrow">CARDHOLDER SERVICES</p><nav aria-label="Cardholder navigation">{cardholderViews.filter(item => primary || !["cardholders", "requests"].includes(item)).map(item => <Link key={item} href={hrefFor(item)} aria-current={active === item ? "page" : undefined}><WorkspaceIcon name={icons[item]}/>{cardholderViewLabels[item]}</Link>)}</nav><div className="ch-sidebar-rule"/><Link className="ch-invitations-link" href="/services#invitation-heading"><WorkspaceIcon name="bell"/>Invitations</Link></aside>;
}

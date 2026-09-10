"use client";

import Link from "next/link";
import { CardholderEnrollment } from "./cardholder-enrollment";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AccessOverview } from "@/modules/access/contracts";
import type { CardholderDashboardDetail, CardholderDashboardFocus, CardholderDashboardProjection, DashboardCard } from "@/modules/workspace/dashboard-contracts";
import { CardsWorkspace } from "./workspace/cards";
import { ActivityDetails } from "./workspace/activity";
import { PeopleWorkspace } from "./workspace/people";
import { CardPreview } from "./workspace/card-art";
import { Button, EmptyState, StatusBadge, WorkspaceDialog, formatDate } from "./workspace/primitives";
import { CardholderNavigation } from "./cardholder-navigation";
import { cardholderTaskHref } from "./cardholder-routing";
import { WorkspaceIcon } from "./workspace/navigation";
import { TaskSearch } from "./workspace/task-search";
import "./workspace/workspace.css";
import "./cardholder-dashboard.css";

const base = "/cardholder-services";
const views = ["overview", "cards", "activity", "cardholders", "requests"] as const;
type View = typeof views[number];
const viewLabels: Record<View, string> = { overview: "Overview", cards: "Cards", activity: "Activity", cardholders: "Cardholders", requests: "Saved requests" };

export function CardholderDashboard({ dashboard, detail, access, selectionUnavailable = false, focusedCard = null, focusedWorkspace = null, focusUnavailable = false }: {
  dashboard: CardholderDashboardProjection;
  detail: CardholderDashboardDetail | null;
  access?: AccessOverview;
  selectionUnavailable?: boolean;
  focusedCard?: DashboardCard | null;
  focusedWorkspace?: CardholderDashboardFocus["workspace"] | null;
  focusUnavailable?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const requestedView = params.get("view");
  const view: View = views.includes(requestedView as View) ? requestedView as View : params.has("activityCard") ? "activity" : params.has("page") ? "cards" : "overview";
  const [cardSearch, setCardSearch] = useState("");
  const [controlIntent, setControlIntent] = useState<string | null>(null);
  const primary = dashboard.primaryService;
  const hasPrimary = Boolean(primary || dashboard.cards.some(card => card.accessRole === "PRIMARY"));
  const hasSecondary = dashboard.profiles.some(profile => profile.relationship === "SECONDARY") || dashboard.cards.some(card => card.accessRole === "SECONDARY");
  const cards = dashboard.cards.filter(card => `${card.nickname} ${card.holderName} ${card.lastFour}`.toLowerCase().includes(cardSearch.trim().toLowerCase()));
  const managed = cards.filter(card => card.accessRole === "PRIMARY");
  const secondary = cards.filter(card => card.accessRole === "SECONDARY");
  const cardholders = new Map<string, { name: string; cards: DashboardCard[] }>();
  for (const card of dashboard.cards.filter(item => item.accessRole === "PRIMARY" && item.holderId !== dashboard.person.id)) {
    const holder = cardholders.get(card.holderId) ?? { name: card.holderName, cards: [] };
    holder.cards.push(card);
    cardholders.set(card.holderId, holder);
  }
  const rawFocus = params.has("focus") ? params.getAll("focus") : focusUnavailable ? params.getAll("activityCard") : [];
  const focus = !focusUnavailable && focusedCard && focusedWorkspace?.cards.some(card => card.id === focusedCard.id) ? focusedCard : null;
  const choices = dashboard.cards.some(card => card.id === focus?.id) || !focus ? dashboard.cards : [focus, ...dashboard.cards];
  const focusedActivity = focus && focusedWorkspace ? focusedWorkspace.activity.filter(item => item.cardId === focus.id).map(item => ({ ...item, cardNickname: focus.nickname, lastFour: focus.lastFour, holderName: focus.holderName })) : [];
  const selectedActivity = detail?.kind === "ACTIVITY" ? detail.workspace.activity.find(item => item.id === params.get("transaction")?.toLowerCase()) : undefined;

  function preserveFocus(query: URLSearchParams) {
    // An unavailable repeated/empty selection stays unavailable until a deliberate choice.
    if (rawFocus.length) for (const value of rawFocus) query.append("focus", value.toLowerCase());
    else if (focus) query.set("focus", focus.id);
  }
  function viewHref(next: View, page = 0) {
    const query = new URLSearchParams();
    if (!["overview", "activity"].includes(next)) query.set("view", next);
    if (page > 0) query.set("page", String(page));
    preserveFocus(query);
    return `${next === "activity" ? `${base}/activity` : base}${query.size ? `?${query}` : ""}`;
  }
  function href(key: string, value: string) {
    const query = new URLSearchParams();
    if (view !== "overview") query.set("view", view);
    if (dashboard.cardsPage > 0 && ["cards", "cardholders"].includes(view)) query.set("page", String(dashboard.cardsPage));
    preserveFocus(query);
    query.set(key, value);
    return `${base}?${query}`;
  }
  function closeDetail() {
    const query = new URLSearchParams(params.toString());
    for (const key of ["card", "request", "new", "manage", "transaction"]) query.delete(key);
    router.replace(`${base}${query.size ? `?${query}` : ""}`, { scroll: false });
  }
  function chooseCard(cardId: string) {
    if (!cardId) return;
    const query = new URLSearchParams(params.toString());
    for (const key of ["card", "request", "new", "manage", "transaction", "activityCard"]) query.delete(key);
    query.set("focus", cardId);
    router.push(`${base}?${query}`, { scroll: false });
  }
  function focusHref(cardId: string) {
    const query = new URLSearchParams();
    query.set("focus", cardId);
    return `${base}?${query}`;
  }
  const scopeKey = detail ? JSON.stringify([detail.kind, detail.workspace.service.id, detail.workspace.cardholderRole, detail.workspace.capabilities.filter(item => item.allowed).map(item => item.action), detail.workspace.cards.map(card => card.id)]) : "none";

  function cardSection(title: string, description: string, values: DashboardCard[], id: string) {
    return <section className="ch-section" aria-labelledby={id}>
      <div className="ch-section-heading"><div><h3 id={id}>{title}</h3><p>{description}</p></div></div>
      {values.length ? <div className="ch-card-grid">{values.map(card => <article className="ch-card" key={card.id}>
        <Link className="ch-card-open" href={href("card", card.id)} scroll={false} aria-label={`Manage ${card.nickname}, ending ${card.lastFour}, ${card.status.toLowerCase()}`}>
          <CardPreview card={card}/><div className="ch-card-title"><h4>{card.nickname}</h4><StatusBadge status={card.status}/></div>
          <p className="ch-card-holder">{card.holderName}<span>{card.relationship === "PRIMARY" ? "Primary card" : "Secondary card"}</span></p>
          {card.accessRole === "SECONDARY" && <p className="ch-card-primary">Primary cardholder: {card.primaryName}</p>}
          <div className="ch-card-balance"><span>Available to spend</span><strong>{card.available.formatted}</strong></div>
          <span className="ch-card-action">Manage card <WorkspaceIcon name="arrow"/></span>
        </Link>
        {card.canManageAccess && <Link className="ch-card-access" href={href("manage", card.serviceId)} scroll={false}>Review cardholder access <WorkspaceIcon name="people"/></Link>}
      </article>)}</div> : <EmptyState title={cardSearch ? "No matching cards" : id === "managed-cards" ? "Ready for your first card?" : "No secondary cards yet"} description={cardSearch ? "Try a different card name, cardholder or last four digits." : id === "managed-cards" ? "Add a card for yourself or an invited cardholder." : "Cards assigned to you will appear here after you accept an invitation."}>{cardSearch && <Button variant="secondary" onClick={() => setCardSearch("")}>Clear search</Button>}</EmptyState>}
    </section>;
  }
  function activityList(rows: typeof dashboard.activity) {
    return <div className="ch-activity-list">{rows.map(item => <Link className="ch-activity-row" href={href("transaction", item.id)} key={item.id} scroll={false}><span className="ch-transaction-icon"><WorkspaceIcon name="activity"/></span><span className="ch-transaction-name"><strong>{item.title}</strong><span>{item.cardNickname} · {item.lastFour}</span><small>{item.holderName} · {formatDate(item.occurredAt)}</small></span><span className="ch-transaction-value"><strong>{item.direction === "CREDIT" ? "+" : ""}{item.amount.formatted}</strong><StatusBadge status={item.status}/></span><WorkspaceIcon name="chevron"/></Link>)}</div>;
  }
  function requestList(rows: typeof dashboard.requests) {
    return <div className="ch-request-list">{rows.map(request => <Link href={href("request", request.id)} scroll={false} className="ch-request-row" key={request.id}><span className="ch-transaction-icon"><WorkspaceIcon name="cards"/></span><span><strong>{request.nickname || "New card request"}</strong><small>{request.holderName} · Saved {formatDate(request.updatedAt)}</small></span><StatusBadge status={request.status} label={request.status === "BLOCKED" ? "Needs attention" : undefined}/><WorkspaceIcon name="arrow"/></Link>)}</div>;
  }
  function cardSummary(rows: DashboardCard[]) {
    return <div className="ch-card-summary-list">{rows.map(card => <Link className="ch-card-summary" href={focusHref(card.id)} key={card.id} scroll={false}><span className="ch-summary-art"><CardPreview card={card}/></span><span><strong>{card.nickname}</strong><small>{card.holderName} · {card.lastFour}</small><small>{card.relationship === "PRIMARY" ? "Primary card" : "Secondary card"}</small></span><span className="ch-summary-amount"><strong>{card.available.formatted}</strong><small>Available to spend</small><StatusBadge status={card.status}/></span><WorkspaceIcon name="chevron"/></Link>)}</div>;
  }
  function pagination(next: "cards" | "cardholders") {
    return (dashboard.cardsPage > 0 || dashboard.cardsHasMore) && <nav className="ch-pagination" aria-label="Card pages">{dashboard.cardsPage > 0 && <Link className="consumer-button consumer-button-secondary" href={viewHref(next, dashboard.cardsPage - 1)}>Previous cards</Link>}<span>Page {dashboard.cardsPage + 1}</span>{dashboard.cardsHasMore && <Link className="consumer-button consumer-button-secondary" href={viewHref(next, dashboard.cardsPage + 1)}>Next cards</Link>}</nav>;
  }

  return <div className="ch-dashboard">
    <CardholderNavigation active={view} primary={hasPrimary} hrefFor={viewHref}/>
    <div className="ch-content">
      <header className="ch-heading"><div><p className="consumer-eyebrow">WELCOME, {dashboard.person.displayName}</p><h1>Cardholder services</h1><p>{hasPrimary ? "Manage your cards and the people who use them." : "Your cards and purchases, together."}</p></div><TaskSearch workspace={detail?.workspace ?? focusedWorkspace ?? undefined} primaryService={primary} selectedCardId={focus?.id}/></header>
      {!primary && dashboard.cardCount === 0 && dashboard.canCreatePrimary && <CardholderEnrollment/>}
      {dashboard.cardCount > 0 && <div className="ch-card-choice"><label htmlFor="ch-selected-card">Selected card</label><div><select id="ch-selected-card" value={focus?.id ?? ""} onChange={event => chooseCard(event.target.value)}><option value="" disabled>{focusUnavailable ? "Choose another card" : "Choose a card"}</option>{(["PRIMARY", "SECONDARY"] as const).map(role => <optgroup key={role} label={role === "PRIMARY" ? "Cards you manage" : "Your secondary cards"}>{choices.filter(card => card.accessRole === role).map(card => <option key={card.id} value={card.id}>{card.nickname} · {card.holderName} · {card.lastFour}</option>)}</optgroup>)}</select>{(dashboard.cardsHasMore || dashboard.cardsPage > 0) && <Link href={viewHref("cards",dashboard.cardsPage)}>Browse card pages</Link>}</div>{focus && <p>{focus.accessRole === "PRIMARY" ? `Primary cardholder: ${focus.primaryName}` : `Your secondary card · Primary cardholder: ${focus.primaryName}`}</p>}</div>}
      <div className="ch-view-heading"><h2>{viewLabels[view]}</h2><div className="ch-primary-actions">{primary?.canAddCard && <Link className={`consumer-button ${view === "overview" ? "consumer-button-secondary" : "consumer-button-primary"}`} href={href("new", "1")} scroll={false}><WorkspaceIcon name="plus"/>Add card</Link>}{primary?.canInvite && ["cards", "cardholders"].includes(view) && <Link className="consumer-button consumer-button-secondary" href={href("manage", primary.id)} scroll={false}><WorkspaceIcon name="people"/>Add cardholder</Link>}</div></div>
      {focusUnavailable && <section className="ch-selection-notice" role="alert"><h2>This card is unavailable</h2><p>You may no longer have access. Choose an available card above to continue.</p></section>}
      {selectionUnavailable && <section className="ch-selection-notice" role="alert"><h2>This cardholder view is unavailable</h2><p>You may no longer have access, or this item may have changed.</p><Button variant="secondary" onClick={closeDetail}>Return to your cards</Button></section>}
      {detail?.kind === "PEOPLE" ? <section className="ch-access-panel" aria-label="Selected cardholder access"><div className="ch-access-back"><Button variant="quiet" onClick={closeDetail}>← Back</Button></div>{params.get("manage") === primary?.id && <div className="ch-invite-context"><h2>Invite a cardholder for new cards</h2><p>After they accept, you can add a card for them. To change access to an existing card, open its cardholder below.</p><Link href={viewHref("cardholders")}>Review existing cardholders</Link></div>}<PeopleWorkspace key={JSON.stringify([scopeKey,access?.people.map(person=>[person.id,person.state,person.version,person.permissions])])} workspace={detail.workspace} access={access}/></section> : <>
        {view === "overview" && <div className="ch-overview">
          {focus && focusedWorkspace ? <>
            <section className="ch-focused-card" aria-label="Selected card overview">
              <div className="ch-focus-art"><CardPreview card={focus}/></div>
              <div className="ch-focus-info"><div className="ch-focus-title"><h3>{focus.nickname}</h3><StatusBadge status={focus.status}/></div><p>{focus.holderName} · Ending {focus.lastFour}</p><p className="ch-focus-relationship">{focus.relationship === "PRIMARY" ? "Primary card" : "Secondary card"}</p><dl className="ch-focus-balance"><dt>Available to spend</dt><dd>{focus.available.formatted}</dd></dl>
                <div className="ch-focus-actions">{(focus.status === "FROZEN" ? focus.canUnfreeze : focus.canFreeze) && <Button onClick={() => {setControlIntent(focus.id);router.push(href("card",focus.id),{scroll:false});}}>{focus.status === "FROZEN" ? "Unfreeze card" : "Freeze card"}</Button>}<Link className="consumer-button consumer-button-secondary" href={href("card",focus.id)} onClick={() => setControlIntent(null)} scroll={false}>Card controls <WorkspaceIcon name="cards"/></Link><Link className="ch-section-link" href={cardholderTaskHref("activity",{cardId:focus.id})}>View this card’s activity <WorkspaceIcon name="arrow"/></Link></div>
              </div>
              <div className="ch-focus-services" aria-label="Selected card services">{focusedWorkspace.capabilities.some(item => item.action === "activity.read" && item.allowed) && <Link href={cardholderTaskHref("reports",{cardId:focus.id})}><WorkspaceIcon name="reports"/><span><strong>Statements & reports</strong><small>Reports for the cards you can view in this service</small></span><WorkspaceIcon name="chevron"/></Link>}<Link href={cardholderTaskHref("settings",{cardId:focus.id})}><WorkspaceIcon name="bell"/><span><strong>Notification preferences</strong><small>Choose your card updates</small></span><WorkspaceIcon name="chevron"/></Link><Link href={cardholderTaskHref("help",{cardId:focus.id})}><WorkspaceIcon name="help"/><span><strong>Help & support</strong><small>Find answers or save a question</small></span><WorkspaceIcon name="chevron"/></Link></div>
            </section>
            <section className="ch-focus-activity" aria-labelledby="ch-overview-activity-title"><div className="ch-section-heading"><div><h3 id="ch-overview-activity-title">Recent activity</h3><p>{focus.nickname} · Ending {focus.lastFour}</p></div><Link className="ch-section-link" href={viewHref("activity")}>View activity <WorkspaceIcon name="arrow"/></Link></div>{focusedActivity.length ? activityList(focusedActivity.slice(0,5)) : <div className="ch-empty">No purchases on this card yet.</div>}</section>
          </> : !focusUnavailable && <section className="ch-focus-empty">{dashboard.cardCount ? <><WorkspaceIcon name="cards"/><h3>Choose the card you want to manage</h3><p>See its balance, activity and available controls together.</p></> : <EmptyState title={primary?.canAddCard ? "Ready for your first card?" : "Your cards will appear here"} description={primary?.canAddCard ? "Choose Add card to get started. You can save your progress at any time." : dashboard.canCreatePrimary ? "Set up your cardholder service above, or review an invitation to join an existing card group." : "Complete sandbox setup to create practice cards, or review an invitation to join a card group."}>{!primary?.canAddCard && <Link className="consumer-button consumer-button-secondary" href="/services">{dashboard.canCreatePrimary ? "Review invitations" : "Open services"}</Link>}</EmptyState>}</section>}
          {hasPrimary && dashboard.cards.some(card => card.accessRole === "PRIMARY" && card.id !== focus?.id) && <section className="ch-overview-cards" aria-labelledby="ch-overview-cards-title"><div className="ch-section-heading"><div><h3 id="ch-overview-cards-title">{focus ? "Other cards you manage" : "Cards you manage"}</h3><p>Your cards and connected secondary cards.</p></div><Link className="ch-section-link" href={viewHref("cards")}>View all cards <WorkspaceIcon name="arrow"/></Link></div>{cardSummary(dashboard.cards.filter(card => card.accessRole === "PRIMARY" && card.id !== focus?.id).slice(0,3))}</section>}
          {dashboard.cards.some(card => card.accessRole === "SECONDARY" && card.id !== focus?.id) && <section className="ch-overview-cards" aria-labelledby="ch-overview-secondary-title"><div className="ch-section-heading"><h3 id="ch-overview-secondary-title">Your secondary cards</h3><Link className="ch-section-link" href={viewHref("cards")}>View all cards <WorkspaceIcon name="arrow"/></Link></div>{cardSummary(dashboard.cards.filter(card => card.accessRole === "SECONDARY" && card.id !== focus?.id).slice(0,3))}</section>}
          {hasPrimary && dashboard.requests.length > 0 && <aside className="ch-request-attention"><WorkspaceIcon name="cards"/><div><strong>You have a saved card request</strong><p>Continue when you’re ready to finish.</p></div><Link href={viewHref("requests")}>View saved requests <WorkspaceIcon name="arrow"/></Link></aside>}
        </div>}
        {view === "cards" && <section id="cards" className="ch-cards" aria-label="Your cards"><div className="ch-card-tools"><label><WorkspaceIcon name="search"/><span className="consumer-sr-only">Search your cards</span><input type="search" value={cardSearch} onChange={event => setCardSearch(event.target.value)} placeholder="Card name, cardholder or last four" maxLength={100}/></label><p>{dashboard.cardCount} {dashboard.cardCount === 1 ? "card" : "cards"}{dashboard.cardsHasMore || dashboard.cardsPage > 0 ? ` · Search covers page ${dashboard.cardsPage + 1}` : ""}</p></div>
          {hasPrimary && cardSection("Cards you manage", `Primary cardholder: ${primary?.primaryName ?? dashboard.person.displayName}`, managed, "managed-cards")}
          {hasSecondary && cardSection("Your secondary cards", "Cards assigned to you. Each card names its primary cardholder.", secondary, "secondary-cards")}
          {!dashboard.cards.length && !hasPrimary && !hasSecondary && <EmptyState title="Your cards will appear here" description="Review your invitations to get started."><Link className="consumer-button consumer-button-secondary" href="/services#invitation-heading">Review invitations</Link></EmptyState>}
          {pagination("cards")}
        </section>}
        {view === "cardholders" && <section id="cardholders" className="ch-section" aria-labelledby="ch-cardholders-title"><div className="ch-section-heading"><div><h3 id="ch-cardholders-title">Secondary cardholders</h3><p>{dashboard.cardsHasMore || dashboard.cardsPage > 0 ? `Showing cardholders for cards on page ${dashboard.cardsPage + 1}.` : "Review a person’s cards and choose the access they need."}</p></div></div>{cardholders.size ? <div className="ch-cardholder-list">{Array.from(cardholders.entries()).map(([id, holder]) => <article className="ch-cardholder" key={id}><span className="ch-transaction-icon"><WorkspaceIcon name="people"/></span><div><h4>{holder.name}</h4><ul>{holder.cards.map(card => <li key={card.id}><Link href={href("card",card.id)} scroll={false}>{card.nickname} · {card.lastFour}</Link>{card.canManageAccess && <Link className="ch-cardholder-review" href={href("manage",card.serviceId)} scroll={false} aria-label={`Review access for ${holder.name}, ${card.nickname}, ending ${card.lastFour}`}>Review access <WorkspaceIcon name="arrow"/></Link>}</li>)}</ul></div></article>)}</div> : <EmptyState title={hasPrimary ? "No secondary cardholders yet" : "Cardholder management is unavailable"} description={hasPrimary ? "Invite someone, then add a card after they accept." : "Your primary cardholder manages access to your cards."}/>}{hasPrimary && pagination("cardholders")}</section>}
        {view === "requests" && <section id="requests" className="ch-section" aria-labelledby="ch-requests-title"><div className="ch-section-heading"><div><h3 id="ch-requests-title">Saved card requests</h3><p>Your 20 most recent unfinished requests.</p></div></div>{dashboard.requests.length ? requestList(dashboard.requests) : <EmptyState title="No saved requests" description={primary?.canAddCard ? "Start with Add card. Your progress is saved until you’re ready to finish." : "Requests are managed by the primary cardholder."}/>}</section>}
      </>}
      {!primary && dashboard.cardCount > 0 && dashboard.canCreatePrimary && <CardholderEnrollment/>}
    </div>
    {detail && ["CARD", "REQUEST", "NEW"].includes(detail.kind) && <CardsWorkspace key={scopeKey} workspace={detail.workspace} routeBase={base} initialControl={Boolean(controlIntent && controlIntent === params.get("card"))} onClose={() => setControlIntent(null)}/>}
    {detail?.kind === "ACTIVITY" && selectedActivity && <WorkspaceDialog open title="Transaction details" serviceName={detail.workspace.customerService?.displayName ?? "Cardholder services"} onClose={closeDetail}><ActivityDetails item={selectedActivity} workspace={detail.workspace}/><div className="consumer-action-row"><Button variant="secondary" onClick={closeDetail}>Back to activity</Button></div></WorkspaceDialog>}
  </div>;
}

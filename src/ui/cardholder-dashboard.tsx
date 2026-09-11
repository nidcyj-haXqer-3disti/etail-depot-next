"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { WorkspaceProjection } from "@/modules/workspace/contracts";
import type { AccessOverview } from "@/modules/access/contracts";
import type { CardholderDashboardDetail, CardholderDashboardFocus, CardholderDashboardProjection, DashboardCard } from "@/modules/workspace/dashboard-contracts";
import { CardholderEnrollment } from "./cardholder-enrollment";
import { CardsWorkspace } from "./workspace/cards";
import { ActivityDetails } from "./workspace/activity";
import { PeopleWorkspace } from "./workspace/people";
import { CardPreview } from "./workspace/card-art";
import { Button, EmptyState, StatusBadge, WorkspaceDialog, formatDate } from "./workspace/primitives";
import { CardholderNavigation, cardholderViewLabels, type CardholderView } from "./cardholder-navigation";
import { cardholderTaskHref } from "./cardholder-routing";
import { WorkspaceIcon } from "./workspace/navigation";
import { TaskSearch } from "./workspace/task-search";
import "./workspace/workspace.css";
import "./cardholder-dashboard.css";

const base = "/cardholder-services";
const views = ["overview", "cards", "activity", "cardholders", "requests"] as const;
const detailKeys = ["card", "request", "new", "manage", "transaction", "holder", "review", "cardTask"];

export function CardholderDashboard({ dashboard, detail, access, managementWorkspace, selectedPersonId, personUnavailable = false, selectionUnavailable = false, focusedCard = null, focusedWorkspace = null, focusUnavailable = false }: {
  dashboard: CardholderDashboardProjection; detail: CardholderDashboardDetail | null; access?: AccessOverview;
  managementWorkspace?: WorkspaceProjection; selectedPersonId?: string; personUnavailable?: boolean;
  selectionUnavailable?: boolean; focusedCard?: DashboardCard | null;
  focusedWorkspace?: CardholderDashboardFocus["workspace"] | null; focusUnavailable?: boolean;
}) {
  const router = useRouter(), params = useSearchParams();
  const requestedView = params.get("view");
  const view: CardholderView = detail?.kind === "PEOPLE" ? "cardholders" : views.includes(requestedView as CardholderView) ? requestedView as CardholderView : params.has("activityCard") ? "activity" : params.has("page") ? "cards" : "overview";
  const [controlIntent, setControlIntent] = useState<{ id: string; action: "freeze" | "unfreeze" } | null>(null);
  const primary = dashboard.primaryService;
  const hasPrimary = Boolean(primary || dashboard.profiles.some(profile => profile.relationship === "PRIMARY"));
  const secondaryProfiles = dashboard.profiles.filter(profile => profile.relationship === "SECONDARY");
  const waitingForFirstCard = dashboard.cardCount === 0 && secondaryProfiles.length > 0;
  const owns = (card: DashboardCard) => card.holderId === dashboard.person.id;
  const ownCards = dashboard.cards.filter(owns), managedCards = dashboard.cards.filter(card => !owns(card));
  const rawFocus = params.has("focus") ? params.getAll("focus") : focusUnavailable ? params.getAll("activityCard") : [];
  const focus = !focusUnavailable && focusedCard && focusedWorkspace?.cards.some(card => card.id === focusedCard.id) ? focusedCard : null;
  const choices = !focus || dashboard.cards.some(card => card.id === focus.id) ? dashboard.cards : [focus, ...dashboard.cards];
  const focusedActivity = focus && focusedWorkspace ? focusedWorkspace.activity.filter(item => item.cardId === focus.id).map(item => ({ ...item, cardNickname: focus.nickname, lastFour: focus.lastFour, holderName: focus.holderName })) : [];
  const selectedActivity = detail?.kind === "ACTIVITY" ? detail.workspace.activity.find(item => item.id === params.get("transaction")?.toLowerCase()) : undefined;
  const selection = { cardId: focus?.id, contextId: primary?.id ?? (secondaryProfiles.length === 1 ? secondaryProfiles[0]?.id : undefined) };

  function preserveFocus(query: URLSearchParams) {
    if (rawFocus.length) for (const value of rawFocus) query.append("focus", value.toLowerCase());
    else if (focus) query.set("focus", focus.id);
  }
  function viewHref(next: CardholderView, page = dashboard.cardsPage) {
    const query = new URLSearchParams();
    if (!["overview", "activity"].includes(next)) query.set("view", next);
    if (next === "cards") {
      if (page > 0) query.set("page", String(page));
      if (dashboard.cardScope !== "ALL") query.set("cardScope", dashboard.cardScope);
      if (dashboard.cardSearch) query.set("cardSearch", dashboard.cardSearch);
    }
    preserveFocus(query);
    return `${next === "activity" ? `${base}/activity` : base}${query.size ? `?${query}` : ""}`;
  }
  function href(key: string, value: string, task?: "purchase" | "controls") {
    const query = new URLSearchParams(params.toString());
    for (const item of [...detailKeys, "focus"]) query.delete(item);
    if (view !== "overview") query.set("view", view);
    preserveFocus(query); query.set(key, value);
    if (task) query.set("cardTask", task);
    return `${base}?${query}`;
  }
  function closeDetail() {
    const query = new URLSearchParams(params.toString());
    for (const key of detailKeys) query.delete(key);
    router.replace(`${base}${query.size ? `?${query}` : ""}`, { scroll: false });
  }
  function focusHref(cardId: string) {
    const query = new URLSearchParams({ view: "overview", focus: cardId });
    if (dashboard.cardScope !== "ALL") query.set("cardScope", dashboard.cardScope);
    if (dashboard.cardSearch) query.set("cardSearch", dashboard.cardSearch);
    if (dashboard.cardsPage > 0) query.set("page", String(dashboard.cardsPage));
    return `${base}?${query}`;
  }
  function chooseCard(cardId: string) {
    if (!cardId) return;
    const query = new URLSearchParams(params.toString());
    for (const key of [...detailKeys, "activityCard"]) query.delete(key);
    query.set("focus", cardId);
    router.push(`${base}?${query}`, { scroll: false });
  }
  function cardScopeHref(scope: "ALL" | "OWN" | "MANAGED") {
    const query = new URLSearchParams({ view: "cards", cardScope: scope });
    if (dashboard.cardSearch) query.set("cardSearch", dashboard.cardSearch);
    preserveFocus(query); return `${base}?${query}`;
  }
  function requestPageHref(page: number) {
    const query = new URLSearchParams({ view: "requests", requestStatus: dashboard.requestStatus });
    if (dashboard.requestSearch) query.set("requestSearch", dashboard.requestSearch);
    if (page > 0) query.set("requestPage", String(page));
    preserveFocus(query); return `${base}?${query}`;
  }
  function activityList(rows: typeof dashboard.activity) {
    return <div className="ch-activity-list">{rows.map(item => <Link className="ch-activity-row" href={href("transaction", item.id)} key={item.id} scroll={false}><span className="ch-transaction-icon"><WorkspaceIcon name="activity"/></span><span className="ch-transaction-name"><strong>{item.title}</strong><span>{item.cardNickname} · {item.lastFour}</span><small>{item.holderName} · {formatDate(item.occurredAt)}</small></span><span className="ch-transaction-value"><strong>{item.direction === "CREDIT" ? "+" : ""}{item.amount.formatted}</strong><StatusBadge status={item.status}/></span></Link>)}</div>;
  }
  function summaryCards(rows: DashboardCard[]) {
    return <div className="ch-card-summary-list">{rows.map(card => <Link className="ch-card-summary" href={focusHref(card.id)} key={card.id} scroll={false}><span className="ch-summary-art"><CardPreview card={card}/></span><span className="ch-summary-name"><strong>{card.nickname}</strong><small>{card.holderName} · {card.lastFour}</small><small>{owns(card) ? "Your card" : "Managed by you"}</small></span><span className="ch-summary-amount"><strong>{card.available.formatted}</strong><StatusBadge status={card.status}/></span><WorkspaceIcon name="arrow"/></Link>)}</div>;
  }
  function cardSection(title: string, description: string, cards: DashboardCard[], id: string) {
    if (!cards.length) return null;
    return <section className="ch-section" aria-labelledby={id}><div className="ch-section-heading"><div><h3 id={id}>{title}</h3><p>{description}</p></div></div><div className="ch-card-grid">{cards.map(card => <article className="ch-card" key={card.id}><Link className="ch-card-open" href={focusHref(card.id)} aria-label={`Open ${card.nickname}, ending ${card.lastFour}, ${card.holderName}`}><div className="ch-card-ownership"><span>{owns(card) ? "Your card" : "Managed by you"}</span><StatusBadge status={card.status}/></div><CardPreview card={card}/><h4>{card.nickname}</h4><p>{card.holderName} · Ending {card.lastFour}</p><div className="ch-card-balance"><span>{owns(card) ? "Available to spend" : "Cardholder’s available balance"}</span><strong>{card.available.formatted}</strong></div><span className="ch-card-action">{owns(card) ? "View your card" : "Manage this card"}<WorkspaceIcon name="arrow"/></span></Link><div className="ch-card-foot"><span>{owns(card) ? card.purchaseAvailability.title : `Purchases by ${card.holderName}`}</span>{card.canManageAccess && !owns(card) && <Link href={`${base}?view=cardholders&person=${card.holderId}`}>Cardholder access</Link>}</div></article>)}</div></section>;
  }
  function requests() {
    return <div className="ch-request-list">{dashboard.requests.map(request => <article className="ch-request-record" key={request.id}><Link href={href("request", request.id)} scroll={false} className="ch-request-row"><span className="ch-transaction-icon"><WorkspaceIcon name="cards"/></span><span className="ch-request-name"><strong>{request.nickname || "New card request"}</strong><small>{request.holderName} · {request.format === "VIRTUAL" ? "Virtual" : "Physical preview"}</small><small>Updated {formatDate(request.updatedAt)}</small><span className="ch-request-next">{request.status === "BLOCKED" ? request.prerequisites[0]?.title ?? "Review what’s needed" : request.status === "DRAFT" ? "Continue your saved request" : request.status === "ISSUED" ? "Card created · View request details" : "Canceled · No card created"}</span></span><StatusBadge status={request.status} label={request.status === "BLOCKED" ? "Needs attention" : undefined}/><WorkspaceIcon name="arrow"/></Link>{request.issuedCardId && <Link className="ch-request-issued" href={focusHref(request.issuedCardId)}>Open issued card <WorkspaceIcon name="arrow"/></Link>}</article>)}</div>;
  }
  const scopeKey = detail ? JSON.stringify([dashboard.person.id, detail.kind, detail.workspace.service.id, detail.workspace.cardholderRole, detail.workspace.capabilities.filter(item => item.allowed).map(item => item.action), detail.workspace.cards.map(card => card.id)]) : "none";
  const descriptions = { overview: hasPrimary ? "Your spending. Your people. Clearly connected." : "Your cards and purchases, in one place.", cards: "Find a card by its name, cardholder or last four digits.", activity: "Follow purchases and find the details you need.", cardholders: "Give your people a card. Keep oversight simple.", requests: "Pick up where you left off, or find a card you created." };

  return <div className="ch-dashboard">
    <CardholderNavigation active={view} primary={hasPrimary} hrefFor={viewHref}/>
    <div className="ch-content">
      <header className="ch-heading"><div><p className="consumer-eyebrow">WELCOME, {dashboard.person.displayName}</p><h1>Cardholder services</h1><p>{descriptions[view]}</p></div><TaskSearch workspace={detail?.workspace ?? focusedWorkspace ?? undefined} primaryService={primary} selectedCardId={focus?.id}/></header>
      <div className="ch-view-heading"><h2>{cardholderViewLabels[view]}</h2>{primary?.canAddCard && view !== "cardholders" && <Link className="consumer-button consumer-button-primary" href={href("new", "1")} scroll={false}><WorkspaceIcon name="plus"/>{dashboard.cardCount ? "Add card" : "Create your first card"}</Link>}</div>
      {!primary && !dashboard.cardCount && !waitingForFirstCard && dashboard.canCreatePrimary && <CardholderEnrollment/>}
      {waitingForFirstCard && <section className="ch-secondary-waiting" aria-labelledby="secondary-waiting-title"><span className="ch-feature-icon"><WorkspaceIcon name="cards"/></span><p className="consumer-eyebrow">INVITATION ACCEPTED</p><h2 id="secondary-waiting-title">Your primary is preparing your card</h2><p>You’re connected. Your card will appear here when your primary cardholder creates it. You’ll see only your own cards and purchases.</p><ul>{secondaryProfiles.map(profile => <li key={profile.id}><strong>{profile.displayName}</strong><span>Primary cardholder: {profile.primaryName}</span></li>)}</ul><Link className="consumer-button consumer-button-secondary" href="/services#invitation-heading">Review your accepted invitations</Link></section>}
      {focusUnavailable && <section className="ch-selection-notice" role="alert"><h2>This card is unavailable</h2><p>You may no longer have access. Choose an available card to continue.</p><Link href={cardScopeHref("ALL")}>Browse your available cards</Link></section>}
      {selectionUnavailable && <section className="ch-selection-notice" role="alert"><h2>This cardholder view is unavailable</h2><p>You may no longer have access, or this item may have changed.</p><Button variant="secondary" onClick={closeDetail}>Return to your cards</Button></section>}
      {view === "overview" && !waitingForFirstCard && <div className="ch-home-layout"><div className="ch-home-main">
        {dashboard.cardCount > 0 && <div className="ch-card-choice"><label htmlFor="ch-selected-card">Selected card</label><select id="ch-selected-card" value={focus?.id ?? ""} onChange={event => chooseCard(event.target.value)}><option value="" disabled>{focusUnavailable ? "Choose another card" : "Choose a card"}</option>{[{label:"Your cards",cards:choices.filter(owns)},{label:"Cards you manage",cards:choices.filter(card=>!owns(card))}].filter(group=>group.cards.length).map(group=><optgroup key={group.label} label={group.label}>{group.cards.map(card=><option key={card.id} value={card.id}>{card.nickname} · {card.holderName} · {card.lastFour}</option>)}</optgroup>)}</select>{(dashboard.cardsHasMore || dashboard.cardsPage > 0) && <Link href={cardScopeHref("ALL")}>Browse all card pages</Link>}</div>}
        {focus && focusedWorkspace ? <>
          <section className={`ch-focused-card ${owns(focus) ? "is-own" : "is-managed"}`} aria-label="Selected card overview"><div className="ch-focus-topline"><span><WorkspaceIcon name={owns(focus)?"cards":"people"}/>{owns(focus)?"YOUR CARD":"CARD YOU MANAGE"}</span><StatusBadge status={focus.status}/></div><div className="ch-focus-identity"><div className="ch-focus-art"><CardPreview card={focus}/></div><div className="ch-focus-info"><h3>{focus.nickname}</h3><p>{focus.holderName} · Ending {focus.lastFour}</p><p>{focus.relationship === "PRIMARY" ? "Primary card" : `Secondary card · Primary: ${focus.primaryName}`}</p><dl className="ch-focus-balance"><dt>{owns(focus)?"Available to spend":`${focus.holderName}’s available balance`}</dt><dd>{focus.available.formatted}</dd></dl></div></div>
            {(!owns(focus)||!focus.canPurchase) && <div className="ch-availability" role="status"><WorkspaceIcon name={owns(focus)?"shield":"people"}/><div><strong>{focus.purchaseAvailability.title}</strong><p>{focus.purchaseAvailability.description}</p>{focus.status === "FROZEN" && <p>{focus.freeze.description}</p>}</div></div>}
            <div className="ch-focus-actions">{focus.canPurchase && <Link className="consumer-button consumer-button-primary" href={href("card",focus.id,"purchase")} onClick={()=>setControlIntent(null)} scroll={false}>Try a purchase</Link>}{(focus.canUnfreeze||focus.canFreeze)&&<Button variant="secondary" onClick={()=>{setControlIntent({id:focus.id,action:focus.canUnfreeze?"unfreeze":"freeze"});router.push(href("card",focus.id,"controls"),{scroll:false});}}>{focus.canUnfreeze?focus.freeze.unfreezeLabel:focus.freeze.freezeLabel}</Button>}<Link className="consumer-button consumer-button-secondary" href={href("card",focus.id,"controls")} onClick={()=>setControlIntent(null)} scroll={false}>Card controls<WorkspaceIcon name="settings"/></Link></div>
            <div className="ch-focus-footer"><Link href={cardholderTaskHref("activity",{cardId:focus.id})}>View this card’s activity<WorkspaceIcon name="arrow"/></Link>{focus.canManageAccess&&!owns(focus)&&<Link href={`${base}?view=cardholders&person=${focus.holderId}`}>Manage {focus.holderName}’s access</Link>}</div>
          </section>
          <section className="ch-focus-activity" aria-labelledby="ch-overview-activity-title"><div className="ch-section-heading"><div><h3 id="ch-overview-activity-title">Recent activity</h3><p>{focus.nickname} · Ending {focus.lastFour}</p></div><Link className="ch-section-link" href={viewHref("activity")}>View activity<WorkspaceIcon name="arrow"/></Link></div>{focusedActivity.length ? activityList(focusedActivity.slice(0,5)) : <div className="ch-empty">No purchases on this card yet.</div>}</section>
        </> : !focusUnavailable && (primary || !dashboard.canCreatePrimary) && <section className="ch-focus-empty"><span className="ch-feature-icon"><WorkspaceIcon name="cards"/></span><h3>{dashboard.ownCardCount ? "Choose your card" : "No cards in your name yet"}</h3><p>{dashboard.ownCardCount ? "Choose a card to see its balance, purchases and controls together." : dashboard.managedCardCount ? "You can manage your cardholders’ cards below. Add a card for yourself when you’re ready." : "Start with a card for yourself. You can invite your people whenever you’re ready."}</p>{dashboard.ownCardCount>0&&<Link href={cardScopeHref("OWN")}>Browse your cards<WorkspaceIcon name="arrow"/></Link>}</section>}
        {!!ownCards.filter(card=>card.id!==focus?.id).length && <section className="ch-overview-cards"><div className="ch-section-heading"><div><h3>{focus&&owns(focus)?"Your other cards":"Your cards"}</h3><p>Cards in your name, ready to find in one place.</p></div><Link href={cardScopeHref("OWN")}>View your cards<WorkspaceIcon name="arrow"/></Link></div>{summaryCards(ownCards.filter(card=>card.id!==focus?.id).slice(0,4))}</section>}
        {dashboard.managedCardCount>0 && <section className="ch-overview-cards"><div className="ch-section-heading"><div><h3>Cards you manage</h3><p>Your cardholders make purchases. You stay in control.</p></div><Link href={cardScopeHref("MANAGED")}>View managed cards<WorkspaceIcon name="arrow"/></Link></div>{managedCards.length?summaryCards(managedCards.slice(0,4)):<p className="ch-empty">Browse managed cards to find your cardholders’ cards.</p>}</section>}
      </div><aside className="ch-home-aside" aria-label="Cardholder services shortcuts">
        {hasPrimary && <section className="ch-manage-hub"><span className="ch-feature-icon"><WorkspaceIcon name="people"/></span><h3>Your people, connected.</h3><p>Add a cardholder, review their cards and choose what they can do.</p><Link className="consumer-button consumer-button-secondary" href={`${base}?view=cardholders`}>Manage cardholders<WorkspaceIcon name="arrow"/></Link><div className="ch-hub-summary"><span>Cards you manage<strong>{dashboard.managedCardCount}</strong></span><span>Requests to finish<strong>{dashboard.unfinishedRequestCount}</strong></span></div>{dashboard.unfinishedRequestCount>0&&<Link className="ch-section-link" href={`${base}?view=requests`}>Continue a request<WorkspaceIcon name="arrow"/></Link>}</section>}
        <section className="ch-service-hub"><h3>Here when you need us</h3>{focusedWorkspace?.capabilities.some(item=>item.action==="activity.read"&&item.allowed)&&<Link href={cardholderTaskHref("reports",selection)}><WorkspaceIcon name="reports"/><span><strong>Statements & reports</strong><small>Review and download card activity</small></span><WorkspaceIcon name="arrow"/></Link>}<Link href={cardholderTaskHref("help",selection)}><WorkspaceIcon name="help"/><span><strong>Help & support</strong><small>Answers and help with your card</small></span><WorkspaceIcon name="arrow"/></Link><Link href={cardholderTaskHref("settings",selection)}><WorkspaceIcon name="bell"/><span><strong>Notification preferences</strong><small>Choose the updates you want</small></span><WorkspaceIcon name="arrow"/></Link></section>
      </aside></div>}
      {view === "cards" && <div className="ch-cards"><nav className="ch-card-scopes" aria-label="Card ownership"><Link aria-current={dashboard.cardScope==="ALL"?"page":undefined} href={cardScopeHref("ALL")}>All cards<span>{dashboard.cardCount}</span></Link><Link aria-current={dashboard.cardScope==="OWN"?"page":undefined} href={cardScopeHref("OWN")}>Your cards<span>{dashboard.ownCardCount}</span></Link>{hasPrimary&&<Link aria-current={dashboard.cardScope==="MANAGED"?"page":undefined} href={cardScopeHref("MANAGED")}>Cards you manage<span>{dashboard.managedCardCount}</span></Link>}</nav><form className="ch-card-tools" action={base}><input type="hidden" name="view" value="cards"/><input type="hidden" name="cardScope" value={dashboard.cardScope}/>{focus&&<input type="hidden" name="focus" value={focus.id}/>}<label>Search your cards<input type="search" name="cardSearch" key={dashboard.cardSearch} defaultValue={dashboard.cardSearch} maxLength={100} placeholder="Card name, person or last four digits"/></label><Button type="submit" variant="secondary">Search cards</Button>{dashboard.cardSearch&&<Link href={`${base}?view=cards&cardScope=${dashboard.cardScope}`}>Clear search</Link>}</form><p className="ch-request-count">{dashboard.cardMatchCount} matching {dashboard.cardMatchCount===1?"card":"cards"} · Page {dashboard.cardsPage+1}</p>{cardSection("Your cards","Cards in your name. Your purchases and card controls live here.",ownCards,"own-cards")}{cardSection("Cards you manage","Other people’s cards. Review their spending and manage their access.",managedCards,"managed-cards")}{!dashboard.cards.length&&<EmptyState title={dashboard.cardSearch?"No matching cards":dashboard.cardScope==="MANAGED"?"No managed cards on this page":dashboard.cardScope==="OWN"?"No cards in your name on this page":"No cards on this page"} description="Change your filters, return to an earlier page or add a card when you’re ready."/>}{(dashboard.cardsPage>0||dashboard.cardsHasMore)&&<nav className="ch-pagination" aria-label="Card pages">{dashboard.cardsPage>0&&<Link className="consumer-button consumer-button-secondary" href={viewHref("cards",dashboard.cardsPage-1)}>Previous cards</Link>}<span>Page {dashboard.cardsPage+1}</span>{dashboard.cardsHasMore&&<Link className="consumer-button consumer-button-secondary" href={viewHref("cards",dashboard.cardsPage+1)}>Next cards</Link>}</nav>}</div>}
      {(detail?.kind==="PEOPLE"||view==="cardholders")&&<section className="ch-access-panel" aria-label="Cardholder management">{managementWorkspace&&access?<PeopleWorkspace key={JSON.stringify([managementWorkspace.service.id,selectedPersonId,personUnavailable,...["peopleTab","peopleSearch","peopleStatus","invitationStatus"].map(key=>params.get(key)),access.people.map(person=>[person.id,person.state,person.version])])} workspace={managementWorkspace} access={access} selectedPersonId={selectedPersonId} personUnavailable={personUnavailable}/>:<EmptyState title="Cardholder management is unavailable" description="Your primary cardholder manages access to your cards."/>}</section>}
      {view==="requests"&&<section id="requests" className="ch-section" aria-labelledby="ch-requests-title"><div className="ch-request-intro"><span className="ch-feature-icon"><WorkspaceIcon name="reports"/></span><div><h3 id="ch-requests-title">Card requests</h3><p>One place for saved requests, cards you’ve created and canceled requests.</p></div>{dashboard.unfinishedRequestCount>0&&<span className="ch-request-tally">{dashboard.unfinishedRequestCount} to finish</span>}</div><form className="ch-request-filters" action={base}><input type="hidden" name="view" value="requests"/>{focus&&<input type="hidden" name="focus" value={focus.id}/>}<label>Search requests<input key={dashboard.requestSearch} type="search" name="requestSearch" defaultValue={dashboard.requestSearch} maxLength={100} placeholder="Card name or cardholder"/></label><label>Status<select key={dashboard.requestStatus} name="requestStatus" defaultValue={dashboard.requestStatus}><option value="ALL">All requests</option><option value="DRAFT">Drafts</option><option value="BLOCKED">Needs attention</option><option value="ISSUED">Cards created</option><option value="CANCELED">Canceled</option></select></label><Button type="submit" variant="secondary">Apply filters</Button>{(dashboard.requestSearch||dashboard.requestStatus!=="ALL")&&<Link href={`${base}?view=requests`}>Clear filters</Link>}</form><p className="ch-request-count">{dashboard.requestCount} matching {dashboard.requestCount===1?"request":"requests"}</p>{dashboard.requests.length?requests():<EmptyState title={dashboard.requestSearch||dashboard.requestStatus!=="ALL"?"No matching requests":"No card requests yet"} description={primary?.canAddCard?"Start with Add card, or change your filters. Saved and completed requests stay here.":"Requests are managed by the primary cardholder."}/>}{(dashboard.requestPage>0||dashboard.requestsHasMore)&&<nav className="ch-pagination" aria-label="Request pages">{dashboard.requestPage>0&&<Link className="consumer-button consumer-button-secondary" href={requestPageHref(dashboard.requestPage-1)}>Previous requests</Link>}<span>Page {dashboard.requestPage+1}</span>{dashboard.requestsHasMore&&<Link className="consumer-button consumer-button-secondary" href={requestPageHref(dashboard.requestPage+1)}>Next requests</Link>}</nav>}</section>}
      {!primary&&dashboard.canCreatePrimary&&(waitingForFirstCard||dashboard.cardCount>0)&&<details className="ch-optional-enrollment"><summary>Optional: start your own card group</summary><p>A separate card group lets you become a primary. You can keep using the cards shared with you without starting one.</p><CardholderEnrollment/></details>}
    </div>
    {detail&&["CARD","REQUEST","NEW"].includes(detail.kind)&&<CardsWorkspace key={scopeKey} workspace={detail.workspace} requestHistory={detail.requestHistory} cardHistory={detail.cardHistory} routeBase={base} initialControlAction={controlIntent?.id===params.get("card")?controlIntent.action:undefined} onClose={()=>setControlIntent(null)}/>}
    {detail?.kind==="ACTIVITY"&&selectedActivity&&<WorkspaceDialog open title="Transaction details" serviceName={detail.workspace.customerService?.displayName??"Cardholder services"} onClose={closeDetail}><ActivityDetails item={selectedActivity} workspace={detail.workspace}/><div className="consumer-action-row"><Button variant="secondary" onClick={closeDetail}>Back to activity</Button></div></WorkspaceDialog>}
  </div>;
}

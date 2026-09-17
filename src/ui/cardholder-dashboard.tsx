"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {useCustomerSearchParams} from "./use-customer-search-params";
import {customerHref} from "@/shared/customer-routes";
import type {MoneyAccountOverview} from "@/modules/money/contracts";
import type { WorkspaceProjection } from "@/modules/workspace/contracts";
import type { AccessOverview } from "@/modules/access/contracts";
import type { CardholderDashboardDetail, CardholderDashboardFocus, CardholderDashboardProjection, DashboardCard } from "@/modules/workspace/dashboard-contracts";
import { CardholderEnrollment } from "./cardholder-enrollment";
import { CardsWorkspace } from "./workspace/cards";
import type {CardInvitationOverview} from "./card-invitation-manager";
import { ActivityDetails } from "./workspace/activity";
import { PeopleWorkspace } from "./workspace/people";
import { CardPreview } from "./workspace/card-art";
import { Button, EmptyState, StatusBadge, WorkspaceDialog, formatDate } from "./workspace/primitives";
import { CardholderNavigation, cardholderViewLabels, type CardholderView } from "./cardholder-navigation";
import { cardholderTaskHref } from "./cardholder-routing";
import { WorkspaceIcon } from "./workspace/navigation";
import { TaskSearch } from "./workspace/task-search";
import {MoneyAccountHome} from "./money-account";
import "./workspace/workspace.css";
import "./cardholder-dashboard.css";

const base = "/cardholder-services";
const views = ["overview", "cards", "activity", "cardholders", "requests"] as const;
const detailKeys = ["card", "request", "new", "manage", "transaction", "holder", "review", "cardTask", "invite"];

export function CardholderDashboard({ moneyAccount=null,dashboard, detail, access, managementWorkspace, selectedPersonId, personUnavailable = false, selectionUnavailable = false, focusedCard = null, focusedWorkspace = null, focusUnavailable = false, focusedDetail=null, focusedInvitations=null }: {
  focusedDetail?:CardholderDashboardDetail|null;focusedInvitations?:CardInvitationOverview|null;moneyAccount?:MoneyAccountOverview|null;dashboard: CardholderDashboardProjection; detail: CardholderDashboardDetail | null; access?: AccessOverview;
  managementWorkspace?: WorkspaceProjection; selectedPersonId?: string; personUnavailable?: boolean;
  selectionUnavailable?: boolean; focusedCard?: DashboardCard | null;
  focusedWorkspace?: CardholderDashboardFocus["workspace"] | null; focusUnavailable?: boolean;
}) {
  const router = useRouter(), params = useCustomerSearchParams();
  const requestedView = params.get("view");
  const requestedCard = params.has("focus") || focusUnavailable || detail?.kind === "CARD" || detail?.kind === "NEW";
  const view: CardholderView = detail?.kind === "PEOPLE" ? "cardholders" : detail?.kind === "CARD" ? "cards" : requestedCard && (!requestedView || requestedView === "overview") ? "cards" : views.includes(requestedView as CardholderView) ? requestedView as CardholderView : params.has("activityCard") ? "activity" : params.has("page") ? "cards" : "overview";
  const primary = dashboard.primaryService;
  const hasPrimary = Boolean(primary || dashboard.profiles.some(profile => profile.relationship === "OWNER"));
  const secondaryProfiles = dashboard.profiles.filter(profile => profile.relationship === "CARDHOLDER");
  const waitingForFirstCard = !primary && dashboard.cardCount === 0 && secondaryProfiles.length > 0;
  const owns = (card: DashboardCard) => card.holderId === dashboard.person.id;
  const rawFocus = params.has("focus") ? params.getAll("focus") : focusUnavailable ? params.getAll("activityCard") : [];
  const focus = !focusUnavailable && focusedCard && focusedWorkspace?.cards.some(card => card.id === focusedCard.id) ? focusedCard : null;
  const focusedActivity = focus && focusedWorkspace ? focusedWorkspace.activity.filter(item => item.cardId === focus.id).map(item => ({ ...item, cardNickname: focus.nickname, lastFour: focus.lastFour, holderName: focus.holderName })) : [];
  const selectedActivity = detail?.kind === "ACTIVITY" ? detail.workspace.activity.find(item => item.id === params.get("transaction")?.toLowerCase()) : undefined;

  function preserveFocus(query: URLSearchParams) {
    if (rawFocus.length) for (const value of rawFocus) query.append("focus", value.toLowerCase());
    else if (focus) query.set("focus", focus.id);
  }
  function viewHref(next: CardholderView, page = dashboard.cardsPage) {
    if (next === "overview") return base;
    const query = new URLSearchParams();
    if (!["overview", "activity"].includes(next)) query.set("view", next);
    if (next === "activity" && !rawFocus.length && !focus) {
      const contextId=primary?.id??(secondaryProfiles.length===1?secondaryProfiles[0]?.id:undefined);
      if(contextId)query.set("context",contextId);
    }
    if (next === "cards") {
      if (page > 0) query.set("page", String(page));
      if (dashboard.cardScope !== "ALL") query.set("cardScope", dashboard.cardScope);
      if (dashboard.cardSearch) query.set("cardSearch", dashboard.cardSearch);
    }
    if (next !== "cards") preserveFocus(query);
    return customerHref(next === "activity" ? `${base}/activity` : base,query);
  }
  function href(key: string, value: string) {
    const query = new URLSearchParams(params.toString());
    for (const item of [...detailKeys, "focus"]) query.delete(item);
    if (view !== "overview") query.set("view", view);
    if(key === "new") { query.delete("activityCard"); query.delete("focus"); query.set("view","cards"); }
    else preserveFocus(query);
    query.set(key, value);
    return customerHref(base,query);
  }
  function closeDetail() {
    const query = new URLSearchParams(params.toString());
    for (const key of detailKeys) query.delete(key);
    router.replace(customerHref(base,query), { scroll: false });
  }
  function focusHref(cardId: string) {
    const query = new URLSearchParams({ view: "cards", focus: cardId });
    if (dashboard.cardScope !== "ALL") query.set("cardScope", dashboard.cardScope);
    if (dashboard.cardSearch) query.set("cardSearch", dashboard.cardSearch);
    if (dashboard.cardsPage > 0) query.set("page", String(dashboard.cardsPage));
    return customerHref(base,query);
  }
  function cardScopeHref(scope: "ALL" | "OWN" | "MANAGED") {
    const query = new URLSearchParams({ view: "cards", cardScope: scope });
    if (dashboard.cardSearch) query.set("cardSearch", dashboard.cardSearch);
    return customerHref(base,query);
  }
  function requestPageHref(page: number) {
    const query = new URLSearchParams({ view: "requests", requestStatus: dashboard.requestStatus });
    if (dashboard.requestSearch) query.set("requestSearch", dashboard.requestSearch);
    if (page > 0) query.set("requestPage", String(page));
    preserveFocus(query); return customerHref(base,query);
  }
  function activityList(rows: typeof dashboard.activity) {
    return <div className="ch-activity-list">{rows.map(item => <Link className="ch-activity-row" href={href("transaction", item.id)} key={item.id} scroll={false}><span className="ch-transaction-icon"><WorkspaceIcon name="activity"/></span><span className="ch-transaction-name"><strong>{item.title}</strong><span>{item.cardNickname} · {item.lastFour}</span><small>{item.holderName} · {formatDate(item.occurredAt)}</small></span><span className="ch-transaction-value"><strong>{item.direction === "CREDIT" ? "+" : ""}{item.amount.formatted}</strong><StatusBadge status={item.status}/></span></Link>)}</div>;
  }
  function cardList(cards: DashboardCard[]) {
    return <div className="ch-card-list">{cards.map(card => <article className="ch-card" key={card.id}>
      <Link className="ch-card-row" href={focusHref(card.id)} aria-label={`Open ${card.nickname}, ending ${card.lastFour}, ${card.holderName}`}>
        <span className="ch-list-card-icon" aria-hidden="true"><strong>VISA</strong><small>•• {card.lastFour}</small></span>
        <span className="ch-list-card-name"><strong>{card.nickname}</strong><span>Ending {card.lastFour} · {owns(card)?"For your use":"For others"}</span>{card.accessRole === "CARDHOLDER" ? <small>Account owner: {card.primaryName}</small> : card.assignmentState !== "UNASSIGNED" && !owns(card) && <small>Cardholder: {card.holderName}</small>}</span>
        <span className="ch-list-card-money"><small>Available on this card</small><strong>{card.available.formatted}</strong></span>
        <StatusBadge status={card.assignmentState === "ACCEPTED" ? card.status : card.assignmentState} label={card.assignmentState === "UNASSIGNED" ? "Ready to invite" : card.assignmentState === "REVOKED" ? "Access removed" : undefined}/><WorkspaceIcon name="arrow"/>
      </Link>
    </article>)}</div>;
  }
  function requests() {
    return <div className="ch-request-list">{dashboard.requests.map(request => <article className="ch-request-record" key={request.id}><Link href={href("request", request.id)} scroll={false} className="ch-request-row"><span className="ch-transaction-icon"><WorkspaceIcon name="cards"/></span><span className="ch-request-name"><strong>{request.nickname || "New card"}</strong><small>{request.holderName} · {request.format === "VIRTUAL" ? "Virtual" : "Physical · Delivery unavailable"}</small><small>Updated {formatDate(request.updatedAt)}</small><span className="ch-request-next">{request.status === "BLOCKED" ? request.prerequisites[0]?.title ?? "Review what’s needed" : request.status === "DRAFT" ? "Continue your saved card setup" : request.status === "ISSUED" ? "Card created · View details" : "Canceled · No card created"}</span></span><StatusBadge status={request.status} label={request.status === "BLOCKED" ? "Needs attention" : undefined}/><WorkspaceIcon name="arrow"/></Link>{request.issuedCardId && <Link className="ch-request-issued" href={focusHref(request.issuedCardId)}>Open card <WorkspaceIcon name="arrow"/></Link>}</article>)}</div>;
  }
  const scopeKey = detail ? JSON.stringify([dashboard.person.id, detail.kind, detail.workspace.service.id, detail.workspace.cardholderRole, detail.workspace.capabilities.filter(item => item.allowed).map(item => item.action), detail.workspace.cards.map(card => card.id)]) : "none";
  const unfinishedRequestLink = hasPrimary && dashboard.unfinishedRequestCount > 0 ? <Link className="ch-unfinished-request" href={viewHref("requests", 0)}>Continue card setup <span>{dashboard.unfinishedRequestCount} to finish</span><WorkspaceIcon name="arrow"/></Link> : null;
  const showingCard = view === "cards" && Boolean(focus || focusUnavailable);
  const account = dashboard.accountOverview;
  const overviewActivity = hasPrimary ? account?.activity ?? [] : dashboard.activity;


  return <div className="ch-dashboard">
    <CardholderNavigation active={view} primary={hasPrimary} hrefFor={viewHref} settingsHref={cardholderTaskHref("settings",primary?{contextId:primary.id}:{cardId:focus?.id,contextId:secondaryProfiles.length===1?secondaryProfiles[0]?.id:undefined})}/>
    <div className="ch-content">
      <header className="ch-heading"><div><h1 id="ch-dashboard-title">{showingCard ? "Card details" : cardholderViewLabels[view]}</h1></div><div className="ch-heading-actions">{["cards","cardholders","requests"].includes(view)&&!showingCard&&primary?.canAddCard&&<Link className="consumer-button consumer-button-primary" href={href("new","1")} scroll={false}><WorkspaceIcon name="plus"/>Add card</Link>}<TaskSearch workspace={detail?.workspace ?? focusedWorkspace ?? undefined} primaryService={primary} selectedCardId={focus?.id} addMoneyHref={moneyAccount?.canAddMoney?customerHref(`/money-accounts/${moneyAccount.id}`,{task:"add"}):undefined}/></div></header>
      {hasPrimary&&["cardholders","requests"].includes(view)&&<Link className="ch-back-to-cards ch-collection-back" href={viewHref("cards")}><WorkspaceIcon name="arrow"/>Back to cards</Link>}
      {!primary && !dashboard.cardCount && !waitingForFirstCard && dashboard.canCreatePrimary && <CardholderEnrollment/>}
      {waitingForFirstCard && <section className="ch-secondary-waiting" aria-labelledby="secondary-waiting-title"><span className="ch-feature-icon"><WorkspaceIcon name="cards"/></span><h2 id="secondary-waiting-title">No cards available</h2><p>You have no cards with active access. Ask the account owner to invite you from a card. You’ll see only cards you accept and their purchases.</p><ul>{secondaryProfiles.map(profile => <li key={profile.id}><strong>{profile.displayName}</strong><span>Account owner: {profile.primaryName}</span></li>)}</ul><Link className="consumer-button consumer-button-secondary" href="/shared-access">View your invitations</Link></section>}
      {focusUnavailable && <section className="ch-selection-notice" role="alert"><h2>This card is unavailable</h2><p>You may no longer have access. Choose an available card to continue.</p><Link href={cardScopeHref("ALL")}>Browse your available cards</Link></section>}
      {selectionUnavailable && <section className="ch-selection-notice" role="alert"><h2>This card view is unavailable</h2><p>You may no longer have access, or this item may have changed.</p><Button variant="secondary" onClick={closeDetail}>Return to your cards</Button></section>}
      {view === "overview" && !waitingForFirstCard && <div className="ch-home-layout">
        {hasPrimary && <section className="ch-account-overview" aria-label="Your card account">
          {moneyAccount ? <MoneyAccountHome account={moneyAccount}/> : <p className="ch-account-unavailable">Your account balance is unavailable with your current access.</p>}
          {account && <dl className="ch-account-counts"><div><dt>Cards in this account</dt><dd>{account.cardCount}</dd></div><div><dt>For your use</dt><dd>{account.ownCardCount}</dd></div><div><dt>For others</dt><dd>{account.otherCardCount}</dd></div></dl>}
          <div className="ch-account-links"><Link href={viewHref("cards")}>{account?.cardCount === 0 ? "Set up your first card" : "View cards"}<WorkspaceIcon name="arrow"/></Link>{account && account.unassignedCardCount > 0 && <span>{account.unassignedCardCount} {account.unassignedCardCount === 1 ? "card is" : "cards are"} ready to invite a cardholder.</span>}</div>
        </section>}
        {!hasPrimary && dashboard.cardCount > 0 && <section className="ch-overview-cards" aria-labelledby="ch-recipient-cards-title"><div className="ch-section-heading"><div><h2 id="ch-recipient-cards-title">Your cards</h2></div><Link href={viewHref("cards")}>View cards<WorkspaceIcon name="arrow"/></Link></div>{cardList(dashboard.cards)}</section>}
        {unfinishedRequestLink}
        {(hasPrimary || dashboard.cardCount > 0) && <section className="ch-focus-activity" aria-labelledby="ch-overview-activity-title"><div className="ch-section-heading"><div><h2 id="ch-overview-activity-title">Recent activity</h2><p>{hasPrimary ? "This account’s cards" : "Your cards"}</p></div><Link className="ch-section-link" href={viewHref("activity")}>View activity<WorkspaceIcon name="arrow"/></Link></div>{overviewActivity.length ? activityList(overviewActivity.slice(0,5)) : <div className="ch-empty">{hasPrimary&&!account?"Card activity is unavailable with your current access.":"No card activity yet."}</div>}</section>}
      </div>}
      {showingCard && <div className="ch-card-detail"><Link className="ch-back-to-cards" href={viewHref("cards")}><WorkspaceIcon name="arrow"/>Back to card list</Link>{focus && focusedWorkspace && <>
          <section className={`ch-focused-card ${owns(focus) ? "is-own" : "is-managed"}`} aria-label="Selected card overview"><div className="ch-focus-topline"><span><WorkspaceIcon name={owns(focus)?"cards":"people"}/>{owns(focus)?"FOR YOUR USE":"FOR OTHERS"}</span><StatusBadge status={focus.assignmentState==="ACCEPTED"?focus.status:focus.assignmentState} label={focus.assignmentState==="UNASSIGNED"?"Ready to invite":focus.assignmentState==="REVOKED"?"Access removed":undefined}/></div>
            <div className="ch-focus-identity">
              <div className="ch-focus-art"><CardPreview card={focus}/></div>
              <div className="ch-focus-info"><h3>{focus.nickname}</h3><p>Ending {focus.lastFour}</p>{focus.assignmentState !== "UNASSIGNED" && !owns(focus) && <p>Cardholder: {focus.holderName}</p>}{focus.accessRole === "CARDHOLDER" && <p>{`Account owner: ${focus.primaryName}`}</p>}</div>
              <div className="ch-focus-spending">
                <dl className="ch-focus-balance"><dt>Available on this card</dt><dd>{focus.available.formatted}</dd></dl>
                <dl className="ch-limit-summary"><div><dt>Total spending limit</dt><dd>{focus.spending.allowance.formatted}</dd></div><div><dt>Spent toward limit</dt><dd>{focus.spending.used.formatted}</dd></div></dl>
              </div>
            </div>

            {(!owns(focus)||!focus.canPurchase) && <div className="ch-availability" role="status"><WorkspaceIcon name={owns(focus)?"shield":"people"}/><div><strong>{focus.purchaseAvailability.title}</strong><p>{focus.purchaseAvailability.description}</p>{focus.status === "FROZEN" && <p>{focus.freeze.description}</p>}</div></div>}
            <div className="ch-card-support-actions"><details className="ch-spending-details"><summary>Spending details</summary><p>The total spending limit stays in place until the account owner changes it. Refunds don’t reduce spending counted toward the limit. Purchases also need enough money in the card balance.</p></details></div>
          </section>
          {focusedDetail&&<CardsWorkspace key={`${dashboard.person.id}:${focusedDetail.workspace.service.id}:${focus.id}`} workspace={focusedDetail.workspace} cardHistory={focusedDetail.cardHistory} routeBase={base} embeddedCardId={focus.id} invitations={focusedInvitations} inviteOpen={params.get("invite")==="1"}/>}
          <section className="ch-focus-activity" aria-labelledby="ch-overview-activity-title"><div className="ch-section-heading"><div><h3 id="ch-overview-activity-title">Recent activity</h3><p>{focus.nickname} · Ending {focus.lastFour}</p></div><Link className="ch-section-link" href={viewHref("activity")}>View activity<WorkspaceIcon name="arrow"/></Link></div>{focusedActivity.length ? activityList(focusedActivity.slice(0,5)) : <div className="ch-empty">No purchases on this card yet.</div>}</section>
      </>}</div>}
      {view === "cards" && !showingCard && <div className="ch-cards">{hasPrimary&&<nav className="ch-card-scopes" aria-label="Card ownership"><Link aria-current={dashboard.cardScope==="ALL"?"page":undefined} href={cardScopeHref("ALL")}>All cards<span>{dashboard.cardCount}</span></Link><Link aria-current={dashboard.cardScope==="OWN"?"page":undefined} href={cardScopeHref("OWN")}>For your use<span>{dashboard.ownCardCount}</span></Link><Link aria-current={dashboard.cardScope==="MANAGED"?"page":undefined} href={cardScopeHref("MANAGED")}>For others<span>{dashboard.managedCardCount}</span></Link></nav>}<form className="ch-card-tools" action="/cardholder-services/cards"><input type="hidden" name="cardScope" value={dashboard.cardScope}/><label><span className="ch-sr-only">Search cards</span><input type="search" name="cardSearch" key={dashboard.cardSearch} defaultValue={dashboard.cardSearch} maxLength={100} placeholder="Card, person or last 4 digits"/></label><Button type="submit" variant="secondary">Search</Button>{dashboard.cardSearch&&<Link href={customerHref(base,{view:"cards",cardScope:dashboard.cardScope})}>Clear search</Link>}</form>{(dashboard.cardSearch||dashboard.cardsPage>0||dashboard.cardsHasMore)&&<p className="ch-request-count">{dashboard.cardMatchCount} {dashboard.cardMatchCount===1?"card":"cards"}{dashboard.cardSearch?" found":""}</p>}{cardList(dashboard.cards)}{!dashboard.cards.length&&<EmptyState title={dashboard.cardSearch?"No matching cards":dashboard.cardScope==="MANAGED"?"No cards for others on this page":dashboard.cardScope==="OWN"?"No cards for your use on this page":"No cards on this page"} description={hasPrimary?"Change your filters, return to an earlier page or add a card when you’re ready.":"Change your filters or return to an earlier page."}>{!hasPrimary&&dashboard.cardScope==="MANAGED"&&<Link href={cardScopeHref("ALL")}>View your cards</Link>}</EmptyState>}{(dashboard.cardsPage>0||dashboard.cardsHasMore)&&<nav className="ch-pagination" aria-label="Card pages">{dashboard.cardsPage>0&&<Link className="consumer-button consumer-button-secondary" href={viewHref("cards",dashboard.cardsPage-1)}>Previous cards</Link>}<span>Page {dashboard.cardsPage+1}</span>{dashboard.cardsHasMore&&<Link className="consumer-button consumer-button-secondary" href={viewHref("cards",dashboard.cardsPage+1)}>Next cards</Link>}</nav>}{hasPrimary&&<nav className="ch-card-utilities" aria-label="Card management"><Link href={viewHref("cardholders")}>Cardholders</Link><Link href={viewHref("requests")}>Card history</Link></nav>}</div>}
      {(detail?.kind==="PEOPLE"||view==="cardholders")&&<section className="ch-access-panel" aria-label="Cardholder management">{managementWorkspace&&access?<PeopleWorkspace key={JSON.stringify([managementWorkspace.service.id,selectedPersonId,personUnavailable,...["peopleTab","peopleSearch","peopleStatus","invitationStatus"].map(key=>params.get(key)),access.people.map(person=>[person.id,person.state,person.version])])} workspace={managementWorkspace} access={access} selectedPersonId={selectedPersonId} personUnavailable={personUnavailable}/>:<EmptyState title="People are managed by the account owner" description="Your account owner manages access to your cards."/>}</section>}
      {view==="requests"&&<section id="requests" className="ch-section" aria-labelledby="ch-dashboard-title">{dashboard.unfinishedRequestCount>0&&<p className="ch-request-tally">{dashboard.unfinishedRequestCount} to finish</p>}<form className="ch-request-filters" action="/cardholder-services/card-requests">{focus&&<input type="hidden" name="focus" value={focus.id}/>}<label>Search card history<input key={dashboard.requestSearch} type="search" name="requestSearch" defaultValue={dashboard.requestSearch} maxLength={100} placeholder="Card name or cardholder"/></label><label>Status<select key={dashboard.requestStatus} name="requestStatus" defaultValue={dashboard.requestStatus}><option value="ALL">All card setups</option><option value="DRAFT">Drafts</option><option value="BLOCKED">Needs attention</option><option value="ISSUED">Cards created</option><option value="CANCELED">Canceled</option></select></label><Button type="submit" variant="secondary">Apply filters</Button>{(dashboard.requestSearch||dashboard.requestStatus!=="ALL")&&<Link href="/cardholder-services/card-requests">Clear filters</Link>}</form><p className="ch-request-count">{dashboard.requestCount} matching {dashboard.requestCount===1?"record":"records"}</p>{dashboard.requests.length?requests():<EmptyState title={dashboard.requestSearch||dashboard.requestStatus!=="ALL"?"No matching card history":"No card history yet"} description={primary?.canAddCard?"Choose Add card to start. Saved and completed card setups stay here.":"Card creation is managed by the account owner."}/>}{(dashboard.requestPage>0||dashboard.requestsHasMore)&&<nav className="ch-pagination" aria-label="Request pages">{dashboard.requestPage>0&&<Link className="consumer-button consumer-button-secondary" href={requestPageHref(dashboard.requestPage-1)}>Previous records</Link>}<span>Page {dashboard.requestPage+1}</span>{dashboard.requestsHasMore&&<Link className="consumer-button consumer-button-secondary" href={requestPageHref(dashboard.requestPage+1)}>Next records</Link>}</nav>}</section>}
      {view === "overview"&&!primary&&dashboard.canCreatePrimary&&(waitingForFirstCard||dashboard.cardCount>0)&&<details className="ch-optional-enrollment"><summary>Optional: open your own card account</summary><p>Open a separate account if you want to add money and manage your own cards. You can keep using cards shared with you without opening one.</p><CardholderEnrollment/></details>}
    </div>
    {detail&&["REQUEST","NEW"].includes(detail.kind)&&<CardsWorkspace key={scopeKey} workspace={detail.workspace} requestHistory={detail.requestHistory} cardHistory={detail.cardHistory} routeBase={base}/>}
    {detail?.kind==="ACTIVITY"&&selectedActivity&&<WorkspaceDialog open title="Transaction details" serviceName={detail.workspace.customerService?.displayName??"Cards & spending"} onClose={closeDetail}><ActivityDetails item={selectedActivity} workspace={detail.workspace}/><div className="consumer-action-row"><Button variant="secondary" onClick={closeDetail}>Back to activity</Button></div></WorkspaceDialog>}
  </div>;
}

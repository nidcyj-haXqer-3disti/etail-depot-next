import {getSandboxOverview} from "@/modules/sandbox/service";
import {SandboxEntry} from "@/ui/sandbox-entry";
import { redirect, unstable_rethrow } from "next/navigation";
import Link from "next/link";
import { getRequestSession } from "@/platform/http/context";
import { SecurityError } from "@/platform/security/origin";
import { getCardholderDashboard, getCardholderDashboardDetail, getCardholderDashboardFocus } from "@/modules/workspace/dashboard-service";
import { getAccessOverview } from "@/modules/access/service";
import { cardholderDashboardQuerySchema } from "@/modules/workspace/api-contracts";
import { Shell, PageNotice } from "@/ui/shell";
import { CardholderDashboard } from "@/ui/cardholder-dashboard";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata = { title: "Cardholder services" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getRequestSession().catch(() => undefined);
  if (session === undefined) return <PageNotice title="We couldn’t load your session"><p>Please try signing in again.</p></PageNotice>;
  if (!session) redirect("/login");
  const sandbox = await getSandboxOverview(session.personId);
  if (!sandbox.joined) return <Shell authenticated><div className="page-container services-page"><div className="page-heading"><p className="eyebrow">CARDHOLDER SERVICES</p><h1>Cards for you and your people</h1><p>A clear view of spending, with you in control.</p></div><SandboxEntry initial={sandbox} service="cardholder"/></div></Shell>;
  const query = await searchParams;
  const pageValue = query.page ?? "0";
  if (typeof pageValue !== "string" || !/^\d{1,5}$/.test(pageValue)) return <PageNotice title="This card page is unavailable" authenticated><p>Return to your cards to continue.</p><Link href="/cardholder-services">Your cards</Link></PageNotice>;
  const filters=cardholderDashboardQuerySchema.safeParse(Object.fromEntries(["requestPage","requestStatus","requestSearch"].flatMap(key=>query[key]===undefined?[]:[[key,query[key]]])));
  if(!filters.success)return <PageNotice title="These request filters are unavailable" authenticated><p>Return to your requests and choose the filters again.</p><Link href="/cardholder-services?view=requests">Your requests</Link></PageNotice>;
  const keys = ["card", "request", "new", "manage", "transaction"] as const;
  const selectionRequested = keys.some(key => query[key] !== undefined);
  const selectionInvalid = keys.some(key => query[key] !== undefined && typeof query[key] !== "string");
  const selection = Object.fromEntries(keys.flatMap(key => typeof query[key] === "string" ? [[key, query[key]]] : []));
  const result = await (async () => { try {
    const [dashboard, detail] = await Promise.all([
      getCardholderDashboard(session.personId, Number(pageValue),{requestPage:Number(filters.data.requestPage??"0"),requestStatus:filters.data.requestStatus,requestSearch:filters.data.requestSearch}),
      selectionInvalid ? Promise.resolve(null) : getCardholderDashboardDetail(session.personId, selection).catch(error => {
        if (error instanceof SecurityError && [403, 404, 422].includes(error.status)) return null;
        throw error;
      }),
    ]);
    // A selected card is an exact authorized resource, independent of an open dialog.
    // Only an unambiguous, complete list may supply an implicit selection.
    const focusValue = query.focus ?? query.activityCard;
    const focusRequested = focusValue !== undefined;
    const ownCards = dashboard.cards.filter(card => card.holderId === session.personId);
    const completeList = dashboard.cardsPage === 0 && !dashboard.cardsHasMore;
    const defaultCard = completeList ? (ownCards.length === 1 ? ownCards[0] : dashboard.cards.length === 1 ? dashboard.cards[0] : undefined) : undefined;
    const focusId = focusRequested ? (typeof focusValue === "string" ? focusValue.toLowerCase() : undefined) : defaultCard?.id;
    const focused = focusId ? await getCardholderDashboardFocus(session.personId, focusId).catch(error => {
      if (error instanceof SecurityError && [403, 404, 422].includes(error.status)) return null;
      throw error;
    }) : null;
    const management=detail?.kind==="PEOPLE"?detail:query.view==="cardholders"&&dashboard.primaryService?await getCardholderDashboardDetail(session.personId,{manage:dashboard.primaryService.id}).catch(error=>{if(error instanceof SecurityError&&[403,404].includes(error.status))return null;throw error;}):null;
    const access = management ? await getAccessOverview(session.personId, management.workspace.service.id) : undefined;
    const selectedPerson=typeof query.person==="string"?query.person.toLowerCase():undefined;
    const personUnavailable=query.person!==undefined&&(!selectedPerson||!access?.people.some(person=>person.id===selectedPerson));
    return {dashboard,detail,access,managementWorkspace:management?.workspace,selectedPerson,personUnavailable,focusedCard:focused?.card??null,focusedWorkspace:focused?.workspace??null,focusUnavailable:focusRequested && !focused};
  } catch (error) {
    unstable_rethrow(error);
    return null;
  } })();
  if (!result) return <PageNotice title="Your cardholder dashboard couldn’t load" authenticated><p>Please retry. Your cards, requests and permissions have not changed.</p><Link href="/cardholder-services">Reload cardholder services</Link></PageNotice>;
  if (query.view === "activity") {
    const target = new URLSearchParams();
    const rawFocus = query.focus !== undefined ? query.focus : query.activityCard;
    if (rawFocus !== undefined) for (const value of Array.isArray(rawFocus) ? rawFocus : [rawFocus]) target.append("focus", value.toLowerCase());
    else if (result.focusedCard) target.set("focus", result.focusedCard.id);
    if (query.transaction !== undefined) for (const value of Array.isArray(query.transaction) ? query.transaction : [query.transaction]) target.append("transaction", value);
    redirect(`/cardholder-services/activity${target.size ? `?${target}` : ""}`);
  }
  return <Shell authenticated><CardholderDashboard dashboard={result.dashboard} detail={result.detail} access={result.access} managementWorkspace={result.managementWorkspace} selectedPersonId={result.selectedPerson} personUnavailable={result.personUnavailable} selectionUnavailable={selectionRequested && !result.detail} focusedCard={result.focusedCard} focusedWorkspace={result.focusedWorkspace} focusUnavailable={result.focusUnavailable}/></Shell>;
}

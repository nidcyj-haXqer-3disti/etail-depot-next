import Link from "next/link";
import {redirect, unstable_rethrow} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getPublicGuestRequest} from "@/modules/acquiring/guest-service";
import {getCardCheckoutReview} from "@/modules/acquiring/card-checkout-service";
import {getCardholderDashboard} from "@/modules/workspace/dashboard-service";
import {CardCheckout} from "@/ui/card-checkout";
import {Shell, PageNotice} from "@/ui/shell";

export const dynamic = "force-dynamic";
export const metadata = {title:"Pay with your Etail card",robots:{index:false,follow:false}};
export default async function Page({params,searchParams}:{params:Promise<{publicationId:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const {publicationId} = await params, query = await searchParams, session = await getRequestSession();
  if (!session) {
    const review = typeof query.review === "string" && /^[0-9a-f-]{36}$/i.test(query.review) ? `?review=${query.review}` : "";
    redirect(`/login?next=${encodeURIComponent(`/checkout/${publicationId}/card${review}`)}`);
  }
  const result = await (async () => {
    try {
      const page = query.page === undefined ? 0 : typeof query.page === "string" && /^(0|[1-9][0-9]{0,4})$/.test(query.page) ? Number(query.page) : NaN;
      if (query.review !== undefined && typeof query.review !== "string" || query.q !== undefined && typeof query.q !== "string") return null;
      const offer = await getPublicGuestRequest(publicationId);
      const review = query.review ? await getCardCheckoutReview(session.personId,publicationId,query.review as string) : null;
      const dashboard = await getCardholderDashboard(session.personId,page,{cardScope:"OWN",cardSearch:query.q as string|undefined});
      return {offer,review,dashboard};
    } catch (error) { unstable_rethrow(error); return null; }
  })();
  if (!result) return <PageNotice authenticated title="This checkout is unavailable"><p>Check the original payment link or return to your cards.</p><Link href="/cardholder-services">Your cards</Link></PageNotice>;
  return <Shell authenticated><CardCheckout key={`${result.review?.id??publicationId}:${result.dashboard.cardsPage}:${result.dashboard.cardSearch}`} offer={result.offer} cards={result.dashboard.cards} page={result.dashboard.cardsPage} search={result.dashboard.cardSearch} hasMore={result.dashboard.cardsHasMore} review={result.review}/></Shell>;
}

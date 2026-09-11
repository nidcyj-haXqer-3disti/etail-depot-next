import { redirect } from "next/navigation";
import { getRequestSession } from "@/platform/http/context";
import { SecurityError } from "@/platform/security/origin";
import { getMerchantCheckout } from "@/modules/acquiring/operations-service";
import type { MerchantCheckoutProjection } from "@/modules/acquiring/operations-contracts";
import { MerchantCheckout } from "@/ui/workspace/merchant-operations";
import { PageNotice, Shell } from "@/ui/shell";
import { MerchantNavigationBoundary } from "@/ui/workspace/merchant-navigation-state";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata = { title: "Test payment preview" };
export default async function Page({ params }: { params: Promise<{ channelId: string }> }) {
  const session = await getRequestSession().catch(() => undefined);
  if (session === undefined) return <PageNotice title="We couldn’t load your session"><p>Please retry before continuing to the payment preview.</p></PageNotice>;
  if (!session) redirect("/login");
  const { channelId } = await params;
  let checkout: MerchantCheckoutProjection;
  try {
    checkout = await getMerchantCheckout(session.personId, channelId);
  } catch (error) {
    if (error instanceof SecurityError && [403, 404].includes(error.status)) return <PageNotice authenticated title="This payment preview isn’t available"><p>The channel or your access may have changed. A payment link does not give access to a collection unit.</p></PageNotice>;
    return <PageNotice authenticated title="We couldn’t load this payment"><p>Please retry this page. No payment has been submitted.</p></PageNotice>;
  }
  return <MerchantNavigationBoundary><Shell authenticated><MerchantCheckout key={channelId} initial={checkout} /></Shell></MerchantNavigationBoundary>;
}

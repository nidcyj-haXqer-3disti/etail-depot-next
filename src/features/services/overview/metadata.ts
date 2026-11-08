import { publicPageMetadata } from "@/shared/seo/metadata";

export const pageDetails = { title: "Merchant Services and Credit Card Processing", description: "Merchant services and credit card processing for US businesses. Explore account setup, online checkout, ACH payments, refunds and payout reporting." } as const;
export const metadata = publicPageMetadata("/payment-acceptance-service", pageDetails);
import { publicPageJsonLd } from "@/shared/seo/structured-data-builders";
import { pageDetails as homeDetails } from "@/features/home/metadata";
import { serviceLabels } from "@/shared/site/service-language";
export const pageJsonLd = () => publicPageJsonLd("/payment-acceptance-service", pageDetails, homeDetails.description, serviceLabels.payments);

import { publicPageMetadata } from "@/shared/seo/metadata";

export const pageDetails = { title: "Merchant and Card Services Help Center", description: "Get help with merchant account access, checkout setup, payment status, refunds, disputes and payouts. Find merchant support and card inquiry contacts." } as const;
export const metadata = publicPageMetadata("/resources/help", pageDetails);
import { publicPageJsonLd } from "@/shared/seo/structured-data-builders";
import { pageDetails as homeDetails } from "@/features/home/metadata";
export const pageJsonLd = () => publicPageJsonLd("/resources/help", pageDetails, homeDetails.description, "Help");

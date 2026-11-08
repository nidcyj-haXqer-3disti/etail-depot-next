import { publicPageMetadata } from "@/shared/seo/metadata";

export const pageDetails = { title: "Merchant and Card Services Help Center", description: "Get help with merchant account access, payment status, refunds, disputes and payouts. Find contacts for software integrations, card inquiries and privacy." } as const;
export const metadata = publicPageMetadata("/help", pageDetails);
import { publicPageJsonLd } from "@/shared/seo/structured-data-builders";
import { pageDetails as homeDetails } from "@/features/home/metadata";
export const pageJsonLd = () => publicPageJsonLd("/help", pageDetails, homeDetails.description, "Help");

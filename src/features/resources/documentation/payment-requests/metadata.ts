import { documentationMetadata } from "@/features/resources/documentation/catalog";
import { servicePageMetadata } from "@/shared/seo/metadata";

export const pageDetails = documentationMetadata["/docs/payment-requests"];
export const metadata = servicePageMetadata("/docs/payment-requests", pageDetails);

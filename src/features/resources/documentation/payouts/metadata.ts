import { documentationMetadata } from "@/features/resources/documentation/catalog";
import { servicePageMetadata } from "@/shared/seo/metadata";

export const pageDetails = documentationMetadata["/docs/payouts"];
export const metadata = servicePageMetadata("/docs/payouts", pageDetails);

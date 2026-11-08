import { documentationMetadata } from "@/features/resources/documentation/catalog";
import { servicePageMetadata } from "@/shared/seo/metadata";

export const pageDetails = documentationMetadata["/docs/refunds-and-disputes"];
export const metadata = servicePageMetadata("/docs/refunds-and-disputes", pageDetails);

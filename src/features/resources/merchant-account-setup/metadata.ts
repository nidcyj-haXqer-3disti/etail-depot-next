import { documentationMetadata } from "@/features/resources/documentation/catalog";
import { servicePageMetadata } from "@/shared/seo/metadata";

export const pageDetails = documentationMetadata["/docs/merchant-onboarding"];
export const metadata = servicePageMetadata("/docs/merchant-onboarding", pageDetails);

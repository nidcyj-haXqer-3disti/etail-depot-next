import { servicePageMetadata } from "@/shared/seo/metadata";
import { pricingContent } from "./content";

export const pageDetails = pricingContent;
export const metadata = servicePageMetadata("/pricing", pageDetails);

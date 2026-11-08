import { servicePageMetadata } from "@/shared/seo/metadata";
import { reconciliationContent } from "./content";

export const pageDetails = reconciliationContent;
export const metadata = servicePageMetadata("/services/reconciliation", pageDetails);

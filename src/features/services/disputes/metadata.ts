import { servicePageMetadata } from "@/shared/seo/metadata";
import { disputesContent } from "./content";

export const pageDetails = disputesContent;
export const metadata = servicePageMetadata("/disputes", pageDetails);

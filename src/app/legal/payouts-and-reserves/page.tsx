import { legalPageMetadata } from "@/modules/public-site/legal-metadata";
import { LegalServiceDocument } from "@/ui/legal-service-document";
export const metadata = legalPageMetadata("/legal/payouts-and-reserves");
export default function Page() { return <LegalServiceDocument slug="payouts-and-reserves" />; }

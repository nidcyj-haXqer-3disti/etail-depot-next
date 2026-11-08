import { legalPageMetadata } from "@/features/company/legal/metadata";
import { LegalServiceDocument } from "@/features/company/legal/components/legal-service-document";
export const metadata = legalPageMetadata("/legal/payouts-and-reserves");
export default function Page() { return <LegalServiceDocument slug="payouts-and-reserves" />; }

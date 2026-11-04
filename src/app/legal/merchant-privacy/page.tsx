import { legalPageMetadata } from "@/modules/public-site/legal-metadata";
import { LegalServiceDocument } from "@/ui/legal-service-document";
export const metadata = legalPageMetadata("/legal/merchant-privacy");
export default function Page() { return <LegalServiceDocument slug="merchant-privacy" />; }

import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { GuideLibrary } from "@/ui/guide-library";
import { Shell } from "@/ui/shell";
import "@/ui/payment-guide.css";

export const metadata = publicPageMetadata("/guides");

export default function GuidesPage() {
  return <Shell>
    <PublicPageStructuredData path="/guides" />
    <div className="payment-guide guide-library-page">
      <GuideLibrary />
    </div>
  </Shell>;
}

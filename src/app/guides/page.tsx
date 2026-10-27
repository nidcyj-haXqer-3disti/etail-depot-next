import { publicPageMetadata, publicPageJsonLd } from "@/modules/public-site/metadata";
import { GuideDirectory } from "@/ui/guide-directory";
import { Shell } from "@/ui/shell";

export const metadata = publicPageMetadata("/guides");

export default function GuidesPage() {
  return <Shell quietAccess>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: publicPageJsonLd("/guides") }} />
    <GuideDirectory />
  </Shell>;
}

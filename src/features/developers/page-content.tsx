import Link from "next/link";
import { ReadingGuide } from "@/shared/ui/reading-guide/reading-guide";
import type { DeveloperSlug } from "@/shared/site/developer-paths";
import { DeveloperNavigation } from "./navigation";
import { developerPageDetails,developerJsonLd } from "./metadata";
type PendingDeveloperSlug = Extract<DeveloperSlug, "sdks" | "changelog" | "api-status">;

export function DeveloperPage({slug}:{slug:PendingDeveloperSlug}){
 const details=developerPageDetails[`/developers/${slug}`];
 return <ReadingGuide title={details.title} article={{introduction:details.description,prerequisites:[],sections:[]}} jsonLd={developerJsonLd(slug)} navigation={<DeveloperNavigation current={slug}/>} contents={[]}
 heading={<span className="docs-coming-soon">Coming soon</span>} notice={<p className="docs-availability">Connect your store with our <Link prefetch={false} href="/resources/shopify-gateway-integration">Shopify</Link> or <Link prefetch={false} href="/resources/woocommerce-gateway-integration">WooCommerce</Link> guide.</p>}/>;
}

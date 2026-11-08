import Link from "next/link";
import { ReadingGuide } from "@/shared/ui/reading-guide/reading-guide";
import type { DocArticle,DocSection } from "@/shared/ui/reading-guide/types";
import type { DeveloperSlug } from "@/shared/site/developer-paths";
import { DeveloperNavigation } from "./navigation";
import { developerPageDetails,developerJsonLd } from "./metadata";
export type DeveloperTopic={id:string;title:string;article:DocArticle};
export function DeveloperPage({slug,topics=[]}:{slug:DeveloperSlug;topics?:DeveloperTopic[]}){
 const details=developerPageDetails[`/developers/${slug}`];
 const sections:DocSection[]=topics.flatMap(topic=>[
  {id:topic.id,title:topic.title,paragraphs:[topic.article.introduction],prerequisites:topic.article.prerequisites,aliases:topic.id==="checkout"?["checkout-setup"]:topic.id==="integration-access"?["developer-integration"]:undefined},
  ...topic.article.sections,
 ]);
 // Keep former overview bookmarks at the introduction without a second guide directory.
 if(slug==="getting-started"&&sections[0])sections[0].aliases=[...(sections[0].aliases??[]),
  "related-guides","topics","merchant-operations","getting-started","payment-requests",
  "payment-records","refunds-and-disputes","payouts","webhooks","testing-and-launch",
 ];
 return <ReadingGuide title={details.title} article={{introduction:details.description,prerequisites:[],sections}} jsonLd={developerJsonLd(slug)} navigation={<DeveloperNavigation current={slug}/>} contents={topics.map(({id,title})=>({id,title}))}
 heading={<span className="docs-coming-soon">Coming soon</span>} notice={<p className="docs-availability">{topics.length>0?<>Etail APIs and tools are not available yet. This guidance is for existing merchant connections.</>:<>Connect your store with our <Link prefetch={false} href="/resources/shopify-gateway-integration">Shopify</Link> or <Link prefetch={false} href="/resources/woocommerce-gateway-integration">WooCommerce</Link> guide.</>}</p>}/>;
}

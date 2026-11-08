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
 if(slug==="getting-started")sections.push({id:"related-guides",title:"More guides",aliases:["topics","merchant-operations"],links:[
  {id:"getting-started",label:"Merchant account setup",href:"/resources/merchant-account-setup"},
  {id:"payment-requests",label:"Payment requests",href:"/developers/developer-tools#payment-requests"},
  {id:"payment-records",label:"Payment status",href:"/developers/api-reference#payment-status"},
  {id:"refunds-and-disputes",label:"Refunds and disputes",href:"/developers/api-reference#refunds-and-disputes"},
  {id:"payouts",label:"Payouts and reconciliation",href:"/developers/api-reference#payouts"},
  {id:"webhooks",label:"Webhooks",href:"/developers/webhooks"},
  {id:"testing-and-launch",label:"Testing",href:"/developers/testing"},
 ]});
 return <ReadingGuide title={details.title} article={{introduction:details.description,prerequisites:[],sections}} jsonLd={developerJsonLd(slug)} navigation={<DeveloperNavigation current={slug}/>} contents={topics.map(({id,title})=>({id,title}))}
 heading={<span className="docs-coming-soon">Coming soon</span>} notice={<p className="docs-availability">{topics.length>0?<>Etail APIs and tools are not available yet. This guidance is for existing merchant connections.</>:<>For an existing store, follow our <Link prefetch={false} href="/resources/guides">integration guides</Link>.</>}</p>}/>;
}

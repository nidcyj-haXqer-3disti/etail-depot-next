import { DeveloperPage } from "@/features/developers/page-content";
import { developerMetadata } from "@/features/developers/metadata";
import { paymentStatusArticle } from "@/features/developers/guidance/payment-status";
import { refundsAndDisputesArticle } from "@/features/developers/guidance/refunds-and-disputes";
import { payoutsArticle } from "@/features/developers/guidance/payouts";

export const metadata=developerMetadata("api-reference");
export default function Page(){return <DeveloperPage slug="api-reference" topics={[{id:"payment-status",title:"Payment status",article:paymentStatusArticle},{id:"refunds-and-disputes",title:"Refunds and disputes",article:refundsAndDisputesArticle},{id:"payouts",title:"Payouts and reconciliation",article:payoutsArticle}]}/>;}

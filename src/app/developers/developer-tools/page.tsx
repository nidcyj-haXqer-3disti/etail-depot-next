import { DeveloperPage } from "@/features/developers/page-content";
import { developerMetadata } from "@/features/developers/metadata";
import { paymentRequestsArticle } from "@/features/developers/guidance/payment-requests";

export const metadata=developerMetadata("developer-tools");
export default function Page(){return <DeveloperPage slug="developer-tools" topics={[{id:"payment-requests",title:"Payment requests",article:paymentRequestsArticle}]}/>;}

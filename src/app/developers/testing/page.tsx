import { DeveloperPage } from "@/features/developers/page-content";
import { developerMetadata } from "@/features/developers/metadata";
import { testingAndLaunchArticle } from "@/features/developers/guidance/testing-and-launch";

export const metadata=developerMetadata("testing");
export default function Page(){return <DeveloperPage slug="testing" topics={[{id:"testing-and-launch",title:"Launch preparation",article:testingAndLaunchArticle}]}/>;}

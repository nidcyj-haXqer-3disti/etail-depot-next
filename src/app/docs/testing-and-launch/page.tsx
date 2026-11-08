import { testingAndLaunchArticle } from "@/features/resources/documentation/testing-and-launch/content";
import { DocumentationArticle } from "@/features/resources/documentation/documentation";

export { metadata } from "@/features/resources/documentation/testing-and-launch/metadata";
export default function Page() { return <DocumentationArticle article={testingAndLaunchArticle} slug="testing-and-launch" />; }

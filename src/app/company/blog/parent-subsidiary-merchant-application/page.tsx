import { articleMetadata } from "@/features/company/blog/metadata";
import { applicantEntityArticle } from "@/features/company/blog/applicant-entity-content";

export const metadata = articleMetadata(applicantEntityArticle);
export { ApplicantEntityPage as default } from "@/features/company/blog/applicant-entity-page";

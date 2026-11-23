import { articleMetadata } from "@/features/company/blog/metadata";
import { applicantNameArticle } from "@/features/company/blog/applicant-name-content";

export const metadata = articleMetadata(applicantNameArticle);
export { ApplicantNamePage as default } from "@/features/company/blog/applicant-name-page";

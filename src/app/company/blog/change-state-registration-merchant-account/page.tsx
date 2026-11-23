import { articleMetadata } from "@/features/company/blog/metadata";
import { stateRegistrationChangeArticle } from "@/features/company/blog/state-registration-change-content";

export const metadata = articleMetadata(stateRegistrationChangeArticle);
export { StateRegistrationChangePage as default } from "@/features/company/blog/state-registration-change-page";

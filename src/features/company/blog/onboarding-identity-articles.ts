import { applicantNameArticle } from "./applicant-name-content";
import { einAssignmentArticle } from "./ein-assignment-content";
import { ownershipEvidenceArticle } from "./ownership-evidence-content";
import { applicationRepresentativeArticle } from "./application-representative-content";
import { firstBankStatementArticle } from "./first-bank-statement-content";
import { identityCaptureArticle } from "./identity-capture-content";
import { addressPurposeArticle } from "./address-purpose-content";
import { registeredAddressArticle } from "./registered-address-content";
import { applicantEntityArticle } from "./applicant-entity-content";
import { overseasOwnerArticle } from "./overseas-owner-content";
import { addressHistoryArticle } from "./address-history-content";
import { nameHistoryArticle } from "./name-history-content";
import { foreignRecordsArticle } from "./foreign-records-content";
import { privateApplicationFilesArticle } from "./private-application-files-content";
import { completeBankEvidenceArticle } from "./complete-bank-evidence-content";
import { missingVerificationArticle } from "./missing-verification-content";

/** Fifth local expansion batch. These articles remain in the single Blog collection. */
export const onboardingIdentityArticles = [
  applicantNameArticle,
  einAssignmentArticle,
  ownershipEvidenceArticle,
  applicationRepresentativeArticle,
  firstBankStatementArticle,
  identityCaptureArticle,
  addressPurposeArticle,
  registeredAddressArticle,
  applicantEntityArticle,
  overseasOwnerArticle,
  addressHistoryArticle,
  nameHistoryArticle,
  foreignRecordsArticle,
  privateApplicationFilesArticle,
  completeBankEvidenceArticle,
  missingVerificationArticle,
] as const;

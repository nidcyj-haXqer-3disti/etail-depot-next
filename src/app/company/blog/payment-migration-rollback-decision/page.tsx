import { articleMetadata } from "@/features/company/blog/metadata";
import { migrationRollbackArticle } from "@/features/company/blog/migration-rollback-content";

export const metadata = articleMetadata(migrationRollbackArticle);
export { MigrationRollbackPage as default } from "@/features/company/blog/migration-rollback-page";

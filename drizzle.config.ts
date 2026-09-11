import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: ['./src/platform/database/schema.ts', './src/modules/access/schema.ts', './src/modules/cases/schema.ts', './src/modules/reports/schema.ts', './src/modules/services/schema.ts', './src/modules/acquiring/schema.ts', './src/modules/acquiring/operations-schema.ts', './src/modules/acquiring/card-checkout-schema.ts', './src/modules/acquiring/settlement-schema.ts', './src/modules/acquiring/guest-schema.ts', './src/modules/ledger/schema.ts', './src/modules/workspace/funding-schema.ts', './src/modules/operations/schema.ts', './src/modules/identity/schema.ts', './src/modules/sandbox/schema.ts'],
  out: './netlify/database/migrations',
});

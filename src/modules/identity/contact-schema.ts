import { sql } from "drizzle-orm";
import { check, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { identityBindings } from "../../platform/database/schema";

/** Provider-verified contact only; never populated from registration or profile input. */
export const identityVerifiedEmails = pgTable("identity_verified_emails", {
  identityId: uuid().primaryKey().references(() => identityBindings.id),
  emailNormalized: text().notNull(), provenance: text().notNull(),
  verifiedAt: timestamp({ withTimezone: true }).notNull(), observedAt: timestamp({ withTimezone: true }).notNull(),
}, t => [check("identity_verified_email_normalized", sql`${t.emailNormalized}=lower(btrim(${t.emailNormalized})) and length(${t.emailNormalized}) between 3 and 254`), check("identity_verified_email_provenance", sql`${t.provenance}='NETLIFY_USER_CONFIRMED'`), check("identity_verified_email_dates", sql`${t.verifiedAt}<=${t.observedAt}`)]);

/** Navigation only. This record cannot authenticate or authorize an invitation. */
export const identityContinuations = pgTable("identity_continuations", {
  tokenHash: text().primaryKey(), invitationId: uuid().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull(), expiresAt: timestamp({ withTimezone: true }).notNull(),
}, t => [check("identity_continuation_hash", sql`${t.tokenHash} ~ '^[a-f0-9]{64}$'`), check("identity_continuation_expiry", sql`${t.expiresAt}>${t.createdAt} and ${t.expiresAt}<=${t.createdAt}+interval '1 day'`)]);

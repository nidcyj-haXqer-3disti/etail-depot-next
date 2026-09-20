-- D73 reviewed migration: preserve every historical financial row and stable resource ID.
-- Historical delegation tables remain immutable and are not queried by the application.
CREATE TABLE merchant_hierarchy_history AS SELECT id,kind,"masterId","masterKind","masterServiceId","masterServiceKind",clock_timestamp() AS "archivedAt" FROM merchant_units;
CREATE TRIGGER merchant_hierarchy_history_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON merchant_hierarchy_history FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
--> statement-breakpoint
CREATE TABLE "merchant_dispute_commands" (
	"commandId" uuid PRIMARY KEY,
	"disputeId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"kind" text NOT NULL,
	"digest" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "dispute_command_values" CHECK ("kind" in ('OPEN','RESPOND','REVIEW') and "digest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "merchant_dispute_messages" (
	"id" uuid PRIMARY KEY,
	"disputeId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"kind" text NOT NULL,
	"authorRole" text NOT NULL,
	"message" text NOT NULL,
	"evidence" text DEFAULT '' NOT NULL,
	"sequence" integer NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "dispute_message_sequence" UNIQUE("disputeId","sequence"),
	CONSTRAINT "dispute_message_fields" CHECK ("sequence">0 and char_length(trim("message")) between 1 and 2000 and char_length("evidence")<=4000 and "kind" in ('OPENED','RESPONSE','MORE_INFORMATION','RESOLVED') and "authorRole" in ('PAYER','OWNER','TERMINAL_USER','OPERATOR'))
);
--> statement-breakpoint
CREATE TABLE "merchant_disputes" (
	"id" uuid PRIMARY KEY,
	"paymentId" uuid NOT NULL UNIQUE,
	"terminalId" uuid NOT NULL,
	"serviceId" uuid NOT NULL,
	"payerId" uuid NOT NULL,
	"reason" text NOT NULL,
	"amountMinor" bigint NOT NULL,
	"status" text DEFAULT 'NEEDS_RESPONSE' NOT NULL,
	"resolution" text,
	"version" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "dispute_terminal_scope" UNIQUE("id","terminalId","serviceId"),
	CONSTRAINT "dispute_values" CHECK ("amountMinor">0 and "version">0 and "reason" in ('NOT_RECEIVED','NOT_AS_DESCRIBED','DUPLICATE','OTHER') and "status" in ('NEEDS_RESPONSE','IN_REVIEW','RESOLVED')),
	CONSTRAINT "dispute_resolution_shape" CHECK (("status"='RESOLVED' and "resolution" in ('CLOSED_NO_REFUND','REFUND_RECOMMENDED')) or ("status"<>'RESOLVED' and "resolution" is null))
);
--> statement-breakpoint
CREATE TABLE "money_account_services" (
	"serviceId" uuid PRIMARY KEY,
	"moneyAccountId" uuid NOT NULL CONSTRAINT "one_service_per_money_account" UNIQUE,
	"serviceKind" "service_kind" NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "money_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"ownerPersonId" uuid NOT NULL,
	"displayName" text NOT NULL,
	"serviceKind" "service_kind" NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "money_account_kind_scope" UNIQUE("id","serviceKind"),
	CONSTRAINT "money_account_fields" CHECK (char_length(trim("displayName")) between 1 and 80 and "currency"='USD' and "status" in ('ACTIVE','SUSPENDED','CLOSED') and "version">0)
);
--> statement-breakpoint
CREATE TABLE "money_commands" (
	"commandId" uuid PRIMARY KEY,
	"moneyAccountId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"kind" text NOT NULL,
	"digest" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "money_command_fields" CHECK ("kind" in ('PREPARE_FUNDING','FUND','PREPARE_WITHDRAWAL','WITHDRAW','WITHDRAWAL_RESULT') and "digest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "money_cutover_transfers" (
	"id" uuid PRIMARY KEY,
	"moneyAccountId" uuid NOT NULL,
	"sourceServiceId" uuid NOT NULL,
	"sourceBucket" text NOT NULL,
	"sourceMerchantUnitId" uuid,
	"amountMinor" bigint NOT NULL,
	"journalId" uuid NOT NULL UNIQUE,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "money_cutover_source" CHECK (("sourceBucket"='GROUP_AVAILABLE' and "sourceMerchantUnitId" is null) or ("sourceBucket"='PAYOUT_CLEARING' and "sourceMerchantUnitId" is not null)),
	CONSTRAINT "money_cutover_amount" CHECK ("amountMinor">0)
);
--> statement-breakpoint
CREATE TABLE "money_funding_intents" (
	"id" uuid PRIMARY KEY,
	"moneyAccountId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"amountMinor" bigint NOT NULL,
	"confirmCommandId" uuid NOT NULL UNIQUE,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "money_funding_intent_amount" CHECK ("amountMinor" between 1 and 999999999999)
);
--> statement-breakpoint
CREATE TABLE "money_topups" (
	"id" uuid PRIMARY KEY,
	"commandId" uuid NOT NULL UNIQUE,
	"moneyAccountId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"amountMinor" bigint NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"source" text DEFAULT 'SANDBOX_BANK' NOT NULL,
	"journalId" uuid NOT NULL UNIQUE,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "money_topup_fields" CHECK ("amountMinor" between 1 and 999999999999 and "currency"='USD' and "source"='SANDBOX_BANK')
);
--> statement-breakpoint
CREATE TABLE "money_withdrawal_events" (
	"withdrawalId" uuid PRIMARY KEY,
	"commandId" uuid NOT NULL UNIQUE,
	"actorId" uuid NOT NULL,
	"outcome" text NOT NULL,
	"journalId" uuid NOT NULL UNIQUE,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "money_withdrawal_outcome" CHECK ("outcome" in ('COMPLETED','FAILED'))
);
--> statement-breakpoint
CREATE TABLE "money_withdrawal_intents" (
	"id" uuid PRIMARY KEY,
	"moneyAccountId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"amountMinor" bigint NOT NULL,
	"confirmCommandId" uuid NOT NULL UNIQUE,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "money_withdrawal_intent_amount" CHECK ("amountMinor" between 1 and 999999999999)
);
--> statement-breakpoint
CREATE TABLE "money_withdrawals" (
	"id" uuid PRIMARY KEY,
	"intentId" uuid NOT NULL UNIQUE,
	"commandId" uuid NOT NULL UNIQUE,
	"moneyAccountId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"amountMinor" bigint NOT NULL,
	"journalId" uuid NOT NULL UNIQUE,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "money_withdrawal_amount" CHECK ("amountMinor" between 1 and 999999999999)
);
--> statement-breakpoint
CREATE TABLE "terminal_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"terminalId" uuid NOT NULL,
	"personId" uuid NOT NULL,
	"grantedByPersonId" uuid NOT NULL,
	"ownerMembershipVersion" integer NOT NULL,
	"state" text DEFAULT 'ACCEPTED' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"expiresAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"revokedAt" timestamp with time zone,
	CONSTRAINT "terminal_assignment_scope" UNIQUE("id","terminalId"),
	CONSTRAINT "terminal_assignment_fields" CHECK ("state" in ('ACCEPTED','REVOKED') and "version">0 and "ownerMembershipVersion">0 and ("expiresAt" is null or "expiresAt">"createdAt"))
);
--> statement-breakpoint
CREATE TABLE "terminal_invitation_terms" (
	"invitationId" uuid PRIMARY KEY,
	"terminalId" uuid NOT NULL,
	"grantedByPersonId" uuid NOT NULL,
	"ownerMembershipVersion" integer NOT NULL,
	"accessExpiresAt" timestamp with time zone,
	CONSTRAINT "terminal_invitation_owner_version" CHECK ("ownerMembershipVersion">0)
);
--> statement-breakpoint
CREATE TABLE "merchant_settlement_credits" (
	"id" uuid PRIMARY KEY,
	"settlementId" uuid NOT NULL UNIQUE,
	"moneyAccountId" uuid NOT NULL,
	"serviceId" uuid NOT NULL,
	"merchantUnitId" uuid NOT NULL,
	"amountMinor" bigint NOT NULL,
	"actorId" uuid NOT NULL,
	"journalId" uuid NOT NULL UNIQUE,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "settlement_credit_positive" CHECK ("amountMinor">0)
);
--> statement-breakpoint
CREATE TABLE "card_limit_changes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"serviceId" uuid NOT NULL,
	"cardId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"previousMinor" bigint NOT NULL,
	"allowanceMinor" bigint NOT NULL,
	"version" integer NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "card_limit_history_version" UNIQUE("serviceId","cardId","version"),
	CONSTRAINT "card_limit_change_values" CHECK ("previousMinor" between 0 and 999999999999 and "allowanceMinor" between 0 and 999999999999 and "version">0)
);
--> statement-breakpoint
CREATE TABLE "card_spending_limits" (
	"serviceId" uuid,
	"cardId" uuid,
	"allowanceMinor" bigint NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"updatedBy" uuid NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"reviewRequired" boolean DEFAULT false NOT NULL,
	CONSTRAINT "card_spending_limits_pkey" PRIMARY KEY("serviceId","cardId"),
	CONSTRAINT "card_allowance" CHECK ("allowanceMinor" between 0 and 999999999999 and "version">0)
);
--> statement-breakpoint
ALTER TABLE "merchant_units" RENAME TO "merchant_terminals";
--> statement-breakpoint
ALTER TABLE "merchant_terminals" DROP CONSTRAINT "merchant_units_UxCiXD4xdYQl_fkey";
--> statement-breakpoint
ALTER TABLE "merchant_terminals" DROP CONSTRAINT "merchant_unit_parent_scope";
--> statement-breakpoint
ALTER TABLE "merchant_terminals" DROP CONSTRAINT "merchant_unit_shape";
--> statement-breakpoint
ALTER TABLE "merchant_terminals" DROP CONSTRAINT "merchant_unit_status";
--> statement-breakpoint
ALTER TABLE "merchant_terminals" DROP CONSTRAINT "merchant_unit_fields";
--> statement-breakpoint
DROP INDEX "merchant_unit_one_primary";
--> statement-breakpoint
DROP INDEX "merchant_units_primary";
--> statement-breakpoint
ALTER TABLE "merchant_settlements" ADD COLUMN "moneyAccountId" uuid;
--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD COLUMN "moneyAccountId" uuid;
--> statement-breakpoint
ALTER TABLE "operator_service_access" ADD COLUMN "canResolveDisputes" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "merchant_terminals" DROP COLUMN "kind";
--> statement-breakpoint
ALTER TABLE "merchant_terminals" DROP COLUMN "masterId";
--> statement-breakpoint
ALTER TABLE "merchant_terminals" DROP COLUMN "masterKind";
--> statement-breakpoint
ALTER TABLE "payment_channels" ALTER COLUMN "creatorBasis" SET DEFAULT 'OWNER_MEMBER';
--> statement-breakpoint
ALTER TABLE "ledger_entries" ALTER COLUMN "serviceId" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "merchant_terminals" RENAME CONSTRAINT "merchant_unit_service_scope" TO "merchant_terminal_service_scope";
--> statement-breakpoint
CREATE INDEX "dispute_terminal_updated" ON "merchant_disputes" ("terminalId","updatedAt");
--> statement-breakpoint
CREATE INDEX "money_account_owner" ON "money_accounts" ("ownerPersonId","id");
--> statement-breakpoint
CREATE INDEX "money_topup_account_date" ON "money_topups" ("moneyAccountId","createdAt");
--> statement-breakpoint
CREATE INDEX "money_withdrawal_account_date" ON "money_withdrawals" ("moneyAccountId","createdAt");
--> statement-breakpoint
CREATE UNIQUE INDEX "terminal_assignment_live_person" ON "terminal_assignments" ("terminalId","personId") WHERE "state"='ACCEPTED';
--> statement-breakpoint
CREATE INDEX "terminal_assignment_person" ON "terminal_assignments" ("personId","terminalId");
--> statement-breakpoint
CREATE INDEX "merchant_terminals_service" ON "merchant_terminals" ("masterServiceId","id");
--> statement-breakpoint
CREATE INDEX "ledger_money_account_position" ON "ledger_entries" ("moneyAccountId","bucket");
--> statement-breakpoint
ALTER TABLE "merchant_dispute_commands" ADD CONSTRAINT "merchant_dispute_commands_disputeId_merchant_disputes_id_fkey" FOREIGN KEY ("disputeId") REFERENCES "merchant_disputes"("id");
--> statement-breakpoint
ALTER TABLE "merchant_dispute_commands" ADD CONSTRAINT "merchant_dispute_commands_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "merchant_dispute_messages" ADD CONSTRAINT "merchant_dispute_messages_disputeId_merchant_disputes_id_fkey" FOREIGN KEY ("disputeId") REFERENCES "merchant_disputes"("id");
--> statement-breakpoint
ALTER TABLE "merchant_dispute_messages" ADD CONSTRAINT "merchant_dispute_messages_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "merchant_disputes" ADD CONSTRAINT "merchant_disputes_payerId_people_id_fkey" FOREIGN KEY ("payerId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "merchant_disputes" ADD CONSTRAINT "merchant_disputes_advm2vMQf2Qi_fkey" FOREIGN KEY ("paymentId","terminalId","serviceId") REFERENCES "merchant_test_payments"("id","merchantUnitId","serviceId");
--> statement-breakpoint
ALTER TABLE "merchant_disputes" ADD CONSTRAINT "merchant_disputes_CS9PQXAvMPi9_fkey" FOREIGN KEY ("terminalId","serviceId") REFERENCES "merchant_terminals"("id","masterServiceId");
--> statement-breakpoint
ALTER TABLE "money_account_services" ADD CONSTRAINT "money_account_services_moneyAccountId_money_accounts_id_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "money_accounts"("id");
--> statement-breakpoint
ALTER TABLE "money_account_services" ADD CONSTRAINT "money_account_services_Gi8qdeOqAoCg_fkey" FOREIGN KEY ("serviceId","serviceKind") REFERENCES "services"("id","kind");
--> statement-breakpoint
ALTER TABLE "money_account_services" ADD CONSTRAINT "money_account_services_BQcwMl2mdAw8_fkey" FOREIGN KEY ("moneyAccountId","serviceKind") REFERENCES "money_accounts"("id","serviceKind");
--> statement-breakpoint
ALTER TABLE "money_accounts" ADD CONSTRAINT "money_accounts_ownerPersonId_people_id_fkey" FOREIGN KEY ("ownerPersonId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "money_commands" ADD CONSTRAINT "money_commands_moneyAccountId_money_accounts_id_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "money_accounts"("id");
--> statement-breakpoint
ALTER TABLE "money_commands" ADD CONSTRAINT "money_commands_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "money_cutover_transfers" ADD CONSTRAINT "money_cutover_transfers_moneyAccountId_money_accounts_id_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "money_accounts"("id");
--> statement-breakpoint
ALTER TABLE "money_cutover_transfers" ADD CONSTRAINT "money_cutover_transfers_sourceServiceId_services_id_fkey" FOREIGN KEY ("sourceServiceId") REFERENCES "services"("id");
--> statement-breakpoint
ALTER TABLE "money_cutover_transfers" ADD CONSTRAINT "money_cutover_transfers_journalId_ledger_journals_id_fkey" FOREIGN KEY ("journalId") REFERENCES "ledger_journals"("id");
--> statement-breakpoint
ALTER TABLE "money_funding_intents" ADD CONSTRAINT "money_funding_intents_moneyAccountId_money_accounts_id_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "money_accounts"("id");
--> statement-breakpoint
ALTER TABLE "money_funding_intents" ADD CONSTRAINT "money_funding_intents_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "money_topups" ADD CONSTRAINT "money_topups_moneyAccountId_money_accounts_id_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "money_accounts"("id");
--> statement-breakpoint
ALTER TABLE "money_topups" ADD CONSTRAINT "money_topups_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "money_topups" ADD CONSTRAINT "money_topups_journalId_ledger_journals_id_fkey" FOREIGN KEY ("journalId") REFERENCES "ledger_journals"("id");
--> statement-breakpoint
ALTER TABLE "money_withdrawal_events" ADD CONSTRAINT "money_withdrawal_events_withdrawalId_money_withdrawals_id_fkey" FOREIGN KEY ("withdrawalId") REFERENCES "money_withdrawals"("id");
--> statement-breakpoint
ALTER TABLE "money_withdrawal_events" ADD CONSTRAINT "money_withdrawal_events_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "money_withdrawal_events" ADD CONSTRAINT "money_withdrawal_events_journalId_ledger_journals_id_fkey" FOREIGN KEY ("journalId") REFERENCES "ledger_journals"("id");
--> statement-breakpoint
ALTER TABLE "money_withdrawal_intents" ADD CONSTRAINT "money_withdrawal_intents_moneyAccountId_money_accounts_id_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "money_accounts"("id");
--> statement-breakpoint
ALTER TABLE "money_withdrawal_intents" ADD CONSTRAINT "money_withdrawal_intents_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "money_withdrawals" ADD CONSTRAINT "money_withdrawals_intentId_money_withdrawal_intents_id_fkey" FOREIGN KEY ("intentId") REFERENCES "money_withdrawal_intents"("id");
--> statement-breakpoint
ALTER TABLE "money_withdrawals" ADD CONSTRAINT "money_withdrawals_moneyAccountId_money_accounts_id_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "money_accounts"("id");
--> statement-breakpoint
ALTER TABLE "money_withdrawals" ADD CONSTRAINT "money_withdrawals_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "money_withdrawals" ADD CONSTRAINT "money_withdrawals_journalId_ledger_journals_id_fkey" FOREIGN KEY ("journalId") REFERENCES "ledger_journals"("id");
--> statement-breakpoint
ALTER TABLE "terminal_assignments" ADD CONSTRAINT "terminal_assignments_terminalId_merchant_terminals_id_fkey" FOREIGN KEY ("terminalId") REFERENCES "merchant_terminals"("id");
--> statement-breakpoint
ALTER TABLE "terminal_assignments" ADD CONSTRAINT "terminal_assignments_personId_people_id_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "terminal_assignments" ADD CONSTRAINT "terminal_assignments_grantedByPersonId_people_id_fkey" FOREIGN KEY ("grantedByPersonId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "terminal_invitation_terms" ADD CONSTRAINT "terminal_invitation_terms_7HcF0avoFEmI_fkey" FOREIGN KEY ("invitationId") REFERENCES "service_invitations"("id");
--> statement-breakpoint
ALTER TABLE "terminal_invitation_terms" ADD CONSTRAINT "terminal_invitation_terms_terminalId_merchant_terminals_id_fkey" FOREIGN KEY ("terminalId") REFERENCES "merchant_terminals"("id");
--> statement-breakpoint
ALTER TABLE "terminal_invitation_terms" ADD CONSTRAINT "terminal_invitation_terms_grantedByPersonId_people_id_fkey" FOREIGN KEY ("grantedByPersonId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "terminal_invitation_terms" ADD CONSTRAINT "terminal_invitation_terms_EQQCAzwpqjx4_fkey" FOREIGN KEY ("invitationId","terminalId") REFERENCES "service_invitations"("id","merchantUnitId");
--> statement-breakpoint
ALTER TABLE "merchant_settlement_credits" ADD CONSTRAINT "merchant_settlement_credits_6LKzyFIjnaoq_fkey" FOREIGN KEY ("settlementId") REFERENCES "merchant_settlements"("id");
--> statement-breakpoint
ALTER TABLE "merchant_settlement_credits" ADD CONSTRAINT "merchant_settlement_credits_SDp2hLtKcmli_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "money_accounts"("id");
--> statement-breakpoint
ALTER TABLE "merchant_settlement_credits" ADD CONSTRAINT "merchant_settlement_credits_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "merchant_settlement_credits" ADD CONSTRAINT "merchant_settlement_credits_journalId_ledger_journals_id_fkey" FOREIGN KEY ("journalId") REFERENCES "ledger_journals"("id");
--> statement-breakpoint
ALTER TABLE "merchant_settlement_credits" ADD CONSTRAINT "merchant_settlement_credits_Yfnq4uwbkZM8_fkey" FOREIGN KEY ("settlementId","merchantUnitId","serviceId") REFERENCES "merchant_settlements"("id","merchantUnitId","serviceId");
--> statement-breakpoint
ALTER TABLE "merchant_settlements" ADD CONSTRAINT "merchant_settlements_moneyAccountId_money_accounts_id_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "money_accounts"("id");
--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_moneyAccountId_money_accounts_id_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "money_accounts"("id");
--> statement-breakpoint
ALTER TABLE "card_limit_changes" ADD CONSTRAINT "card_limit_changes_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "card_limit_changes" ADD CONSTRAINT "card_limit_changes_S52V0U066Y0x_fkey" FOREIGN KEY ("serviceId","cardId") REFERENCES "card_spending_limits"("serviceId","cardId");
--> statement-breakpoint
ALTER TABLE "card_spending_limits" ADD CONSTRAINT "card_spending_limits_updatedBy_people_id_fkey" FOREIGN KEY ("updatedBy") REFERENCES "people"("id");
--> statement-breakpoint
ALTER TABLE "card_spending_limits" ADD CONSTRAINT "card_spending_limits_cardId_serviceId_cards_id_serviceId_fkey" FOREIGN KEY ("cardId","serviceId") REFERENCES "cards"("id","serviceId");
--> statement-breakpoint
ALTER TABLE "merchant_terminals" ADD CONSTRAINT "merchant_terminal_service_kind" CHECK ("masterServiceKind"='MERCHANT');
--> statement-breakpoint
ALTER TABLE "merchant_terminals" ADD CONSTRAINT "merchant_terminal_status" CHECK ("status" in ('ACTIVE','PAUSED','CLOSED'));
--> statement-breakpoint
ALTER TABLE "merchant_terminals" ADD CONSTRAINT "merchant_terminal_fields" CHECK (char_length("displayName") between 1 and 80 and "version">0);
--> statement-breakpoint
ALTER TABLE "card_requests" DROP CONSTRAINT "card_request_amount", ADD CONSTRAINT "card_request_amount" CHECK ("requestedLimitMinor" between 0 and 999999999999 and "currency"='USD');
--> statement-breakpoint
ALTER TABLE "access_command_receipts" DROP CONSTRAINT "access_command_target_shape";
UPDATE "access_command_receipts" SET "targetKind"='MERCHANT_TERMINAL' WHERE "targetKind"='MERCHANT_UNIT';
ALTER TABLE "access_command_receipts" ADD CONSTRAINT "access_command_target_shape" CHECK (("targetKind"='SERVICE' and "serviceId" is not null and "merchantUnitId" is null) or ("targetKind"='MERCHANT_TERMINAL' and "serviceId" is null and "merchantUnitId" is not null));
--> statement-breakpoint
ALTER TABLE "service_access_history" DROP CONSTRAINT "access_history_target_shape";
UPDATE "service_access_history" SET "targetKind"='MERCHANT_TERMINAL' WHERE "targetKind"='MERCHANT_UNIT';
ALTER TABLE "service_access_history" ADD CONSTRAINT "access_history_target_shape" CHECK (("targetKind"='SERVICE' and "serviceId" is not null and "merchantUnitId" is null) or ("targetKind"='MERCHANT_TERMINAL' and "serviceId" is null and "merchantUnitId" is not null));
--> statement-breakpoint
ALTER TABLE "service_invitations" DROP CONSTRAINT "invitation_target_shape";
UPDATE "service_invitations" SET "targetKind"='MERCHANT_TERMINAL' WHERE "targetKind"='MERCHANT_UNIT';
ALTER TABLE "service_invitations" ADD CONSTRAINT "invitation_target_shape" CHECK (("targetKind"='SERVICE' and "serviceId" is not null and "merchantUnitId" is null and "role" is not null) or ("targetKind"='MERCHANT_TERMINAL' and "serviceId" is null and "merchantUnitId" is not null and "role" is null));
--> statement-breakpoint
ALTER TABLE "service_invitations" DROP CONSTRAINT "invitation_role_valid";
UPDATE "service_invitations" SET "role"='CARDHOLDER' WHERE "role"='SECONDARY';
ALTER TABLE "service_invitations" ADD CONSTRAINT "invitation_role_valid" CHECK ("role" in ('CARDHOLDER'));
--> statement-breakpoint
ALTER TABLE "merchant_unit_commands" DROP CONSTRAINT "merchant_unit_command_kind", ADD CONSTRAINT "merchant_unit_command_kind" CHECK ("kind" in ('CREATE_SUB','CREATE_TERMINAL','PAUSE','RESUME'));
--> statement-breakpoint
ALTER TABLE "payment_channels" DROP CONSTRAINT "payment_channel_creator_basis", ADD CONSTRAINT "payment_channel_creator_basis" CHECK ("creatorBasis" in ('OWNER_MEMBER','TERMINAL_ASSIGNMENT','PRIMARY_MEMBER','MERCHANT_ASSIGNMENT') and (("creatorBasis"in ('TERMINAL_ASSIGNMENT','MERCHANT_ASSIGNMENT') and "creatorAssignmentId" is not null) or ("creatorBasis"not in ('TERMINAL_ASSIGNMENT','MERCHANT_ASSIGNMENT') and "creatorAssignmentId" is null)));
--> statement-breakpoint
ALTER TABLE "merchant_operation_commands" DROP CONSTRAINT "merchant_operation_command_fields", ADD CONSTRAINT "merchant_operation_command_fields" CHECK ("kind" in ('GATEWAY','ENROLLMENT','ACTIVATION','PAYMENT','REFUND','PAYOUT','SETTLEMENT') and "digest" ~ '^[0-9a-f]{64}$' and char_length("scopeKey") between 1 and 120);
--> statement-breakpoint
ALTER TABLE "ledger_entries" DROP CONSTRAINT "ledger_entry_resource_shape", ADD CONSTRAINT "ledger_entry_resource_shape" CHECK (("moneyAccountId" is not null and "serviceId" is null and "cardId" is null and "merchantUnitId" is null and "bucket" in ('MONEY_SOURCE','MONEY_AVAILABLE','MONEY_WITHDRAWAL_PENDING','MONEY_WITHDRAWN')) or ("moneyAccountId" is null and "serviceId" is not null and (("bucket" in ('PRACTICE_SOURCE','GROUP_AVAILABLE') and "cardId" is null and "merchantUnitId" is null) or ("bucket" in ('CARD_AVAILABLE','CARD_SPENT') and "cardId" is not null and "merchantUnitId" is null) or ("bucket" in ('GATEWAY_CLEARING','MERCHANT_AVAILABLE','MERCHANT_SETTLED','MERCHANT_PAYOUT_PENDING','PAYOUT_CLEARING') and "cardId" is null and "merchantUnitId" is not null))));
--> statement-breakpoint
ALTER TABLE "ledger_journals" DROP CONSTRAINT "ledger_journal_kind", ADD CONSTRAINT "ledger_journal_kind" CHECK ("kind" in ('GROUP_FUNDING','CARD_FUNDING','CARD_PURCHASE','CARD_REFUND','MERCHANT_PAYMENT','MERCHANT_REFUND','MERCHANT_PAYOUT','MERCHANT_SETTLEMENT','DEPOSIT_RESERVE','DEPOSIT_RELEASE','MONEY_FUNDING','MONEY_WITHDRAWAL_RESERVE','MONEY_WITHDRAWAL_COMPLETE','MONEY_WITHDRAWAL_RELEASE','MONEY_CUTOVER'));
--> statement-breakpoint
-- Reviewed supplement: src/modules/access/terminal-cutover.sql
-- D73 fixed-role conversion records the previous grants for audit.
CREATE TABLE service_permission_history_d73 AS SELECT *,clock_timestamp() AS "archivedAt" FROM permission_grants;
CREATE TRIGGER service_permission_history_d73_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON service_permission_history_d73 FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
UPDATE permission_grants p SET state='REVOKED',delegable=false FROM services s WHERE p."serviceId"=s.id AND ((s.kind='CARDHOLDER' AND p."personId"<>s."primaryPersonId") OR p.action IN ('people.changeRole','merchant.units.create','merchant.units.pause','payments.simulate'));
INSERT INTO permission_grants ("serviceId","personId",action,state,delegable)
SELECT m."serviceId",m."personId",a.action,'ACCEPTED',false FROM service_members m JOIN services s ON s.id=m."serviceId"
CROSS JOIN unnest(ARRAY['cards.read','cards.hold','cards.purchase','cards.freeze','cards.unfreeze','activity.read','notifications.manage']) AS a(action)
WHERE s.kind='CARDHOLDER' AND m."personId"<>s."primaryPersonId" AND m.state='ACCEPTED'
ON CONFLICT ("serviceId","personId",action) DO UPDATE SET state='ACCEPTED',delegable=false;
INSERT INTO permission_grants ("serviceId","personId",action,state,delegable)
SELECT m."serviceId",m."personId",a.action,'ACCEPTED',false FROM service_members m JOIN services s ON s.id=m."serviceId"
CROSS JOIN unnest(ARRAY['merchant.terminals.create','merchant.terminals.pause']) AS a(action)
WHERE s.kind='MERCHANT' AND m."personId"=s."primaryPersonId" AND m.state='ACCEPTED'
ON CONFLICT ("serviceId","personId",action) DO UPDATE SET state='ACCEPTED',delegable=false;

--> statement-breakpoint
-- D73 access cutover. Preserve dated delegation records; only direct owner
-- assignments become current terminal access. Recursive grants never migrate.
INSERT INTO terminal_assignments (id,"terminalId","personId","grantedByPersonId","ownerMembershipVersion",state,version,"expiresAt","createdAt","revokedAt")
SELECT a.id,a."merchantUnitId",a."personId",a."sourcePrimaryPersonId",a."sourceMembershipVersion",
 CASE WHEN a.state='ACCEPTED' AND a."expiresAt">transaction_timestamp() AND m.state='ACCEPTED' AND m.version=a."sourceMembershipVersion" THEN 'ACCEPTED' ELSE 'REVOKED' END,
 a.version,a."expiresAt",a."createdAt",CASE WHEN a.state='ACCEPTED' AND a."expiresAt">transaction_timestamp() AND m.state='ACCEPTED' AND m.version=a."sourceMembershipVersion" THEN NULL ELSE coalesce(a."revokedAt",transaction_timestamp()) END
FROM merchant_assignments a JOIN merchant_terminals t ON t.id=a."merchantUnitId"
JOIN services s ON s.id=t."masterServiceId" AND s."primaryPersonId"=a."sourcePrimaryPersonId"
LEFT JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId"
WHERE a."sourceAssignmentId" IS NULL;
--> statement-breakpoint
-- Keep every invitation readable, including a revoked historical delegation.
INSERT INTO terminal_invitation_terms ("invitationId","terminalId","grantedByPersonId","ownerMembershipVersion","accessExpiresAt")
SELECT i.id,i."merchantUnitId",s."primaryPersonId",coalesce(mt."sourceMembershipVersion",m.version,1),mt."accessExpiresAt"
FROM service_invitations i JOIN merchant_terminals t ON t.id=i."merchantUnitId" JOIN services s ON s.id=t."masterServiceId"
LEFT JOIN merchant_invitation_terms mt ON mt."invitationId"=i.id
LEFT JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId"
WHERE i."targetKind"='MERCHANT_TERMINAL';
--> statement-breakpoint
UPDATE service_invitations i SET status='REVOKED',version=i.version+1,"decidedAt"=transaction_timestamp()
WHERE i."targetKind"='MERCHANT_TERMINAL' AND i.status='PENDING' AND NOT EXISTS (
 SELECT 1 FROM merchant_invitation_terms mt JOIN merchant_terminals t ON t.id=mt."merchantUnitId"
 JOIN services s ON s.id=t."masterServiceId" AND s."primaryPersonId"=mt."sourcePrimaryPersonId"
 JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" AND m.state='ACCEPTED' AND m.version=mt."sourceMembershipVersion"
 WHERE mt."invitationId"=i.id AND mt."sourceAssignmentId" IS NULL AND i."inviterId"=s."primaryPersonId" AND mt."accessExpiresAt">transaction_timestamp());
--> statement-breakpoint
CREATE FUNCTION guard_terminal_assignment() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP IN ('DELETE','TRUNCATE') THEN RAISE EXCEPTION 'Terminal access history cannot be removed' USING ERRCODE='23514'; END IF;
 IF TG_OP='UPDATE' THEN
  IF ROW(NEW.id,NEW."terminalId",NEW."personId",NEW."grantedByPersonId",NEW."ownerMembershipVersion",NEW."expiresAt",NEW."createdAt") IS DISTINCT FROM ROW(OLD.id,OLD."terminalId",OLD."personId",OLD."grantedByPersonId",OLD."ownerMembershipVersion",OLD."expiresAt",OLD."createdAt") OR OLD.state<>'ACCEPTED' OR NEW.state<>'REVOKED' OR NEW.version<>OLD.version+1 OR NEW."revokedAt" IS NULL THEN RAISE EXCEPTION 'Terminal access may only be revoked with its next version' USING ERRCODE='23514'; END IF;
 ELSE
  IF NEW.state<>'ACCEPTED' OR NEW.version<>1 OR NEW."revokedAt" IS NOT NULL OR NOT EXISTS (
   SELECT 1 FROM merchant_terminals t JOIN services s ON s.id=t."masterServiceId"
   JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId"
   JOIN terminal_invitation_terms terms ON terms."terminalId"=t.id AND terms."grantedByPersonId"=s."primaryPersonId" AND terms."ownerMembershipVersion"=m.version
   JOIN service_invitations i ON i.id=terms."invitationId" AND i."recipientId"=NEW."personId" AND i."inviterId"=s."primaryPersonId"
   WHERE t.id=NEW."terminalId" AND t.status='ACTIVE' AND s.status='ACTIVE' AND s."primaryPersonId"=NEW."grantedByPersonId" AND m.state='ACCEPTED' AND m.version=NEW."ownerMembershipVersion" AND i.status IN ('PENDING','ACCEPTED') AND i."expiresAt">transaction_timestamp() AND terms."accessExpiresAt" IS NOT DISTINCT FROM NEW."expiresAt" AND (NEW."expiresAt" IS NULL OR NEW."expiresAt">transaction_timestamp())
  ) THEN RAISE EXCEPTION 'Terminal access requires a current direct owner invitation' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER terminal_assignment_guard BEFORE INSERT OR UPDATE OR DELETE ON terminal_assignments FOR EACH ROW EXECUTE FUNCTION guard_terminal_assignment();
CREATE TRIGGER terminal_assignment_no_truncate BEFORE TRUNCATE ON terminal_assignments FOR EACH STATEMENT EXECUTE FUNCTION guard_terminal_assignment();
CREATE FUNCTION guard_terminal_invitation_terms() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM service_invitations i JOIN merchant_terminals t ON t.id=i."merchantUnitId" JOIN services s ON s.id=t."masterServiceId" JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE i.id=NEW."invitationId" AND i."targetKind"='MERCHANT_TERMINAL' AND i.status='PENDING' AND i."merchantUnitId"=NEW."terminalId" AND i."inviterId"=NEW."grantedByPersonId" AND s."primaryPersonId"=NEW."grantedByPersonId" AND m.state='ACCEPTED' AND m.version=NEW."ownerMembershipVersion" AND s.status='ACTIVE' AND t.status='ACTIVE') THEN RAISE EXCEPTION 'Terminal invitation must come directly from its current owner' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER terminal_invitation_owner BEFORE INSERT ON terminal_invitation_terms FOR EACH ROW EXECUTE FUNCTION guard_terminal_invitation_terms();
CREATE TRIGGER terminal_invitation_terms_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON terminal_invitation_terms FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
--> statement-breakpoint
-- Historical tables have no active writer and cannot be used for new grants.
CREATE TRIGGER archived_merchant_assignment_readonly BEFORE INSERT OR UPDATE OR DELETE OR TRUNCATE ON merchant_assignments FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER archived_merchant_terms_readonly BEFORE INSERT OR UPDATE OR DELETE OR TRUNCATE ON merchant_invitation_terms FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER archived_merchant_grants_readonly BEFORE INSERT OR UPDATE OR DELETE OR TRUNCATE ON merchant_permission_grants FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();

--> statement-breakpoint
-- Reviewed supplement: src/modules/money/constraints.sql
-- D73 foundation fragment. Run after generated money tables and ledger shape changes.
-- Card and Merchant services keep distinct money accounts even when their owner matches.
CREATE FUNCTION guard_money_account_identity() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP IN ('DELETE','TRUNCATE') THEN RAISE EXCEPTION 'Money ownership and service links are immutable' USING ERRCODE='23514';END IF;
 IF TG_TABLE_NAME='money_accounts' THEN
  IF ROW(NEW.id,NEW."ownerPersonId",NEW."serviceKind",NEW.currency,NEW."createdAt") IS DISTINCT FROM ROW(OLD.id,OLD."ownerPersonId",OLD."serviceKind",OLD.currency,OLD."createdAt") OR NEW.version<>OLD.version+1 THEN RAISE EXCEPTION 'Money account identity and version are invalid' USING ERRCODE='23514';END IF;
 ELSE RAISE EXCEPTION 'Money service link is immutable' USING ERRCODE='23514';END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER money_account_identity BEFORE UPDATE OR DELETE ON money_accounts FOR EACH ROW EXECUTE FUNCTION guard_money_account_identity();
--> statement-breakpoint
CREATE TRIGGER money_account_no_truncate BEFORE TRUNCATE ON money_accounts FOR EACH STATEMENT EXECUTE FUNCTION guard_money_account_identity();
--> statement-breakpoint
CREATE TRIGGER money_service_identity BEFORE UPDATE OR DELETE ON money_account_services FOR EACH ROW EXECUTE FUNCTION guard_money_account_identity();
--> statement-breakpoint
CREATE TRIGGER money_service_no_truncate BEFORE TRUNCATE ON money_account_services FOR EACH STATEMENT EXECUTE FUNCTION guard_money_account_identity();
--> statement-breakpoint
CREATE FUNCTION check_money_service_owner() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM money_accounts a JOIN services s ON s.id=NEW."serviceId" WHERE a.id=NEW."moneyAccountId" AND a."ownerPersonId"=s."primaryPersonId" AND a."serviceKind"=s.kind AND NEW."serviceKind"=s.kind) THEN RAISE EXCEPTION 'Money service owner and purpose must match' USING ERRCODE='23514';END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER money_service_owner BEFORE INSERT ON money_account_services FOR EACH ROW EXECUTE FUNCTION check_money_service_owner();
--> statement-breakpoint
CREATE OR REPLACE FUNCTION guard_ledger_entry() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE journal_transaction bigint;position_key text;account_id uuid;
BEGIN
 IF TG_OP<>'INSERT' THEN RAISE EXCEPTION 'Posted ledger entries are immutable' USING ERRCODE='23514';END IF;
 SELECT "creationTransaction" INTO journal_transaction FROM ledger_journals WHERE id=NEW."journalId";
 IF journal_transaction IS NULL OR journal_transaction<>txid_current() THEN RAISE EXCEPTION 'Entries must be inserted with their new journal' USING ERRCODE='23514';END IF;
 account_id:=NEW."moneyAccountId";
 IF account_id IS NULL THEN SELECT "moneyAccountId" INTO account_id FROM money_account_services WHERE "serviceId"=NEW."serviceId";END IF;
 IF account_id IS NOT NULL THEN PERFORM pg_advisory_xact_lock(hashtextextended('money-account:'||account_id::text,0));END IF;
 IF NEW."moneyAccountId" IS NOT NULL THEN
  position_key:='money:'||NEW."moneyAccountId"::text||':'||NEW.bucket;
 ELSE position_key:=NEW."serviceId"::text||':'||NEW.bucket||':'||coalesce(NEW."cardId"::text,'')||':'||coalesce(NEW."merchantUnitId"::text,'');END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('ledger-position:'||position_key,0));
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION check_ledger_available_balance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE total numeric;
BEGIN
 IF NEW.bucket IN ('GROUP_AVAILABLE','CARD_AVAILABLE','MERCHANT_AVAILABLE','MERCHANT_SETTLED','MERCHANT_PAYOUT_PENDING','PAYOUT_CLEARING','MONEY_AVAILABLE','MONEY_WITHDRAWAL_PENDING','MONEY_WITHDRAWN') THEN
  SELECT coalesce(sum("deltaMinor"),0) INTO total FROM ledger_entries WHERE "serviceId" IS NOT DISTINCT FROM NEW."serviceId" AND "moneyAccountId" IS NOT DISTINCT FROM NEW."moneyAccountId" AND bucket=NEW.bucket AND "cardId" IS NOT DISTINCT FROM NEW."cardId" AND "merchantUnitId" IS NOT DISTINCT FROM NEW."merchantUnitId";
  IF total<0 THEN RAISE EXCEPTION 'Available money cannot be negative' USING ERRCODE='23514';END IF;
 END IF;
 IF NEW.bucket IN ('GROUP_AVAILABLE','PRACTICE_SOURCE') AND NOT EXISTS(SELECT 1 FROM services WHERE id=NEW."serviceId" AND kind='CARDHOLDER') THEN RAISE EXCEPTION 'Historical group money requires Cardholder scope' USING ERRCODE='23514';END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE FUNCTION assert_money_journal(jid uuid,expected_kind text,ref uuid,account_id uuid,debit text,credit text,amount numeric,at_time timestamptz) RETURNS void LANGUAGE plpgsql AS $$
DECLARE j record;total bigint;debits bigint;credits bigint;
BEGIN
 SELECT * INTO j FROM ledger_journals WHERE id=jid;
 IF NOT FOUND OR j.kind<>expected_kind OR j."referenceId"<>ref OR j.currency<>'USD' OR j."creationTransaction"<>txid_current() OR j."createdAt"<>at_time THEN RAISE EXCEPTION 'Money record must own its exact journal' USING ERRCODE='23514';END IF;
 SELECT count(*),count(*) FILTER(WHERE "moneyAccountId"=account_id AND "serviceId" IS NULL AND "cardId" IS NULL AND "merchantUnitId" IS NULL AND bucket=debit AND "deltaMinor"=-amount),count(*) FILTER(WHERE "moneyAccountId"=account_id AND "serviceId" IS NULL AND "cardId" IS NULL AND "merchantUnitId" IS NULL AND bucket=credit AND "deltaMinor"=amount) INTO total,debits,credits FROM ledger_entries WHERE "journalId"=jid;
 IF total<>2 OR debits<>1 OR credits<>1 THEN RAISE EXCEPTION 'Money journal must match account, amount and effect' USING ERRCODE='23514';END IF;
END $$;
--> statement-breakpoint
CREATE FUNCTION guard_money_owner_record() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE intent record;
BEGIN
 IF NOT EXISTS(SELECT 1 FROM money_accounts a JOIN money_account_services m ON m."moneyAccountId"=a.id JOIN services s ON s.id=m."serviceId" WHERE a.id=NEW."moneyAccountId" AND a."ownerPersonId"=NEW."actorId" AND a.status='ACTIVE' AND s.status NOT IN ('SUSPENDED','CLOSED')) THEN RAISE EXCEPTION 'Only active money account owner may initiate funds movement' USING ERRCODE='23514';END IF;
 IF TG_TABLE_NAME='money_topups' THEN
  PERFORM assert_money_journal(NEW."journalId",'MONEY_FUNDING',NEW.id,NEW."moneyAccountId",'MONEY_SOURCE','MONEY_AVAILABLE',NEW."amountMinor",NEW."createdAt");
 ELSIF TG_TABLE_NAME='money_withdrawals' THEN
  SELECT * INTO intent FROM money_withdrawal_intents WHERE id=NEW."intentId";
  IF NOT FOUND OR intent."moneyAccountId"<>NEW."moneyAccountId" OR intent."actorId"<>NEW."actorId" OR intent."amountMinor"<>NEW."amountMinor" OR intent."confirmCommandId"<>NEW."commandId" THEN RAISE EXCEPTION 'Withdrawal must use its saved exact review' USING ERRCODE='23514';END IF;
  PERFORM assert_money_journal(NEW."journalId",'MONEY_WITHDRAWAL_RESERVE',NEW.id,NEW."moneyAccountId",'MONEY_AVAILABLE','MONEY_WITHDRAWAL_PENDING',NEW."amountMinor",NEW."createdAt");
 END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER money_funding_owner BEFORE INSERT ON money_funding_intents FOR EACH ROW EXECUTE FUNCTION guard_money_owner_record();
--> statement-breakpoint
CREATE TRIGGER money_topup_owner BEFORE INSERT ON money_topups FOR EACH ROW EXECUTE FUNCTION guard_money_owner_record();
--> statement-breakpoint
CREATE TRIGGER money_withdrawal_review_owner BEFORE INSERT ON money_withdrawal_intents FOR EACH ROW EXECUTE FUNCTION guard_money_owner_record();
--> statement-breakpoint
CREATE TRIGGER money_withdrawal_owner BEFORE INSERT ON money_withdrawals FOR EACH ROW EXECUTE FUNCTION guard_money_owner_record();
--> statement-breakpoint
CREATE FUNCTION guard_money_withdrawal_event() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE withdrawal record;
BEGIN
 SELECT * INTO withdrawal FROM money_withdrawals WHERE id=NEW."withdrawalId";
 IF NOT FOUND OR NOT EXISTS(SELECT 1 FROM operator_service_access o JOIN money_account_services m ON m."serviceId"=o."serviceId" JOIN services s ON s.id=o."serviceId" WHERE m."moneyAccountId"=withdrawal."moneyAccountId" AND o."personId"=NEW."actorId" AND o.state='ACCEPTED' AND o."canProcessDeposits" AND s.status<>'CLOSED') THEN RAISE EXCEPTION 'Withdrawal processing requires an explicit processing assignment' USING ERRCODE='23514';END IF;
 PERFORM assert_money_journal(NEW."journalId",CASE WHEN NEW.outcome='COMPLETED' THEN 'MONEY_WITHDRAWAL_COMPLETE' ELSE 'MONEY_WITHDRAWAL_RELEASE' END,NEW."withdrawalId",withdrawal."moneyAccountId",'MONEY_WITHDRAWAL_PENDING',CASE WHEN NEW.outcome='COMPLETED' THEN 'MONEY_WITHDRAWN' ELSE 'MONEY_AVAILABLE' END,withdrawal."amountMinor",NEW."createdAt");
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER money_withdrawal_event_origin BEFORE INSERT ON money_withdrawal_events FOR EACH ROW EXECUTE FUNCTION guard_money_withdrawal_event();
--> statement-breakpoint
CREATE FUNCTION check_money_journal_effect() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.kind='MONEY_FUNDING' AND NOT EXISTS(SELECT 1 FROM money_topups WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Funding journal requires its unique receipt' USING ERRCODE='23514';END IF;
 IF NEW.kind='MONEY_WITHDRAWAL_RESERVE' AND NOT EXISTS(SELECT 1 FROM money_withdrawals WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Withdrawal reservation requires its exact saved request' USING ERRCODE='23514';END IF;
 IF NEW.kind IN ('MONEY_WITHDRAWAL_COMPLETE','MONEY_WITHDRAWAL_RELEASE') AND NOT EXISTS(SELECT 1 FROM money_withdrawal_events WHERE "withdrawalId"=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Withdrawal journal requires its operator outcome' USING ERRCODE='23514';END IF;
 IF NEW.kind='MONEY_CUTOVER' AND NOT EXISTS(SELECT 1 FROM money_cutover_transfers WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Opening balance requires its migration receipt' USING ERRCODE='23514';END IF;
 IF NEW.kind='MERCHANT_REFUND' AND EXISTS(SELECT 1 FROM ledger_entries WHERE "journalId"=NEW.id AND "moneyAccountId" IS NOT NULL) AND NOT EXISTS(SELECT 1 FROM merchant_test_refunds WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Merchant money refund requires its exact refund record' USING ERRCODE='23514';END IF;
 IF EXISTS(SELECT 1 FROM ledger_entries WHERE "journalId"=NEW.id AND "moneyAccountId" IS NOT NULL) AND NEW.kind NOT IN ('MONEY_FUNDING','MONEY_WITHDRAWAL_RESERVE','MONEY_WITHDRAWAL_COMPLETE','MONEY_WITHDRAWAL_RELEASE','MONEY_CUTOVER','CARD_PURCHASE','CARD_REFUND','MERCHANT_SETTLEMENT','MERCHANT_REFUND','MERCHANT_PAYOUT','DEPOSIT_RELEASE') THEN RAISE EXCEPTION 'Journal kind cannot move money account funds' USING ERRCODE='23514';END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER money_journal_provenance AFTER INSERT ON ledger_journals DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_money_journal_effect();
--> statement-breakpoint
DO $$ DECLARE table_name text;BEGIN
 FOREACH table_name IN ARRAY ARRAY['money_commands','money_funding_intents','money_topups','money_withdrawal_intents','money_withdrawals','money_withdrawal_events','money_cutover_transfers'] LOOP
  EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_history()',table_name||'_immutable',table_name);
  EXECUTE format('CREATE TRIGGER %I BEFORE TRUNCATE ON %I FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history()',table_name||'_no_truncate',table_name);
 END LOOP;
END $$;
--> statement-breakpoint
-- Separate purpose-bound account for EVERY existing service. Same-owner pools never merge.
DO $$ DECLARE svc record;account_id uuid;BEGIN
 FOR svc IN SELECT * FROM services ORDER BY id LOOP
  IF EXISTS(SELECT 1 FROM money_account_services WHERE "serviceId"=svc.id) THEN CONTINUE;END IF;
  account_id:=gen_random_uuid();
  INSERT INTO money_accounts(id,"ownerPersonId","displayName","serviceKind",currency,status,version,"createdAt") VALUES(account_id,svc."primaryPersonId",svc."displayName",svc.kind,'USD',CASE WHEN svc.status='CLOSED' THEN 'CLOSED' WHEN svc.status='SUSPENDED' THEN 'SUSPENDED' ELSE 'ACTIVE' END,1,svc."createdAt");
  INSERT INTO money_account_services("serviceId","moneyAccountId","serviceKind") VALUES(svc.id,account_id,svc.kind);
 END LOOP;
END $$;
--> statement-breakpoint
CREATE TABLE money_model_cutover(id text PRIMARY KEY CHECK(id='D73'),"creationTransaction" bigint NOT NULL DEFAULT txid_current(),"activatedAt" timestamptz NOT NULL DEFAULT clock_timestamp());
--> statement-breakpoint
INSERT INTO money_model_cutover(id) VALUES('D73');
--> statement-breakpoint
CREATE TRIGGER money_model_cutover_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON money_model_cutover FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE UNIQUE INDEX money_cutover_source_once ON money_cutover_transfers("sourceServiceId","sourceBucket",coalesce("sourceMerchantUnitId",'00000000-0000-0000-0000-000000000000'::uuid));
--> statement-breakpoint
CREATE FUNCTION guard_money_cutover_transfer() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE j record;total bigint;debits bigint;credits bigint;
BEGIN
 IF NOT EXISTS(SELECT 1 FROM money_model_cutover WHERE id='D73' AND "creationTransaction"=txid_current()) OR NOT EXISTS(SELECT 1 FROM money_account_services WHERE "serviceId"=NEW."sourceServiceId" AND "moneyAccountId"=NEW."moneyAccountId") THEN RAISE EXCEPTION 'Opening transfers belong only to the D73 migration transaction' USING ERRCODE='23514';END IF;
 SELECT * INTO j FROM ledger_journals WHERE id=NEW."journalId";
 IF NOT FOUND OR j.kind<>'MONEY_CUTOVER' OR j."referenceId"<>NEW.id OR j."creationTransaction"<>txid_current() OR j."createdAt"<>NEW."createdAt" THEN RAISE EXCEPTION 'Opening balance requires its own exact journal' USING ERRCODE='23514';END IF;
 SELECT count(*),count(*) FILTER(WHERE "serviceId"=NEW."sourceServiceId" AND "moneyAccountId" IS NULL AND "cardId" IS NULL AND "merchantUnitId" IS NOT DISTINCT FROM NEW."sourceMerchantUnitId" AND bucket=NEW."sourceBucket" AND "deltaMinor"=-NEW."amountMinor"),count(*) FILTER(WHERE "serviceId" IS NULL AND "moneyAccountId"=NEW."moneyAccountId" AND "cardId" IS NULL AND "merchantUnitId" IS NULL AND bucket='MONEY_AVAILABLE' AND "deltaMinor"=NEW."amountMinor") INTO total,debits,credits FROM ledger_entries WHERE "journalId"=NEW."journalId";
 IF total<>2 OR debits<>1 OR credits<>1 THEN RAISE EXCEPTION 'Opening transfer must conserve its exact previous position' USING ERRCODE='23514';END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER money_cutover_origin BEFORE INSERT ON money_cutover_transfers FOR EACH ROW EXECUTE FUNCTION guard_money_cutover_transfer();
--> statement-breakpoint
DO $$ DECLARE position record;effect_id uuid;journal_id uuid;at_time timestamptz;BEGIN
 FOR position IN SELECT e."serviceId",e.bucket,e."merchantUnitId",m."moneyAccountId",sum(e."deltaMinor") amount FROM ledger_entries e JOIN money_account_services m ON m."serviceId"=e."serviceId" WHERE e.bucket IN ('GROUP_AVAILABLE','PAYOUT_CLEARING') GROUP BY e."serviceId",e.bucket,e."merchantUnitId",m."moneyAccountId" HAVING sum(e."deltaMinor")>0 ORDER BY e."serviceId",e.bucket,e."merchantUnitId" LOOP
  PERFORM pg_advisory_xact_lock(hashtextextended('money-account:'||position."moneyAccountId"::text,0));
  effect_id:=gen_random_uuid();journal_id:=gen_random_uuid();at_time:=clock_timestamp();
  INSERT INTO ledger_journals(id,"businessKey",kind,"referenceId",currency,digest,"createdAt") VALUES(journal_id,'money-cutover:'||position."serviceId"::text||':'||position.bucket||':'||coalesce(position."merchantUnitId"::text,'group'),'MONEY_CUTOVER',effect_id,'USD',encode(sha256(convert_to(json_build_object('kind','MONEY_CUTOVER','account',position."moneyAccountId",'service',position."serviceId",'bucket',position.bucket,'terminal',position."merchantUnitId",'amount',position.amount::text,'reference',effect_id)::text,'UTF8')),'hex'),at_time);
  INSERT INTO ledger_entries("journalId","lineNumber","serviceId",bucket,"cardId","merchantUnitId","moneyAccountId","deltaMinor",currency) VALUES(journal_id,1,position."serviceId",position.bucket,NULL,position."merchantUnitId",NULL,-position.amount,'USD'),(journal_id,2,NULL,'MONEY_AVAILABLE',NULL,NULL,position."moneyAccountId",position.amount,'USD');
  INSERT INTO money_cutover_transfers(id,"moneyAccountId","sourceServiceId","sourceBucket","sourceMerchantUnitId","amountMinor","journalId","createdAt") VALUES(effect_id,position."moneyAccountId",position."serviceId",position.bucket,position."merchantUnitId",position.amount,journal_id,at_time);
 END LOOP;
 IF EXISTS(SELECT 1 FROM ledger_entries WHERE bucket IN ('GROUP_AVAILABLE','PAYOUT_CLEARING') GROUP BY "serviceId",bucket,"merchantUnitId" HAVING sum("deltaMinor")<>0) THEN RAISE EXCEPTION 'Historical spendable positions did not reconcile to zero' USING ERRCODE='23514';END IF;
END $$;

--> statement-breakpoint
-- Reviewed supplement: src/modules/workspace/card-limit-cutover.sql (tables generated above)

-- Preserve current spendability at cutover. Each new total allowance covers all
-- historical gross purchases plus its portion of the old current-month remainder.
-- Neither refunds nor month changes reset this new allowance.
WITH month_bounds AS (SELECT date_trunc('month',clock_timestamp() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' AS starts),
 usage AS (
  SELECT c.id,c."serviceId",c."holderId",s."primaryPersonId",coalesce(l."monthlyLimitMinor",0)::numeric AS old_limit,
   coalesce(sum(e."deltaMinor") FILTER (WHERE e.bucket='CARD_SPENT' AND e."deltaMinor">0 AND j.kind='CARD_PURCHASE'),0)::numeric AS used_total,
   coalesce(sum(e."deltaMinor") FILTER (WHERE e.bucket='CARD_SPENT' AND e."deltaMinor">0 AND j.kind='CARD_PURCHASE' AND j."createdAt">=b.starts AND j."createdAt"<((b.starts AT TIME ZONE 'UTC')+interval '1 month') AT TIME ZONE 'UTC'),0)::numeric AS used_month
  FROM cards c JOIN services s ON s.id=c."serviceId" CROSS JOIN month_bounds b
  LEFT JOIN cardholder_spending_limits l ON l."serviceId"=c."serviceId" AND l."personId"=c."holderId"
  LEFT JOIN ledger_entries e ON e."cardId"=c.id AND e."serviceId"=c."serviceId" LEFT JOIN ledger_journals j ON j.id=e."journalId"
  GROUP BY c.id,c."serviceId",c."holderId",s."primaryPersonId",l."monthlyLimitMinor"
 ), allocations AS (
  SELECT *,count(*) OVER w AS card_count,row_number() OVER (PARTITION BY "serviceId","holderId" ORDER BY id) AS card_number,
   sum(used_month) OVER w AS total_used_month
  FROM usage WINDOW w AS (PARTITION BY "serviceId","holderId")
 )
INSERT INTO card_spending_limits ("serviceId","cardId","allowanceMinor",version,"updatedBy","updatedAt","reviewRequired")
 SELECT "serviceId",id,(used_total+floor(greatest(old_limit-total_used_month,0)/card_count)+CASE WHEN card_number<=mod(greatest(old_limit-total_used_month,0),card_count) THEN 1 ELSE 0 END)::bigint,1,"primaryPersonId",transaction_timestamp(),true FROM allocations;
--> statement-breakpoint
INSERT INTO card_limit_changes ("serviceId","cardId","actorId","previousMinor","allowanceMinor",version,"createdAt")
 SELECT "serviceId","cardId","updatedBy",0,"allowanceMinor",version,"updatedAt" FROM card_spending_limits;
--> statement-breakpoint
CREATE FUNCTION guard_card_limit() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE s.id=NEW."serviceId" AND s.kind='CARDHOLDER' AND s."primaryPersonId"=NEW."updatedBy" AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Card limit requires account owner' USING ERRCODE='23514'; END IF;
 IF TG_OP='INSERT' AND NEW.version<>1 OR TG_OP='UPDATE' AND (ROW(NEW."serviceId",NEW."cardId") IS DISTINCT FROM ROW(OLD."serviceId",OLD."cardId") OR NEW.version<>OLD.version+1) THEN RAISE EXCEPTION 'Card limit identity and version are invalid' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE FUNCTION check_card_limit_history() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE prior bigint;
BEGIN
 prior:=CASE WHEN TG_OP='INSERT' THEN 0 ELSE OLD."allowanceMinor" END;
 IF NOT EXISTS(SELECT 1 FROM card_limit_changes h WHERE h."serviceId"=NEW."serviceId" AND h."cardId"=NEW."cardId" AND h.version=NEW.version AND h."previousMinor"=prior AND h."allowanceMinor"=NEW."allowanceMinor" AND h."actorId"=NEW."updatedBy" AND h."createdAt"=NEW."updatedAt") THEN RAISE EXCEPTION 'Card limit requires immutable matching history' USING ERRCODE='23514'; END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE FUNCTION guard_card_limit_history() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM card_spending_limits l WHERE l."serviceId"=NEW."serviceId" AND l."cardId"=NEW."cardId" AND l.version=NEW.version AND l."allowanceMinor"=NEW."allowanceMinor" AND l."updatedBy"=NEW."actorId" AND l."updatedAt"=NEW."createdAt") THEN RAISE EXCEPTION 'Card limit history requires current change' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER card_limit_owner BEFORE INSERT OR UPDATE ON card_spending_limits FOR EACH ROW EXECUTE FUNCTION guard_card_limit();
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER card_limit_matching_history AFTER INSERT OR UPDATE ON card_spending_limits DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_card_limit_history();
--> statement-breakpoint
CREATE TRIGGER card_limit_history_origin BEFORE INSERT ON card_limit_changes FOR EACH ROW EXECUTE FUNCTION guard_card_limit_history();
--> statement-breakpoint
CREATE TRIGGER card_limit_no_reset BEFORE DELETE OR TRUNCATE ON card_spending_limits FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER card_limit_history_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON card_limit_changes FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
-- Person limits are retained only as dated migration evidence, with no active writer.
CREATE TRIGGER retired_person_limit_readonly BEFORE INSERT OR UPDATE ON cardholder_spending_limits FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE FUNCTION assert_card_money_journal(jid uuid,expected_kind text,ref uuid,svc uuid,card_id uuid,amount numeric,at_time timestamptz) RETURNS void LANGUAGE plpgsql AS $$
DECLARE account_id uuid; j record; lines bigint; card_lines bigint; money_lines bigint; sign integer;
BEGIN
 SELECT "moneyAccountId" INTO account_id FROM money_account_services WHERE "serviceId"=svc;
 SELECT * INTO j FROM ledger_journals WHERE id=jid;
 IF account_id IS NULL OR j.kind<>expected_kind OR j."referenceId"<>ref OR j.currency<>'USD' OR j."creationTransaction"<>txid_current() OR j."createdAt"<>at_time THEN RAISE EXCEPTION 'Card money journal must own its financial record' USING ERRCODE='23514'; END IF;
 sign:=CASE WHEN expected_kind='CARD_PURCHASE' THEN 1 ELSE -1 END;
 SELECT count(*),count(*) FILTER(WHERE "serviceId"=svc AND "cardId"=card_id AND "merchantUnitId" IS NULL AND "moneyAccountId" IS NULL AND bucket='CARD_SPENT' AND "deltaMinor"=sign*amount),count(*) FILTER(WHERE "serviceId" IS NULL AND "cardId" IS NULL AND "merchantUnitId" IS NULL AND "moneyAccountId"=account_id AND bucket='MONEY_AVAILABLE' AND "deltaMinor"=-sign*amount) INTO lines,card_lines,money_lines FROM ledger_entries WHERE "journalId"=jid;
 IF lines<>2 OR card_lines<>1 OR money_lines<>1 THEN RAISE EXCEPTION 'Card financial principal and money account must match' USING ERRCODE='23514'; END IF;
END $$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION check_prepaid_effect() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE a record; p record; c record; r record; lim numeric; used numeric;
BEGIN
 IF NEW.kind='GROUP_FUNDING' THEN
  IF NOT EXISTS(SELECT 1 FROM cardholder_topups WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Funding journal needs its top-up receipt' USING ERRCODE='23514'; END IF;
 ELSIF NEW.kind='CARD_PURCHASE' THEN
  SELECT * INTO a FROM service_activity WHERE id=NEW."referenceId";
  IF NOT FOUND OR a.direction<>'DEBIT' OR a.status<>'POSTED' OR a."cardId" IS NULL THEN RAISE EXCEPTION 'Purchase journal requires matching activity' USING ERRCODE='23514'; END IF;
  PERFORM assert_card_money_journal(NEW.id,'CARD_PURCHASE',a.id,a."serviceId",a."cardId",a."amountMinor",a."occurredAt");
  SELECT "allowanceMinor" INTO lim FROM card_spending_limits WHERE "serviceId"=a."serviceId" AND "cardId"=a."cardId";
  SELECT coalesce(sum(e."deltaMinor"),0) INTO used FROM ledger_entries e JOIN ledger_journals j ON j.id=e."journalId" WHERE e."serviceId"=a."serviceId" AND e."cardId"=a."cardId" AND e.bucket='CARD_SPENT' AND e."deltaMinor">0 AND j.kind='CARD_PURCHASE';
  IF lim IS NULL OR used>lim THEN RAISE EXCEPTION 'Card total allowance exceeded' USING ERRCODE='23514'; END IF;
 ELSIF NEW.kind='CARD_REFUND' THEN
  SELECT f.*,pay."cardCheckoutId",pay."cardActivityId" INTO r FROM merchant_test_refunds f JOIN merchant_test_payments pay ON pay.id=f."paymentId" WHERE f.id=NEW."referenceId";
  SELECT * INTO p FROM card_checkout_attempts WHERE id=r."cardCheckoutId";
  SELECT * INTO a FROM service_activity WHERE id=NEW."referenceId";
  IF p.id IS NULL OR a.id IS NULL OR a.direction<>'CREDIT' OR a.status<>'POSTED' OR a."serviceId"<>p."cardServiceId" OR a."cardId"<>p."cardId" OR a."amountMinor"<>r."amountMinor" THEN RAISE EXCEPTION 'Refund requires original card and matching credit' USING ERRCODE='23514'; END IF;
  PERFORM assert_card_money_journal(NEW.id,'CARD_REFUND',r.id,p."cardServiceId",p."cardId",r."amountMinor",a."occurredAt");
 END IF;
 RETURN NULL;
END $$;

--> statement-breakpoint
-- Reviewed supplement: src/modules/acquiring/terminal-constraints.sql
-- Run after flat terminals, new terminal access tables and money account tables exist.
CREATE OR REPLACE FUNCTION guard_merchant_identity() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP IN ('DELETE','TRUNCATE') THEN RAISE EXCEPTION 'Merchant provenance cannot be removed' USING ERRCODE='23514'; END IF;
 IF TG_TABLE_NAME='merchant_terminals' THEN
  IF ROW(NEW.id,NEW."masterServiceId",NEW."masterServiceKind",NEW."createdAt") IS DISTINCT FROM ROW(OLD.id,OLD."masterServiceId",OLD."masterServiceKind",OLD."createdAt") THEN RAISE EXCEPTION 'Terminal identity is immutable' USING ERRCODE='23514'; END IF;
 ELSIF TG_TABLE_NAME='payment_channels' THEN
  IF ROW(NEW.id,NEW."serviceId",NEW."merchantUnitId",NEW."creatorId",NEW."creatorAssignmentId",NEW."creatorBasis",NEW."createdAt") IS DISTINCT FROM ROW(OLD.id,OLD."serviceId",OLD."merchantUnitId",OLD."creatorId",OLD."creatorAssignmentId",OLD."creatorBasis",OLD."createdAt") THEN RAISE EXCEPTION 'Channel origin is immutable' USING ERRCODE='23514'; END IF;
 ELSE
  -- Old assignments are retained as immutable provenance, never new active grants.
  RAISE EXCEPTION 'Historical merchant access cannot change' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;
CREATE OR REPLACE FUNCTION check_channel_creator() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW."creatorBasis"='TERMINAL_ASSIGNMENT' THEN
  IF NOT EXISTS(SELECT 1 FROM terminal_assignments a JOIN merchant_terminals t ON t.id=a."terminalId" JOIN services s ON s.id=t."masterServiceId" JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE a.id=NEW."creatorAssignmentId" AND a."terminalId"=NEW."merchantUnitId" AND t."masterServiceId"=NEW."serviceId" AND a."personId"=NEW."creatorId" AND a.state='ACCEPTED' AND (a."expiresAt" IS NULL OR a."expiresAt">clock_timestamp()) AND a."grantedByPersonId"=s."primaryPersonId" AND a."ownerMembershipVersion"=m.version AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Channel creator needs accepted access to this terminal' USING ERRCODE='23514'; END IF;
 ELSIF NEW."creatorBasis"='OWNER_MEMBER' THEN
  IF NOT EXISTS(SELECT 1 FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE s.id=NEW."serviceId" AND s.kind='MERCHANT' AND s."primaryPersonId"=NEW."creatorId" AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Channel owner does not match Merchant service' USING ERRCODE='23514'; END IF;
 ELSE RAISE EXCEPTION 'Historical channel authority cannot create new channels' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;

CREATE FUNCTION assert_merchant_money_journal(jid uuid,expected_kind text,ref uuid,svc uuid,terminal_id uuid,debit text,credit text,amount numeric,at_time timestamptz) RETURNS void LANGUAGE plpgsql AS $$
DECLARE account_id uuid; n integer; debits integer; credits integer;
BEGIN
 SELECT "moneyAccountId" INTO account_id FROM money_account_services WHERE "serviceId"=svc AND "serviceKind"='MERCHANT';
 IF account_id IS NULL THEN RAISE EXCEPTION 'Merchant money account is required' USING ERRCODE='23514'; END IF;
 IF NOT EXISTS(SELECT 1 FROM ledger_journals WHERE id=jid AND kind=expected_kind AND "referenceId"=ref AND currency='USD' AND "creationTransaction"=txid_current() AND "createdAt"=at_time) THEN RAISE EXCEPTION 'Merchant journal must match its saved business effect' USING ERRCODE='23514'; END IF;
 SELECT count(*),count(*) FILTER(WHERE bucket=debit AND "deltaMinor"=-amount AND currency='USD' AND "cardId" IS NULL AND ((debit='MONEY_AVAILABLE' AND "moneyAccountId"=account_id AND "serviceId" IS NULL AND "merchantUnitId" IS NULL) OR (debit<>'MONEY_AVAILABLE' AND "moneyAccountId" IS NULL AND "serviceId"=svc AND "merchantUnitId"=terminal_id))),count(*) FILTER(WHERE bucket=credit AND "deltaMinor"=amount AND currency='USD' AND "cardId" IS NULL AND ((credit='MONEY_AVAILABLE' AND "moneyAccountId"=account_id AND "serviceId" IS NULL AND "merchantUnitId" IS NULL) OR (credit<>'MONEY_AVAILABLE' AND "moneyAccountId" IS NULL AND "serviceId"=svc AND "merchantUnitId"=terminal_id))) INTO n,debits,credits FROM ledger_entries WHERE "journalId"=jid;
 IF n<>2 OR debits<>1 OR credits<>1 OR amount<=0 THEN RAISE EXCEPTION 'Merchant effect must match exact terminal attribution and its money account' USING ERRCODE='23514'; END IF;
END $$;
CREATE OR REPLACE FUNCTION prepaid_refund_bucket(payment_id uuid) RETURNS text LANGUAGE plpgsql AS $$
DECLARE batch uuid;
BEGIN
 SELECT "settlementId" INTO batch FROM merchant_settlement_items WHERE "paymentId"=payment_id;
 IF batch IS NULL THEN RETURN 'MERCHANT_AVAILABLE'; END IF;
 IF EXISTS(SELECT 1 FROM merchant_settlements WHERE id=batch AND "moneyAccountId" IS NOT NULL) OR EXISTS(SELECT 1 FROM merchant_settlement_credits WHERE "settlementId"=batch) THEN RETURN 'MONEY_AVAILABLE'; END IF;
 IF EXISTS(SELECT 1 FROM merchant_deposits d LEFT JOIN merchant_deposit_events e ON e."depositId"=d.id WHERE d."settlementId"=batch AND e."depositId" IS NULL) THEN RETURN NULL; END IF;
 IF EXISTS(SELECT 1 FROM merchant_deposits d JOIN merchant_deposit_events e ON e."depositId"=d.id WHERE d."settlementId"=batch AND e.outcome='COMPLETED') THEN RETURN 'MONEY_AVAILABLE'; END IF;
 RETURN 'MERCHANT_SETTLED';
END $$;
CREATE OR REPLACE FUNCTION check_merchant_operation_provenance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE source_record record;debit_bucket text;
BEGIN
 IF TG_TABLE_NAME='merchant_test_payments' THEN
  SELECT version,usage,description,"amountMinor",currency INTO source_record FROM payment_channels WHERE id=NEW."channelId" AND "merchantUnitId"=NEW."merchantUnitId" AND "serviceId"=NEW."serviceId";
  IF NOT FOUND OR ROW(NEW."channelVersion",NEW."channelUsage",NEW.description,NEW."amountMinor",NEW.currency) IS DISTINCT FROM ROW(source_record.version,source_record.usage,source_record.description,source_record."amountMinor",source_record.currency) THEN RAISE EXCEPTION 'Payment must match immutable channel snapshot' USING ERRCODE='23514'; END IF;
  IF NEW.outcome='DECLINED' THEN RETURN NEW; END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",'MERCHANT_PAYMENT',NEW.id,NEW."serviceId",NEW."merchantUnitId",'GATEWAY_CLEARING','MERCHANT_AVAILABLE',NEW."amountMinor",NEW."createdAt");
 ELSIF TG_TABLE_NAME='merchant_test_refunds' THEN
  SELECT outcome,"amountMinor",currency INTO source_record FROM merchant_test_payments WHERE id=NEW."paymentId" AND "merchantUnitId"=NEW."merchantUnitId" AND "serviceId"=NEW."serviceId";
  IF NOT FOUND OR source_record.outcome<>'APPROVED' OR ROW(NEW."amountMinor",NEW.currency) IS DISTINCT FROM ROW(source_record."amountMinor",source_record.currency) THEN RAISE EXCEPTION 'Refund must match original payment principal' USING ERRCODE='23514'; END IF;
  IF NOT EXISTS(SELECT 1 FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE s.id=NEW."serviceId" AND s.kind='MERCHANT' AND s."primaryPersonId"=NEW."actorId" AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Only the account owner may refund' USING ERRCODE='23514'; END IF;
  debit_bucket:=prepaid_refund_bucket(NEW."paymentId");IF debit_bucket IS NULL THEN RAISE EXCEPTION 'Pending deposit prevents this refund' USING ERRCODE='23514'; END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",'MERCHANT_REFUND',NEW.id,NEW."serviceId",NEW."merchantUnitId",debit_bucket,'GATEWAY_CLEARING',NEW."amountMinor",NEW."createdAt");
 ELSE RAISE EXCEPTION 'Terminal payout creation has been retired' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION check_settlement_records() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE b record;d record;total numeric;count_items bigint;account_id uuid;
BEGIN
 IF TG_TABLE_NAME='merchant_settlements' THEN
  SELECT "moneyAccountId" INTO account_id FROM money_account_services WHERE "serviceId"=NEW."serviceId" AND "serviceKind"='MERCHANT';
  IF NEW."moneyAccountId" IS DISTINCT FROM account_id OR account_id IS NULL OR NOT EXISTS(SELECT 1 FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE s.id=NEW."serviceId" AND s.kind='MERCHANT' AND s."primaryPersonId"=NEW."actorId" AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Settlement needs the merchant owner and its own money account' USING ERRCODE='23514'; END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",'MERCHANT_SETTLEMENT',NEW.id,NEW."serviceId",NEW."merchantUnitId",'MERCHANT_AVAILABLE','MONEY_AVAILABLE',NEW."amountMinor",NEW."createdAt");
  SELECT count(*),coalesce(sum("amountMinor"),0) INTO count_items,total FROM merchant_settlement_items WHERE "settlementId"=NEW.id;
  IF count_items=0 OR total<>NEW."amountMinor" THEN RAISE EXCEPTION 'Settlement total must match exact sales' USING ERRCODE='23514'; END IF;
 ELSIF TG_TABLE_NAME='merchant_settlement_items' THEN
  SELECT * INTO b FROM merchant_settlements WHERE id=NEW."settlementId";
  IF NOT EXISTS(SELECT 1 FROM merchant_test_payments p WHERE p.id=NEW."paymentId" AND p.outcome='APPROVED' AND p."amountMinor"=NEW."amountMinor" AND p."createdAt">=(SELECT "activatedAt" FROM prepaid_cutover WHERE id='D69') AND p."createdAt"<=b."createdAt") OR EXISTS(SELECT 1 FROM merchant_test_refunds WHERE "paymentId"=NEW."paymentId" AND "createdAt"<=b."createdAt") THEN RAISE EXCEPTION 'Settlement item must be an eligible original sale' USING ERRCODE='23514'; END IF;
  IF NOT EXISTS(SELECT 1 FROM ledger_journals WHERE id=b."journalId" AND "creationTransaction"=txid_current()) THEN RAISE EXCEPTION 'Settlement membership must be fixed atomically' USING ERRCODE='23514'; END IF;
 ELSIF TG_TABLE_NAME='merchant_deposits' THEN
  RAISE EXCEPTION 'Use merchant money withdrawal instead of a new terminal deposit' USING ERRCODE='23514';
 ELSE
  SELECT * INTO d FROM merchant_deposits WHERE id=NEW."depositId";
  IF NOT EXISTS(SELECT 1 FROM operator_service_access a JOIN services s ON s.id=a."serviceId" WHERE a."serviceId"=d."serviceId" AND a."personId"=NEW."actorId" AND a.state='ACCEPTED' AND a."canProcessDeposits" AND s.status<>'CLOSED') THEN RAISE EXCEPTION 'Deposit processing needs its explicit assignment' USING ERRCODE='23514'; END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",CASE WHEN NEW.outcome='COMPLETED' THEN 'MERCHANT_PAYOUT' ELSE 'DEPOSIT_RELEASE' END,d.id,d."serviceId",d."merchantUnitId",'MERCHANT_PAYOUT_PENDING',CASE WHEN NEW.outcome='COMPLETED' THEN 'MONEY_AVAILABLE' ELSE 'MERCHANT_SETTLED' END,d."amountMinor",NEW."createdAt");
 END IF;
 RETURN NULL;
END $$;
CREATE FUNCTION check_settlement_credit() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE amount numeric;account_id uuid;b record;
BEGIN
 SELECT * INTO b FROM merchant_settlements WHERE id=NEW."settlementId";
 SELECT "moneyAccountId" INTO account_id FROM money_account_services WHERE "serviceId"=NEW."serviceId" AND "serviceKind"='MERCHANT';
 IF b."moneyAccountId" IS NOT NULL OR NEW."moneyAccountId" IS DISTINCT FROM account_id OR account_id IS NULL OR NOT EXISTS(SELECT 1 FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE s.id=NEW."serviceId" AND s."primaryPersonId"=NEW."actorId" AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Historical settlement credit needs owner and correct merchant account' USING ERRCODE='23514'; END IF;
 IF NOT EXISTS(SELECT 1 FROM merchant_deposits WHERE "settlementId"=b.id) OR EXISTS(SELECT 1 FROM merchant_deposits d LEFT JOIN merchant_deposit_events e ON e."depositId"=d.id WHERE d."settlementId"=b.id AND (e.outcome IS NULL OR e.outcome<>'FAILED')) THEN RAISE EXCEPTION 'Only returned batches can be credited' USING ERRCODE='23514'; END IF;
 SELECT coalesce(sum(i."amountMinor"),0) INTO amount FROM merchant_settlement_items i LEFT JOIN merchant_test_refunds r ON r."paymentId"=i."paymentId" WHERE i."settlementId"=b.id AND r.id IS NULL;
 IF amount<=0 OR amount<>NEW."amountMinor" THEN RAISE EXCEPTION 'Credit must match remaining original batch principal' USING ERRCODE='23514'; END IF;
 PERFORM assert_merchant_money_journal(NEW."journalId",'MERCHANT_SETTLEMENT',NEW.id,NEW."serviceId",NEW."merchantUnitId",'MERCHANT_SETTLED','MONEY_AVAILABLE',amount,NEW."createdAt");RETURN NEW;
END $$;
CREATE TRIGGER settlement_credit_provenance BEFORE INSERT ON merchant_settlement_credits FOR EACH ROW EXECUTE FUNCTION check_settlement_credit();
CREATE TRIGGER settlement_credits_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON merchant_settlement_credits FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
CREATE OR REPLACE FUNCTION check_settlement_journal_owner() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.kind='MERCHANT_SETTLEMENT' AND NOT EXISTS(SELECT 1 FROM merchant_settlements WHERE id=NEW."referenceId" AND "journalId"=NEW.id) AND NOT EXISTS(SELECT 1 FROM merchant_settlement_credits WHERE id=NEW."referenceId" AND "journalId"=NEW.id) OR NEW.kind='DEPOSIT_RESERVE' AND NOT EXISTS(SELECT 1 FROM merchant_deposits WHERE id=NEW."referenceId" AND "journalId"=NEW.id) OR NEW.kind='DEPOSIT_RELEASE' AND NOT EXISTS(SELECT 1 FROM merchant_deposit_events WHERE "depositId"=NEW."referenceId" AND "journalId"=NEW.id AND outcome='FAILED') OR NEW.kind='MERCHANT_PAYOUT' AND NOT EXISTS(SELECT 1 FROM merchant_deposit_events WHERE "depositId"=NEW."referenceId" AND "journalId"=NEW.id AND outcome='COMPLETED') THEN RAISE EXCEPTION 'Settlement journal needs its typed business record' USING ERRCODE='23514'; END IF;
 RETURN NULL;
END $$;

--> statement-breakpoint
-- Reviewed supplement: src/modules/disputes/constraints.sql
-- Payment disputes are operational records. Resolution never creates a money journal.
CREATE FUNCTION guard_dispute_identity() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP IN ('DELETE','TRUNCATE') THEN RAISE EXCEPTION 'Dispute history cannot be removed' USING ERRCODE='23514'; END IF;
 IF TG_TABLE_NAME<>'merchant_disputes' THEN RAISE EXCEPTION 'Dispute messages and commands are immutable' USING ERRCODE='23514'; END IF;
 IF ROW(NEW.id,NEW."paymentId",NEW."terminalId",NEW."serviceId",NEW."payerId",NEW.reason,NEW."amountMinor",NEW."createdAt") IS DISTINCT FROM ROW(OLD.id,OLD."paymentId",OLD."terminalId",OLD."serviceId",OLD."payerId",OLD.reason,OLD."amountMinor",OLD."createdAt") OR NEW.version<>OLD.version+1 OR NEW."updatedAt"<OLD."updatedAt" OR OLD.status='RESOLVED' OR NOT ((OLD.status='NEEDS_RESPONSE' AND NEW.status IN ('IN_REVIEW','NEEDS_RESPONSE','RESOLVED')) OR (OLD.status='IN_REVIEW' AND NEW.status IN ('NEEDS_RESPONSE','RESOLVED'))) THEN RAISE EXCEPTION 'Invalid dispute transition' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER dispute_identity BEFORE UPDATE OR DELETE ON merchant_disputes FOR EACH ROW EXECUTE FUNCTION guard_dispute_identity();
CREATE TRIGGER dispute_no_truncate BEFORE TRUNCATE ON merchant_disputes FOR EACH STATEMENT EXECUTE FUNCTION guard_dispute_identity();
CREATE TRIGGER dispute_messages_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON merchant_dispute_messages FOR EACH STATEMENT EXECUTE FUNCTION guard_dispute_identity();
CREATE TRIGGER dispute_commands_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON merchant_dispute_commands FOR EACH STATEMENT EXECUTE FUNCTION guard_dispute_identity();

CREATE FUNCTION check_dispute_origin() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.status<>'NEEDS_RESPONSE' OR NEW.version<>1 OR NEW.resolution IS NOT NULL OR NEW."createdAt"<>NEW."updatedAt" OR NOT EXISTS(SELECT 1 FROM merchant_test_payments p JOIN card_checkout_attempts c ON c.id=p."cardCheckoutId" JOIN cards card ON card.id=c."cardId" AND card."serviceId"=c."cardServiceId" WHERE p.id=NEW."paymentId" AND p."merchantUnitId"=NEW."terminalId" AND p."serviceId"=NEW."serviceId" AND p.outcome='APPROVED' AND p."amountMinor"=NEW."amountMinor" AND c."payerId"=NEW."payerId" AND card."holderId"=NEW."payerId") OR EXISTS(SELECT 1 FROM merchant_test_refunds WHERE "paymentId"=NEW."paymentId") THEN RAISE EXCEPTION 'A dispute must belong to the payer of an unrefunded payment' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER dispute_origin BEFORE INSERT ON merchant_disputes FOR EACH ROW EXECUTE FUNCTION check_dispute_origin();
CREATE FUNCTION check_dispute_message() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE d record;
BEGIN
 SELECT * INTO d FROM merchant_disputes WHERE id=NEW."disputeId";
 IF NEW.sequence<>d.version OR NEW."createdAt"<>d."updatedAt" THEN RAISE EXCEPTION 'Dispute message must record the current transition' USING ERRCODE='23514'; END IF;
 IF NEW.kind='OPENED' THEN
  IF NEW.sequence<>1 OR NEW."authorRole"<>'PAYER' OR NEW."actorId"<>d."payerId" OR NEW.evidence<>'' OR d.status<>'NEEDS_RESPONSE' THEN RAISE EXCEPTION 'Only the original payer may open the dispute' USING ERRCODE='23514'; END IF;
 ELSIF NEW.kind='RESPONSE' THEN
  IF NEW.sequence<2 OR d.status<>'IN_REVIEW' OR char_length(trim(NEW.evidence))=0 THEN RAISE EXCEPTION 'A merchant response needs its evidence and review state' USING ERRCODE='23514'; END IF;
  IF NEW."authorRole"='OWNER' THEN
   IF NOT EXISTS(SELECT 1 FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE s.id=d."serviceId" AND s."primaryPersonId"=NEW."actorId" AND m.state='ACCEPTED' AND s.status NOT IN ('SUSPENDED','CLOSED')) THEN RAISE EXCEPTION 'Dispute response needs the current merchant owner' USING ERRCODE='23514'; END IF;
  ELSIF NEW."authorRole"='TERMINAL_USER' THEN
   IF NOT EXISTS(SELECT 1 FROM terminal_assignments a JOIN merchant_terminals t ON t.id=a."terminalId" JOIN services s ON s.id=t."masterServiceId" JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE a."terminalId"=d."terminalId" AND t."masterServiceId"=d."serviceId" AND a."personId"=NEW."actorId" AND a.state='ACCEPTED' AND (a."expiresAt" IS NULL OR a."expiresAt">clock_timestamp()) AND a."grantedByPersonId"=s."primaryPersonId" AND a."ownerMembershipVersion"=m.version AND m.state='ACCEPTED' AND t.status='ACTIVE' AND s.status NOT IN ('SUSPENDED','CLOSED')) THEN RAISE EXCEPTION 'Dispute response needs current access to its terminal' USING ERRCODE='23514'; END IF;
  ELSE RAISE EXCEPTION 'Invalid dispute response author' USING ERRCODE='23514'; END IF;
 ELSE
  IF NEW.sequence<2 OR NEW."authorRole"<>'OPERATOR' OR NEW.evidence<>'' OR (NEW.kind='MORE_INFORMATION' AND d.status<>'NEEDS_RESPONSE') OR (NEW.kind='RESOLVED' AND d.status<>'RESOLVED') OR NOT EXISTS(SELECT 1 FROM operator_service_access a JOIN services s ON s.id=a."serviceId" WHERE a."serviceId"=d."serviceId" AND a."personId"=NEW."actorId" AND a.state='ACCEPTED' AND a."canResolveDisputes" AND s.status<>'CLOSED') THEN RAISE EXCEPTION 'Dispute review needs its separately assigned operator' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER dispute_message_provenance BEFORE INSERT ON merchant_dispute_messages FOR EACH ROW EXECUTE FUNCTION check_dispute_message();
CREATE FUNCTION check_dispute_history() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE dispute_id uuid;d record;m record;n bigint;c bigint;
BEGIN
 dispute_id:=CASE WHEN TG_TABLE_NAME='merchant_disputes' THEN NEW.id ELSE NEW."disputeId" END;
 SELECT * INTO d FROM merchant_disputes WHERE id=dispute_id;
 SELECT count(*) INTO n FROM merchant_dispute_messages WHERE "disputeId"=dispute_id;
 SELECT count(*) INTO c FROM merchant_dispute_commands WHERE "disputeId"=dispute_id;
 SELECT * INTO m FROM merchant_dispute_messages WHERE "disputeId"=dispute_id AND sequence=d.version;
 IF n<>d.version OR c<>d.version OR m.id IS NULL OR (d.status='IN_REVIEW' AND m.kind<>'RESPONSE') OR (d.status='RESOLVED' AND m.kind<>'RESOLVED') OR (d.status='NEEDS_RESPONSE' AND m.kind NOT IN ('OPENED','MORE_INFORMATION')) OR EXISTS(SELECT 1 FROM merchant_dispute_commands cmd WHERE cmd."disputeId"=dispute_id AND NOT EXISTS(SELECT 1 FROM merchant_dispute_messages msg WHERE msg."disputeId"=cmd."disputeId" AND msg."actorId"=cmd."actorId" AND msg."createdAt"=cmd."createdAt" AND CASE cmd.kind WHEN 'OPEN' THEN msg.kind='OPENED' WHEN 'RESPOND' THEN msg.kind='RESPONSE' WHEN 'REVIEW' THEN msg.kind IN ('MORE_INFORMATION','RESOLVED') ELSE false END)) THEN RAISE EXCEPTION 'Every dispute change needs its immutable message and command receipt' USING ERRCODE='23514'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER dispute_history_complete AFTER INSERT OR UPDATE ON merchant_disputes DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_dispute_history();
CREATE CONSTRAINT TRIGGER dispute_message_history_complete AFTER INSERT ON merchant_dispute_messages DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_dispute_history();
CREATE CONSTRAINT TRIGGER dispute_command_history_complete AFTER INSERT ON merchant_dispute_commands DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_dispute_history();


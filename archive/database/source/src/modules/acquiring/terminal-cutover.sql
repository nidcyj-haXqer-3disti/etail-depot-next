-- D73 structural cutover. Run once, before generated terminal schema reconciliation.
-- Stable IDs and every posted journal remain unchanged.
CREATE TABLE merchant_hierarchy_history AS SELECT id,kind,"masterId","masterKind","masterServiceId","masterServiceKind",clock_timestamp() AS "archivedAt" FROM merchant_units;
CREATE TRIGGER merchant_hierarchy_history_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON merchant_hierarchy_history FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
ALTER TABLE merchant_units RENAME TO merchant_terminals;
ALTER TABLE merchant_terminals DROP COLUMN kind;
ALTER TABLE merchant_terminals DROP COLUMN "masterId";
ALTER TABLE merchant_terminals DROP COLUMN "masterKind";
ALTER TABLE merchant_terminals ADD CONSTRAINT merchant_terminal_service_kind CHECK ("masterServiceKind"='MERCHANT');
ALTER TABLE merchant_unit_commands DROP CONSTRAINT merchant_unit_command_kind;
ALTER TABLE merchant_unit_commands ADD CONSTRAINT merchant_unit_command_kind CHECK (kind IN ('CREATE_SUB','CREATE_TERMINAL','PAUSE','RESUME'));
ALTER TABLE merchant_operation_commands DROP CONSTRAINT merchant_operation_command_fields;
ALTER TABLE merchant_operation_commands ADD CONSTRAINT merchant_operation_command_fields CHECK (kind IN ('GATEWAY','ENROLLMENT','ACTIVATION','PAYMENT','REFUND','PAYOUT','SETTLEMENT') AND digest ~ '^[0-9a-f]{64}$' AND char_length("scopeKey") BETWEEN 1 AND 120);
ALTER TABLE payment_channels DROP CONSTRAINT payment_channel_creator_basis;
ALTER TABLE payment_channels ADD CONSTRAINT payment_channel_creator_basis CHECK ("creatorBasis" IN ('PRIMARY_MEMBER','MERCHANT_ASSIGNMENT','OWNER_MEMBER','TERMINAL_ASSIGNMENT') AND (("creatorBasis" IN ('MERCHANT_ASSIGNMENT','TERMINAL_ASSIGNMENT') AND "creatorAssignmentId" IS NOT NULL) OR ("creatorBasis" IN ('PRIMARY_MEMBER','OWNER_MEMBER') AND "creatorAssignmentId" IS NULL)));

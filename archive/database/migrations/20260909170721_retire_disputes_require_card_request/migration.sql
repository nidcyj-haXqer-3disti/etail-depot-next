-- Obsolete dispute examples are retired. Existing regression TEST was preserved whole
-- in the explicitly named recovery database; this migration never deletes financial history.
LOCK TABLE "disputes", "dispute_timeline", "cards", "permission_grants", "invitation_permissions", "workspace_command_receipts" IN ACCESS EXCLUSIVE MODE;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM "disputes") OR EXISTS (SELECT 1 FROM "dispute_timeline")
     OR EXISTS (SELECT 1 FROM "workspace_command_receipts" WHERE kind IN ('dispute.response.save','dispute.response.submit')) THEN
    RAISE EXCEPTION 'Retired dispute records must be preserved before removing their tables';
  END IF;
  IF EXISTS (SELECT 1 FROM "cards" WHERE "requestId" IS NULL) THEN
    RAISE EXCEPTION 'Cards without request provenance must be preserved; no backfill or financial-history deletion is permitted';
  END IF;
END $$;
--> statement-breakpoint
-- These four unsupported permissions no longer name a runtime capability.
DELETE FROM "permission_grants" WHERE action IN ('balances.read','settlements.read','disputes.read','disputes.respond');
--> statement-breakpoint
DELETE FROM "invitation_permissions" WHERE action IN ('balances.read','settlements.read','disputes.read','disputes.respond');
--> statement-breakpoint
ALTER TABLE "dispute_timeline" DROP CONSTRAINT "dispute_timeline_disputeId_disputes_id_fkey";--> statement-breakpoint
DROP TABLE "dispute_timeline";--> statement-breakpoint
DROP TABLE "disputes";--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "requestId" SET NOT NULL;

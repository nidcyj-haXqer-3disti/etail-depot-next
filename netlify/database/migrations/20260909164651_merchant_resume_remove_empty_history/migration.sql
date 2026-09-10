-- These retired illustration tables may be removed only while still empty.
LOCK TABLE settlements,workspace_balance_snapshots IN ACCESS EXCLUSIVE MODE;
--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM settlements) OR EXISTS (SELECT 1 FROM workspace_balance_snapshots) THEN
  RAISE EXCEPTION 'Historical illustration tables are populated; refusing removal' USING ERRCODE='23514';
 END IF;
END $$;
--> statement-breakpoint
DROP TABLE "settlements";--> statement-breakpoint
DROP TABLE "workspace_balance_snapshots";--> statement-breakpoint
ALTER TABLE "merchant_unit_commands" DROP CONSTRAINT "merchant_unit_command_kind", ADD CONSTRAINT "merchant_unit_command_kind" CHECK ("kind" in ('CREATE_SUB','PAUSE','RESUME'));--> statement-breakpoint
ALTER TABLE "merchant_unit_events" DROP CONSTRAINT "merchant_unit_event_kind", ADD CONSTRAINT "merchant_unit_event_kind" CHECK ("kind" in ('CREATED','PAUSED','RESUMED'));
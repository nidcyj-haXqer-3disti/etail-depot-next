-- D76: cards are created before their recipient accepts. Existing identities and
-- all financial records are preserved; this migration does not move money.
ALTER TABLE cards ALTER COLUMN "holderId" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE card_requests ALTER COLUMN "holderId" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE cards ADD COLUMN "assignmentState" text NOT NULL DEFAULT 'UNASSIGNED', ADD COLUMN "assignedAt" timestamptz, ADD COLUMN "assignmentRevokedAt" timestamptz, ADD COLUMN network text NOT NULL DEFAULT 'VISA';
--> statement-breakpoint
UPDATE cards c SET "assignmentState"=CASE WHEN m.state='ACCEPTED' THEN 'ACCEPTED' ELSE 'REVOKED' END, "assignedAt"=r."updatedAt", "assignmentRevokedAt"=CASE WHEN m.state='ACCEPTED' THEN NULL ELSE transaction_timestamp() END FROM service_members m,card_requests r WHERE m."serviceId"=c."serviceId" AND m."personId"=c."holderId" AND r.id=c."requestId";
--> statement-breakpoint
ALTER TABLE cards ADD CONSTRAINT card_assignment_valid CHECK (("assignmentState"='UNASSIGNED' AND "holderId" IS NULL AND "assignedAt" IS NULL AND "assignmentRevokedAt" IS NULL) OR ("assignmentState"='ACCEPTED' AND "holderId" IS NOT NULL AND "assignedAt" IS NOT NULL AND "assignmentRevokedAt" IS NULL) OR ("assignmentState"='REVOKED' AND "holderId" IS NOT NULL AND "assignedAt" IS NOT NULL AND "assignmentRevokedAt" IS NOT NULL)), ADD CONSTRAINT card_network_valid CHECK (network='VISA');
--> statement-breakpoint
CREATE OR REPLACE FUNCTION guard_card_identity() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF ROW(NEW.id,NEW."serviceId",NEW."serviceKind",NEW."requestId",NEW."issuerReference",NEW."lastFour",NEW.format,NEW.currency,NEW.network) IS DISTINCT FROM ROW(OLD.id,OLD."serviceId",OLD."serviceKind",OLD."requestId",OLD."issuerReference",OLD."lastFour",OLD.format,OLD.currency,OLD.network) THEN RAISE EXCEPTION 'Card identity is immutable' USING ERRCODE='23514'; END IF;
 IF ROW(NEW."holderId",NEW."assignmentState",NEW."assignedAt",NEW."assignmentRevokedAt") IS DISTINCT FROM ROW(OLD."holderId",OLD."assignmentState",OLD."assignedAt",OLD."assignmentRevokedAt") THEN
  IF NOT ((OLD."assignmentState"='UNASSIGNED' AND NEW."assignmentState"='ACCEPTED' AND OLD."holderId" IS NULL AND NEW."holderId" IS NOT NULL AND EXISTS(SELECT 1 FROM service_members m WHERE m."serviceId"=NEW."serviceId" AND m."personId"=NEW."holderId" AND m.state='ACCEPTED')) OR (OLD."assignmentState"='ACCEPTED' AND NEW."assignmentState"='REVOKED' AND NEW."holderId"=OLD."holderId" AND NEW."assignedAt"=OLD."assignedAt")) OR NEW.version<>OLD.version+1 THEN RAISE EXCEPTION 'Card recipient can accept once and cannot be reassigned' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
-- The purchase guard supplements the canonical command; refunds still reconcile
-- to their original card even after its assignment is revoked.
CREATE FUNCTION guard_card_purchase_assignment() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.kind='CARD_PURCHASE' AND NOT EXISTS(SELECT 1 FROM service_activity a JOIN cards c ON c.id=a."cardId" AND c."serviceId"=a."serviceId" JOIN service_members m ON m."serviceId"=c."serviceId" AND m."personId"=c."holderId" WHERE a.id=NEW."referenceId" AND c."assignmentState"='ACCEPTED' AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'A purchase requires an accepted card recipient' USING ERRCODE='23514'; END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER card_purchase_assignment AFTER INSERT ON ledger_journals DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION guard_card_purchase_assignment();

-- D76: the invitation names an existing card or terminal and an intended contact.
-- Existing accepted access/history remain intact. Pending broad card offers are retired.
ALTER TABLE service_invitations ADD COLUMN "cardId" uuid REFERENCES cards(id);
ALTER TABLE service_invitations ADD COLUMN "recipientEmail" text;
ALTER TABLE service_invitations ALTER COLUMN "recipientId" DROP NOT NULL;
ALTER TABLE service_access_history ALTER COLUMN "personId" DROP NOT NULL;
ALTER TABLE service_invitations DROP CONSTRAINT invitation_target_shape;
ALTER TABLE service_invitations ADD CONSTRAINT service_invitations_cardId_serviceId_cards_id_serviceId_fkey FOREIGN KEY ("cardId","serviceId") REFERENCES cards(id,"serviceId");
ALTER TABLE service_invitations ADD CONSTRAINT invitation_recipient_present CHECK ("recipientId" IS NOT NULL OR "recipientEmail" IS NOT NULL);
ALTER TABLE service_invitations ADD CONSTRAINT invitation_email_normalized CHECK ("recipientEmail" IS NULL OR ("recipientEmail"=lower(trim("recipientEmail")) AND length("recipientEmail")<=254 AND "recipientEmail" LIKE '%@%'));
ALTER TABLE service_invitations ADD CONSTRAINT invitation_target_shape CHECK (
 ("targetKind"='CARD' AND "cardId" IS NOT NULL AND "serviceId" IS NOT NULL AND "merchantUnitId" IS NULL AND role IS NOT NULL) OR
 ("targetKind"='SERVICE' AND "cardId" IS NULL AND "recipientId" IS NOT NULL AND "serviceId" IS NOT NULL AND "merchantUnitId" IS NULL AND role IS NOT NULL) OR
 ("targetKind"='MERCHANT_TERMINAL' AND "cardId" IS NULL AND "serviceId" IS NULL AND "merchantUnitId" IS NOT NULL AND role IS NULL));
DROP INDEX one_pending_invitation_per_recipient;
CREATE UNIQUE INDEX one_pending_invitation_per_recipient ON service_invitations("serviceId","recipientId") WHERE status='PENDING' AND "targetKind"='SERVICE';
CREATE UNIQUE INDEX one_pending_card_invitation ON service_invitations("cardId") WHERE status='PENDING' AND "targetKind"='CARD';
CREATE UNIQUE INDEX one_pending_terminal_email_invitation ON service_invitations("merchantUnitId","recipientEmail") WHERE status='PENDING' AND "recipientEmail" IS NOT NULL;
INSERT INTO service_access_history("serviceId","actorId","personId","invitationId",kind,message)
 SELECT "serviceId","inviterId","recipientId",id,'INVITATION_REVOKED','Create a card before inviting its cardholder.' FROM service_invitations WHERE "targetKind"='SERVICE' AND status='PENDING';
UPDATE service_invitations SET status='REVOKED',version=version+1,"decidedAt"=clock_timestamp() WHERE "targetKind"='SERVICE' AND status='PENDING';
--> statement-breakpoint
CREATE FUNCTION guard_invitation_target() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF ROW(NEW.id,NEW."targetKind",NEW."cardId",NEW."serviceId",NEW."merchantUnitId",NEW."inviterId",NEW."recipientEmail",NEW.role,NEW."createdAt") IS DISTINCT FROM ROW(OLD.id,OLD."targetKind",OLD."cardId",OLD."serviceId",OLD."merchantUnitId",OLD."inviterId",OLD."recipientEmail",OLD.role,OLD."createdAt") THEN
  RAISE EXCEPTION 'An invitation target cannot be changed' USING ERRCODE='23514';
 END IF;
 IF NEW."recipientId" IS DISTINCT FROM OLD."recipientId" AND (OLD."recipientId" IS NOT NULL OR OLD.status<>'PENDING' OR NEW.status NOT IN ('ACCEPTED','DECLINED') OR NOT EXISTS (
  SELECT 1 FROM identity_verified_emails e JOIN identity_bindings b ON b.id=e."identityId"
  WHERE b."personId"=NEW."recipientId" AND e."emailNormalized"=OLD."recipientEmail" AND e."observedAt">clock_timestamp()-interval '8 hours'
 )) THEN RAISE EXCEPTION 'The intended contact must confirm this invitation' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER invitation_target_immutable BEFORE UPDATE ON service_invitations FOR EACH ROW EXECUTE FUNCTION guard_invitation_target();

-- D73 correction: invitations are allowed during merchant setup, matching the canonical scope.
-- Suspended/closed services and paused terminals remain ineligible.
CREATE OR REPLACE FUNCTION guard_terminal_assignment() RETURNS trigger LANGUAGE plpgsql AS $$
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
   WHERE t.id=NEW."terminalId" AND t.status='ACTIVE' AND s.status NOT IN ('SUSPENDED','CLOSED') AND s."primaryPersonId"=NEW."grantedByPersonId" AND m.state='ACCEPTED' AND m.version=NEW."ownerMembershipVersion" AND i.status IN ('PENDING','ACCEPTED') AND i."expiresAt">transaction_timestamp() AND terms."accessExpiresAt" IS NOT DISTINCT FROM NEW."expiresAt" AND (NEW."expiresAt" IS NULL OR NEW."expiresAt">transaction_timestamp())
  ) THEN RAISE EXCEPTION 'Terminal access requires a current direct owner invitation' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION guard_terminal_invitation_terms() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM service_invitations i JOIN merchant_terminals t ON t.id=i."merchantUnitId" JOIN services s ON s.id=t."masterServiceId" JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE i.id=NEW."invitationId" AND i."targetKind"='MERCHANT_TERMINAL' AND i.status='PENDING' AND i."merchantUnitId"=NEW."terminalId" AND i."inviterId"=NEW."grantedByPersonId" AND s."primaryPersonId"=NEW."grantedByPersonId" AND m.state='ACCEPTED' AND m.version=NEW."ownerMembershipVersion" AND s.status NOT IN ('SUSPENDED','CLOSED') AND t.status='ACTIVE') THEN RAISE EXCEPTION 'Terminal invitation must come directly from its current owner' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;

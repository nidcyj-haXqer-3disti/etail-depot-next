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

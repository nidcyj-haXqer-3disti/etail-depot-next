-- Identity, attribution and delegation history survive every ordinary status change.
CREATE FUNCTION guard_merchant_identity() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP IN ('DELETE','TRUNCATE') THEN RAISE EXCEPTION 'Merchant provenance cannot be removed' USING ERRCODE='23514'; END IF;
  IF TG_TABLE_NAME='merchant_units' THEN
    IF ROW(NEW.id,NEW.kind,NEW."masterId",NEW."masterServiceId",NEW."createdAt") IS DISTINCT FROM ROW(OLD.id,OLD.kind,OLD."masterId",OLD."masterServiceId",OLD."createdAt") THEN RAISE EXCEPTION 'Merchant identity is immutable' USING ERRCODE='23514'; END IF;
  ELSIF TG_TABLE_NAME='payment_channels' THEN
    IF ROW(NEW.id,NEW."serviceId",NEW."merchantUnitId",NEW."creatorId",NEW."creatorAssignmentId",NEW."creatorBasis",NEW."createdAt") IS DISTINCT FROM ROW(OLD.id,OLD."serviceId",OLD."merchantUnitId",OLD."creatorId",OLD."creatorAssignmentId",OLD."creatorBasis",OLD."createdAt") THEN RAISE EXCEPTION 'Channel origin is immutable' USING ERRCODE='23514'; END IF;
  ELSIF TG_TABLE_NAME='merchant_assignments' THEN
    IF ROW(NEW.id,NEW."merchantUnitId",NEW."personId",NEW."sourceAssignmentId",NEW."sourcePrimaryPersonId",NEW."sourceMembershipVersion",NEW."createdAt",NEW."expiresAt") IS DISTINCT FROM ROW(OLD.id,OLD."merchantUnitId",OLD."personId",OLD."sourceAssignmentId",OLD."sourcePrimaryPersonId",OLD."sourceMembershipVersion",OLD."createdAt",OLD."expiresAt") OR (OLD.state='REVOKED' AND NEW.state<>'REVOKED') THEN RAISE EXCEPTION 'Assignment origin is immutable and revoked access cannot revive' USING ERRCODE='23514'; END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER merchant_unit_identity BEFORE UPDATE OR DELETE ON merchant_units FOR EACH ROW EXECUTE FUNCTION guard_merchant_identity();
CREATE TRIGGER merchant_unit_no_truncate BEFORE TRUNCATE ON merchant_units FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_identity();
CREATE TRIGGER payment_channel_identity BEFORE UPDATE OR DELETE ON payment_channels FOR EACH ROW EXECUTE FUNCTION guard_merchant_identity();
CREATE TRIGGER payment_channel_no_truncate BEFORE TRUNCATE ON payment_channels FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_identity();
CREATE TRIGGER merchant_assignment_identity BEFORE UPDATE OR DELETE ON merchant_assignments FOR EACH ROW EXECUTE FUNCTION guard_merchant_identity();
CREATE TRIGGER merchant_assignment_no_truncate BEFORE TRUNCATE ON merchant_assignments FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_identity();
CREATE FUNCTION guard_merchant_record() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Merchant command and history records are immutable' USING ERRCODE='23514'; END $$;
CREATE TRIGGER merchant_unit_command_immutable BEFORE UPDATE OR DELETE ON merchant_unit_commands FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_unit_command_no_truncate BEFORE TRUNCATE ON merchant_unit_commands FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_service_command_immutable BEFORE UPDATE OR DELETE ON merchant_service_commands FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_service_command_no_truncate BEFORE TRUNCATE ON merchant_service_commands FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER payment_channel_command_immutable BEFORE UPDATE OR DELETE ON payment_channel_commands FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER payment_channel_command_no_truncate BEFORE TRUNCATE ON payment_channel_commands FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_unit_event_immutable BEFORE UPDATE OR DELETE ON merchant_unit_events FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_unit_event_no_truncate BEFORE TRUNCATE ON merchant_unit_events FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_application_event_immutable BEFORE UPDATE OR DELETE ON merchant_application_events FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_application_event_no_truncate BEFORE TRUNCATE ON merchant_application_events FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_application_command_immutable BEFORE UPDATE OR DELETE ON merchant_application_commands FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_application_command_no_truncate BEFORE TRUNCATE ON merchant_application_commands FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
CREATE FUNCTION check_channel_creator() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW."creatorBasis"='MERCHANT_ASSIGNMENT' THEN
   IF NOT EXISTS (SELECT 1 FROM merchant_assignments a WHERE a.id=NEW."creatorAssignmentId" AND a."merchantUnitId"=NEW."merchantUnitId" AND a."personId"=NEW."creatorId") THEN RAISE EXCEPTION 'Channel assignment does not match creator and merchant' USING ERRCODE='23514'; END IF;
 ELSE
   IF NOT EXISTS (SELECT 1 FROM services s WHERE s.id=NEW."serviceId" AND s.kind='MERCHANT' AND s."primaryPersonId"=NEW."creatorId") THEN RAISE EXCEPTION 'Channel primary creator does not match Merchant service' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER payment_channel_creator BEFORE INSERT ON payment_channels FOR EACH ROW EXECUTE FUNCTION check_channel_creator();
CREATE FUNCTION check_merchant_assignment_origin() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE parent merchant_assignments%ROWTYPE; root_service uuid; primary_person uuid;
BEGIN
 SELECT "masterServiceId" INTO root_service FROM merchant_units WHERE id=NEW."merchantUnitId";
 SELECT "primaryPersonId" INTO primary_person FROM services WHERE id=root_service AND kind='MERCHANT';
 IF NEW."sourceAssignmentId" IS NOT NULL THEN
   SELECT * INTO parent FROM merchant_assignments WHERE id=NEW."sourceAssignmentId" AND "merchantUnitId"=NEW."merchantUnitId";
   IF NOT FOUND OR parent.id=NEW.id OR NEW."expiresAt">parent."expiresAt" THEN RAISE EXCEPTION 'Invalid merchant assignment ancestor' USING ERRCODE='23514'; END IF;
 ELSE
   IF NEW."sourcePrimaryPersonId" IS DISTINCT FROM primary_person OR NOT EXISTS (SELECT 1 FROM service_members m WHERE m."serviceId"=root_service AND m."personId"=primary_person AND m.state='ACCEPTED' AND m.version=NEW."sourceMembershipVersion") THEN RAISE EXCEPTION 'Invalid primary membership origin' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER merchant_assignment_origin BEFORE INSERT ON merchant_assignments FOR EACH ROW EXECUTE FUNCTION check_merchant_assignment_origin();

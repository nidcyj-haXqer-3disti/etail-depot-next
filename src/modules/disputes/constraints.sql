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
 IF TG_TABLE_NAME='merchant_disputes' THEN dispute_id:=NEW.id; ELSE dispute_id:=NEW."disputeId"; END IF;
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

-- Select typed NEW fields in separate PL/pgSQL branches.
CREATE OR REPLACE FUNCTION check_dispute_history() RETURNS trigger LANGUAGE plpgsql AS $$
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

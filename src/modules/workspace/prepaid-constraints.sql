-- D69: new money has an explicit source, owner and immutable business effect.
CREATE TABLE prepaid_cutover (id text PRIMARY KEY CHECK(id='D69'), "activatedAt" timestamptz NOT NULL DEFAULT clock_timestamp());
--> statement-breakpoint
INSERT INTO prepaid_cutover(id) VALUES ('D69');
--> statement-breakpoint
CREATE TRIGGER prepaid_cutover_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON prepaid_cutover FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE OR REPLACE FUNCTION check_ledger_available_balance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE total numeric;
BEGIN
 IF NEW.bucket IN ('GROUP_AVAILABLE','CARD_AVAILABLE','MERCHANT_AVAILABLE','MERCHANT_SETTLED','MERCHANT_PAYOUT_PENDING','PAYOUT_CLEARING') THEN
  SELECT coalesce(sum("deltaMinor"),0) INTO total FROM ledger_entries WHERE "serviceId"=NEW."serviceId" AND bucket=NEW.bucket AND "cardId" IS NOT DISTINCT FROM NEW."cardId" AND "merchantUnitId" IS NOT DISTINCT FROM NEW."merchantUnitId";
  IF total<0 THEN RAISE EXCEPTION 'Available money cannot be negative' USING ERRCODE='23514'; END IF;
 END IF;
 IF NEW.bucket IN ('GROUP_AVAILABLE','PRACTICE_SOURCE') AND NOT EXISTS(SELECT 1 FROM services WHERE id=NEW."serviceId" AND kind='CARDHOLDER') THEN RAISE EXCEPTION 'Group money requires a Cardholder service' USING ERRCODE='23514'; END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE FUNCTION assert_prepaid_journal(jid uuid, expected_kind text, ref uuid, svc uuid, unit_id uuid, card_id uuid, debit text, credit text, amount numeric, at_time timestamptz) RETURNS void LANGUAGE plpgsql AS $$
DECLARE j record; total bigint; debits bigint; credits bigint;
BEGIN
 SELECT * INTO j FROM ledger_journals WHERE id=jid;
 IF NOT FOUND OR j.kind<>expected_kind OR j."referenceId"<>ref OR j.currency<>'USD' OR j."creationTransaction"<>txid_current() OR j."createdAt"<>at_time THEN RAISE EXCEPTION 'Financial record must own its exact journal' USING ERRCODE='23514'; END IF;
 SELECT count(*),count(*) FILTER(WHERE "serviceId"=svc AND "merchantUnitId" IS NOT DISTINCT FROM unit_id AND "cardId" IS NOT DISTINCT FROM (CASE WHEN debit LIKE 'CARD_%' THEN card_id ELSE NULL END) AND bucket=debit AND "deltaMinor"=-amount),count(*) FILTER(WHERE "serviceId"=svc AND "merchantUnitId" IS NOT DISTINCT FROM unit_id AND "cardId" IS NOT DISTINCT FROM (CASE WHEN credit LIKE 'CARD_%' THEN card_id ELSE NULL END) AND bucket=credit AND "deltaMinor"=amount) INTO total,debits,credits FROM ledger_entries WHERE "journalId"=jid;
 IF total<>2 OR debits<>1 OR credits<>1 THEN RAISE EXCEPTION 'Financial journal principal and scope must match' USING ERRCODE='23514'; END IF;
END $$;
--> statement-breakpoint
CREATE FUNCTION guard_prepaid_primary() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE svc uuid; actor uuid;
BEGIN
 svc:=NEW."serviceId";IF TG_TABLE_NAME='cardholder_spending_limits' THEN actor:=NEW."updatedBy";ELSE actor:=NEW."actorId";END IF;
 IF NOT EXISTS(SELECT 1 FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=actor WHERE s.id=svc AND s.kind='CARDHOLDER' AND s."primaryPersonId"=actor AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Funding and limits require the primary Cardholder' USING ERRCODE='23514'; END IF;
 IF TG_TABLE_NAME='cardholder_topups' THEN PERFORM assert_prepaid_journal(NEW."journalId",'GROUP_FUNDING',NEW.id,svc,NULL,NULL,'PRACTICE_SOURCE','GROUP_AVAILABLE',NEW."amountMinor",NEW."createdAt"); END IF;
 IF TG_TABLE_NAME='cardholder_spending_limits' THEN
  IF TG_OP='INSERT' AND NEW.version<>1 THEN RAISE EXCEPTION 'Limit starts at version one' USING ERRCODE='23514'; END IF;
  IF TG_OP='UPDATE' AND (ROW(NEW."serviceId",NEW."personId") IS DISTINCT FROM ROW(OLD."serviceId",OLD."personId") OR NEW.version<>OLD.version+1) THEN RAISE EXCEPTION 'Limit identity and version are invalid' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE FUNCTION check_limit_history() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE prior numeric;
BEGIN
 prior:=CASE WHEN TG_OP='INSERT' THEN 0 ELSE OLD."monthlyLimitMinor" END;
 IF NOT EXISTS(SELECT 1 FROM cardholder_limit_changes h WHERE h."serviceId"=NEW."serviceId" AND h."personId"=NEW."personId" AND h.version=NEW.version AND h."previousMinor"=prior AND h."monthlyLimitMinor"=NEW."monthlyLimitMinor" AND h."actorId"=NEW."updatedBy" AND h."createdAt"=NEW."updatedAt") THEN RAISE EXCEPTION 'Limit change requires matching immutable history' USING ERRCODE='23514'; END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE FUNCTION guard_limit_history() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM cardholder_spending_limits l WHERE l."serviceId"=NEW."serviceId" AND l."personId"=NEW."personId" AND l.version=NEW.version AND l."monthlyLimitMinor"=NEW."monthlyLimitMinor" AND l."updatedBy"=NEW."actorId" AND l."updatedAt"=NEW."createdAt") THEN RAISE EXCEPTION 'Limit history requires its current change' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER topup_primary BEFORE INSERT ON cardholder_topups FOR EACH ROW EXECUTE FUNCTION guard_prepaid_primary();
--> statement-breakpoint
CREATE TRIGGER funding_intent_primary BEFORE INSERT ON cardholder_funding_intents FOR EACH ROW EXECUTE FUNCTION guard_prepaid_primary();
--> statement-breakpoint
CREATE TRIGGER limit_primary BEFORE INSERT OR UPDATE ON cardholder_spending_limits FOR EACH ROW EXECUTE FUNCTION guard_prepaid_primary();
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER limit_matching_history AFTER INSERT OR UPDATE ON cardholder_spending_limits DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_limit_history();
--> statement-breakpoint
CREATE TRIGGER limit_history_origin BEFORE INSERT ON cardholder_limit_changes FOR EACH ROW EXECUTE FUNCTION guard_limit_history();
--> statement-breakpoint
CREATE TRIGGER limit_no_reset BEFORE DELETE OR TRUNCATE ON cardholder_spending_limits FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE FUNCTION guard_card_identity() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF ROW(NEW.id,NEW."serviceId",NEW."serviceKind",NEW."holderId",NEW."requestId",NEW."issuerReference",NEW."lastFour",NEW.format,NEW.currency) IS DISTINCT FROM ROW(OLD.id,OLD."serviceId",OLD."serviceKind",OLD."holderId",OLD."requestId",OLD."issuerReference",OLD."lastFour",OLD.format,OLD.currency) THEN RAISE EXCEPTION 'Card identity is immutable' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER card_identity_immutable BEFORE UPDATE ON cards FOR EACH ROW EXECUTE FUNCTION guard_card_identity();
--> statement-breakpoint
CREATE FUNCTION check_prepaid_effect() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE a record; p record; c record; r record; lim numeric; used numeric; start_time timestamptz;
BEGIN
 IF NEW.kind='GROUP_FUNDING' THEN
  IF NOT EXISTS(SELECT 1 FROM cardholder_topups WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Funding journal needs its top-up receipt' USING ERRCODE='23514'; END IF;
 ELSIF NEW.kind='CARD_PURCHASE' THEN
  SELECT * INTO a FROM service_activity WHERE id=NEW."referenceId";
  IF NOT FOUND OR a.direction<>'DEBIT' OR a.status<>'POSTED' OR a."cardId" IS NULL THEN RAISE EXCEPTION 'Purchase journal requires matching activity' USING ERRCODE='23514'; END IF;
  PERFORM assert_prepaid_journal(NEW.id,'CARD_PURCHASE',a.id,a."serviceId",NULL,a."cardId",'GROUP_AVAILABLE','CARD_SPENT',a."amountMinor",a."occurredAt");
  SELECT * INTO c FROM cards WHERE id=a."cardId" AND "serviceId"=a."serviceId";
  SELECT "monthlyLimitMinor" INTO lim FROM cardholder_spending_limits WHERE "serviceId"=a."serviceId" AND "personId"=c."holderId";
  start_time:=date_trunc('month',NEW."createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
  SELECT coalesce(sum(e."deltaMinor"),0) INTO used FROM ledger_entries e JOIN ledger_journals j ON j.id=e."journalId" JOIN cards card ON card.id=e."cardId" AND card."serviceId"=e."serviceId" WHERE e."serviceId"=a."serviceId" AND card."holderId"=c."holderId" AND e.bucket='CARD_SPENT' AND e."deltaMinor">0 AND j.kind='CARD_PURCHASE' AND j."createdAt">=start_time AND j."createdAt"<((start_time AT TIME ZONE 'UTC')+interval '1 month') AT TIME ZONE 'UTC';
  IF lim IS NULL OR used>lim THEN RAISE EXCEPTION 'Monthly person limit exceeded' USING ERRCODE='23514'; END IF;
 ELSIF NEW.kind='CARD_REFUND' THEN
  SELECT f.*,pay."cardCheckoutId",pay."cardActivityId" INTO r FROM merchant_test_refunds f JOIN merchant_test_payments pay ON pay.id=f."paymentId" WHERE f.id=NEW."referenceId";
  SELECT * INTO p FROM card_checkout_attempts WHERE id=r."cardCheckoutId";
  SELECT * INTO a FROM service_activity WHERE id=NEW."referenceId";
  IF p.id IS NULL OR a.id IS NULL OR a.direction<>'CREDIT' OR a.status<>'POSTED' OR a."serviceId"<>p."cardServiceId" OR a."cardId"<>p."cardId" OR a."amountMinor"<>r."amountMinor" THEN RAISE EXCEPTION 'Refund requires original card group and matching credit' USING ERRCODE='23514'; END IF;
  PERFORM assert_prepaid_journal(NEW.id,'CARD_REFUND',r.id,p."cardServiceId",NULL,p."cardId",'CARD_SPENT','GROUP_AVAILABLE',r."amountMinor",a."occurredAt");
 END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER prepaid_effect_provenance AFTER INSERT ON ledger_journals DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_prepaid_effect();
--> statement-breakpoint
CREATE FUNCTION guard_card_checkout_attempt() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM cards WHERE id=NEW."cardId" AND "serviceId"=NEW."cardServiceId" AND "holderId"=NEW."payerId") OR NOT EXISTS(SELECT 1 FROM merchant_guest_publications WHERE id=NEW."publicationId" AND "amountMinor"=NEW."amountMinor") THEN RAISE EXCEPTION 'Checkout must belong to payer and published amount' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER card_checkout_origin BEFORE INSERT ON card_checkout_attempts FOR EACH ROW EXECUTE FUNCTION guard_card_checkout_attempt();
--> statement-breakpoint
CREATE FUNCTION check_connected_card_payment() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE attempt record; a record; pub record;
BEGIN
 IF NEW."cardCheckoutId" IS NULL THEN RETURN NULL; END IF;
 SELECT * INTO attempt FROM card_checkout_attempts WHERE id=NEW."cardCheckoutId";
 SELECT * INTO a FROM service_activity WHERE id=NEW."cardActivityId";
 SELECT * INTO pub FROM merchant_guest_publications WHERE id=attempt."publicationId";
 IF a.id IS NULL OR a.direction<>'DEBIT' OR a.status<>'POSTED' OR a."serviceId"<>attempt."cardServiceId" OR a."cardId"<>attempt."cardId" OR a."amountMinor"<>NEW."amountMinor" OR attempt."amountMinor"<>NEW."amountMinor" OR NEW."channelId"<>pub."channelId" OR NEW."merchantUnitId"<>pub."merchantUnitId" OR NEW."serviceId"<>pub."serviceId" OR NEW."createdAt"<>a."occurredAt" THEN RAISE EXCEPTION 'Connected card and merchant payment must match' USING ERRCODE='23514'; END IF;
 IF NOT EXISTS(SELECT 1 FROM ledger_journals WHERE kind='CARD_PURCHASE' AND "referenceId"=a.id AND "creationTransaction"=txid_current()) OR NOT EXISTS(SELECT 1 FROM workspace_command_receipts WHERE "commandId"=attempt."confirmCommandId" AND "resourceId"=a.id AND "actorId"=attempt."payerId" AND "serviceId"=attempt."cardServiceId" AND kind='card.purchase') THEN RAISE EXCEPTION 'Connected payment requires same-transaction card command' USING ERRCODE='23514'; END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER connected_card_payment AFTER INSERT ON merchant_test_payments DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_connected_card_payment();

--> statement-breakpoint
CREATE TRIGGER cardholder_topups_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON cardholder_topups FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();

--> statement-breakpoint
CREATE TRIGGER cardholder_funding_intents_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON cardholder_funding_intents FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();

--> statement-breakpoint
CREATE TRIGGER cardholder_limit_changes_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON cardholder_limit_changes FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();

--> statement-breakpoint
CREATE TRIGGER card_checkout_attempts_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON card_checkout_attempts FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();

--> statement-breakpoint
CREATE TRIGGER merchant_settlements_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON merchant_settlements FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();

--> statement-breakpoint
CREATE TRIGGER merchant_settlement_items_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON merchant_settlement_items FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();

--> statement-breakpoint
CREATE TRIGGER merchant_deposits_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON merchant_deposits FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();

--> statement-breakpoint
CREATE TRIGGER merchant_deposit_events_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON merchant_deposit_events FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();

--> statement-breakpoint
INSERT INTO permission_grants ("serviceId","personId",action,state) SELECT s.id,s."primaryPersonId",a.action,'ACCEPTED' FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" CROSS JOIN (VALUES ('cardholder.funds.read'),('cardholder.funds.add'),('cardholder.limits.manage')) a(action) WHERE s.kind='CARDHOLDER' AND m.state='ACCEPTED' ON CONFLICT DO NOTHING;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION prepaid_refund_bucket(payment_id uuid) RETURNS text LANGUAGE plpgsql AS $$
DECLARE batch uuid;
BEGIN
 SELECT "settlementId" INTO batch FROM merchant_settlement_items WHERE "paymentId"=payment_id;
 IF batch IS NULL THEN RETURN 'MERCHANT_AVAILABLE'; END IF;
 IF EXISTS(SELECT 1 FROM merchant_deposits d LEFT JOIN merchant_deposit_events e ON e."depositId"=d.id WHERE d."settlementId"=batch AND e."depositId" IS NULL) THEN RETURN NULL; END IF;
 IF EXISTS(SELECT 1 FROM merchant_deposits d JOIN merchant_deposit_events e ON e."depositId"=d.id WHERE d."settlementId"=batch AND e.outcome='COMPLETED') THEN RETURN 'PAYOUT_CLEARING'; END IF;
 RETURN 'MERCHANT_SETTLED';
END $$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION check_merchant_operation_provenance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE expected_kind text; debit_bucket text; credit_bucket text; journal_record record; source_record record; line_count bigint; debit_count bigint; credit_count bigint;
BEGIN
  IF TG_TABLE_NAME='merchant_test_payments' THEN
    -- The immutable snapshot cannot lie about one-time usage to evade its unique index.
    SELECT version,usage,description,"amountMinor",currency INTO source_record FROM payment_channels
      WHERE id=NEW."channelId" AND "merchantUnitId"=NEW."merchantUnitId" AND "serviceId"=NEW."serviceId";
    IF NOT FOUND OR ROW(NEW."channelVersion",NEW."channelUsage",NEW.description,NEW."amountMinor",NEW.currency)
       IS DISTINCT FROM ROW(source_record.version,source_record.usage,source_record.description,source_record."amountMinor",source_record.currency) THEN
      RAISE EXCEPTION 'Payment channel snapshot does not match its origin' USING ERRCODE='23514';
    END IF;
    IF NEW.outcome='DECLINED' THEN RETURN NEW; END IF;
    expected_kind:='MERCHANT_PAYMENT'; debit_bucket:='GATEWAY_CLEARING'; credit_bucket:='MERCHANT_AVAILABLE';
  ELSIF TG_TABLE_NAME='merchant_test_refunds' THEN
    SELECT outcome,"amountMinor",currency INTO source_record FROM merchant_test_payments
      WHERE id=NEW."paymentId" AND "merchantUnitId"=NEW."merchantUnitId" AND "serviceId"=NEW."serviceId";
    IF NOT FOUND OR source_record.outcome<>'APPROVED' OR ROW(NEW."amountMinor",NEW.currency) IS DISTINCT FROM ROW(source_record."amountMinor",source_record.currency) THEN
      RAISE EXCEPTION 'Refund must match approved original principal' USING ERRCODE='23514';
    END IF;
    expected_kind:='MERCHANT_REFUND'; debit_bucket:=prepaid_refund_bucket(NEW."paymentId"); IF debit_bucket IS NULL THEN RAISE EXCEPTION 'Processing deposit cannot fund a refund' USING ERRCODE='23514'; END IF; credit_bucket:='GATEWAY_CLEARING';
  ELSE
    expected_kind:='MERCHANT_PAYOUT'; debit_bucket:='MERCHANT_AVAILABLE'; credit_bucket:='PAYOUT_CLEARING';
  END IF;
  SELECT kind,"referenceId",currency,"creationTransaction" INTO journal_record FROM ledger_journals WHERE id=NEW."journalId";
  IF NOT FOUND OR journal_record.kind<>expected_kind OR journal_record."referenceId"<>NEW.id OR journal_record.currency<>NEW.currency OR journal_record."creationTransaction"<>txid_current() THEN
    RAISE EXCEPTION 'Merchant operation must reference its own journal' USING ERRCODE='23514';
  END IF;
  SELECT count(*),
    count(*) FILTER (WHERE "serviceId"=NEW."serviceId" AND "merchantUnitId"=NEW."merchantUnitId" AND "cardId" IS NULL AND bucket=debit_bucket AND "deltaMinor"=-NEW."amountMinor" AND currency=NEW.currency),
    count(*) FILTER (WHERE "serviceId"=NEW."serviceId" AND "merchantUnitId"=NEW."merchantUnitId" AND "cardId" IS NULL AND bucket=credit_bucket AND "deltaMinor"=NEW."amountMinor" AND currency=NEW.currency)
    INTO line_count,debit_count,credit_count FROM ledger_entries WHERE "journalId"=NEW."journalId";
  IF line_count<>2 OR debit_count<>1 OR credit_count<>1 THEN
    RAISE EXCEPTION 'Merchant operation journal does not match scoped principal' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE FUNCTION check_settlement_records() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE b record; d record; total numeric; count_items bigint;
BEGIN
 IF TG_TABLE_NAME='merchant_settlements' THEN
  IF NOT EXISTS(SELECT 1 FROM services WHERE id=NEW."serviceId" AND kind='MERCHANT' AND "primaryPersonId"=NEW."actorId") THEN RAISE EXCEPTION 'Settlement requires primary merchant' USING ERRCODE='23514'; END IF;
  PERFORM assert_prepaid_journal(NEW."journalId",'MERCHANT_SETTLEMENT',NEW.id,NEW."serviceId",NEW."merchantUnitId",NULL,'MERCHANT_AVAILABLE','MERCHANT_SETTLED',NEW."amountMinor",NEW."createdAt");
  SELECT count(*),coalesce(sum("amountMinor"),0) INTO count_items,total FROM merchant_settlement_items WHERE "settlementId"=NEW.id;
  IF count_items=0 OR total<>NEW."amountMinor" THEN RAISE EXCEPTION 'Settlement total must match its exact sales' USING ERRCODE='23514'; END IF;
 ELSIF TG_TABLE_NAME='merchant_settlement_items' THEN
  SELECT * INTO b FROM merchant_settlements WHERE id=NEW."settlementId";
  IF NOT EXISTS(SELECT 1 FROM merchant_test_payments p WHERE p.id=NEW."paymentId" AND p.outcome='APPROVED' AND p."amountMinor"=NEW."amountMinor" AND p."createdAt">=(SELECT "activatedAt" FROM prepaid_cutover WHERE id='D69') AND p."createdAt"<=b."createdAt") OR EXISTS(SELECT 1 FROM merchant_test_refunds WHERE "paymentId"=NEW."paymentId" AND "createdAt"<=b."createdAt") THEN RAISE EXCEPTION 'Settlement item must be eligible original sale' USING ERRCODE='23514'; END IF;
  IF NOT EXISTS(SELECT 1 FROM ledger_journals WHERE id=b."journalId" AND "creationTransaction"=txid_current()) THEN RAISE EXCEPTION 'Settlement membership is fixed in its creation transaction' USING ERRCODE='23514'; END IF;
 ELSIF TG_TABLE_NAME='merchant_deposits' THEN
  SELECT * INTO b FROM merchant_settlements WHERE id=NEW."settlementId";
  IF NEW."reviewToken" IS NULL OR NEW."reviewToken" !~ '^[0-9a-f]{64}$' OR NOT EXISTS(SELECT 1 FROM services WHERE id=NEW."serviceId" AND kind='MERCHANT' AND "primaryPersonId"=NEW."actorId") THEN RAISE EXCEPTION 'Deposit must match primary and batch amount' USING ERRCODE='23514'; END IF;
  IF EXISTS(SELECT 1 FROM merchant_deposits other LEFT JOIN merchant_deposit_events event ON event."depositId"=other.id WHERE other."settlementId"=NEW."settlementId" AND other.id<>NEW.id AND (event.outcome IS NULL OR event.outcome<>'FAILED')) THEN RAISE EXCEPTION 'Batch already reserved or deposited' USING ERRCODE='23514'; END IF;
  SELECT coalesce(sum(i."amountMinor"),0) INTO total FROM merchant_settlement_items i LEFT JOIN merchant_test_refunds r ON r."paymentId"=i."paymentId" WHERE i."settlementId"=NEW."settlementId" AND r.id IS NULL;
  IF total<>NEW."amountMinor" OR total<=0 THEN RAISE EXCEPTION 'Deposit must equal unrefunded original batch principal' USING ERRCODE='23514'; END IF;
  SELECT count(*),coalesce(sum("amountMinor"),0) INTO count_items,total FROM merchant_deposit_items WHERE "depositId"=NEW.id;
  IF count_items=0 OR total<>NEW."amountMinor" THEN RAISE EXCEPTION 'Deposit must have exact immutable included payments' USING ERRCODE='23514'; END IF;
  PERFORM assert_prepaid_journal(NEW."journalId",'DEPOSIT_RESERVE',NEW.id,NEW."serviceId",NEW."merchantUnitId",NULL,'MERCHANT_SETTLED','MERCHANT_PAYOUT_PENDING',NEW."amountMinor",NEW."createdAt");
 ELSE
  SELECT * INTO d FROM merchant_deposits WHERE id=NEW."depositId";
  IF NOT EXISTS(SELECT 1 FROM operator_service_access a JOIN services s ON s.id=a."serviceId" WHERE a."serviceId"=d."serviceId" AND a."personId"=NEW."actorId" AND a.state='ACCEPTED' AND a."canProcessDeposits" AND s.status<>'CLOSED') THEN RAISE EXCEPTION 'Deposit processing requires its explicit assignment' USING ERRCODE='23514'; END IF;
  PERFORM assert_prepaid_journal(NEW."journalId",CASE WHEN NEW.outcome='COMPLETED' THEN 'MERCHANT_PAYOUT' ELSE 'DEPOSIT_RELEASE' END,d.id,d."serviceId",d."merchantUnitId",NULL,'MERCHANT_PAYOUT_PENDING',CASE WHEN NEW.outcome='COMPLETED' THEN 'PAYOUT_CLEARING' ELSE 'MERCHANT_SETTLED' END,d."amountMinor",NEW."createdAt");
 END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER settlement_provenance AFTER INSERT ON merchant_settlements DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_settlement_records();
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER settlement_item_provenance AFTER INSERT ON merchant_settlement_items DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_settlement_records();
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER deposit_provenance AFTER INSERT ON merchant_deposits DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_settlement_records();
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER deposit_event_provenance AFTER INSERT ON merchant_deposit_events DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_settlement_records();
--> statement-breakpoint
CREATE FUNCTION check_settlement_journal_owner() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.kind='MERCHANT_SETTLEMENT' AND NOT EXISTS(SELECT 1 FROM merchant_settlements WHERE id=NEW."referenceId" AND "journalId"=NEW.id) OR NEW.kind='DEPOSIT_RESERVE' AND NOT EXISTS(SELECT 1 FROM merchant_deposits WHERE id=NEW."referenceId" AND "journalId"=NEW.id) OR NEW.kind='DEPOSIT_RELEASE' AND NOT EXISTS(SELECT 1 FROM merchant_deposit_events WHERE "depositId"=NEW."referenceId" AND "journalId"=NEW.id AND outcome='FAILED') OR NEW.kind='MERCHANT_PAYOUT' AND NOT EXISTS(SELECT 1 FROM merchant_deposit_events WHERE "depositId"=NEW."referenceId" AND "journalId"=NEW.id AND outcome='COMPLETED') THEN RAISE EXCEPTION 'Settlement journal requires its typed business record' USING ERRCODE='23514'; END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER settlement_journal_owner AFTER INSERT ON ledger_journals DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_settlement_journal_owner();
--> statement-breakpoint
CREATE FUNCTION check_connected_refund() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE p record; batch uuid;
BEGIN
 SELECT * INTO p FROM merchant_test_payments WHERE id=NEW."paymentId";
 SELECT "settlementId" INTO batch FROM merchant_settlement_items WHERE "paymentId"=p.id;
 IF batch IS NOT NULL AND EXISTS(SELECT 1 FROM merchant_deposits d LEFT JOIN merchant_deposit_events e ON e."depositId"=d.id WHERE d."settlementId"=batch AND e.outcome IS NULL) THEN RAISE EXCEPTION 'Processing deposit cannot fund a refund' USING ERRCODE='23514'; END IF;
 IF p."cardCheckoutId" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM ledger_journals WHERE kind='CARD_REFUND' AND "referenceId"=NEW.id AND "creationTransaction"=txid_current()) THEN RAISE EXCEPTION 'Merchant refund must return money to original card group atomically' USING ERRCODE='23514'; END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER connected_refund_return AFTER INSERT ON merchant_test_refunds DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_connected_refund();

--> statement-breakpoint
CREATE OR REPLACE FUNCTION guard_deposit_item() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE d record;
BEGIN
 SELECT * INTO d FROM merchant_deposits WHERE id=NEW."depositId";
 IF NOT FOUND OR NOT EXISTS(SELECT 1 FROM ledger_journals WHERE id=d."journalId" AND "creationTransaction"=txid_current()) OR NOT EXISTS(SELECT 1 FROM merchant_settlement_items i WHERE i."settlementId"=d."settlementId" AND i."paymentId"=NEW."paymentId" AND i."amountMinor"=NEW."amountMinor") OR EXISTS(SELECT 1 FROM merchant_test_refunds WHERE "paymentId"=NEW."paymentId") THEN RAISE EXCEPTION 'Deposit item must match an unrefunded original sale in its creation transaction' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER deposit_item_provenance BEFORE INSERT ON merchant_deposit_items FOR EACH ROW EXECUTE FUNCTION guard_deposit_item();
--> statement-breakpoint
CREATE TRIGGER deposit_items_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON merchant_deposit_items FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();

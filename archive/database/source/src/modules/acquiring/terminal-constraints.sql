-- Run after flat terminals, new terminal access tables and money account tables exist.
CREATE OR REPLACE FUNCTION guard_merchant_identity() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP IN ('DELETE','TRUNCATE') THEN RAISE EXCEPTION 'Merchant provenance cannot be removed' USING ERRCODE='23514'; END IF;
 IF TG_TABLE_NAME='merchant_terminals' THEN
  IF ROW(NEW.id,NEW."masterServiceId",NEW."masterServiceKind",NEW."createdAt") IS DISTINCT FROM ROW(OLD.id,OLD."masterServiceId",OLD."masterServiceKind",OLD."createdAt") THEN RAISE EXCEPTION 'Terminal identity is immutable' USING ERRCODE='23514'; END IF;
 ELSIF TG_TABLE_NAME='payment_channels' THEN
  IF ROW(NEW.id,NEW."serviceId",NEW."merchantUnitId",NEW."creatorId",NEW."creatorAssignmentId",NEW."creatorBasis",NEW."createdAt") IS DISTINCT FROM ROW(OLD.id,OLD."serviceId",OLD."merchantUnitId",OLD."creatorId",OLD."creatorAssignmentId",OLD."creatorBasis",OLD."createdAt") THEN RAISE EXCEPTION 'Channel origin is immutable' USING ERRCODE='23514'; END IF;
 ELSE
  -- Old assignments are retained as immutable provenance, never new active grants.
  RAISE EXCEPTION 'Historical merchant access cannot change' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;
CREATE OR REPLACE FUNCTION check_channel_creator() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW."creatorBasis"='TERMINAL_ASSIGNMENT' THEN
  IF NOT EXISTS(SELECT 1 FROM terminal_assignments a JOIN merchant_terminals t ON t.id=a."terminalId" JOIN services s ON s.id=t."masterServiceId" JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE a.id=NEW."creatorAssignmentId" AND a."terminalId"=NEW."merchantUnitId" AND t."masterServiceId"=NEW."serviceId" AND a."personId"=NEW."creatorId" AND a.state='ACCEPTED' AND (a."expiresAt" IS NULL OR a."expiresAt">clock_timestamp()) AND a."grantedByPersonId"=s."primaryPersonId" AND a."ownerMembershipVersion"=m.version AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Channel creator needs accepted access to this terminal' USING ERRCODE='23514'; END IF;
 ELSIF NEW."creatorBasis"='OWNER_MEMBER' THEN
  IF NOT EXISTS(SELECT 1 FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE s.id=NEW."serviceId" AND s.kind='MERCHANT' AND s."primaryPersonId"=NEW."creatorId" AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Channel owner does not match Merchant service' USING ERRCODE='23514'; END IF;
 ELSE RAISE EXCEPTION 'Historical channel authority cannot create new channels' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;

CREATE FUNCTION assert_merchant_money_journal(jid uuid,expected_kind text,ref uuid,svc uuid,terminal_id uuid,debit text,credit text,amount numeric,at_time timestamptz) RETURNS void LANGUAGE plpgsql AS $$
DECLARE account_id uuid; n integer; debits integer; credits integer;
BEGIN
 SELECT "moneyAccountId" INTO account_id FROM money_account_services WHERE "serviceId"=svc AND "serviceKind"='MERCHANT';
 IF account_id IS NULL THEN RAISE EXCEPTION 'Merchant money account is required' USING ERRCODE='23514'; END IF;
 IF NOT EXISTS(SELECT 1 FROM ledger_journals WHERE id=jid AND kind=expected_kind AND "referenceId"=ref AND currency='USD' AND "creationTransaction"=txid_current() AND "createdAt"=at_time) THEN RAISE EXCEPTION 'Merchant journal must match its saved business effect' USING ERRCODE='23514'; END IF;
 SELECT count(*),count(*) FILTER(WHERE bucket=debit AND "deltaMinor"=-amount AND currency='USD' AND "cardId" IS NULL AND ((debit='MONEY_AVAILABLE' AND "moneyAccountId"=account_id AND "serviceId" IS NULL AND "merchantUnitId" IS NULL) OR (debit<>'MONEY_AVAILABLE' AND "moneyAccountId" IS NULL AND "serviceId"=svc AND "merchantUnitId"=terminal_id))),count(*) FILTER(WHERE bucket=credit AND "deltaMinor"=amount AND currency='USD' AND "cardId" IS NULL AND ((credit='MONEY_AVAILABLE' AND "moneyAccountId"=account_id AND "serviceId" IS NULL AND "merchantUnitId" IS NULL) OR (credit<>'MONEY_AVAILABLE' AND "moneyAccountId" IS NULL AND "serviceId"=svc AND "merchantUnitId"=terminal_id))) INTO n,debits,credits FROM ledger_entries WHERE "journalId"=jid;
 IF n<>2 OR debits<>1 OR credits<>1 OR amount<=0 THEN RAISE EXCEPTION 'Merchant effect must match exact terminal attribution and its money account' USING ERRCODE='23514'; END IF;
END $$;
CREATE OR REPLACE FUNCTION prepaid_refund_bucket(payment_id uuid) RETURNS text LANGUAGE plpgsql AS $$
DECLARE batch uuid;
BEGIN
 SELECT "settlementId" INTO batch FROM merchant_settlement_items WHERE "paymentId"=payment_id;
 IF batch IS NULL THEN RETURN 'MERCHANT_AVAILABLE'; END IF;
 IF EXISTS(SELECT 1 FROM merchant_settlements WHERE id=batch AND "moneyAccountId" IS NOT NULL) OR EXISTS(SELECT 1 FROM merchant_settlement_credits WHERE "settlementId"=batch) THEN RETURN 'MONEY_AVAILABLE'; END IF;
 IF EXISTS(SELECT 1 FROM merchant_deposits d LEFT JOIN merchant_deposit_events e ON e."depositId"=d.id WHERE d."settlementId"=batch AND e."depositId" IS NULL) THEN RETURN NULL; END IF;
 IF EXISTS(SELECT 1 FROM merchant_deposits d JOIN merchant_deposit_events e ON e."depositId"=d.id WHERE d."settlementId"=batch AND e.outcome='COMPLETED') THEN RETURN 'MONEY_AVAILABLE'; END IF;
 RETURN 'MERCHANT_SETTLED';
END $$;
CREATE OR REPLACE FUNCTION check_merchant_operation_provenance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE source_record record;debit_bucket text;
BEGIN
 IF TG_TABLE_NAME='merchant_test_payments' THEN
  SELECT version,usage,description,"amountMinor",currency INTO source_record FROM payment_channels WHERE id=NEW."channelId" AND "merchantUnitId"=NEW."merchantUnitId" AND "serviceId"=NEW."serviceId";
  IF NOT FOUND OR ROW(NEW."channelVersion",NEW."channelUsage",NEW.description,NEW."amountMinor",NEW.currency) IS DISTINCT FROM ROW(source_record.version,source_record.usage,source_record.description,source_record."amountMinor",source_record.currency) THEN RAISE EXCEPTION 'Payment must match immutable channel snapshot' USING ERRCODE='23514'; END IF;
  IF NEW.outcome='DECLINED' THEN RETURN NEW; END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",'MERCHANT_PAYMENT',NEW.id,NEW."serviceId",NEW."merchantUnitId",'GATEWAY_CLEARING','MERCHANT_AVAILABLE',NEW."amountMinor",NEW."createdAt");
 ELSIF TG_TABLE_NAME='merchant_test_refunds' THEN
  SELECT outcome,"amountMinor",currency INTO source_record FROM merchant_test_payments WHERE id=NEW."paymentId" AND "merchantUnitId"=NEW."merchantUnitId" AND "serviceId"=NEW."serviceId";
  IF NOT FOUND OR source_record.outcome<>'APPROVED' OR ROW(NEW."amountMinor",NEW.currency) IS DISTINCT FROM ROW(source_record."amountMinor",source_record.currency) THEN RAISE EXCEPTION 'Refund must match original payment principal' USING ERRCODE='23514'; END IF;
  IF NOT EXISTS(SELECT 1 FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE s.id=NEW."serviceId" AND s.kind='MERCHANT' AND s."primaryPersonId"=NEW."actorId" AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Only the account owner may refund' USING ERRCODE='23514'; END IF;
  debit_bucket:=prepaid_refund_bucket(NEW."paymentId");IF debit_bucket IS NULL THEN RAISE EXCEPTION 'Pending deposit prevents this refund' USING ERRCODE='23514'; END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",'MERCHANT_REFUND',NEW.id,NEW."serviceId",NEW."merchantUnitId",debit_bucket,'GATEWAY_CLEARING',NEW."amountMinor",NEW."createdAt");
 ELSE RAISE EXCEPTION 'Terminal payout creation has been retired' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION check_settlement_records() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE b record;d record;total numeric;count_items bigint;account_id uuid;
BEGIN
 IF TG_TABLE_NAME='merchant_settlements' THEN
  SELECT "moneyAccountId" INTO account_id FROM money_account_services WHERE "serviceId"=NEW."serviceId" AND "serviceKind"='MERCHANT';
  IF NEW."moneyAccountId" IS DISTINCT FROM account_id OR account_id IS NULL OR NOT EXISTS(SELECT 1 FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE s.id=NEW."serviceId" AND s.kind='MERCHANT' AND s."primaryPersonId"=NEW."actorId" AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Settlement needs the merchant owner and its own money account' USING ERRCODE='23514'; END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",'MERCHANT_SETTLEMENT',NEW.id,NEW."serviceId",NEW."merchantUnitId",'MERCHANT_AVAILABLE','MONEY_AVAILABLE',NEW."amountMinor",NEW."createdAt");
  SELECT count(*),coalesce(sum("amountMinor"),0) INTO count_items,total FROM merchant_settlement_items WHERE "settlementId"=NEW.id;
  IF count_items=0 OR total<>NEW."amountMinor" THEN RAISE EXCEPTION 'Settlement total must match exact sales' USING ERRCODE='23514'; END IF;
 ELSIF TG_TABLE_NAME='merchant_settlement_items' THEN
  SELECT * INTO b FROM merchant_settlements WHERE id=NEW."settlementId";
  IF NOT EXISTS(SELECT 1 FROM merchant_test_payments p WHERE p.id=NEW."paymentId" AND p.outcome='APPROVED' AND p."amountMinor"=NEW."amountMinor" AND p."createdAt">=(SELECT "activatedAt" FROM prepaid_cutover WHERE id='D69') AND p."createdAt"<=b."createdAt") OR EXISTS(SELECT 1 FROM merchant_test_refunds WHERE "paymentId"=NEW."paymentId" AND "createdAt"<=b."createdAt") THEN RAISE EXCEPTION 'Settlement item must be an eligible original sale' USING ERRCODE='23514'; END IF;
  IF NOT EXISTS(SELECT 1 FROM ledger_journals WHERE id=b."journalId" AND "creationTransaction"=txid_current()) THEN RAISE EXCEPTION 'Settlement membership must be fixed atomically' USING ERRCODE='23514'; END IF;
 ELSIF TG_TABLE_NAME='merchant_deposits' THEN
  RAISE EXCEPTION 'Use merchant money withdrawal instead of a new terminal deposit' USING ERRCODE='23514';
 ELSE
  SELECT * INTO d FROM merchant_deposits WHERE id=NEW."depositId";
  IF NOT EXISTS(SELECT 1 FROM operator_service_access a JOIN services s ON s.id=a."serviceId" WHERE a."serviceId"=d."serviceId" AND a."personId"=NEW."actorId" AND a.state='ACCEPTED' AND a."canProcessDeposits" AND s.status<>'CLOSED') THEN RAISE EXCEPTION 'Deposit processing needs its explicit assignment' USING ERRCODE='23514'; END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",CASE WHEN NEW.outcome='COMPLETED' THEN 'MERCHANT_PAYOUT' ELSE 'DEPOSIT_RELEASE' END,d.id,d."serviceId",d."merchantUnitId",'MERCHANT_PAYOUT_PENDING',CASE WHEN NEW.outcome='COMPLETED' THEN 'MONEY_AVAILABLE' ELSE 'MERCHANT_SETTLED' END,d."amountMinor",NEW."createdAt");
 END IF;
 RETURN NULL;
END $$;
CREATE FUNCTION check_settlement_credit() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE amount numeric;account_id uuid;b record;
BEGIN
 SELECT * INTO b FROM merchant_settlements WHERE id=NEW."settlementId";
 SELECT "moneyAccountId" INTO account_id FROM money_account_services WHERE "serviceId"=NEW."serviceId" AND "serviceKind"='MERCHANT';
 IF b."moneyAccountId" IS NOT NULL OR NEW."moneyAccountId" IS DISTINCT FROM account_id OR account_id IS NULL OR NOT EXISTS(SELECT 1 FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE s.id=NEW."serviceId" AND s."primaryPersonId"=NEW."actorId" AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Historical settlement credit needs owner and correct merchant account' USING ERRCODE='23514'; END IF;
 IF NOT EXISTS(SELECT 1 FROM merchant_deposits WHERE "settlementId"=b.id) OR EXISTS(SELECT 1 FROM merchant_deposits d LEFT JOIN merchant_deposit_events e ON e."depositId"=d.id WHERE d."settlementId"=b.id AND (e.outcome IS NULL OR e.outcome<>'FAILED')) THEN RAISE EXCEPTION 'Only returned batches can be credited' USING ERRCODE='23514'; END IF;
 SELECT coalesce(sum(i."amountMinor"),0) INTO amount FROM merchant_settlement_items i LEFT JOIN merchant_test_refunds r ON r."paymentId"=i."paymentId" WHERE i."settlementId"=b.id AND r.id IS NULL;
 IF amount<=0 OR amount<>NEW."amountMinor" THEN RAISE EXCEPTION 'Credit must match remaining original batch principal' USING ERRCODE='23514'; END IF;
 PERFORM assert_merchant_money_journal(NEW."journalId",'MERCHANT_SETTLEMENT',NEW.id,NEW."serviceId",NEW."merchantUnitId",'MERCHANT_SETTLED','MONEY_AVAILABLE',amount,NEW."createdAt");RETURN NEW;
END $$;
CREATE TRIGGER settlement_credit_provenance BEFORE INSERT ON merchant_settlement_credits FOR EACH ROW EXECUTE FUNCTION check_settlement_credit();
CREATE TRIGGER settlement_credits_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON merchant_settlement_credits FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
CREATE OR REPLACE FUNCTION check_settlement_journal_owner() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.kind='MERCHANT_SETTLEMENT' AND NOT EXISTS(SELECT 1 FROM merchant_settlements WHERE id=NEW."referenceId" AND "journalId"=NEW.id) AND NOT EXISTS(SELECT 1 FROM merchant_settlement_credits WHERE id=NEW."referenceId" AND "journalId"=NEW.id) OR NEW.kind='DEPOSIT_RESERVE' AND NOT EXISTS(SELECT 1 FROM merchant_deposits WHERE id=NEW."referenceId" AND "journalId"=NEW.id) OR NEW.kind='DEPOSIT_RELEASE' AND NOT EXISTS(SELECT 1 FROM merchant_deposit_events WHERE "depositId"=NEW."referenceId" AND "journalId"=NEW.id AND outcome='FAILED') OR NEW.kind='MERCHANT_PAYOUT' AND NOT EXISTS(SELECT 1 FROM merchant_deposit_events WHERE "depositId"=NEW."referenceId" AND "journalId"=NEW.id AND outcome='COMPLETED') THEN RAISE EXCEPTION 'Settlement journal needs its typed business record' USING ERRCODE='23514'; END IF;
 RETURN NULL;
END $$;

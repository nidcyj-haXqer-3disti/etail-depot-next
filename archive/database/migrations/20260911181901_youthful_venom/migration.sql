CREATE TABLE "merchant_deposit_items" (
	"depositId" uuid,
	"paymentId" uuid,
	"amountMinor" bigint NOT NULL,
	CONSTRAINT "merchant_deposit_items_pkey" PRIMARY KEY("depositId","paymentId"),
	CONSTRAINT "deposit_item_amount" CHECK ("amountMinor">0)
);
--> statement-breakpoint
ALTER TABLE "merchant_deposits" ADD COLUMN "reviewToken" text;--> statement-breakpoint
ALTER TABLE "merchant_deposit_items" ADD CONSTRAINT "merchant_deposit_items_depositId_merchant_deposits_id_fkey" FOREIGN KEY ("depositId") REFERENCES "merchant_deposits"("id");--> statement-breakpoint
ALTER TABLE "merchant_deposit_items" ADD CONSTRAINT "merchant_deposit_items_paymentId_merchant_test_payments_id_fkey" FOREIGN KEY ("paymentId") REFERENCES "merchant_test_payments"("id");
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
CREATE OR REPLACE FUNCTION check_settlement_records() RETURNS trigger LANGUAGE plpgsql AS $$
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
CREATE OR REPLACE FUNCTION check_connected_refund() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE p record; batch uuid;
BEGIN
 SELECT * INTO p FROM merchant_test_payments WHERE id=NEW."paymentId";
 SELECT "settlementId" INTO batch FROM merchant_settlement_items WHERE "paymentId"=p.id;
 IF batch IS NOT NULL AND EXISTS(SELECT 1 FROM merchant_deposits d LEFT JOIN merchant_deposit_events e ON e."depositId"=d.id WHERE d."settlementId"=batch AND e.outcome IS NULL) THEN RAISE EXCEPTION 'Processing deposit cannot fund a refund' USING ERRCODE='23514'; END IF;
 IF p."cardCheckoutId" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM ledger_journals WHERE kind='CARD_REFUND' AND "referenceId"=NEW.id AND "creationTransaction"=txid_current()) THEN RAISE EXCEPTION 'Merchant refund must return money to original card group atomically' USING ERRCODE='23514'; END IF;
 RETURN NULL;
END $$;
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

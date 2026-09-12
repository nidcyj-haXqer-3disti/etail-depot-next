-- D76: a separate sandbox card-network source; historical receipts and journals stay unchanged.
CREATE TABLE network_payment_operations (
 id uuid PRIMARY KEY,"guestSessionId" uuid NOT NULL REFERENCES merchant_guest_sessions(id),"publicationId" uuid NOT NULL REFERENCES merchant_guest_publications(id),"serviceId" uuid NOT NULL,"terminalId" uuid NOT NULL,"channelId" uuid NOT NULL,"channelVersion" integer NOT NULL,"channelUsage" text NOT NULL,"gatewayVersion" integer NOT NULL,"enrollmentVersion" integer NOT NULL,
 provider text NOT NULL,mode text NOT NULL,"providerAccount" text NOT NULL,"instrumentId" text NOT NULL,"amountMinor" bigint NOT NULL,"feeMinor" bigint NOT NULL,currency text NOT NULL,"requestDigest" text NOT NULL,description text NOT NULL,"merchantName" text NOT NULL,"businessName" text NOT NULL,"createdAt" timestamptz NOT NULL,
 FOREIGN KEY("channelId","terminalId","serviceId") REFERENCES payment_channels(id,"merchantUnitId","serviceId"),
 CONSTRAINT network_payment_fields CHECK(provider='ETAIL_SANDBOX_NETWORK' AND mode='SANDBOX' AND "providerAccount"='sandbox:'||"serviceId"::text AND "instrumentId" IN ('visa','mastercard','amex','discover') AND "amountMinor">0 AND "amountMinor"<=999999999999 AND "feeMinor"=0 AND currency='USD' AND "requestDigest" ~ '^[0-9a-f]{64}$' AND "channelVersion">0 AND "gatewayVersion">0 AND "enrollmentVersion">0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX network_one_time_reservation ON network_payment_operations("channelId") WHERE "channelUsage"='ONE_TIME';
--> statement-breakpoint
CREATE TABLE network_refund_operations (
 id uuid PRIMARY KEY,"paymentOperationId" uuid NOT NULL REFERENCES network_payment_operations(id),"actorId" uuid NOT NULL REFERENCES people(id),"serviceId" uuid NOT NULL,"terminalId" uuid NOT NULL,
 provider text NOT NULL,mode text NOT NULL,"providerAccount" text NOT NULL,"providerPaymentId" text NOT NULL,"amountMinor" bigint NOT NULL,"feeMinor" bigint NOT NULL,currency text NOT NULL,"sourceBucket" text NOT NULL,reason text NOT NULL,"requestDigest" text NOT NULL,"reservationJournalId" uuid NOT NULL UNIQUE REFERENCES ledger_journals(id),"createdAt" timestamptz NOT NULL,
 FOREIGN KEY("terminalId","serviceId") REFERENCES merchant_terminals(id,"masterServiceId"),
 CONSTRAINT network_refund_fields CHECK(provider='ETAIL_SANDBOX_NETWORK' AND mode='SANDBOX' AND "providerAccount"='sandbox:'||"serviceId"::text AND "amountMinor">0 AND "feeMinor"=0 AND currency='USD' AND "sourceBucket" IN ('MERCHANT_AVAILABLE','MERCHANT_SETTLED','MONEY_AVAILABLE') AND char_length(reason) BETWEEN 1 AND 300 AND "requestDigest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE network_events(id text PRIMARY KEY,"operationId" uuid NOT NULL,kind text NOT NULL,type text NOT NULL,payload jsonb NOT NULL,digest text NOT NULL,"receivedAt" timestamptz NOT NULL,CONSTRAINT network_event_fields CHECK(digest ~ '^[0-9a-f]{64}$' AND ((kind='PAYMENT' AND type IN ('CAPTURED','FUNDS_AVAILABLE')) OR (kind='REFUND' AND type IN ('REFUND_SUCCEEDED','REFUND_FAILED')))));
--> statement-breakpoint
CREATE UNIQUE INDEX network_one_event_type ON network_events("operationId",type);
--> statement-breakpoint
CREATE TABLE network_event_effects("eventId" text PRIMARY KEY REFERENCES network_events(id),"journalId" uuid NOT NULL UNIQUE REFERENCES ledger_journals(id),"createdAt" timestamptz NOT NULL);
--> statement-breakpoint
ALTER TABLE merchant_test_payments ADD COLUMN "networkOperationId" uuid UNIQUE REFERENCES network_payment_operations(id);
--> statement-breakpoint
ALTER TABLE merchant_test_payments ADD COLUMN source text GENERATED ALWAYS AS (CASE WHEN "networkOperationId" IS NOT NULL THEN 'NETWORK' WHEN "cardCheckoutId" IS NOT NULL THEN 'ETAIL_CARD' ELSE 'HISTORICAL' END) STORED;
--> statement-breakpoint
ALTER TABLE merchant_test_refunds ADD COLUMN "networkRefundOperationId" uuid UNIQUE REFERENCES network_refund_operations(id);
--> statement-breakpoint
ALTER TABLE merchant_test_payments DROP CONSTRAINT merchant_payment_actor_origin;
--> statement-breakpoint
ALTER TABLE merchant_test_payments ADD CONSTRAINT merchant_payment_actor_origin CHECK(num_nonnulls("actorId","guestOrderId","cardCheckoutId","networkOperationId")=1 AND (("cardCheckoutId" IS NULL AND "cardActivityId" IS NULL) OR ("cardCheckoutId" IS NOT NULL AND "cardActivityId" IS NOT NULL AND outcome='APPROVED')));
--> statement-breakpoint
ALTER TABLE ledger_journals DROP CONSTRAINT ledger_journal_kind;
--> statement-breakpoint
ALTER TABLE ledger_journals ADD CONSTRAINT ledger_journal_kind CHECK(kind IN ('GROUP_FUNDING','CARD_FUNDING','CARD_PURCHASE','CARD_REFUND','MERCHANT_PAYMENT','MERCHANT_REFUND','MERCHANT_PAYOUT','MERCHANT_SETTLEMENT','DEPOSIT_RESERVE','DEPOSIT_RELEASE','MONEY_FUNDING','MONEY_WITHDRAWAL_RESERVE','MONEY_WITHDRAWAL_COMPLETE','MONEY_WITHDRAWAL_RELEASE','MONEY_CUTOVER','NETWORK_CAPTURE','NETWORK_AVAILABLE','NETWORK_REFUND_RESERVE','NETWORK_REFUND_COMPLETE','NETWORK_REFUND_RELEASE'));
--> statement-breakpoint
ALTER TABLE ledger_entries DROP CONSTRAINT ledger_entry_resource_shape;
--> statement-breakpoint
ALTER TABLE ledger_entries ADD CONSTRAINT ledger_entry_resource_shape CHECK(("moneyAccountId" IS NOT NULL AND "serviceId" IS NULL AND "cardId" IS NULL AND "merchantUnitId" IS NULL AND bucket IN ('MONEY_SOURCE','MONEY_AVAILABLE','MONEY_WITHDRAWAL_PENDING','MONEY_WITHDRAWN')) OR ("moneyAccountId" IS NULL AND "serviceId" IS NOT NULL AND ((bucket IN ('PRACTICE_SOURCE','GROUP_AVAILABLE') AND "cardId" IS NULL AND "merchantUnitId" IS NULL) OR (bucket IN ('CARD_AVAILABLE','CARD_SPENT') AND "cardId" IS NOT NULL AND "merchantUnitId" IS NULL) OR (bucket IN ('GATEWAY_CLEARING','MERCHANT_AVAILABLE','MERCHANT_SETTLED','MERCHANT_PAYOUT_PENDING','PAYOUT_CLEARING','MERCHANT_CAPTURE_PENDING','MERCHANT_REFUND_PENDING') AND "cardId" IS NULL AND "merchantUnitId" IS NOT NULL))));
--> statement-breakpoint
CREATE FUNCTION check_network_operation() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE p record;original record;
BEGIN
 IF TG_TABLE_NAME='network_payment_operations' THEN
  SELECT * INTO p FROM merchant_guest_publications WHERE id=NEW."publicationId";
  IF NOT FOUND OR ROW(NEW."serviceId",NEW."terminalId",NEW."channelId",NEW."channelVersion",NEW."channelUsage",NEW.description,NEW."merchantName",NEW."businessName",NEW."amountMinor",NEW.currency,NEW."gatewayVersion",NEW."enrollmentVersion") IS DISTINCT FROM ROW(p."serviceId",p."merchantUnitId",p."channelId",p."channelVersion",p.usage,p.description,p."merchantName",p."primaryMerchantName",p."amountMinor",p.currency,p."gatewayVersion",p."enrollmentVersion") OR p."revokedAt" IS NOT NULL OR p."expiresAt"<=NEW."createdAt" OR NOT EXISTS(SELECT 1 FROM merchant_guest_sessions WHERE id=NEW."guestSessionId" AND "expiresAt">NEW."createdAt") THEN RAISE EXCEPTION 'Network payment requires exact current published offer and guest session' USING ERRCODE='23514'; END IF;
  IF NEW."channelUsage"='ONE_TIME' AND EXISTS(SELECT 1 FROM merchant_test_payments WHERE "channelId"=NEW."channelId" AND outcome='APPROVED') THEN RAISE EXCEPTION 'Payment request already paid' USING ERRCODE='23514';END IF;
 ELSE
  SELECT * INTO p FROM network_payment_operations WHERE id=NEW."paymentOperationId";
  SELECT * INTO original FROM merchant_test_payments WHERE "networkOperationId"=p.id AND outcome='APPROVED';
  IF NOT FOUND OR ROW(NEW."serviceId",NEW."terminalId",NEW.provider,NEW.mode,NEW."providerAccount",NEW."amountMinor",NEW.currency,NEW."providerPaymentId") IS DISTINCT FROM ROW(p."serviceId",p."terminalId",p.provider,p.mode,p."providerAccount",p."amountMinor",p.currency,'SANDBOX-PAY-'||p.id::text) OR NEW."sourceBucket" IS DISTINCT FROM prepaid_refund_bucket(original.id) OR EXISTS(SELECT 1 FROM merchant_test_refunds WHERE "paymentId"=original.id) THEN RAISE EXCEPTION 'Refund must match the original network payment' USING ERRCODE='23514';END IF;
  IF NOT EXISTS(SELECT 1 FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE s.id=NEW."serviceId" AND s."primaryPersonId"=NEW."actorId" AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Only the merchant owner may reserve a refund' USING ERRCODE='23514';END IF;
  IF EXISTS(SELECT 1 FROM network_refund_operations r WHERE r."paymentOperationId"=p.id AND NOT EXISTS(SELECT 1 FROM network_events e JOIN network_event_effects f ON f."eventId"=e.id WHERE e."operationId"=r.id AND e.type='REFUND_FAILED')) THEN RAISE EXCEPTION 'Refund is already processing or complete' USING ERRCODE='23514';END IF;
  PERFORM assert_merchant_money_journal(NEW."reservationJournalId",'NETWORK_REFUND_RESERVE',NEW.id,NEW."serviceId",NEW."terminalId",NEW."sourceBucket",'MERCHANT_REFUND_PENDING',NEW."amountMinor",NEW."createdAt");
 END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER network_payment_origin BEFORE INSERT ON network_payment_operations FOR EACH ROW EXECUTE FUNCTION check_network_operation();
--> statement-breakpoint
CREATE TRIGGER network_refund_origin BEFORE INSERT ON network_refund_operations FOR EACH ROW EXECUTE FUNCTION check_network_operation();
--> statement-breakpoint
CREATE FUNCTION check_network_event() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE o record;provider_payment text;
BEGIN
 IF NEW.kind='PAYMENT' THEN SELECT * INTO o FROM network_payment_operations WHERE id=NEW."operationId";provider_payment:='SANDBOX-PAY-'||NEW."operationId"::text;
 ELSE SELECT * INTO o FROM network_refund_operations WHERE id=NEW."operationId";provider_payment:=o."providerPaymentId";END IF;
 IF o.id IS NULL OR NEW.id<>'ETAIL_SANDBOX_NETWORK:'||NEW."operationId"::text||':'||NEW.type OR NEW.payload->>'eventId' IS DISTINCT FROM NEW.id OR NEW.payload->>'operationId' IS DISTINCT FROM NEW."operationId"::text OR NEW.payload->>'kind' IS DISTINCT FROM NEW.kind OR NEW.payload->>'type' IS DISTINCT FROM NEW.type OR NEW.payload->>'provider' IS DISTINCT FROM o.provider OR NEW.payload->>'mode' IS DISTINCT FROM o.mode OR NEW.payload->>'providerAccount' IS DISTINCT FROM o."providerAccount" OR NEW.payload->>'providerPaymentId' IS DISTINCT FROM provider_payment OR NEW.payload->>'amountMinor' IS DISTINCT FROM o."amountMinor"::text OR NEW.payload->>'feeMinor' IS DISTINCT FROM '0' OR NEW.payload->>'currency' IS DISTINCT FROM o.currency OR NEW.payload->>'serviceId' IS DISTINCT FROM o."serviceId"::text OR NEW.payload->>'terminalId' IS DISTINCT FROM o."terminalId"::text THEN RAISE EXCEPTION 'Provider event binding does not match its immutable instruction' USING ERRCODE='23514';END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER network_event_origin BEFORE INSERT ON network_events FOR EACH ROW EXECUTE FUNCTION check_network_event();
--> statement-breakpoint
CREATE FUNCTION check_network_effect() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE e record;o record;debit text;credit text;expected_kind text;
BEGIN
 SELECT * INTO e FROM network_events WHERE id=NEW."eventId";
 IF e.kind='PAYMENT' THEN
  SELECT * INTO o FROM network_payment_operations WHERE id=e."operationId";
  IF e.type='CAPTURED' THEN expected_kind:='NETWORK_CAPTURE';debit:='GATEWAY_CLEARING';credit:='MERCHANT_CAPTURE_PENDING';
  ELSE expected_kind:='NETWORK_AVAILABLE';debit:='MERCHANT_CAPTURE_PENDING';credit:='MERCHANT_AVAILABLE';
   IF NOT EXISTS(SELECT 1 FROM network_events c JOIN network_event_effects f ON f."eventId"=c.id WHERE c."operationId"=o.id AND c.type='CAPTURED') OR NOT EXISTS(SELECT 1 FROM merchant_test_payments WHERE "networkOperationId"=o.id AND "journalId"=NEW."journalId") THEN RAISE EXCEPTION 'Availability needs capture and canonical payment' USING ERRCODE='23514';END IF;
  END IF;
 ELSE
  SELECT * INTO o FROM network_refund_operations WHERE id=e."operationId";
  debit:='MERCHANT_REFUND_PENDING';expected_kind:=CASE WHEN e.type='REFUND_SUCCEEDED' THEN 'NETWORK_REFUND_COMPLETE' ELSE 'NETWORK_REFUND_RELEASE' END;credit:=CASE WHEN e.type='REFUND_SUCCEEDED' THEN 'GATEWAY_CLEARING' ELSE o."sourceBucket" END;
  IF EXISTS(SELECT 1 FROM network_events x JOIN network_event_effects f ON f."eventId"=x.id WHERE x."operationId"=o.id AND x.type<>e.type) THEN RAISE EXCEPTION 'Refund result is final' USING ERRCODE='23514';END IF;
  IF e.type='REFUND_SUCCEEDED' AND NOT EXISTS(SELECT 1 FROM merchant_test_refunds WHERE "networkRefundOperationId"=o.id AND "journalId"=NEW."journalId") THEN RAISE EXCEPTION 'Refund success needs its canonical receipt' USING ERRCODE='23514';END IF;
 END IF;
 PERFORM assert_merchant_money_journal(NEW."journalId",expected_kind,o.id,o."serviceId",o."terminalId",debit,credit,o."amountMinor",NEW."createdAt");RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER network_effect_provenance AFTER INSERT ON network_event_effects DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_network_effect();
--> statement-breakpoint
CREATE FUNCTION check_network_journal() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.kind='NETWORK_REFUND_RESERVE' THEN
  IF NOT EXISTS(SELECT 1 FROM network_refund_operations WHERE id=NEW."referenceId" AND "reservationJournalId"=NEW.id) THEN RAISE EXCEPTION 'Refund reservation needs its owner instruction' USING ERRCODE='23514';END IF;
 ELSIF NEW.kind IN ('NETWORK_CAPTURE','NETWORK_AVAILABLE','NETWORK_REFUND_COMPLETE','NETWORK_REFUND_RELEASE') AND NOT EXISTS(SELECT 1 FROM network_event_effects f JOIN network_events e ON e.id=f."eventId" WHERE f."journalId"=NEW.id AND e."operationId"=NEW."referenceId") THEN RAISE EXCEPTION 'Network journal needs its verified event effect' USING ERRCODE='23514';END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER network_journal_provenance AFTER INSERT ON ledger_journals DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_network_journal();
--> statement-breakpoint
DO $$ DECLARE table_name text;BEGIN
 FOREACH table_name IN ARRAY ARRAY['network_payment_operations','network_refund_operations','network_events','network_event_effects'] LOOP
  EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE OR DELETE OR TRUNCATE ON %I FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history()',table_name||'_immutable',table_name);
 END LOOP;
END $$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION check_ledger_available_balance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE total numeric;
BEGIN
 IF NEW.bucket IN ('GROUP_AVAILABLE','CARD_AVAILABLE','MERCHANT_AVAILABLE','MERCHANT_SETTLED','MERCHANT_CAPTURE_PENDING','MERCHANT_REFUND_PENDING','MERCHANT_PAYOUT_PENDING','PAYOUT_CLEARING','MONEY_AVAILABLE','MONEY_WITHDRAWAL_PENDING','MONEY_WITHDRAWN') THEN
  SELECT coalesce(sum("deltaMinor"),0) INTO total FROM ledger_entries WHERE "serviceId" IS NOT DISTINCT FROM NEW."serviceId" AND "moneyAccountId" IS NOT DISTINCT FROM NEW."moneyAccountId" AND bucket=NEW.bucket AND "cardId" IS NOT DISTINCT FROM NEW."cardId" AND "merchantUnitId" IS NOT DISTINCT FROM NEW."merchantUnitId";
  IF total<0 THEN RAISE EXCEPTION 'Available money cannot be negative' USING ERRCODE='23514';END IF;
 END IF;
 IF NEW.bucket IN ('GROUP_AVAILABLE','PRACTICE_SOURCE') AND NOT EXISTS(SELECT 1 FROM services WHERE id=NEW."serviceId" AND kind='CARDHOLDER') THEN RAISE EXCEPTION 'Historical group money requires Cardholder scope' USING ERRCODE='23514';END IF;
 RETURN NULL;
END $$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION check_money_journal_effect() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.kind='MONEY_FUNDING' AND NOT EXISTS(SELECT 1 FROM money_topups WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Funding journal requires its unique receipt' USING ERRCODE='23514';END IF;
 IF NEW.kind='MONEY_WITHDRAWAL_RESERVE' AND NOT EXISTS(SELECT 1 FROM money_withdrawals WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Withdrawal reservation requires its exact saved request' USING ERRCODE='23514';END IF;
 IF NEW.kind IN ('MONEY_WITHDRAWAL_COMPLETE','MONEY_WITHDRAWAL_RELEASE') AND NOT EXISTS(SELECT 1 FROM money_withdrawal_events WHERE "withdrawalId"=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Withdrawal journal requires its operator outcome' USING ERRCODE='23514';END IF;
 IF NEW.kind='MONEY_CUTOVER' AND NOT EXISTS(SELECT 1 FROM money_cutover_transfers WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Opening balance requires its migration receipt' USING ERRCODE='23514';END IF;
 IF NEW.kind='MERCHANT_REFUND' AND EXISTS(SELECT 1 FROM ledger_entries WHERE "journalId"=NEW.id AND "moneyAccountId" IS NOT NULL) AND NOT EXISTS(SELECT 1 FROM merchant_test_refunds WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Merchant money refund requires its exact refund record' USING ERRCODE='23514';END IF;
 IF EXISTS(SELECT 1 FROM ledger_entries WHERE "journalId"=NEW.id AND "moneyAccountId" IS NOT NULL) AND NEW.kind NOT IN ('MONEY_FUNDING','MONEY_WITHDRAWAL_RESERVE','MONEY_WITHDRAWAL_COMPLETE','MONEY_WITHDRAWAL_RELEASE','MONEY_CUTOVER','CARD_PURCHASE','CARD_REFUND','MERCHANT_SETTLEMENT','MERCHANT_REFUND','MERCHANT_PAYOUT','DEPOSIT_RELEASE','NETWORK_REFUND_RESERVE','NETWORK_REFUND_RELEASE') THEN RAISE EXCEPTION 'Journal kind cannot move money account funds' USING ERRCODE='23514';END IF;
 RETURN NULL;
END $$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION check_merchant_operation_provenance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE source_record record;debit_bucket text;
BEGIN
 IF TG_TABLE_NAME='merchant_test_payments' AND NEW."networkOperationId" IS NOT NULL THEN
  SELECT * INTO source_record FROM network_payment_operations WHERE id=NEW."networkOperationId";
  IF NEW.id IS DISTINCT FROM source_record.id OR ROW(NEW."serviceId",NEW."merchantUnitId",NEW."channelId",NEW."channelVersion",NEW."channelUsage",NEW.description,NEW."amountMinor",NEW.currency,NEW."gatewayVersion",NEW."enrollmentVersion",NEW.outcome) IS DISTINCT FROM ROW(source_record."serviceId",source_record."terminalId",source_record."channelId",source_record."channelVersion",source_record."channelUsage",source_record.description,source_record."amountMinor",source_record.currency,source_record."gatewayVersion",source_record."enrollmentVersion",'APPROVED'::text) OR NOT EXISTS(SELECT 1 FROM network_events WHERE "operationId"=source_record.id AND type='FUNDS_AVAILABLE') THEN RAISE EXCEPTION 'Network payment needs its exact verified availability event' USING ERRCODE='23514';END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",'NETWORK_AVAILABLE',NEW.id,NEW."serviceId",NEW."merchantUnitId",'MERCHANT_CAPTURE_PENDING','MERCHANT_AVAILABLE',NEW."amountMinor",NEW."createdAt");RETURN NEW;
 ELSIF TG_TABLE_NAME='merchant_test_refunds' AND NEW."networkRefundOperationId" IS NOT NULL THEN
  SELECT * INTO source_record FROM network_refund_operations WHERE id=NEW."networkRefundOperationId";
  IF NEW.id IS DISTINCT FROM source_record.id OR ROW(NEW."paymentId",NEW."serviceId",NEW."merchantUnitId",NEW."actorId",NEW."amountMinor",NEW.currency,NEW.reason) IS DISTINCT FROM ROW(source_record."paymentOperationId",source_record."serviceId",source_record."terminalId",source_record."actorId",source_record."amountMinor",source_record.currency,source_record.reason) OR NOT EXISTS(SELECT 1 FROM network_events WHERE "operationId"=source_record.id AND type='REFUND_SUCCEEDED') THEN RAISE EXCEPTION 'Network refund needs its exact provider result' USING ERRCODE='23514';END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",'NETWORK_REFUND_COMPLETE',NEW.id,NEW."serviceId",NEW."merchantUnitId",'MERCHANT_REFUND_PENDING','GATEWAY_CLEARING',NEW."amountMinor",NEW."createdAt");RETURN NEW;
 ELSIF TG_TABLE_NAME='merchant_test_payments' THEN
  IF NEW."channelUsage"='ONE_TIME' AND EXISTS(SELECT 1 FROM network_payment_operations WHERE "channelId"=NEW."channelId") THEN RAISE EXCEPTION 'Payment request is reserved by a network payment' USING ERRCODE='23514';END IF;
  SELECT version,usage,description,"amountMinor",currency INTO source_record FROM payment_channels WHERE id=NEW."channelId" AND "merchantUnitId"=NEW."merchantUnitId" AND "serviceId"=NEW."serviceId";
  IF NOT FOUND OR ROW(NEW."channelVersion",NEW."channelUsage",NEW.description,NEW."amountMinor",NEW.currency) IS DISTINCT FROM ROW(source_record.version,source_record.usage,source_record.description,source_record."amountMinor",source_record.currency) THEN RAISE EXCEPTION 'Payment must match immutable channel snapshot' USING ERRCODE='23514'; END IF;
  IF NEW.outcome='DECLINED' THEN RETURN NEW; END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",'MERCHANT_PAYMENT',NEW.id,NEW."serviceId",NEW."merchantUnitId",'GATEWAY_CLEARING','MERCHANT_AVAILABLE',NEW."amountMinor",NEW."createdAt");
 ELSIF TG_TABLE_NAME='merchant_test_refunds' THEN
  IF EXISTS(SELECT 1 FROM merchant_test_payments WHERE id=NEW."paymentId" AND "networkOperationId" IS NOT NULL) THEN RAISE EXCEPTION 'Network payments refund through their original provider' USING ERRCODE='23514';END IF;
  SELECT outcome,"amountMinor",currency INTO source_record FROM merchant_test_payments WHERE id=NEW."paymentId" AND "merchantUnitId"=NEW."merchantUnitId" AND "serviceId"=NEW."serviceId";
  IF NOT FOUND OR source_record.outcome<>'APPROVED' OR ROW(NEW."amountMinor",NEW.currency) IS DISTINCT FROM ROW(source_record."amountMinor",source_record.currency) THEN RAISE EXCEPTION 'Refund must match original payment principal' USING ERRCODE='23514'; END IF;
  IF NOT EXISTS(SELECT 1 FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE s.id=NEW."serviceId" AND s.kind='MERCHANT' AND s."primaryPersonId"=NEW."actorId" AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Only the account owner may refund' USING ERRCODE='23514'; END IF;
  debit_bucket:=prepaid_refund_bucket(NEW."paymentId");IF debit_bucket IS NULL THEN RAISE EXCEPTION 'Pending deposit prevents this refund' USING ERRCODE='23514'; END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",'MERCHANT_REFUND',NEW.id,NEW."serviceId",NEW."merchantUnitId",debit_bucket,'GATEWAY_CLEARING',NEW."amountMinor",NEW."createdAt");
 ELSE RAISE EXCEPTION 'Terminal payout creation has been retired' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION guard_card_checkout_attempt() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM cards WHERE id=NEW."cardId" AND "serviceId"=NEW."cardServiceId" AND "holderId"=NEW."payerId" AND "assignmentState"='ACCEPTED') OR NOT EXISTS(SELECT 1 FROM merchant_guest_publications WHERE id=NEW."publicationId" AND "amountMinor"=NEW."amountMinor") THEN RAISE EXCEPTION 'Checkout must belong to accepted cardholder and published amount' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE FUNCTION check_network_settlement_item() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM network_refund_operations r WHERE r."paymentOperationId"=NEW."paymentId" AND NOT EXISTS(SELECT 1 FROM network_events e JOIN network_event_effects f ON f."eventId"=e.id WHERE e."operationId"=r.id AND e.type='REFUND_FAILED')) THEN RAISE EXCEPTION 'Payments with a refund in progress cannot be settled' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER network_settlement_refund_reservation BEFORE INSERT ON merchant_settlement_items FOR EACH ROW EXECUTE FUNCTION check_network_settlement_item();

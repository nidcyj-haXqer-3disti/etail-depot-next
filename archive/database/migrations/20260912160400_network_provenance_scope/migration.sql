-- Resolve typed NEW fields only inside the matching table branch.
CREATE OR REPLACE FUNCTION check_merchant_operation_provenance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE source_record record;debit_bucket text;
BEGIN
 IF TG_TABLE_NAME='merchant_test_payments' THEN
  IF NEW."networkOperationId" IS NOT NULL THEN
  SELECT * INTO source_record FROM network_payment_operations WHERE id=NEW."networkOperationId";
  IF NEW.id IS DISTINCT FROM source_record.id OR ROW(NEW."serviceId",NEW."merchantUnitId",NEW."channelId",NEW."channelVersion",NEW."channelUsage",NEW.description,NEW."amountMinor",NEW.currency,NEW."gatewayVersion",NEW."enrollmentVersion",NEW.outcome) IS DISTINCT FROM ROW(source_record."serviceId",source_record."terminalId",source_record."channelId",source_record."channelVersion",source_record."channelUsage",source_record.description,source_record."amountMinor",source_record.currency,source_record."gatewayVersion",source_record."enrollmentVersion",'APPROVED'::text) OR NOT EXISTS(SELECT 1 FROM network_events WHERE "operationId"=source_record.id AND type='FUNDS_AVAILABLE') THEN RAISE EXCEPTION 'Network payment needs its exact verified availability event' USING ERRCODE='23514';END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",'NETWORK_AVAILABLE',NEW.id,NEW."serviceId",NEW."merchantUnitId",'MERCHANT_CAPTURE_PENDING','MERCHANT_AVAILABLE',NEW."amountMinor",NEW."createdAt");RETURN NEW;
  END IF;
  IF NEW."channelUsage"='ONE_TIME' AND EXISTS(SELECT 1 FROM network_payment_operations WHERE "channelId"=NEW."channelId") THEN RAISE EXCEPTION 'Payment request is reserved by a network payment' USING ERRCODE='23514';END IF;
  SELECT version,usage,description,"amountMinor",currency INTO source_record FROM payment_channels WHERE id=NEW."channelId" AND "merchantUnitId"=NEW."merchantUnitId" AND "serviceId"=NEW."serviceId";
  IF NOT FOUND OR ROW(NEW."channelVersion",NEW."channelUsage",NEW.description,NEW."amountMinor",NEW.currency) IS DISTINCT FROM ROW(source_record.version,source_record.usage,source_record.description,source_record."amountMinor",source_record.currency) THEN RAISE EXCEPTION 'Payment must match immutable channel snapshot' USING ERRCODE='23514'; END IF;
  IF NEW.outcome='DECLINED' THEN RETURN NEW; END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",'MERCHANT_PAYMENT',NEW.id,NEW."serviceId",NEW."merchantUnitId",'GATEWAY_CLEARING','MERCHANT_AVAILABLE',NEW."amountMinor",NEW."createdAt");
 ELSIF TG_TABLE_NAME='merchant_test_refunds' THEN
  IF NEW."networkRefundOperationId" IS NOT NULL THEN
  SELECT * INTO source_record FROM network_refund_operations WHERE id=NEW."networkRefundOperationId";
  IF NEW.id IS DISTINCT FROM source_record.id OR ROW(NEW."paymentId",NEW."serviceId",NEW."merchantUnitId",NEW."actorId",NEW."amountMinor",NEW.currency,NEW.reason) IS DISTINCT FROM ROW(source_record."paymentOperationId",source_record."serviceId",source_record."terminalId",source_record."actorId",source_record."amountMinor",source_record.currency,source_record.reason) OR NOT EXISTS(SELECT 1 FROM network_events WHERE "operationId"=source_record.id AND type='REFUND_SUCCEEDED') THEN RAISE EXCEPTION 'Network refund needs its exact provider result' USING ERRCODE='23514';END IF;
  PERFORM assert_merchant_money_journal(NEW."journalId",'NETWORK_REFUND_COMPLETE',NEW.id,NEW."serviceId",NEW."merchantUnitId",'MERCHANT_REFUND_PENDING','GATEWAY_CLEARING',NEW."amountMinor",NEW."createdAt");RETURN NEW;
  END IF;
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

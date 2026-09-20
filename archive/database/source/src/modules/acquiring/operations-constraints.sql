-- Append after the operation tables and ledger constraints in the same new migration.
CREATE FUNCTION guard_merchant_operation_history() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Merchant operation history is immutable' USING ERRCODE='23514';
END $$;
--> statement-breakpoint
CREATE TRIGGER merchant_test_payment_immutable BEFORE UPDATE OR DELETE ON merchant_test_payments
FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER merchant_test_payment_no_truncate BEFORE TRUNCATE ON merchant_test_payments
FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER merchant_test_refund_immutable BEFORE UPDATE OR DELETE ON merchant_test_refunds
FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER merchant_test_refund_no_truncate BEFORE TRUNCATE ON merchant_test_refunds
FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER merchant_test_payout_immutable BEFORE UPDATE OR DELETE ON merchant_test_payouts
FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER merchant_test_payout_no_truncate BEFORE TRUNCATE ON merchant_test_payouts
FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER merchant_operation_command_immutable BEFORE UPDATE OR DELETE ON merchant_operation_commands
FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER merchant_operation_command_no_truncate BEFORE TRUNCATE ON merchant_operation_commands
FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE FUNCTION guard_merchant_operation_configuration() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP <> 'UPDATE' THEN
    RAISE EXCEPTION 'Merchant configuration cannot be removed or reset' USING ERRCODE='23514';
  END IF;
  IF TG_TABLE_NAME='merchant_test_gateways' THEN
    IF ROW(NEW."serviceId",NEW.processor,NEW."createdAt") IS DISTINCT FROM ROW(OLD."serviceId",OLD.processor,OLD."createdAt") THEN
      RAISE EXCEPTION 'Gateway identity is immutable' USING ERRCODE='23514';
    END IF;
  ELSIF TG_TABLE_NAME='merchant_test_enrollments' THEN
    IF ROW(NEW."merchantUnitId",NEW."serviceId",NEW."createdAt") IS DISTINCT FROM ROW(OLD."merchantUnitId",OLD."serviceId",OLD."createdAt") THEN
      RAISE EXCEPTION 'Merchant enrollment identity is immutable' USING ERRCODE='23514';
    END IF;
  ELSE
    IF ROW(NEW."channelId",NEW."merchantUnitId",NEW."serviceId",NEW."createdAt") IS DISTINCT FROM ROW(OLD."channelId",OLD."merchantUnitId",OLD."serviceId",OLD."createdAt") THEN
      RAISE EXCEPTION 'Channel activation identity is immutable' USING ERRCODE='23514';
    END IF;
  END IF;
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER merchant_test_gateway_identity BEFORE UPDATE OR DELETE ON merchant_test_gateways
FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_configuration();
--> statement-breakpoint
CREATE TRIGGER merchant_test_gateway_no_truncate BEFORE TRUNCATE ON merchant_test_gateways
FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_configuration();
--> statement-breakpoint
CREATE TRIGGER merchant_test_enrollment_identity BEFORE UPDATE OR DELETE ON merchant_test_enrollments
FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_configuration();
--> statement-breakpoint
CREATE TRIGGER merchant_test_enrollment_no_truncate BEFORE TRUNCATE ON merchant_test_enrollments
FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_configuration();
--> statement-breakpoint
CREATE TRIGGER merchant_channel_activation_identity BEFORE UPDATE OR DELETE ON merchant_channel_activations
FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_configuration();
--> statement-breakpoint
CREATE TRIGGER merchant_channel_activation_no_truncate BEFORE TRUNCATE ON merchant_channel_activations
FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_configuration();
--> statement-breakpoint
CREATE FUNCTION check_merchant_operation_provenance() RETURNS trigger LANGUAGE plpgsql AS $$
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
    expected_kind:='MERCHANT_REFUND'; debit_bucket:='MERCHANT_AVAILABLE'; credit_bucket:='GATEWAY_CLEARING';
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
CREATE TRIGGER merchant_test_payment_provenance BEFORE INSERT ON merchant_test_payments
FOR EACH ROW EXECUTE FUNCTION check_merchant_operation_provenance();
--> statement-breakpoint
CREATE TRIGGER merchant_test_refund_provenance BEFORE INSERT ON merchant_test_refunds
FOR EACH ROW EXECUTE FUNCTION check_merchant_operation_provenance();
--> statement-breakpoint
CREATE TRIGGER merchant_test_payout_provenance BEFORE INSERT ON merchant_test_payouts
FOR EACH ROW EXECUTE FUNCTION check_merchant_operation_provenance();

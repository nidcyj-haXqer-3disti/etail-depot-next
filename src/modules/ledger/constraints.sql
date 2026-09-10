-- Append after the generated ledger tables in the same new migration.
-- A journal and all its entries are created together, balanced at commit and immutable.
CREATE FUNCTION guard_ledger_journal() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP <> 'INSERT' THEN
    RAISE EXCEPTION 'Posted ledger journals are immutable' USING ERRCODE='23514';
  END IF;
  IF NEW."creationTransaction" <> txid_current() THEN
    RAISE EXCEPTION 'Ledger journal transaction is invalid' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER ledger_journal_immutable BEFORE INSERT OR UPDATE OR DELETE ON ledger_journals
FOR EACH ROW EXECUTE FUNCTION guard_ledger_journal();
--> statement-breakpoint
CREATE TRIGGER ledger_journal_no_truncate BEFORE TRUNCATE ON ledger_journals
FOR EACH STATEMENT EXECUTE FUNCTION guard_ledger_journal();
--> statement-breakpoint
CREATE FUNCTION guard_ledger_entry() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE journal_transaction bigint;
BEGIN
  IF TG_OP <> 'INSERT' THEN
    RAISE EXCEPTION 'Posted ledger entries are immutable' USING ERRCODE='23514';
  END IF;
  SELECT "creationTransaction" INTO journal_transaction FROM ledger_journals WHERE id=NEW."journalId";
  IF journal_transaction IS NULL OR journal_transaction <> txid_current() THEN
    RAISE EXCEPTION 'Entries must be inserted with their new journal' USING ERRCODE='23514';
  END IF;
  -- Direct SQL and service posting contend on the identical position identity.
  PERFORM pg_advisory_xact_lock(hashtextextended('ledger-position:' || NEW."serviceId"::text || ':' || NEW.bucket || ':' || coalesce(NEW."cardId"::text,'') || ':' || coalesce(NEW."merchantUnitId"::text,''),0));
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER ledger_entry_immutable BEFORE INSERT OR UPDATE OR DELETE ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION guard_ledger_entry();
--> statement-breakpoint
CREATE TRIGGER ledger_entry_no_truncate BEFORE TRUNCATE ON ledger_entries
FOR EACH STATEMENT EXECUTE FUNCTION guard_ledger_entry();
--> statement-breakpoint
CREATE FUNCTION check_ledger_journal_balance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE line_count bigint; total numeric;
BEGIN
  SELECT count(*),coalesce(sum("deltaMinor"),0) INTO line_count,total FROM ledger_entries WHERE "journalId"=NEW.id;
  IF line_count < 2 OR line_count > 64 OR total <> 0 THEN
    RAISE EXCEPTION 'Ledger journal must have 2 to 64 balanced USD entries' USING ERRCODE='23514';
  END IF;
  RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER ledger_journal_balanced AFTER INSERT ON ledger_journals
DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_ledger_journal_balance();
--> statement-breakpoint
CREATE FUNCTION check_ledger_available_balance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE total numeric;
BEGIN
  IF NEW.bucket IN ('CARD_AVAILABLE','MERCHANT_AVAILABLE') THEN
    SELECT coalesce(sum("deltaMinor"),0) INTO total FROM ledger_entries
      WHERE "serviceId"=NEW."serviceId" AND bucket=NEW.bucket
        AND "cardId" IS NOT DISTINCT FROM NEW."cardId"
        AND "merchantUnitId" IS NOT DISTINCT FROM NEW."merchantUnitId";
    IF total < 0 THEN
      RAISE EXCEPTION 'Ledger available funds cannot be negative' USING ERRCODE='23514';
    END IF;
  END IF;
  RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER ledger_available_nonnegative AFTER INSERT ON ledger_entries
DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_ledger_available_balance();

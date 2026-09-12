-- D73 foundation fragment. Run after generated money tables and ledger shape changes.
-- Card and Merchant services keep distinct money accounts even when their owner matches.
CREATE FUNCTION guard_money_account_identity() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP IN ('DELETE','TRUNCATE') THEN RAISE EXCEPTION 'Money ownership and service links are immutable' USING ERRCODE='23514';END IF;
 IF TG_TABLE_NAME='money_accounts' THEN
  IF ROW(NEW.id,NEW."ownerPersonId",NEW."serviceKind",NEW.currency,NEW."createdAt") IS DISTINCT FROM ROW(OLD.id,OLD."ownerPersonId",OLD."serviceKind",OLD.currency,OLD."createdAt") OR NEW.version<>OLD.version+1 THEN RAISE EXCEPTION 'Money account identity and version are invalid' USING ERRCODE='23514';END IF;
 ELSE RAISE EXCEPTION 'Money service link is immutable' USING ERRCODE='23514';END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER money_account_identity BEFORE UPDATE OR DELETE ON money_accounts FOR EACH ROW EXECUTE FUNCTION guard_money_account_identity();
--> statement-breakpoint
CREATE TRIGGER money_account_no_truncate BEFORE TRUNCATE ON money_accounts FOR EACH STATEMENT EXECUTE FUNCTION guard_money_account_identity();
--> statement-breakpoint
CREATE TRIGGER money_service_identity BEFORE UPDATE OR DELETE ON money_account_services FOR EACH ROW EXECUTE FUNCTION guard_money_account_identity();
--> statement-breakpoint
CREATE TRIGGER money_service_no_truncate BEFORE TRUNCATE ON money_account_services FOR EACH STATEMENT EXECUTE FUNCTION guard_money_account_identity();
--> statement-breakpoint
CREATE FUNCTION check_money_service_owner() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM money_accounts a JOIN services s ON s.id=NEW."serviceId" WHERE a.id=NEW."moneyAccountId" AND a."ownerPersonId"=s."primaryPersonId" AND a."serviceKind"=s.kind AND NEW."serviceKind"=s.kind) THEN RAISE EXCEPTION 'Money service owner and purpose must match' USING ERRCODE='23514';END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER money_service_owner BEFORE INSERT ON money_account_services FOR EACH ROW EXECUTE FUNCTION check_money_service_owner();
--> statement-breakpoint
CREATE OR REPLACE FUNCTION guard_ledger_entry() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE journal_transaction bigint;position_key text;account_id uuid;
BEGIN
 IF TG_OP<>'INSERT' THEN RAISE EXCEPTION 'Posted ledger entries are immutable' USING ERRCODE='23514';END IF;
 SELECT "creationTransaction" INTO journal_transaction FROM ledger_journals WHERE id=NEW."journalId";
 IF journal_transaction IS NULL OR journal_transaction<>txid_current() THEN RAISE EXCEPTION 'Entries must be inserted with their new journal' USING ERRCODE='23514';END IF;
 account_id:=NEW."moneyAccountId";
 IF account_id IS NULL THEN SELECT "moneyAccountId" INTO account_id FROM money_account_services WHERE "serviceId"=NEW."serviceId";END IF;
 IF account_id IS NOT NULL THEN PERFORM pg_advisory_xact_lock(hashtextextended('money-account:'||account_id::text,0));END IF;
 IF NEW."moneyAccountId" IS NOT NULL THEN
  position_key:='money:'||NEW."moneyAccountId"::text||':'||NEW.bucket;
 ELSE position_key:=NEW."serviceId"::text||':'||NEW.bucket||':'||coalesce(NEW."cardId"::text,'')||':'||coalesce(NEW."merchantUnitId"::text,'');END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('ledger-position:'||position_key,0));
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION check_ledger_available_balance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE total numeric;
BEGIN
 IF NEW.bucket IN ('GROUP_AVAILABLE','CARD_AVAILABLE','MERCHANT_AVAILABLE','MERCHANT_SETTLED','MERCHANT_PAYOUT_PENDING','PAYOUT_CLEARING','MONEY_AVAILABLE','MONEY_WITHDRAWAL_PENDING','MONEY_WITHDRAWN') THEN
  SELECT coalesce(sum("deltaMinor"),0) INTO total FROM ledger_entries WHERE "serviceId" IS NOT DISTINCT FROM NEW."serviceId" AND "moneyAccountId" IS NOT DISTINCT FROM NEW."moneyAccountId" AND bucket=NEW.bucket AND "cardId" IS NOT DISTINCT FROM NEW."cardId" AND "merchantUnitId" IS NOT DISTINCT FROM NEW."merchantUnitId";
  IF total<0 THEN RAISE EXCEPTION 'Available money cannot be negative' USING ERRCODE='23514';END IF;
 END IF;
 IF NEW.bucket IN ('GROUP_AVAILABLE','PRACTICE_SOURCE') AND NOT EXISTS(SELECT 1 FROM services WHERE id=NEW."serviceId" AND kind='CARDHOLDER') THEN RAISE EXCEPTION 'Historical group money requires Cardholder scope' USING ERRCODE='23514';END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE FUNCTION assert_money_journal(jid uuid,expected_kind text,ref uuid,account_id uuid,debit text,credit text,amount numeric,at_time timestamptz) RETURNS void LANGUAGE plpgsql AS $$
DECLARE j record;total bigint;debits bigint;credits bigint;
BEGIN
 SELECT * INTO j FROM ledger_journals WHERE id=jid;
 IF NOT FOUND OR j.kind<>expected_kind OR j."referenceId"<>ref OR j.currency<>'USD' OR j."creationTransaction"<>txid_current() OR j."createdAt"<>at_time THEN RAISE EXCEPTION 'Money record must own its exact journal' USING ERRCODE='23514';END IF;
 SELECT count(*),count(*) FILTER(WHERE "moneyAccountId"=account_id AND "serviceId" IS NULL AND "cardId" IS NULL AND "merchantUnitId" IS NULL AND bucket=debit AND "deltaMinor"=-amount),count(*) FILTER(WHERE "moneyAccountId"=account_id AND "serviceId" IS NULL AND "cardId" IS NULL AND "merchantUnitId" IS NULL AND bucket=credit AND "deltaMinor"=amount) INTO total,debits,credits FROM ledger_entries WHERE "journalId"=jid;
 IF total<>2 OR debits<>1 OR credits<>1 THEN RAISE EXCEPTION 'Money journal must match account, amount and effect' USING ERRCODE='23514';END IF;
END $$;
--> statement-breakpoint
CREATE FUNCTION guard_money_owner_record() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE intent record;
BEGIN
 PERFORM a.id FROM money_accounts a JOIN money_account_services m ON m."moneyAccountId"=a.id JOIN services s ON s.id=m."serviceId" JOIN service_members owner_member ON owner_member."serviceId"=s.id AND owner_member."personId"=a."ownerPersonId" WHERE a.id=NEW."moneyAccountId" AND a."ownerPersonId"=NEW."actorId" AND a.status='ACTIVE' AND s.status NOT IN ('SUSPENDED','CLOSED') AND owner_member.state='ACCEPTED' FOR SHARE OF a,s,owner_member;
 IF NOT FOUND THEN RAISE EXCEPTION 'Only an active account owner with current service access may initiate funds movement' USING ERRCODE='23514';END IF;
 IF TG_TABLE_NAME='money_topups' THEN
  PERFORM assert_money_journal(NEW."journalId",'MONEY_FUNDING',NEW.id,NEW."moneyAccountId",'MONEY_SOURCE','MONEY_AVAILABLE',NEW."amountMinor",NEW."createdAt");
 ELSIF TG_TABLE_NAME='money_withdrawals' THEN
  SELECT * INTO intent FROM money_withdrawal_intents WHERE id=NEW."intentId";
  IF NOT FOUND OR intent."moneyAccountId"<>NEW."moneyAccountId" OR intent."actorId"<>NEW."actorId" OR intent."amountMinor"<>NEW."amountMinor" OR intent."confirmCommandId"<>NEW."commandId" THEN RAISE EXCEPTION 'Withdrawal must use its saved exact review' USING ERRCODE='23514';END IF;
  PERFORM assert_money_journal(NEW."journalId",'MONEY_WITHDRAWAL_RESERVE',NEW.id,NEW."moneyAccountId",'MONEY_AVAILABLE','MONEY_WITHDRAWAL_PENDING',NEW."amountMinor",NEW."createdAt");
 END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER money_funding_owner BEFORE INSERT ON money_funding_intents FOR EACH ROW EXECUTE FUNCTION guard_money_owner_record();
--> statement-breakpoint
CREATE TRIGGER money_topup_owner BEFORE INSERT ON money_topups FOR EACH ROW EXECUTE FUNCTION guard_money_owner_record();
--> statement-breakpoint
CREATE TRIGGER money_withdrawal_review_owner BEFORE INSERT ON money_withdrawal_intents FOR EACH ROW EXECUTE FUNCTION guard_money_owner_record();
--> statement-breakpoint
CREATE TRIGGER money_withdrawal_owner BEFORE INSERT ON money_withdrawals FOR EACH ROW EXECUTE FUNCTION guard_money_owner_record();
--> statement-breakpoint
CREATE FUNCTION guard_money_withdrawal_event() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE withdrawal record;
BEGIN
 SELECT * INTO withdrawal FROM money_withdrawals WHERE id=NEW."withdrawalId";
 IF NOT FOUND OR NOT EXISTS(SELECT 1 FROM operator_service_access o JOIN money_account_services m ON m."serviceId"=o."serviceId" JOIN services s ON s.id=o."serviceId" WHERE m."moneyAccountId"=withdrawal."moneyAccountId" AND o."personId"=NEW."actorId" AND o.state='ACCEPTED' AND o."canProcessDeposits" AND s.status<>'CLOSED') THEN RAISE EXCEPTION 'Withdrawal processing requires an explicit processing assignment' USING ERRCODE='23514';END IF;
 PERFORM assert_money_journal(NEW."journalId",CASE WHEN NEW.outcome='COMPLETED' THEN 'MONEY_WITHDRAWAL_COMPLETE' ELSE 'MONEY_WITHDRAWAL_RELEASE' END,NEW."withdrawalId",withdrawal."moneyAccountId",'MONEY_WITHDRAWAL_PENDING',CASE WHEN NEW.outcome='COMPLETED' THEN 'MONEY_WITHDRAWN' ELSE 'MONEY_AVAILABLE' END,withdrawal."amountMinor",NEW."createdAt");
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER money_withdrawal_event_origin BEFORE INSERT ON money_withdrawal_events FOR EACH ROW EXECUTE FUNCTION guard_money_withdrawal_event();
--> statement-breakpoint
CREATE FUNCTION check_money_journal_effect() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.kind='MONEY_FUNDING' AND NOT EXISTS(SELECT 1 FROM money_topups WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Funding journal requires its unique receipt' USING ERRCODE='23514';END IF;
 IF NEW.kind='MONEY_WITHDRAWAL_RESERVE' AND NOT EXISTS(SELECT 1 FROM money_withdrawals WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Withdrawal reservation requires its exact saved request' USING ERRCODE='23514';END IF;
 IF NEW.kind IN ('MONEY_WITHDRAWAL_COMPLETE','MONEY_WITHDRAWAL_RELEASE') AND NOT EXISTS(SELECT 1 FROM money_withdrawal_events WHERE "withdrawalId"=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Withdrawal journal requires its operator outcome' USING ERRCODE='23514';END IF;
 IF NEW.kind='MONEY_CUTOVER' AND NOT EXISTS(SELECT 1 FROM money_cutover_transfers WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Opening balance requires its migration receipt' USING ERRCODE='23514';END IF;
 IF NEW.kind='MERCHANT_REFUND' AND EXISTS(SELECT 1 FROM ledger_entries WHERE "journalId"=NEW.id AND "moneyAccountId" IS NOT NULL) AND NOT EXISTS(SELECT 1 FROM merchant_test_refunds WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Merchant money refund requires its exact refund record' USING ERRCODE='23514';END IF;
 IF EXISTS(SELECT 1 FROM ledger_entries WHERE "journalId"=NEW.id AND "moneyAccountId" IS NOT NULL) AND NEW.kind NOT IN ('MONEY_FUNDING','MONEY_WITHDRAWAL_RESERVE','MONEY_WITHDRAWAL_COMPLETE','MONEY_WITHDRAWAL_RELEASE','MONEY_CUTOVER','CARD_PURCHASE','CARD_REFUND','MERCHANT_SETTLEMENT','MERCHANT_REFUND','MERCHANT_PAYOUT','DEPOSIT_RELEASE') THEN RAISE EXCEPTION 'Journal kind cannot move money account funds' USING ERRCODE='23514';END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER money_journal_provenance AFTER INSERT ON ledger_journals DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_money_journal_effect();
--> statement-breakpoint
DO $$ DECLARE table_name text;BEGIN
 FOREACH table_name IN ARRAY ARRAY['money_commands','money_funding_intents','money_topups','money_withdrawal_intents','money_withdrawals','money_withdrawal_events','money_cutover_transfers'] LOOP
  EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_history()',table_name||'_immutable',table_name);
  EXECUTE format('CREATE TRIGGER %I BEFORE TRUNCATE ON %I FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history()',table_name||'_no_truncate',table_name);
 END LOOP;
END $$;
--> statement-breakpoint
-- Separate purpose-bound account for EVERY existing service. Same-owner pools never merge.
DO $$ DECLARE svc record;account_id uuid;BEGIN
 FOR svc IN SELECT * FROM services ORDER BY id LOOP
  IF EXISTS(SELECT 1 FROM money_account_services WHERE "serviceId"=svc.id) THEN CONTINUE;END IF;
  account_id:=gen_random_uuid();
  INSERT INTO money_accounts(id,"ownerPersonId","displayName","serviceKind",currency,status,version,"createdAt") VALUES(account_id,svc."primaryPersonId",svc."displayName",svc.kind,'USD',CASE WHEN svc.status='CLOSED' THEN 'CLOSED' WHEN svc.status='SUSPENDED' THEN 'SUSPENDED' ELSE 'ACTIVE' END,1,svc."createdAt");
  INSERT INTO money_account_services("serviceId","moneyAccountId","serviceKind") VALUES(svc.id,account_id,svc.kind);
 END LOOP;
END $$;
--> statement-breakpoint
CREATE TABLE money_model_cutover(id text PRIMARY KEY CHECK(id='D73'),"creationTransaction" bigint NOT NULL DEFAULT txid_current(),"activatedAt" timestamptz NOT NULL DEFAULT clock_timestamp());
--> statement-breakpoint
INSERT INTO money_model_cutover(id) VALUES('D73');
--> statement-breakpoint
CREATE TRIGGER money_model_cutover_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON money_model_cutover FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE UNIQUE INDEX money_cutover_source_once ON money_cutover_transfers("sourceServiceId","sourceBucket",coalesce("sourceMerchantUnitId",'00000000-0000-0000-0000-000000000000'::uuid));
--> statement-breakpoint
CREATE FUNCTION guard_money_cutover_transfer() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE j record;total bigint;debits bigint;credits bigint;
BEGIN
 IF NOT EXISTS(SELECT 1 FROM money_model_cutover WHERE id='D73' AND "creationTransaction"=txid_current()) OR NOT EXISTS(SELECT 1 FROM money_account_services WHERE "serviceId"=NEW."sourceServiceId" AND "moneyAccountId"=NEW."moneyAccountId") THEN RAISE EXCEPTION 'Opening transfers belong only to the D73 migration transaction' USING ERRCODE='23514';END IF;
 SELECT * INTO j FROM ledger_journals WHERE id=NEW."journalId";
 IF NOT FOUND OR j.kind<>'MONEY_CUTOVER' OR j."referenceId"<>NEW.id OR j."creationTransaction"<>txid_current() OR j."createdAt"<>NEW."createdAt" THEN RAISE EXCEPTION 'Opening balance requires its own exact journal' USING ERRCODE='23514';END IF;
 SELECT count(*),count(*) FILTER(WHERE "serviceId"=NEW."sourceServiceId" AND "moneyAccountId" IS NULL AND "cardId" IS NULL AND "merchantUnitId" IS NOT DISTINCT FROM NEW."sourceMerchantUnitId" AND bucket=NEW."sourceBucket" AND "deltaMinor"=-NEW."amountMinor"),count(*) FILTER(WHERE "serviceId" IS NULL AND "moneyAccountId"=NEW."moneyAccountId" AND "cardId" IS NULL AND "merchantUnitId" IS NULL AND bucket='MONEY_AVAILABLE' AND "deltaMinor"=NEW."amountMinor") INTO total,debits,credits FROM ledger_entries WHERE "journalId"=NEW."journalId";
 IF total<>2 OR debits<>1 OR credits<>1 THEN RAISE EXCEPTION 'Opening transfer must conserve its exact previous position' USING ERRCODE='23514';END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER money_cutover_origin BEFORE INSERT ON money_cutover_transfers FOR EACH ROW EXECUTE FUNCTION guard_money_cutover_transfer();
--> statement-breakpoint
DO $$ DECLARE position record;effect_id uuid;journal_id uuid;at_time timestamptz;BEGIN
 FOR position IN SELECT e."serviceId",e.bucket,e."merchantUnitId",m."moneyAccountId",sum(e."deltaMinor") amount FROM ledger_entries e JOIN money_account_services m ON m."serviceId"=e."serviceId" WHERE e.bucket IN ('GROUP_AVAILABLE','PAYOUT_CLEARING') GROUP BY e."serviceId",e.bucket,e."merchantUnitId",m."moneyAccountId" HAVING sum(e."deltaMinor")>0 ORDER BY e."serviceId",e.bucket,e."merchantUnitId" LOOP
  PERFORM pg_advisory_xact_lock(hashtextextended('money-account:'||position."moneyAccountId"::text,0));
  effect_id:=gen_random_uuid();journal_id:=gen_random_uuid();at_time:=clock_timestamp();
  INSERT INTO ledger_journals(id,"businessKey",kind,"referenceId",currency,digest,"createdAt") VALUES(journal_id,'money-cutover:'||position."serviceId"::text||':'||position.bucket||':'||coalesce(position."merchantUnitId"::text,'group'),'MONEY_CUTOVER',effect_id,'USD',encode(sha256(convert_to(json_build_object('kind','MONEY_CUTOVER','account',position."moneyAccountId",'service',position."serviceId",'bucket',position.bucket,'terminal',position."merchantUnitId",'amount',position.amount::text,'reference',effect_id)::text,'UTF8')),'hex'),at_time);
  INSERT INTO ledger_entries("journalId","lineNumber","serviceId",bucket,"cardId","merchantUnitId","moneyAccountId","deltaMinor",currency) VALUES(journal_id,1,position."serviceId",position.bucket,NULL,position."merchantUnitId",NULL,-position.amount,'USD'),(journal_id,2,NULL,'MONEY_AVAILABLE',NULL,NULL,position."moneyAccountId",position.amount,'USD');
  INSERT INTO money_cutover_transfers(id,"moneyAccountId","sourceServiceId","sourceBucket","sourceMerchantUnitId","amountMinor","journalId","createdAt") VALUES(effect_id,position."moneyAccountId",position."serviceId",position.bucket,position."merchantUnitId",position.amount,journal_id,at_time);
 END LOOP;
 IF EXISTS(SELECT 1 FROM ledger_entries WHERE bucket IN ('GROUP_AVAILABLE','PAYOUT_CLEARING') GROUP BY "serviceId",bucket,"merchantUnitId" HAVING sum("deltaMinor")<>0) THEN RAISE EXCEPTION 'Historical spendable positions did not reconcile to zero' USING ERRCODE='23514';END IF;
END $$;

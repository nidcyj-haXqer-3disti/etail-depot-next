-- D73: each card has an independent total allowance. Existing cards and
-- financial history stay intact. No balance is created by this migration.
CREATE TABLE card_spending_limits (
 "serviceId" uuid NOT NULL, "cardId" uuid NOT NULL, "allowanceMinor" bigint NOT NULL,
 version integer NOT NULL DEFAULT 1, "updatedBy" uuid NOT NULL REFERENCES people(id), "updatedAt" timestamptz NOT NULL,
 "reviewRequired" boolean NOT NULL DEFAULT false, PRIMARY KEY ("serviceId","cardId"),
 FOREIGN KEY ("cardId","serviceId") REFERENCES cards(id,"serviceId"),
 CONSTRAINT card_allowance CHECK ("allowanceMinor" BETWEEN 0 AND 999999999999 AND version>0)
);
--> statement-breakpoint
CREATE TABLE card_limit_changes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), "serviceId" uuid NOT NULL, "cardId" uuid NOT NULL,
 "actorId" uuid NOT NULL REFERENCES people(id), "previousMinor" bigint NOT NULL, "allowanceMinor" bigint NOT NULL,
 version integer NOT NULL, "createdAt" timestamptz NOT NULL,
 CONSTRAINT card_limit_history_version UNIQUE ("serviceId","cardId",version),
 FOREIGN KEY ("serviceId","cardId") REFERENCES card_spending_limits("serviceId","cardId"),
 CONSTRAINT card_limit_change_values CHECK ("previousMinor" BETWEEN 0 AND 999999999999 AND "allowanceMinor" BETWEEN 0 AND 999999999999 AND version>0)
);
--> statement-breakpoint
-- Preserve current spendability at cutover. Each new total allowance covers all
-- historical gross purchases plus its portion of the old current-month remainder.
-- Neither refunds nor month changes reset this new allowance.
WITH month_bounds AS (SELECT date_trunc('month',clock_timestamp() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' AS starts),
 usage AS (
  SELECT c.id,c."serviceId",c."holderId",s."primaryPersonId",coalesce(l."monthlyLimitMinor",0)::numeric AS old_limit,
   coalesce(sum(e."deltaMinor") FILTER (WHERE e.bucket='CARD_SPENT' AND e."deltaMinor">0 AND j.kind='CARD_PURCHASE'),0)::numeric AS used_total,
   coalesce(sum(e."deltaMinor") FILTER (WHERE e.bucket='CARD_SPENT' AND e."deltaMinor">0 AND j.kind='CARD_PURCHASE' AND j."createdAt">=b.starts AND j."createdAt"<((b.starts AT TIME ZONE 'UTC')+interval '1 month') AT TIME ZONE 'UTC'),0)::numeric AS used_month
  FROM cards c JOIN services s ON s.id=c."serviceId" CROSS JOIN month_bounds b
  LEFT JOIN cardholder_spending_limits l ON l."serviceId"=c."serviceId" AND l."personId"=c."holderId"
  LEFT JOIN ledger_entries e ON e."cardId"=c.id AND e."serviceId"=c."serviceId" LEFT JOIN ledger_journals j ON j.id=e."journalId"
  GROUP BY c.id,c."serviceId",c."holderId",s."primaryPersonId",l."monthlyLimitMinor"
 ), allocations AS (
  SELECT *,count(*) OVER w AS card_count,row_number() OVER (PARTITION BY "serviceId","holderId" ORDER BY id) AS card_number,
   sum(used_month) OVER w AS total_used_month
  FROM usage WINDOW w AS (PARTITION BY "serviceId","holderId")
 )
INSERT INTO card_spending_limits ("serviceId","cardId","allowanceMinor",version,"updatedBy","updatedAt","reviewRequired")
 SELECT "serviceId",id,(used_total+floor(greatest(old_limit-total_used_month,0)/card_count)+CASE WHEN card_number<=mod(greatest(old_limit-total_used_month,0),card_count) THEN 1 ELSE 0 END)::bigint,1,"primaryPersonId",transaction_timestamp(),true FROM allocations;
--> statement-breakpoint
INSERT INTO card_limit_changes ("serviceId","cardId","actorId","previousMinor","allowanceMinor",version,"createdAt")
 SELECT "serviceId","cardId","updatedBy",0,"allowanceMinor",version,"updatedAt" FROM card_spending_limits;
--> statement-breakpoint
CREATE FUNCTION guard_card_limit() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM services s JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" WHERE s.id=NEW."serviceId" AND s.kind='CARDHOLDER' AND s."primaryPersonId"=NEW."updatedBy" AND m.state='ACCEPTED') THEN RAISE EXCEPTION 'Card limit requires account owner' USING ERRCODE='23514'; END IF;
 IF TG_OP='INSERT' AND NEW.version<>1 OR TG_OP='UPDATE' AND (ROW(NEW."serviceId",NEW."cardId") IS DISTINCT FROM ROW(OLD."serviceId",OLD."cardId") OR NEW.version<>OLD.version+1) THEN RAISE EXCEPTION 'Card limit identity and version are invalid' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE FUNCTION check_card_limit_history() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE prior bigint;
BEGIN
 prior:=CASE WHEN TG_OP='INSERT' THEN 0 ELSE OLD."allowanceMinor" END;
 IF NOT EXISTS(SELECT 1 FROM card_limit_changes h WHERE h."serviceId"=NEW."serviceId" AND h."cardId"=NEW."cardId" AND h.version=NEW.version AND h."previousMinor"=prior AND h."allowanceMinor"=NEW."allowanceMinor" AND h."actorId"=NEW."updatedBy" AND h."createdAt"=NEW."updatedAt") THEN RAISE EXCEPTION 'Card limit requires immutable matching history' USING ERRCODE='23514'; END IF;
 RETURN NULL;
END $$;
--> statement-breakpoint
CREATE FUNCTION guard_card_limit_history() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM card_spending_limits l WHERE l."serviceId"=NEW."serviceId" AND l."cardId"=NEW."cardId" AND l.version=NEW.version AND l."allowanceMinor"=NEW."allowanceMinor" AND l."updatedBy"=NEW."actorId" AND l."updatedAt"=NEW."createdAt") THEN RAISE EXCEPTION 'Card limit history requires current change' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER card_limit_owner BEFORE INSERT OR UPDATE ON card_spending_limits FOR EACH ROW EXECUTE FUNCTION guard_card_limit();
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER card_limit_matching_history AFTER INSERT OR UPDATE ON card_spending_limits DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_card_limit_history();
--> statement-breakpoint
CREATE TRIGGER card_limit_history_origin BEFORE INSERT ON card_limit_changes FOR EACH ROW EXECUTE FUNCTION guard_card_limit_history();
--> statement-breakpoint
CREATE TRIGGER card_limit_no_reset BEFORE DELETE OR TRUNCATE ON card_spending_limits FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER card_limit_history_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON card_limit_changes FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
-- Person limits are retained only as dated migration evidence, with no active writer.
CREATE TRIGGER retired_person_limit_readonly BEFORE INSERT OR UPDATE ON cardholder_spending_limits FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE FUNCTION assert_card_money_journal(jid uuid,expected_kind text,ref uuid,svc uuid,card_id uuid,amount numeric,at_time timestamptz) RETURNS void LANGUAGE plpgsql AS $$
DECLARE account_id uuid; j record; lines bigint; card_lines bigint; money_lines bigint; sign integer;
BEGIN
 SELECT "moneyAccountId" INTO account_id FROM money_account_services WHERE "serviceId"=svc;
 SELECT * INTO j FROM ledger_journals WHERE id=jid;
 IF account_id IS NULL OR j.kind<>expected_kind OR j."referenceId"<>ref OR j.currency<>'USD' OR j."creationTransaction"<>txid_current() OR j."createdAt"<>at_time THEN RAISE EXCEPTION 'Card money journal must own its financial record' USING ERRCODE='23514'; END IF;
 sign:=CASE WHEN expected_kind='CARD_PURCHASE' THEN 1 ELSE -1 END;
 SELECT count(*),count(*) FILTER(WHERE "serviceId"=svc AND "cardId"=card_id AND "merchantUnitId" IS NULL AND "moneyAccountId" IS NULL AND bucket='CARD_SPENT' AND "deltaMinor"=sign*amount),count(*) FILTER(WHERE "serviceId" IS NULL AND "cardId" IS NULL AND "merchantUnitId" IS NULL AND "moneyAccountId"=account_id AND bucket='MONEY_AVAILABLE' AND "deltaMinor"=-sign*amount) INTO lines,card_lines,money_lines FROM ledger_entries WHERE "journalId"=jid;
 IF lines<>2 OR card_lines<>1 OR money_lines<>1 THEN RAISE EXCEPTION 'Card financial principal and money account must match' USING ERRCODE='23514'; END IF;
END $$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION check_prepaid_effect() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE a record; p record; c record; r record; lim numeric; used numeric;
BEGIN
 IF NEW.kind='GROUP_FUNDING' THEN
  IF NOT EXISTS(SELECT 1 FROM cardholder_topups WHERE id=NEW."referenceId" AND "journalId"=NEW.id) THEN RAISE EXCEPTION 'Funding journal needs its top-up receipt' USING ERRCODE='23514'; END IF;
 ELSIF NEW.kind='CARD_PURCHASE' THEN
  SELECT * INTO a FROM service_activity WHERE id=NEW."referenceId";
  IF NOT FOUND OR a.direction<>'DEBIT' OR a.status<>'POSTED' OR a."cardId" IS NULL THEN RAISE EXCEPTION 'Purchase journal requires matching activity' USING ERRCODE='23514'; END IF;
  PERFORM assert_card_money_journal(NEW.id,'CARD_PURCHASE',a.id,a."serviceId",a."cardId",a."amountMinor",a."occurredAt");
  SELECT "allowanceMinor" INTO lim FROM card_spending_limits WHERE "serviceId"=a."serviceId" AND "cardId"=a."cardId";
  SELECT coalesce(sum(e."deltaMinor"),0) INTO used FROM ledger_entries e JOIN ledger_journals j ON j.id=e."journalId" WHERE e."serviceId"=a."serviceId" AND e."cardId"=a."cardId" AND e.bucket='CARD_SPENT' AND e."deltaMinor">0 AND j.kind='CARD_PURCHASE';
  IF lim IS NULL OR used>lim THEN RAISE EXCEPTION 'Card total allowance exceeded' USING ERRCODE='23514'; END IF;
 ELSIF NEW.kind='CARD_REFUND' THEN
  SELECT f.*,pay."cardCheckoutId",pay."cardActivityId" INTO r FROM merchant_test_refunds f JOIN merchant_test_payments pay ON pay.id=f."paymentId" WHERE f.id=NEW."referenceId";
  SELECT * INTO p FROM card_checkout_attempts WHERE id=r."cardCheckoutId";
  SELECT * INTO a FROM service_activity WHERE id=NEW."referenceId";
  IF p.id IS NULL OR a.id IS NULL OR a.direction<>'CREDIT' OR a.status<>'POSTED' OR a."serviceId"<>p."cardServiceId" OR a."cardId"<>p."cardId" OR a."amountMinor"<>r."amountMinor" THEN RAISE EXCEPTION 'Refund requires original card and matching credit' USING ERRCODE='23514'; END IF;
  PERFORM assert_card_money_journal(NEW.id,'CARD_REFUND',r.id,p."cardServiceId",p."cardId",r."amountMinor",a."occurredAt");
 END IF;
 RETURN NULL;
END $$;

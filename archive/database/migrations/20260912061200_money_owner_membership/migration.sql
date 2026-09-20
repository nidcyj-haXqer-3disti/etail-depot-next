-- D73: direct money routes and SQL funding origins honor current owner service membership.
CREATE OR REPLACE FUNCTION guard_money_owner_record() RETURNS trigger LANGUAGE plpgsql AS $$
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

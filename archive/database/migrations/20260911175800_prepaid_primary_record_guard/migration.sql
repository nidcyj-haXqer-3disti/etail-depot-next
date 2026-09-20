CREATE OR REPLACE FUNCTION guard_prepaid_primary() RETURNS trigger LANGUAGE plpgsql AS $$
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

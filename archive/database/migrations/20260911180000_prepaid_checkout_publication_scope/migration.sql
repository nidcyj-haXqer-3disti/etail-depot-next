CREATE OR REPLACE FUNCTION guard_card_checkout_attempt() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM cards WHERE id=NEW."cardId" AND "serviceId"=NEW."cardServiceId" AND "holderId"=NEW."payerId") OR NOT EXISTS(SELECT 1 FROM merchant_guest_publications WHERE id=NEW."publicationId" AND "amountMinor"=NEW."amountMinor") THEN RAISE EXCEPTION 'Checkout must belong to payer and published amount' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION check_connected_card_payment() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE attempt record; a record; pub record;
BEGIN
 IF NEW."cardCheckoutId" IS NULL THEN RETURN NULL; END IF;
 SELECT * INTO attempt FROM card_checkout_attempts WHERE id=NEW."cardCheckoutId";
 SELECT * INTO a FROM service_activity WHERE id=NEW."cardActivityId";
 SELECT * INTO pub FROM merchant_guest_publications WHERE id=attempt."publicationId";
 IF a.id IS NULL OR a.direction<>'DEBIT' OR a.status<>'POSTED' OR a."serviceId"<>attempt."cardServiceId" OR a."cardId"<>attempt."cardId" OR a."amountMinor"<>NEW."amountMinor" OR attempt."amountMinor"<>NEW."amountMinor" OR NEW."channelId"<>pub."channelId" OR NEW."merchantUnitId"<>pub."merchantUnitId" OR NEW."serviceId"<>pub."serviceId" OR NEW."createdAt"<>a."occurredAt" THEN RAISE EXCEPTION 'Connected card and merchant payment must match' USING ERRCODE='23514'; END IF;
 IF NOT EXISTS(SELECT 1 FROM ledger_journals WHERE kind='CARD_PURCHASE' AND "referenceId"=a.id AND "creationTransaction"=txid_current()) OR NOT EXISTS(SELECT 1 FROM workspace_command_receipts WHERE "commandId"=attempt."confirmCommandId" AND "resourceId"=a.id AND "actorId"=attempt."payerId" AND "serviceId"=attempt."cardServiceId" AND kind='card.purchase') THEN RAISE EXCEPTION 'Connected payment requires same-transaction card command' USING ERRCODE='23514'; END IF;
 RETURN NULL;
END $$;

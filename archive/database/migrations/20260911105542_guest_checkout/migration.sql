CREATE TABLE "merchant_guest_attempts" (
	"id" uuid PRIMARY KEY,
	"orderId" uuid NOT NULL,
	"sequence" integer NOT NULL,
	"outcome" text NOT NULL,
	"requestDigest" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guest_attempt_order_sequence" UNIQUE("orderId","sequence"),
	CONSTRAINT "guest_attempt_fields" CHECK ("sequence">0 and "sequence"<=20 and "outcome" in ('APPROVED','DECLINED') and "requestDigest" ~ '^[a-f0-9]{64}$')
);
--> statement-breakpoint
CREATE TABLE "merchant_guest_orders" (
	"id" uuid PRIMARY KEY,
	"guestSessionId" uuid NOT NULL,
	"publicationId" uuid NOT NULL,
	"channelId" uuid NOT NULL,
	"merchantUnitId" uuid NOT NULL,
	"serviceId" uuid NOT NULL,
	"channelVersion" integer NOT NULL,
	"description" text NOT NULL,
	"merchantName" text NOT NULL,
	"primaryMerchantName" text NOT NULL,
	"amountMinor" bigint NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"usage" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	CONSTRAINT "guest_order_payment_scope" UNIQUE("id","channelId","merchantUnitId","serviceId"),
	CONSTRAINT "guest_order_fields" CHECK ("channelVersion">0 and "amountMinor">0 and "amountMinor"<=999999999999 and "currency"='USD' and "usage" in ('ONE_TIME','REUSABLE') and "expiresAt">"createdAt")
);
--> statement-breakpoint
CREATE TABLE "merchant_guest_publication_commands" (
	"commandId" uuid PRIMARY KEY,
	"publicationId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"kind" text NOT NULL,
	"digest" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guest_publication_command_digest" CHECK ("digest" ~ '^[a-f0-9]{64}$' and "kind" in ('PUBLISH','REVOKE'))
);
--> statement-breakpoint
CREATE TABLE "merchant_guest_publications" (
	"id" uuid PRIMARY KEY,
	"channelId" uuid NOT NULL,
	"merchantUnitId" uuid NOT NULL,
	"serviceId" uuid NOT NULL,
	"publisherId" uuid NOT NULL,
	"authorityDigest" text NOT NULL,
	"requestDigest" text NOT NULL,
	"channelVersion" integer NOT NULL,
	"activationVersion" integer NOT NULL,
	"gatewayVersion" integer NOT NULL,
	"enrollmentVersion" integer NOT NULL,
	"merchantName" text NOT NULL,
	"primaryMerchantName" text NOT NULL,
	"description" text NOT NULL,
	"amountMinor" bigint NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"usage" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"revokedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	CONSTRAINT "guest_publication_scope" UNIQUE("id","channelId","merchantUnitId","serviceId"),
	CONSTRAINT "guest_publication_fields" CHECK ("authorityDigest" ~ '^[a-f0-9]{64}$' and "requestDigest" ~ '^[a-f0-9]{64}$' and "channelVersion">0 and "activationVersion">0 and "gatewayVersion">0 and "enrollmentVersion">0 and "version">0 and "amountMinor">0 and "amountMinor"<=999999999999 and "currency"='USD' and "usage" in ('ONE_TIME','REUSABLE') and "expiresAt">"createdAt")
);
--> statement-breakpoint
CREATE TABLE "merchant_guest_request_budgets" (
	"key" text PRIMARY KEY,
	"attempts" integer NOT NULL,
	"windowStartedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "guest_budget_fields" CHECK ("key" ~ '^[a-f0-9]{64}$' and "attempts">0 and "attempts"<=600)
);
--> statement-breakpoint
CREATE TABLE "merchant_guest_sessions" (
	"id" uuid PRIMARY KEY,
	"tokenHash" text NOT NULL UNIQUE,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	CONSTRAINT "guest_session_fields" CHECK ("tokenHash" ~ '^[a-f0-9]{64}$' and "expiresAt">"createdAt")
);
--> statement-breakpoint
ALTER TABLE "merchant_operation_commands" ADD COLUMN "guestOrderId" uuid;--> statement-breakpoint
ALTER TABLE "merchant_test_payments" ADD COLUMN "guestOrderId" uuid;--> statement-breakpoint
ALTER TABLE "merchant_operation_commands" ALTER COLUMN "actorId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "merchant_test_payments" ALTER COLUMN "actorId" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "guest_order_one_approved_payment" ON "merchant_test_payments" ("guestOrderId") WHERE "guestOrderId" is not null and "outcome"='APPROVED';--> statement-breakpoint
CREATE INDEX "guest_orders_session" ON "merchant_guest_orders" ("guestSessionId","createdAt" DESC NULLS LAST,"id");--> statement-breakpoint
CREATE INDEX "guest_publication_channel" ON "merchant_guest_publications" ("channelId","createdAt" DESC NULLS LAST,"id");--> statement-breakpoint
CREATE UNIQUE INDEX "guest_publication_one_current" ON "merchant_guest_publications" ("channelId") WHERE "revokedAt" is null;--> statement-breakpoint
ALTER TABLE "merchant_operation_commands" ADD CONSTRAINT "merchant_operation_commands_jhH3w3gysdHp_fkey" FOREIGN KEY ("guestOrderId") REFERENCES "merchant_guest_orders"("id");--> statement-breakpoint
ALTER TABLE "merchant_test_payments" ADD CONSTRAINT "merchant_test_payments_BSjJ0UGWMjY1_fkey" FOREIGN KEY ("guestOrderId","channelId","merchantUnitId","serviceId") REFERENCES "merchant_guest_orders"("id","channelId","merchantUnitId","serviceId");--> statement-breakpoint
ALTER TABLE "merchant_guest_attempts" ADD CONSTRAINT "merchant_guest_attempts_orderId_merchant_guest_orders_id_fkey" FOREIGN KEY ("orderId") REFERENCES "merchant_guest_orders"("id");--> statement-breakpoint
ALTER TABLE "merchant_guest_orders" ADD CONSTRAINT "merchant_guest_orders_2Rm5bZ9FJdhx_fkey" FOREIGN KEY ("guestSessionId") REFERENCES "merchant_guest_sessions"("id");--> statement-breakpoint
ALTER TABLE "merchant_guest_orders" ADD CONSTRAINT "merchant_guest_orders_zSIVSfrrjurp_fkey" FOREIGN KEY ("publicationId","channelId","merchantUnitId","serviceId") REFERENCES "merchant_guest_publications"("id","channelId","merchantUnitId","serviceId");--> statement-breakpoint
ALTER TABLE "merchant_guest_publication_commands" ADD CONSTRAINT "merchant_guest_publication_commands_PLHahOJJfRir_fkey" FOREIGN KEY ("publicationId") REFERENCES "merchant_guest_publications"("id");--> statement-breakpoint
ALTER TABLE "merchant_guest_publication_commands" ADD CONSTRAINT "merchant_guest_publication_commands_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_guest_publications" ADD CONSTRAINT "merchant_guest_publications_publisherId_people_id_fkey" FOREIGN KEY ("publisherId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_guest_publications" ADD CONSTRAINT "merchant_guest_publications_SpjMkwwljNqi_fkey" FOREIGN KEY ("channelId","merchantUnitId","serviceId") REFERENCES "payment_channels"("id","merchantUnitId","serviceId");--> statement-breakpoint
ALTER TABLE "merchant_operation_commands" ADD CONSTRAINT "merchant_operation_actor_origin" CHECK (("actorId" is not null and "guestOrderId" is null) or ("actorId" is null and "guestOrderId" is not null and "kind"='PAYMENT' and "scopeKey"='guest-order:'||"guestOrderId"::text));--> statement-breakpoint
ALTER TABLE "merchant_test_payments" ADD CONSTRAINT "merchant_payment_actor_origin" CHECK (("actorId" is not null and "guestOrderId" is null) or ("actorId" is null and "guestOrderId" is not null));
--> statement-breakpoint
-- Existing payment/ledger provenance remains unchanged. Guest orders add a second exact origin check.
CREATE FUNCTION check_guest_payment_origin() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE source_record record; attempt_record record;
BEGIN
  IF NEW."guestOrderId" IS NULL THEN RETURN NEW; END IF;
  SELECT * INTO source_record FROM merchant_guest_orders WHERE id=NEW."guestOrderId";
  IF NOT FOUND OR ROW(NEW."channelId",NEW."merchantUnitId",NEW."serviceId",NEW."channelVersion",NEW."channelUsage",NEW.description,NEW."amountMinor",NEW.currency)
    IS DISTINCT FROM ROW(source_record."channelId",source_record."merchantUnitId",source_record."serviceId",source_record."channelVersion",source_record.usage,source_record.description,source_record."amountMinor",source_record.currency) THEN
    RAISE EXCEPTION 'Guest payment must match its immutable order' USING ERRCODE='23514';
  END IF;
  SELECT a.outcome,a."requestDigest",c.digest INTO attempt_record
    FROM merchant_operation_commands c JOIN merchant_guest_attempts a ON a.id=c."commandId" AND a."orderId"=c."guestOrderId"
    WHERE c."guestOrderId"=NEW."guestOrderId" AND c."resultId"=NEW.id AND c.kind='PAYMENT' AND c."actorId" IS NULL;
  IF NOT FOUND OR attempt_record.outcome<>NEW.outcome OR attempt_record."requestDigest"<>attempt_record.digest THEN
    RAISE EXCEPTION 'Guest payment requires its reviewed attempt and command receipt' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER merchant_guest_payment_origin AFTER INSERT ON merchant_test_payments
DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_guest_payment_origin();
--> statement-breakpoint
CREATE FUNCTION guard_guest_publication() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP<>'UPDATE' THEN RAISE EXCEPTION 'Guest publication records cannot be deleted' USING ERRCODE='23514'; END IF;
  IF (to_jsonb(NEW)-'version'-'revokedAt') IS DISTINCT FROM (to_jsonb(OLD)-'version'-'revokedAt')
    OR OLD."revokedAt" IS NOT NULL OR NEW."revokedAt" IS NULL OR NEW.version<>OLD.version+1 OR NEW."revokedAt"<OLD."createdAt" THEN
    RAISE EXCEPTION 'Guest publication snapshot is immutable; revocation cannot revive' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER guest_publication_immutable BEFORE UPDATE OR DELETE ON merchant_guest_publications FOR EACH ROW EXECUTE FUNCTION guard_guest_publication();
--> statement-breakpoint
CREATE TRIGGER guest_publication_no_truncate BEFORE TRUNCATE ON merchant_guest_publications FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
--> statement-breakpoint
CREATE TRIGGER guest_order_immutable BEFORE UPDATE OR DELETE ON merchant_guest_orders FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
--> statement-breakpoint
CREATE TRIGGER guest_order_no_truncate BEFORE TRUNCATE ON merchant_guest_orders FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
--> statement-breakpoint
CREATE TRIGGER guest_attempt_immutable BEFORE UPDATE OR DELETE ON merchant_guest_attempts FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
--> statement-breakpoint
CREATE TRIGGER guest_attempt_no_truncate BEFORE TRUNCATE ON merchant_guest_attempts FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
--> statement-breakpoint
CREATE TRIGGER guest_publication_command_immutable BEFORE UPDATE OR DELETE ON merchant_guest_publication_commands FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
--> statement-breakpoint
CREATE TRIGGER guest_publication_command_no_truncate BEFORE TRUNCATE ON merchant_guest_publication_commands FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
--> statement-breakpoint
CREATE TRIGGER guest_session_immutable BEFORE UPDATE OR DELETE ON merchant_guest_sessions FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
--> statement-breakpoint
CREATE TRIGGER guest_session_no_truncate BEFORE TRUNCATE ON merchant_guest_sessions FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();

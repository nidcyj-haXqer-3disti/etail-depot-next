ALTER TABLE "support_cases" DROP CONSTRAINT "support_cases_scWvoo8jb9CM_fkey";--> statement-breakpoint
ALTER TABLE "support_cases" ADD COLUMN "serviceKind" "service_kind" DEFAULT 'CARDHOLDER'::"service_kind" NOT NULL;--> statement-breakpoint
ALTER TABLE "support_cases" ADD COLUMN "cardholderCreatorId" uuid GENERATED ALWAYS AS (CASE WHEN "serviceKind" = 'CARDHOLDER' THEN "creatorId" ELSE NULL END) STORED;--> statement-breakpoint
ALTER TABLE "support_cases" ADD COLUMN "merchantUnitId" uuid;--> statement-breakpoint
ALTER TABLE "support_cases" ADD COLUMN "paymentId" uuid;--> statement-breakpoint
CREATE INDEX "support_cases_merchant_creator_list" ON "support_cases" ("merchantUnitId","creatorId","createdAt");--> statement-breakpoint
ALTER TABLE "support_cases" ADD CONSTRAINT "support_case_service_kind_scope" FOREIGN KEY ("serviceId","serviceKind") REFERENCES "services"("id","kind");--> statement-breakpoint
ALTER TABLE "support_cases" ADD CONSTRAINT "support_case_cardholder_creator_scope" FOREIGN KEY ("serviceId","cardholderCreatorId") REFERENCES "service_members"("serviceId","personId");--> statement-breakpoint
ALTER TABLE "support_cases" ADD CONSTRAINT "support_case_merchant_scope" FOREIGN KEY ("merchantUnitId","serviceId") REFERENCES "merchant_units"("id","masterServiceId");--> statement-breakpoint
ALTER TABLE "support_cases" ADD CONSTRAINT "support_case_payment_scope" FOREIGN KEY ("paymentId","merchantUnitId","serviceId") REFERENCES "merchant_test_payments"("id","merchantUnitId","serviceId");--> statement-breakpoint
ALTER TABLE "support_cases" ADD CONSTRAINT "support_case_context" CHECK (("serviceKind"='CARDHOLDER' and "merchantUnitId" is null and "paymentId" is null and "topic"<>'PAYMENT') or ("serviceKind"='MERCHANT' and "merchantUnitId" is not null and "transactionId" is null and "topic" in ('SERVICE','ACCESS','PAYMENT')));--> statement-breakpoint
ALTER TABLE "support_cases" DROP CONSTRAINT "support_case_topic", ADD CONSTRAINT "support_case_topic" CHECK ("topic" in ('SERVICE','ACCESS','CARD','TRANSACTION','PAYMENT'));
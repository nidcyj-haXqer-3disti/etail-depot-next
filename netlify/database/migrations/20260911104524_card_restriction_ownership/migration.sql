ALTER TABLE "cards" ADD COLUMN "primaryFrozen" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "holderFrozen" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "freezeReviewRequired" boolean DEFAULT false NOT NULL;--> statement-breakpoint
-- Earlier records have no reliable restriction-owner snapshot. Preserve every
-- existing freeze until the named primary explicitly reviews its removal.
UPDATE "cards" SET "freezeReviewRequired" = true WHERE "status" = 'FROZEN';--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "card_restriction_status" CHECK (("status"='FROZEN') = ("primaryFrozen" or "holderFrozen" or "freezeReviewRequired"));

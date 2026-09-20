CREATE TABLE "sandbox_participants" (
	"personId" uuid PRIMARY KEY,
	"commandId" uuid NOT NULL UNIQUE,
	"digest" text NOT NULL,
	"memberCode" text NOT NULL UNIQUE,
	"acknowledged" boolean NOT NULL,
	"joinedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sandbox_consent_required" CHECK ("acknowledged"=true),
	CONSTRAINT "sandbox_code_format" CHECK ("memberCode" ~ '^ED-[A-F0-9]{20}$'),
	CONSTRAINT "sandbox_join_digest" CHECK ("digest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
ALTER TABLE "sandbox_participants" ADD CONSTRAINT "sandbox_participants_personId_people_id_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id");
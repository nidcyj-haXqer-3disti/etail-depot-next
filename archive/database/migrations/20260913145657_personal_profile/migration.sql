CREATE TABLE "personal_profile_commands" (
	"commandId" uuid PRIMARY KEY,
	"personId" uuid NOT NULL,
	"digest" text NOT NULL,
	"savedVersion" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "personal_profile_commands_personId_savedVersion_unique" UNIQUE("personId","savedVersion"),
	CONSTRAINT "profile_command_digest" CHECK ("digest" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "profile_command_version" CHECK ("savedVersion">1)
);
--> statement-breakpoint
ALTER TABLE "people" ADD COLUMN "version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "personal_profile_commands" ADD CONSTRAINT "personal_profile_commands_personId_people_id_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "people" ADD CONSTRAINT "person_version_positive" CHECK ("version">0);
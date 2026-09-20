CREATE TABLE "identity_password_resets" (
	"identityId" uuid PRIMARY KEY,
	"attemptId" uuid NOT NULL UNIQUE,
	"state" text NOT NULL,
	"startedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"completedAt" timestamp with time zone,
	CONSTRAINT "identity_password_reset_state" CHECK ("state" in ('RESET_PENDING','COMPLETE')),
	CONSTRAINT "identity_password_reset_completion" CHECK (("state"='RESET_PENDING' and "completedAt" is null) or ("state"='COMPLETE' and "completedAt" is not null and "completedAt">="startedAt"))
);
--> statement-breakpoint
ALTER TABLE "identity_password_resets" ADD CONSTRAINT "identity_password_resets_identityId_identity_bindings_id_fkey" FOREIGN KEY ("identityId") REFERENCES "identity_bindings"("id");
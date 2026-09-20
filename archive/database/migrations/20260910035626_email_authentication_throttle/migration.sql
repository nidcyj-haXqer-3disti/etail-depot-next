CREATE TABLE "password_login_throttle" (
	"key" text PRIMARY KEY,
	"attempts" integer NOT NULL,
	"windowStartedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "password_login_throttle_key" CHECK ("key" ~ '^[a-f0-9]{64}$'),
	CONSTRAINT "password_login_throttle_attempts" CHECK ("attempts">0 and "attempts"<=60)
);
--> statement-breakpoint
CREATE INDEX "password_login_throttle_cleanup" ON "password_login_throttle" ("windowStartedAt");
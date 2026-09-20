-- D76: trusted current identity contact and navigation-only invitation continuation.
-- No email, contact proof, identity or service access is inferred/backfilled from old data.
CREATE TABLE identity_verified_emails (
 "identityId" uuid PRIMARY KEY REFERENCES identity_bindings(id),
 "emailNormalized" text NOT NULL,
 provenance text NOT NULL CONSTRAINT identity_verified_email_provenance CHECK(provenance='NETLIFY_USER_CONFIRMED'),
 "verifiedAt" timestamptz NOT NULL,
 "observedAt" timestamptz NOT NULL,
 CONSTRAINT identity_verified_email_normalized CHECK("emailNormalized"=lower(btrim("emailNormalized")) AND length("emailNormalized") BETWEEN 3 AND 254),
 CONSTRAINT identity_verified_email_dates CHECK("verifiedAt"<="observedAt")
);
--> statement-breakpoint
CREATE TABLE identity_continuations (
 "tokenHash" text PRIMARY KEY,
 "invitationId" uuid NOT NULL,
 "createdAt" timestamptz NOT NULL,
 "expiresAt" timestamptz NOT NULL,
 CONSTRAINT identity_continuation_hash CHECK("tokenHash" ~ '^[a-f0-9]{64}$'),
 CONSTRAINT identity_continuation_expiry CHECK("expiresAt">"createdAt" AND "expiresAt"<="createdAt"+interval '1 day')
);
--> statement-breakpoint
CREATE FUNCTION guard_identity_verified_email() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW."identityId" IS DISTINCT FROM OLD."identityId" OR NEW."observedAt"<OLD."observedAt" THEN
  RAISE EXCEPTION 'Verified contact must retain its identity and observation order' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER identity_verified_email_owner BEFORE UPDATE ON identity_verified_emails FOR EACH ROW EXECUTE FUNCTION guard_identity_verified_email();

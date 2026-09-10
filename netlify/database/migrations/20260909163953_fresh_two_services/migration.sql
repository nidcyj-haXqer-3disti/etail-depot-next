CREATE TYPE "service_kind" AS ENUM('CARDHOLDER', 'MERCHANT');--> statement-breakpoint
CREATE TABLE "card_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"serviceId" uuid NOT NULL,
	"serviceKind" "service_kind" DEFAULT 'CARDHOLDER'::"service_kind" NOT NULL,
	"creatorId" uuid NOT NULL,
	"holderId" uuid NOT NULL,
	"nickname" text DEFAULT 'New card' NOT NULL,
	"format" text DEFAULT 'VIRTUAL' NOT NULL,
	"requestedLimitMinor" bigint DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "card_request_service_scope" UNIQUE("id","serviceId"),
	CONSTRAINT "card_request_service_kind" CHECK ("serviceKind"='CARDHOLDER'),
	CONSTRAINT "card_request_status" CHECK ("status" in ('DRAFT','BLOCKED','CANCELED','ISSUED')),
	CONSTRAINT "card_request_amount" CHECK ("requestedLimitMinor" between 0 and 999999999 and "currency"='USD'),
	CONSTRAINT "card_request_version" CHECK ("version">0)
);
--> statement-breakpoint
CREATE TABLE "cardholder_creation_commands" (
	"commandId" uuid PRIMARY KEY,
	"actorId" uuid NOT NULL,
	"serviceId" uuid NOT NULL,
	"serviceKind" "service_kind" DEFAULT 'CARDHOLDER'::"service_kind" NOT NULL,
	"digest" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cardholder_creation_kind" CHECK ("serviceKind"='CARDHOLDER'),
	CONSTRAINT "cardholder_creation_digest" CHECK ("digest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"serviceId" uuid NOT NULL,
	"serviceKind" "service_kind" DEFAULT 'CARDHOLDER'::"service_kind" NOT NULL,
	"holderId" uuid NOT NULL,
	"requestId" uuid CONSTRAINT "card_request_once" UNIQUE,
	"issuerReference" text CONSTRAINT "card_issuer_reference_once" UNIQUE,
	"nickname" text NOT NULL,
	"lastFour" text NOT NULL,
	"format" text NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"limitMinor" bigint NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"fictional" boolean DEFAULT true NOT NULL,
	CONSTRAINT "cards_id_serviceId_unique" UNIQUE("id","serviceId"),
	CONSTRAINT "card_service_kind" CHECK ("serviceKind"='CARDHOLDER'),
	CONSTRAINT "card_fixture_only" CHECK ("fictional"=true),
	CONSTRAINT "card_status_valid" CHECK ("status" in ('ACTIVE','FROZEN')),
	CONSTRAINT "card_format_valid" CHECK ("format" in ('VIRTUAL','PHYSICAL')),
	CONSTRAINT "card_last_four" CHECK ("lastFour" ~ '^[0-9]{4}$'),
	CONSTRAINT "card_version_positive" CHECK ("version">0),
	CONSTRAINT "card_limit_valid" CHECK ("limitMinor" >= 0 and "currency"='USD')
);
--> statement-breakpoint
CREATE TABLE "dispute_timeline" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"disputeId" uuid NOT NULL,
	"kind" text NOT NULL,
	"message" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "disputes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"serviceId" uuid NOT NULL,
	"transactionId" uuid NOT NULL,
	"reference" text NOT NULL,
	"customer" text NOT NULL,
	"reason" text NOT NULL,
	"amountMinor" bigint NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" text DEFAULT 'NEEDS_RESPONSE' NOT NULL,
	"deadline" timestamp with time zone NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"response" text DEFAULT '' NOT NULL,
	"responseVersion" integer DEFAULT 0 NOT NULL,
	"responseStatus" text DEFAULT 'EMPTY' NOT NULL,
	"fictional" boolean DEFAULT true NOT NULL,
	CONSTRAINT "disputes_id_serviceId_unique" UNIQUE("id","serviceId"),
	CONSTRAINT "dispute_fixture_only" CHECK ("fictional"=true),
	CONSTRAINT "dispute_status" CHECK ("status" in ('NEEDS_RESPONSE','IN_REVIEW','CLOSED')),
	CONSTRAINT "dispute_response_status" CHECK ("responseStatus" in ('EMPTY','DRAFT','SUBMITTED')),
	CONSTRAINT "dispute_amount" CHECK ("amountMinor">=0 and "currency"='USD'),
	CONSTRAINT "dispute_versions" CHECK ("version">0 and "responseVersion">=0)
);
--> statement-breakpoint
CREATE TABLE "event_outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"businessKey" text NOT NULL UNIQUE,
	"kind" text NOT NULL,
	"aggregateId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity_bindings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"personId" uuid NOT NULL,
	"issuer" text NOT NULL,
	"subject" text NOT NULL,
	CONSTRAINT "identity_bindings_issuer_subject_unique" UNIQUE("issuer","subject"),
	CONSTRAINT "identity_bindings_id_personId_unique" UNIQUE("id","personId")
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"serviceId" uuid,
	"personId" uuid,
	"serviceActivity" boolean DEFAULT true NOT NULL,
	"cardControls" boolean DEFAULT true NOT NULL,
	"caseUpdates" boolean DEFAULT true NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "notification_preferences_pkey" PRIMARY KEY("serviceId","personId"),
	CONSTRAINT "notification_version" CHECK ("version">0)
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"displayName" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permission_grants" (
	"serviceId" uuid,
	"personId" uuid,
	"action" text,
	"state" text DEFAULT 'ACCEPTED' NOT NULL,
	"delegable" boolean DEFAULT false NOT NULL,
	CONSTRAINT "permission_grants_pkey" PRIMARY KEY("serviceId","personId","action"),
	CONSTRAINT "grant_state_valid" CHECK ("state" in ('ACCEPTED','REVOKED'))
);
--> statement-breakpoint
CREATE TABLE "service_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"serviceId" uuid NOT NULL,
	"cardId" uuid,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"occurredAt" timestamp with time zone NOT NULL,
	"status" text NOT NULL,
	"direction" text NOT NULL,
	"amountMinor" bigint NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"description" text NOT NULL,
	"fictional" boolean DEFAULT true NOT NULL,
	CONSTRAINT "service_activity_id_serviceId_unique" UNIQUE("id","serviceId"),
	CONSTRAINT "activity_fixture_only" CHECK ("fictional"=true),
	CONSTRAINT "activity_status" CHECK ("status" in ('POSTED','PENDING','DECLINED')),
	CONSTRAINT "activity_direction" CHECK ("direction" in ('DEBIT','CREDIT')),
	CONSTRAINT "activity_amount" CHECK ("amountMinor">=0 and "currency"='USD')
);
--> statement-breakpoint
CREATE TABLE "service_members" (
	"serviceId" uuid,
	"personId" uuid,
	"state" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "service_members_pkey" PRIMARY KEY("serviceId","personId"),
	CONSTRAINT "membership_state_valid" CHECK ("state" in ('ACCEPTED','REVOKED')),
	CONSTRAINT "membership_version_positive" CHECK ("version">0)
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"kind" "service_kind" NOT NULL,
	"primaryPersonId" uuid NOT NULL,
	"displayName" text NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_id_kind_unique" UNIQUE("id","kind"),
	CONSTRAINT "service_status_valid" CHECK ("status" in ('DRAFT','ACTIVE','SUSPENDED','CLOSED')),
	CONSTRAINT "service_version_positive" CHECK ("version">0)
);
--> statement-breakpoint
CREATE TABLE "app_sessions" (
	"tokenHash" text PRIMARY KEY,
	"identityId" uuid NOT NULL,
	"personId" uuid NOT NULL,
	"familyId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"issuedAt" timestamp with time zone NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"revokedAt" timestamp with time zone,
	CONSTRAINT "session_hash_valid" CHECK ("tokenHash" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "session_expiry_valid" CHECK ("expiresAt">"issuedAt")
);
--> statement-breakpoint
CREATE TABLE "settlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"serviceId" uuid NOT NULL,
	"reference" text NOT NULL,
	"occurredAt" timestamp with time zone NOT NULL,
	"status" text NOT NULL,
	"grossMinor" bigint NOT NULL,
	"feesMinor" bigint NOT NULL,
	"netMinor" bigint NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"destination" text NOT NULL,
	"description" text NOT NULL,
	"fictional" boolean DEFAULT true NOT NULL,
	CONSTRAINT "settlement_fixture_only" CHECK ("fictional"=true),
	CONSTRAINT "settlement_status" CHECK ("status" in ('POSTED','PENDING')),
	CONSTRAINT "settlement_amounts" CHECK ("grossMinor">=0 and "feesMinor">=0 and "netMinor">=0 and "grossMinor"-"feesMinor"="netMinor" and "currency"='USD')
);
--> statement-breakpoint
CREATE TABLE "workspace_balance_snapshots" (
	"serviceId" uuid,
	"key" text,
	"label" text NOT NULL,
	"amountMinor" bigint NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"explanation" text NOT NULL,
	"fictional" boolean DEFAULT true NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "workspace_balance_snapshots_pkey" PRIMARY KEY("serviceId","key"),
	CONSTRAINT "balance_snapshot_fixture_only" CHECK ("fictional" = true),
	CONSTRAINT "balance_snapshot_currency" CHECK ("currency" = 'USD'),
	CONSTRAINT "balance_snapshot_amount" CHECK ("amountMinor" >= 0)
);
--> statement-breakpoint
CREATE TABLE "workspace_command_receipts" (
	"commandId" uuid PRIMARY KEY,
	"serviceId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"kind" text NOT NULL,
	"resourceId" uuid NOT NULL,
	"digest" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_command_digest" CHECK ("digest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "access_command_receipts" (
	"commandId" uuid PRIMARY KEY,
	"targetKind" text DEFAULT 'SERVICE' NOT NULL,
	"serviceId" uuid,
	"merchantUnitId" uuid,
	"actorId" uuid NOT NULL,
	"kind" text NOT NULL,
	"resourceId" uuid NOT NULL,
	"digest" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "access_command_target_shape" CHECK (("targetKind"='SERVICE' and "serviceId" is not null and "merchantUnitId" is null) or ("targetKind"='MERCHANT_UNIT' and "serviceId" is null and "merchantUnitId" is not null)),
	CONSTRAINT "access_command_digest" CHECK ("digest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "service_access_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"targetKind" text DEFAULT 'SERVICE' NOT NULL,
	"serviceId" uuid,
	"merchantUnitId" uuid,
	"actorId" uuid NOT NULL,
	"personId" uuid NOT NULL,
	"invitationId" uuid,
	"kind" text NOT NULL,
	"message" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "access_history_target_shape" CHECK (("targetKind"='SERVICE' and "serviceId" is not null and "merchantUnitId" is null) or ("targetKind"='MERCHANT_UNIT' and "serviceId" is null and "merchantUnitId" is not null))
);
--> statement-breakpoint
CREATE TABLE "invitation_permissions" (
	"invitationId" uuid,
	"action" text,
	"delegable" boolean DEFAULT false NOT NULL,
	CONSTRAINT "invitation_permissions_pkey" PRIMARY KEY("invitationId","action")
);
--> statement-breakpoint
CREATE TABLE "merchant_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"merchantUnitId" uuid NOT NULL,
	"personId" uuid NOT NULL,
	"sourceAssignmentId" uuid,
	"sourcePrimaryPersonId" uuid,
	"sourceMembershipVersion" integer,
	"state" text DEFAULT 'ACCEPTED' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"revokedAt" timestamp with time zone,
	CONSTRAINT "merchant_assignment_scope" UNIQUE("id","merchantUnitId"),
	CONSTRAINT "merchant_assignment_source" CHECK (("sourceAssignmentId" is not null and "sourceAssignmentId"<>"id" and "sourcePrimaryPersonId" is null and "sourceMembershipVersion" is null) or ("sourceAssignmentId" is null and "sourcePrimaryPersonId" is not null and "sourceMembershipVersion" is not null and "sourceMembershipVersion">0)),
	CONSTRAINT "merchant_assignment_fields" CHECK ("state" in ('ACCEPTED','REVOKED') and "version">0 and "expiresAt">"createdAt")
);
--> statement-breakpoint
CREATE TABLE "merchant_invitation_terms" (
	"invitationId" uuid PRIMARY KEY,
	"merchantUnitId" uuid NOT NULL,
	"accessExpiresAt" timestamp with time zone NOT NULL,
	"sourceAssignmentId" uuid,
	"sourcePrimaryPersonId" uuid,
	"sourceMembershipVersion" integer,
	CONSTRAINT "merchant_invitation_source" CHECK (("sourceAssignmentId" is not null and "sourcePrimaryPersonId" is null and "sourceMembershipVersion" is null) or ("sourceAssignmentId" is null and "sourcePrimaryPersonId" is not null and "sourceMembershipVersion" is not null and "sourceMembershipVersion">0))
);
--> statement-breakpoint
CREATE TABLE "merchant_permission_grants" (
	"assignmentId" uuid,
	"action" text,
	"delegable" boolean DEFAULT false NOT NULL,
	CONSTRAINT "merchant_permission_grants_pkey" PRIMARY KEY("assignmentId","action"),
	CONSTRAINT "merchant_grant_action" CHECK ("action" in ('merchant.read','merchant.people.read','merchant.people.invite','merchant.people.revoke','channels.read','channels.create','channels.update','channels.close','channels.share','payments.read','payments.simulate'))
);
--> statement-breakpoint
CREATE TABLE "service_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"targetKind" text DEFAULT 'SERVICE' NOT NULL,
	"serviceId" uuid,
	"cardholderKind" "service_kind" DEFAULT 'CARDHOLDER'::"service_kind" NOT NULL,
	"merchantUnitId" uuid,
	"inviterId" uuid NOT NULL,
	"recipientId" uuid NOT NULL,
	"role" text,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"decidedAt" timestamp with time zone,
	CONSTRAINT "invitation_merchant_target" UNIQUE("id","merchantUnitId"),
	CONSTRAINT "invitation_cardholder_kind" CHECK ("cardholderKind"='CARDHOLDER'),
	CONSTRAINT "invitation_target_shape" CHECK (("targetKind"='SERVICE' and "serviceId" is not null and "merchantUnitId" is null and "role" is not null) or ("targetKind"='MERCHANT_UNIT' and "serviceId" is null and "merchantUnitId" is not null and "role" is null)),
	CONSTRAINT "invitation_state_valid" CHECK ("status" in ('PENDING','ACCEPTED','DECLINED','REVOKED','EXPIRED')),
	CONSTRAINT "invitation_role_valid" CHECK ("role" in ('SECONDARY')),
	CONSTRAINT "invitation_version_positive" CHECK ("version">0),
	CONSTRAINT "invitation_expiry_valid" CHECK ("expiresAt">"createdAt"),
	CONSTRAINT "invitation_different_people" CHECK ("inviterId"<>"recipientId")
);
--> statement-breakpoint
CREATE TABLE "support_case_commands" (
	"commandId" uuid PRIMARY KEY,
	"caseId" uuid NOT NULL,
	"serviceId" uuid NOT NULL,
	"creatorId" uuid NOT NULL,
	"kind" text NOT NULL,
	"digest" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "support_command_digest" CHECK ("digest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "support_case_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"caseId" uuid NOT NULL,
	"serviceId" uuid NOT NULL,
	"creatorId" uuid NOT NULL,
	"authorId" uuid NOT NULL,
	"authorKind" text DEFAULT 'CUSTOMER' NOT NULL,
	"kind" text NOT NULL,
	"body" text NOT NULL,
	"sequence" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "support_case_messages_caseId_sequence_unique" UNIQUE("caseId","sequence"),
	CONSTRAINT "support_message_author" CHECK ("authorKind" in ('CUSTOMER','SUPPORT') and ("authorKind"<>'CUSTOMER' or "authorId"="creatorId")),
	CONSTRAINT "support_message_kind" CHECK ("kind" in ('OPENED','MESSAGE','WITHDRAWN','RESOLVED')),
	CONSTRAINT "support_message_body" CHECK (char_length(trim("body")) between 1 and 2000),
	CONSTRAINT "support_message_sequence" CHECK ("sequence">0)
);
--> statement-breakpoint
CREATE TABLE "support_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"serviceId" uuid NOT NULL,
	"creatorId" uuid NOT NULL,
	"transactionId" uuid,
	"reference" text NOT NULL UNIQUE,
	"topic" text NOT NULL,
	"subject" text NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "support_cases_id_serviceId_creatorId_unique" UNIQUE("id","serviceId","creatorId"),
	CONSTRAINT "support_cases_id_serviceId_unique" UNIQUE("id","serviceId"),
	CONSTRAINT "support_case_status" CHECK ("status" in ('OPEN','WITHDRAWN','RESOLVED')),
	CONSTRAINT "support_case_topic" CHECK ("topic" in ('SERVICE','ACCESS','CARD','TRANSACTION')),
	CONSTRAINT "support_case_version" CHECK ("version">0),
	CONSTRAINT "support_case_subject" CHECK (char_length(trim("subject")) between 1 and 100)
);
--> statement-breakpoint
CREATE TABLE "report_definition_commands" (
	"commandId" uuid PRIMARY KEY,
	"serviceId" uuid NOT NULL,
	"personId" uuid NOT NULL,
	"definitionId" uuid NOT NULL,
	"kind" text NOT NULL,
	"digest" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "report_command_kind" CHECK ("kind" in ('CREATE','UPDATE','DELETE')),
	CONSTRAINT "report_command_digest" CHECK ("digest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "saved_report_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"serviceId" uuid NOT NULL,
	"personId" uuid NOT NULL,
	"name" text NOT NULL,
	"source" text NOT NULL,
	"status" text NOT NULL,
	"fromDate" text NOT NULL,
	"toDate" text NOT NULL,
	"query" text DEFAULT '' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "report_definition_source" CHECK ("source" = 'ACTIVITY'),
	CONSTRAINT "report_definition_status" CHECK ("status" in ('ALL','POSTED','PENDING','DECLINED')),
	CONSTRAINT "report_definition_name" CHECK (char_length("name") between 1 and 60),
	CONSTRAINT "report_definition_query" CHECK (char_length("query") <= 80),
	CONSTRAINT "report_definition_dates" CHECK ("fromDate" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' and "toDate" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' and "fromDate" <= "toDate"),
	CONSTRAINT "report_definition_version" CHECK ("version" > 0)
);
--> statement-breakpoint
CREATE TABLE "merchant_service_commands" (
	"commandId" uuid PRIMARY KEY,
	"actorId" uuid NOT NULL,
	"merchantServiceId" uuid NOT NULL,
	"merchantKind" "service_kind" DEFAULT 'MERCHANT'::"service_kind" NOT NULL,
	"digest" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "merchant_command_kind" CHECK ("merchantKind"='MERCHANT'),
	CONSTRAINT "merchant_command_digest" CHECK ("digest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "merchant_setup_eligibility" (
	"personId" uuid PRIMARY KEY,
	"personaKind" text NOT NULL,
	"fictional" boolean DEFAULT true NOT NULL,
	CONSTRAINT "merchant_persona_kind" CHECK ("personaKind" in ('FICTIONAL_ADULT','FICTIONAL_SUPERVISED')),
	CONSTRAINT "merchant_persona_fictional" CHECK ("fictional"=true)
);
--> statement-breakpoint
CREATE TABLE "merchant_application_commands" (
	"commandId" uuid PRIMARY KEY,
	"applicationId" uuid NOT NULL,
	"serviceId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"kind" text NOT NULL,
	"digest" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "merchant_application_command_kind" CHECK ("kind" in ('START','SAVE','SUBMIT')),
	CONSTRAINT "merchant_application_digest" CHECK ("digest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "merchant_application_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"applicationId" uuid NOT NULL,
	"serviceId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"kind" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "merchant_application_event_kind" CHECK ("kind" in ('CREATED','SAVED','SUBMITTED_LOCAL'))
);
--> statement-breakpoint
CREATE TABLE "merchant_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"serviceId" uuid NOT NULL UNIQUE,
	"responsiblePersonId" uuid NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"legalEntityType" text,
	"sellingName" text DEFAULT '' NOT NULL,
	"legalName" text DEFAULT '' NOT NULL,
	"activityDescription" text DEFAULT '' NOT NULL,
	"country" text DEFAULT 'US' NOT NULL,
	"fictionalDetailsConfirmed" boolean DEFAULT false NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"submittedAt" timestamp with time zone,
	CONSTRAINT "merchant_application_scope" UNIQUE("id","serviceId"),
	CONSTRAINT "merchant_application_status" CHECK ("status" in ('DRAFT','PENDING_LOCAL_REVIEW')),
	CONSTRAINT "merchant_application_entity" CHECK ("legalEntityType" is null or "legalEntityType" in ('INDIVIDUAL','SOLE_PROPRIETOR','BUSINESS')),
	CONSTRAINT "merchant_application_fields" CHECK (char_length("sellingName")<=80 and char_length("legalName")<=100 and char_length("activityDescription")<=500 and "country"='US' and "version">0),
	CONSTRAINT "merchant_application_submission" CHECK (("status"='DRAFT' and "submittedAt" is null) or ("status"='PENDING_LOCAL_REVIEW' and "submittedAt" is not null and "legalEntityType" is not null and char_length("sellingName")>0 and char_length("legalName")>0 and char_length("activityDescription")>0 and "fictionalDetailsConfirmed"=true))
);
--> statement-breakpoint
CREATE TABLE "merchant_profiles" (
	"serviceId" uuid PRIMARY KEY,
	"serviceKind" "service_kind" DEFAULT 'MERCHANT'::"service_kind" NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"fictional" boolean DEFAULT true NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "merchant_profile_merchant" CHECK ("serviceKind"='MERCHANT'),
	CONSTRAINT "merchant_profile_status" CHECK ("status" in ('DRAFT','PENDING_LOCAL_REVIEW','APPROVED','RESTRICTED','DECLINED','CLOSED')),
	CONSTRAINT "merchant_profile_fictional" CHECK ("fictional"=true),
	CONSTRAINT "merchant_profile_version" CHECK ("version">0)
);
--> statement-breakpoint
CREATE TABLE "merchant_unit_commands" (
	"commandId" uuid PRIMARY KEY,
	"merchantUnitId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"kind" text NOT NULL,
	"digest" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "merchant_unit_command_kind" CHECK ("kind" in ('CREATE_SUB','PAUSE')),
	CONSTRAINT "merchant_unit_command_digest" CHECK ("digest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "merchant_unit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"merchantUnitId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"kind" text NOT NULL,
	"reason" text DEFAULT '' NOT NULL,
	"version" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "merchant_unit_event_kind" CHECK ("kind" in ('CREATED','PAUSED')),
	CONSTRAINT "merchant_unit_event_fields" CHECK ("version">0 and char_length("reason")<=300)
);
--> statement-breakpoint
CREATE TABLE "merchant_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"kind" text NOT NULL,
	"masterId" uuid,
	"masterKind" text DEFAULT 'MASTER' NOT NULL,
	"masterServiceId" uuid NOT NULL,
	"masterServiceKind" "service_kind" DEFAULT 'MERCHANT'::"service_kind" NOT NULL,
	"displayName" text NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "merchant_unit_parent_scope" UNIQUE("id","kind","masterServiceId"),
	CONSTRAINT "merchant_unit_service_scope" UNIQUE("id","masterServiceId"),
	CONSTRAINT "merchant_unit_shape" CHECK ("masterKind"='MASTER' and "masterServiceKind"='MERCHANT' and (("kind"='MASTER' and "masterId" is null) or ("kind"='SUB' and "masterId" is not null and "masterId"<>"id"))),
	CONSTRAINT "merchant_unit_status" CHECK ("status" in ('ACTIVE','PAUSED','CLOSED')),
	CONSTRAINT "merchant_unit_fields" CHECK (char_length("displayName") between 1 and 80 and "version">0)
);
--> statement-breakpoint
CREATE TABLE "payment_channel_commands" (
	"commandId" uuid PRIMARY KEY,
	"channelId" uuid NOT NULL,
	"serviceId" uuid NOT NULL,
	"merchantUnitId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"kind" text NOT NULL,
	"digest" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_channel_command_kind" CHECK ("kind" in ('CREATE','UPDATE','CANCEL')),
	CONSTRAINT "payment_channel_digest" CHECK ("digest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "payment_channels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"serviceId" uuid NOT NULL,
	"merchantUnitId" uuid NOT NULL,
	"creatorId" uuid NOT NULL,
	"creatorAssignmentId" uuid,
	"creatorBasis" text DEFAULT 'PRIMARY_MEMBER' NOT NULL,
	"presentations" text[] DEFAULT ARRAY['WEB']::text[] NOT NULL,
	"visibility" text DEFAULT 'CREATOR_PRIVATE' NOT NULL,
	"description" text NOT NULL,
	"amountMinor" bigint NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"usage" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_channel_merchant_scope" UNIQUE("id","merchantUnitId","serviceId"),
	CONSTRAINT "payment_channel_scope" UNIQUE("id","serviceId","creatorId"),
	CONSTRAINT "payment_channel_fields" CHECK (char_length("description") between 1 and 160 and "amountMinor">0 and "amountMinor"<=999999999999 and "currency"='USD' and "version">0),
	CONSTRAINT "payment_channel_usage" CHECK ("usage" in ('ONE_TIME','REUSABLE')),
	CONSTRAINT "payment_channel_status" CHECK ("status" in ('DRAFT','CANCELED')),
	CONSTRAINT "payment_channel_presentations" CHECK (cardinality("presentations") between 1 and 7 and "presentations" <@ ARRAY['SMS','EMAIL','INVOICE','BILL','SOCIAL','QR','WEB']::text[]),
	CONSTRAINT "payment_channel_visibility" CHECK ("visibility" in ('CREATOR_PRIVATE','ASSIGNED')),
	CONSTRAINT "payment_channel_creator_basis" CHECK ("creatorBasis" in ('PRIMARY_MEMBER','MERCHANT_ASSIGNMENT') and (("creatorBasis"='MERCHANT_ASSIGNMENT' and "creatorAssignmentId" is not null) or ("creatorBasis"<>'MERCHANT_ASSIGNMENT' and "creatorAssignmentId" is null)))
);
--> statement-breakpoint
CREATE TABLE "merchant_channel_activations" (
	"channelId" uuid PRIMARY KEY,
	"merchantUnitId" uuid NOT NULL,
	"serviceId" uuid NOT NULL,
	"status" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"updatedBy" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "channel_activation_fields" CHECK ("status" in ('ACTIVE','DISABLED') and "version">0)
);
--> statement-breakpoint
CREATE TABLE "merchant_operation_commands" (
	"commandId" uuid PRIMARY KEY,
	"actorId" uuid NOT NULL,
	"scopeKey" text NOT NULL,
	"kind" text NOT NULL,
	"digest" text NOT NULL,
	"resultId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "merchant_operation_command_fields" CHECK ("kind" in ('GATEWAY','ENROLLMENT','ACTIVATION','PAYMENT','REFUND','PAYOUT') and "digest" ~ '^[0-9a-f]{64}$' and char_length("scopeKey") between 1 and 120)
);
--> statement-breakpoint
CREATE TABLE "merchant_test_payments" (
	"id" uuid PRIMARY KEY,
	"serviceId" uuid NOT NULL,
	"merchantUnitId" uuid NOT NULL,
	"channelId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"channelVersion" integer NOT NULL,
	"channelUsage" text NOT NULL,
	"description" text NOT NULL,
	"amountMinor" bigint NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"outcome" text NOT NULL,
	"testReference" text NOT NULL UNIQUE,
	"gatewayVersion" integer NOT NULL,
	"enrollmentVersion" integer NOT NULL,
	"journalId" uuid,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "merchant_test_payment_scope" UNIQUE("id","merchantUnitId","serviceId"),
	CONSTRAINT "merchant_test_payment_fields" CHECK ("amountMinor">0 and "amountMinor"<=999999999999 and "currency"='USD' and "channelVersion">0 and "gatewayVersion">0 and "enrollmentVersion">0 and "channelUsage" in ('ONE_TIME','REUSABLE') and char_length("description") between 1 and 160 and "testReference" like 'TEST-%' and (("outcome"='APPROVED' and "journalId" is not null) or ("outcome"='DECLINED' and "journalId" is null)))
);
--> statement-breakpoint
CREATE TABLE "merchant_test_payouts" (
	"id" uuid PRIMARY KEY,
	"serviceId" uuid NOT NULL,
	"merchantUnitId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"amountMinor" bigint NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"testReference" text NOT NULL UNIQUE,
	"journalId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "merchant_test_payout_fields" CHECK ("amountMinor">0 and "amountMinor"<=999999999999 and "currency"='USD' and "testReference" like 'TEST-%')
);
--> statement-breakpoint
CREATE TABLE "merchant_test_refunds" (
	"id" uuid PRIMARY KEY,
	"paymentId" uuid NOT NULL UNIQUE,
	"merchantUnitId" uuid NOT NULL,
	"serviceId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"amountMinor" bigint NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"reason" text NOT NULL,
	"testReference" text NOT NULL UNIQUE,
	"journalId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "merchant_test_refund_fields" CHECK ("amountMinor">0 and "currency"='USD' and char_length("reason") between 1 and 300 and "testReference" like 'TEST-%')
);
--> statement-breakpoint
CREATE TABLE "merchant_test_gateways" (
	"serviceId" uuid PRIMARY KEY,
	"mode" text NOT NULL,
	"processor" text DEFAULT 'ETAIL_TEST' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"updatedBy" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "test_gateway_fields" CHECK ("mode" in ('TEST_READY','DISABLED') and "processor"='ETAIL_TEST' and "version">0)
);
--> statement-breakpoint
CREATE TABLE "merchant_test_enrollments" (
	"merchantUnitId" uuid PRIMARY KEY,
	"serviceId" uuid NOT NULL,
	"status" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"updatedBy" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "test_enrollment_scope" UNIQUE("merchantUnitId","serviceId"),
	CONSTRAINT "test_enrollment_fields" CHECK ("status" in ('ENROLLED','DISABLED') and "version">0)
);
--> statement-breakpoint
CREATE TABLE "ledger_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"journalId" uuid NOT NULL,
	"lineNumber" integer NOT NULL,
	"serviceId" uuid NOT NULL,
	"bucket" text NOT NULL,
	"cardId" uuid,
	"merchantUnitId" uuid,
	"deltaMinor" bigint NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	CONSTRAINT "ledger_entry_line" UNIQUE("journalId","lineNumber"),
	CONSTRAINT "ledger_entry_amount" CHECK ("deltaMinor"<>0 and "currency"='USD'),
	CONSTRAINT "ledger_entry_line_number" CHECK ("lineNumber" between 1 and 64),
	CONSTRAINT "ledger_entry_resource_shape" CHECK (("bucket"='PRACTICE_SOURCE' and "cardId" is null and "merchantUnitId" is null) or ("bucket" in ('CARD_AVAILABLE','CARD_SPENT') and "cardId" is not null and "merchantUnitId" is null) or ("bucket" in ('GATEWAY_CLEARING','MERCHANT_AVAILABLE','PAYOUT_CLEARING') and "cardId" is null and "merchantUnitId" is not null))
);
--> statement-breakpoint
CREATE TABLE "ledger_journals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"businessKey" text NOT NULL UNIQUE,
	"kind" text NOT NULL,
	"referenceId" uuid NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"digest" text NOT NULL,
	"creationTransaction" bigint DEFAULT txid_current() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ledger_journal_reference_effect" UNIQUE("kind","referenceId"),
	CONSTRAINT "ledger_journal_key" CHECK (char_length("businessKey") between 1 and 200),
	CONSTRAINT "ledger_journal_kind" CHECK ("kind" in ('CARD_FUNDING','CARD_PURCHASE','CARD_REFUND','MERCHANT_PAYMENT','MERCHANT_REFUND','MERCHANT_PAYOUT')),
	CONSTRAINT "ledger_journal_currency" CHECK ("currency"='USD'),
	CONSTRAINT "ledger_journal_digest" CHECK ("digest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "operator_command_receipts" (
	"commandId" uuid PRIMARY KEY,
	"serviceId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"caseId" uuid NOT NULL,
	"digest" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "operator_receipt_digest" CHECK ("digest" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "operator_service_access" (
	"serviceId" uuid,
	"personId" uuid,
	"state" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"canRespond" boolean DEFAULT false NOT NULL,
	CONSTRAINT "operator_service_access_pkey" PRIMARY KEY("serviceId","personId"),
	CONSTRAINT "operator_access_state" CHECK ("state" in ('ACCEPTED','REVOKED') and "version">0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "one_primary_cardholder_service" ON "services" ("primaryPersonId") WHERE "kind"='CARDHOLDER';--> statement-breakpoint
CREATE UNIQUE INDEX "app_sessions_one_active_per_family" ON "app_sessions" ("familyId") WHERE "revokedAt" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "merchant_assignment_live_person" ON "merchant_assignments" ("merchantUnitId","personId") WHERE "state"='ACCEPTED';--> statement-breakpoint
CREATE INDEX "merchant_assignment_person" ON "merchant_assignments" ("personId","merchantUnitId");--> statement-breakpoint
CREATE UNIQUE INDEX "one_pending_merchant_invitation" ON "service_invitations" ("merchantUnitId","recipientId") WHERE "status"='PENDING';--> statement-breakpoint
CREATE UNIQUE INDEX "one_pending_invitation_per_recipient" ON "service_invitations" ("serviceId","recipientId") WHERE "status"='PENDING';--> statement-breakpoint
CREATE INDEX "support_cases_creator_list" ON "support_cases" ("serviceId","creatorId","createdAt");--> statement-breakpoint
CREATE INDEX "merchant_events_service_time" ON "merchant_application_events" ("serviceId","applicationId","createdAt" DESC NULLS LAST,"id");--> statement-breakpoint
CREATE UNIQUE INDEX "merchant_unit_one_primary" ON "merchant_units" ("masterServiceId") WHERE "kind"='MASTER';--> statement-breakpoint
CREATE INDEX "merchant_units_primary" ON "merchant_units" ("masterServiceId","id");--> statement-breakpoint
CREATE INDEX "payment_channels_creator_time" ON "payment_channels" ("serviceId","creatorId","updatedAt" DESC NULLS LAST,"id");--> statement-breakpoint
CREATE INDEX "payment_channels_unit_time" ON "payment_channels" ("merchantUnitId","updatedAt" DESC NULLS LAST,"id");--> statement-breakpoint
CREATE UNIQUE INDEX "merchant_channel_one_approved_use" ON "merchant_test_payments" ("channelId") WHERE "channelUsage"='ONE_TIME' and "outcome"='APPROVED';--> statement-breakpoint
CREATE INDEX "merchant_test_payment_unit_time" ON "merchant_test_payments" ("merchantUnitId","createdAt" DESC NULLS LAST,"id");--> statement-breakpoint
CREATE INDEX "merchant_test_payout_unit_time" ON "merchant_test_payouts" ("merchantUnitId","createdAt" DESC NULLS LAST,"id");--> statement-breakpoint
CREATE INDEX "ledger_entry_position" ON "ledger_entries" ("serviceId","bucket","cardId","merchantUnitId");--> statement-breakpoint
ALTER TABLE "card_requests" ADD CONSTRAINT "card_requests_creatorId_people_id_fkey" FOREIGN KEY ("creatorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "card_requests" ADD CONSTRAINT "card_requests_serviceId_serviceKind_services_id_kind_fkey" FOREIGN KEY ("serviceId","serviceKind") REFERENCES "services"("id","kind");--> statement-breakpoint
ALTER TABLE "card_requests" ADD CONSTRAINT "card_requests_ApfSGnLkiJ2Q_fkey" FOREIGN KEY ("serviceId","holderId") REFERENCES "service_members"("serviceId","personId");--> statement-breakpoint
ALTER TABLE "cardholder_creation_commands" ADD CONSTRAINT "cardholder_creation_commands_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "cardholder_creation_commands" ADD CONSTRAINT "cardholder_creation_commands_HVlofRHBAC9c_fkey" FOREIGN KEY ("serviceId","serviceKind") REFERENCES "services"("id","kind");--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_serviceId_serviceKind_services_id_kind_fkey" FOREIGN KEY ("serviceId","serviceKind") REFERENCES "services"("id","kind");--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_requestId_serviceId_card_requests_id_serviceId_fkey" FOREIGN KEY ("requestId","serviceId") REFERENCES "card_requests"("id","serviceId");--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_wxHq7cZhlg0I_fkey" FOREIGN KEY ("serviceId","holderId") REFERENCES "service_members"("serviceId","personId");--> statement-breakpoint
ALTER TABLE "dispute_timeline" ADD CONSTRAINT "dispute_timeline_disputeId_disputes_id_fkey" FOREIGN KEY ("disputeId") REFERENCES "disputes"("id");--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_serviceId_services_id_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id");--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_LQbmuYP6T29l_fkey" FOREIGN KEY ("transactionId","serviceId") REFERENCES "service_activity"("id","serviceId");--> statement-breakpoint
ALTER TABLE "identity_bindings" ADD CONSTRAINT "identity_bindings_personId_people_id_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_TllFnb3SFY5q_fkey" FOREIGN KEY ("serviceId","personId") REFERENCES "service_members"("serviceId","personId");--> statement-breakpoint
ALTER TABLE "permission_grants" ADD CONSTRAINT "permission_grants_THLmEGkiR34X_fkey" FOREIGN KEY ("serviceId","personId") REFERENCES "service_members"("serviceId","personId");--> statement-breakpoint
ALTER TABLE "service_activity" ADD CONSTRAINT "service_activity_serviceId_services_id_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id");--> statement-breakpoint
ALTER TABLE "service_activity" ADD CONSTRAINT "service_activity_cardId_serviceId_cards_id_serviceId_fkey" FOREIGN KEY ("cardId","serviceId") REFERENCES "cards"("id","serviceId");--> statement-breakpoint
ALTER TABLE "service_members" ADD CONSTRAINT "service_members_serviceId_services_id_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id");--> statement-breakpoint
ALTER TABLE "service_members" ADD CONSTRAINT "service_members_personId_people_id_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_primaryPersonId_people_id_fkey" FOREIGN KEY ("primaryPersonId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "app_sessions" ADD CONSTRAINT "app_sessions_YWktvD8FKejZ_fkey" FOREIGN KEY ("identityId","personId") REFERENCES "identity_bindings"("id","personId");--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_serviceId_services_id_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id");--> statement-breakpoint
ALTER TABLE "workspace_balance_snapshots" ADD CONSTRAINT "workspace_balance_snapshots_serviceId_services_id_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id");--> statement-breakpoint
ALTER TABLE "workspace_command_receipts" ADD CONSTRAINT "workspace_command_receipts_serviceId_services_id_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id");--> statement-breakpoint
ALTER TABLE "workspace_command_receipts" ADD CONSTRAINT "workspace_command_receipts_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "access_command_receipts" ADD CONSTRAINT "access_command_receipts_serviceId_services_id_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id");--> statement-breakpoint
ALTER TABLE "access_command_receipts" ADD CONSTRAINT "access_command_receipts_merchantUnitId_merchant_units_id_fkey" FOREIGN KEY ("merchantUnitId") REFERENCES "merchant_units"("id");--> statement-breakpoint
ALTER TABLE "access_command_receipts" ADD CONSTRAINT "access_command_receipts_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "service_access_history" ADD CONSTRAINT "service_access_history_serviceId_services_id_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id");--> statement-breakpoint
ALTER TABLE "service_access_history" ADD CONSTRAINT "service_access_history_merchantUnitId_merchant_units_id_fkey" FOREIGN KEY ("merchantUnitId") REFERENCES "merchant_units"("id");--> statement-breakpoint
ALTER TABLE "service_access_history" ADD CONSTRAINT "service_access_history_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "service_access_history" ADD CONSTRAINT "service_access_history_personId_people_id_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "service_access_history" ADD CONSTRAINT "service_access_history_invitationId_service_invitations_id_fkey" FOREIGN KEY ("invitationId") REFERENCES "service_invitations"("id");--> statement-breakpoint
ALTER TABLE "invitation_permissions" ADD CONSTRAINT "invitation_permissions_invitationId_service_invitations_id_fkey" FOREIGN KEY ("invitationId") REFERENCES "service_invitations"("id");--> statement-breakpoint
ALTER TABLE "merchant_assignments" ADD CONSTRAINT "merchant_assignments_merchantUnitId_merchant_units_id_fkey" FOREIGN KEY ("merchantUnitId") REFERENCES "merchant_units"("id");--> statement-breakpoint
ALTER TABLE "merchant_assignments" ADD CONSTRAINT "merchant_assignments_personId_people_id_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_assignments" ADD CONSTRAINT "merchant_assignments_sourcePrimaryPersonId_people_id_fkey" FOREIGN KEY ("sourcePrimaryPersonId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_assignments" ADD CONSTRAINT "merchant_assignments_8IVhp8juKnpf_fkey" FOREIGN KEY ("sourceAssignmentId","merchantUnitId") REFERENCES "merchant_assignments"("id","merchantUnitId");--> statement-breakpoint
ALTER TABLE "merchant_invitation_terms" ADD CONSTRAINT "merchant_invitation_terms_7HcF2UVXT9wu_fkey" FOREIGN KEY ("invitationId") REFERENCES "service_invitations"("id");--> statement-breakpoint
ALTER TABLE "merchant_invitation_terms" ADD CONSTRAINT "merchant_invitation_terms_merchantUnitId_merchant_units_id_fkey" FOREIGN KEY ("merchantUnitId") REFERENCES "merchant_units"("id");--> statement-breakpoint
ALTER TABLE "merchant_invitation_terms" ADD CONSTRAINT "merchant_invitation_terms_sourcePrimaryPersonId_people_id_fkey" FOREIGN KEY ("sourcePrimaryPersonId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_invitation_terms" ADD CONSTRAINT "merchant_invitation_terms_l54XbKNMOMbM_fkey" FOREIGN KEY ("invitationId","merchantUnitId") REFERENCES "service_invitations"("id","merchantUnitId");--> statement-breakpoint
ALTER TABLE "merchant_invitation_terms" ADD CONSTRAINT "merchant_invitation_terms_eAExfDi7CAry_fkey" FOREIGN KEY ("sourceAssignmentId","merchantUnitId") REFERENCES "merchant_assignments"("id","merchantUnitId");--> statement-breakpoint
ALTER TABLE "merchant_permission_grants" ADD CONSTRAINT "merchant_permission_grants_ulsTobf5N8qL_fkey" FOREIGN KEY ("assignmentId") REFERENCES "merchant_assignments"("id");--> statement-breakpoint
ALTER TABLE "service_invitations" ADD CONSTRAINT "service_invitations_serviceId_services_id_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id");--> statement-breakpoint
ALTER TABLE "service_invitations" ADD CONSTRAINT "service_invitations_merchantUnitId_merchant_units_id_fkey" FOREIGN KEY ("merchantUnitId") REFERENCES "merchant_units"("id");--> statement-breakpoint
ALTER TABLE "service_invitations" ADD CONSTRAINT "service_invitations_inviterId_people_id_fkey" FOREIGN KEY ("inviterId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "service_invitations" ADD CONSTRAINT "service_invitations_recipientId_people_id_fkey" FOREIGN KEY ("recipientId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "service_invitations" ADD CONSTRAINT "service_invitations_RzAQogN2ZCgY_fkey" FOREIGN KEY ("serviceId","cardholderKind") REFERENCES "services"("id","kind");--> statement-breakpoint
ALTER TABLE "support_case_commands" ADD CONSTRAINT "support_case_commands_HvLkwnmlFkuX_fkey" FOREIGN KEY ("caseId","serviceId","creatorId") REFERENCES "support_cases"("id","serviceId","creatorId");--> statement-breakpoint
ALTER TABLE "support_case_messages" ADD CONSTRAINT "support_case_messages_authorId_people_id_fkey" FOREIGN KEY ("authorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "support_case_messages" ADD CONSTRAINT "support_case_messages_KG2J5R4LStrz_fkey" FOREIGN KEY ("caseId","serviceId","creatorId") REFERENCES "support_cases"("id","serviceId","creatorId");--> statement-breakpoint
ALTER TABLE "support_cases" ADD CONSTRAINT "support_cases_serviceId_services_id_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id");--> statement-breakpoint
ALTER TABLE "support_cases" ADD CONSTRAINT "support_cases_creatorId_people_id_fkey" FOREIGN KEY ("creatorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "support_cases" ADD CONSTRAINT "support_cases_scWvoo8jb9CM_fkey" FOREIGN KEY ("serviceId","creatorId") REFERENCES "service_members"("serviceId","personId");--> statement-breakpoint
ALTER TABLE "support_cases" ADD CONSTRAINT "support_cases_FDpGRi7WKFmt_fkey" FOREIGN KEY ("transactionId","serviceId") REFERENCES "service_activity"("id","serviceId");--> statement-breakpoint
ALTER TABLE "report_definition_commands" ADD CONSTRAINT "report_definition_commands_kIwWydZeNEkU_fkey" FOREIGN KEY ("definitionId") REFERENCES "saved_report_definitions"("id");--> statement-breakpoint
ALTER TABLE "report_definition_commands" ADD CONSTRAINT "report_definition_commands_ngmkgCfKomlr_fkey" FOREIGN KEY ("serviceId","personId") REFERENCES "service_members"("serviceId","personId");--> statement-breakpoint
ALTER TABLE "saved_report_definitions" ADD CONSTRAINT "saved_report_definitions_l79K1Ps3FztX_fkey" FOREIGN KEY ("serviceId","personId") REFERENCES "service_members"("serviceId","personId");--> statement-breakpoint
ALTER TABLE "merchant_service_commands" ADD CONSTRAINT "merchant_service_commands_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_service_commands" ADD CONSTRAINT "merchant_service_commands_nbSZ9L5cb47B_fkey" FOREIGN KEY ("merchantServiceId","merchantKind") REFERENCES "services"("id","kind");--> statement-breakpoint
ALTER TABLE "merchant_setup_eligibility" ADD CONSTRAINT "merchant_setup_eligibility_personId_people_id_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_application_commands" ADD CONSTRAINT "merchant_application_commands_2hvSyOCeYk9n_fkey" FOREIGN KEY ("applicationId","serviceId") REFERENCES "merchant_applications"("id","serviceId");--> statement-breakpoint
ALTER TABLE "merchant_application_commands" ADD CONSTRAINT "merchant_application_commands_ICkG76Yq020k_fkey" FOREIGN KEY ("serviceId","actorId") REFERENCES "service_members"("serviceId","personId");--> statement-breakpoint
ALTER TABLE "merchant_application_events" ADD CONSTRAINT "merchant_application_events_VSVMX1AnZTSc_fkey" FOREIGN KEY ("applicationId","serviceId") REFERENCES "merchant_applications"("id","serviceId");--> statement-breakpoint
ALTER TABLE "merchant_application_events" ADD CONSTRAINT "merchant_application_events_GXq2RpnZpGgP_fkey" FOREIGN KEY ("serviceId","actorId") REFERENCES "service_members"("serviceId","personId");--> statement-breakpoint
ALTER TABLE "merchant_applications" ADD CONSTRAINT "merchant_applications_5luiSqzH5RTq_fkey" FOREIGN KEY ("serviceId") REFERENCES "merchant_profiles"("serviceId");--> statement-breakpoint
ALTER TABLE "merchant_applications" ADD CONSTRAINT "merchant_applications_N2USDnHD6lHQ_fkey" FOREIGN KEY ("serviceId","responsiblePersonId") REFERENCES "service_members"("serviceId","personId");--> statement-breakpoint
ALTER TABLE "merchant_profiles" ADD CONSTRAINT "merchant_profiles_serviceId_serviceKind_services_id_kind_fkey" FOREIGN KEY ("serviceId","serviceKind") REFERENCES "services"("id","kind");--> statement-breakpoint
ALTER TABLE "merchant_unit_commands" ADD CONSTRAINT "merchant_unit_commands_merchantUnitId_merchant_units_id_fkey" FOREIGN KEY ("merchantUnitId") REFERENCES "merchant_units"("id");--> statement-breakpoint
ALTER TABLE "merchant_unit_commands" ADD CONSTRAINT "merchant_unit_commands_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_unit_events" ADD CONSTRAINT "merchant_unit_events_merchantUnitId_merchant_units_id_fkey" FOREIGN KEY ("merchantUnitId") REFERENCES "merchant_units"("id");--> statement-breakpoint
ALTER TABLE "merchant_unit_events" ADD CONSTRAINT "merchant_unit_events_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_units" ADD CONSTRAINT "merchant_units_rY2BsUmhhaCN_fkey" FOREIGN KEY ("masterServiceId","masterServiceKind") REFERENCES "services"("id","kind");--> statement-breakpoint
ALTER TABLE "merchant_units" ADD CONSTRAINT "merchant_units_UxCiXD4xdYQl_fkey" FOREIGN KEY ("masterId","masterKind","masterServiceId") REFERENCES "merchant_units"("id","kind","masterServiceId");--> statement-breakpoint
ALTER TABLE "payment_channel_commands" ADD CONSTRAINT "payment_channel_commands_channelId_payment_channels_id_fkey" FOREIGN KEY ("channelId") REFERENCES "payment_channels"("id");--> statement-breakpoint
ALTER TABLE "payment_channel_commands" ADD CONSTRAINT "payment_channel_commands_RIRZ2oGF9MMH_fkey" FOREIGN KEY ("serviceId") REFERENCES "merchant_profiles"("serviceId");--> statement-breakpoint
ALTER TABLE "payment_channel_commands" ADD CONSTRAINT "payment_channel_commands_merchantUnitId_merchant_units_id_fkey" FOREIGN KEY ("merchantUnitId") REFERENCES "merchant_units"("id");--> statement-breakpoint
ALTER TABLE "payment_channel_commands" ADD CONSTRAINT "payment_channel_commands_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "payment_channel_commands" ADD CONSTRAINT "payment_channel_commands_SVVE0WZcscW4_fkey" FOREIGN KEY ("channelId","merchantUnitId","serviceId") REFERENCES "payment_channels"("id","merchantUnitId","serviceId");--> statement-breakpoint
ALTER TABLE "payment_channels" ADD CONSTRAINT "payment_channels_serviceId_merchant_profiles_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "merchant_profiles"("serviceId");--> statement-breakpoint
ALTER TABLE "payment_channels" ADD CONSTRAINT "payment_channels_creatorId_people_id_fkey" FOREIGN KEY ("creatorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "payment_channels" ADD CONSTRAINT "payment_channels_x1AN7HnRWvNQ_fkey" FOREIGN KEY ("merchantUnitId","serviceId") REFERENCES "merchant_units"("id","masterServiceId");--> statement-breakpoint
ALTER TABLE "merchant_channel_activations" ADD CONSTRAINT "merchant_channel_activations_updatedBy_people_id_fkey" FOREIGN KEY ("updatedBy") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_channel_activations" ADD CONSTRAINT "merchant_channel_activations_OfDMR8DJkLWT_fkey" FOREIGN KEY ("channelId","merchantUnitId","serviceId") REFERENCES "payment_channels"("id","merchantUnitId","serviceId");--> statement-breakpoint
ALTER TABLE "merchant_operation_commands" ADD CONSTRAINT "merchant_operation_commands_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_test_payments" ADD CONSTRAINT "merchant_test_payments_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_test_payments" ADD CONSTRAINT "merchant_test_payments_journalId_ledger_journals_id_fkey" FOREIGN KEY ("journalId") REFERENCES "ledger_journals"("id");--> statement-breakpoint
ALTER TABLE "merchant_test_payments" ADD CONSTRAINT "merchant_test_payments_092WrHhc74Zc_fkey" FOREIGN KEY ("channelId","merchantUnitId","serviceId") REFERENCES "payment_channels"("id","merchantUnitId","serviceId");--> statement-breakpoint
ALTER TABLE "merchant_test_payouts" ADD CONSTRAINT "merchant_test_payouts_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_test_payouts" ADD CONSTRAINT "merchant_test_payouts_journalId_ledger_journals_id_fkey" FOREIGN KEY ("journalId") REFERENCES "ledger_journals"("id");--> statement-breakpoint
ALTER TABLE "merchant_test_payouts" ADD CONSTRAINT "merchant_test_payouts_jZXaclcyXypo_fkey" FOREIGN KEY ("merchantUnitId","serviceId") REFERENCES "merchant_units"("id","masterServiceId");--> statement-breakpoint
ALTER TABLE "merchant_test_refunds" ADD CONSTRAINT "merchant_test_refunds_actorId_people_id_fkey" FOREIGN KEY ("actorId") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_test_refunds" ADD CONSTRAINT "merchant_test_refunds_journalId_ledger_journals_id_fkey" FOREIGN KEY ("journalId") REFERENCES "ledger_journals"("id");--> statement-breakpoint
ALTER TABLE "merchant_test_refunds" ADD CONSTRAINT "merchant_test_refunds_VRNrN4c8YYMd_fkey" FOREIGN KEY ("paymentId","merchantUnitId","serviceId") REFERENCES "merchant_test_payments"("id","merchantUnitId","serviceId");--> statement-breakpoint
ALTER TABLE "merchant_test_gateways" ADD CONSTRAINT "merchant_test_gateways_TnRPM9a4McU5_fkey" FOREIGN KEY ("serviceId") REFERENCES "merchant_profiles"("serviceId");--> statement-breakpoint
ALTER TABLE "merchant_test_gateways" ADD CONSTRAINT "merchant_test_gateways_updatedBy_people_id_fkey" FOREIGN KEY ("updatedBy") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_test_enrollments" ADD CONSTRAINT "merchant_test_enrollments_K6GzaFa3HWrV_fkey" FOREIGN KEY ("serviceId") REFERENCES "merchant_test_gateways"("serviceId");--> statement-breakpoint
ALTER TABLE "merchant_test_enrollments" ADD CONSTRAINT "merchant_test_enrollments_updatedBy_people_id_fkey" FOREIGN KEY ("updatedBy") REFERENCES "people"("id");--> statement-breakpoint
ALTER TABLE "merchant_test_enrollments" ADD CONSTRAINT "merchant_test_enrollments_cgpvxNobsZaA_fkey" FOREIGN KEY ("merchantUnitId","serviceId") REFERENCES "merchant_units"("id","masterServiceId");--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_journalId_ledger_journals_id_fkey" FOREIGN KEY ("journalId") REFERENCES "ledger_journals"("id");--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_serviceId_services_id_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id");--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entry_card_scope" FOREIGN KEY ("cardId","serviceId") REFERENCES "cards"("id","serviceId");--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entry_merchant_scope" FOREIGN KEY ("merchantUnitId","serviceId") REFERENCES "merchant_units"("id","masterServiceId");--> statement-breakpoint
ALTER TABLE "operator_command_receipts" ADD CONSTRAINT "operator_command_receipts_caseId_support_cases_id_fkey" FOREIGN KEY ("caseId") REFERENCES "support_cases"("id");--> statement-breakpoint
ALTER TABLE "operator_command_receipts" ADD CONSTRAINT "operator_command_receipts_OS5thxAIFFn8_fkey" FOREIGN KEY ("caseId","serviceId") REFERENCES "support_cases"("id","serviceId");--> statement-breakpoint
ALTER TABLE "operator_command_receipts" ADD CONSTRAINT "operator_command_receipts_Fn7imLf5jg1m_fkey" FOREIGN KEY ("serviceId","actorId") REFERENCES "operator_service_access"("serviceId","personId");--> statement-breakpoint
ALTER TABLE "operator_service_access" ADD CONSTRAINT "operator_service_access_serviceId_services_id_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id");--> statement-breakpoint
ALTER TABLE "operator_service_access" ADD CONSTRAINT "operator_service_access_personId_people_id_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id");

--> statement-breakpoint
-- Reviewed supplement: src/platform/database/service-constraints.sql
-- Service kind and responsible primary never change through generic row updates.
CREATE FUNCTION guard_service_identity() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.id<>OLD.id OR NEW.kind<>OLD.kind OR NEW."primaryPersonId"<>OLD."primaryPersonId" THEN
  RAISE EXCEPTION 'Service identity and primary responsibility are immutable' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER service_identity_immutable BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION guard_service_identity();
--> statement-breakpoint
CREATE FUNCTION guard_service_member() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE service_kind text; primary_person uuid;
BEGIN
 IF TG_OP='UPDATE' AND (NEW."serviceId"<>OLD."serviceId" OR NEW."personId"<>OLD."personId") THEN
  RAISE EXCEPTION 'Service membership identity is immutable' USING ERRCODE='23514';
 END IF;
 SELECT kind::text,"primaryPersonId" INTO service_kind,primary_person FROM services WHERE id=NEW."serviceId";
 IF service_kind='MERCHANT' AND NEW."personId"<>primary_person THEN
  RAISE EXCEPTION 'Merchant access uses exact merchant assignments' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER service_member_identity BEFORE INSERT OR UPDATE ON service_members FOR EACH ROW EXECUTE FUNCTION guard_service_member();


--> statement-breakpoint
-- Reviewed supplement: src/modules/ledger/constraints.sql
-- Append after the generated ledger tables in the same new migration.
-- A journal and all its entries are created together, balanced at commit and immutable.
CREATE FUNCTION guard_ledger_journal() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP <> 'INSERT' THEN
    RAISE EXCEPTION 'Posted ledger journals are immutable' USING ERRCODE='23514';
  END IF;
  IF NEW."creationTransaction" <> txid_current() THEN
    RAISE EXCEPTION 'Ledger journal transaction is invalid' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER ledger_journal_immutable BEFORE INSERT OR UPDATE OR DELETE ON ledger_journals
FOR EACH ROW EXECUTE FUNCTION guard_ledger_journal();
--> statement-breakpoint
CREATE TRIGGER ledger_journal_no_truncate BEFORE TRUNCATE ON ledger_journals
FOR EACH STATEMENT EXECUTE FUNCTION guard_ledger_journal();
--> statement-breakpoint
CREATE FUNCTION guard_ledger_entry() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE journal_transaction bigint;
BEGIN
  IF TG_OP <> 'INSERT' THEN
    RAISE EXCEPTION 'Posted ledger entries are immutable' USING ERRCODE='23514';
  END IF;
  SELECT "creationTransaction" INTO journal_transaction FROM ledger_journals WHERE id=NEW."journalId";
  IF journal_transaction IS NULL OR journal_transaction <> txid_current() THEN
    RAISE EXCEPTION 'Entries must be inserted with their new journal' USING ERRCODE='23514';
  END IF;
  -- Direct SQL and service posting contend on the identical position identity.
  PERFORM pg_advisory_xact_lock(hashtextextended('ledger-position:' || NEW."serviceId"::text || ':' || NEW.bucket || ':' || coalesce(NEW."cardId"::text,'') || ':' || coalesce(NEW."merchantUnitId"::text,''),0));
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER ledger_entry_immutable BEFORE INSERT OR UPDATE OR DELETE ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION guard_ledger_entry();
--> statement-breakpoint
CREATE TRIGGER ledger_entry_no_truncate BEFORE TRUNCATE ON ledger_entries
FOR EACH STATEMENT EXECUTE FUNCTION guard_ledger_entry();
--> statement-breakpoint
CREATE FUNCTION check_ledger_journal_balance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE line_count bigint; total numeric;
BEGIN
  SELECT count(*),coalesce(sum("deltaMinor"),0) INTO line_count,total FROM ledger_entries WHERE "journalId"=NEW.id;
  IF line_count < 2 OR line_count > 64 OR total <> 0 THEN
    RAISE EXCEPTION 'Ledger journal must have 2 to 64 balanced USD entries' USING ERRCODE='23514';
  END IF;
  RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER ledger_journal_balanced AFTER INSERT ON ledger_journals
DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_ledger_journal_balance();
--> statement-breakpoint
CREATE FUNCTION check_ledger_available_balance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE total numeric;
BEGIN
  IF NEW.bucket IN ('CARD_AVAILABLE','MERCHANT_AVAILABLE') THEN
    SELECT coalesce(sum("deltaMinor"),0) INTO total FROM ledger_entries
      WHERE "serviceId"=NEW."serviceId" AND bucket=NEW.bucket
        AND "cardId" IS NOT DISTINCT FROM NEW."cardId"
        AND "merchantUnitId" IS NOT DISTINCT FROM NEW."merchantUnitId";
    IF total < 0 THEN
      RAISE EXCEPTION 'Ledger available funds cannot be negative' USING ERRCODE='23514';
    END IF;
  END IF;
  RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER ledger_available_nonnegative AFTER INSERT ON ledger_entries
DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_ledger_available_balance();


--> statement-breakpoint
-- Reviewed supplement: src/modules/acquiring/constraints.sql
-- Identity, attribution and delegation history survive every ordinary status change.
CREATE FUNCTION guard_merchant_identity() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP IN ('DELETE','TRUNCATE') THEN RAISE EXCEPTION 'Merchant provenance cannot be removed' USING ERRCODE='23514'; END IF;
  IF TG_TABLE_NAME='merchant_units' THEN
    IF ROW(NEW.id,NEW.kind,NEW."masterId",NEW."masterServiceId",NEW."createdAt") IS DISTINCT FROM ROW(OLD.id,OLD.kind,OLD."masterId",OLD."masterServiceId",OLD."createdAt") THEN RAISE EXCEPTION 'Merchant identity is immutable' USING ERRCODE='23514'; END IF;
  ELSIF TG_TABLE_NAME='payment_channels' THEN
    IF ROW(NEW.id,NEW."serviceId",NEW."merchantUnitId",NEW."creatorId",NEW."creatorAssignmentId",NEW."creatorBasis",NEW."createdAt") IS DISTINCT FROM ROW(OLD.id,OLD."serviceId",OLD."merchantUnitId",OLD."creatorId",OLD."creatorAssignmentId",OLD."creatorBasis",OLD."createdAt") THEN RAISE EXCEPTION 'Channel origin is immutable' USING ERRCODE='23514'; END IF;
  ELSIF TG_TABLE_NAME='merchant_assignments' THEN
    IF ROW(NEW.id,NEW."merchantUnitId",NEW."personId",NEW."sourceAssignmentId",NEW."sourcePrimaryPersonId",NEW."sourceMembershipVersion",NEW."createdAt",NEW."expiresAt") IS DISTINCT FROM ROW(OLD.id,OLD."merchantUnitId",OLD."personId",OLD."sourceAssignmentId",OLD."sourcePrimaryPersonId",OLD."sourceMembershipVersion",OLD."createdAt",OLD."expiresAt") OR (OLD.state='REVOKED' AND NEW.state<>'REVOKED') THEN RAISE EXCEPTION 'Assignment origin is immutable and revoked access cannot revive' USING ERRCODE='23514'; END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER merchant_unit_identity BEFORE UPDATE OR DELETE ON merchant_units FOR EACH ROW EXECUTE FUNCTION guard_merchant_identity();
CREATE TRIGGER merchant_unit_no_truncate BEFORE TRUNCATE ON merchant_units FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_identity();
CREATE TRIGGER payment_channel_identity BEFORE UPDATE OR DELETE ON payment_channels FOR EACH ROW EXECUTE FUNCTION guard_merchant_identity();
CREATE TRIGGER payment_channel_no_truncate BEFORE TRUNCATE ON payment_channels FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_identity();
CREATE TRIGGER merchant_assignment_identity BEFORE UPDATE OR DELETE ON merchant_assignments FOR EACH ROW EXECUTE FUNCTION guard_merchant_identity();
CREATE TRIGGER merchant_assignment_no_truncate BEFORE TRUNCATE ON merchant_assignments FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_identity();
CREATE FUNCTION guard_merchant_record() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Merchant command and history records are immutable' USING ERRCODE='23514'; END $$;
CREATE TRIGGER merchant_unit_command_immutable BEFORE UPDATE OR DELETE ON merchant_unit_commands FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_unit_command_no_truncate BEFORE TRUNCATE ON merchant_unit_commands FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_service_command_immutable BEFORE UPDATE OR DELETE ON merchant_service_commands FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_service_command_no_truncate BEFORE TRUNCATE ON merchant_service_commands FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER payment_channel_command_immutable BEFORE UPDATE OR DELETE ON payment_channel_commands FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER payment_channel_command_no_truncate BEFORE TRUNCATE ON payment_channel_commands FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_unit_event_immutable BEFORE UPDATE OR DELETE ON merchant_unit_events FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_unit_event_no_truncate BEFORE TRUNCATE ON merchant_unit_events FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_application_event_immutable BEFORE UPDATE OR DELETE ON merchant_application_events FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_application_event_no_truncate BEFORE TRUNCATE ON merchant_application_events FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_application_command_immutable BEFORE UPDATE OR DELETE ON merchant_application_commands FOR EACH ROW EXECUTE FUNCTION guard_merchant_record();
CREATE TRIGGER merchant_application_command_no_truncate BEFORE TRUNCATE ON merchant_application_commands FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_record();
CREATE FUNCTION check_channel_creator() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW."creatorBasis"='MERCHANT_ASSIGNMENT' THEN
   IF NOT EXISTS (SELECT 1 FROM merchant_assignments a WHERE a.id=NEW."creatorAssignmentId" AND a."merchantUnitId"=NEW."merchantUnitId" AND a."personId"=NEW."creatorId") THEN RAISE EXCEPTION 'Channel assignment does not match creator and merchant' USING ERRCODE='23514'; END IF;
 ELSE
   IF NOT EXISTS (SELECT 1 FROM services s WHERE s.id=NEW."serviceId" AND s.kind='MERCHANT' AND s."primaryPersonId"=NEW."creatorId") THEN RAISE EXCEPTION 'Channel primary creator does not match Merchant service' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER payment_channel_creator BEFORE INSERT ON payment_channels FOR EACH ROW EXECUTE FUNCTION check_channel_creator();
CREATE FUNCTION check_merchant_assignment_origin() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE parent merchant_assignments%ROWTYPE; root_service uuid; primary_person uuid;
BEGIN
 SELECT "masterServiceId" INTO root_service FROM merchant_units WHERE id=NEW."merchantUnitId";
 SELECT "primaryPersonId" INTO primary_person FROM services WHERE id=root_service AND kind='MERCHANT';
 IF NEW."sourceAssignmentId" IS NOT NULL THEN
   SELECT * INTO parent FROM merchant_assignments WHERE id=NEW."sourceAssignmentId" AND "merchantUnitId"=NEW."merchantUnitId";
   IF NOT FOUND OR parent.id=NEW.id OR NEW."expiresAt">parent."expiresAt" THEN RAISE EXCEPTION 'Invalid merchant assignment ancestor' USING ERRCODE='23514'; END IF;
 ELSE
   IF NEW."sourcePrimaryPersonId" IS DISTINCT FROM primary_person OR NOT EXISTS (SELECT 1 FROM service_members m WHERE m."serviceId"=root_service AND m."personId"=primary_person AND m.state='ACCEPTED' AND m.version=NEW."sourceMembershipVersion") THEN RAISE EXCEPTION 'Invalid primary membership origin' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER merchant_assignment_origin BEFORE INSERT ON merchant_assignments FOR EACH ROW EXECUTE FUNCTION check_merchant_assignment_origin();


--> statement-breakpoint
-- Reviewed supplement: src/modules/acquiring/operations-constraints.sql
-- Append after the operation tables and ledger constraints in the same new migration.
CREATE FUNCTION guard_merchant_operation_history() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Merchant operation history is immutable' USING ERRCODE='23514';
END $$;
--> statement-breakpoint
CREATE TRIGGER merchant_test_payment_immutable BEFORE UPDATE OR DELETE ON merchant_test_payments
FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER merchant_test_payment_no_truncate BEFORE TRUNCATE ON merchant_test_payments
FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER merchant_test_refund_immutable BEFORE UPDATE OR DELETE ON merchant_test_refunds
FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER merchant_test_refund_no_truncate BEFORE TRUNCATE ON merchant_test_refunds
FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER merchant_test_payout_immutable BEFORE UPDATE OR DELETE ON merchant_test_payouts
FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER merchant_test_payout_no_truncate BEFORE TRUNCATE ON merchant_test_payouts
FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER merchant_operation_command_immutable BEFORE UPDATE OR DELETE ON merchant_operation_commands
FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE TRIGGER merchant_operation_command_no_truncate BEFORE TRUNCATE ON merchant_operation_commands
FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_history();
--> statement-breakpoint
CREATE FUNCTION guard_merchant_operation_configuration() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP <> 'UPDATE' THEN
    RAISE EXCEPTION 'Merchant configuration cannot be removed or reset' USING ERRCODE='23514';
  END IF;
  IF TG_TABLE_NAME='merchant_test_gateways' THEN
    IF ROW(NEW."serviceId",NEW.processor,NEW."createdAt") IS DISTINCT FROM ROW(OLD."serviceId",OLD.processor,OLD."createdAt") THEN
      RAISE EXCEPTION 'Gateway identity is immutable' USING ERRCODE='23514';
    END IF;
  ELSIF TG_TABLE_NAME='merchant_test_enrollments' THEN
    IF ROW(NEW."merchantUnitId",NEW."serviceId",NEW."createdAt") IS DISTINCT FROM ROW(OLD."merchantUnitId",OLD."serviceId",OLD."createdAt") THEN
      RAISE EXCEPTION 'Merchant enrollment identity is immutable' USING ERRCODE='23514';
    END IF;
  ELSE
    IF ROW(NEW."channelId",NEW."merchantUnitId",NEW."serviceId",NEW."createdAt") IS DISTINCT FROM ROW(OLD."channelId",OLD."merchantUnitId",OLD."serviceId",OLD."createdAt") THEN
      RAISE EXCEPTION 'Channel activation identity is immutable' USING ERRCODE='23514';
    END IF;
  END IF;
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER merchant_test_gateway_identity BEFORE UPDATE OR DELETE ON merchant_test_gateways
FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_configuration();
--> statement-breakpoint
CREATE TRIGGER merchant_test_gateway_no_truncate BEFORE TRUNCATE ON merchant_test_gateways
FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_configuration();
--> statement-breakpoint
CREATE TRIGGER merchant_test_enrollment_identity BEFORE UPDATE OR DELETE ON merchant_test_enrollments
FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_configuration();
--> statement-breakpoint
CREATE TRIGGER merchant_test_enrollment_no_truncate BEFORE TRUNCATE ON merchant_test_enrollments
FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_configuration();
--> statement-breakpoint
CREATE TRIGGER merchant_channel_activation_identity BEFORE UPDATE OR DELETE ON merchant_channel_activations
FOR EACH ROW EXECUTE FUNCTION guard_merchant_operation_configuration();
--> statement-breakpoint
CREATE TRIGGER merchant_channel_activation_no_truncate BEFORE TRUNCATE ON merchant_channel_activations
FOR EACH STATEMENT EXECUTE FUNCTION guard_merchant_operation_configuration();
--> statement-breakpoint
CREATE FUNCTION check_merchant_operation_provenance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE expected_kind text; debit_bucket text; credit_bucket text; journal_record record; source_record record; line_count bigint; debit_count bigint; credit_count bigint;
BEGIN
  IF TG_TABLE_NAME='merchant_test_payments' THEN
    -- The immutable snapshot cannot lie about one-time usage to evade its unique index.
    SELECT version,usage,description,"amountMinor",currency INTO source_record FROM payment_channels
      WHERE id=NEW."channelId" AND "merchantUnitId"=NEW."merchantUnitId" AND "serviceId"=NEW."serviceId";
    IF NOT FOUND OR ROW(NEW."channelVersion",NEW."channelUsage",NEW.description,NEW."amountMinor",NEW.currency)
       IS DISTINCT FROM ROW(source_record.version,source_record.usage,source_record.description,source_record."amountMinor",source_record.currency) THEN
      RAISE EXCEPTION 'Payment channel snapshot does not match its origin' USING ERRCODE='23514';
    END IF;
    IF NEW.outcome='DECLINED' THEN RETURN NEW; END IF;
    expected_kind:='MERCHANT_PAYMENT'; debit_bucket:='GATEWAY_CLEARING'; credit_bucket:='MERCHANT_AVAILABLE';
  ELSIF TG_TABLE_NAME='merchant_test_refunds' THEN
    SELECT outcome,"amountMinor",currency INTO source_record FROM merchant_test_payments
      WHERE id=NEW."paymentId" AND "merchantUnitId"=NEW."merchantUnitId" AND "serviceId"=NEW."serviceId";
    IF NOT FOUND OR source_record.outcome<>'APPROVED' OR ROW(NEW."amountMinor",NEW.currency) IS DISTINCT FROM ROW(source_record."amountMinor",source_record.currency) THEN
      RAISE EXCEPTION 'Refund must match approved original principal' USING ERRCODE='23514';
    END IF;
    expected_kind:='MERCHANT_REFUND'; debit_bucket:='MERCHANT_AVAILABLE'; credit_bucket:='GATEWAY_CLEARING';
  ELSE
    expected_kind:='MERCHANT_PAYOUT'; debit_bucket:='MERCHANT_AVAILABLE'; credit_bucket:='PAYOUT_CLEARING';
  END IF;
  SELECT kind,"referenceId",currency,"creationTransaction" INTO journal_record FROM ledger_journals WHERE id=NEW."journalId";
  IF NOT FOUND OR journal_record.kind<>expected_kind OR journal_record."referenceId"<>NEW.id OR journal_record.currency<>NEW.currency OR journal_record."creationTransaction"<>txid_current() THEN
    RAISE EXCEPTION 'Merchant operation must reference its own journal' USING ERRCODE='23514';
  END IF;
  SELECT count(*),
    count(*) FILTER (WHERE "serviceId"=NEW."serviceId" AND "merchantUnitId"=NEW."merchantUnitId" AND "cardId" IS NULL AND bucket=debit_bucket AND "deltaMinor"=-NEW."amountMinor" AND currency=NEW.currency),
    count(*) FILTER (WHERE "serviceId"=NEW."serviceId" AND "merchantUnitId"=NEW."merchantUnitId" AND "cardId" IS NULL AND bucket=credit_bucket AND "deltaMinor"=NEW."amountMinor" AND currency=NEW.currency)
    INTO line_count,debit_count,credit_count FROM ledger_entries WHERE "journalId"=NEW."journalId";
  IF line_count<>2 OR debit_count<>1 OR credit_count<>1 THEN
    RAISE EXCEPTION 'Merchant operation journal does not match scoped principal' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER merchant_test_payment_provenance BEFORE INSERT ON merchant_test_payments
FOR EACH ROW EXECUTE FUNCTION check_merchant_operation_provenance();
--> statement-breakpoint
CREATE TRIGGER merchant_test_refund_provenance BEFORE INSERT ON merchant_test_refunds
FOR EACH ROW EXECUTE FUNCTION check_merchant_operation_provenance();
--> statement-breakpoint
CREATE TRIGGER merchant_test_payout_provenance BEFORE INSERT ON merchant_test_payouts
FOR EACH ROW EXECUTE FUNCTION check_merchant_operation_provenance();


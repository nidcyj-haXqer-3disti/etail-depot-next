-- Preserve a terminal's creation purpose before its recipient is invited.
-- This field does not grant access or change financial ownership.
ALTER TABLE merchant_terminals ADD COLUMN "intendedUse" text NOT NULL DEFAULT 'SELF';
ALTER TABLE merchant_terminals ADD CONSTRAINT merchant_terminal_intended_use CHECK ("intendedUse" IN ('SELF','OTHER'));

UPDATE merchant_terminals t SET "intendedUse"='OTHER'
WHERE EXISTS (
 SELECT 1 FROM terminal_assignments a
 JOIN services s ON s.id=t."masterServiceId"
 JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" AND m.state='ACCEPTED'
 WHERE a."terminalId"=t.id AND a.state='ACCEPTED'
 AND (a."expiresAt" IS NULL OR a."expiresAt">transaction_timestamp())
 AND a."grantedByPersonId"=s."primaryPersonId" AND a."ownerMembershipVersion"=m.version
) OR EXISTS (
 SELECT 1 FROM service_invitations i
 JOIN terminal_invitation_terms terms ON terms."invitationId"=i.id
 JOIN services s ON s.id=t."masterServiceId"
 JOIN service_members m ON m."serviceId"=s.id AND m."personId"=s."primaryPersonId" AND m.state='ACCEPTED'
 WHERE terms."terminalId"=t.id AND i.status='PENDING' AND i."expiresAt">transaction_timestamp()
 AND i."inviterId"=s."primaryPersonId" AND terms."grantedByPersonId"=s."primaryPersonId" AND terms."ownerMembershipVersion"=m.version
 AND (terms."accessExpiresAt" IS NULL OR terms."accessExpiresAt">transaction_timestamp())
);

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

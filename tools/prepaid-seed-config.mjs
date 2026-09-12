// The sole migration-owned row permitted in an otherwise empty D69 generation.
// This verifier performs SELECTs only and is also used by read-only startup.
export async function verifyPrepaidSeedConfig(client) {
  const table = await client.query("SELECT to_regclass('public.prepaid_cutover') AS name");
  if (!table.rows[0]?.name) throw new Error('Apply the reviewed D69 migrations before preparing or starting this generation.');
  const result = await client.query(`SELECT count(*)=1 AND coalesce(bool_and(
    id='D69' AND "activatedAt" IS NOT NULL AND isfinite("activatedAt")
    AND "activatedAt"<=clock_timestamp()
    AND to_jsonb(cutover)=jsonb_build_object('id',id,'activatedAt',"activatedAt")
  ),false) AS valid FROM public.prepaid_cutover AS cutover`);
  if (result.rows[0]?.valid !== true) throw new Error('D69 cutover must contain exactly its one valid migration-owned configuration row.');
  const schema = await client.query(`SELECT
    (SELECT array_agg(column_name||':'||data_type||':'||is_nullable ORDER BY ordinal_position)
     FROM information_schema.columns WHERE table_schema='public' AND table_name='prepaid_cutover')
      = ARRAY['id:text:NO','activatedAt:timestamp with time zone:NO']::text[]
    AND EXISTS(
      SELECT 1 FROM pg_trigger
      WHERE tgrelid='public.prepaid_cutover'::regclass
        AND tgname='prepaid_cutover_immutable' AND NOT tgisinternal
        AND tgenabled IN ('O','A') AND tgtype=58 AND tgnargs=0
        AND tgfoid='public.guard_merchant_operation_history()'::regprocedure
    ) AS valid`);
  if (schema.rows[0]?.valid !== true) throw new Error('D69 cutover schema and immutable migration guard must match exactly.');
}

// D73 contributes one immutable migration-owned configuration row to a fresh database.
// Validate its complete shape before permitting this exception to the empty seed check.
export async function verifyMoneySeedConfig(client) {
  const table = await client.query("SELECT to_regclass('public.money_model_cutover') AS name");
  if (!table.rows[0]?.name) throw new Error('Apply the reviewed D73 migrations before preparing this generation.');
  const result = await client.query(`SELECT count(*)=1 AND coalesce(bool_and(
    id='D73' AND "creationTransaction">0 AND "activatedAt" IS NOT NULL
    AND isfinite("activatedAt") AND "activatedAt"<=clock_timestamp()
    AND to_jsonb(cutover)=jsonb_build_object('id',id,'creationTransaction',"creationTransaction",'activatedAt',"activatedAt")
  ),false) AS valid FROM public.money_model_cutover AS cutover`);
  if (result.rows[0]?.valid !== true) throw new Error('D73 cutover must contain exactly its one valid migration-owned configuration row.');
  const schema = await client.query(`SELECT
    (SELECT array_agg(column_name||':'||data_type||':'||is_nullable ORDER BY ordinal_position)
     FROM information_schema.columns WHERE table_schema='public' AND table_name='money_model_cutover')
      = ARRAY['id:text:NO','creationTransaction:bigint:NO','activatedAt:timestamp with time zone:NO']::text[]
    AND EXISTS(
      SELECT 1 FROM pg_trigger
      WHERE tgrelid='public.money_model_cutover'::regclass
        AND tgname='money_model_cutover_immutable' AND NOT tgisinternal
        AND tgenabled IN ('O','A') AND tgtype=58 AND tgnargs=0
        AND tgfoid='public.guard_merchant_operation_history()'::regprocedure
    ) AS valid`);
  if (schema.rows[0]?.valid !== true) throw new Error('D73 cutover schema and immutable migration guard must match exactly.');
}

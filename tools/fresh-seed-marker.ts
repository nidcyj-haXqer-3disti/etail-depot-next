import type pg from "pg";
const {verifyPrepaidSeedConfig}=await import(new URL("./prepaid-seed-config.mjs",import.meta.url).href) as {
  verifyPrepaidSeedConfig:(client:pg.Client)=>Promise<void>;
};
function assert(value:unknown,message:string):asserts value {if(!value)throw new Error(message);}

export async function prepareSeedMarker(client:pg.Client,seedKey:string) {
  assert(seedKey==="fresh-services-d69","Unexpected prepaid seed generation.");
  await verifyPrepaidSeedConfig(client);
  const marker=await client.query("SELECT to_regclass('public._etail_preview_seed') AS name");
  if(!marker.rows[0]?.name) {
    // Only the verified migration-owned cutover row is allowed alongside migration receipts.
    const tables=await client.query<{tablename:string}>("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename NOT IN ('_etail_local_migrations','prepaid_cutover')");
    for(const {tablename} of tables.rows) {
      const identifier='"'+tablename.replaceAll('"','""')+'"';
      const rows=await client.query(`SELECT EXISTS (SELECT 1 FROM public.${identifier}) AS populated`);
      assert(!rows.rows[0]?.populated,"Clean preview preparation refuses existing application records. Use a newly created marked database.");
    }
    const migrations=await client.query("SELECT to_regclass('public._etail_local_migrations') AS name");
    assert(migrations.rows[0]?.name,"Apply the reviewed migrations explicitly before preparing a clean preview.");
    await client.query("BEGIN");
    try {
      await client.query(`CREATE TABLE public._etail_preview_seed (
        key text PRIMARY KEY, state text NOT NULL CHECK (state IN ('PREPARING','COMPLETE')),
        started_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz,
        result jsonb NOT NULL DEFAULT '{}'::jsonb
      )`);
      await client.query("INSERT INTO public._etail_preview_seed (key,state) VALUES ($1,'PREPARING')",[seedKey]);
      await client.query("COMMIT");
    } catch(error) {await client.query("ROLLBACK");throw error;}
  }
  const rows=await client.query<{key:string;state:string;result:Record<string,unknown>}>("SELECT key,state,result FROM public._etail_preview_seed");
  assert(rows.rows.length===1&&rows.rows[0]?.key===seedKey,"Unexpected preview generation marker; refusing to adopt it.");
  assert(["PREPARING","COMPLETE"].includes(rows.rows[0]!.state),"Unexpected seed state; refusing to resume it.");
  return rows.rows[0]!;
}

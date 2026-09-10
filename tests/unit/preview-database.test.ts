import { describe, expect, it } from "vitest";
const { databaseConnectionSettings } = await import(new URL("../../tools/run-with-database.mjs", import.meta.url).href) as {
  databaseConnectionSettings(options?: { preview?: boolean; env?: Record<string,string|undefined> }): {
    ci: boolean; preview: boolean; databaseName: string; administration: string; target: string;
  };
};

const local = "postgres://etail_local@127.0.0.1:55439/etail_depot_next_services_test";
const clean = local.replace("_test", "_preview");
const isolated = { APP_ENV: "local", ENABLE_REAL_MONEY: "false", DATABASE_URL: local };

describe("fixed fresh preview and test targets", () => {
  it("selects fixed names by mode only when no explicit conflicting database was supplied", () => {
    const preview = databaseConnectionSettings({preview:true,env:{APP_ENV:"local"}});
    expect(preview.target).toBe(clean); expect(preview.databaseName).toBe("etail_depot_next_services_preview");
    expect(new URL(preview.administration).pathname).toBe("/etail_depot_next");
    expect(databaseConnectionSettings({env:isolated}).target).toBe(local);
  });
  it("rejects mode mismatches and every prior recovery database", () => {
    expect(()=>databaseConnectionSettings({preview:true,env:isolated})).toThrow("exactly match");
    expect(()=>databaseConnectionSettings({env:{...isolated,DATABASE_URL:clean}})).toThrow("exactly match");
    for(const name of ["etail_depot_next","etail_depot_next_test","etail_depot_next_preview_v2"]) {
      expect(()=>databaseConnectionSettings({env:{...isolated,DATABASE_URL:`postgres://etail_local@127.0.0.1:55439/${name}`}})).toThrow("recovery-only");
    }
  });
  it.each([{CI:"true"},{CI:"1"},{NETLIFY:"true"},{SITE_ID:"fictional-site"},{CONTEXT:"deploy-preview"},{APP_ENV:"production"},{APP_ENV:"preview"},{ENABLE_REAL_MONEY:"true"}])("rejects nonlocal/real-money preview %j",change=>{
    expect(()=>databaseConnectionSettings({preview:true,env:{...isolated,DATABASE_URL:clean,...change}})).toThrow();
  });
  it.each([local.replace("127.0.0.1","remote.example.test"),local.replace(":55439",":5432"),local.replace("etail_local","other_role"),local+"?",local+"#",local+"?host=other",local.replace("etail_local@","etail_local:password@"),local.replace("127.0.0.1","127%2e0%2e0%2e1"),local.replace("/etail_depot_next_services_test","/wrong/../etail_depot_next_services_test")])("rejects unsafe or noncanonical URL before connection",raw=>{
    expect(()=>databaseConnectionSettings({env:{...isolated,DATABASE_URL:raw}})).toThrow();
  });
  it("restricts CI to the new disposable test database",()=>{
    const env={CI:"true",APP_ENV:"test",ENABLE_REAL_MONEY:"false",DATABASE_URL:"postgresql://etail_ci@127.0.0.1:5432/etail_depot_next_services_test"};
    expect(databaseConnectionSettings({env})).toMatchObject({ci:true,preview:false,databaseName:"etail_depot_next_services_test"});
    expect(()=>databaseConnectionSettings({preview:true,env})).toThrow("never CI or hosted");
    expect(()=>databaseConnectionSettings({env:{...env,DATABASE_URL:undefined}})).toThrow("explicit");
    expect(()=>databaseConnectionSettings({env:{...env,DATABASE_URL:env.DATABASE_URL.replace("services_test","test")}})).toThrow("exactly match");
  });
});

const {verifyPreviewDatabase,previewDatabaseComment}=await import(new URL("../../tools/clean-preview-target.mjs",import.meta.url).href) as {
  previewDatabaseComment:string;
  verifyPreviewDatabase:(client:{query:(query:string,parameters?:unknown[])=>Promise<{rows:Record<string,unknown>[]}>},options?:{requireComplete?:boolean})=>Promise<void>;
};

describe("clean preview database ownership and preparation barrier",()=>{
  const confirmed={version:"PostgreSQL 18.6",current_database:"etail_depot_next_services_preview",current_user:"etail_local",owner:"etail_local",address:"127.0.0.1/32",marker:previewDatabaseComment};
  function database(identity:Record<string,unknown>=confirmed,state:string|null="COMPLETE",table=true) {
    const calls:string[]=[];
    return {calls,query:async(query:string)=>{
      calls.push(query);
      if(query.includes("FROM pg_database"))return {rows:[identity]};
      if(query.includes("to_regclass"))return {rows:[{name:table?"_etail_preview_seed":null}]};
      if(query.startsWith("SELECT state"))return {rows:state?[{state}]:[]};
      throw new Error("Unexpected query; preview startup must remain read-only");
    }};
  }
  it("accepts only the marked completed generation without writing or seeding",async()=>{
    const db=database();await verifyPreviewDatabase(db);
    expect(db.calls).toHaveLength(3);expect(db.calls.every(query=>query.trimStart().startsWith("SELECT"))).toBe(true);
  });
  it.each([
    {current_database:"etail_depot_next"},{current_database:"etail_depot_next_test"},{current_user:"another_role"},
    {owner:"another_role"},{address:"10.0.0.10/32"},{marker:null},{marker:"unrelated project"},{version:"PGlite"},
  ])("rejects an unowned or unexpected generation: %j",async patch=>{
    await expect(verifyPreviewDatabase(database({...confirmed,...patch}))).rejects.toThrow("explicitly owned");
  });
  it.each(["PREPARING",null])("fails closed for incomplete preparation %s",async state=>{
    await expect(verifyPreviewDatabase(database(confirmed,state))).rejects.toThrow("incomplete");
  });
  it("does not manufacture a missing seed marker",async()=>{
    const db=database(confirmed,null,false);
    await expect(verifyPreviewDatabase(db)).rejects.toThrow("never seeds");expect(db.calls).toHaveLength(2);
  });
  it("allows explicit preparation to inspect a new marked database without disabling ownership checks",async()=>{
    const db=database(confirmed,null,false);await verifyPreviewDatabase(db,{requireComplete:false});expect(db.calls).toHaveLength(1);
    await expect(verifyPreviewDatabase(database({...confirmed,marker:null}),{requireComplete:false})).rejects.toThrow("explicitly owned");
  });
});

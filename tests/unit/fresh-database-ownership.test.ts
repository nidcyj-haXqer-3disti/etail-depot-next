import {describe,expect,it} from "vitest";
const runner=await import(new URL("../../tools/run-with-database.mjs",import.meta.url).href) as {
 assertDatabaseServer:(actual:Record<string,unknown>,settings:Record<string,unknown>)=>void;
 assertFreshDatabaseOwnership:(existing:Record<string,unknown>,settings:Record<string,unknown>)=>void;
};
const local={ci:false,preview:false};
const identity={version:"PostgreSQL 18.6 on arm64",current_database:"etail_depot_next",current_user:"etail_local",address:"127.0.0.1/32",container_address:false};
describe("fresh database catalog identity and collision guards",()=>{
 it("requires the pinned native admin identity or the exact CI test identity",()=>{
  expect(()=>runner.assertDatabaseServer(identity,local)).not.toThrow();
  expect(()=>runner.assertDatabaseServer({...identity,current_database:"etail_depot_next_services_test",current_user:"etail_ci",address:"172.18.0.2/32",container_address:true},{ci:true,preview:false})).not.toThrow();
 });
 it.each([{version:"PostgreSQL 18.60"},{current_database:"postgres"},{current_user:"postgres"},{address:"10.0.0.2/32",container_address:true}])("refuses mismatched local server %j",patch=>{
  expect(()=>runner.assertDatabaseServer({...identity,...patch},local)).toThrow();
 });
 it("accepts only exact marked ownership and refuses adoption on same-name collisions",()=>{
  const marker="ETAIL_DEPOT_NEXT_GREENFIELD_2026:fresh-services-v1:test";
  expect(()=>runner.assertFreshDatabaseOwnership({owner:"etail_local",marker},local)).not.toThrow();
  for(const row of [{owner:"etail_local",marker:null},{owner:"someone_else",marker},{owner:"etail_local",marker:marker.replace(":test",":preview")}]) expect(()=>runner.assertFreshDatabaseOwnership(row,local)).toThrow("collision");
 });
});

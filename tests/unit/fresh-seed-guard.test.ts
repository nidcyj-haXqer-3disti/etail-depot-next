import {describe,it,expect,vi} from "vitest";
import type pg from "pg";
import {prepareSeedMarker} from "../../tools/fresh-seed-marker";

const key="fresh-services-d69";
function client(responses:unknown[][]) {
  responses=[[{name:"prepaid_cutover"}],[{valid:true}],[{valid:true}],...responses];
  const query=vi.fn<(query:string,parameters?:unknown[])=>Promise<{rows:unknown[]}>>().mockImplementation(async()=>({rows:responses.shift()??[]}));
  return {query,connection:{query} as unknown as pg.Client};
}
describe("one-time fresh service seed marker",()=>{
  it("returns completed state without creating or changing any records",async()=>{
    const result={primaryId:"fictional-primary",savedEdits:true};
    const test=client([[{name:"_etail_preview_seed"}],[{key,state:"COMPLETE",result}]]);
    expect(await prepareSeedMarker(test.connection,key)).toEqual({key,state:"COMPLETE",result});
    expect(test.query.mock.calls.every(args=>String(args[0]).trimStart().startsWith("SELECT"))).toBe(true);
    expect(test.query).toHaveBeenCalledTimes(5);
    expect(test.query.mock.calls.slice(3).map(args=>String(args[0]))).toEqual([
      "SELECT to_regclass('public._etail_preview_seed') AS name",
      "SELECT key,state,result FROM public._etail_preview_seed",
    ]);
  });
  it("only resumes the same explicitly incomplete generation",async()=>{
    const test=client([[{name:"_etail_preview_seed"}],[{key,state:"PREPARING",result:{}}]]);
    expect((await prepareSeedMarker(test.connection,key)).state).toBe("PREPARING");
    expect(test.query).toHaveBeenCalledTimes(5);
  });
  it.each([
    {rows:[{key:"retired-preview",state:"COMPLETE",result:{}}]},
    {rows:[{key:"fresh-services-v1",state:"COMPLETE",result:{}}]},
    {rows:[{key,state:"COMPLETE",result:{}},{key:"extra",state:"COMPLETE",result:{}}]},
    {rows:[{key,state:"UNKNOWN",result:{}}]},
    {rows:[]},
  ])("rejects foreign, duplicate, missing or corrupt marker rows (%j)",async ({rows})=>{
    const test=client([[{name:"_etail_preview_seed"}],rows]);
    await expect(prepareSeedMarker(test.connection,key)).rejects.toThrow(/Unexpected/);
    expect(test.query).toHaveBeenCalledTimes(5);
  });
  it("refuses to adopt an application table containing even one record",async()=>{
    const test=client([[{name:null}],[{tablename:"people"}],[{populated:true}]]);
    await expect(prepareSeedMarker(test.connection,key)).rejects.toThrow("refuses existing application records");
    expect(test.query).toHaveBeenCalledTimes(6);
  });
  it("requires migrations before creating a marker",async()=>{
    const test=client([[{name:null}],[],[{name:null}]]);
    await expect(prepareSeedMarker(test.connection,key)).rejects.toThrow("Apply the reviewed migrations");
    expect(test.query).toHaveBeenCalledTimes(6);
  });
  it("allows only the verified configuration row before creating a fresh marker",async()=>{
    const test=client([
      [{name:null}],[{tablename:"people"}],[{populated:false}],
      [{name:"_etail_local_migrations"}],[],[],[],[],
      [{key,state:"PREPARING",result:{}}],
    ]);
    expect((await prepareSeedMarker(test.connection,key)).state).toBe("PREPARING");
    const queries=test.query.mock.calls.map(([text])=>text.trimStart());
    expect(queries).toHaveLength(12);
    expect(queries[4]).toContain("tablename NOT IN ('_etail_local_migrations','prepaid_cutover')");
    expect(queries.filter(text=>!text.startsWith("SELECT")).map(text=>text.split(/\s+/)[0])).toEqual(["BEGIN","CREATE","INSERT","COMMIT"]);
  });
});

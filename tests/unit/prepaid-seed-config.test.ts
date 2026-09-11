import {describe,expect,it,vi} from "vitest";
const {verifyPrepaidSeedConfig}=await import(new URL("../../tools/prepaid-seed-config.mjs",import.meta.url).href) as {
  verifyPrepaidSeedConfig:(client:{query:(text:string)=>Promise<{rows:unknown[]}>})=>Promise<void>;
};
function fixture(rows:unknown[][]=[[{name:"prepaid_cutover"}],[{valid:true}],[{valid:true}]]){
  const query=vi.fn<(text:string)=>Promise<{rows:unknown[]}>>().mockImplementation(async()=>({rows:rows.shift()??[]}));
  return {query};
}
describe("exact migration-owned D69 configuration exception",()=>{
  it("accepts the verified row and immutable schema with SELECTs only",async()=>{
    const client=fixture();await verifyPrepaidSeedConfig(client);
    expect(client.query).toHaveBeenCalledTimes(3);
    expect(client.query.mock.calls.every(([text])=>text.trimStart().startsWith("SELECT"))).toBe(true);
  });
  it("refuses a missing cutover without creating it",async()=>{
    const client=fixture([[{name:null}]]);
    await expect(verifyPrepaidSeedConfig(client)).rejects.toThrow("reviewed D69 migrations");
    expect(client.query).toHaveBeenCalledTimes(1);
  });
  it.each([{rows:[{valid:false}]},{rows:[]}])("refuses an invalid or missing row-validation result %j",async ({rows})=>{
    const client=fixture([[{name:"prepaid_cutover"}],rows]);
    await expect(verifyPrepaidSeedConfig(client)).rejects.toThrow("exactly its one valid");
    expect(client.query).toHaveBeenCalledTimes(2);
  });
  it.each([{rows:[{valid:false}]},{rows:[]}])("refuses invalid schema or an absent immutable guard %j",async ({rows})=>{
    const client=fixture([[{name:"prepaid_cutover"}],[{valid:true}],rows]);
    await expect(verifyPrepaidSeedConfig(client)).rejects.toThrow("schema and immutable");
    expect(client.query).toHaveBeenCalledTimes(3);
  });
});

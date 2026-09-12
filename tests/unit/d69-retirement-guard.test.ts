import {describe,expect,it} from "vitest";
const {RETIREMENTS,classifyRetirementCatalog}=await import(new URL("../../tools/retire-d69-databases.mjs",import.meta.url).href) as {
  RETIREMENTS:ReadonlyArray<{name:string;backup:string;oldMarker:string;newMarker:string}>;
  classifyRetirementCatalog:(rows:Record<string,unknown>[],plan?:Record<string,unknown>)=>"READY"|"RETIRED";
};
const projectKey="ETAIL_DEPOT_NEXT_GREENFIELD_2026";
function fixture(){
  const sources=RETIREMENTS.map((item,index)=>({name:item.name,oid:String(41000+index),owner:"etail_local",marker:item.oldMarker,template:false,allowConnections:true}));
  const plan={projectKey,generation:"D69",method:"rename-existing-database",createdAt:"2026-09-12T00:00:00.000Z",sources:sources.map((row,index)=>({...row,backup:RETIREMENTS[index]!.backup}))};
  const backups=sources.map((row,index)=>({...row,name:RETIREMENTS[index]!.backup,allowConnections:false}));
  return {sources,plan,backups};
}
describe("fixed D69 retirement identity",()=>{
  it("accepts only the two original owned sources before first retirement",()=>{
    const {sources}=fixture();
    expect(classifyRetirementCatalog(sources)).toBe("READY");
  });
  it("recognizes an interrupted access-disable only with the original saved OIDs",()=>{
    const {sources,plan}=fixture();
    const interrupted=sources.map(row=>({...row,allowConnections:false}));
    expect(classifyRetirementCatalog(interrupted,plan)).toBe("READY");
    expect(()=>classifyRetirementCatalog(interrupted)).toThrow();
  });
  it("recognizes the preserved exact backup OIDs without requiring new databases",()=>{
    const {backups,plan}=fixture();
    expect(classifyRetirementCatalog(backups,plan)).toBe("RETIRED");
    expect(()=>classifyRetirementCatalog(backups)).toThrow();
  });
  it("accepts separately prepared D69 names without retiring them again",()=>{
    const {sources,backups,plan}=fixture();
    const fresh=sources.map((row,index)=>({...row,oid:String(51000+index),marker:RETIREMENTS[index]!.newMarker}));
    expect(classifyRetirementCatalog([...backups,fresh[0]!],plan)).toBe("RETIRED");
    expect(classifyRetirementCatalog([...backups,...fresh],plan)).toBe("RETIRED");
  });
  it.each([
    {owner:"another_owner"},{marker:null},{marker:"unrelated generation"},
    {template:true},{oid:"0"},{oid:"not-an-oid"},
  ])("rejects source identity substitution %j",change=>{
    const {sources}=fixture();
    expect(()=>classifyRetirementCatalog([{...sources[0],...change},sources[1]!])).toThrow();
  });
  it("rejects occupied backup names instead of adopting or overwriting them",()=>{
    const {sources,backups,plan}=fixture();
    expect(()=>classifyRetirementCatalog([...sources,backups[0]!])).toThrow();
    expect(()=>classifyRetirementCatalog([...sources,backups[0]!],plan)).toThrow();
  });
  it("rejects missing, partial or duplicate catalog states",()=>{
    const {sources,backups,plan}=fixture();
    for(const rows of [[],[sources[0]!],[sources[0]!,backups[1]!],[...sources,sources[0]!]]){
      expect(()=>classifyRetirementCatalog(rows,plan)).toThrow();
    }
  });
  it("rejects recreated, writable or swapped backups even with matching names",()=>{
    const {backups,plan}=fixture();
    for(const change of [{oid:"99999"},{allowConnections:true},{marker:RETIREMENTS[1]!.oldMarker}]){
      expect(()=>classifyRetirementCatalog([{...backups[0],...change},backups[1]!],plan)).toThrow();
    }
  });
  it("rejects an old generation or copied original OID at a recreated source name",()=>{
    const {sources,backups,plan}=fixture();
    expect(()=>classifyRetirementCatalog([...backups,sources[0]!],plan)).toThrow();
    expect(()=>classifyRetirementCatalog([...backups,{...sources[0],marker:RETIREMENTS[0]!.newMarker}],plan)).toThrow();
  });
  it("rejects another project's plan and any changed original identity",()=>{
    const {sources,plan}=fixture();
    expect(()=>classifyRetirementCatalog(sources,{...plan,projectKey:"OTHER"})).toThrow();
    expect(()=>classifyRetirementCatalog(sources,{...plan,generation:"D68"})).toThrow();
    expect(()=>classifyRetirementCatalog(sources,{...plan,sources:plan.sources.map(row=>({...row,oid:"90000"}))})).toThrow();
  });
});

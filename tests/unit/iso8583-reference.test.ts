import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ISO8583_PATH, REFERENCE_SOURCES, REFERENCE_SECTIONS, MESSAGE_TYPES, DATA_FIELDS, SOURCE_NOTES, referencePath, referenceEntry, referenceSection, referenceIdentity, sourceUrl, messageDigits, messageExplanation, bitmapPosition, iso8583Metadata, iso8583JsonLd } from "../../src/modules/public-site/iso8583-reference";
import { STANDARD_REFERENCE_PATHS } from "../../src/shared/standard-reference-paths";
import { canonicalOrigin, privateRobots, publicSitemap } from "../../src/modules/public-site/metadata";
import { forbiddenStatic } from "../../tools/public-artifact-policy";

const messages = REFERENCE_SECTIONS[0], fields = REFERENCE_SECTIONS[1];
const records = [{section:undefined,entry:undefined}, ...REFERENCE_SECTIONS.flatMap(section => [{section,entry:undefined}, ...(section.slug === "messages" ? MESSAGE_TYPES : section.slug === "fields" ? DATA_FIELDS : []).map(entry => ({section,entry}))])];
describe("Independent ISO 8583 implementation reference", () => {
  it("keeps exactly 251 distinct source backed pages in the exact reviewed package", () => {
    const paths = records.map(({section,entry}) => referencePath(section,entry));
    expect(paths).toHaveLength(251); expect(new Set(paths).size).toBe(251);
    expect(MESSAGE_TYPES).toHaveLength(150); expect(DATA_FIELDS).toHaveLength(97);
    expect([...paths].sort()).toEqual(STANDARD_REFERENCE_PATHS.filter(path=>path.startsWith(ISO8583_PATH)).sort());
    const sitemap = publicSitemap().map(x=>new URL(x.url).pathname);
    for (const path of paths) { expect(sitemap).not.toContain(path); expect(forbiddenStatic(path.slice(1)+".html")).toBe(false); expect(path).not.toContain("/2023/"); }
    expect(referenceSection("action-codes")).toBeUndefined();
    expect(referenceEntry(messages,"2199")).toBeUndefined();
    expect(referenceEntry(fields,"039")).toBeUndefined();
    expect(referenceEntry(fields,"4594")).toBeUndefined();
    for(const n of [...Array.from({length:8},(_,i)=>String(56+i)),...Array.from({length:23},(_,i)=>String(105+i))]) expect(referenceEntry(fields,n)).toBeUndefined();
  });
  it("preserves implementation identities, field formats and bitmap positions", () => {
    expect(MESSAGE_TYPES.find(x=>x.code==="0100")?.version).toBe("1987");
    const message = MESSAGE_TYPES.find(x=>x.code==="2100")!;
    expect(messageDigits(message).map(x=>x.value).join("")).toBe("2100");
    expect(message.version).toBe("2003");
    expect(message.function).toBe("request");
    const repeat = MESSAGE_TYPES.find(x=>x.code==="2421")!;
    expect(repeat.repeat).toBe(true);
    expect(messageExplanation(repeat).originNote).toContain("repeat");
    expect(messageExplanation(MESSAGE_TYPES.find(x=>x.code==="2110")!).originNote).toContain("origin category of the exchange");
    const f=(n:string)=>DATA_FIELDS.find(x=>x.code===n)!;
    expect(f("39").profiles.default_ascii).toMatchObject({data_enc:"ascii",len_type:0,max_len:2});
    expect(f("52").profiles.default).toMatchObject({data_enc:"b",max_len:8});
    expect(f("52").profiles.default_ascii).toMatchObject({data_enc:"ascii",max_len:16});
    expect(f("55").profiles.default).toMatchObject({data_enc:"b",len_type:3,max_len:255});
    expect(f("55").profiles.default_ascii).toMatchObject({data_enc:"ascii",len_type:3,max_len:510});
    expect(bitmapPosition("39")).toEqual({bitmap:"Primary",position:39,byte:5,bit:7});
    expect(bitmapPosition("70")).toEqual({bitmap:"Secondary",position:6,byte:1,bit:6});
  });
  it("includes pinned provenance, licence text and explicit source limits without the old tables", () => {
    expect(REFERENCE_SOURCES).toHaveLength(2);
    for(const source of REFERENCE_SOURCES) {
      expect(source.commit).toMatch(/^[a-f0-9]{40}$/); expect(source.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(source.url).toContain("/blob/"+source.commit+"/");
      const license=readFileSync("public"+source.licensePath,"utf8");
      expect(license).toContain(source.id==="moov"?"Apache License":"Copyright 2019-2020 Konstantin Novichikhin");
    }
    expect(readFileSync("public/licenses/iso8583-reference-NOTICE.txt","utf8")).toContain("Modifications:");
    expect(SOURCE_NOTES.some(x=>x.note.includes("2007")&&x.note.includes("2003"))).toBe(true);
    for(const entry of [...MESSAGE_TYPES,...DATA_FIELDS]) expect(sourceUrl(entry)).toMatch(/^https:\/\/github.com\/.+\/blob\/[a-f0-9]{40}\/.+#L[0-9]+-L[0-9]+$/);
    for(const path of ["src/modules/public-site/iso8583-data.json","src/modules/public-site/iso8583-source-notes.json","src/app/guides/iso-8583/2023"]) expect(existsSync(path)).toBe(false);
  });
  it("gives all pages unique titles, canonical URLs, precise citations and noindex metadata", () => {
    const titles=new Set<string>();
    for(const {section,entry} of records) {
      const identity=referenceIdentity(section,entry), metadata=iso8583Metadata(section,entry);
      expect(titles.has(identity.title)).toBe(false); titles.add(identity.title);
      expect(metadata.robots).toEqual(privateRobots);
      expect(metadata.alternates?.canonical).toBe(canonicalOrigin+identity.path);
      const graph=JSON.parse(iso8583JsonLd(section,entry))["@graph"];
      expect(graph[0].url).toBe(canonicalOrigin+identity.path);
      expect(graph[0].citation.every((url:string)=>url.startsWith("https://github.com/"))).toBe(true);
      expect(graph.some((node:{"@type":string})=>node["@type"]==="DefinedTerm")).toBe(false);
      expect(graph.find((node:{"@type":string})=>node["@type"]==="BreadcrumbList").itemListElement.at(-1).item).toBe(canonicalOrigin+identity.path);
    }
    expect(titles.size).toBe(251);
  });
});

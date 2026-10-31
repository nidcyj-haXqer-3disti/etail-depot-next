import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { ISO20022_PATH, ISO20022_SETS, codePeers, codeReplacement, codeUsageRestriction, isoCode, isoCodeSet, isoIdentity, isoJsonLd, isoMetadata } from "../../src/modules/public-site/iso20022-reference";
import { STANDARD_REFERENCE_PATHS } from "../../src/shared/standard-reference-paths";
import { canonicalOrigin, privateRobots } from "../../src/modules/public-site/metadata";
import { forbiddenStatic, localStandardPageSources, publicPageSources } from "../../tools/public-artifact-policy";

describe("ISO 20022 frozen reference collection", () => {
  it("exports exactly the validated registered inventory without opening other routes", () => {
    const paths = [ISO20022_PATH, ...ISO20022_SETS.flatMap(set => [set.path, ...set.codes.map(code => code.path)])];
    expect(ISO20022_SETS).toHaveLength(140);
    expect(paths).toHaveLength(3455);
    expect(new Set(paths).size).toBe(paths.length);
    expect([...paths].sort()).toEqual(STANDARD_REFERENCE_PATHS.filter(path => path.startsWith(ISO20022_PATH)).sort());
    expect(localStandardPageSources).toHaveLength(6);
    expect(publicPageSources).toHaveLength(38);
    expect(isoCodeSet("not-a-code-set")).toBeUndefined();
    const status = isoCodeSet("payment-transaction-status")!;
    expect(isoCode(status, "ACSP")).toBeUndefined();
    expect(isoCode(status, "invented")).toBeUndefined();
    expect(isoCode(status, "acsp")?.code).toBe("ACSP");
    for (const path of paths) expect(forbiddenStatic(path.slice(1) + ".html")).toBe(false);
  });
  it("preserves definitions, leading zeros, source identity and scoped codes", () => {
    let codes = 0, messages = 0, obsolete = 0;
    const identities = new Set<string>();
    for (const set of ISO20022_SETS) {
      messages += set.messages.length; obsolete += set.obsolete.length;
      for (const code of set.codes) {
        codes++;
        expect(code.source_status).toBe("Registered");
        expect(code.collection_id).toBe(set.collection_id);
        expect(code.path).toBe(`${set.path}/${code.code.toLowerCase()}`);
        expect(identities.has(code.id)).toBe(false); identities.add(code.id);
        expect(createHash("sha256").update(code.source_definition).digest("hex")).toBe(code.source_definition_sha256);
        expect(code.source_refs.map(ref => ref.source_id)).toEqual(expect.arrayContaining(["iso20022-external-json", "iso20022-external-xlsx"]));
      }
    }
    expect(codes).toBe(3314); expect(messages).toBe(9527); expect(obsolete).toBe(30);
    const current = isoCode(isoCodeSet("local-instrument")!, "ctp")!;
    expect(current.source_name).toBe("CreditTransferPreferred");
    expect(isoCodeSet("local-instrument")!.obsolete.some(row => row.code === "CTP" && row.source_name === "CustomerTransferPlus")).toBe(true);
    const reused = ISO20022_SETS.flatMap(set => set.codes).find(code => codePeers(code).length > 0)!;
    expect(codePeers(reused).every(peer => peer.code.code === reused.code && peer.set.collection_id !== reused.collection_id)).toBe(true);
    const zeroCode = ISO20022_SETS.flatMap(set => set.codes).find(code => /^0\d/.test(code.code))!;
    expect(isoCode(ISO20022_SETS.find(set => set.collection_id === zeroCode.collection_id)!, zeroCode.path.split("/").at(-1)!)?.code).toBe(zeroCode.code);
  });
  it("keeps every page noindex with unique titles and source-matching structured definitions", () => {
    const titles = new Set<string>();
    for (const set of ISO20022_SETS) {
      for (const code of [undefined, ...set.codes]) {
        const identity = isoIdentity(set, code), metadata = isoMetadata(set, code);
        expect(titles.has(identity.title)).toBe(false); titles.add(identity.title);
        expect(metadata.robots).toEqual(privateRobots);
        expect(metadata.alternates?.canonical).toBe(canonicalOrigin + identity.path);
        const graph = JSON.parse(isoJsonLd(set, code))["@graph"];
        const crumbs = graph.find((entry: { "@type": string }) => entry["@type"] === "BreadcrumbList");
        expect(crumbs.itemListElement.at(-1).item).toBe(canonicalOrigin + identity.path);
        if (code) {
          const term = graph.find((entry: { "@type": string }) => entry["@type"] === "DefinedTerm");
          expect(term.description).toBe(code.source_definition); expect(term.termCode).toBe(code.code);
          expect(term.inDefinedTermSet.url).toBe(canonicalOrigin + set.path);
        }
      }
    }
    expect(titles.size).toBe(3454);
  });
  it("shows source replacements without rewriting the registered status or inventing a successor", () => {
    const records = ISO20022_SETS.flatMap(set => set.codes.filter(code => code.replaced_by).map(code => ({ set, code })));
    expect(records).toHaveLength(3);
    expect(records.map(({ code }) => [code.code, code.replaced_by])).toEqual([["CAD", "LVT"], ["SCL", "EMZ"], ["DDNR", "DDFA"]]);
    for (const { set, code } of records) {
      expect(code.source_status).toBe("Registered");
      expect(codeReplacement(set, code)?.code).toBe(code.replaced_by);
      expect(isoIdentity(set, code).description).toContain(`Source replacement: ${code.replaced_by}.`);
      expect(codeReplacement(set, { ...code, replaced_by: "not-listed" })).toBeUndefined();
    }
    expect(records.filter(({ code }) => codeUsageRestriction(code)).map(({ code }) => code.code)).toEqual(["CAD", "SCL"]);
  });

});

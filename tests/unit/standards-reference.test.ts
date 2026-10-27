import { describe, expect, it } from "vitest";
import { STANDARD_REFERENCE_PATHS } from "../../src/shared/standard-reference-paths";
import { PUBLIC_CONTENT_PATHS, INDEXABLE_PUBLIC_PATHS, publicDocumentPath, publicPayloadPath } from "../../src/shared/public-page-inventory";
import { handlePublicRequest } from "../../netlify/edge-functions/public-boundary";
import { PUBLIC_INDEXING_APPROVAL, canonicalOrigin } from "../../src/shared/public-release";
import { forbiddenStatic } from "../../tools/public-artifact-policy";
const production = { NODE_ENV: "production", APP_ENV: "production", ETAIL_SEARCH_CONTEXT: "production", ETAIL_PUBLIC_ORIGIN: canonicalOrigin };
describe("frozen release inventory", () => {
  it("includes exactly the reviewed pages and legal exclusions", () => {
    expect(new Set(STANDARD_REFERENCE_PATHS).size).toBe(3706);
    expect(new Set(PUBLIC_CONTENT_PATHS).size).toBe(3725);
    expect(INDEXABLE_PUBLIC_PATHS).toHaveLength(3723);
    expect(INDEXABLE_PUBLIC_PATHS).not.toContain("/privacy"); expect(INDEXABLE_PUBLIC_PATHS).not.toContain("/terms");
    for (const path of STANDARD_REFERENCE_PATHS) {
      expect(publicDocumentPath(path)).toBe(path);
      expect(publicPayloadPath(path + ".txt")).toBe(path);
      expect(forbiddenStatic(path.slice(1) + ".html")).toBe(false);
      expect(publicDocumentPath(path + "/invented")).toBeNull();
    }
  });
  it("serves every reviewed reference under the exact production guard", async () => {
    for (const path of STANDARD_REFERENCE_PATHS) {
      const response = await handlePublicRequest(new Request(canonicalOrigin + path), { next: async () => new Response("reference"), deploy: { context: "production" }, site: { id: PUBLIC_INDEXING_APPROVAL.siteId } }, production);
      expect(response.status, path).toBe(200); expect(response.headers.has("x-robots-tag"), path).toBe(false);
    }
  });
  it("denies unsupported tables, edition paths, encodings and invented payloads", async () => {
    for (const path of ["/guides/iso-8583/2023/messages/2100", "/guides/iso-8583/messages/9999", "/guides/iso-8583/fields/999", "/guides/iso-20022/unknown", "/guides/%69so-8583/messages/2100", "/GUIDES/ISO-20022", "/guides/iso-8583/messages/2100/__next.secret.txt"]) {
      let downstream = false;
      const response = await handlePublicRequest(new Request(canonicalOrigin + path), { next: async () => { downstream = true; return new Response("unexpected"); }, deploy: { context: "production" }, site: { id: PUBLIC_INDEXING_APPROVAL.siteId } }, production);
      expect(response.status, path).toBe(404); expect(downstream).toBe(false);
      expect(response.headers.get("x-robots-tag")).toContain("noindex");
    }
  });
});

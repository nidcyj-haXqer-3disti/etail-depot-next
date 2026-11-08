import { describe, expect, it } from "vitest";
import { forbiddenLocalReviewStatic, forbiddenStatic, localReviewHtmlFiles, publicationBlockers } from "../../tools/public-artifact-policy";

describe("isolated local package review", () => {
  it("contains the full reviewed inventory with the approved production inventory", () => {
    expect(localReviewHtmlFiles).toHaveLength(3751);
    expect(new Set(localReviewHtmlFiles).size).toBe(3751);
    for (const file of ["use-cases/software-platforms.html", "developers/getting-started.html", "resources/guides/iso-8583/messages/2100.html"]) {
      expect(forbiddenLocalReviewStatic(file)).toBe(false);
      expect(forbiddenStatic(file)).toBe(false);
    }
  });
  it("accepts the exact navigation payloads needed by local readers", () => {
    for (const file of ["developers/getting-started.txt", "developers/getting-started/__next._tree.txt", "developers/getting-started/__next.developers.getting-started.__PAGE__.txt", "resources/guides/iso-20022/payment-transaction-status/acsp/__next.resources.guides.iso-20022.$d$set.$d$code.__PAGE__.txt", "resources/guides/iso-8583/messages/2100/__next.resources.guides.iso-8583.$d$table.$d$code.__PAGE__.txt"]) {
      expect(forbiddenLocalReviewStatic(file), file).toBe(false);
      expect(forbiddenStatic(file), file).toBe(false);
    }
  });
  it("rejects extra tables, ambiguous codes, private content and invented payloads", () => {
    for (const file of ["docs/private.html", "developers/getting-started/record.json", "developers/getting-started/__next.secret.txt", "resources/guides/iso-8583/2023/action-codes/9126.html", "resources/guides/iso-8583/2023/action-codes/9127.html", "resources/guides/iso-20022/unknown/acsp.html", "resources/guides/iso-8583/2023/../../archive/data.json", "guides/stripe-alternatives.html", "outputs/research.json", "src/modules/public-site/iso8583-data.json", ".env", "developers/getting-started.zip", "DOCS/checkout.html", "docs%2fcheckout.html", "docs\\checkout.html"]) {
      expect(forbiddenLocalReviewStatic(file), file).toBe(true);
    }
  });
  it("keeps permission and expanded scope holds separate and explicit", () => {
    const both = publicationBlockers(["use-cases/software-platforms/page.tsx"], true);
    expect(both).toHaveLength(2);
    expect(both[0]).toContain("ISO_8583_PERMISSION_UNCONFIRMED");
    expect(both[1]).toContain("EXPANDED_RELEASE_SCOPE_HELD");
    expect(publicationBlockers([], true)).toHaveLength(1);
    expect(publicationBlockers(["docs/page.tsx"], false)).toHaveLength(1);
    expect(publicationBlockers([], false)).toEqual([]);
  });
});

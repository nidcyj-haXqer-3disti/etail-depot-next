import { createHash } from "node:crypto";
import { expect, test } from "vitest";
import { gatewayPayfacArticle as article, gatewayPayfacBody as body } from "../../src/features/company/blog/gateway-payfac-content";
import { DRAFT_BLOG_PATHS } from "../../src/shared/site/blog-paths";

test("preserves the human gateway and PayFac article with established service naming", () => {
  const blocks = [article.title, article.description];
  for (const section of body.sections) {
    blocks.push(section.title, ...section.paragraphs);
    if (section.comparison) blocks.push(...section.comparison.flat());
  }
  // Exact supplied wording except the two authorized Etail-to-Trolleys naming corrections.
  expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("d6e286bb656bcf09896d9fe368ebf1fdfc599d7c12d1a1dc326a939a3e525c3e");
  expect(article.publishedAt).toBe("2026-11-15");
  expect(article.author.name).toBe("Etail Depot");
  expect(DRAFT_BLOG_PATHS).toContain(article.path);
  expect(body.sections.find(section => section.comparison)?.comparison).toHaveLength(7);
});

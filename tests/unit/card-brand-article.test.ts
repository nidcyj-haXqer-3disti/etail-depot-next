import { createHash } from "node:crypto";
import { expect, test } from "vitest";
import { cardBrandArticle as article, cardBrandBody as body } from "../../src/features/company/blog/card-brand-content";
import { DRAFT_BLOG_PATHS } from "../../src/shared/site/blog-paths";

test("preserves the supplied card-brand article and its editorial draft status", () => {
  const blocks = [article.title, article.description];
  for (const section of body.sections) {
    blocks.push(section.title);
    for (const block of section.blocks) blocks.push(...(block.type === "paragraph" ? [block.text] : block.items.map(item => item.text)));
  }
  // Only the previously approved merchant-service naming is adjusted.
  expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("79956a83240b31bd93b3e84a11ca57193698ed3d82b5643551e9035101e02489");
  expect(article.publishedAt).toBe("2026-11-15");
  expect(article.author.name).toBe("Etail Depot");
  expect(DRAFT_BLOG_PATHS).toContain(article.path);
});

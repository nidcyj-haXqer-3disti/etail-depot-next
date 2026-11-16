import { createHash } from "node:crypto";
import { expect, test } from "vitest";
import { riskQuestionsArticle as article, riskQuestionsBody as body } from "../../src/features/company/blog/risk-questions-content";
import { DRAFT_BLOG_PATHS } from "../../src/shared/site/blog-paths";

test("preserves the ten-question document including all comparison cells as an editorial draft", () => {
  const blocks = [article.title, article.description, ...body.intro.map(paragraph => paragraph.text)];
  for (const section of body.sections) {
    blocks.push(section.title);
    for (const block of section.blocks) {
      if (block.type === "paragraph") blocks.push(block.text);
      else { expect(block.rows).toHaveLength(10); blocks.push(...block.headers, ...block.rows.flat()); }
    }
  }
  expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("11ead3d5e9dc2b6ea5ea4469fdd048d9ae4ebf21243ac1c75d306717927d7cce");
  expect(article.publishedAt).toBe("2026-11-15");
  expect(article.author.name).toBe("Etail Depot");
  expect(DRAFT_BLOG_PATHS).toContain(article.path);
});

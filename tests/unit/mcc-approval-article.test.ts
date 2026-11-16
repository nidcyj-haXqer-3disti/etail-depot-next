import { createHash } from "node:crypto";
import { expect, test } from "vitest";
import { mccApprovalArticle as article, mccApprovalBody as body } from "../../src/features/company/blog/mcc-approval-content";
import { DRAFT_BLOG_PATHS } from "../../src/shared/site/blog-paths";

test("preserves the human-written MCC argument and its editorial draft status", () => {
  const blocks = [article.title, article.description, ...body.intro.map(paragraph => paragraph.text)];
  for (const section of body.sections) blocks.push(section.title, ...section.paragraphs.map(paragraph => paragraph.text));
  // Supplied copy with only the established Trolleys service naming.
  expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("03b85933760d7a286d5cf5be6ac89d5596cc8bcae0539d45a0fa36b33645a51a");
  expect(article.publishedAt).toBe("2026-11-15");
  expect(article.author.name).toBe("Etail Depot");
  expect(DRAFT_BLOG_PATHS).toContain(article.path);
});

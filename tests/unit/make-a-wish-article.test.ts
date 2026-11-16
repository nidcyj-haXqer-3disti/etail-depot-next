import { createHash } from "node:crypto";
import { expect, test } from "vitest";
import { makeAWishArticle as article, makeAWishBody as body } from "../../src/features/company/blog/make-a-wish-content";
import { DRAFT_BLOG_PATHS } from "../../src/shared/site/blog-paths";

test("preserves the human invitation and distinguishes wishes from promised capabilities", () => {
  const blocks = [article.title, article.description, ...body.intro];
  for (const section of body.sections) {
    blocks.push(section.title);
    for (const block of section.blocks) blocks.push(...(block.type === "paragraph" ? [block.text] : block.items));
  }
  // Supplied copy, with only the established Trolleys merchant naming correction.
  expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("2dfe7547e7bdac25138310ca11dd82027de58d4e48d0da08eb1f8c28fcef2ced");
  expect(article.publishedAt).toBe("2026-11-15");
  expect(article.author.name).toBe("Etail Depot");
  expect(DRAFT_BLOG_PATHS).toContain(article.path);
  expect(blocks.join(" ")).toContain("not something we can do");
  expect(blocks.join(" ")).toContain("sending a wish does not sign you up for anything but the conversation");
});

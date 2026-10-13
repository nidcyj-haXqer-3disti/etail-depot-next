import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { verifyBundledPlatformEmail, verifyPlatformEmailBundle } from "../../tools/netlify-email-compat.ts";

const root = process.cwd();
const compiled = readFileSync(path.join(root, "tests/fixtures/netlify-emails/index.mjs.txt"), "utf8");

describe("compiled platform Email boundary", () => {
  it("accepts the reviewed complete module with only checkout-path and formatting differences", () => {
    expect(() => verifyBundledPlatformEmail(root, compiled)).not.toThrow();
    const relocated = compiled.replaceAll("artifacts/d201-email-compat/bundle-fixture/.netlify/functions-internal/emails/vendor.cjs", "/opt/build/repo/.netlify/functions-internal/emails/vendor.cjs");
    expect(() => verifyBundledPlatformEmail(root, `// Platform compilation\n${relocated}\n`)).not.toThrow();
  });

  it.each([
    ["an added eager call", `${compiled}\nrequire_vendor();`],
    ["an altered upstream destination", compiled.replaceAll("netlify-integration-emails.netlify.app", "unexpected.example")],
    ["a removed authentication guard", compiled.replace("!timingSafeEqual(expectedBytes, suppliedBytes)", "false")],
    ["an inverted prefix authentication operator", compiled.replace("!timingSafeEqual(expectedBytes, suppliedBytes)", "+timingSafeEqual(expectedBytes, suppliedBytes)")],
    ["a changed negation operator", compiled.replace("if (!secret)", "if (~secret)")],
    ["a changed regular-expression flag", compiled.replace('/emails\\/([A-z-]*)[?]?/', '/emails\\/([A-z-]*)[?]?/i')],
    ["a changed template value", compiled.replace('`Error sending email: ${message}`', '`Error sending email: ${message + "changed"}`')],
    ["a changed security header", compiled.replace('"Cache-Control": "no-store"', '"Cache-Control": "public"')],
    ["a bypassing default export", compiled.replace("index_default as default", "require_vendor as default")],
    ["an additional export", `${compiled}\nexport { require_vendor };`],
  ])("rejects %s", (_reason, contents) => {
    expect(contents).not.toBe(compiled);
    expect(() => verifyBundledPlatformEmail(root, contents)).toThrow(/complete compiled Emails module/);
  });

  it("does not allow an alternate safe directory to hide the real Functions distribution", () => {
    // Directory validation precedes reading any bundle, preserving fail-closed path binding.
    expect(() => verifyPlatformEmailBundle(root, path.join(root, ".netlify/functions-safe"))).toThrow(/actual Functions distribution/);
  });
});

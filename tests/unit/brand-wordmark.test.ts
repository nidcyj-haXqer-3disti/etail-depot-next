import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { brandWordmark } from "../../src/shared/brand-wordmark";

describe("public social wordmark", () => {
  it("uses the exact authentic logo asset without external or runtime file access", () => {
    expect(brandWordmark).toBe(`data:image/png;base64,${readFileSync(resolve("public/brand/logo.png")).toString("base64")}`);
  });
});

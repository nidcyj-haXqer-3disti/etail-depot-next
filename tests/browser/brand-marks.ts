import { expect, type Locator } from "@playwright/test";

export async function expectDecodedBrandMarks(marks: Locator) {
  await expect.poll(() => marks.evaluateAll(async elements => {
    const ready = await Promise.all(elements.map(async element => {
      if (element instanceof HTMLImageElement) return element.complete && element.naturalWidth > 0 && element.naturalHeight > 0;
      const content = getComputedStyle(element).content;
      const source = content.match(/^url\(["']?(data:image\/(?:png|svg\+xml);base64,[^"')]+)["']?\)$/)?.[1];
      if (!element.classList.contains("inline-brand-image") || !source) return false;
      const image = new Image();
      image.src = source;
      try { await image.decode(); } catch { return false; }
      return image.naturalWidth > 0 && image.naturalHeight > 0;
    }));
    return ready.length > 0 && ready.every(Boolean);
  }), { message: "Original brand artwork must decode from the rendered image or foreground CSS content" }).toBe(true);
}

export async function expectDecodedBrandMark(mark: Locator) {
  await expect(mark).toBeVisible();
  const box = await mark.boundingBox();
  expect(box?.width).toBeGreaterThan(0);
  expect(box?.height).toBeGreaterThan(0);
  await expectDecodedBrandMarks(mark);
}

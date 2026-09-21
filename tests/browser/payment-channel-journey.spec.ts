import { expect, test, type Locator, type Page } from "@playwright/test";

const channels = ["Text", "Email", "Social", "QR code", "Website"] as const;
const recognitionViews = ["Customer view", "Bank inquiry"] as const;
const examples = [
  { name: "Goods", description: "Homeware set", amount: "$64.00", purchase: "Homeware set · 1 set", reference: "ORDER-1048" },
  { name: "Services", description: "Design services", amount: "$480.00", purchase: "Design services · Project payment", reference: "PROJECT-2086" },
  { name: "Information", description: "Market research briefing", amount: "$35.00", purchase: "Market research · 1 briefing", reference: "BRIEF-3012" },
] as const;

async function blockAccountActions(page: Page) {
  const unexpected: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method()) || url.pathname.startsWith("/api/") || ["trolleys.ai", "ledgix.com"].includes(url.hostname)) {
      unexpected.push(`${request.method()} ${url.origin}${url.pathname}`);
      await route.abort("blockedbyclient");
    } else await route.continue();
  });
  return { unexpected, errors };
}

async function browserStorage(page: Page) {
  return page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
}

async function expandJourney(showcase: Locator) {
  const expand = showcase.getByRole("button", { name: "Show example", exact: true });
  if (await expand.isVisible()) await expand.click();
}

async function expectMatchingExample(showcase: Locator, example: (typeof examples)[number]) {
  const panel = showcase.getByRole("tabpanel");
  for (const selector of [".channel-medium", ".marketing-payment-summary"]) {
    await expect(panel.locator(selector)).toContainText(example.description);
    await expect(panel.locator(selector)).toContainText(example.amount);
  }
  for (const other of examples.filter(item => item.name !== example.name)) {
    await expect(panel).not.toContainText(other.description);
    await expect(panel).not.toContainText(other.amount);
  }
}

async function expectMatchingRecognition(art: Locator, example: (typeof examples)[number]) {
  await expect(art).toContainText(example.description);
  await expect(art.locator(".dispute-charge")).toContainText(example.amount);
  await expect(art.locator(".dispute-purchase-details")).toContainText(example.purchase);
  await expect(art.locator(".dispute-purchase-details")).toContainText(example.reference);
  for (const other of examples.filter(item => item.name !== example.name)) {
    await expect(art).not.toContainText(other.reference);
    await expect(art).not.toContainText(other.amount);
  }
}

test("sharing and purchase recognition preserve one purchase without enrollment", async ({ page }) => {
  test.setTimeout(60_000);
  const observed = await blockAccountActions(page);
  await page.goto("/payment-services");
  const initialStorage = await browserStorage(page);
  const experience = page.locator(".payment-experience");
  const types = experience.getByRole("tablist", { name: "What you sell", exact: true });
  const showcase = experience.locator(".channel-showcase");
  const delivery = showcase.getByRole("tablist", { name: "Ways to share a payment request", exact: true });
  const art = experience.locator(".dispute-art");
  const views = art.getByRole("group", { name: "Explore purchase recognition", exact: true });
  const option = page.locator("#addon-sale-records");
  const hero = page.getByRole("figure", { name: "Illustrated payment journey", exact: true });
  const heroTypes = hero.getByRole("tablist", { name: "Payment examples", exact: true });
  await expect(types.getByRole("tab")).toHaveCount(3);
  await expect(delivery.getByRole("tab")).toHaveCount(5);
  await expect(views.getByRole("button")).toHaveCount(2);
  await expandJourney(showcase);
  for (const example of examples) {
    await heroTypes.getByRole("tab", { name: example.name, exact: true }).click();
    await expect(types.getByRole("tab", { name: example.name, exact: true })).toHaveAttribute("aria-selected", "true");
    await expectMatchingExample(showcase, example);
    await expectMatchingRecognition(art, example);
  }
  for (const example of examples) {
    await types.getByRole("tab", { name: example.name, exact: true }).click();
    await expect(experience.locator(".sale-type-panel")).toHaveAccessibleName(example.name);
    await expect(heroTypes.getByRole("tab", { name: example.name, exact: true })).toHaveAttribute("aria-selected", "true");
    await expect(hero.getByRole("tabpanel")).toContainText(example.description);
    await expect(hero.getByRole("tabpanel")).toContainText(example.amount);
    for (const view of recognitionViews) {
      const button = views.getByRole("button", { name: view, exact: true });
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(views.locator('[aria-pressed="true"]')).toHaveCount(1);
      await expect(art.getByRole("article", { name: `${view} example`, exact: true })).toBeVisible();
      await expectMatchingRecognition(art, example);
      await expect(option).not.toBeChecked();
    }
    for (const channel of channels) {
      await delivery.getByRole("tab", { name: channel, exact: true }).click();
      await expect(showcase.getByRole("tabpanel")).toHaveAccessibleName(channel);
      await expectMatchingExample(showcase, example);
      await expectMatchingRecognition(art, example);
      await expect(showcase.locator(".marketing-payment-receipt")).toContainText("Payment receipt included");
      await expect(option).not.toBeChecked();
    }
  }
  const journey = showcase.locator(".marketing-channel-journey");
  await expect(journey.locator("a, button, input, textarea, form, iframe")).toHaveCount(0);
  await expect(art.locator("article a, article button, article input, form, iframe")).toHaveCount(0);
  for (const name of ["Visa", "Mastercard", "American Express", "Discover"]) {
    const image = journey.getByRole("img", { name, exact: true });
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate(node => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBe(true);
  }
  expect(await browserStorage(page)).toEqual(initialStorage);
  expect(observed.unexpected).toEqual([]);
  expect(observed.errors).toEqual([]);
});

test("optional fee selection changes only the estimate and never enrolls a payment", async ({ page }) => {
  const observed = await blockAccountActions(page);
  await page.goto("/payment-services");
  const initialStorage = await browserStorage(page);
  const experience = page.locator(".payment-experience");
  const types = experience.getByRole("tablist", { name: "What you sell", exact: true });
  const showcase = experience.locator(".channel-showcase");
  const art = experience.locator(".dispute-art");
  const estimate = experience.locator(".fee-estimate");
  const option = estimate.locator("#addon-sale-records");
  await expect(page.locator('input[type="checkbox"]')).toHaveCount(1);
  await expect(option).not.toBeChecked();
  await types.getByRole("tab", { name: "Information", exact: true }).click();
  await showcase.getByRole("tab", { name: "Website", exact: true }).click();
  await expandJourney(showcase);
  await art.getByRole("button", { name: "Bank inquiry", exact: true }).click();
  await expectMatchingExample(showcase, examples[2]);
  await expectMatchingRecognition(art, examples[2]);
  const checkoutBefore = await showcase.locator(".marketing-channel-journey").innerHTML();
  const recognitionBefore = await art.innerHTML();
  await option.check();
  await expect(estimate.locator(".fee-net")).toContainText("$96.40");
  await expect(estimate).toContainText("Selecting this example does not enroll you or charge a fee");
  expect(await showcase.locator(".marketing-channel-journey").innerHTML()).toBe(checkoutBefore);
  expect(await art.innerHTML()).toBe(recognitionBefore);
  await estimate.getByLabel("Payment amount USD").fill("480");
  await expect(estimate.locator(".fee-net")).toContainText("$463.86");
  expect(await showcase.locator(".marketing-channel-journey").innerHTML()).toBe(checkoutBefore);
  expect(await art.innerHTML()).toBe(recognitionBefore);
  await option.uncheck();
  await expect(estimate.locator(".fee-net")).toContainText("$465.78");
  expect(await showcase.locator(".marketing-channel-journey").innerHTML()).toBe(checkoutBefore);
  expect(await art.innerHTML()).toBe(recognitionBefore);
  await option.check();
  expect(await browserStorage(page)).toEqual(initialStorage);
  await page.reload();
  await expect(option).not.toBeChecked();
  await expect(types.getByRole("tab", { name: "Goods", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(art.getByRole("button", { name: "Customer view", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(estimate.getByLabel("Payment amount USD")).toHaveValue("100");
  expect(observed.unexpected).toEqual([]);
  expect(observed.errors).toEqual([]);
});

test("mobile sharing stays compact and both recognition views fit a 320px screen", async ({ page }) => {
  const observed = await blockAccountActions(page);
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/payment-services");
  const experience = page.locator(".payment-experience");
  const types = experience.getByRole("tablist", { name: "What you sell", exact: true });
  const showcase = experience.locator(".channel-showcase");
  const journey = showcase.locator(".marketing-channel-journey");
  const toggle = showcase.locator(".marketing-example-toggle");
  const art = experience.locator(".dispute-art");
  await expect(journey).toBeHidden();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toHaveAttribute("aria-controls", (await journey.getAttribute("id"))!);
  await types.getByRole("tab", { name: "Information", exact: true }).click();
  await showcase.getByRole("tab", { name: "QR code", exact: true }).click();
  await expect(journey).toBeHidden();
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAccessibleName("Hide example");
  await expect(journey).toBeVisible();
  for (const name of channels) {
    await showcase.getByRole("tab", { name, exact: true }).click();
    await expectMatchingExample(showcase, examples[2]);
    for (const view of recognitionViews) {
      await art.getByRole("button", { name: view, exact: true }).click();
      await expectMatchingRecognition(art, examples[2]);
      const geometry = await experience.evaluate(node => ({
        documentOverflow: document.documentElement.scrollWidth > window.innerWidth,
        containerOverflow: node.scrollWidth > node.clientWidth,
        contentOverflow: [...node.querySelectorAll(".channel-medium, .channel-checkout, .marketing-payment-link, .dispute-art, .dispute-art-window")].some(element => element.scrollWidth > element.clientWidth + 1),
        controlsFit: [...node.querySelectorAll("[role=tab], .marketing-example-toggle, .dispute-art-switch button")].every(element => {
          const rect = element.getBoundingClientRect();
          return rect.width >= 44 && rect.height >= 44 && rect.left >= 0 && rect.right <= window.innerWidth;
        }),
      }));
      expect(geometry).toEqual({ documentOverflow: false, containerOverflow: false, contentOverflow: false, controlsFit: true });
    }
  }
  await toggle.click();
  await expect(journey).toBeHidden();
  await expect(types.getByRole("tab", { name: "Information", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(toggle).toBeHidden();
  await expect(journey).toBeVisible();
  await expectMatchingExample(showcase, examples[2]);
  expect(observed.unexpected).toEqual([]);
  expect(observed.errors).toEqual([]);
});

test("sale and delivery tabs support keyboard navigation while preserving purchase context", async ({ page }) => {
  await page.goto("/payment-services");
  const experience = page.locator(".payment-experience");
  const types = experience.getByRole("tablist", { name: "What you sell", exact: true });
  await types.getByRole("tab", { name: "Goods", exact: true }).focus();
  for (const [key, name] of [["ArrowRight", "Services"], ["End", "Information"], ["ArrowRight", "Goods"], ["ArrowLeft", "Information"]] as const) {
    await page.keyboard.press(key);
    await expect(types.getByRole("tab", { name, exact: true })).toBeFocused();
    await expect(types.getByRole("tab", { name, exact: true })).toHaveAttribute("aria-selected", "true");
    await expect(types.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
  }
  const showcase = experience.locator(".channel-showcase");
  const art = experience.locator(".dispute-art");
  await expandJourney(showcase);
  const delivery = showcase.getByRole("tablist", { name: "Ways to share a payment request", exact: true });
  await delivery.getByRole("tab", { name: "Website", exact: true }).focus();
  for (const [key, name] of [["ArrowRight", "Text"], ["ArrowLeft", "Website"], ["Home", "Text"], ["End", "Website"]] as const) {
    await page.keyboard.press(key);
    const active = delivery.getByRole("tab", { name, exact: true });
    await expect(active).toBeFocused();
    await expect(active).toHaveAttribute("aria-selected", "true");
    await expect(delivery.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
    await expectMatchingExample(showcase, examples[2]);
    await expectMatchingRecognition(art, examples[2]);
  }
  for (const [name, key] of [["Bank inquiry", "Enter"], ["Customer view", "Space"]] as const) {
    const button = art.getByRole("button", { name, exact: true });
    await button.focus();
    await page.keyboard.press(key);
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(art.getByRole("article", { name: `${name} example`, exact: true })).toBeVisible();
    await expectMatchingRecognition(art, examples[2]);
  }
});


test("both payment steps stay readable when descriptions wrap or text spacing grows", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 640, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/payment-services");
    const hero = page.getByRole("figure", { name: "Illustrated payment journey", exact: true });
    for (const spaced of [false, true]) {
      if (spaced) await page.addStyleTag({ content: "body *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}body p{margin-bottom:2em!important}" });
      for (const example of examples) {
        await hero.getByRole("tab", { name: example.name, exact: true }).click();
        const geometry = await hero.evaluate(node => {
          const request = node.querySelector(".payment-journey-request")!.getBoundingClientRect();
          const checkout = node.querySelector(".payment-journey-checkout")!.getBoundingClientRect();
          const container = node.getBoundingClientRect();
          return {
            stepsOverlap: request.left < checkout.right && request.right > checkout.left && request.top < checkout.bottom && request.bottom > checkout.top,
            stepsFit: [request, checkout].every(rect => rect.left >= container.left && rect.right <= container.right && rect.top >= container.top && rect.bottom <= container.bottom),
            labelsFit: [...node.querySelectorAll("[role=tab]")].every(tab => tab.scrollWidth <= tab.clientWidth + 1),
          };
        });
        expect(geometry, `${width}px ${example.name} ${spaced ? "increased spacing" : "normal"}`).toEqual({ stepsOverlap: false, stepsFit: true, labelsFit: true });
      }
    }
  }
});

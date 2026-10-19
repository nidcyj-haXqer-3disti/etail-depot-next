import { expectDecodedBrandMark } from "./brand-marks";
import { expect, test, type Locator, type Page } from "@playwright/test";

const channels = ["Copy link", "Text", "Email", "Social", "QR code", "Website"] as const;
const recognitionViews = ["Customer view", "Bank inquiry"] as const;
const examples = [
  { name: "Goods", description: "Homeware set", amount: "$64.00", purchase: "Homeware set · 1 set", reference: "ORDER-1048", fulfillment: [["Delivery", "Delivered · 20 Sep"]] },
  { name: "Services", description: "Design services", amount: "$480.00", purchase: "Design services · Project payment", reference: "PROJECT-2086", fulfillment: [["Work completed", "19 Sep"]] },
  { name: "Information", description: "Market research briefing", amount: "$35.00", purchase: "Market research · 1 briefing", reference: "BRIEF-3012", fulfillment: [["Supplied", "Email · 18 Sep"], ["As of", "18 Sep, 9:00 AM ET"]] },
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

async function expectMatchingExample(page: Page, example: (typeof examples)[number]) {
  const figure = page.getByRole("figure", { name: "Illustrated payment journey", exact: true });
  for (const selector of [".payment-request-preview", ".channel-medium", ".marketing-payment-summary"]) {
    const content = figure.locator(selector);
    await expect(content).toContainText(example.description);
    await expect(content).toContainText(example.amount);
    for (const other of examples.filter(item => item.name !== example.name)) {
      await expect(content).not.toContainText(other.description);
      await expect(content).not.toContainText(other.amount);
    }
  }
  await expect(figure.locator(".payment-request-preview")).toContainText(example.reference);
  const checkout = figure.getByRole("img", { name: `Checkout illustration for ${example.description}, ${example.amount}. Apple Pay and Google Pay wallet options, followed by contact details, card number ending 4242, expiration, security code, cardholder name and billing fields, and Pay ${example.amount}. Wallet availability varies by device and merchant account. No payment is made.`, exact: true });
  await expect(checkout).toBeVisible();
  await expect(checkout.locator(".checkout-pay-example")).toHaveText(`Pay ${example.amount}`);
  await expect(checkout.locator("input, button, form, a, [tabindex]")).toHaveCount(0);
  for (const wallet of ["Apple Pay", "Google Pay"]) await expectDecodedBrandMark(checkout.locator(`img[alt="${wallet}"]`));
}

async function expectMatchingRecognition(art: Locator, example: (typeof examples)[number]) {
  await expect(art).toContainText(example.description);
  await expect(art.locator(".dispute-charge")).toContainText(example.amount);
  const record = art.locator(".dispute-purchase-details");
  await expect(record.getByRole("term")).toHaveText(["Purchase", "Reference", ...example.fulfillment.map(([label]) => label)]);
  await expect(record.getByRole("definition")).toHaveText([example.purchase, example.reference, ...example.fulfillment.map(([, value]) => value)]);
  for (const other of examples.filter(item => item.name !== example.name)) {
    await expect(art).not.toContainText(other.reference);
    await expect(art).not.toContainText(other.amount);
  }
}

test("sharing and purchase recognition preserve one purchase without enrollment", async ({ page }) => {
  test.setTimeout(60_000);
  const observed = await blockAccountActions(page);
  await page.goto("/payment-acceptance-service");
  const initialStorage = await browserStorage(page);
  const experience = page.locator(".payment-experience");
  const types = page.getByRole("tablist", { name: "What you sell", exact: true });
  const showcase = page.locator(".channel-showcase");
  const delivery = showcase.getByRole("tablist", { name: "Ways to share a payment request", exact: true });
  const art = experience.locator(".dispute-art");
  const views = art.getByRole("group", { name: "Explore purchase recognition", exact: true });
  const option = page.locator("#addon-sale-records");
  const hero = page.getByRole("figure", { name: "Illustrated payment journey", exact: true });
  await expect(hero).toHaveCount(1);
  await expect(hero).toHaveAttribute("id", "payment-channels");
  await expect(types).toHaveCount(1);
  await expect(page.getByRole("tablist", { name: "Payment examples", exact: true })).toHaveCount(0);
  await expect(hero.locator(".payment-create-step, .payment-share-step")).toHaveCount(2);
  await expect(hero.locator(".payment-create-step").getByRole("heading", { name: "Create a payment request", exact: true })).toBeVisible();
  await expect(hero.locator(".payment-share-step").getByRole("heading", { name: "Share your payment link", exact: true })).toBeVisible();
  await expect(types.getByRole("tab")).toHaveCount(3);
  await expect(delivery.getByRole("tab")).toHaveCount(channels.length);
  await expect(delivery).toHaveAttribute("aria-orientation", "horizontal");
  await expect(delivery.getByRole("tab", { name: "Copy link", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(views.getByRole("button")).toHaveCount(2);
  for (const example of examples) {
    await types.getByRole("tab", { name: example.name, exact: true }).click();
    await expect(hero.locator(".sale-type-panel")).toHaveAccessibleName(example.name);
    await expectMatchingExample(page, example);
    await expect(delivery.getByRole("tab", { name: example.name === "Goods" ? "Copy link" : "Website", exact: true })).toHaveAttribute("aria-selected", "true");
    for (const view of recognitionViews) {
      const button = views.getByRole("button", { name: view, exact: true });
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(views.locator('[aria-pressed="true"]')).toHaveCount(1);
      const article = art.getByRole("article", { name: `${view} example`, exact: true });
      await expect(article).toBeVisible();
      await expectMatchingRecognition(art, example);
      if (view === "Customer view") {
        const phone = art.locator(".recognition-phone");
        await expect(phone).toBeVisible();
        await expect(phone).toContainText("Transaction details");
        const transaction = article.locator(".recognition-transaction");
        await expect(transaction.getByRole("term")).toHaveText(["Transaction date", "Card", "Statement name"]);
        await expect(transaction.getByRole("definition")).toHaveText(["18 Sep", "Visa •••• 4242", "YOUR BUSINESS"]);
        await expect(article.locator("details.recognition-receipt")).toHaveAttribute("open", "");
      } else {
        await expect(art.locator(".recognition-bank")).toBeVisible();
        await expect(article).toContainText(/Transaction inquiry/i);
        await expect(article).toContainText("I don’t recognize this charge.");
        await expect(article).toContainText("Purchase details available");
        for (const stage of ["Inquiry received", "Details returned", "Ready to review"]) await expect(article).toContainText(stage);
        await expect(article).not.toContainText(/dispute (won|resolved)|chargeback (won|prevented)/i);
      }
      await expect(option).not.toBeChecked();
    }
    for (const channel of channels) {
      await delivery.getByRole("tab", { name: channel, exact: true }).click();
      await expect(showcase.getByRole("tabpanel")).toHaveAccessibleName(channel);
      await expectMatchingExample(page, example);
      await expectMatchingRecognition(art, example);
      await expect(hero.locator(".two-step-outcome")).toContainText("Payment receipt included");
      await expect(option).not.toBeChecked();
    }
  }
  const journey = showcase.locator(".marketing-channel-journey");
  const outcome = hero.locator(".two-step-outcome");
  await expect(outcome).toContainText("Your customer opens the link and pays by card.");
  await expect(hero.locator(".payment-request-preview, .marketing-channel-journey, .two-step-outcome").locator("a, button, input, textarea, form, iframe")).toHaveCount(0);
  await expect(journey.locator(".marketing-journey-step, .channel-checkout")).toHaveCount(0);
  await expect(art.locator("article a, article button, article input, form, iframe")).toHaveCount(0);
  for (const name of ["Visa", "Mastercard", "American Express", "Discover"]) {
    const image = outcome.getByRole("img", { name, exact: true });
    await expectDecodedBrandMark(image);
  }
  expect(await browserStorage(page)).toEqual(initialStorage);
  expect(observed.unexpected).toEqual([]);
  expect(observed.errors).toEqual([]);
});

test("optional fee selection changes only the estimate and never enrolls a payment", async ({ page }) => {
  const observed = await blockAccountActions(page);
  await page.goto("/payment-acceptance-service");
  const initialStorage = await browserStorage(page);
  const experience = page.locator(".payment-experience");
  const types = page.getByRole("tablist", { name: "What you sell", exact: true });
  const showcase = page.locator(".channel-showcase");
  const art = experience.locator(".dispute-art");
  const estimate = experience.locator(".fee-estimate");
  const option = estimate.locator("#addon-sale-records");
  await expect(page.locator('input[type="checkbox"]')).toHaveCount(1);
  await expect(option).not.toBeChecked();
  await types.getByRole("tab", { name: "Information", exact: true }).click();
  await showcase.getByRole("tab", { name: "Website", exact: true }).click();
  await art.getByRole("button", { name: "Bank inquiry", exact: true }).click();
  await expectMatchingExample(page, examples[2]);
  await expectMatchingRecognition(art, examples[2]);
  const illustration = page.getByRole("figure", { name: "Illustrated payment journey", exact: true });
  const checkoutBefore = await illustration.innerHTML();
  const recognitionBefore = await art.innerHTML();
  await option.check();
  await expect(estimate.locator(".fee-net")).toContainText("$96.40");
  await expect(estimate).toContainText("Using this calculator does not enroll you in Clarity or charge a fee");
  expect(await illustration.innerHTML()).toBe(checkoutBefore);
  expect(await art.innerHTML()).toBe(recognitionBefore);
  await estimate.getByLabel("Payment amount USD").fill("480");
  await expect(estimate.locator(".fee-net")).toContainText("$463.86");
  expect(await illustration.innerHTML()).toBe(checkoutBefore);
  expect(await art.innerHTML()).toBe(recognitionBefore);
  await option.uncheck();
  await expect(estimate.locator(".fee-net")).toContainText("$465.78");
  expect(await illustration.innerHTML()).toBe(checkoutBefore);
  expect(await art.innerHTML()).toBe(recognitionBefore);
  await option.check();
  expect(await browserStorage(page)).toEqual(initialStorage);
  await page.reload();
  await expect(option).not.toBeChecked();
  await expect(types.getByRole("tab", { name: "Goods", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(showcase.getByRole("tab", { name: "Copy link", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(art.getByRole("button", { name: "Customer view", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(estimate.getByLabel("Payment amount USD")).toHaveValue("100");
  expect(observed.unexpected).toEqual([]);
  expect(observed.errors).toEqual([]);
});

test("mobile sharing stays visible and its selected channel and recognition views fit a 320px screen", async ({ page }) => {
  const observed = await blockAccountActions(page);
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/payment-acceptance-service");
  const experience = page.locator(".payment-experience");
  const types = page.getByRole("tablist", { name: "What you sell", exact: true });
  const showcase = page.locator(".channel-showcase");
  const journey = showcase.locator(".marketing-channel-journey");
  const art = experience.locator(".dispute-art");
  await expect(journey).toBeVisible();
  await types.getByRole("tab", { name: "Information", exact: true }).click();
  await showcase.getByRole("tab", { name: "QR code", exact: true }).click();
  await expect(journey).toBeVisible();
  for (const name of channels) {
    await showcase.getByRole("tab", { name, exact: true }).click();
    await expectMatchingExample(page, examples[2]);
    for (const view of recognitionViews) {
      await art.getByRole("button", { name: view, exact: true }).click();
      await expectMatchingRecognition(art, examples[2]);
      const geometry = await page.locator("main").evaluate(node => ({
        documentOverflow: document.documentElement.scrollWidth > window.innerWidth,
        containerOverflow: node.scrollWidth > node.clientWidth,
        contentOverflow: [...node.querySelectorAll(".payment-request-preview, .channel-medium, .marketing-payment-summary, .marketing-payment-link, .two-step-outcome, .dispute-art, .dispute-art-window, .recognition-phone, .recognition-bank, .recognition-receipt")].some(element => element.scrollWidth > element.clientWidth + 1),
        controlsFit: [...node.querySelectorAll("[role=tab], .dispute-art-switch button")].every(element => {
          const rect = element.getBoundingClientRect();
          const inRail = element.closest(".channel-tabs") !== null;
          return rect.width >= 44 && rect.height >= 44 && (inRail || (rect.left >= 0 && rect.right <= window.innerWidth));
        }),
        selectedChannelFits: (() => {
          const rail = node.querySelector(".channel-tabs")!.getBoundingClientRect();
          const selected = node.querySelector('.channel-tabs [aria-selected="true"]')!.getBoundingClientRect();
          return selected.left >= rail.left - 1 && selected.right <= rail.right + 1 && selected.left >= 0 && selected.right <= window.innerWidth;
        })(),
      }));
      expect(geometry).toEqual({ documentOverflow: false, containerOverflow: false, contentOverflow: false, controlsFit: true, selectedChannelFits: true });
    }
  }
  await expect(journey).toBeVisible();
  await expect(types.getByRole("tab", { name: "Information", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(journey).toBeVisible();
  await expectMatchingExample(page, examples[2]);
  await expect(showcase.getByRole("tab", { name: "Website", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(showcase.getByRole("tablist")).toHaveAttribute("aria-orientation", "horizontal");
  expect(observed.unexpected).toEqual([]);
  expect(observed.errors).toEqual([]);
});

test("sale, delivery and purchase details support keyboard navigation without account effects", async ({ page }) => {
  const observed = await blockAccountActions(page);
  await page.goto("/payment-acceptance-service");
  const initialStorage = await browserStorage(page);
  const experience = page.locator(".payment-experience");
  const types = page.getByRole("tablist", { name: "What you sell", exact: true });
  await types.getByRole("tab", { name: "Goods", exact: true }).focus();
  for (const [key, name] of [["ArrowRight", "Services"], ["End", "Information"], ["ArrowRight", "Goods"], ["ArrowLeft", "Information"]] as const) {
    await page.keyboard.press(key);
    await expect(types.getByRole("tab", { name, exact: true })).toBeFocused();
    await expect(types.getByRole("tab", { name, exact: true })).toHaveAttribute("aria-selected", "true");
    await expect(types.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
  }
  const showcase = page.locator(".channel-showcase");
  const art = experience.locator(".dispute-art");
  const delivery = showcase.getByRole("tablist", { name: "Ways to share a payment request", exact: true });
  await delivery.getByRole("tab", { name: "Website", exact: true }).focus();
  for (const [key, name] of [["ArrowRight", "Copy link"], ["ArrowLeft", "Website"], ["ArrowDown", "Copy link"], ["ArrowUp", "Website"], ["Home", "Copy link"], ["End", "Website"]] as const) {
    await page.keyboard.press(key);
    const active = delivery.getByRole("tab", { name, exact: true });
    await expect(active).toBeFocused();
    await expect(active).toHaveAttribute("aria-selected", "true");
    await expect(delivery.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
    const { tabBounds, railBounds, focusRing } = await active.evaluate(element => {
      const style = getComputedStyle(element);
      const tab = element.getBoundingClientRect();
      const rail = element.closest('[role="tablist"]')!.getBoundingClientRect();
      // Read both rectangles in the same frame: focusing can also scroll the page.
      return {
        tabBounds: { x: tab.x, y: tab.y, width: tab.width, height: tab.height },
        railBounds: { x: rail.x, y: rail.y, width: rail.width, height: rail.height },
        focusRing: { style: style.outlineStyle, width: parseFloat(style.outlineWidth), extent: parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset) },
      };
    });
    expect(focusRing.style).not.toBe("none");
    expect(focusRing.width).toBeGreaterThan(0);
    expect(tabBounds.x - focusRing.extent).toBeGreaterThanOrEqual(railBounds.x - 1);
    expect(tabBounds.x + tabBounds.width + focusRing.extent).toBeLessThanOrEqual(railBounds.x + railBounds.width + 1);
    expect(tabBounds.y - focusRing.extent).toBeGreaterThanOrEqual(railBounds.y - 1);
    expect(tabBounds.y + tabBounds.height + focusRing.extent).toBeLessThanOrEqual(railBounds.y + railBounds.height + 1);
    await expectMatchingExample(page, examples[2]);
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
  const receipt = art.locator("details.recognition-receipt");
  const summary = receipt.locator("summary");
  await expect(summary).toHaveText("Purchase details");
  await expect(receipt).toHaveAttribute("open", "");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(receipt).not.toHaveAttribute("open");
  await expect(summary).toBeFocused();
  await expect(receipt.locator(".dispute-purchase-details")).toBeHidden();
  await expect(art.locator(".dispute-charge")).toContainText(examples[2].amount);
  await page.keyboard.press("Space");
  await expect(receipt).toHaveAttribute("open", "");
  await expect(summary).toBeFocused();
  await expectMatchingRecognition(art, examples[2]);
  await expect(types.getByRole("tab", { name: "Information", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(delivery.getByRole("tab", { name: "Website", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#addon-sale-records")).not.toBeChecked();
  expect(await browserStorage(page)).toEqual(initialStorage);
  expect(observed.unexpected).toEqual([]);
  expect(observed.errors).toEqual([]);
});


test("both payment steps stay readable when descriptions wrap or text spacing grows", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/payment-acceptance-service");
    const hero = page.getByRole("figure", { name: "Illustrated payment journey", exact: true });
    for (const spaced of [false, true]) {
      if (spaced) await page.addStyleTag({ content: "body *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}body p{margin-bottom:2em!important}" });
      for (const example of examples) {
        await hero.getByRole("tab", { name: example.name, exact: true }).click();
        const geometry = await hero.evaluate(node => {
          const request = node.querySelector(".payment-create-step")!.getBoundingClientRect();
          const checkout = node.querySelector(".payment-share-step")!.getBoundingClientRect();
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

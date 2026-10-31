import { test, expect } from "@playwright/test";

test("merchant services explain the lifecycle, pricing and safe account handoff", async ({ page }) => {
  await page.goto("/payment-acceptance-service");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Accept card\s*and ACH payments\./);
  const fees = page.locator("#fees");
  for (const [container, name] of [[page.locator(".merchant-hero"), "Apply for a merchant account"]] as const) {
    const continuation = container.getByRole("link", { name, exact: true });
    await expect(continuation).toBeVisible();
    await expect(continuation).toHaveAttribute("href", "https://trolleys.ai");
    await expect(continuation).toHaveAttribute("referrerpolicy", "no-referrer");
    await expect(continuation).toHaveAttribute("rel", /\bnoreferrer\b/);
  }
  const sequence = await page.locator(".enterprise-page.merchant").evaluate(element => {
    const ids = ["payment-operations", "refunds-and-disputes", "fees"];
    const sections = ids.map(id => element.querySelector(`#${id}`));
    return sections.every((section, index) => section && (index === 0 || (sections[index - 1]!.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0));
  });
  expect(sequence, "Payment operations lead to pricing").toBe(true);
  const fundingSteps = ["Capture", "Settlement", "Payout calculation", "Bank deposit"];
  await expect(page.locator("#payment-operations-title")).toHaveText(/From payment\s*to bank deposit\./);
  await expect(page.locator(".funding-steps h3")).toHaveText(fundingSteps);
  await expect(page.locator(".ec-reconciliation-art")).toContainText("Before other fees and adjustments.");
  await expect(page.locator(".ec-reconciliation-art")).toContainText("Confirm against your bank statement.");
  await expect(page.locator(".operation-detail").nth(0)).toContainText("Check the existing attempt before trying again");
  await expect(page.locator("#payment-operations")).toContainText("A settled payment does not confirm that funds have reached your bank");
  await expect(page.locator("#refunds-and-disputes")).toContainText("response deadline and requested records");
  await expect(page.locator("#refunds-and-disputes")).toContainText("void or authorization reversal");
  await expect(fees.getByRole("link", { name: "See all fees and calculate your costs" })).toHaveAttribute("href", "/pricing#fees");
  await expect(fees).toContainText("ACH pricing is separate");
  const sectionMenu = page.locator(".service-section-nav .service-section-mobile > summary");
  if (await sectionMenu.isVisible()) await sectionMenu.click();
  const pricing = page.locator(".service-section-nav").getByRole("link", { name: "Pricing", exact: true });
  await expect(pricing).toHaveAttribute("href", "#fees");
  await pricing.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/payment-acceptance-service#fees$/);
  await expect(fees.getByRole("heading", { name: "Credit card processing fees.", exact: true })).toBeInViewport();
  await expect(page.locator(".faq, .public-faq-section")).toHaveCount(0);
  await expect(page.locator(".bp-merchant-closing, .dispute-prevention-section")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Dispute prevention", exact: true })).toHaveCount(0);
  await expect(page.locator(".service-section-nav a:visible")).toHaveText(["Account setup", "Acceptance", "Operations", "Pricing"]);
  await page.goto("/help#payments");
  const setup = page.locator("#payments details").filter({ hasText: "Can my business apply for a merchant account?" });
  await setup.locator("summary").click();
  await expect(setup).toContainText("Payments can start once the account is approved and set up");
  await expect(setup).toContainText("the merchant account service operated by Etail Depot US, Inc.");
  const wallets = page.locator("#payments details").filter({ hasText: "Can customers pay by ACH, Apple Pay or Google Pay?" });
  await wallets.locator("summary").click();
  await expect(wallets).toContainText("checkout options for your account during setup");
  await expect(wallets).toContainText("Wallet availability also depends on the customer’s card and device");
});

test("domestic card fee breakdown reconciles and recovers invalid input without submitting data", async ({ page }) => {
  const mutations: string[] = [];
  page.on("request", request => { if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) mutations.push(request.url()); });
  await page.goto("/payment-acceptance-service");
  await page.goto("/pricing");
  const offer = page.locator(".pricing-rate");
  await expect(offer.getByRole("heading", { name: "Online card payments", exact: true })).toBeVisible();
  await expect(offer.locator(".payment-base-rate")).toHaveText("2.9% + 30¢");
  const rateContrast = await offer.locator(".payment-base-rate").evaluate(element => {
    const luminance = (color: string) => {
      const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(value => {
        const normalized = Number(value) / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const foreground = luminance(getComputedStyle(element).color);
    const background = luminance(getComputedStyle(element.closest(".pricing-rate")!).backgroundColor);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
  expect(rateContrast, "The actual card rate must remain readable against its pricing panel").toBeGreaterThanOrEqual(4.5);
  await expect(offer.locator(".pricing-account-fees dt")).toHaveText(["Monthly fee", "Setup fee"]);
  await expect(offer.locator(".pricing-account-fees dd")).toHaveText(["$0", "$0"]);
  await expect(offer).toContainText("Payment links, QR sharing and basic payment receipts are included");
  const estimate = page.locator(".fee-estimate");
  await expect(estimate.locator("dl dt")).toHaveText(["2.9% of the payment", "Fixed fee", "Processing fee", "After card processing"]);
  await expect(estimate.locator("dl dd")).toHaveText(["$2.90", "$0.30", "$3.20", "$96.80"]);
  await expect(estimate).toContainText("other applicable charges");
  await expect(estimate).toContainText("This is not a guaranteed payout");
  await expect(estimate.locator("input")).toHaveCount(1);
  const amount = estimate.getByLabel("Payment amount USD");
  for (const value of ["", "0.99", "1.001", "100000.01"]) {
    await amount.fill(value);
    await expect(amount).toHaveAttribute("aria-invalid", "true");
    await expect(amount).toHaveAttribute("aria-describedby", "fee-estimate-error fee-estimate-note");
    await expect(estimate.locator("dl")).toHaveCount(0);
    await expect(page.locator("#fee-estimate-error")).toBeVisible();
  }
  for (const [value, figures] of [
    ["480", ["$13.92", "$0.30", "$14.22", "$465.78"]],
    ["5", ["$0.15", "$0.30", "$0.45", "$4.55"]],
    ["100000", ["$2,900.00", "$0.30", "$2,900.30", "$97,099.70"]],
    ["100", ["$2.90", "$0.30", "$3.20", "$96.80"]],
  ] as const) {
    await amount.fill(value);
    await expect(amount).toHaveAttribute("aria-invalid", "false");
    await expect(amount).toHaveAttribute("aria-describedby", "fee-estimate-note");
    await expect(estimate.locator("dl dd")).toHaveText([...figures]);
  }
  await page.goto("/payment-acceptance-service");
  const payouts = page.locator("#payment-operations");
  await expect(payouts).toContainText("A settled payment does not confirm that funds have reached your bank");
  await expect(payouts).toContainText("First payouts, reviews, holds, reserves and bank processing can affect timing");
  expect(mutations).toEqual([]);
  expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
});

test("cards separate the deposit from debt and keep material terms outside disclosures", async ({ page }) => {
  await page.goto("/credit-card-services");
  const facts = page.locator("#card-details");
  await expect(facts).toContainText("$200");
  await expect(facts).toContainText("$0");
  await expect(facts).toContainText("Pay in full each month");
  await expect(facts).toContainText("It does not pay for purchases");
  await expect(facts).toContainText("Repay your full statement balance");
  await expect(page.locator("#secured-credit")).toContainText("Purchases create a separate balance that you repay each month.");
  await expect(page.locator(".secured-credit-art")).toBeVisible();
  const inquiry = page.locator(".consumer-hero-actions").getByRole("link", { name: "Ask about card services", exact: true });
  await expect(inquiry).toBeVisible();
  await expect(inquiry).toHaveAttribute("href", "/contact#cards");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Secured credit");
  await expect(page.locator("main")).not.toContainText("Applications are not open");
  const preview = page.getByRole("region", { name: "Add a card to your wallet.", exact: true });
  await expect(preview).not.toContainText("Applications are not open");
  await expect(preview).toContainText("Availability depends on your card, device and region");
  await expect(page.locator(".consumer-product-note")).toContainText("An inquiry is not an application");
  await expect(page.locator('form, input[type="email"]')).toHaveCount(0);
});

test("fee input preserves the complete inserted value and explains recovery", async ({ page }) => {
  await page.goto("/pricing#fees");
  const amount = page.locator("#payment-amount");
  const result = page.locator(".fee-result");
  // Multi-character browser insertion exercises the input path used for pasted text.
  // A length cap previously turned 100000.009 into the valid but different 100000.00.
  for (const value of ["100000.009", "100000.00suffix", "$100", "1,000", "100,00", "1e3", "9".repeat(80)]) {
    await amount.fill("");
    await amount.focus();
    await page.keyboard.insertText(value);
    await expect(amount).toHaveValue(value);
    await expect(amount).toHaveAttribute("aria-invalid", "true");
    await expect(result.locator("dl")).toHaveCount(0);
    await expect(page.locator("#fee-estimate-error")).toContainText("Leave out currency symbols and commas");
  }
  await amount.fill("100000.00");
  await expect(result.locator("dl dd")).toHaveText(["$2,900.00", "$0.30", "$2,900.30", "$97,099.70"]);
  await amount.fill("100");
  await expect(amount).toHaveAttribute("aria-invalid", "false");
  await expect(result.locator("dl dd")).toHaveText(["$2.90", "$0.30", "$3.20", "$96.80"]);
});

test("fee input waits for composition to finish before validating the committed amount", async ({ page, context }) => {
  await page.goto("/pricing#fees");
  const amount = page.locator("#payment-amount");
  const result = page.locator(".fee-result");
  // Chromium composition events; this is not a physical-device IME certification.
  const input = await context.newCDPSession(page);
  for (const [composed, committed, valid] of [["１００", "100", true], ["１００", "１００", false], ["１００", "", false]] as const) {
    await amount.fill("");
    await amount.focus();
    await input.send("Input.imeSetComposition", { text: composed, selectionStart: composed.length, selectionEnd: composed.length });
    await expect(amount).toHaveValue(composed);
    await expect(amount).toHaveAttribute("aria-invalid", "false");
    await expect(result).toHaveAttribute("aria-busy", "true");
    await expect(result.locator("dl, #fee-estimate-error")).toHaveCount(0);
    await expect(page.locator("#fee-estimate-pending")).toBeVisible();
    if (committed) await input.send("Input.insertText", { text: committed });
    else await input.send("Input.imeSetComposition", { text: "", selectionStart: 0, selectionEnd: 0 });
    await expect(amount).toHaveValue(committed);
    await expect(result).toHaveAttribute("aria-busy", "false");
    await expect(amount).toHaveAttribute("aria-invalid", String(!valid));
    if (valid) await expect(result.locator("dl dd")).toHaveText(["$2.90", "$0.30", "$3.20", "$96.80"]);
    else await expect(page.locator("#fee-estimate-error")).toBeVisible();
  }
  await amount.fill("100");
  await expect(amount).toHaveAttribute("aria-invalid", "false");
  await expect(result.locator("dl dd")).toHaveText(["$2.90", "$0.30", "$3.20", "$96.80"]);
});

test("pricing keeps additional charges and refund conditions with the shared offer", async ({ page }) => {
  await page.goto("/pricing");
  const fees = page.locator("#fees");
  await expect(fees.locator(".payment-method-scope")).toBeHidden();
  await fees.locator(".offer-details > summary").click();
  await expect(fees.locator(".fee-exceptions")).toBeVisible();
  await expect(fees.locator(".offer-details .payment-method-scope")).toBeVisible();
  await expect(fees.locator(".fee-exceptions")).toContainText("$35 each");
  await expect(fees.locator(".fee-exceptions")).toContainText("$15; returned if you win");
  await expect(fees).toContainText("Original processing and currency conversion fees are not returned");
  await expect(fees).not.toContainText(/Clarity|Trolleys/);
  await expect(fees).toContainText("It does not apply when customers enter their own details at online checkout");
  await expect(fees.locator(".payment-method-scope")).toContainText("The rate and calculator above apply to card payments");
});

import { expect, test, type Page } from "@playwright/test";

async function clickVisibleSectionLink(page: Page, fragment: string) {
  for (const link of await page.locator(`a[href="${fragment}"]`).all()) {
    if (await link.isVisible()) {
      await link.click();
      return;
    }
  }
  throw new Error(`No usable section link for ${fragment}`);
}

for (const [route, fragment] of [
  ["/use-cases/software-platforms", "#payment-experience"],
  ["/resources/help", "#cards"],
  ["/company/privacy", "#legal-document-title"],
  ["/resources/guides/iso-20022", "#sets-p"],
  ["/resources/guides/iso-8583/messages", "#version-1993"],
] as const) {
  test(`native section history restores the ${route} document after shared navigation`, async ({ page }) => {
    await page.goto(route);
    const originalTitle = await page.getByRole("heading", { level: 1 }).innerText();
    expect(originalTitle.trim()).not.toBe("");
    await clickVisibleSectionLink(page, fragment);
    await expect(page).toHaveURL(`${new URL(page.url()).origin}${route}${fragment}`);
    await expect(page.locator(fragment)).toBeVisible();
    await page.getByRole("banner").getByRole("link", { name: "Etail Depot home", exact: true }).click();
    await expect(page).toHaveURL(`${new URL(page.url()).origin}/`);
    await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(originalTitle, { useInnerText: true });
    const homeTitle = await page.getByRole("heading", { level: 1 }).innerText();
    await page.goBack();
    await expect(page).toHaveURL(`${new URL(page.url()).origin}${route}${fragment}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(originalTitle, { useInnerText: true });
    await expect(page.locator(fragment)).toBeVisible();
    await page.goForward();
    await expect(page).toHaveURL(`${new URL(page.url()).origin}/`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(homeTitle, { useInnerText: true });
  });
}

test("unhydrated pages preserve calculator, wallet and ISO reference behavior", async ({ browser, baseURL, page: configuredPage }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce", baseURL, viewport: configuredPage.viewportSize() ?? { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(header.getByRole("button", { name: "Menu", exact: true })).not.toBeVisible();
    await header.locator("summary").filter({ hasText: /^Services$/ }).click();
    const merchant = header.getByRole("link", { name: "Merchant onboarding", exact: true });
    await expect(merchant).toBeVisible();
    await merchant.click();
    await expect(page).toHaveURL(`${new URL(page.url()).origin}/services/merchant-onboarding`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await page.goto("/pricing#fees");
    const amount = page.locator("#payment-amount");
    await expect(amount).toHaveValue("100");
    await expect(amount).toBeDisabled();
    await expect(page.locator("#addon-sale-records")).toHaveCount(0);
    await expect(page.locator(".fee-result")).toContainText("$3.20");
    await expect(page.locator(".fee-result")).toContainText("$96.80");

    await page.goto("/resources/guides/iso-20022/payment-transaction-status/acsp");
    await expect(page.locator("#definition")).toBeVisible();
    const peers = page.locator("#other-code-sets details");
    await peers.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(peers).toHaveAttribute("open", "");
    const groupStatus = peers.locator('a[href="/resources/guides/iso-20022/payment-group-status/acsp"]');
    await expect(groupStatus).toBeVisible();
    await groupStatus.click();
    await expect(page).toHaveURL(/\/payment-group-status\/acsp$/);
    await expect(page.getByRole("complementary", {name:"Source and code identity"})).toContainText("ExternalPaymentGroupStatus1Code");

    await page.goto("/services/card-services#wallets");
    const wallet = page.locator(".wallet-guide-disclosure");
    await wallet.locator("summary").click();
    await expect(wallet).toHaveAttribute("open", "");
    for (const tab of await wallet.getByRole("tab").all()) await expect(tab).toBeDisabled();
    for (const step of await wallet.locator(".wallet-setup-steps button").all()) await expect(step).toBeDisabled();
    await expect(wallet.locator(".wallet-setup-description")).toContainText("Start in Apple Wallet.");
  } finally {
    await context.close();
  }
});


test("Help application guidance opens account setup at the beginning", async ({ page }) => {
  await page.goto("/resources/help");
  await page.locator("#payments summary").filter({ hasText: "Can my business apply for a merchant account?" }).click();
  const setup = page.getByRole("link", { name: "merchant account setup", exact: true });
  await setup.scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await setup.click();
  await expect(page).toHaveURL(/\/services\/merchant-onboarding$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1);
  await page.goBack();
  await expect(page).toHaveURL(/\/resources\/help$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Help center");
});

for (const [route, fragment] of [
  ["/resources/merchant-account-setup", "#additional-mid"],
  ["/resources/shopify-gateway-integration", "#check-your-email"],
  ["/resources/woocommerce-gateway-integration", "#upload-certificate-cyberduck"],
] as const) {
  test(`guide Back navigation restores the departure position on ${route}`, async ({ page, isMobile }) => {
    await page.goto(route + fragment);
    await expect(page.locator(fragment)).toBeInViewport();
    const logo = page.getByRole("banner").getByRole("link", { name: "Etail Depot home", exact: true });
    if (!isMobile) {
      await logo.scrollIntoViewIfNeeded();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    }
    // Measure departure after the desktop logo is visible. Coordinate activation
    // prevents a second automatic scroll from changing that measured position.
    const box = await logo.boundingBox();
    expect(box).not.toBeNull();
    const before = await page.evaluate(() => window.scrollY);
    if (isMobile) await page.touchscreen.tap(box!.x + box!.width / 2, box!.y + box!.height / 2);
    else await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await expect(page).toHaveURL(`${new URL(page.url()).origin}/`);
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    await page.goBack();
    await expect(page).toHaveURL(`${new URL(page.url()).origin}${route}${fragment}`);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(before, 0);
    await page.waitForTimeout(600);
    expect(Math.abs(await page.evaluate(() => window.scrollY) - before)).toBeLessThanOrEqual(2);
    if (isMobile) await expect(page.locator(fragment)).toBeInViewport();
    else await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    await page.goForward();
    await expect(page).toHaveURL(`${new URL(page.url()).origin}/`);
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
  });
}

for (const route of ["/pricing", "/resources/merchant-account-setup"]) {
  test(`repeated Back and Forward keeps the latest reading position on ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.getByRole("banner").getByRole("link", { name: "Etail Depot home", exact: true }).click();
    await expect(page).toHaveURL(`${new URL(page.url()).origin}/`);
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    await page.goBack();
    await expect(page).toHaveURL(`${new URL(page.url()).origin}${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    // Native scrolling works in touch WebKit too, where wheel input is unsupported.
    await page.evaluate(() => window.scrollBy({ top: 650, behavior: "instant" }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
    await page.waitForTimeout(350);
    const reading = await page.evaluate(() => window.scrollY);
    await page.goForward();
    await expect(page).toHaveURL(`${new URL(page.url()).origin}/`);
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    await page.goBack();
    await expect(page).toHaveURL(`${new URL(page.url()).origin}${route}`);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(reading, 0);
    await page.waitForTimeout(500);
    expect(Math.abs(await page.evaluate(() => window.scrollY) - reading)).toBeLessThanOrEqual(2);
  });
}

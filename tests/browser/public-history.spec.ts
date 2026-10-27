import { expect, test, type Page } from "@playwright/test";

async function clickVisibleSectionLink(page: Page, fragment: string) {
  for (const link of await page.locator(`a[href="${fragment}"]`).all()) {
    if (await link.isVisible()) {
      await link.click();
      return;
    }
  }
  for (const selector of [".service-section-mobile", ".legal-document-contents-mobile"]) {
    const contents = page.locator(selector);
    if (await contents.isVisible() && await contents.locator(`a[href="${fragment}"]`).count()) {
      if (await contents.getAttribute("open") === null) await contents.locator("summary").click();
      await contents.locator(`a[href="${fragment}"]`).click();
      return;
    }
  }
  throw new Error(`No usable section link for ${fragment}`);
}

for (const [route, fragment] of [
  ["/payment-acceptance-service", "#fees"],
  ["/help", "#cards"],
  ["/privacy", "#contact"],
  ["/guides/iso-20022", "#sets-p"],
  ["/guides/iso-8583/messages", "#version-1993"],
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
    const merchant = header.getByRole("link", { name: "Merchant services", exact: true });
    await expect(merchant).toBeVisible();
    await merchant.click();
    await expect(page).toHaveURL(`${new URL(page.url()).origin}/payment-acceptance-service`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await page.goto("/payment-acceptance-service#fees");
    const amount = page.locator("#payment-amount");
    await expect(amount).toHaveValue("100");
    await expect(amount).toBeDisabled();
    await expect(page.locator("#addon-sale-records")).toHaveCount(0);
    await expect(page.locator(".fee-result")).toContainText("$3.20");
    await expect(page.locator(".fee-result")).toContainText("$96.80");

    await page.goto("/guides/iso-20022/payment-transaction-status/acsp");
    await expect(page.locator("#definition")).toBeVisible();
    const peers = page.locator("#other-code-sets details");
    await peers.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(peers).toHaveAttribute("open", "");
    const groupStatus = peers.locator('a[href="/guides/iso-20022/payment-group-status/acsp"]');
    await expect(groupStatus).toBeVisible();
    await groupStatus.click();
    await expect(page).toHaveURL(/\/payment-group-status\/acsp$/);
    await expect(page.getByRole("complementary", {name:"Source and code identity"})).toContainText("ExternalPaymentGroupStatus1Code");

    await page.goto("/credit-card-services#wallets");
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

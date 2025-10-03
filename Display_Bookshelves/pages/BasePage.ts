import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async clickIfVisible(locator: Locator) {
    if (await locator.isVisible()) {
      await locator.click();
    }
  }

  async fillInput(locator: Locator, value: string) {
    await locator.click();
    await locator.fill(value);
  }

  async pressEnter(locator: Locator) {
    await locator.press('Enter');
  }

  async waitForSeconds(seconds: number) {
    await this.page.waitForTimeout(seconds * 1000);
  }

  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() || '';
  }

  async expectVisible(locator: Locator, timeout = 5000) {
    await expect(locator).toBeVisible({ timeout });
  }

  async checkCheckbox(locator: Locator) {
    if (!(await locator.isChecked())) {
      await locator.check();
    }
  }

  async logTopProducts(productLocator: Locator, limit = 3) {
    const products = await productLocator.elementHandles();
    for (let i = 0; i < Math.min(limit, products.length); i++) {
      const nameEl = await products[i].$('h3');
      const priceEl = await products[i].$('span[data-testid="price"]');
      const name = nameEl ? await nameEl.textContent() : 'No name';
      const price = priceEl ? await priceEl.textContent() : 'No price';
      console.log(`${name?.trim()} - ${price?.trim()}`);
    }
  }
}
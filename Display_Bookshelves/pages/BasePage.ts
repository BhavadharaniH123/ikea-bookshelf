import { Page, Locator } from '@playwright/test';
import locators from '../locators/locators.json';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected getLocator(locatorDef: any): Locator {
    if (typeof locatorDef === 'string') {
      return this.page.locator(locatorDef);
    }

    switch (locatorDef.type) {
      case 'getByRole':
        return this.page.getByRole(locatorDef.role, locatorDef.options || {});
      case 'getByPlaceholder':
        return this.page.getByPlaceholder(locatorDef.text);
      case 'getByLabel':
        const labelLocator = this.page.getByLabel(locatorDef.label);
        if (locatorDef.nested) {
          return labelLocator.getByRole(locatorDef.nested.role, locatorDef.nested.options || {});
        }
        return labelLocator;
      case 'locator':
        let baseLocator = this.page.locator(locatorDef.selector);
        if (locatorDef.filter) {
          if (locatorDef.filter.hasTextList) {
            locatorDef.filter.hasTextList.forEach((text: string) => {
              baseLocator = baseLocator.filter({ hasText: text });
            });
          } else {
            baseLocator = baseLocator.filter(locatorDef.filter);
          }
        }
        if (locatorDef.first) return baseLocator.first();
        if (typeof locatorDef.nth === 'number') return baseLocator.nth(locatorDef.nth);
        return baseLocator;
      case 'xpath':
        return this.page.locator(`xpath=${locatorDef.expression}`);
      default:
        throw new Error(`Unsupported locator type: ${locatorDef.type}`);
    }
  }

  async gotoHomePage() {
    await this.page.goto('https://www.ikea.com/in/en/', { waitUntil: 'domcontentloaded' });
  }

  async acceptCookies() {
    const okButton = this.getLocator(locators.HomePage.okButton);
    if (await okButton.isVisible().catch(() => false)) {
      await okButton.click();
    }
  }
}
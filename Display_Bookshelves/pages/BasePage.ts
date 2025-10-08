import { Page } from '@playwright/test';
import locators from '../locators/locators.json';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoHomePage() {
    await this.page.goto('https://www.ikea.com/in/en/', { waitUntil: 'domcontentloaded' });
  }

  async acceptCookies() {
    const okButton = eval(`this.page.${locators.HomePage.okButton}`);
    if (await okButton.isVisible().catch(() => false)) {
      await okButton.click();
    }
  }
}
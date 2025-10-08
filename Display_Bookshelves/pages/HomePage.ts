// po.ts
import { Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoHomePage(): Promise<void> {
    await this.page.goto('https://www.ikea.com/');
  }

  async acceptCookies(): Promise<void> {
    const acceptButton = this.page.locator('button:has-text("Accept all cookies")');
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
    }
  }

  async getCollectionTabs(): Promise<string[]> {
    await this.page.hover('text=Being-At-home');
    const tabItems = this.page.locator('.submenu-class-selector'); // Replace with actual selector
    const count = await tabItems.count();
    const tabs: string[] = [];

    for (let i = 0; i < count; i++) {
      tabs.push(await tabItems.nth(i).innerText());
    }

    return tabs;
  }
}

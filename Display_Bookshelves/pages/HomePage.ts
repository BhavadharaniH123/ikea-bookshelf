import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import locators from '../locators/locators.json';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async getCollectionTabs(): Promise<string[]> {
    const tabButtons = this.getLocator(locators.HomePage.tabButtons);
    const count = await tabButtons.count();
    const tabNames: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = (await tabButtons.nth(i).innerText())?.trim() || 'Unnamed Tab';
      tabNames.push(text);
    }

    return tabNames;
  }
}